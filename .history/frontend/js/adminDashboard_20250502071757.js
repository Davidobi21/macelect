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
  .then(data => {
    if (data.success) {
      // Update dashboard stats
      document.getElementById('product-count').textContent = data.data.totalProducts;
      document.getElementById('order-count').textContent = data.data.totalOrders;
      document.getElementById('user-count').textContent = data.data.totalUsers;
      document.getElementById('revenue-count').textContent = `₦${data.data.revenue.toLocaleString()}`;
      // Update products table
      const productsTable = document.getElementById('products-table');
      if (data.data.products && data.data.products.length > 0) {
        productsTable.innerHTML = data.data.products.map(product => `
          <tr class="border-b hover:bg-gray-50">
            <td class="px-4 py-2"><input type="checkbox"/></td>
            <td class="px-4 py-2 flex items-center gap-2">
              ${product.images?.[0] ? `<img src="http://localhost:5000${product.images[0]}" class="w-10 h-10 rounded object-cover" alt="">` : ''}
              <span>${product.name || 'Unnamed Product'}</span>
            </td>
            <td class="px-4 py-2">${product.category || 'Uncategorized'}</td>
            <td class="px-4 py-2 text-center">₦${product.price?.toLocaleString() || '0'}</td>
            <td class="px-4 py-2 text-center">${product.stock || 'In Stock'}</td>
            <td class="px-4 py-2 text-center">
              <span class="px-2 py-1 rounded-full text-xs text-blue-700 bg-blue-100">${product.status || 'Active'}</span>
            </td>
            <td class="px-4 py-2 text-center">
              <button onclick="deleteProduct('${product._id}')" class="text-red-500 hover:underline">Delete</button>
            </td>
          </tr>
        `).join('');
      } else {
        productsTable.innerHTML = '<tr><td colspan="7" class="text-center py-4 text-gray-500">No products available.</td></tr>';
      }
    } else {
      console.error('Access Denied:', data.message);
    }
  })
}
