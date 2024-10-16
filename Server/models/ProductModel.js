const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
    },
    amount: {
      type: Number,
      required: [true, "Amount is required"],
      min: [0, "Amount cannot be negative"],
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      enum: ["Furniture", "Electronics", "Clothing", "Books", "Toys", "Other"],
    },
    payment: {
      type: String,
      required: [true, "Payment method is required"],
      enum: ["Credit Card", "Debit Card", "PayPal", "Cash", "Other"],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", productSchema);
module.exports = Product;
