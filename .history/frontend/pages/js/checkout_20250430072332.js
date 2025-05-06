document.addEventListener("DOMContentLoaded", () => {
  lucide.createIcons(); // Initialize Lucide icons

  const cartSummary = document.getElementById("cart-summary");
  const cartTotal = document.getElementById("cart-total");
  const shippingCostElement = document.getElementById("shipping-cost");
  const cartCount = document.querySelector(".cart-count");
  const countrySelect = document.getElementById("country");
  const stateSelect = document.getElementById("state");
  const checkoutButton = document.getElementById("checkoutButton");
  const padlockIcon = document.getElementById("padlockIcon");
  const formInputs = document.querySelectorAll("#firstName, #lastName, #email, #address, #country, #state, #zip");

  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  let total = 0;

  function calculateShippingCost(country, state) {
    if (country === "Nigeria") {
      if (state === "Lagos") return 500; // Example shipping cost for Lagos
      return 1000; // Example shipping cost for other states in Nigeria
    } else if (country === "United States") {
      return 5000; // Example shipping cost for the US
    }
    return 0; // Default shipping cost
  }

  function updateCartSummary() {
    cartSummary.innerHTML = ""; // Clear existing content
    total = 0;

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

    const country = countrySelect.value;
    const state = stateSelect.value;
    const shippingCost = calculateShippingCost(country, state);

    shippingCostElement.textContent = `₦${shippingCost.toLocaleString()}`;
    cartTotal.textContent = `₦${(total + shippingCost).toLocaleString()}`;
    cartCount.textContent = cart.reduce((count, item) => count + item.quantity, 0);

    validateCheckoutButton(); // Check if the button should be enabled
  }

  function validateCheckoutButton() {
    const isFormValid = Array.from(formInputs).every(input => input.value.trim() !== "");
    const isCartNotEmpty = cart.length > 0;

    if (isFormValid && isCartNotEmpty) {
      checkoutButton.disabled = false;
      padlockIcon.setAttribute("data-lucide", "unlock");
    } else {
      checkoutButton.disabled = true;
      padlockIcon.setAttribute("data-lucide", "lock");
    }
    lucide.createIcons(); // Refresh Lucide icons after updating the padlock
  }

  formInputs.forEach(input => {
    input.addEventListener("input", validateCheckoutButton);
  });

  countrySelect.addEventListener("change", updateCartSummary);
  stateSelect.addEventListener("change", updateCartSummary);

  updateCartSummary(); // Initial update
});
