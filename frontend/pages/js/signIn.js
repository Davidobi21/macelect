document.getElementById('signInForm').addEventListener('submit', async function (e) {
  e.preventDefault();

  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  // Basic validation
  if (!email || !password) {
    alert("Please fill in both email and password.");
    return;
  }

  // Log in logic: make an API call to authenticate
  try {
    const res = await fetch("http://localhost:5000/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();
    
    if (res.ok) {
      // On success, save the token or user info and redirect
      localStorage.setItem("token", data.token);  // Save JWT token or user info
      alert("Login successful!");
      window.location.href = "../index.html";  // Redirect to homepage or dashboard
    } else {
      // Handle any errors like incorrect login credentials
      alert(data.message || "Invalid credentials.");
    }
  } catch (err) {
    console.error(err);
    alert("An error occurred during login. Please try again.");
  }
});
