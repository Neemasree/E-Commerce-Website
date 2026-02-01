const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const User = require("./models/User");

async function recreateAdmin() {
  try {
    await mongoose.connect("mongodb://localhost:27017/grocery_db");
    console.log("Connected to MongoDB");

    // Delete existing admin user
    await User.deleteOne({ email: "admin@grocerymart.com" });
    console.log("Deleted existing admin user");

    // Create new admin user with correct password
    const hashedPassword = await bcrypt.hash("admin123", 10);
    const adminUser = new User({
      name: "admin",
      email: "admin@grocerymart.com",
      password: hashedPassword,
      role: "admin",
    });

    await adminUser.save();
    console.log("Created new admin user with password: admin123");

    // Verify the password works
    const testUser = await User.findOne({ email: "admin@grocerymart.com" });
    const isValid = await bcrypt.compare("admin123", testUser.password);
    console.log("Password verification test:", isValid);

    await mongoose.disconnect();
    console.log("Admin user recreated successfully");
  } catch (error) {
    console.error("Error:", error);
  }
}

recreateAdmin();
