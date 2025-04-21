const express = require("express");
const router = express.Router();
const Message = require("../models/message");

// Send a new message
router.post("/send", async (req, res) => {
  const { name, email, message, agreedToTerms } = req.body;

  if (!agreedToTerms) {
    return res.status(400).json({ message: "You must agree to the terms" });
  }

  try {
    const newMessage = new Message({
      name,
      email,
      message,
      agreedToTerms,
    });

    await newMessage.save();
    res.status(201).json({ message: "Message sent successfully", message: newMessage });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong", error });
  }
});

// Get all messages (admin view)
router.get("/admin", async (req, res) => {
  try {
    const messages = await Message.find();
    if (!messages || messages.length === 0) return res.status(404).json({ message: "No messages found" });

    res.status(200).json(messages);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong", error });
  }
});

module.exports = router;
