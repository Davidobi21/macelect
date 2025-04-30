document.getElementById('signInForm').addEventListener('submit', async function (e) {
  e.preventDefault();

  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  // Basic validation
  if (!email || !password) {
    alert("Please fill in both email and password.");
    return;
  }

  // OTP auto-move
const inputs = document.querySelectorAll('#otpInputs input');
inputs.forEach((input, i) => {
  input.addEventListener('input', () => {
    if (input.value && i < inputs.length - 1) {
      inputs[i + 1].focus();
    }
  });
});

  // Log in logic: make an API call to authenticate
  try {
    const res = await fetch("http://localhost:5000/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();
    
    if (res.ok) {
      // On success, save the token and user ID and redirect
      localStorage.setItem("token", data.token);  // Save JWT token
      localStorage.setItem("userId", data.user.id);  // Save user ID
      console.log("Login successful. Token and userId saved:", { token: data.token, userId: data.user.id });
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
