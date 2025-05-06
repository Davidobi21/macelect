const express = require('express');
const router = express.Router();
const Order = require('../models/order');
const Product = require('../models/products');
const User = require('../models/user');
const verifyToken = require('../middleware/verifyToken'); // Ensure this middleware is implemented and imported

// Create a new order
router.post('/place', verifyToken, async (req, res) => {
  try {
    const userId = req.user?._id; // Ensure req.user is set by verifyToken middleware
    if (!userId) {
      return res.status(401).json({ message: 'User not authenticated' }); // Changed to 401 for unauthorized
    }

    const { items, shippingInfo, totalAmount } = req.body;

    const newOrder = new Order({
      userId,
      items,
      shippingInfo,
      totalAmount,
    });

    await newOrder.save();
    res.status(201).json({ message: 'Order created successfully', order: newOrder });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ message: 'Something went wrong' });
  }
});

// Get all orders for a user (with authentication)
router.get('/user', verifyToken, async (req, res) => {
  const userId = req.user._id;  // Get the user from the authMiddleware

  try {
    const orders = await Order.find({ userId }).populate('items.productId');
    if (!orders || orders.length === 0) return res.status(404).json({ message: "No orders found" });

    res.status(200).json(orders);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong", error });
  }
});

// Get a specific order by ID (with authentication)
router.get('/:orderId', verifyToken, async (req, res) => {
  const { orderId } = req.params;
  const userId = req.user._id;

  try {
    const order = await Order.findOne({ _id: orderId, userId }).populate('items.productId');
    if (!order) return res.status(404).json({ message: "Order not found" });

    res.status(200).json(order);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong", error });
  }
});

// Update order status (Admin or Owner can update status)
router.put('/:orderId/status', verifyToken, async (req, res) => {
  const { orderId } = req.params;
  const { status } = req.body;  // status: 'Pending', 'Processing', 'Shipped', 'Delivered'

  if (!['Pending', 'Processing', 'Shipped', 'Delivered'].includes(status)) {
    return res.status(400).json({ message: "Invalid status" });
  }

  try {
    const order = await Order.findById(orderId);

    if (!order) return res.status(404).json({ message: "Order not found" });
    if (order.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "You are not authorized to update this order" });
    }

    order.status = status;
    await order.save();

    res.status(200).json({ message: "Order status updated", order });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong", error });
  }
});

// Admin - Get all orders (can be used for order history in admin panel)
router.get('/admin', async (req, res) => {
  try {
    const orders = await Order.find().populate('items.productId');
    res.status(200).json(orders);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong", error });
  }
});

module.exports = router;
