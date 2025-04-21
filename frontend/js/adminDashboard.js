// On loading the dashboard page
const token = localStorage.getItem('adminToken');  // Retrieve the token

if (!token) {
  // If there's no token, redirect to login page
  window.location.href = '/pages/admin-login.html'; // Admin login page
} else {
  // If there's a token, fetch data for the dashboard
  fetch('http://localhost:5000/admin/dashboard', {
    method: 'GET',
        headers: {
    'Authorization': 'Bearer ' + token,
    'Content-Type': 'application/json'
  }
  })
  .then(response => response.json())
  .then(data => {
    if (data.message) {
      console.error('Access Denied:', data.message);
    } else {
      console.log('Dashboard data:', data);  // Process and display the data here
    }
  })
  .catch(error => console.error('Error:', error));
}
