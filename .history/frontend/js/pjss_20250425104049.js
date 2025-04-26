document.addEventListener("DOMContentLoaded", () => {
    const params = new URLSearchParams(window.location.search);
    const productId = params.get("id");

    if (!productId || productId === "undefined") {
        console.error("Product ID is missing or invalid in the URL.");
        document.body.innerHTML = '<p class="text-danger">Product ID is missing. Please go back and select a product.</p>';
        return;
    }

    fetch(`http://localhost:5000/api/products/${productId}`)
        .then((res) => {
            if (!res.ok) {
                throw new Error(`Failed to fetch product. Status: ${res.status}`);
            }
            return res.json();
        })
        .then((product) => {
            if (!product) {
                console.error("Product not found.");
                document.body.innerHTML = '<p class="text-danger">Product not found. Please try again later.</p>';
                return;
            }

            // Set product name
            const productNameElement = document.querySelector("h1");
            if (productNameElement) {
                productNameElement.textContent = product.name;
            }

            // Set product category
            const productCategoryElement = document.querySelector(".product-category");
            if (productCategoryElement) {
                productCategoryElement.textContent = product.category || "Uncategorized";
            }

            // Set product price
            const productPriceElement = document.querySelector(".product-price");
            if (productPriceElement) {
                productPriceElement.textContent = product.price
                    ? `₦${product.price.toLocaleString()}`
                    : "Price not available";
            }

            // Set quick details
            const quickDetailsElement = document.querySelector(".quick-details");
            if (quickDetailsElement) {
                quickDetailsElement.textContent = product.quickDetails || "No details available.";
            }

            // Set shipping info
            const shippingInfoElement = document.querySelector(".shipping-info");
            if (shippingInfoElement) {
                shippingInfoElement.textContent = product.shippingInfo || "N/A";
            }

            // Set main product image
            const mainProductImageElement = document.querySelector(".main-product-image");
            if (mainProductImageElement) {
                mainProductImageElement.src = product.images?.[0]
                    ? `http://localhost:5000${product.images[0]}`
                    : "../images/default-main.jpg";
            }

            // Set thumbnails
            const thumbnails = document.querySelectorAll(".thumbnail");
            thumbnails.forEach((img, index) => {
                if (product.images?.[index]) {
                    img.src = `http://localhost:5000${product.images[index]}`;
                    img.addEventListener("click", () => {
                        if (mainProductImageElement) {
                            mainProductImageElement.src = img.src;
                        }
                    });
                }
            });

            // Set color options
            const colorContainer = document.querySelector(".color-options");
            if (colorContainer) {
                product.color?.forEach((clr) => {
                    const swatch = document.createElement("div");
                    swatch.className = "w-6 h-6 rounded-full border cursor-pointer";
                    swatch.style.backgroundColor = clr;
                    colorContainer.appendChild(swatch);
                });
            }

            // Set size options
            const sizeDropdown = document.querySelector(".size-dropdown");
            if (sizeDropdown) {
                product.size?.forEach((sz) => {
                    const option = document.createElement("option");
                    option.value = sz;
                    option.textContent = sz;
                    sizeDropdown.appendChild(option);
                });
            }

            // ✅ Fix tech specs rendering
            const tbody = document.querySelector("table tbody");
            if (tbody) {
                tbody.innerHTML = "";
                product.techSpecification?.forEach((spec) => {
                    const row = `<tr>
                        <td class="border border-gray-300 px-4 py-2">${spec.feature}</td>
                        <td class="border border-gray-300 px-4 py-2">${spec.detail}</td>
                    </tr>`;
                    tbody.insertAdjacentHTML("beforeend", row);
                });
            }
        })
        .catch((err) => {
            console.error("Product fetch error:", err);
            document.body.innerHTML = '<p class="text-danger">Failed to load product details. Please try again later.</p>';
        });
});
