import { Link } from "react-router-dom";

export default function Header() {
  return (
    <header className="app-header">
      <div className="app-header-inner">
        <Link to="/" className="app-logo">
          <span className="app-logo-badge">EM</span>
          <span className="app-logo-text">EMI Shop</span>
        </Link>

        <p className="app-header-tagline">
          Smartphones on EMI, backed by mutual funds
        </p>
      </div>
    </header>
  );
}