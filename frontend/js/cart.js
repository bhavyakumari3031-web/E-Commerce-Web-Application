function renderCart() {
  const items = cart();
  const box = document.getElementById("cartContent");
  if (!items.length) {
    box.innerHTML = `<div class="empty">Your cart is empty.<br><br><a class="btn" href="index.html">Continue Shopping</a></div>`;
    return;
  }

  const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  box.innerHTML = `
    <div class="panel">
      ${items.map((i, idx) => `
        <div class="cart-row">
          <img src="${i.image_url}" alt="${i.name}">
          <div><strong>${i.name}</strong><div class="muted">${money(i.price)} each</div></div>
          <div class="qty"><button onclick="changeQty(${idx}, -1)">−</button><strong>${i.quantity}</strong><button onclick="changeQty(${idx}, 1)">+</button></div>
          <strong>${money(i.price * i.quantity)}</strong>
          <button class="mini-btn" onclick="removeItem(${idx})">Remove</button>
        </div>
      `).join("")}
      <div class="cart-summary"><div><div class="muted">Total</div><div class="total">${money(total)}</div></div><a class="btn" href="checkout.html">Proceed to Checkout →</a></div>
    </div>`;
}

function changeQty(index, amount) {
  const items = cart();
  items[index].quantity += amount;
  if (items[index].quantity <= 0) items.splice(index, 1);
  saveCart(items); renderCart();
}
function removeItem(index) {
  const items = cart(); items.splice(index, 1); saveCart(items); renderCart();
}
document.addEventListener("DOMContentLoaded", renderCart);
