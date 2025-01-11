const mongoose = require("mongoose");
const Product = require("./models/Product");
const { faker } = require("@faker-js/faker");

// Connect to MongoDB
mongoose
  .connect("mongodb://localhost:27017/productsdb", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error(err));

// Generate an array of drug names
const generateDrugNames = (count) => {
  const drugs = [];
  for (let i = 0; i < count; i++) {
    drugs.push({
      name: `${
        faker.science.chemicalElement().name
      } - ${faker.word.adjective()}`,
      price: parseFloat((Math.random() * 100).toFixed(2)), // Random price between 0 and 100
    });
  }
  return drugs;
};

// Seed the database
const seedDatabase = async () => {
  try {
    // Clear the collection first
    await Product.deleteMany({});
    console.log("Existing data cleared.");

    // Generate 1000 products
    const drugs = generateDrugNames(1000);

    // Insert the products into the database
    await Product.insertMany(drugs);
    console.log("Database seeded with 1000 drug names.");
    mongoose.disconnect();
  } catch (error) {
    console.error("Error seeding the database:", error);
    mongoose.disconnect();
  }
};

// Run the seed function
seedDatabase();
