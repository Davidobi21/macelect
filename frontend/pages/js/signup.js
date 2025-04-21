document.getElementById('signUpForm').addEventListener('submit', async function (e) {
  e.preventDefault();

  const fullName = document.getElementById('fullName').value;
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const confirmPassword = document.getElementById('confirmPassword').value;

  if (!fullName || !email || !password || !confirmPassword) return alert("Fill all fields.");
  if (password !== confirmPassword) return alert("Passwords do not match.");
  const strong = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/;
  if (!strong.test(password)) return alert("Password too weak.");

  try {
    const res = await fetch("http://localhost:5000/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: fullName, email, password }),
    });

    const data = await res.json();
    if (res.ok) {
      // Store email for OTP
      localStorage.setItem("otpEmail", email);

      // Hide signup form, show OTP
      document.getElementById('signUpForm').style.display = 'none';
      document.getElementById('otpSection').style.display = 'block';
    } else {
      alert(data.message);
    }
  } catch (err) {
    console.error(err);
    alert("Something went wrong");
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

// Verify OTP
document.getElementById('verifyBtn').addEventListener('click', async () => {
  const otp = Array.from(inputs).map(i => i.value).join('');
  const email = localStorage.getItem("otpEmail");

  try {
    const res = await fetch("http://localhost:5000/api/auth/verify-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, otp }),
    });

    const data = await res.json();
    if (res.ok) {
      alert("OTP verified successfully");
      window.location.href = "login.html";
    } else {
      alert(data.message || "OTP verification failed");
    }
  } catch (err) {
    console.error(err);
    alert("Failed to verify OTP");
  }
});
