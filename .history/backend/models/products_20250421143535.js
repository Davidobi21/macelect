const mongoose = require("mongoose");

const techSpecSchema = new mongoose.Schema({
  feature: String,
  detail: String,
}, { _id: false });

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
  },
  quickDetails: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  review: {
    type: String, // ✅ fixed typo: was 'sring'
    default: "",
  },
  color: [String],
  size: [String],
  shippingInfo: {
    type: String, // ✅ changed from Number to String (for values like "3-5 business days")
    required: true,
  },
  techSpecification: [
    {
      feature: { type: String, required: true },
      detail: { type: String, required: true },
    },
  ],
  images: {
    type: [String], // URLs of images
    validate: [arrayLimit, '{PATH} must have exactly 5 images']
  },
  category: {
    type: String,
    required: true,
  }
}, {
  timestamps: true
});

function arrayLimit(val) {
  return val.length === 5;
}

module.exports = mongoose.model("Product", productSchema);
