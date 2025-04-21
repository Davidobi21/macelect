const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    match: [/\S+@\S+\.\S+/, "Please provide a valid email address"],  // Email validation
  },
  message: {
    type: String,
    required: true,
  },
  agreedToTerms: {
    type: Boolean,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Message", messageSchema);
