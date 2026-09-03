require("dotenv").config();
const mongoose = require("mongoose");
const { connectDB } = require("../config/db");
const Product = require("../models/Product");

// Builds a realistic EMI ladder for a given selling price — mirrors the
// Snapmint-style structure: 0% interest for short tenures, 10.5% beyond 24 months.
function buildEmiPlans(price) {
  const tenures = [3, 6, 12, 24, 36, 48, 60];
  return tenures.map((months) => {
    const zeroInterest = months <= 24;
    const rate = zeroInterest ? 0 : 10.5;
    const totalPayable = zeroInterest ? price : price * (1 + (rate / 100) * (months / 12));
    return {
      tenureMonths: months,
      monthlyAmount: Math.round(totalPayable / months),
      interestRate: rate,
      cashbackAmount: 7500,
      backedBy: "Mutual Fund SIP",
      isRecommended: months === 12,
    };
  });
}

const products = [
  {
    slug: "apple-iphone-17-pro",
    name: "Apple iPhone 17 Pro",
    brand: "Apple",
    category: "smartphone",
    description:
      "Apple's flagship Pro smartphone with A19 Pro chip, titanium frame and pro-grade camera system.",
    variants: [
      {
        label: "256GB / Cosmic Orange",
        storage: "256GB",
        color: "Cosmic Orange",
        colorHex: "#c9612c",
        mrp: 134900,
        price: 127400,
        imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQHi6e4dzMCPfnSb7giFvIXiFSQhFIYgrnVukH1HKNk5Q&s",
        isDefault: true,
      },
      {
        label: "256GB / Deep Blue",
        storage: "256GB",
        color: "Deep Blue",
        colorHex: "#1d2d4e",
        mrp: 134900,
        price: 127400,
        imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQQgQ_d-eEx5YDEWTVhgVVjV_gUkba47C8plk_rDW--bA&s=10",
        isDefault: false,
      },
      {
        label: "512GB / Silver",
        storage: "512GB",
        color: "Silver",
        colorHex: "#d8d8d8",
        mrp: 154900,
        price: 146900,
        imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSxuzj8vgz-zEKOIg-nv9pDD2XyvN6l7NZQdQzoiZQj8A&s=10",
        isDefault: false,
      },
    ],
  },
  {
    slug: "samsung-galaxy-s24-ultra",
    name: "Samsung Galaxy S24 Ultra",
    brand: "Samsung",
    category: "smartphone",
    description:
      "Samsung's top-tier Galaxy with S-Pen, 200MP camera and Snapdragon 8 Gen 3 for Galaxy.",
    variants: [
      {
        label: "256GB / Titanium Black",
        storage: "256GB",
        color: "Titanium Black",
        colorHex: "#2b2b2b",
        mrp: 129999,
        price: 119999,
        imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTr5XXFV2lqO68bkrQ2qo3vcsUUcj01od6KzEOnOlDLCA&s=10",
        isDefault: true,
      },
      {
        label: "256GB / Titanium Gray",
        storage: "256GB",
        color: "Titanium Gray",
        colorHex: "#8a8a8a",
        mrp: 129999,
        price: 119999,
        imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRbEYl30WOhSPVWXEESMdZILS1YQlnfx5HbQ7iSICyDvA&s",
        isDefault: false,
      },
      {
        label: "512GB / Titanium Violet",
        storage: "512GB",
        color: "Titanium Violet",
        colorHex: "#6f5b7e",
        mrp: 144999,
        price: 134999,
        imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcShaodW9nWaevzKlHhy_dfcjBvqMVzLTPEUckZW94B46g&s=10",
        isDefault: false,
      },
    ],
  },
  {
    slug: "google-pixel-9-pro",
    name: "Google Pixel 9 Pro",
    brand: "Google",
    category: "smartphone",
    description:
      "Google's AI-first flagship with Tensor G4 chip and best-in-class computational photography.",
    variants: [
      {
        label: "128GB / Obsidian",
        storage: "128GB",
        color: "Obsidian",
        colorHex: "#1b1b1b",
        mrp: 109999,
        price: 99999,
        imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQxi58T-S1vFld02MAn7a_iBV9WH9KDNpDJ6paXa5-yaQ&s=10",
        isDefault: true,
      },
      {
        label: "256GB / Porcelain",
        storage: "256GB",
        color: "Porcelain",
        colorHex: "#eae6df",
        mrp: 119999,
        price: 109999,
        imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS22vPPXOXcTpIqWAvrXh6uQ7VFIafDLEuKgeGpOXzcOA&s=10",
        isDefault: false,
      },
    ],
  },
];

// attach the generated EMI plans to every variant before inserting
for (const product of products) {
  for (const variant of product.variants) {
    variant.emiPlans = buildEmiPlans(variant.price);
  }
}

async function run() {
  await connectDB();

  await Product.deleteMany({});
  const inserted = await Product.insertMany(products);

  console.log(`✅ Seed complete: ${inserted.length} products inserted into MongoDB Atlas.`);
  await mongoose.connection.close();
  process.exit(0);
}

run().catch((err) => {
  console.error("❌ Seed failed:", err.message);
  process.exit(1);
});