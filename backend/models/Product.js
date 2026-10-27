const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
      minlength: [2, "Product name must contain at least 2 characters"],
      maxlength: [120, "Product name cannot exceed 120 characters"]
    },
    price: {
      type: Number,
      required: [true, "Product price is required"],
      min: [0, "Product price cannot be negative"]
    },
    offerPrice: {
      type: Number,
      min: [0, "Offer price cannot be negative"],
      validate: {
        validator(value) {
          return value == null || !Number.isFinite(this.price) || value <= this.price;
        },
        message: "Offer price cannot exceed the regular price"
      }
    },
    image: {
      type: String,
      required: [true, "Product image is required"],
      trim: true
    },
    category: {
      type: String,
      required: [true, "Product category is required"],
      trim: true,
      lowercase: true,
      maxlength: [60, "Category cannot exceed 60 characters"]
    },
    stock: {
      type: Number,
      required: [true, "Stock quantity is required"],
      min: [0, "Stock cannot be negative"],
      validate: {
        validator: Number.isInteger,
        message: "Stock must be a whole number"
      }
    },
    description: {
      type: String,
      required: [true, "Product description is required"],
      trim: true,
      maxlength: [1000, "Description cannot exceed 1000 characters"]
    },
    images: {
      type: [String],
      default: []
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);
