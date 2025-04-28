const express = require('express');
const router = express.Router();
const User = require('../models/user');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const sendOTPEmail = require('../utils/mailer');  // Keep the OTP sending function in a separate file
const otpStore = {};  // Store OTPs temporarily

// Registration Route
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "User already exists" });

    // Generate OTP
    const otp = crypto.randomInt(100000, 999999).toString(); // 6-digit OTP
    const expires = Date.now() + 300000; // OTP expires in 5 minutes

    // Send OTP to the user's email
    sendOTPEmail(email, otp);

    // Store OTP and expiration time
    otpStore[email] = { otp, expires, userData: { name, email, password } };

    res.status(200).json({ message: "OTP sent to email" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong" });
  }
});

// Verify OTP Route
router.post("/verify-otp", async (req, res) => {
  const { email, otp } = req.body;
  const stored = otpStore[email];

  if (!stored || stored.otp !== otp || stored.expires < Date.now()) {
    return res.status(400).json({ message: "Invalid or expired OTP" });
  }

  const { name, password } = stored.userData;

  // Hash password and create the user
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  const newUser = new User({ name, email, password: hashedPassword });
  await newUser.save();

  // Clear OTP after use
  delete otpStore[email];

  res.status(201).json({
    message: "User registered successfully",
    user: {
      id: newUser._id,
      name: newUser.name,
      email: newUser.email,
    },
  });
});

// Login Route (Generate and send OTP for login)
router.post("/login", async (req, res) => {
  try {
    const { email } = req.body;

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    // Generate OTP
    const otp = crypto.randomInt(100000, 999999).toString(); // 6-digit OTP
    const expires = Date.now() + 300000; // OTP expires in 5 minutes

    // Send OTP to the user's email
    sendOTPEmail(email, otp);

    // Store OTP temporarily
    otpStore[email] = { otp, expires };

    res.status(200).json({ message: "OTP sent to email" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong" });
  }
});

module.exports = router;
