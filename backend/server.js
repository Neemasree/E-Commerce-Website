const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32) {
  throw new Error("JWT_SECRET must be configured with at least 32 characters.");
}

const app = express();
const allowedOrigins = (process.env.CORS_ORIGINS || "http://localhost:5173,http://127.0.0.1:5173")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(cors({
  origin(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error("Origin not allowed by CORS"));
  }
}));
app.use(express.json({ limit: '20kb' }));

// Middleware for authentication
const { authenticateToken, requireAdmin } = require("./middleware/auth");
const User = require("./models/User");
const Order = require("./models/Order");



// Auth routes
app.post("/api/auth/register", async (req, res) => {
  const name = typeof req.body?.name === "string" ? req.body.name.trim() : "";
  const email = typeof req.body?.email === "string" ? req.body.email.trim().toLowerCase() : "";
  const password = typeof req.body?.password === "string" ? req.body.password : "";

  if (name.length < 2 || name.length > 80) {
    return res.status(400).json({ message: "Name must be between 2 and 80 characters" });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254) {
    return res.status(400).json({ message: "Enter a valid email address" });
  }
  if (password.length < 8 || password.length > 128) {
    return res.status(400).json({ message: "Password must be between 8 and 128 characters" });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "An account with this email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const user = await User.create({ name, email, password: hashedPassword });
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "12h" });

    return res.status(201).json({
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role }
    });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ message: "An account with this email already exists" });
    }
    console.error("Registration failed:", err);
    return res.status(500).json({ message: "Unable to register account" });
  }
});

app.post("/api/auth/login", async (req, res) => {
  const email = typeof req.body?.email === "string" ? req.body.email.trim().toLowerCase() : "";
  const password = typeof req.body?.password === "string" ? req.body.password : "";

  if (!email || !password || password.length > 128) {
    return res.status(400).json({ message: "Invalid credentials" });
  }

  try {
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "12h" });
    return res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (err) {
    console.error("Login failed:", err);
    return res.status(500).json({ message: "Unable to log in" });
  }
});

// Order and inventory endpoints are defined in a dedicated router.
const productRoutes = require("./routes/ProductRoutes");
const orderRoutes = require("./routes/orderRoutes");
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);

// Admin order listing is protected by both JWT authentication and role authorization.
app.get("/api/admin/orders", authenticateToken, requireAdmin, async (req, res) => {
  try {
    const orders = await Order.find().populate("user", "name email").sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    console.error("Admin order listing failed:", error);
    res.status(500).json({ message: "Unable to fetch admin orders" });
  }
});


// Image proxy removed: arbitrary URL fetching enabled SSRF against internal services.

// Readiness endpoint for deployment health checks.
app.get("/health", (req, res) => {
  const databaseReady = mongoose.connection.readyState === 1;
  return res.status(databaseReady ? 200 : 503).json({
    status: databaseReady ? "ok" : "not_ready",
    database: databaseReady ? "connected" : "disconnected"
  });
});

// Test route
app.get("/", (req, res) => {
  res.send("Grocery Backend Running");
});

const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    await mongoose.connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/grocery_db");
    console.log("MongoDB Connected");

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Server startup failed because MongoDB could not connect:", error.message);
    process.exitCode = 1;
  }
}

startServer();
