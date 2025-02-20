const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  pack: { type: String, required: false }, // Changed from Number to String
  price: { type: Number, required: true },
});

module.exports = mongoose.model("Product", productSchema);
