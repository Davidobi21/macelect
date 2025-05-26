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
      response = await fetch('http://localhost:5000/api/users/userall', {
        headers: { Authorization: `Bearer ${accessToken}` }
      });
    }

    if (!response.ok) {
      throw new Error('Failed to fetch user profile');
    }

    const userData = await response.json();
    console.log('User Data:', userData);
    if (userData.success && userData.user) {
      const user = userData.user;
      // Update DOM elements with user info
      const profileImage = document.getElementById('profileImage');
      if (profileImage) {
        // Ensure correct backend URL for image
        const backendUrl = window.location.origin.includes('localhost')
          ? 'http://localhost:5000'
          : window.location.origin;
        let imagePath = user.image;
        if (imagePath && imagePath.startsWith('/uploads/')) {
          imagePath = backendUrl + imagePath;
        }
        profileImage.src = imagePath || 'default-profile.png';
      }
      const profileName = document.getElementById('profileName');
      if (profileName) profileName.textContent = user.name || '';
      const profileEmail = document.getElementById('profileEmail');
      if (profileEmail) profileEmail.textContent = user.email || '';
      const nameInput = document.getElementById('name');
      if (nameInput) nameInput.value = user.name || '';
      const emailInput = document.getElementById('email');
      if (emailInput) emailInput.value = user.email || '';
      const phoneInput = document.getElementById('phone');
      if (phoneInput) phoneInput.value = user.phone || '';
      const streetInput = document.getElementById('street');
      if (streetInput) streetInput.value = user.address?.street || '';
      const cityInput = document.getElementById('city');
      if (cityInput) cityInput.value = user.address?.city || '';
      const stateInput = document.getElementById('state');
      if (stateInput) stateInput.value = user.address?.state || '';
      const zipInput = document.getElementById('zip');
      if (zipInput) zipInput.value = user.address?.zip || '';
      const countryInput = document.getElementById('country');
      if (countryInput) countryInput.value = user.address?.country || '';
      // Sync preview image if present
      const accountImagePreview = document.getElementById('accountImagePreview');
      if (accountImagePreview) {
        // Use the same backend URL logic for the preview
        const backendUrl = window.location.origin.includes('localhost')
          ? 'http://localhost:5000'
          : window.location.origin;
        let imagePath = user.image;
        if (imagePath && imagePath.startsWith('/uploads/')) {
          imagePath = backendUrl + imagePath;
        }
        accountImagePreview.src = imagePath || 'default-profile.png';
      }
    }
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