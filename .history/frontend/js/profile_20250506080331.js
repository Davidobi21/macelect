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
});
