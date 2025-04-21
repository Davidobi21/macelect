document.getElementById('adminLoginForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const email = document.getElementById('adminEmail').value;
  const password = document.getElementById('adminPassword').value;

  try {
    const res = await fetch('http://localhost:5000/api/admin/login', {
      method: 'POST',
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();

    if (res.ok) {
      // Store the token in localStorage
      localStorage.setItem('adminToken', data.token);

      // Redirect to the admin dashboard
      alert('Welcome back, Admin!');
      window.location.href = './admin-dashboard.html'; // Redirect to the dashboard page
    } else {
      alert(data.message || 'Invalid admin credentials');
    }
  } catch (err) {
    console.error(err);
    alert('Login failed. Please try again later.');
  }
});
// On page load or when accessing the dashboard page
const token = localStorage.getItem('adminToken');  // Retrieve the token

if (token) {
  fetch('http://localhost:5000/admin/dashboard', {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,  // Send the token in the Authorization header
    }
  })
  .then(response => response.json())
  .then(data => {
    if (data.message) {
      console.error('Access Denied:', data.message);
    } else {
      console.log('Dashboard data:', data);  // Process your data here
    }
  })
  .catch(error => console.error('Error:', error));
} else {
  console.error('No token found');
}
