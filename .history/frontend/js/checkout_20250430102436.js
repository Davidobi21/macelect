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

// Add a fallback for missing images
function handleImageError(event) {
  event.target.src = '/path/to/placeholder-image.jpg'; // Replace with the path to your placeholder image
}

document.addEventListener("DOMContentLoaded", () => {
  updateCartSummary();

  // Attach error handler to all images in the cart summary
  const images = document.querySelectorAll("#cart-summary img");
  images.forEach(img => {
    img.addEventListener("error", handleImageError);
  });
});
