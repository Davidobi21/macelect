const API_BASE_URL = "https://<your-ngrok-url>"; // Replace with your ngrok URL

function updateCartSummary() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const cartSummary = document.getElementById("cart-summary");
  const cartTotal = document.getElementById("cart-total");
  const shippingCostElement = document.getElementById("shipping-cost");

  cartSummary.innerHTML = "";
  let total = 0;

  cart.forEach(item => {
    const itemTotal = item.price * item.quantity;
    total += itemTotal;

    const listItem = document.createElement("li");
    listItem.className = "list-group-item d-flex justify-content-between lh-sm";
    listItem.innerHTML = `
      <div>
        <h6 class="my-0">${item.name}</h6>
        <small class="text-muted">Quantity: ${item.quantity}</small>
      </div>
      <span class="text-muted">₦${itemTotal.toLocaleString()}</span>
    `;
    cartSummary.appendChild(listItem);
  });

  const shippingCost = 500; // Example shipping cost
  shippingCostElement.textContent = `₦${shippingCost.toLocaleString()}`;
  cartTotal.textContent = `₦${(total + shippingCost).toLocaleString()}`;
}

document.addEventListener("DOMContentLoaded", () => {
  updateCartSummary();
});
