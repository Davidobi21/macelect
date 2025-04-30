async function placeOrder() {
  const token = localStorage.getItem("token");
  if (!token) {
    alert("You must be logged in to place an order.");
    return;
  }

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
    const response = await fetch("http://localhost:5000/api/order", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
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
