import { useEffect, useState } from "react";
import { api } from "../api/client";
import ProductCard from "../components/ProductCard";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    api
      .getProducts()
      .then((data) => setProducts(data.products))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <main className="home-page">
      <div className="home-heading">
        <h1>Shop smartphones on EMI</h1>
        <p>Flexible EMI plans backed by mutual fund SIPs — 0% interest options available.</p>
      </div>

      {loading && <p className="page-message">Loading products…</p>}
      {error && <p className="page-message error">Failed to load products: {error}</p>}

      <div className="home-grid">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </main>
  );
}