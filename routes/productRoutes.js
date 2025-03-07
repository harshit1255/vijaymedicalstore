const express = require("express");
const Product = require("../models/Product");

const router = express.Router();

// Add a new product
router.post("/add", async (req, res) => {
  try {
    const { name, pack, price } = req.body;

    const newProduct = new Product({ name, pack, price });
    await newProduct.save();

    res
      .status(201)
      .json({ message: "Product added successfully", product: newProduct });
  } catch (error) {
    res.status(500).json({ message: "Error adding product", error });
  }
});

// Get all products
router.get("/", async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Error fetching products", error });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);
    if (!deletedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting product", error });
  }
});

// ✅ Get Products with Pagination
router.get("/paginated", async (req, res) => {
  try {
    let { page = 1, limit = 10 } = req.query;
    page = parseInt(page);
    limit = parseInt(limit);

    const products = await Product.find()
      .sort({ name: 1 }) // Sort alphabetically
      .skip((page - 1) * limit)
      .limit(limit);

    const totalProducts = await Product.countDocuments();
    const totalPages = Math.ceil(totalProducts / limit);

    res.json({
      page,
      limit,
      totalProducts,
      totalPages,
      products,
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching products", error });
  }
});

module.exports = router;
