const express = require('express');
const axios = require('axios');
const Order = require('../models/order');
const Product = require('../models/products');
const User = require('../models/user');
const authMiddleware = require('../middleware/auth');
const router = express.Router();

// Place a new order with Pay on Delivery
router.post('/placePayOnDelivery', authMiddleware, async (req, res) => {
  const { items, shippingInfo, totalAmount } = req.body;
  const userId = req.user._id; // Get the user from authMiddleware

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Check if all products exist and get the price at purchase time
    const orderItems = [];
    for (let item of items) {
      const product = await Product.findById(item.productId);
      if (!product) {
        return res.status(404).json({ message: `Product with ID ${item.productId} not found` });
      }
      orderItems.push({
        productId: item.productId,
        quantity: item.quantity,
        priceAtPurchase: product.price,
      });
    }

    // Create the order with paymentStatus as 'Pending'
    const newOrder = new Order({
      userId,
      items: orderItems,
      shippingInfo,
      totalAmount,
      paymentStatus: 'Pending',
      status: 'Pending',
    });

    await newOrder.save();

    // Generate a Paystack payment link
    const paystackLinkResponse = await axios.post('https://api.paystack.co/transaction/initialize', {
      email: user.email,
      amount: totalAmount * 100, // Paystack expects kobo
      currency: "NGN",
      reference: 'pay-on-delivery-' + Math.floor(Math.random() * 1000000000 + 1),
      callback_url: 'https://yourdomain.com/paystack/callback', // Callback URL after payment is made
    }, {
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
      },
    });

    const paymentLink = paystackLinkResponse.data.data.link;

    // Optionally, send the payment link to the user (via email/SMS/WhatsApp)
    // For now, return it in the response (you can integrate your own email/SMS service)
    res.status(201).json({ 
      message: "Order placed successfully, pay via the link below",
      order: newOrder,
      paymentLink: paymentLink 
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong", error });
  }
});

module.exports = router;
