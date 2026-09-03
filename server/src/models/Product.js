const mongoose = require("mongoose");
const { Schema } = mongoose;
 
// --- EMI Plan: one tenure option (3mo, 6mo, 12mo...) for a specific variant ---
const emiPlanSchema = new Schema(
  {
    tenureMonths: { type: Number, required: true },      // e.g. 12
    monthlyAmount: { type: Number, required: true },     // e.g. 10617
    interestRate: { type: Number, required: true, default: 0 }, // 0 or 10.5
    cashbackAmount: { type: Number, required: true, default: 0 },
    backedBy: { type: String, required: true, default: "Mutual Fund SIP" },
    isRecommended: { type: Boolean, default: false },
  },
  { _id: true } // keep an id per plan so the frontend can select by id
);
 
// --- Variant: one storage/color combination of a product ---
const variantSchema = new Schema(
  {
    label: { type: String, required: true },     // "256GB / Cosmic Orange"
    storage: { type: String, required: true },    // "256GB"
    color: { type: String, required: true },      // "Cosmic Orange"
    colorHex: { type: String, required: true },   // "#c9612c" (UI swatch)
    mrp: { type: Number, required: true },
    price: { type: Number, required: true },
    imageUrl: { type: String, required: true },
    isDefault: { type: Boolean, default: false },
    emiPlans: { type: [emiPlanSchema], default: [] },
  },
  { _id: true }
);
 
// --- Product: the top-level document ---
const productSchema = new Schema(
  {
    slug: { type: String, required: true, unique: true, index: true }, // used in URL
    name: { type: String, required: true },
    brand: { type: String, required: true },
    category: { type: String, required: true, default: "smartphone" },
    description: { type: String, default: "" },
    variants: { type: [variantSchema], default: [] },
  },
  { timestamps: true }
);
 
module.exports = mongoose.model("Product", productSchema);