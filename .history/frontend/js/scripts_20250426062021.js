// scripts.js
// This file contains JavaScript code for the frontend of the application
document.addEventListener("DOMContentLoaded", async function () {
  const productContainer = document.getElementById("homepage-product-list");

  if (!productContainer) return;

  try {
    const response = await fetch('http://localhost:5000/api/products');
    const products = await response.json();

    // Select 4 random products
    const randomProducts = products.sort(() => 0.5 - Math.random()).slice(0, 4);

    randomProducts.forEach(product => {
      const mainImage = product.images?.[0] ? `http://localhost:5000${product.images[0]}` : "../images/default-main.jpg";
      const hoverImage = product.images?.[1] ? `http://localhost:5000${product.images[1]}` : mainImage;

      const productCard = `
        <div class="col">
          <div class="card h-100 shadow-lg rounded-lg overflow-hidden position-relative product-card"
            data-name="${product.name}" 
            data-category="${product.category}" 
            data-price="${product.price}">
            <div class="card-img-container position-relative" style="height: 300px;">
              <img src="${mainImage}" class="card-img-top main-img rounded" alt="${product.name}" style="height: 100%; object-fit: cover;">
              <img src="${hoverImage}" class="card-img-top hover-img position-absolute top-0 start-0 rounded" alt="Hover Image" style="height: 100%; width: 100%; object-fit: cover;">
              <div class="overlay position-absolute top-0 bottom-0 start-0 end-0 bg-gradient-to-t from-black opacity-50"></div>
            </div>
            <div class="card-body text-center">
              <h5 class="card-title font-bold text-truncate" style="max-width: 200px;">${product.name}</h5>
              <p class="text-gray-500">Shipped in ${product.shippingInfo || 'N/A'}</p>
              <p class="text-black font-bold">₦${product.price.toLocaleString()}</p>
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
            ${product.sale ? `<div class="badge position-absolute top-0 start-0 m-3 bg-danger text-white rounded-pill px-3 py-1">SALE</div>` : ''}
          </div>
        </div>
      `;

      productContainer.innerHTML += productCard;
    });

    lucide.createIcons();
  } catch (err) {
    console.error("Error fetching products:", err);
    productContainer.innerHTML = '<p class="text-danger">Failed to load products. Please try again later.</p>';
  }
});

document.addEventListener("DOMContentLoaded", () => {
  lucide.createIcons();
  const mobileBtn = document.getElementById('mobileMenuButton');
  const mobileMenu = document.getElementById('mobileMenu');

  mobileBtn.addEventListener('click', () => {
    mobileMenu.classList.toggle('hidden');
  });
  function toggleDrawer() {
    const drawer = document.getElementById('mobileDrawer');
    drawer.classList.toggle('-translate-x-full');
  }

  const categoriesButton = document.getElementById('categoriesButton');
  const dropdownMenu = categoriesButton.nextElementSibling;

  let dropdownVisible = false;

  // Toggle dropdown on button click
  categoriesButton.addEventListener('click', (event) => {
    event.stopPropagation();
    dropdownVisible = !dropdownVisible;
    toggleDropdown();
  });

  // Hover effect for showing/hiding dropdown
  categoriesButton.addEventListener('mouseenter', () => {
    if (!dropdownVisible) {
      dropdownMenu.classList.remove('hidden');
      setTimeout(() => {
        dropdownMenu.classList.remove('opacity-0', 'scale-95');
        dropdownMenu.classList.add('opacity-100', 'scale-100');
      }, 10); // Slight delay for smooth animation
    }
  });

  categoriesButton.addEventListener('mouseleave', () => {
    if (!dropdownVisible) {
      setTimeout(() => {
        dropdownMenu.classList.add('hidden');
      }, 300); // Delay for smooth animation before hiding
      dropdownMenu.classList.remove('opacity-100', 'scale-100');
      dropdownMenu.classList.add('opacity-0', 'scale-95');
    }
  });

  // Close dropdown if clicked outside
  document.addEventListener('click', (event) => {
    if (!categoriesButton.contains(event.target) && !dropdownMenu.contains(event.target)) {
      dropdownVisible = false;
      toggleDropdown();
    }
  });

  // Toggle dropdown visibility function
  function toggleDropdown() {
    if (dropdownVisible) {
      dropdownMenu.classList.remove('hidden');
      setTimeout(() => {
        dropdownMenu.classList.remove('opacity-0', 'scale-95');
        dropdownMenu.classList.add('opacity-100', 'scale-100');
      }, 10); // Slight delay for smooth animation
    } else {
      dropdownMenu.classList.add('opacity-0', 'scale-95');
      setTimeout(() => {
        dropdownMenu.classList.add('hidden');
      }, 300); // Wait for the transition before hiding
    }
  }

  const counters = document.querySelectorAll('.counter');

  counters.forEach(counter => {
    const updateCount = () => {
      const target = +counter.getAttribute('data-target');
      let count = +counter.innerText;
      const increment = 1;

      if (count < target) {
        count = Math.min(count + increment, target);
        counter.innerText = count.toFixed(0);
        setTimeout(updateCount, 10);
      } else {
        counter.innerText = target;
      }
    };

    updateCount();
  });

  const searchInput = document.getElementById('searchInput');
  const priceSlider = document.getElementById('priceSlider');
  const priceValue = document.getElementById('priceValue');
  const productCards = document.querySelectorAll('.product-card');
  const categoryButtons = document.querySelectorAll('.filter-btn');
  const categoryCheckboxes = document.querySelectorAll('.category-checkbox');

  // Live Search
  searchInput.addEventListener('input', filterProducts);

  // Category Button Filter
  categoryButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('bg-blue-100', 'text-blue-800'));
      btn.classList.add('bg-blue-100', 'text-blue-800');
      filterProducts();
    });
  });

  // Category Checkbox Filter
  categoryCheckboxes.forEach(cb => cb.addEventListener('change', filterProducts));

  // Price Filter
  priceSlider.addEventListener('input', () => {
    priceValue.textContent = priceSlider.value;
    filterProducts();
  });

  function filterProducts() {
    const query = searchInput.value.toLowerCase();
    const maxPrice = parseFloat(priceSlider.value);
    const activeCategory = document.querySelector('.filter-btn.bg-blue-100')?.dataset.category;
    const selectedChecks = Array.from(categoryCheckboxes).filter(c => c.checked).map(c => c.value);

    productCards.forEach(card => {
      const name = card.dataset.name.toLowerCase();
      const category = card.dataset.category;
      const price = parseFloat(card.dataset.price);

      const matchesSearch = name.includes(query);
      const matchesPrice = price <= maxPrice;
      const matchesCategoryBtn = (activeCategory === "All" || category === activeCategory);
      const matchesCategoryCheck = selectedChecks.length === 0 || selectedChecks.includes(category);

      if (matchesSearch && matchesPrice && matchesCategoryBtn && matchesCategoryCheck) {
        card.style.display = 'block';
      } else {
        card.style.display = 'none';
      }
    });
  }
});