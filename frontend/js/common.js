const API = "https://e-commerce-web-application-ad2n.onrender.com";

function getToken() {
  return localStorage.getItem("token");
}

function getUser() {
  try { return JSON.parse(localStorage.getItem("user")); } catch { return null; }
}

function setSession(data) {
  localStorage.setItem("token", data.token);
  localStorage.setItem("user", JSON.stringify(data.user));
}

function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  window.location.href = "login.html";
}

async function api(path, options = {}) {
  const headers = { "Content-Type": "application/json", ...(options.headers || {}) };
  if (getToken()) headers.Authorization = `Bearer ${getToken()}`;

  const response = await fetch(`${API}${path}`, { ...options, headers });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.message || "Something went wrong.");
  return data;
}

function cart() {
  try { return JSON.parse(localStorage.getItem("cart") || "[]"); } catch { return []; }
}

function saveCart(items) {
  localStorage.setItem("cart", JSON.stringify(items));
  updateCartCount();
}

function updateCartCount() {
  const count = cart().reduce((sum, item) => sum + item.quantity, 0);
  document.querySelectorAll("#cartCount").forEach(el => el.textContent = count);
}

function addToCart(product) {
  const items = cart();
  const found = items.find(i => i.product_id === product.id);
  if (found) found.quantity += 1;
  else items.push({
    product_id: product.id,
    name: product.name,
    price: Number(product.price),
    image_url: product.image_url,
    quantity: 1,
    stock: product.stock
  });
  saveCart(items);
  alert(`${product.name} added to cart.`);
}

function money(value) {
  return `₹${Number(value).toLocaleString("en-IN", { maximumFractionDigits: 2 })}`;
}

document.addEventListener("DOMContentLoaded", () => {
  updateCartCount();
  const user = getUser();
  const userEl = document.getElementById("navUser");
  if (userEl && user) userEl.textContent = `Hi, ${user.name.split(" ")[0]}`;

  document.querySelectorAll("#logoutBtn").forEach(btn => btn.addEventListener("click", logout));

  const loginLink = document.getElementById("loginLink");
  if (loginLink && user) loginLink.classList.add("hidden");

  document.querySelectorAll("[data-auth-link]").forEach(el => {
    if (!user) el.classList.add("hidden");
  });

  document.querySelectorAll("[data-admin-link]").forEach(el => {
    if (!user || user.role !== "admin") el.classList.add("hidden");
  });

  document.querySelectorAll("#logoutBtn").forEach(btn => {
    if (user) {
      btn.classList.remove("hidden");
    } else {
     btn.classList.add("hidden");
   }
  });
});
