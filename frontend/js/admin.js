let products = [];
let orders = [];

function requireAdmin() {
  const user = getUser();
  if (!user || user.role !== "admin") {
    alert("Admin access required.");
    window.location.href = "login.html";
    return false;
  }
  return true;
}

async function loadAdmin() {
  if (!requireAdmin()) return;
  try {
    products = await api("/products");
    orders = await api("/orders");
    renderProductsTable();
    renderOrdersTable();
  } catch (error) {
    alert(error.message);
  }
}

function renderProductsTable() {
  const rows = products.map(p => `
    <tr><td><strong>${p.name}</strong></td><td>${p.category}</td><td>${money(p.price)}</td><td>${p.stock}</td>
    <td><div class="table-actions"><button class="mini-btn" onclick="editProduct(${p.id})">Edit</button><button class="mini-btn" onclick="deleteProduct(${p.id})">Delete</button></div></td></tr>
  `).join("");
  document.getElementById("productTable").innerHTML = rows || `<tr><td colspan="5">No products found.</td></tr>`;
}

function renderOrdersTable() {
  document.getElementById("orderTable").innerHTML = orders.map(o => `
    <tr><td>#${o.id}</td><td>${o.customer_name}</td><td>${money(o.total_amount)}</td><td>${new Date(o.created_at).toLocaleDateString("en-IN")}</td>
    <td><select class="status-select" onchange="updateStatus(${o.id}, this.value)">
      ${["Processing","Shipped","Delivered","Cancelled"].map(s => `<option ${s===o.status?"selected":""}>${s}</option>`).join("")}
    </select></td></tr>
  `).join("") || `<tr><td colspan="5">No orders yet.</td></tr>`;
}

function openModal(product = null) {
  document.getElementById("productModal").classList.remove("hidden");
  document.getElementById("modalTitle").textContent = product ? "Edit product" : "Add product";
  document.getElementById("productId").value = product?.id || "";
  document.getElementById("pName").value = product?.name || "";
  document.getElementById("pDescription").value = product?.description || "";
  document.getElementById("pPrice").value = product?.price || "";
  document.getElementById("pStock").value = product?.stock ?? "";
  document.getElementById("pCategory").value = product?.category || "Fashion";
  document.getElementById("pImage").value = product?.image_url || "";
}
function closeModal(){ document.getElementById("productModal").classList.add("hidden"); }
function editProduct(id){ openModal(products.find(p => p.id === id)); }

async function deleteProduct(id) {
  if (!confirm("Delete this product?")) return;
  try { await api(`/products/${id}`, {method:"DELETE"}); await loadAdmin(); }
  catch(e){ alert(e.message); }
}

async function updateStatus(id, status) {
  try { await api(`/orders/${id}/status`, {method:"PUT", body:JSON.stringify({status})}); }
  catch(e){ alert(e.message); await loadAdmin(); }
}

document.addEventListener("DOMContentLoaded", () => {
  if (!document.getElementById("productTable")) return;
  loadAdmin();
  document.getElementById("newProductBtn").onclick = () => openModal();
  document.getElementById("closeModal").onclick = closeModal;

  document.getElementById("productForm").addEventListener("submit", async e => {
    e.preventDefault();
    const id = document.getElementById("productId").value;
    const payload = {
      name: document.getElementById("pName").value,
      description: document.getElementById("pDescription").value,
      price: Number(document.getElementById("pPrice").value),
      stock: Number(document.getElementById("pStock").value),
      category: document.getElementById("pCategory").value,
      image_url: document.getElementById("pImage").value
    };
    try {
      await api(id ? `/products/${id}` : "/products", {method:id?"PUT":"POST", body:JSON.stringify(payload)});
      closeModal(); await loadAdmin();
    } catch(e){ document.getElementById("productMessage").textContent = e.message; }
  });
});
