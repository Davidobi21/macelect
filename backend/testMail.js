require("dotenv").config();
const nodemailer = require("nodemailer");

console.log("Starting email test...");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const mailOptions = {
  from: process.env.EMAIL_USER,
  to: "obiorahdave1@gmail.com", // replace with your own email to test
  subject: "Test Email from Node",
  text: "If you got this, it works!",
};

transporter.sendMail(mailOptions, (error, info) => {
  if (error) {
    console.log("❌ Error:", error);
  } else {
    console.log("✅ Email sent:", info.response);
  }
});
