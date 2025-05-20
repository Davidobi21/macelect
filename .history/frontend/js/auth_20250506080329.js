async function login() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  try {
    const response = await fetch("http://localhost:5000/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const error = await response.json();
      Swal.fire({
        icon: "error",
        title: "Login Failed",
        text: error.message || "Invalid credentials.",
      });
      return;
    }

    const data = await response.json();
    localStorage.setItem("token", data.token);
    Swal.fire({
      icon: "success",
      title: "Login Successful",
      text: "Welcome back!",
    }).then(() => {
      window.location.href = "/index.html";
    });
  } catch (error) {
    console.error("Error during login:", error);
    Swal.fire({
      icon: "error",
      title: "Error",
      text: "An error occurred during login. Please try again.",
    });
  }
}
