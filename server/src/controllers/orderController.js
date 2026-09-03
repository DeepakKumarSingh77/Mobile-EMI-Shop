const Product = require("../models/Product");

exports.createOrder = async (req, res) => {
  try {
    const { variantId, emiPlanId } = req.body || {};

    if (!variantId || !emiPlanId) {
      return res.status(400).json({ error: "variantId and emiPlanId are required" });
    }

    const product = await Product.findOne({ "variants._id": variantId });
    if (!product) {
      return res.status(404).json({ error: "Variant not found" });
    }

    const variant = product.variants.id(variantId);
    const plan = variant.emiPlans.id(emiPlanId);

    if (!plan) {
      return res.status(404).json({ error: "EMI plan not found for this variant" });
    }

    const order = {
      orderId: `ORD-${Date.now()}`,
      variant: { id: variant._id, label: variant.label, price: variant.price },
      emiPlan: {
        tenureMonths: plan.tenureMonths,
        monthlyAmount: plan.monthlyAmount,
        interestRate: plan.interestRate,
        cashbackAmount: plan.cashbackAmount,
      },
      totalPayable: plan.monthlyAmount * plan.tenureMonths,
      status: "CONFIRMED",
      createdAt: new Date().toISOString(),
    };

    res.status(201).json(order);
  } catch (err) {
    res.status(400).json({ error: "Invalid variantId or emiPlanId" });
  }
};