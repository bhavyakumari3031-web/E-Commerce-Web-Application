document.addEventListener("DOMContentLoaded", () => {
  const user = getUser();
  if (!user) {
    alert("Please login before checkout.");
    window.location.href = "login.html";
    return;
  }
  const items = cart();
  if (!items.length) {
    window.location.href = "cart.html";
    return;
  }

  const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  document.getElementById("summary").innerHTML = `<h2>Order summary</h2>${items.map(i => `<div class="summary-item"><span>${i.name} × ${i.quantity}</span><strong>${money(i.price*i.quantity)}</strong></div>`).join("")}<div class="summary-total"><span>Total</span><span>${money(total)}</span></div><p class="muted">Payment: Cash on Delivery (demo)</p>`;

  document.getElementById("checkoutForm").addEventListener("submit", async e => {
    e.preventDefault();
    const message = document.getElementById("message");
    try {
      const data = await api("/orders", {
        method: "POST",
        body: JSON.stringify({
          address: document.getElementById("address").value,
          phone: document.getElementById("phone").value,
          items: items.map(i => ({ product_id: i.product_id, quantity: i.quantity }))
        })
      });
      localStorage.removeItem("cart");
      updateCartCount();
      message.className = "message success";
      message.textContent = `Order #${data.orderId} placed successfully!`;
      setTimeout(() => window.location.href = "orders.html", 900);
    } catch (error) {
      message.textContent = error.message;
    }
  });
});
