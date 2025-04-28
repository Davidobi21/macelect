const params = new URLSearchParams(window.location.search);
const productId = params.get("id");
if (!productId) return;

fetch(`http://localhost:5000/api/products/${productId}`)
  .then((res) => res.json())
  .then((product) => {
    if (!product) return;

    // Main content
    document.querySelector("h1").textContent = product.name || "Unnamed Product";
    document.querySelector(".product-category").textContent = product.category || "Unknown";
    document.querySelector(".product-price").textContent = `₦${product.price?.toLocaleString() || "0"}`;
    document.querySelector(".quick-details").textContent = product.quickDetails || "No details available.";
    document.querySelector(".shipping-info").textContent = product.shippingInfo || "Shipping info not available.";

    // Image
    const mainImage = product.images?.[0] || "../images/default-main.jpg";
    document.querySelector(".main-product-image").src = `http://localhost:5000${mainImage}`;

    // Thumbnails
    const thumbnails = document.querySelectorAll(".thumbnail");
    thumbnails.forEach((img, index) => {
      if (product.images?.[index]) {
        img.src = `http://localhost:5000${product.images[index]}`;
        img.addEventListener("click", () => {
          document.querySelector(".main-product-image").src = `http://localhost:5000${product.images[index]}`;
        });
      }
    });

    // Color swatches
    const colorContainer = document.querySelector(".color-options");
    if (product.color && Array.isArray(product.color)) {
      colorContainer.innerHTML = "";
      product.color.forEach((clr) => {
        const swatch = document.createElement("div");
        swatch.className = "w-6 h-6 rounded-full border cursor-pointer";
        swatch.style.backgroundColor = clr;
        colorContainer.appendChild(swatch);
      });
    }

    // Size dropdown
    const sizeDropdown = document.querySelector(".size-dropdown");
    if (product.size && Array.isArray(product.size)) {
      sizeDropdown.innerHTML = "";
      product.size.forEach((sz) => {
        const option = document.createElement("option");
        option.value = sz;
        option.textContent = sz;
        sizeDropdown.appendChild(option);
      });
    }

    // Tech Spec Table
    const tbody = document.querySelector("table tbody");
    tbody.innerHTML = "";
    if (product.techSpecification && typeof product.techSpecification === "object") {
      for (const [feature, detail] of Object.entries(product.techSpecification)) {
        const row = `<tr>
          <td class="border border-gray-300 px-4 py-2">${feature}</td>
          <td class="border border-gray-300 px-4 py-2">${detail}</td>
        </tr>`;
        tbody.insertAdjacentHTML("beforeend", row);
      }
    }
  })
  .catch((err) => {
    console.error("Product fetch error:", err);
  });