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

            // 🔥 Load Related Products
            fetch("http://localhost:5000/api/products")
            .then(res => res.json())
            .then((allProducts) => {
                const related = allProducts
                    .filter(p => 
                        p.category?.toLowerCase() === product.category?.toLowerCase() &&
                        p._id !== product._id
                    )
                    .slice(0, 4);

                const container = document.querySelector(".relatedproductscontainer");
                if (container) return;

                related.forEach((product) => {
                    const mainImage = product.images?.[0] ? `http://localhost:5000${product.images[0]}` : "../images/default-main.jpg";
                    const hoverImage = product.images?.[1] ? `http://localhost:5000${product.images[1]}` : mainImage;
                    const category = product.category?.toLowerCase() || "unknown";

                    const cardHTML = `
                        <div class="col">
                            <div class="product-card position-relative overflow-hidden rounded-4 shadow-lg"
                                data-id="${product._id}" 
                                data-name="${product.name}" 
                                data-category="${category}" 
                                data-price="${product.price}">

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
                                        <button class="btn btn-outline-dark w-100 d-flex align-items-center justify-content-center gap-1">
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

                    container.innerHTML += cardHTML;
                });
            })
            .catch((err) => {
                console.error("Product fetch error:", err);
                document.body.innerHTML = '<p class="text-danger">Failed to load related products. Please try again later.</p>';
            });
        })
        .catch((err) => {
            console.error("Product fetch error:", err);
            document.body.innerHTML = '<p class="text-danger">Failed to load product details. Please try again later.</p>';
        });
});
