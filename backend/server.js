const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB connection and auto-seed
mongoose
  .connect(process.env.MONGO_URI || "mongodb://localhost:27017/grocery_db")
  .then(async () => {
    console.log("MongoDB Connected");
    await initializeDatabase();
  })
  .catch(err => console.error(err));

// Auto-initialize database with products
const initializeDatabase = async () => {
  try {
    const Product = require('./models/Product');
    const productCount = await Product.countDocuments();
    
    if (productCount === 0) {
      console.log('Initializing database with products...');
      
      const products = [
        // Vegetables
        { name: 'Fresh Tomatoes', price: 40, offerPrice: 35, image: 'https://media.istockphoto.com/id/1095798054/photo/fresh-tomatoes-in-a-box.webp?a=1&b=1&s=612x612&w=0&k=20&c=UVnVRQ0TfdTL4Y_E5HVhpAJUxk4oZ1r9ny8atZbm-D8=', stock: 100, description: 'Fresh juicy tomatoes', category: 'vegetables', images: ['https://images.unsplash.com/photo-1546470427-227e5f3a8f93?w=400&h=400&fit=crop'] },
        { name: 'Organic Carrots', price: 30, offerPrice: 25, image: 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=400&h=400&fit=crop', stock: 80, description: 'Organic carrots', category: 'vegetables', images: ['https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=400&h=400&fit=crop'] },
        { name: 'Fresh Spinach', price: 25, offerPrice: 20, image: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=400&h=400&fit=crop', stock: 60, description: 'Fresh spinach leaves', category: 'vegetables', images: ['https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=400&h=400&fit=crop'] },
        { name: 'Bell Peppers', price: 60, offerPrice: 50, image: 'https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?w=400&h=400&fit=crop', stock: 45, description: 'Colorful bell peppers', category: 'vegetables', images: ['https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?w=400&h=400&fit=crop'] },
        { name: 'Fresh Broccoli', price: 80, offerPrice: 70, image: 'https://images.unsplash.com/photo-1459411621453-7b03977f4bfc?w=400&h=400&fit=crop', stock: 35, description: 'Fresh broccoli', category: 'vegetables', images: ['https://images.unsplash.com/photo-1459411621453-7b03977f4bfc?w=400&h=400&fit=crop'] },
        { name: 'Red Onions', price: 35, offerPrice: 30, image: 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=400&h=400&fit=crop', stock: 90, description: 'Fresh red onions', category: 'vegetables', images: ['https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=400&h=400&fit=crop'] },
        
        // Dairy
        { name: 'Fresh Milk', price: 60, offerPrice: 55, image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400&h=400&fit=crop', stock: 50, description: 'Fresh whole milk', category: 'dairy', images: ['https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400&h=400&fit=crop'] },
        { name: 'Greek Yogurt', price: 120, offerPrice: 100, image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400&h=400&fit=crop', stock: 30, description: 'Creamy Greek yogurt', category: 'dairy', images: ['https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400&h=400&fit=crop'] },
        { name: 'Cheddar Cheese', price: 200, offerPrice: 180, image: 'https://images.unsplash.com/photo-1452195100486-9cc805987862?w=400&h=400&fit=crop', stock: 25, description: 'Aged cheddar cheese', category: 'dairy', images: ['https://images.unsplash.com/photo-1452195100486-9cc805987862?w=400&h=400&fit=crop'] },
        { name: 'Fresh Butter', price: 150, offerPrice: 140, image: 'https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?w=400&h=400&fit=crop', stock: 40, description: 'Creamy fresh butter', category: 'dairy', images: ['https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?w=400&h=400&fit=crop'] },
        { name: 'Cottage Cheese', price: 80, offerPrice: 75, image: 'https://images.unsplash.com/photo-1628088062854-d1870b4553da?w=400&h=400&fit=crop', stock: 35, description: 'Fresh cottage cheese', category: 'dairy', images: ['https://images.unsplash.com/photo-1628088062854-d1870b4553da?w=400&h=400&fit=crop'] },
        { name: 'Paneer', price: 180, offerPrice: 160, image: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=400&h=400&fit=crop', stock: 30, description: 'Fresh paneer', category: 'dairy', images: ['https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=400&h=400&fit=crop'] },
        
        // Fruits
        { name: 'Fresh Apples', price: 120, offerPrice: 100, image: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=400&h=400&fit=crop', stock: 70, description: 'Crisp fresh apples', category: 'fruits', images: ['https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=400&h=400&fit=crop'] },
        { name: 'Ripe Bananas', price: 50, offerPrice: 45, image: 'https://images.unsplash.com/photo-1603833665858-e61d17a86224?w=400&h=400&fit=crop', stock: 85, description: 'Sweet ripe bananas', category: 'fruits', images: ['https://images.unsplash.com/photo-1603833665858-e61d17a86224?w=400&h=400&fit=crop'] },
        { name: 'Fresh Oranges', price: 80, offerPrice: 70, image: 'https://images.unsplash.com/photo-1547514701-42782101795e?w=400&h=400&fit=crop', stock: 60, description: 'Juicy oranges', category: 'fruits', images: ['https://images.unsplash.com/photo-1547514701-42782101795e?w=400&h=400&fit=crop'] },
        { name: 'Sweet Mangoes', price: 150, offerPrice: 130, image: 'https://images.unsplash.com/photo-1601493700631-2b16ec4b4716?w=400&h=400&fit=crop', stock: 40, description: 'Sweet mangoes', category: 'fruits', images: ['https://images.unsplash.com/photo-1601493700631-2b16ec4b4716?w=400&h=400&fit=crop'] },
        { name: 'Fresh Grapes', price: 90, offerPrice: 80, image: 'https://media.istockphoto.com/id/171151560/photo/black-grapes.webp?a=1&b=1&s=612x612&w=0&k=20&c=ZJ3Q_A-S9DsiGgw_4fvIgaAcDVzFoEnY5VNmd3xh6zg=', stock: 55, description: 'Sweet grapes', category: 'fruits', images: ['https://images.unsplash.com/photo-1599819177818-6f7c2e1d6e3b?w=400&h=400&fit=crop'] },
        { name: 'Strawberries', price: 200, offerPrice: 180, image: 'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=400&h=400&fit=crop', stock: 35, description: 'Fresh strawberries', category: 'fruits', images: ['https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=400&h=400&fit=crop'] },
        
        // Beverages
        { name: 'Orange Juice', price: 80, offerPrice: 70, image: 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=400&h=400&fit=crop', stock: 50, description: 'Fresh orange juice', category: 'beverages', images: ['https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=400&h=400&fit=crop'] },
        { name: 'Apple Juice', price: 75, offerPrice: 65, image: 'https://media.istockphoto.com/id/1799497395/photo/apple-juice.webp?a=1&b=1&s=612x612&w=0&k=20&c=eq07sibK2A-_z4qM5nIqTRK59CCMXlv1YfpwPA1L3TY=', stock: 45, description: 'Fresh apple juice', category: 'beverages', images: ['https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=400&h=400&fit=crop'] },
        { name: 'Coconut Water', price: 50, offerPrice: 45, image: 'https://plus.unsplash.com/premium_photo-1726718479272-10d3a9670cd3?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8Y29jb251dCUyMHdhdGVyfGVufDB8fDB8fHww', stock: 60, description: 'Natural coconut water', category: 'beverages', images: ['https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400&h=400&fit=crop'] },
        { name: 'Green Tea', price: 120, offerPrice: 110, image: 'https://plus.unsplash.com/premium_photo-1694540110881-84add98c0a75?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8Z3JlZW4lMjB0ZWF8ZW58MHx8MHx8fDA%3D', stock: 70, description: 'Premium green tea', category: 'beverages', images: ['https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9?w=400&h=400&fit=crop'] },
        { name: 'Coffee Beans', price: 300, offerPrice: 280, image: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=400&h=400&fit=crop', stock: 50, description: 'Roasted coffee beans', category: 'beverages', images: ['https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=400&h=400&fit=crop'] },
        { name: 'Mineral Water', price: 20, offerPrice: 18, image: 'https://images.unsplash.com/photo-1548839140-29a749e1cf4d?w=400&h=400&fit=crop', stock: 100, description: 'Pure mineral water', category: 'beverages', images: ['https://images.unsplash.com/photo-1548839140-29a749e1cf4d?w=400&h=400&fit=crop'] },
        
        // Grains
        { name: 'Basmati Rice', price: 200, offerPrice: 180, image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&h=400&fit=crop', stock: 100, description: 'Premium basmati rice', category: 'grains', images: ['https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&h=400&fit=crop'] },
        { name: 'Whole Wheat Flour', price: 80, offerPrice: 75, image: 'https://media.istockphoto.com/id/162603261/photo/7-grain-whole-wheat-berries-grounded-into-a-fine-powder.webp?a=1&b=1&s=612x612&w=0&k=20&c=j2j7WgznZkIJDxP82oa4JFpTdlA79UW_ogkwYoFwfZY=', stock: 80, description: 'Whole wheat flour', category: 'grains', images: ['https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400&h=400&fit=crop'] },
        { name: 'Oats', price: 120, offerPrice: 110, image: 'https://images.unsplash.com/photo-1614961233913-a5113a4a34ed?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8b2F0c3xlbnwwfHwwfHx8MA%3D%3D', stock: 60, description: 'Rolled oats', category: 'grains', images: ['https://images.unsplash.com/photo-1574635542104-830a7c7c9e9d?w=400&h=400&fit=crop'] },
        { name: 'Quinoa', price: 300, offerPrice: 280, image: 'https://media.istockphoto.com/id/1298922591/photo/cooked-quinoa-in-a-cast-iron-pan-on-rustic-wooden-table.webp?a=1&b=1&s=612x612&w=0&k=20&c=dufs_his63vnRRy0_9V-pxubhN8hsnqtmRalEdSIHrI=', stock: 40, description: 'Organic quinoa', category: 'grains', images: ['https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&h=400&fit=crop'] },
        { name: 'Corn Flakes', price: 150, offerPrice: 140, image: 'https://images.unsplash.com/photo-1621939514649-280e2ee25f60?w=400&h=400&fit=crop', stock: 60, description: 'Crispy corn flakes', category: 'grains', images: ['https://images.unsplash.com/photo-1621939514649-280e2ee25f60?w=400&h=400&fit=crop'] },
        { name: 'Pasta', price: 120, offerPrice: 110, image: 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cGFzdGF8ZW58MHx8MHx8fDA%3D', stock: 70, description: 'Durum wheat pasta', category: 'grains', images: ['https://images.unsplash.com/photo-1551462147-37bd170650dc?w=400&h=400&fit=crop'] }
      ];
      
      await Product.insertMany(products);
      console.log(`✅ Database initialized with ${products.length} products`);
      
      // Create admin user if doesn't exist
      const User = require('./models/User');
      const bcrypt = require('bcryptjs');
      
      const adminExists = await User.findOne({ email: 'admin@grocerymart.com' });
      if (!adminExists) {
        const hashedPassword = await bcrypt.hash('admin123', 10);
        await User.create({
          name: 'Admin',
          email: 'admin@grocerymart.com',
          password: hashedPassword,
          role: 'admin'
        });
        console.log('✅ Admin user created: admin@grocerymart.com / admin123');
      }
      
      // Create demo user if doesn't exist
      const demoExists = await User.findOne({ email: 'demo@grocerymart.com' });
      if (!demoExists) {
        const hashedPassword = await bcrypt.hash('demo123', 10);
        await User.create({
          name: 'Demo User',
          email: 'demo@grocerymart.com',
          password: hashedPassword,
          role: 'user'
        });
        console.log('✅ Demo user created: demo@grocerymart.com / demo123');
      }
    } else {
      console.log(`✅ Database already has ${productCount} products`);
    }
  } catch (error) {
    console.error('Database initialization error:', error);
  }
};

// Models
const User = require("./models/User");
const Order = require("./models/Order");

// Middleware for authentication
const authenticateToken = (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");
  if (!token) return res.status(401).json({ message: "Access denied" });

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET || "secretkey");
    req.user = verified;
    next();
  } catch (err) {
    res.status(400).json({ message: "Invalid token" });
  }
};

// Auth routes
app.post("/api/auth/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashedPassword });
    
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET || "secretkey");
    res.status(201).json({ 
      token, 
      user: { id: user._id, name: user.name, email: user.email, role: user.role } 
    });
  } catch (err) {
    res.status(400).json({ message: "Registration failed" });
  }
});

app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET || "secretkey");
    res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (err) {
    res.status(500).json({ message: "Login failed" });
  }
});

// Order routes
app.post("/api/orders", authenticateToken, async (req, res) => {
  try {
    const { items, total, address, paymentMethod } = req.body;
    
    // Update stock for each item
    const Product = require('./models/Product');
    for (const item of items) {
      await Product.findByIdAndUpdate(
        item.product,
        { $inc: { stock: -item.quantity } },
        { new: true }
      );
    }
    
    const order = await Order.create({ 
      user: req.user.id, 
      items, 
      total, 
      address,
      paymentMethod: paymentMethod || 'cod'
    });
    
    res.status(201).json(order);
  } catch (err) {
    console.error('Order creation error:', err);
    res.status(500).json({ message: "Order creation failed" });
  }
});

app.get("/api/orders", authenticateToken, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id }).populate("items.product");
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch orders" });
  }
});

// Admin: Get all orders
app.get("/api/admin/orders", authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: "Admin access required" });
    }
    const orders = await Order.find().populate("user", "name email").sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch orders" });
  }
});

// Routes
const productRoutes = require("./routes/productRoutes");
app.use("/api/products", productRoutes);

// Image proxy route to handle CORS issues
app.get("/api/proxy-image", async (req, res) => {
  try {
    const { url } = req.query;
    if (!url) {
      return res.status(400).json({ message: "Image URL required" });
    }

    const https = require('https');
    const http = require('http');
    const protocol = url.startsWith('https') ? https : http;

    protocol.get(url, (imageResponse) => {
      // Set CORS headers to prevent ORB blocking
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Access-Control-Allow-Methods', 'GET');
      res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
      res.setHeader('Content-Type', imageResponse.headers['content-type'] || 'image/jpeg');
      res.setHeader('Cache-Control', 'public, max-age=31536000');
      
      // Pipe the image data to response
      imageResponse.pipe(res);
    }).on('error', (err) => {
      console.error('Error fetching image:', err);
      res.status(500).json({ message: "Failed to fetch image" });
    });
  } catch (error) {
    console.error('Proxy error:', error);
    res.status(500).json({ message: "Proxy error" });
  }
});

// Test route
app.get("/", (req, res) => {
  res.send("Grocery Backend Running");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});