document.addEventListener("DOMContentLoaded", async function () {
  try {
    lucide.createIcons();
    console.log("Lucide icons initialized successfully.");
  } catch (err) {
    console.error("Error initializing Lucide icons:", err);
  }

  // Sidebar toggle
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

  // Product Filtering Logic
  const searchInput = document.getElementById("searchInput");
  const categoryButtons = document.querySelectorAll(".filter-btn");
  const categoryCheckboxes = document.querySelectorAll(".category-checkbox");
  const priceSlider = document.getElementById("priceSlider");
  const priceValue = document.getElementById("priceValue");
  let productCards = document.querySelectorAll(".product-card");

  function filterProducts() {
    const searchText = searchInput.value.toLowerCase();
    const selectedCategory = document.querySelector(".filter-btn.bg-blue-100")?.dataset.category || "all";
    const checkedCategories = Array.from(categoryCheckboxes)
      .filter(checkbox => checkbox.checked)
      .map(checkbox => checkbox.value.toLowerCase());
    const maxPrice = parseFloat(priceSlider.value);

    console.log("Filtering products...");
    console.log("Search Text:", searchText);
    console.log("Selected Category:", selectedCategory);
    console.log("Checked Categories:", checkedCategories);
    console.log("Max Price:", maxPrice);

    productCards.forEach(card => {
      const name = card.dataset.name.toLowerCase();
      const category = card.dataset.category.toLowerCase();
      const price = parseFloat(card.dataset.price);

      console.log("Product:", { name, category, price });

      const matchesSearch = name.includes(searchText);
      const matchesCategoryBtn = selectedCategory === "all" || category === selectedCategory;
      const matchesSidebarCat = checkedCategories.length === 0 || checkedCategories.includes(category);
      const matchesPrice = price <= maxPrice;

      console.log("Matches Search:", matchesSearch);
      console.log("Matches Category Button:", matchesCategoryBtn);
      console.log("Matches Sidebar Category:", matchesSidebarCat);
      console.log("Matches Price:", matchesPrice);

      if (matchesSearch && matchesCategoryBtn && matchesSidebarCat && matchesPrice) {
        card.style.display = "block";
      } else {
        card.style.display = "none";
      }
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

  try {
    // Fetch products from the backend
    const response = await fetch('http://localhost:5000/api/products'); // Ensure this matches your backend API endpoint
    const products = await response.json();

    console.log("Fetched Products:", products); // Debugging log to inspect the API response

    // Get the product list container in the DOM
    const productContainer = document.getElementById('product-list');

    if (!productContainer) {
      console.error("Product container (#product-list) not found in the DOM.");
      return;
    }

    // Clear any previous content
    productContainer.innerHTML = '';

    // Determine the maximum price from the products
    const maxProductPrice = Math.max(...products.map(product => product.price));
    console.log("Max Product Price:", maxProductPrice);

    // Update the price slider's max value and initial value
    priceSlider.max = maxProductPrice;
    priceSlider.value = maxProductPrice;
    priceValue.textContent = maxProductPrice;

    // Loop through products and generate HTML for each card
    products.forEach(product => {
      console.log("Processing Product:", product); // Debugging log for each product

      const mainImage = product.images?.[0] ? `http://localhost:5000${product.images[0]}` : '';
      const hoverImage = product.images?.[1] ? `http://localhost:5000${product.images[1]}` : mainImage;
      const category = product.category?.toLowerCase() || 'unknown'; // Handle missing category gracefully

      if (!product.name || !product.price) {
        console.warn("Skipping product due to missing name or price:", product);
        return;
      }

      const productCard = `
      <div class="col">
        <div class="product-card position-relative overflow-hidden rounded-4 shadow-lg" data-name="${product.name}" data-category="${category}" data-price="${product.price}">

          <!-- Image w/ hover zoom -->
          <div class="brand-img-wrapper position-relative">
            <img src="${mainImage}" class="main-img w-100 h-100 object-fit-cover" alt="${product.name}">
            <img src="${hoverImage}" class="hover-img w-100 h-100 object-fit-cover position-absolute top-0 start-0" alt="Alt Image">
            
            <!-- Tagline Overlay -->
            <div class="position-absolute bottom-0 start-0 end-0 p-3 d-flex justify-content-between align-items-center bg-dark bg-opacity-50 text-white fw-bold fs-6">
              <span class="text-uppercase">${product.category}</span>
              <span>₦${product.price.toLocaleString()}</span>
            </div>
          </div>

          <!-- Text Content -->
          <div class="p-4 bg-white">
            <h5 class="fw-bold text-dark mb-2">${product.name}</h5>
            <p class="text-muted small mb-3">Ships in ${product.shippingInfo || 'N/A'}</p>
            
            <div class="d-flex justify-content-between gap-2">
              <button class="btn btn-outline-dark w-100 d-flex align-items-center justify-content-center gap-1">
                <i data-lucide="shopping-cart" class="lucide w-4 h-4"></i>
                <span>Add</span>
              </button>
              <button class="btn w-100 d-flex align-items-center justify-content-center gap-1 text-white" style="background: #000;">
                <i data-lucide="zap" class="lucide w-4 h-4"></i>
                <span>Buy Now</span>
              </button>
            </div>
          </div>

          <!-- Floating SALE badge -->
          ${product.sale ? `<div class="position-absolute top-0 start-0 bg-danger text-white px-3 py-1 rounded-end-4 fs-6 fw-semibold">SALE</div>` : ''}
        </div>
      </div>
      `;

      // Append the product card to the product list container
      productContainer.innerHTML += productCard;
    });

    // Reinitialize Lucide icons after dynamic content is added
    lucide.createIcons(); // ⬅️ Re-render icons after adding product cards

    // Reinitialize productCards after dynamically adding products
    productCards = document.querySelectorAll(".product-card");

    // Reattach event listeners to ensure they work on dynamically loaded products
    reattachEventListeners();

    // Initial filter
    filterProducts();

  } catch (err) {
    console.error('Error fetching products:', err);
    const productContainer = document.getElementById('product-list');
    if (productContainer) {
      productContainer.innerHTML = '<p class="text-danger">Failed to load products. Please try again later.</p>';
    }
  }
});
