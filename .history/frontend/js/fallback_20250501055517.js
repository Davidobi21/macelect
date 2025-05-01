document.addEventListener('DOMContentLoaded', () => {
  const validRoutes = [
    '/index.html',
    '/pages/products.html',
    '/pages/aboutus.html',
    '/pages/fqa.html',
  ]; // Add all valid routes here
  const currentPath = window.location.pathname;

  // Redirect to 404.html if the current path is not in the list of valid routes
  if (!validRoutes.includes(currentPath)) {
    window.location.href = '/pages/404.html'; // Redirect to the 404 page
  }
});
