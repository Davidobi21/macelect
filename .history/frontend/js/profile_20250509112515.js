import Swal from 'sweetalert2';

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