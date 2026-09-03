const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:4000/api";
 
async function request(path, options = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
 
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || `Request failed with status ${res.status}`);
  }
 
  return res.json();
}
 
export const api = {
  getProducts: () => request("/products"),
  getProductBySlug: (slug) => request(`/products/${slug}`),
  createOrder: (payload) =>
    request("/orders", { method: "POST", body: JSON.stringify(payload) }),
};
 