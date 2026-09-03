require("dotenv").config();
const express = require("express");
const cors = require("cors");

const { connectDB } = require("./config/db");
const productRoutes = require("./routes/productRoutes");
const orderRoutes = require("./routes/orderRoutes");

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

app.get("/api/health", (req, res) => res.json({ status: "ok" }));
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);

app.use((req, res) => res.status(404).json({ error: "Not found" }));

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`🚀 EMI Shop API running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ Failed to connect to MongoDB:", err.message);
    process.exit(1);
  })