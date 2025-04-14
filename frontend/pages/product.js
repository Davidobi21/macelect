// Function to change the main product image when a thumbnail is clicked
function changeMainImage(imageSrc) {
    const mainImage = document.getElementById('product-image');
    mainImage.src = imageSrc;
  }
  
  // You can also fetch product data dynamically and populate it on the page
  document.addEventListener('DOMContentLoaded', () => {
    // Example of setting product data dynamically
    document.getElementById('product-name').textContent = 'Wireless Bluetooth Headset';
    document.getElementById('product-description').textContent = 'This wireless Bluetooth headset delivers exceptional sound quality and comfort for all-day use.';
    document.getElementById('product-price').textContent = '$35.99';
    document.getElementById('product-category').textContent = 'Audio';
    document.getElementById('product-stock').textContent = '20';
  });
  