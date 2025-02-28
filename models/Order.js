// const mongoose = require("mongoose");

// const OrderSchema = new mongoose.Schema(
//   {
//     name: String,
//     address: String,
//     phoneNumber: String,
//     village: String,
//     products: [
//       {
//         name: String,
//         quantity: Number,
//         price: Number,
//       },
//     ],
//     totalAmount: Number, // Total calculated separately
//     status: { type: String, default: "Pending" },
//   },
//   { timestamps: true }
// );

// module.exports = mongoose.model("Order", OrderSchema);

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
    ], // ✅ Optional: Only for cart-based orders
    totalAmount: Number, // ✅ Optional: Only for cart-based orders
    imageUrl: { type: String }, // ✅ Optional: Only for image-based orders
    status: { type: String, default: "Pending" },
    orderType: { type: String, enum: ["cart", "image"], required: true }, // ✅ Identify order type
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", OrderSchema);
