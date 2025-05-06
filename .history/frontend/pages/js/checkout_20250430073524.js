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
    if (country !== "Nigeria") return 0;
  
    const distanceTiers = {
      // Distance Level 0 (Abuja)
      "Abuja": 0,
  
      // Distance Level 1 (nearby states)
      "Nasarawa": 1,
      "Kogi": 1,
      "Kaduna": 1,
      "Niger": 1,
  
      // Distance Level 2
      "Benue": 2,
      "Kwara": 2,
      "Plateau": 2,
      "Taraba": 2,
  
      // Distance Level 3
      "Lagos": 3,
      "Oyo": 3,
      "Ondo": 3,
      "Edo": 3,
      "Delta": 3,
  
      // Distance Level 4 (farther states)
      "Anambra": 4,
      "Enugu": 4,
      "Imo": 4,
      "Rivers": 4,
      "Akwa Ibom": 4,
      "Bayelsa": 4,
      "Borno": 4,
      "Yobe": 4,
      "Zamfara": 4,
      "Sokoto": 4,
      "Kebbi": 4,
      "Kano": 4,
      "Jigawa": 4,
      "Gombe": 4,
      "Bauchi": 4,
      "Ekiti": 4,
      "Osun": 4,
      "Ebonyi": 4,
      "Abia": 4,
      "Cross River": 4,
  
      // Default tier if not listed
      "Others": 3
    };
  
    const tier = distanceTiers[state] !== undefined ? distanceTiers[state] : distanceTiers["Others"];
    return 2000 * (tier + 1); // base = ₦2000, so tier 0 = ₦2000, tier 1 = ₦4000, etc.
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
