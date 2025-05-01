const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const Order = require('../models/order');
const Product = require('../models/products');
const User = require('../models/user');

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
router.get('/user', async (req, res) => {
  const { userId } = req.query;

  try {
    const orders = await Order.find({ userId }).populate('items.productId');
    if (!orders || orders.length === 0) return res.status(404).json({ message: "No orders found" });

    res.status(200).json(orders);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong", error });
  }
});

router.get('/admin/orders', async (req, res) => {
  try {
    const admin = req.user; // Assuming `req.user` contains the authenticated admin's details

    // Validate admin's ObjectId
    if (!mongoose.Types.ObjectId.isValid(admin._id)) {
      return res.status(400).json({ error: 'Invalid admin ID' });
    }

    // Query orders associated with the admin
    const orders = await Order.find({ adminId: admin._id }); // Ensure `adminId` is used correctly
    res.status(200).json({ orders });
  } catch (error) {
    console.error(error);

    // Handle specific CastError for better debugging
    if (error.name === 'CastError') {
      return res.status(400).json({
        message: 'Invalid ObjectId format',
        error: error.message,
      });
    }

    res.status(500).json({ error: 'Failed to fetch orders' });
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
