const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('../models/User');

async function createOrResetAdmin() {
  const email = typeof process.env.ADMIN_EMAIL === 'string'
    ? process.env.ADMIN_EMAIL.trim().toLowerCase()
    : '';
  const password = typeof process.env.ADMIN_PASSWORD === 'string'
    ? process.env.ADMIN_PASSWORD
    : '';
  const name = typeof process.env.ADMIN_NAME === 'string' && process.env.ADMIN_NAME.trim()
    ? process.env.ADMIN_NAME.trim()
    : 'Store Admin';

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new Error('Set a valid ADMIN_EMAIL in the ignored backend/.env file.');
  }
  if (password.length < 12 || password.length > 128) {
    throw new Error('ADMIN_PASSWORD must be between 12 and 128 characters.');
  }
  if (!process.env.MONGO_URI) {
    throw new Error('Set MONGO_URI in backend/.env before provisioning an admin.');
  }

  await mongoose.connect(process.env.MONGO_URI);
  const hashedPassword = await bcrypt.hash(password, 12);
  const existingUser = await User.findOne({ email });

  if (existingUser) {
    existingUser.name = name;
    existingUser.password = hashedPassword;
    existingUser.role = 'admin';
    await existingUser.save();
  } else {
    await User.create({
      name,
      email,
      password: hashedPassword,
      role: 'admin'
    });
  }

  console.log(`Admin account configured for ${email}. Password was not printed.`);
}

createOrResetAdmin()
  .catch((error) => {
    console.error(`Admin provisioning failed: ${error.message}`);
    process.exitCode = 1;
  })
  .finally(async () => {
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
    }
  });
