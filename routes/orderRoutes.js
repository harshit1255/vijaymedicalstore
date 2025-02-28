// const express = require("express");
// const router = express.Router();
// const Order = require("../models/Order");

// // Save Order
// router.post("/", async (req, res) => {
//   try {
//     const { name, address, phoneNumber, village, products, totalAmount } =
//       req.body;
//     console.log(req.body);
//     const newOrder = new Order({
//       name,
//       address,
//       phoneNumber,
//       village,
//       products,
//       totalAmount,
//     });

//     await newOrder.save();
//     res
//       .status(201)
//       .json({ message: "Order placed successfully", order: newOrder });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// // Get All Orders
// router.get("/", async (req, res) => {
//   try {
//     const orders = await Order.find().sort({ createdAt: -1 });
//     res.json(orders);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// // Mark Order as Delivered
// router.put("/:id", async (req, res) => {
//   try {
//     const updatedOrder = await Order.findByIdAndUpdate(
//       req.params.id,
//       { status: "Delivered" },
//       { new: true }
//     );
//     res.json(updatedOrder);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// // Delete Order
// router.delete("/:id", async (req, res) => {
//   try {
//     const deletedOrder = await Order.findByIdAndDelete(req.params.id);
//     if (!deletedOrder) {
//       return res.status(404).json({ message: "Order not found" });
//     }
//     res.json({ message: "Order deleted successfully" });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// module.exports = router;

const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const Order = require("../models/Order");

// ✅ Configure Multer for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // ✅ Save images in "uploads" folder
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // ✅ Rename file with timestamp
  },
});

const upload = multer({ storage });

// ✅ Save Order (Handles Both Cart & Image Orders)
router.post("/", upload.single("image"), async (req, res) => {
  try {
    // console.log(req.file);
    // console.log("🔹 Request Body:", req.body);
    // console.log("📷 Uploaded File:", req.file);

    const {
      name,
      address,
      phoneNumber,
      village,
      products,
      totalAmount,
      orderType,
    } = req.body;
    // console.log(products);
    if (!orderType) {
      return res.status(400).json({ message: "Order type is required" });
    }

    let orderData = {
      name,
      address,
      phoneNumber,
      village,
      products,
      status: "Pending",
      orderType,
    };

    if (orderType === "image") {
      if (!req.file) {
        return res
          .status(400)
          .json({ message: "Image is required for image-based orders" });
      }
      orderData.imageUrl = `/uploads/${req.file.filename}`;
    } else if (orderType === "cart") {
      // orderData.products = JSON.parse(products); // ✅ Parse products from string
      // orderData.products = products;
      orderData.totalAmount = parseFloat(totalAmount);
    }

    const newOrder = new Order(orderData);
    await newOrder.save();

    res
      .status(201)
      .json({ message: "Order placed successfully!", order: newOrder });
  } catch (error) {
    console.error("❌ Error Saving Order:", error);
    res.status(500).json({ error: error.message });
  }
});

// ✅ Get All Orders
router.get("/", async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });

    // ✅ Convert image URLs to full URLs (backend domain + path)
    const updatedOrders = orders.map((order) => ({
      ...order._doc, // ✅ Spread order data
      imageUrl: order.imageUrl
        ? `${process.env.BASE_URL}${order.imageUrl}`
        : null,
    }));

    // console.log(updatedOrders); // ✅ Debugging
    res.json(updatedOrders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ✅ Mark Order as Delivered
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

// ✅ Delete Order
// router.delete("/:id", async (req, res) => {
//   try {
//     const deletedOrder = await Order.findByIdAndDelete(req.params.id);
//     if (!deletedOrder) {
//       return res.status(404).json({ message: "Order not found" });
//     }
//     res.json({ message: "Order deleted successfully" });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });
router.delete("/:id", async (req, res) => {
  try {
    const deletedOrder = await Order.findByIdAndDelete(req.params.id);

    if (!deletedOrder) {
      return res.status(404).json({ message: "Order not found" });
    }

    // ✅ Check if order has an image and delete it from uploads/
    if (deletedOrder.imageUrl) {
      const imagePath = path.join(__dirname, "..", deletedOrder.imageUrl);

      // ✅ Delete the file if it exists
      fs.unlink(imagePath, (err) => {
        if (err) {
          console.error("❌ Error deleting image:", err);
        } else {
          console.log("🗑️ Image deleted:", imagePath);
        }
      });
    }

    res.json({ message: "Order deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
