const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const User = require("./models/User");

async function testPassword() {
  try {
    await mongoose.connect("mongodb://localhost:27017/grocery_db");
    console.log("Connected to MongoDB");

    const adminUser = await User.findOne({ email: "admin@grocerymart.com" });
    if (!adminUser) {
      console.log("Admin user not found");
      return;
    }

    console.log("Admin user found:", adminUser.email);
    console.log("Stored password hash:", adminUser.password);

    // Test password comparison
    const testPassword = "admin123";
    const isValid = await bcrypt.compare(testPassword, adminUser.password);
    console.log(`Password 'admin123' matches:`, isValid);

    // Test wrong password
    const wrongPassword = "wrong123";
    const isWrong = await bcrypt.compare(wrongPassword, adminUser.password);
    console.log(`Password 'wrong123' matches:`, isWrong);

    await mongoose.disconnect();
  } catch (error) {
    console.error("Error:", error);
  }
}

testPassword();
