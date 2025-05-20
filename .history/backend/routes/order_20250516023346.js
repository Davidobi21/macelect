const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const Order = require('../models/order');
const Product = require('../models/products');
const User = require('../models/user');
const verifyAdmin = require('../middleware/verifyAdmin');
const verifyToken = require('../middleware/verifyToken');

// Place an order
router.post('/place', async (req, res) => {
  try {
    const { userId, items, shippingInfo, totalAmount, paymentReference } = req.body;

    // Validate required fields
    if (!userId || !items || !totalAmount) {
      return res.status(400).json({ message: 'Missing required fields: userId, items, or totalAmount' });
    }

    // Validate and convert userId to ObjectId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: 'Invalid userId format' });
    }
    const userObjectId = new mongoose.Types.ObjectId(userId);

    const newOrder = new Order({
      userId: userObjectId,
      items,
      shippingInfo: shippingInfo || 'Not provided',
      totalAmount,
      paymentReference: paymentReference || null,
      status: 'Pending',
    });

    const savedOrder = await newOrder.save();
    res.status(201).json(savedOrder);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to place order', error });
  }
});

// Get all orders for a user
router.get('/user', verifyToken, async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user._id })
      .populate('userId', 'email name')
      .populate('items.productId', 'name image');
    if (!orders || orders.length === 0) {
      return res.status(404).json({ message: 'No orders found for this user' });
    }
    res.status(200).json({ success: true, orders });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch orders', error });
  }
});

router.get('/admin', async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('userId', 'email') // Populate user email
      .populate('items.productId', 'name'); // Populate product name

    console.log("Fetched Orders from Database:", orders); // Log orders for debugging

    res.status(200).json({ orders });
  } catch (error) {
    console.error("Error fetching orders:", error); // Log any errors
    res.status(500).json({ message: "Failed to fetch orders", error });
  }
});

// Get a specific order by ID
router.get('/:orderId', async (req, res) => {
  const { orderId } = req.params;
  const { userId } = req.query;

  try {
    const order = await Order.findOne({ _id: orderId, userId }).populate('items.productId');
    if (!order) return res.status(404).json({ message: "Order not found" });

    res.status(200).json(order);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong", error });
  }
});

// Update order status
router.put('/:orderId/status', async (req, res) => {
  const { orderId } = req.params;
  const { status, userId } = req.body;  // status: 'Pending', 'Processing', 'Shipped', 'Delivered'

  if (!['Pending', 'Processing', 'Shipped', 'Delivered'].includes(status)) {
    return res.status(400).json({ message: "Invalid status" });
  }

  try {
    const order = await Order.findById(orderId);

    if (!order) return res.status(404).json({ message: "Order not found" });
    if (order.userId.toString() !== userId.toString()) {
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

// Admin - Get all orders

module.exports = router;
