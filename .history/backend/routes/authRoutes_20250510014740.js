const express = require('express');
const router = express.Router();
const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const sendOTPEmail = require('../utils/mailer');  // Your OTP mailer function
const otpStore = {};  // Temporary OTP storage

// Registration Route
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "User already exists" });

    const otp = crypto.randomInt(100000, 999999).toString();
    const expires = Date.now() + 300000; // 5 minutes expiry

    sendOTPEmail(email, otp);

    otpStore[email] = { otp, expires, userData: { name, email, password } };

    res.status(200).json({ message: "OTP sent to email" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong" });
  }
});

// Verify OTP (Registration)
router.post("/verify-otp", async (req, res) => {
  try {
    const { email, otp } = req.body;
    const stored = otpStore[email];

    if (!stored || stored.otp !== otp || stored.expires < Date.now()) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    const { name, password } = stored.userData;

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = new User({ name, email, password: hashedPassword });
    await newUser.save();

    // Create token
    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

    // Clear OTP
    delete otpStore[email];

    res.status(201).json({
      message: "User registered successfully",
      token,
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong" });
  }
});

// Login Route (Send OTP)
router.post("/login", async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const otp = crypto.randomInt(100000, 999999).toString();
    const expires = Date.now() + 300000; // 5 minutes expiry

    sendOTPEmail(email, otp);

    otpStore[email] = { otp, expires, userId: user._id };

    // Debug log for JWT_SECRET during token generation
    console.log('JWT_SECRET during token generation:', process.env.JWT_SECRET);

    // Generate JWT token here
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

    // Send user + token back
    res.status(200).json({
      message: "OTP sent to email",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong" });
  }
});

// Verify OTP (Login)
router.post("/verify-login-otp", async (req, res) => {
  try {
    const { email, otp } = req.body;
    const stored = otpStore[email];

    if (!stored || stored.otp !== otp || stored.expires < Date.now()) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

    // Clear OTP
    delete otpStore[email];

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong" });
  }
});

// Refresh token endpoint
router.post('/refresh', async (req, res) => {
  const refreshToken = req.body.refreshToken;

  if (!refreshToken) {
    return res.status(403).json({ message: 'Refresh token is required' });
  }

  try {
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Generate a new access token
    const accessToken = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '15m' } // Short-lived access token
    );

    res.status(200).json({ accessToken });
  } catch (error) {
    console.error('Error verifying refresh token:', error);
    res.status(401).json({ message: 'Invalid or expired refresh token' });
  }
});

module.exports = router;
