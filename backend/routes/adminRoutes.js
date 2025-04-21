const express = require('express');
const router = express.Router();
const Product = require('../models/products');
const Order = require('../models/order');
const User = require('../models/user');
const adminController = require('../controllers/adminController');
const verifyAdmin = require('../middleware/verifyAdmin');

// Admin Dashboard Overview
router.get('/dashboard', verifyAdmin, async (req, res) => {
  try {
    const totalProducts = await Product.countDocuments();
    const totalOrders = await Order.countDocuments();
    const totalUsers = await User.countDocuments();

    res.status(200).json({
      success: true,
      data: {
        totalProducts,
        totalOrders,
        totalUsers,
      },
      message: 'Dashboard data fetched successfully',
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Error fetching dashboard data' });
  }
});

// Fetch Products with Pagination
router.get('/products', verifyAdmin, async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query; // Default to page 1, 10 items per page
    const products = await Product.find()
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const totalProducts = await Product.countDocuments();

    res.status(200).json({
      success: true,
      data: {
        products,
        totalPages: Math.ceil(totalProducts / limit),
        currentPage: parseInt(page),
      },
      message: 'Products fetched successfully',
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Error fetching products' });
  }
});

// Fetch Orders with Pagination
router.get('/orders', verifyAdmin, async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query; // Default to page 1, 10 items per page
    const orders = await Order.find()
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const totalOrders = await Order.countDocuments();

    res.status(200).json({
      success: true,
      data: {
        orders,
        totalPages: Math.ceil(totalOrders / limit),
        currentPage: parseInt(page),
      },
      message: 'Orders fetched successfully',
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Error fetching orders' });
  }
});

module.exports = router;
