const express = require("express");
const router = express.Router();
const nodemailer = require("nodemailer");
const crypto = require("crypto");

const otpStore = {}; // In-memory OTP store (for demo only)

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: "obiorahdave@gmail.com",
        pass: "lzuvikciectotnju",
    },
  });

// Route to send OTP
router.post("/send-otp", async (req, res) => {
  const { email } = req.body;
  const otp = crypto.randomInt(100000, 999999); // 6-digit OTP

  // Store it temporarily
  otpStore[email] = otp;

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Your OTP Code",
    text: `Your OTP is ${otp}. It expires in 5 minutes.`,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: "OTP sent successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to send OTP" });
  }
});

// Route to verify OTP
router.post("/verify-otp", (req, res) => {
  const { email, otp } = req.body;
  if (otpStore[email] && parseInt(otp) === otpStore[email]) {
    delete otpStore[email]; // Clear OTP after successful verification
    return res.status(200).json({ message: "OTP verified successfully" });
  }
  return res.status(400).json({ message: "Invalid or expired OTP" });
});

module.exports = router;
