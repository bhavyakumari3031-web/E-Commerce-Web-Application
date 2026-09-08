async function loadProducts() {
  const grid = document.getElementById("productGrid");
  grid.innerHTML = `<div class="empty">Loading products...</div>`;
  try {
    const products = await api("/products");
    renderProducts(products);
  } catch (error) {
    grid.innerHTML = `<div class="empty">${error.message}</div>`;
  }
}

function renderProducts(products) {
  const grid = document.getElementById("productGrid");
  if (!products.length) {
    grid.innerHTML = `<div class="empty">No products available.</div>`;
    return;
  }
  grid.innerHTML = products.map(p => `
    <article class="product-card">
      <img class="product-img" src="${p.image_url || 'https://placehold.co/800x600?text=Product'}" alt="${p.name}">
      <div class="product-info">
        <div class="product-meta"><span class="category">${p.category}</span><span class="stock">${p.stock} left</span></div>
        <div class="product-name">${p.name}</div>
        <div class="product-desc">${p.description || "Quality everyday product."}</div>
        <div class="product-bottom"><span class="price">${money(p.price)}</span><button class="btn btn-small" ${p.stock < 1 ? "disabled" : ""} onclick='addToCart(${JSON.stringify(p)})'>${p.stock < 1 ? "Sold out" : "Add to Cart"}</button></div>
      </div>
    </article>
  `).join("");
}

document.addEventListener("DOMContentLoaded", () => {
  if (document.getElementById("productGrid")) loadProducts();
});
