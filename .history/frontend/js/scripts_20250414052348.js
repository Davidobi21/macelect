// scripts.js
// This file contains JavaScript code for the frontend of the application
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

// Function to toggle the visibility of the sidebar
    // function toggleSidebar() {
    // const toggleSidebarButton = document.getElementById("toggleSidebar");
    // const sidebar = document.querySelector(".lg\\:fixed");
    // }
  
    // if (toggleSidebarButton && sidebar) {
    //   toggleSidebarButton.addEventListener("click", () => {
    //     sidebar.classList.toggle("-translate-x-full");
    //   });
    // }

  
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