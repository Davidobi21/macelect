const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');


const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "obiorahdave@gmail.com",
    pass: "lzuvikciectotnju",
  },
});

const sendOTPEmail = async (to, otp) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject: 'Your OTP Code',
    html: `<h2>Your OTP is: <strong>${otp}</strong></h2>`
  };

  await transporter.sendMail(mailOptions);
};

module.exports = sendOTPEmail;
