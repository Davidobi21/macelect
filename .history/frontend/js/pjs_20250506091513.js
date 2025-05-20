document.addEventListener("DOMContentLoaded", async function () {
  try {
    lucide.createIcons();
  } catch (err) {
    console.error("Error initializing Lucide icons:", err);
  }

  function addToCart(productId, productName, productPrice, productImage) {
    // Log the product details for debugging
    console.log('Clicked Add to Cart:', productId, productName, productPrice, productImage);
  
    // Get existing cart data from localStorage or create a new cart array
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
  
    // Add the new product to the cart
    cart.push({ productId, productName, productPrice, productImage });
  
    // Save the updated cart back to localStorage
    localStorage.setItem('cart', JSON.stringify(cart));
  
    // Optionally, alert the user that the item has been added to the cart
    alert(`${productName} has been added to your cart.`);
  }
  
  function attachCardClickListeners() {
    productCards.forEach(card => {
      // Get the button for adding to cart
      const addToCartButton = card.querySelector('.add-to-cart-btn');
  
      // Attach click event listener to the button
      addToCartButton.addEventListener('click', () => {
        const productId = card.dataset.id;
        const productName = card.dataset.name;
        const productPrice = parseFloat(card.dataset.price);
        const productImage = card.querySelector('.main-img').src; // Use the first image as the main image
  
        // Call the addToCart function
        addToCart(productId, productName, productPrice, productImage);
      });
    });
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
    const response = await fetch('http://localhost:5000/api/products/');
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
    productContainer.innerHTML = `
  <div class="error-container" style="display: flex; align-items: center; gap: 60px; max-width: 1500px; text-align: left;">
    <div class="error-text" style="max-width: 400px;">
      <h1 style="font-size: 9rem; font-weight: bold; margin-bottom: 50px;">F*ck!</h1>
      <p style="font-size: 1.2rem; margin-bottom: 20px;">It looks like mom has been cleaning our products again so we can’t find them  at the moment.</p>
      <p style="font-size: 1.2rem; margin-bottom: 20px;">If you would be so kind as to go back until we find them. Thanks!</p>
      <a href="javascript:history.back()" style="color: #e63946; text-decoration: none; font-weight: bold; font-size: 1.1rem;">← Go back</a>
    </div>
      <div class="error-image">
      <img src="../../images/maid-service-cleaner-cleaning-domestic-worker-housekeeper-clean-life-62cf9955822d98773eea18763ae28090.png" alt="Cleaning Lady" style="width: 400px; height: auto; object-fit: cover;">
    </div>
  </div>`;
  }
  
  
  const button = document.createElement('button');
  button.innerHTML = `<i data-lucide="shopping-cart" class="lucide w-4 h-4"></i><span>Add</span>`;
  button.className = "btn btn-outline-dark w-100 d-flex align-items-center justify-content-center gap-1";
  button.onclick = () => addToCart(product._id, product.name, product.price, mainImage);
  
  document.querySelector('.addToCartButton').appendChild(button);
});

