require("dotenv").config();

const express = require("express");
const cors = require("cors");

const { connectDB } = require("./config/db");
const productRoutes = require("./routes/productRoutes");
const orderRoutes = require("./routes/orderRoutes");

const app = express();

app.use(cors());
app.use(express.json());

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

// Routes
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);

// 404
app.use((req, res) => {
  res.status(404).json({ error: "Not found" });
});

// Connect to MongoDB
connectDB().catch((err) => {
  console.error("❌ Failed to connect to MongoDB:", err.message);
});

// Export Express app for Vercel
module.exports = app;

// Only start server locally
if (require.main === module) {
  const PORT = process.env.PORT || 4000;

  app.listen(PORT, () => {
    console.log(`🚀 EMI Shop API running on http://localhost:${PORT}`);
  });
}