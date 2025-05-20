document.addEventListener("DOMContentLoaded", () => {
  const userProfileButton = document.getElementById("userProfileButton");
  const userDropdown = document.getElementById("userDropdown");
  const logoutButton = document.getElementById("logoutButton");

  if (userProfileButton && userDropdown) {
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
  }

  if (logoutButton) {
    // Logout functionality
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
  }

  // Fetch user details
  const token = localStorage.getItem("token");
  if (token) {
    fetch("http://localhost:5000/api/user/profile", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          document.getElementById("userProfileName").textContent = data.user.name;
        }
      })
      .catch((err) => console.error("Error fetching user details:", err));
  }
});
