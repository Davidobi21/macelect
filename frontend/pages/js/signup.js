document.getElementById('signUpForm').addEventListener('submit', function(e) {
    e.preventDefault();
  
    const fullName = document.getElementById('fullName').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
  
    // Basic validation
    if (!fullName || !email || !password || !confirmPassword) {
      alert("Please fill in all fields.");
      return;
    }
  
    // Password and Confirm Password matching validation
    if (password !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }
  
    // Check if password is strong (you can customize this condition)
    const passwordStrength = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordStrength.test(password)) {
      alert("Password must be at least 8 characters long and contain both letters and numbers.");
      return;
    }
  
    // Sign up logic (e.g., make an API call to create a new user)
    console.log("Signing up with:", fullName, email, password);
  
    // If successful, redirect to the sign-in page
    window.location.href = "../login.html"; // Redirect to sign-in page after successful sign-up
  });