import { Link } from "react-router-dom";
import { formatINR } from "../utils/format";

export default function ProductCard({ product }) {
  return (
    <Link to={`/products/${product.slug}`} className="product-card">

      {/* Top part: the phone image */}
      <div className="product-card-image">
        <img src={product.imageUrl} alt={product.name} />
      </div>

      {/* Bottom part: text info */}
      <div className="product-card-info">
        <span className="product-card-brand">{product.brand}</span>

        <h3 className="product-card-name">{product.name}</h3>

        <p className="product-card-variants">
          {product.variantCount} variants available
        </p>

        <div className="product-card-price-row">
          <span className="product-card-price-label">Starting from</span>
          <p className="product-card-price">{formatINR(product.startingPrice)}</p>
        </div>
      </div>
    </Link>
  );
}