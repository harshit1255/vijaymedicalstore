require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const Product = require("./models/Product");
const cors = require("cors");
const app = express();

// Middleware
app.use(cors());
app.options("*", cors());
app.use(bodyParser.json());

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error(err));

const adminRoutes = require("./routes/adminRoutes");
const orderRoutes = require("./routes/orderRoutes");
const productRoutes = require("./routes/productRoutes");

app.use("/api/products", productRoutes);

app.use("/admin", adminRoutes);
app.use("/orders", orderRoutes);

// Start the server
const PORT = 5000;
app.listen(process.env.PORT, () =>
  console.log(`Server running on port ${PORT}`)
);
