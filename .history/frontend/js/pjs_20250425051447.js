document.addEventListener("DOMContentLoaded", async function () {
    // Initialize Lucide icons
    lucide.createIcons();
    // Sidebar toggle
    const hamburgerBtn = document.getElementById("hamburgerBtn");
    const closeSidebarBtn = document.getElementById("closeSidebarBtn");
    const sidebar = document.getElementById("sidebar");
    const sidebarOverlay = document.getElementById("sidebarOverlay");
  
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
  
    // Category button click
    categoryButtons.forEach(btn => {
      btn.addEventListener("click", function () {
        categoryButtons.forEach(b => b.classList.remove("bg-blue-100", "text-blue-800"));
        this.classList.add("bg-blue-100", "text-blue-800");
        filterProducts();
      });
    });
  
    // Search input
    searchInput.addEventListener("input", filterProducts);
  
    // Category checkboxes
    categoryCheckboxes.forEach(checkbox => {
      checkbox.addEventListener("change", filterProducts);
    });
  
    // Price slider
    priceSlider.addEventListener("input", function () {
      priceValue.textContent = this.value;
      filterProducts();
    });
    
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
                <div class="card h-100 shadow-lg rounded-lg overflow-hidden position-relative product-card" data-name="${product.name}" data-category="${category}" data-price="${product.price}">
                
                <!-- Product Image Swap -->
                <div class="card-img-container position-relative" style="height: 300px;">
                <!-- Main Image -->
                <img src="${mainImage}" class="card-img-top main-img rounded" alt="${product.name}" style="height: 100%; object-fit: cover;">
                
                <!-- Hover Image -->
                <img src="${hoverImage}" class="card-img-top hover-img position-absolute top-0 start-0 rounded" alt="Hover Image" style="height: 100%; width: 100%; object-fit: cover;">
                
                <!-- Optional Gradient Overlay -->
                <div class="overlay position-absolute top-0 bottom-0 start-0 end-0 bg-gradient-to-t from-black opacity-50"></div>
                  </div>
              
                  <div class="card-body text-center">
                  <h5 class="card-title font-bold text-truncate" style="max-width: 200px;">${product.name}</h5>
                  <p class="text-gray-500">Category: ${product.category}</p>
                  <p class="text-gray-500">Shipped in ${product.shippingInfo || 'N/A'}</p>
                  <p class="text-black font-bold">$${product.price}</p>
                    <div class="d-flex justify-content-between">
                    <button class="btn btn-outline-secondary flex-grow-1 me-2 position-relative">
                    <i data-lucide="shopping-cart" class="lucide"></i>
                    <span class="btn-label">Add to Cart</span>
                    </button>
                    <button class="btn bg-[#09128d] flex-grow-1 position-relative">
                    <i data-lucide="credit-card" class="lucide"></i>
                    <span class="btn-label">Buy Now</span>
                    </button>
                    </div>
                    </div>
                    
                    <!-- Sale Badge -->
                    ${product.sale ? `<div class="badge position-absolute top-0 start-0 m-3 bg-danger text-white rounded-pill px-3 py-1">SALE</div>` : ''}
                    </div>
                    </div>
                    `;

            // Append the product card to the product list container
            productContainer.innerHTML += productCard;
        });

        // Reinitialize productCards after dynamically adding products
        productCards = document.querySelectorAll(".product-card");

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
