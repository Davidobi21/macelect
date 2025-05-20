document.addEventListener("DOMContentLoaded", () => {
  const token = localStorage.getItem("token");

  fetch("http://localhost:5000/api/order/user", {
    headers: { Authorization: `Bearer ${token}` },
  })
    .then((res) => res.json())
    .then((data) => {
      const table = document.getElementById("orderHistoryTable");
      table.innerHTML = "";

      if (data.orders && data.orders.length > 0) {
        data.orders.forEach((order) => {
          const row = document.createElement("tr");
          row.innerHTML = `
            <td>${order._id}</td>
            <td>${new Date(order.createdAt).toLocaleDateString()}</td>
            <td>${order.status}</td>
            <td>₦${order.totalAmount.toLocaleString()}</td>
          `;
          table.appendChild(row);
        });
      } else {
        table.innerHTML = '<tr><td colspan="4" class="text-center">No orders found.</td></tr>';
      }
    })
    .catch((err) => console.error("Error fetching orders:", err));
});
