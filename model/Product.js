


import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  productId: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },

  name: {
    type: String,
    required: true,
    trim: true,
  },

  altName: {
    type: [String],
    default: [],
  },

  description: {
    type: String,
    required: true,
  },

  price: {
    type: Number,
    required: true,
  },

  labelledPrice: {
    type: Number,
  },

  category: {
    type: String,
    required: true,
  },

  brand: {
    type: String,
    required: true,
  },

  stock: {
    type: Number,
    default: 0,
  },

  isAvailable: {
    type: Boolean,
    default: true,
  },

  // ⭐ NOW SUPPORT MULTIPLE IMAGES
  imageUrls: {
    type: [String],
    default: true,
  },
});

const Product = mongoose.model("Product", productSchema);

export default Product;


