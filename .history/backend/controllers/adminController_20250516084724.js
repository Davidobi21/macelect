// Import required models
const Product = require('../models/products');
const Order = require('../models/order');
const User = require('../models/user');

exports.dashboard = async (req, res) => {
  try {
    const products = await Product.find().select('name category price images status');
    const orders = await Order.find().populate('userId', 'email').populate('items.productId', 'name');
    const users = await User.find();
    res.json({
      success: true,
      data: {
        totalProducts: products.length,
        totalOrders: orders.length,
        totalUsers: users.length,
        products: products,
        recentOrders: orders.slice(0, 5),
        revenue: orders.reduce((acc, order) => acc + order.totalAmount, 0)
      }
    });
  } catch (error) {
    console.error('Dashboard Error:', error);
    res.status(500).json({ success: false, message: 'Error fetching dashboard data' });
  }
};
