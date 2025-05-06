document.addEventListener("DOMContentLoaded", () => {
  const cartDrawer = document.getElementById("cartDrawer");
  const cartDrawerOverlay = document.getElementById("cartDrawerOverlay");
  const cartBtns = document.querySelectorAll("#cartButton");
  const closeCartDrawer = document.getElementById("closeCartDrawer");
  const cartItemsContainer = document.getElementById("cartItems");
  const cartTotal = document.getElementById("cartTotal");

  // Check if elements exist before adding event listeners
  if (cartBtns.length > 0) {
    cartBtns.forEach(cartBtn => {
      cartBtn.addEventListener("click", () => {
        if (cartDrawer && cartDrawerOverlay) {
          renderCartDrawer();
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

  function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
    document.querySelectorAll(".cart-count").forEach(cartCountEl => {
      cartCountEl.textContent = cartCount;
    });
  }
});
