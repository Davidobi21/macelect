// js/productDetail.js
document.addEventListener("DOMContentLoaded", () => {
    const params = new URLSearchParams(window.location.search);
    const productId = params.get("id");
  
    if (!productId) return;
  
    fetch(`http://localhost:5000/api/products/${productId}`)
      .then((res) => res.json())
      .then((product) => {
        if (!product) return;
  
        document.querySelector("h1").textContent = product.name;
        document.querySelector(".product-category").textContent = product.category;
        
        if (product.price) {
            document.querySelector(".product-price").textContent = `₦${product.price.toLocaleString()}`;
        } else {
            document.querySelector(".product-price").textContent = "Price not available";
        }
        
        document.querySelector(".quick-details").textContent = product.quickDetails;
        document.querySelector(".shipping-info").textContent = product.shippingInfo;
  
        document.querySelector(".main-product-image").src = `http://localhost:5000${product.images[0]}`;
  
        const thumbnails = document.querySelectorAll(".thumbnail");
        thumbnails.forEach((img, index) => {
          if (product.images[index]) {
            img.src = `http://localhost:5000${product.images[index]}`;
            img.addEventListener("click", () => {
              document.querySelector(".main-product-image").src = img.src;
            });
          }
        });
  
        const colorContainer = document.querySelector(".color-options");
        product.color.forEach((clr) => {
          const swatch = document.createElement("div");
          swatch.className = "w-6 h-6 rounded-full border cursor-pointer";
          swatch.style.backgroundColor = clr;
          colorContainer.appendChild(swatch);
        });
  
        const sizeDropdown = document.querySelector(".size-dropdown");
        product.size.forEach((sz) => {
          const option = document.createElement("option");
          option.value = sz;
          option.textContent = sz;
          sizeDropdown.appendChild(option);
        });
  
        const tbody = document.querySelector("table tbody");
        tbody.innerHTML = "";
        for (const [feature, detail] of Object.entries(product.techSpecification)) {
          const row = `<tr>
            <td class="border border-gray-300 px-4 py-2">${feature}</td>
            <td class="border border-gray-300 px-4 py-2">${detail}</td>
          </tr>`;
          tbody.insertAdjacentHTML("beforeend", row);
        }
      })
      .catch((err) => console.error("Product fetch error:", err));
  });
