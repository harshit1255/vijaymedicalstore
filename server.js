const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const Product = require("./models/Product");

const app = express();

// Middleware
app.use(bodyParser.json());

// Connect to MongoDB
mongoose
  .connect("mongodb://localhost:27017/productsdb", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error(err));

// Create a product (for testing)
// app.post("/api/products", async (req, res) => {
//   try {
//     const { name, price } = req.body;
//     const product = new Product({ name, price });
//     await product.save();
//     res.status(201).json(product);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// Get products with pagination and text search
// app.get("/api/products", async (req, res) => {
//   try {
//     const { search = "", page = 1, limit = 10 } = req.query;

//     // Convert page and limit to numbers
//     const pageNumber = parseInt(page);
//     const pageSize = parseInt(limit);

//     // Create a text search filter if a search term is provided
//     const filter = search ? { $text: { $search: search } } : {};

//     // Get paginated results
//     const products = await Product.find(filter)
//       .skip((pageNumber - 1) * pageSize)
//       .limit(pageSize);

//     // Get the total count of documents matching the filter
//     const totalCount = await Product.countDocuments(filter);

//     res.json({
//       products,
//       totalPages: Math.ceil(totalCount / pageSize),
//       currentPage: pageNumber,
//       totalCount,
//     });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

app.get("/api/products", async (req, res) => {
  try {
    const { search = "", page = 1, limit = 10 } = req.query;

    // Convert page and limit to numbers
    const pageNumber = parseInt(page);
    const pageSize = parseInt(limit);

    // Use a regex filter for partial matching
    const filter = search
      ? { name: { $regex: search, $options: "i" } } // "i" for case-insensitive
      : {};

    // Get paginated results
    const products = await Product.find(filter)
      .skip((pageNumber - 1) * pageSize)
      .limit(pageSize);

    // Get the total count of documents matching the filter
    const totalCount = await Product.countDocuments(filter);

    res.json({
      products,
      totalPages: Math.ceil(totalCount / pageSize),
      currentPage: pageNumber,
      totalCount,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Fetch all products without pagination
app.get("/api/products/all", async (req, res) => {
  try {
    const { search = "" } = req.query;

    // Use a regex filter for partial matching
    const filter = search
      ? { name: { $regex: search, $options: "i" } } // "i" for case-insensitive
      : {};

    // Fetch all matching products
    const products = await Product.find(filter);

    res.json({
      products,
      totalCount: products.length, // Total number of products returned
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Start the server
const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
