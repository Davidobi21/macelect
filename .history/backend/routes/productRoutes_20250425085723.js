const express = require('express');
const router = express.Router();
const verifyToken = require("../middleware/verifyAdmin");
const Product = require('../models/products');

// Create a new product
router.post('/add', async (req, res) => {
  console.log("📥 Product POST received:", req.body);
  try {
    const {
      name,
      description,
      price,
      review,
      color,
      size,
      quickDetails,
      shippingInfo,
      techSpecification,
      category,
      images
    } = req.body;

    if (!name || !price || !images || images.length !== 5) {
      return res.status(400).json({ message: 'Name, price, and exactly 5 images are required.' });
    }

    if (!category) {
      return res.status(400).json({ message: 'Category is required.' });
    }

    const newProduct = new Product({
      name,
      description,
      price,
      review,
      color,
      size,
      quickDetails,
      shippingInfo,
      techSpecification,
      images,
      category
    });

    const savedProduct = await newProduct.save();
    res.status(201).json({
      success: true,
      message: "Product added successfully",
      product: savedProduct
    });
  } catch (error) {
    console.error("❌ Error adding product:", error);
    res.status(500).json({ message: error.message || "Something went wrong" });
  }
});

// GET all products
router.get("/", async  (req, res) => {
    try {
      const products = await Product.find();
      res.status(200).json(products);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Something went wrong" });
    }
  });

  // GET single product by ID
  const mongoose = require('mongoose'); // Make sure you have mongoose imported if it's not already.

  router.get("/:id", async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid product ID format" });
        }

        const product = await Product.findById(id);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        res.status(200).json(product);
    } catch (error) {
        console.error("Error fetching product:", error);
        res.status(500).json({ message: "Something went wrong while fetching the product" });
    }
});
  

  // UPDATE product
router.put("/:id", async (req, res) => {
    try {
      const product = await Product.findById(req.params.id);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
  
      // Update the fields
      const { name, description, price, review, color, size, shippingInfo, quickDetails, techSpecification, images } = req.body;
  
      if (name) product.name = name;
      if (description) product.description = description;
      if (price) product.price = price;
      if (review) product.review = review;
      if (color) product.color = color;
      if (size) product.size = size;
      if (shippingInfo) product.shippingInfo = shippingInfo;
      if (quickDetails) product.quickDetails = quickDetails;
      if (techSpecification) product.techSpecification = techSpecification;
      if (images) product.images = images;
  
      await product.save();
  
      res.status(200).json({
        message: "Product updated successfully",
        product,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Something went wrong" });
    }
  });

  // DELETE product
// DELETE Product
router.delete("/:id", async (req, res) => {
    try {
      const productId = req.params.id;
      // Use findByIdAndDelete instead of remove
      const product = await Product.findByIdAndDelete(productId);
  
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
  
      res.status(200).json({ message: "Product deleted successfully" });
    } catch (error) {
      console.error("Error deleting product:", error);
      res.status(500).json({ message: "Something went wrong", error: error.message });
    }
  });
  
  

module.exports = router;
