async function placeOrderPayOnDelivery() {
  const orderData = {
    items: JSON.parse(localStorage.getItem("cart")) || [],
    shippingInfo: {
      address: document.getElementById("address").value,
      country: document.getElementById("country").value,
      state: document.getElementById("state").value,
      zip: document.getElementById("zip").value,
      shippingCost: parseInt(document.getElementById("shipping-cost").textContent.replace("₦", "").replace(",", "")) || 0,
    },
    totalAmount: parseInt(document.getElementById("cart-total").textContent.replace("₦", "").replace(",", "")) || 0,
  };

  try {
    const response = await fetch("http://localhost:5000/orders/place", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(orderData),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: "Invalid response from server" }));
      console.error("Error placing order:", error);
      alert(error.message || "Failed to place order.");
      return;
    }

    const result = await response.json();
    console.log("Order placed successfully:", result);
    alert("Order placed successfully!");
    localStorage.removeItem("cart"); // Clear the cart after placing the order
    window.location.href = "/order-success.html"; // Redirect to a success page
  } catch (error) {
    console.error("Error placing order:", error);
    alert("An error occurred while placing the order. Please try again.");
  }
}

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
  document.getElementById("placeOrderButton").addEventListener("click", placeOrderPayOnDelivery);
});
