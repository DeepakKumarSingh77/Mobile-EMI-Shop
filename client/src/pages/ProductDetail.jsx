import { useEffect, useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { api } from "../api/client";
import { formatINR } from "../utils/format";
import VariantSelector from "../components/VariantSelector";
import EmiPlanList from "../components/EmiPlanList";

export default function ProductDetail() {
  const { slug } = useParams();
  const [product, setProduct] = useState(null);           
  const [selectedVariant, setSelectedVariant] = useState(null); 
  const [selectedPlanId, setSelectedPlanId] = useState(null);   
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [order, setOrder] = useState(null);              
  const [submitting, setSubmitting] = useState(false);     

  useEffect(() => {
    setLoading(true);
    setOrder(null);

    api
      .getProductBySlug(slug)
      .then((data) => {
        setProduct(data);

        const startingVariant = data.variants.find((v) => v.isDefault) || data.variants[0];
        setSelectedVariant(startingVariant);
        const startingPlan =
          startingVariant.emiPlans.find((p) => p.isRecommended) || startingVariant.emiPlans[0];
        setSelectedPlanId(startingPlan?.id ?? null);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [slug]);

  const selectedPlan = useMemo(() => {
    if (!selectedVariant) return null;
    return selectedVariant.emiPlans.find((p) => p.id === selectedPlanId);
  }, [selectedVariant, selectedPlanId]);

  function handleVariantChange(variant) {
    setSelectedVariant(variant);
    const recommended = variant.emiPlans.find((p) => p.isRecommended) || variant.emiPlans[0];
    setSelectedPlanId(recommended?.id ?? null);
    setOrder(null);
  }

  async function handleProceed() {
    if (!selectedVariant || !selectedPlanId) return;

    setSubmitting(true);
    setError(null);

    try {
      const result = await api.createOrder({
        variantId: selectedVariant.id,
        emiPlanId: selectedPlanId,
      });
      setOrder(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) return <p className="page-message">Loading…</p>;
  if (error && !product) return <p className="page-message error">Error: {error}</p>;
  if (!product) return null;

  return (
    <main className="product-detail">
      <Link to="/" className="back-link">← Back to products</Link>

      <div className="product-detail-grid">
        <div className="product-detail-left">
          <div className="product-detail-image">
            <img src={selectedVariant.imageUrl} alt={product.name} />
          </div>

          <VariantSelector
            variants={product.variants}
            selectedVariant={selectedVariant}
            onSelect={handleVariantChange}
          />
        </div>
        <div className="product-detail-right">
          <div>
            <span className="product-detail-brand">{product.brand} · New</span>
            <h1 className="product-detail-name">{product.name}</h1>
            <p className="product-detail-variant-label">{selectedVariant.label}</p>
            <p className="product-detail-description">{product.description}</p>

            <div className="product-detail-price-row">
              <span className="product-detail-price">{formatINR(selectedVariant.price)}</span>
              {selectedVariant.mrp > selectedVariant.price && (
                <span className="product-detail-mrp">{formatINR(selectedVariant.mrp)}</span>
              )}
            </div>
          </div>

          <EmiPlanList
            plans={selectedVariant.emiPlans}
            selectedPlanId={selectedPlanId}
            onSelect={setSelectedPlanId}
          />

          {selectedPlan && (
            <div className="emi-summary-box">
              You'll pay <strong>{formatINR(selectedPlan.monthlyAmount)}</strong> / month for{" "}
              <strong>{selectedPlan.tenureMonths} months</strong> — total payable{" "}
              <strong>{formatINR(selectedPlan.monthlyAmount * selectedPlan.tenureMonths)}</strong>.
            </div>
          )}

          <button
            onClick={handleProceed}
            disabled={submitting || !selectedPlanId}
            className="proceed-button"
          >
            {submitting ? "Processing…" : "Proceed with this plan"}
          </button>

          {error && !order && <p className="page-message error">Something went wrong: {error}</p>}

          {order && (
            <div className="order-success-box">
              <p className="order-success-title">Order confirmed ✅ ({order.orderId})</p>
              <p>
                {order.emiPlan.tenureMonths} months · {formatINR(order.emiPlan.monthlyAmount)}/mo ·
                total {formatINR(order.totalPayable)}
              </p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}