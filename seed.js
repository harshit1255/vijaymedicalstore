const mongoose = require("mongoose");
const fs = require("fs");
const Product = require("./models/Product");
const { faker } = require("@faker-js/faker");

// Connect to MongoDB
mongoose
  .connect(
    "mongodb+srv://hiiamharshit:1255H%40rshit@cluster0.tjjmu.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error(err));

// Seed the database
const seedProducts = async () => {
  try {
    const data = fs.readFileSync("output.json", "utf8");
    const products = JSON.parse(data);

    // Insert products into MongoDB
    await Product.insertMany(products);
    console.log("Products seeded successfully!");
    mongoose.connection.close();
  } catch (error) {
    console.error("Error seeding products:", error);
    mongoose.connection.close();
  }
};

// Run the seed function
seedProducts();
