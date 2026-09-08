document.addEventListener("DOMContentLoaded", async () => {
  if (!getToken()) {
    window.location.href = "login.html";
    return;
  }
  const box = document.getElementById("ordersList");
  try {
    const orders = await api("/orders/my");
    if (!orders.length) {
      box.innerHTML = `<div class="empty">You haven't placed an order yet.<br><br><a class="btn" href="index.html">Start Shopping</a></div>`;
      return;
    }
    box.innerHTML = orders.map(o => `
      <article class="order-card">
        <div class="order-head">
          <div><div class="order-id">Order #${o.id}</div><div class="muted">${new Date(o.created_at).toLocaleString("en-IN")}</div></div>
          <span class="status">${o.status}</span>
        </div>
        <div class="order-items">${o.items.map(i => `<span class="mini-item">${i.name} × ${i.quantity}</span>`).join("")}</div>
        <div class="order-foot"><span>Deliver to: ${o.address}</span><strong>${money(o.total_amount)}</strong></div>
      </article>
    `).join("");
  } catch (error) {
    box.innerHTML = `<div class="empty">${error.message}</div>`;
  }
});
