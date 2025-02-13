const express = require("express");
const router = express.Router();
const Order = require("../models/Order");

// Save Order
router.post("/", async (req, res) => {
  try {
    const { name, address, phoneNumber, village, products, totalAmount } =
      req.body;

    const newOrder = new Order({
      name,
      address,
      phoneNumber,
      village,
      products,
      totalAmount,
    });

    await newOrder.save();
    res
      .status(201)
      .json({ message: "Order placed successfully", order: newOrder });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get All Orders
router.get("/", async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Mark Order as Delivered
router.put("/:id", async (req, res) => {
  try {
    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      { status: "Delivered" },
      { new: true }
    );
    res.json(updatedOrder);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
