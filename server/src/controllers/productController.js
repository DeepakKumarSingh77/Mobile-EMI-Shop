const Product = require("../models/Product");
function summarize(productDoc) {
  const variants = productDoc.variants;
  const defaultVariant = variants.find((v) => v.isDefault) || variants[0];

  return {
    id: productDoc._id,
    slug: productDoc.slug,
    name: productDoc.name,
    brand: productDoc.brand,
    category: productDoc.category,
    description: productDoc.description,
    variantCount: variants.length,
    startingPrice: Math.min(...variants.map((v) => v.price)),
    imageUrl: defaultVariant?.imageUrl,
  };
}

// GET /api/products
exports.listProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: 1 });
    res.json({ products: products.map(summarize) });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch products" });
  }
};

// GET /api/products/:slug
exports.getProductBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    const product = await Product.findOne({ slug });

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.json({
      id: product._id,
      slug: product.slug,
      name: product.name,
      brand: product.brand,
      category: product.category,
      description: product.description,
      variants: product.variants.map((v) => ({
        id: v._id,
        label: v.label,
        storage: v.storage,
        color: v.color,
        colorHex: v.colorHex,
        mrp: v.mrp,
        price: v.price,
        imageUrl: v.imageUrl,
        isDefault: v.isDefault,
        emiPlans: v.emiPlans.map((p) => ({
          id: p._id,
          tenureMonths: p.tenureMonths,
          monthlyAmount: p.monthlyAmount,
          interestRate: p.interestRate,
          cashbackAmount: p.cashbackAmount,
          backedBy: p.backedBy,
          isRecommended: p.isRecommended,
        })),
      })),
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch product" });
  }
};