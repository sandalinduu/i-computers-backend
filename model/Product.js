import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
    {
        // Unique Product ID you define (not the MongoDB _id)
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

    // Alternative names (array of strings)
    altName: {
      type: [String], // e.g., ["Laptop", "Notebook", "Portable PC"]
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

    // Old / label price (optional)
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
    }
)

const Product = mongoose.model("Product", productSchema);

export default Product;