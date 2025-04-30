document.addEventListener("DOMContentLoaded", () => {
  const signInForm = document.getElementById('signInForm');
  if (!signInForm) {
    console.error("Sign-in form not found. Ensure the form has id='signInForm'.");
    return;
  }

  signInForm.addEventListener('submit', async function (e) {
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

      if (!res.ok) {
        const error = await res.json().catch(() => ({ message: "Server error" }));
        console.error("Login failed:", error);
        alert(error.message || "Login failed. Please try again.");
        return;
      }

      const data = await res.json();
      console.log("Login successful:", data);

      // On success, save the token and user ID and redirect
      localStorage.setItem("token", data.token);  // Save JWT token
      localStorage.setItem("userId", data.user.id);  // Save user ID
      alert("Login successful!");
      window.location.href = "../index.html";  // Redirect to homepage or dashboard
    } catch (err) {
      console.error("Error during login:", err);
      alert("An error occurred during login. Please try again.");
    }
  });

  // OTP auto-move
  const inputs = document.querySelectorAll('#otpInputs input');
  inputs.forEach((input, i) => {
    input.addEventListener('input', () => {
      if (input.value && i < inputs.length - 1) {
        inputs[i + 1].focus();
      }
    });
  });
});
