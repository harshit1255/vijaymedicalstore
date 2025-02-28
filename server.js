// require("dotenv").config();
// const express = require("express");
// const mongoose = require("mongoose");
// const bodyParser = require("body-parser");
// const Product = require("./models/Product");
// const cors = require("cors");
// const app = express();

// // Middleware
// app.use(
//   cors({
//     origin: [
//       "https://vijaymedicalstore.netlify.app",
//       "http://localhost:5173",
//       "http://192.168.29.64:5173",
//     ], // Allows all origins (CHANGE THIS IF NEEDED)
//     methods: "GET,POST,PUT,DELETE,OPTIONS",
//     allowedHeaders: "Content-Type,Authorization",
//     credentials: true, // Allow cookies/auth headers
//   })
// );
// app.options("*", cors());
// app.use(bodyParser.json());

// // Connect to MongoDB
// mongoose
//   .connect(process.env.MONGO_URI, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//   })
//   .then(() => console.log("MongoDB connected"))
//   .catch((err) => console.error(err));

// const adminRoutes = require("./routes/adminRoutes");
// const orderRoutes = require("./routes/orderRoutes");
// const productRoutes = require("./routes/productRoutes");

// app.use("/api/products", productRoutes);

// app.use("/admin", adminRoutes);
// app.use("/orders", orderRoutes);

// // Start the server
// const PORT = 5000;
// app.listen(process.env.PORT, () =>
//   console.log(`Server running on port ${PORT}`)
// );

require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const multer = require("multer");

const adminRoutes = require("./routes/adminRoutes");
const orderRoutes = require("./routes/orderRoutes");
const productRoutes = require("./routes/productRoutes");

const app = express();

// ✅ CORS Middleware
app.use(
  cors({
    origin: [
      "https://vijaymedicalstore.netlify.app",
      "http://localhost:5173",
      "http://192.168.29.64:5173",
    ],
    methods: "GET,POST,PUT,DELETE,OPTIONS",
    allowedHeaders: "Content-Type,Authorization",
    credentials: true,
  })
);

// ✅ Serve Uploaded Images
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ✅ Multer Setup (Handles Image Uploads)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

// ✅ Middleware Order (Multer before JSON Parsing)
app.use(express.urlencoded({ extended: true })); // ✅ Parses form-data
app.use(express.json()); // ✅ Parses JSON payloads

// ✅ MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// ✅ Routes
app.use("/api/products", productRoutes);
app.use("/admin", adminRoutes);
app.use("/orders", orderRoutes);

// ✅ Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
