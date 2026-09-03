const BASE_URL ="https://server-three-xi-78.vercel.app/";
 
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
 