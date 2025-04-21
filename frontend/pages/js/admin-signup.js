document.getElementById("adminSignupForm").addEventListener("submit", async (e) => {
    e.preventDefault();
  
    const email = document.getElementById("adminEmail").value;
    const password = document.getElementById("adminPassword").value;
  
    try {
      const res = await fetch("http://localhost:5000/api/admin/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
  
      const data = await res.json();
      if (res.ok) {
        alert("Admin created successfully!");
        window.location.href = "/frontend/pages/admin-login.html"; // Redirect to login page
      } else {
        alert(data.message || "Signup failed");
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    }
  });
  