document.addEventListener("DOMContentLoaded", () => {
  const cartDrawer = document.getElementById("cartDrawer");
  const cartDrawerOverlay = document.getElementById("cartDrawerOverlay");
  const cartBtns = document.querySelectorAll("#cartButton");
  const closeCartDrawer = document.getElementById("closeCartDrawer");
  const cartItemsContainer = document.getElementById("cartItems");
  const cartTotal = document.getElementById("cartTotal");

  // Open drawer - for all cart buttons
  if (cartBtns.length > 0) {
    cartBtns.forEach(cartBtn => {
      cartBtn.addEventListener("click", () => {
        if (cartDrawer && cartDrawerOverlay) {
          renderCartDrawer(); // Ensure this function is defined
          cartDrawer.classList.remove("translate-x-full");
          cartDrawerOverlay.classList.remove("hidden");
        }
      });
    });
  }

  if (closeCartDrawer && cartDrawer && cartDrawerOverlay) {
    closeCartDrawer.addEventListener("click", closeCart);
    cartDrawerOverlay.addEventListener("click", closeCart);
  }

  function closeCart() {
    if (cartDrawer && cartDrawerOverlay) {
      cartDrawer.classList.add("translate-x-full");
      cartDrawerOverlay.classList.add("hidden");
    }
  }

  // Define renderCartDrawer function
  function renderCartDrawer() {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];

    cartItemsContainer.innerHTML = ''; // Clear any previous content

    if (cart.length === 0) {
      cartItemsContainer.innerHTML = '<p class="text-center text-gray-500">Your cart is empty</p>';
      cartTotal.textContent = '₦0';
      return;
    }

    let total = 0;

    cart.forEach((item, index) => {
      total += item.price * item.quantity;

      const itemDiv = document.createElement("div");
      itemDiv.className = "flex items-center gap-3";

      itemDiv.innerHTML = `
        <img src="${item.image}" alt="${item.name}" class="w-16 h-16 object-cover rounded">
        <div class="flex-1">
          <h3 class="font-semibold">${item.name}</h3>
          <p class="text-gray-500 text-sm">₦${item.price.toLocaleString()}</p>
          <div class="flex items-center mt-1 gap-2">
            <button data-index="${index}" class="decrease-qty text-xl px-2">-</button>
            <span>${item.quantity}</span>
            <button data-index="${index}" class="increase-qty text-xl px-2">+</button>
          </div>
        </div>
        <button data-index="${index}" class="remove-item text-red-500 text-2xl">&times;</button>
      `;

      cartItemsContainer.appendChild(itemDiv);
    });

    cartTotal.textContent = `₦${total.toLocaleString()}`;

    // Attach event listeners for + - remove actions
    document.querySelectorAll(".increase-qty").forEach(btn => {
      btn.addEventListener("click", (e) => {
        const index = e.target.dataset.index;
        updateCartItemQuantity(index, 1);
      });
    });

    document.querySelectorAll(".decrease-qty").forEach(btn => {
      btn.addEventListener("click", (e) => {
        const index = e.target.dataset.index;
        updateCartItemQuantity(index, -1);
      });
    });

    document.querySelectorAll(".remove-item").forEach(btn => {
      btn.addEventListener("click", (e) => {
        const index = e.target.dataset.index;
        removeCartItem(index);
      });
    });
  }

  function updateCartItemQuantity(index, change) {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    if (cart[index]) {
      cart[index].quantity += change;
      if (cart[index].quantity <= 0) {
        cart.splice(index, 1); // Remove item if quantity becomes 0
      }
      localStorage.setItem("cart", JSON.stringify(cart));
      updateCartCount(); // Update cart item count on all pages
      renderCartDrawer();
    }
  }

  function removeCartItem(index) {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    cart.splice(index, 1);
    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartCount(); // Update cart item count on all pages
    renderCartDrawer();
  }

  function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
    document.querySelectorAll(".cart-count").forEach(cartCountEl => {
      cartCountEl.textContent = cartCount;
    });
  }

  // Ensure addToCart is globally accessible
  window.addToCart = function (productId, productName, productPrice, productImage) {
    if (!productId || !productName || !productPrice) {
      console.error("Invalid product details:", { productId, productName, productPrice, productImage });
      alert("Failed to add product to cart. Please try again.");
      return;
    }

    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const existingItem = cart.find(item => item.id === productId);

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.push({
        id: productId,
        name: productName,
        price: productPrice,
        image: productImage || "../images/default-placeholder.png", // Fallback to placeholder image
        quantity: 1,
      });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartCount();

    // Toast Notification
    const toast = document.createElement("div");
    toast.className = "fixed top-5 right-5 bg-green-600 text-white py-2 px-4 rounded-lg shadow-lg animate-bounce z-50";
    toast.textContent = "✅ Added to Cart";
    document.body.appendChild(toast);

    setTimeout(() => {
      toast.classList.add("opacity-0");
      setTimeout(() => {
        document.body.removeChild(toast);
      }, 500);
    }, 2500);
  };

  // Update cart count initially
  updateCartCount();

});
