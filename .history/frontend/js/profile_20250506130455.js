document.addEventListener("DOMContentLoaded", () => {
    const userProfileButton = document.getElementById("userProfileButton");
    const userDropdown = document.getElementById("userDropdown");
    const logoutButton = document.getElementById("logoutButton");
  
    // Toggle dropdown visibility
    userProfileButton.addEventListener("click", () => {
      userDropdown.classList.toggle("hidden");
    });
  
    // Close dropdown when clicking outside
    document.addEventListener("click", (e) => {
      if (!userProfileButton.contains(e.target) && !userDropdown.contains(e.target)) {
        userDropdown.classList.add("hidden");
      }
    });

    logoutButton.addEventListener("click", () => {
        Swal.fire({
          icon: "warning",
          title: "Logout",
          text: "Are you sure you want to logout?",
          showCancelButton: true,
          confirmButtonText: "Yes, Logout",
          cancelButtonText: "Cancel",
        }).then((result) => {
          if (result.isConfirmed) {
            localStorage.clear(); // Clear user data
            window.location.href = "./login.html"; // Redirect to login page
          }
        });
      });

    // Fetch and display user profile
    const token = localStorage.getItem("token");
    fetch("http://localhost:5000/api/users", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          document.getElementById("name").value = data.user.name;
          document.getElementById("email").value = data.user.email;
        }
      })
      .catch((err) => console.error("Error fetching profile:", err));

    // Update profile
    document.getElementById("profileForm").addEventListener("submit", (e) => {
      e.preventDefault();
      const name = document.getElementById("name").value;

      fetch("http://localhost:5000/api/users/update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            Swal.fire("Success", "Profile updated successfully!", "success");
          } else {
            Swal.fire("Error", data.message || "Failed to update profile.", "error");
          }
        })
        .catch((err) => console.error("Error updating profile:", err));
    });

    // Fetch and display user orders
    const ordersContainer = document.getElementById("ordersContainer");
    fetch("http://localhost:5000/api/", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          data.orders.forEach((order) => {
            const orderElement = document.createElement("div");
            orderElement.className = "order-item";
            orderElement.innerHTML = `
              <h3>Order #${order.id}</h3>
              <p>Date: ${new Date(order.date).toLocaleDateString()}</p>
              <p>Total: $${order.total}</p>
              <ul>
                ${order.items
                  .map(
                    (item) => `<li>${item.name} - Quantity: ${item.quantity}</li>`
                  )
                  .join("")}
              </ul>
            `;
            ordersContainer.appendChild(orderElement);
          });
        } else {
          ordersContainer.innerHTML = "<p>No orders found.</p>";
        }
      })
      .catch((err) => console.error("Error fetching orders:", err));

    // Fetch and update user address
    const addressForm = document.getElementById("addressForm");
    fetch("http://localhost:5000/api/users/", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          document.getElementById("address").value = data.address;
        }
      })
      .catch((err) => console.error("Error fetching address:", err));

    addressForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const address = document.getElementById("address").value;

      fetch("http://localhost:5000/api/users/update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ address }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            Swal.fire("Success", "Address updated successfully!", "success");
          } else {
            Swal.fire("Error", data.message || "Failed to update address.", "error");
          }
        })
        .catch((err) => console.error("Error updating address:", err));
    });

    // Dynamically populate user profile data
    fetch("http://localhost:5000/api/users/", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          document.getElementById("profileImage").src = data.user.image || "default-profile.png";
          document.getElementById("profileName").textContent = data.user.name;
          document.getElementById("profileEmail").textContent = data.user.email;
        }
      })
      .catch((err) => console.error("Error fetching profile data:", err));

    const sidebarButtons = document.querySelectorAll('aside nav button');
    const pages = {
      dashboard: document.getElementById('page-dashboard'),
      orders: document.getElementById('page-orders'),
      account: document.getElementById('page-account'),
      address: document.getElementById('page-address'),
      logout: document.getElementById('page-logout'),
    };
    const breadcrumbText = document.getElementById('breadcrumb-text');

    function setActiveSidebar(button) {
      sidebarButtons.forEach(btn => {
        btn.classList.remove('bg-[#2563EB]', 'text-white', 'font-semibold');
        btn.classList.add('text-[#475569]', 'font-normal');
        btn.setAttribute('aria-current', 'false');
      });
      button.classList.add('bg-[#2563EB]', 'text-white', 'font-semibold');
      button.classList.remove('text-[#475569]', 'font-normal');
      button.setAttribute('aria-current', 'page');
    }

    function showPage(pageKey) {
      Object.keys(pages).forEach(key => {
        if (key === pageKey) {
          pages[key].classList.remove('hidden');
        } else {
          pages[key].classList.add('hidden');
        }
      });
      // Update breadcrumb text
      let textMap = {
        dashboard: 'Dashboard',
        orders: 'Recent Orders',
        account: 'Account Details',
        address: 'Address',
        logout: 'Logout',
      };
      breadcrumbText.textContent = textMap[pageKey] || 'My Account';
    }

    // Initialize with dashboard active
    setActiveSidebar(document.querySelector('aside nav button[data-page="dashboard"]'));
    showPage('dashboard');

    sidebarButtons.forEach(button => {
      button.addEventListener('click', () => {
        const page = button.getAttribute('data-page');
        setActiveSidebar(button);
        showPage(page);
      });
    });

    // Optional: prevent form submission reload
    document.getElementById('accountForm').addEventListener('submit', e => {
      e.preventDefault();
      alert('Account details saved!');
    });
    document.getElementById('addressForm').addEventListener('submit', e => {
      e.preventDefault();
      alert('Address saved!');
    });


});
