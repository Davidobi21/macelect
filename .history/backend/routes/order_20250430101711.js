const express = require('express');
const router = express.Router();
const axios = require('axios'); // Ensure axios is imported
const crypto = require('crypto'); // Ensure crypto is imported
const Order = require('../models/order');
const Product = require('../models/products');
const User = require('../models/user');
const authMiddleware = require('../middleware/auth');

// Place a new order (with authentication)
router.post('/place', authMiddleware, async (req, res) => {
  const { items, shippingInfo, totalAmount } = req.body;
  const userId = req.user._id;

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const orderItems = [];
    let calculatedTotal = 0;

    for (let item of items) {
      const product = await Product.findById(item.productId);
      if (!product) {
        return res.status(404).json({ message: `Product with ID ${item.productId} not found` });
      }
      const itemTotal = product.price * item.quantity;
      calculatedTotal += itemTotal;
      orderItems.push({
        productId: item.productId,
        quantity: item.quantity,
        priceAtPurchase: product.price,
      });
    }

    const shippingCost = shippingInfo?.shippingCost || 0;
    calculatedTotal += shippingCost;

    if (calculatedTotal !== totalAmount) {
      return res.status(400).json({ message: "Total amount mismatch", calculatedTotal });
    }

    const newOrder = new Order({
      userId,
      items: orderItems,
      shippingInfo,
      totalAmount: calculatedTotal,
      status: 'Pending',
      paymentStatus: 'Unpaid',
    });

    await newOrder.save();
    res.status(201).json({ message: "Order placed successfully", order: newOrder });
  } catch (error) {
    console.error("Error placing order:", error);
    res.status(500).json({ message: "Something went wrong", error });
  }
});

// Paystack callback
router.get('/paystack/callback', async (req, res) => {
  try {
    const reference = req.query.reference;
    if (!reference) {
      return res.status(400).json({ message: 'Reference not found' });
    }

    // Verify the payment on Paystack using the reference
    const response = await axios.get(`https://api.paystack.co/transaction/verify/${reference}`, {
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
      },
    });

    const transaction = response.data.data;
    if (transaction.status === 'success') {
      // Handle successful payment, e.g., update order status to 'Paid'
      const order = await Order.findOne({ paymentReference: reference });
      if (order) {
        order.paymentStatus = 'Paid';
        order.status = 'Processing'; // Update status to 'Processing' after payment
        await order.save();
        console.log("Order updated to Paid:", order);
      } else {
        console.error("Order not found for reference:", reference);
      }

      return res.redirect('/payment-success'); // Redirect to a success page
    }

    console.error("Payment verification failed:", transaction);
    res.redirect('/payment-failed'); // Redirect to a failed page
  } catch (error) {
    console.error("Error in Paystack callback:", error);
    res.redirect('/payment-failed'); // Redirect to a failed page in case of error
  }
});

// Paystack webhook
router.post('/paystack/webhook', async (req, res) => {
  const body = req.body;

  // Validate webhook to ensure it's from Paystack
  const signature = req.headers['x-paystack-signature'];
  const hash = crypto.createHmac('sha512', process.env.PAYSTACK_SECRET_KEY)
                     .update(JSON.stringify(body))
                     .digest('hex');

  if (hash !== signature) {
    console.error("Invalid Paystack signature");
    return res.status(400).json({ message: 'Invalid signature' });
  }

  const event = body.event;

  // If the event is a successful payment
  if (event === 'charge.success') {
    const reference = body.data.reference;

    try {
      const order = await Order.findOne({ paymentReference: reference });

      if (!order) {
        console.error("Order not found for reference:", reference);
        return res.status(404).json({ message: "Order not found" });
      }

      // Update the order to Paid
      order.paymentStatus = 'Paid';
      order.status = 'Processing'; // Update status to 'Processing' after payment
      await order.save();

      console.log("Order updated to Paid via webhook:", order);
      res.status(200).json({ message: 'Payment confirmed, order updated to Paid' });
    } catch (error) {
      console.error("Error processing payment confirmation:", error);
      res.status(500).json({ message: 'Error processing payment confirmation' });
    }
  } else {
    console.log("Unhandled Paystack event:", event);
    res.status(200).json({ message: 'Event not handled' });
  }
});

// Utility function to verify Paystack signature
function verifyPaystackSignature(body, signature) {
  const hash = crypto.createHmac('sha512', process.env.PAYSTACK_SECRET_KEY)
                     .update(JSON.stringify(body))
                     .digest('hex');

  return hash === signature;
}

// Get all orders for a user (with authentication)
router.get('/user', authMiddleware, async (req, res) => {
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
router.get('/:orderId', authMiddleware, async (req, res) => {
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
router.put('/:orderId/status', authMiddleware, async (req, res) => {
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
