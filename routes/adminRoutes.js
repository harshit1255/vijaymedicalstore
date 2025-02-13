const express = require("express");
const adminAuth = require("../middleware/authMiddleware");
const Order = require("../models/Order");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const router = express.Router();
const adminUser = {
  email: "admin@example.com",
  password: bcrypt.hashSync("admin123", 10), // Hash password for security
};
// Protected route to get all orders
router.get("/orders", adminAuth, async (req, res) => {
  try {
    const orders = await Order.find();
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
});

// Mark order as delivered
router.put("/orders/:id/deliver", adminAuth, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    order.status = "Delivered";
    await order.save();
    res.json({ message: "Order marked as delivered" });
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
});

// Admin Login Route
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (
    email !== adminUser.email ||
    !bcrypt.compareSync(password, adminUser.password)
  ) {
    return res.status(401).json({ message: "Invalid Credentials" });
  }

  const token = jwt.sign({ email, isAdmin: true }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });

  res.json({ token });
});
module.exports = router;
