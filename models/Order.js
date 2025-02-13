const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema(
  {
    name: String,
    address: String,
    phoneNumber: String,
    village: String,
    products: [
      {
        name: String,
        quantity: Number,
        price: Number,
      },
    ],
    totalAmount: Number, // Total calculated separately
    status: { type: String, default: "Pending" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", OrderSchema);
