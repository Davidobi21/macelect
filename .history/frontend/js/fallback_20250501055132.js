document.addEventListener('DOMContentLoaded', () => {
  const validRoutes = ['/', '/products.html', '/aboutus.html', '/fqa.html']; // Add all valid routes here
  const currentPath = window.location.pathname;

  if (!validRoutes.includes(currentPath)) {
    window.location.href = '/pages/404.html'; // Redirect to 404 page
  }
});
