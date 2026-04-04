const mongoose = require("mongoose");
const User = require("./models/User");

async function checkAdmin() {
  try {
    await mongoose.connect("mongodb://localhost:27017/grocery_db");
    console.log("Connected to MongoDB");

    const adminUser = await User.findOne({ email: "admin@grocerymart.com" });
    if (adminUser) {
      console.log("Admin user found:", {
        name: adminUser.name,
        email: adminUser.email,
        role: adminUser.role,
        passwordHash: adminUser.password.substring(0, 20) + "...",
      });
    } else {
      console.log("Admin user not found");
    }

    const allUsers = await User.find({}, "name email role");
    console.log("All users:", allUsers);

    await mongoose.disconnect();
  } catch (error) {
    console.error("Error:", error);
  }
}

checkAdmin();
