const token = localStorage.getItem('token');

function isTokenExpired(token) {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.exp * 1000 < Date.now();
  } catch (e) {
    return true; // If parsing fails, consider the token expired
  }
}

if (isTokenExpired(token)) {
  Swal.fire({
    icon: 'warning',
    title: 'Session Expired',
    text: 'Your session has expired. Please log in again.',
    confirmButtonText: 'Login'
  }).then(() => {
    localStorage.removeItem('token');
    window.location.href = './login.html';
  });
}

async function refreshAccessToken() {
  try {
    const refreshToken = localStorage.getItem('refreshToken');
    const response = await fetch('/api/auth/refresh', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken })
    });

    if (!response.ok) {
      throw new Error('Failed to refresh access token');
    }

    const data = await response.json();
    localStorage.setItem('token', data.accessToken);
    return data.accessToken;
  } catch (error) {
    console.error('Error refreshing access token:', error);
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    window.location.href = './login.html';
  }
}

async function fetchUserProfile() {
  try {
    let accessToken = localStorage.getItem('token');
    let response = await fetch('/api/users', {
      headers: { Authorization: `Bearer ${accessToken}` }
    });

    if (response.status === 401) {
      accessToken = await refreshAccessToken();
      response = await fetch('http://localhost:5000/api/users/', {
        headers: { Authorization: `Bearer ${accessToken}` }
      });
    }

    if (!response.ok) {
      throw new Error('Failed to fetch user profile');
    }

    const userData = await response.json();
    console.log('User Data:', userData);
    // ...existing code to handle user data...
  } catch (error) {
    console.error('Error fetching user profile:', error);
  }
}

async function fetchUserOrders() {
  try {
    let accessToken = localStorage.getItem('token');
    let response = await fetch('/api/order/user', {
      headers: { Authorization: `Bearer ${accessToken}` }
    });

    if (response.status === 401) {
      accessToken = await refreshAccessToken();
      response = await fetch('/api/order/user', {
        headers: { Authorization: `Bearer ${accessToken}` }
      });
    }

    if (!response.ok) {
      throw new Error('Failed to fetch user orders');
    }

    const ordersData = await response.json();
    console.log('Orders Data:', ordersData);
    // ...existing code to handle orders data...
  } catch (error) {
    console.error('Error fetching orders:', error);
  }
}