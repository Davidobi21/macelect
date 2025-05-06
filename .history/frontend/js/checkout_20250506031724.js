async function placeOrder() {
  const token = localStorage.getItem("token");
  if (!token) {
    Swal.fire({
      icon: "warning",
      title: "Unauthorized",
      text: "You must be logged in to place an order.",
    });
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
      Swal.fire({
        icon: "error",
        title: "Order Failed",
        text: error.message || "Failed to place order. Please try again.",
      });
      return;
    }

    const result = await response.json();
    console.log("Order placed successfully:", result);
    Swal.fire({
      icon: "success",
      title: "Order Placed",
      text: "Your order has been placed successfully!",
    }).then(() => {
      localStorage.removeItem("cart"); // Clear the cart after placing the order
      window.location.href = "/order-success.html"; // Redirect to a success page
    });
  } catch (error) {
    console.error("Error placing order:", error);
    Swal.fire({
      icon: "error",
      title: "Error",
      text: "An error occurred while placing the order. Please try again.",
    });
  }
}

async function login() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  if (!email || !password) {
    Swal.fire({
      icon: "warning",
      title: "Missing Fields",
      text: "Please fill in both email and password.",
    });
    return;
  }

  console.log("Attempting login with:", { email, password }); // Debugging log

  try {
    const response = await fetch("http://localhost:5000/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: "Invalid response from server" }));
      console.error("Login failed:", error);
      Swal.fire({
        icon: "error",
        title: "Login Failed",
        text: error.message || "Login failed. Please try again.",
      });
      return;
    }

    const data = await response.json();
    console.log("Login successful:", data);

    localStorage.setItem("token", data.token); // Save JWT token
    localStorage.setItem("userId", data.user.id); // Save user ID
    Swal.fire({
      icon: "success",
      title: "Login Successful",
      text: "You have logged in successfully!",
    }).then(() => {
      window.location.href = "/index.html"; // Redirect to homepage
    });
  } catch (error) {
    console.error("Error during login:", error);
    Swal.fire({
      icon: "error",
      title: "Error",
      text: "An error occurred during login. Please try again.",
    });
  }
}
