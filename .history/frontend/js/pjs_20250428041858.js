document.addEventListener("DOMContentLoaded", async function () {
  try {
    lucide.createIcons();
  } catch (err) {
    console.error("Error initializing Lucide icons:", err);
  }

  const hamburgerBtn = document.getElementById("hamburgerBtn");
  const closeSidebarBtn = document.getElementById("closeSidebarBtn");
  const sidebar = document.getElementById("sidebar");
  const sidebarOverlay = document.getElementById("sidebarOverlay");

  if (hamburgerBtn && closeSidebarBtn && sidebar && sidebarOverlay) {
    hamburgerBtn.addEventListener("click", () => {
      sidebar.classList.remove("-translate-x-full");
      sidebarOverlay.classList.remove("hidden");
    });
    closeSidebarBtn.addEventListener("click", () => {
      sidebar.classList.add("-translate-x-full");
      sidebarOverlay.classList.add("hidden");
    });
    sidebarOverlay.addEventListener("click", () => {
      sidebar.classList.add("-translate-x-full");
      sidebarOverlay.classList.add("hidden");
    });
  }

  const searchInput = document.getElementById("searchInput");
  const categoryButtons = document.querySelectorAll(".filter-btn");
  const categoryCheckboxes = document.querySelectorAll(".category-checkbox");
  const priceSlider = document.getElementById("priceSlider");
  const priceValue = document.getElementById("priceValue");
  const productContainer = document.getElementById("product-list");

  if (!productContainer) return;

  let productCards = [];

  function filterProducts() {
    const searchText = searchInput.value.toLowerCase();
    const selectedCategory = document.querySelector(".filter-btn.bg-blue-100")?.dataset.category || "all";
    const checkedCategories = Array.from(categoryCheckboxes)
      .filter(checkbox => checkbox.checked)
      .map(checkbox => checkbox.value.toLowerCase());
    const maxPrice = parseFloat(priceSlider.value);

    productCards.forEach(card => {
      const name = card.dataset.name.toLowerCase();
      const category = card.dataset.category.toLowerCase();
      const price = parseFloat(card.dataset.price);

      const matchesSearch = name.includes(searchText);
      const matchesCategoryBtn = selectedCategory === "all" || category === selectedCategory;
      const matchesSidebarCat = checkedCategories.length === 0 || checkedCategories.includes(category);
      const matchesPrice = price <= maxPrice;

      card.style.display = (matchesSearch && matchesCategoryBtn && matchesSidebarCat && matchesPrice)
        ? "block" : "none";
    });
  }

  function reattachEventListeners() {
    categoryButtons.forEach(btn => {
      btn.addEventListener("click", function () {
        categoryButtons.forEach(b => b.classList.remove("bg-blue-100", "text-blue-800"));
        this.classList.add("bg-blue-100", "text-blue-800");
        filterProducts();
      });
    });

    categoryCheckboxes.forEach(checkbox => {
      checkbox.addEventListener("change", filterProducts);
    });

    priceSlider.addEventListener("input", function () {
      priceValue.textContent = this.value;
      filterProducts();
    });

    searchInput.addEventListener("input", filterProducts);
  }

  function attachCardClickListeners() {
    productCards.forEach(card => {
      card.addEventListener("click", (e) => {
        if (e.target.closest('button')) return; // if clicking button, don't open product page

        const productId = card.dataset.id;
        if (productId) {
          window.location.href = `./productpage.html?id=${encodeURIComponent(productId)}`;
        } else {
          console.error("Product ID is missing.");
        }
      });
    });
  }

  try {
    const response = await fetch('http://localhost:5000/api/products');
    const products = await response.json();
    productContainer.innerHTML = '';

    const maxProductPrice = Math.max(...products.map(p => p.price));
    priceSlider.max = maxProductPrice;
    priceSlider.value = maxProductPrice;
    priceValue.textContent = maxProductPrice;

    products.forEach(product => {
      if (!product.name || !product.price) return;

      const mainImage = product.images?.[0] ? `http://localhost:5000${product.images[0]}` : "../images/default-main.jpg";
      const hoverImage = product.images?.[1] ? `http://localhost:5000${product.images[1]}` : mainImage;
      const category = product.category?.toLowerCase() || 'unknown';

      const cardHTML = `
<div class="bg-white shadow-lg rounded-lg overflow-hidden group product-card" 
     data-id="${product._id}" 
     data-name="${product.name}" 
     data-category="${category}" 
     data-price="${product.price}">
  <div class="relative">
    <div class="brand-img-wrapper position-relative">
      <img src="${mainImage}" class="main-img w-100 h-100 object-fit-cover" alt="${product.name}">
      <img src="${hoverImage}" class="hover-img w-100 h-100 object-fit-cover position-absolute top-0 start-0" alt="Alt Image">
      <div class="position-absolute bottom-0 start-0 end-0 p-3 d-flex justify-content-between align-items-center bg-dark bg-opacity-50 text-white fw-bold fs-6">
        <span class="text-uppercase">${product.category}</span>
        <span>₦${product.price.toLocaleString()}</span>
      </div>
    </div>

    <div class="p-4 bg-white">
      <h5 class="fw-bold text-dark mb-2">${product.name}</h5>
      <p class="text-muted small mb-3">Ships in ${product.shippingInfo || 'N/A'}</p>

      <div class="d-flex justify-content-between gap-2">
        <button 
          onclick="addToCart('${product._id}', '${product.name}', ${product.price}, '${mainImage}')" 
          class="btn btn-outline-dark w-100 d-flex align-items-center justify-content-center gap-1">
          <i data-lucide="shopping-cart" class="lucide w-4 h-4"></i><span>Add</span>
        </button>
        <button class="btn w-100 d-flex align-items-center justify-content-center gap-1 text-white" style="background: #000;">
          <i data-lucide="zap" class="lucide w-4 h-4"></i><span>Buy Now</span>
        </button>
      </div>
    </div>

    ${product.sale ? `<div class="position-absolute top-0 start-0 bg-danger text-white px-3 py-1 rounded-end-4 fs-6 fw-semibold">SALE</div>` : ''}
  </div>
</div>`;

      productContainer.innerHTML += cardHTML;
    });

    lucide.createIcons();
    productCards = document.querySelectorAll(".product-card");
    reattachEventListeners();
    attachCardClickListeners();
    filterProducts();
  } catch (err) {
    console.error('Error fetching products:', err);
    productContainer.innerHTML = '<p class="text-danger">Failed to load products. Please try again later.</p>';
  }

  function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
    const cartCountElements = document.querySelectorAll(".cart-count");

    cartCountElements.forEach(el => {
        el.textContent = cartCount;
    });
  }

  updateCartCount();

  // "Buy Now" button handler
  productContainer.addEventListener('click', function(event) { 
    const buyNowBtn = event.target.closest('button');
    if (buyNowBtn && buyNowBtn.innerText.includes('Buy Now')) {
      const productCard = buyNowBtn.closest('[data-id]');
      if (productCard) {
        const productId = productCard.getAttribute('data-id');
        console.log('Buy Now clicked for Product ID:', productId);
        buyNow(productId);
      }
    }
  });

  function buyNow(productId) {
    alert(`Product ${productId} purchased! 💰`);
    // You can redirect to checkout here
  }

  function showToast(message, type = 'info') {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    
    toast.className = `fixed bottom-5 right-5 px-4 py-2 rounded-lg shadow-lg z-50 ${
      type === 'success' ? 'bg-green-600' : type === 'error' ? 'bg-red-600' : 'bg-black'
    } text-white`;
  
    toast.classList.remove('hidden');
    
    setTimeout(() => {
      toast.classList.add('hidden');
    }, 3000);
  }
  
});

window.addToCart = function(productId, productName, productPrice, productImage) {
  const userData = localStorage.getItem("user");
  const token = localStorage.getItem("token");
  let user = null;

  if (userData) {
    try {
      user = JSON.parse(userData);
    } catch (error) {
      console.error("Error parsing user data:", error);
    }
  } else {
    console.error("User data not found in localStorage.");
  }

  if (!user || !user._id || !token) {
    Swal.fire({
      icon: 'warning',
      title: 'Hold up!',
      text: 'You must be signed in to add items to your cart.',
      confirmButtonColor: '#3085d6',
      background: '#fff',
    });
    return;
  }

  const userId = user._id;

  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const existingItem = cart.find(item => item.id === productId);

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({
      id: productId,
      name: productName,
      price: productPrice,
      image: productImage,
      quantity: 1,
    });
  }

  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartCount();

  // Toast Notification
  const toast = document.createElement('div');
  toast.className = 'fixed top-5 right-5 bg-green-600 text-white py-2 px-4 rounded-lg shadow-lg animate-bounce z-50';
  toast.textContent = '✅ Added to Cart';
  document.body.appendChild(toast);

  setTimeout(() => {
    toast.classList.add('opacity-0');
    setTimeout(() => {
      document.body.removeChild(toast);
    }, 500);
  }, 2500); // Visible for 2.5s then fades

  // Sync with backend
  fetch("http://localhost:5000/api/cart/add", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
    body: JSON.stringify({
      userId,
      productId,
      quantity: 1,
    }),
  })
  .then(res => res.json())
  .then(data => {
    if (!data.message) {
      console.error("Failed to sync cart with backend:", data);
    } else {
      console.log("Cart synced with backend:", data);
    }
  })
  .catch(err => {
    console.error("Error syncing cart with backend:", err);
  });
};




// Update cart count across all pages
function updateCartCount() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
  const cartCountElements = document.querySelectorAll(".cart-count");

  cartCountElements.forEach(el => {
      el.textContent = cartCount;
  });
}

// Initialize cart count on page load
document.addEventListener("DOMContentLoaded", () => {
  updateCartCount();
});
