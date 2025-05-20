document.addEventListener("DOMContentLoaded", () => {
  const token = localStorage.getItem("token");

  fetch("http://localhost:5000/api/wishlist", {
    headers: { Authorization: `Bearer ${token}` },
  })
    .then((res) => res.json())
    .then((data) => {
      const container = document.getElementById("wishlistContainer");
      container.innerHTML = "";

      if (data.wishlist && data.wishlist.length > 0) {
        data.wishlist.forEach((item) => {
          const card = document.createElement("div");
          card.className = "col-md-4 mb-4";
          card.innerHTML = `
            <div class="card">
              <img src="${item.image}" class="card-img-top" alt="${item.name}">
              <div class="card-body">
                <h5 class="card-title">${item.name}</h5>
                <p class="card-text">₦${item.price.toLocaleString()}</p>
                <button class="btn btn-danger" data-id="${item._id}">Remove</button>
              </div>
            </div>
          `;
          container.appendChild(card);
        });

        document.querySelectorAll(".btn-danger").forEach((btn) => {
          btn.addEventListener("click", (e) => {
            const productId = e.target.dataset.id;
            fetch(`http://localhost:5000/api/wishlist/${productId}`, {
              method: "DELETE",
              headers: { Authorization: `Bearer ${token}` },
            })
              .then((res) => res.json())
              .then(() => {
                e.target.closest(".card").remove();
              })
              .catch((err) => console.error("Error removing item:", err));
          });
        });
      } else {
        container.innerHTML = '<p class="text-center">Your wishlist is empty.</p>';
      }
    })
    .catch((err) => console.error("Error fetching wishlist:", err));
});
