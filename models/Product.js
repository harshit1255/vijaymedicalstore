const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
});

// Enable text search on the `name` field
productSchema.index({ name: "text" });

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
