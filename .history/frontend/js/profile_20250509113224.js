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

async function fetchUserProfile() {
  try {
    const response = await fetch('/api/users', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    if (response.status === 401) {
      const data = await response.json();
      if (data.message === 'Token expired') {
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
    } else if (!response.ok) {
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
    const response = await fetch('/api/order/user', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    if (response.status === 401) {
      const data = await response.json();
      if (data.message === 'Token expired') {
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
    } else if (!response.ok) {
      throw new Error('Failed to fetch user orders');
    }

    const ordersData = await response.json();
    console.log('Orders Data:', ordersData);
    // ...existing code to handle orders data...
  } catch (error) {
    console.error('Error fetching orders:', error);
  }
}