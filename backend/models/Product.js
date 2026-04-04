const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: String,
    price: Number,
    offerPrice: Number,
    image: String,
    category: String,
    stock: Number,
    description: String,
    images: [String], // Array of image URLs for multiple images
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);
