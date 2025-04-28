const express = require("express");
const router = express.Router();
const Cart = require("../models/cart");
const Product = require("../models/products");

// Add to cart
router.post("/add", async (req, res) => {
  console.log("Received Cart Data:", req.body);
  const { userId, productId, quantity, selectedColor, selectedSize } = req.body;

  try {
    // Check if userId is provided
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized: Please login first" });
    }

    let cart = await Cart.findOne({ user: userId });

    if (!cart) {
      cart = new Cart({ user: userId, items: [] });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const itemIndex = cart.items.findIndex(item => item.product.toString() === productId);

    if (itemIndex > -1) {
      cart.items[itemIndex].quantity += quantity;
    } else {
      cart.items.push({
        product: productId,
        quantity,
        selectedColor,
        selectedSize,
        productDetails: {
          name: product.name,
          price: product.price,
          image: product.images?.[0] || "", // Use the first image
        },
      });
    }

    await cart.save();
    res.status(200).json({ message: "Item added to cart", cart });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Something went wrong", error: err.message });
  }
});


// Get user cart
router.get("/:userId", async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.params.userId }).populate("items.product");
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    res.status(200).json(cart);
  } catch (err) {
    res.status(500).json({ message: "Error fetching cart", error: err.message });
  }
});

// Update item quantity
router.put("/update", async (req, res) => {
  const { userId, productId, quantity } = req.body;

  try {
    const cart = await Cart.findOne({ user: userId });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    const item = cart.items.find(item => item.product.toString() === productId);
    if (!item) return res.status(404).json({ message: "Product not in cart" });

    item.quantity = quantity;
    await cart.save();

    res.status(200).json({ message: "Cart updated", cart });
  } catch (err) {
    res.status(500).json({ message: "Error updating cart", error: err.message });
  }
});

// Remove item from cart
router.delete("/remove", async (req, res) => {
  const { userId, productId } = req.body;

  try {
    const cart = await Cart.findOne({ user: userId });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    cart.items = cart.items.filter(item => item.product.toString() !== productId);
    await cart.save();

    res.status(200).json({ message: "Item removed from cart", cart });
  } catch (err) {
    res.status(500).json({ message: "Error removing item", error: err.message });
  }
});

module.exports = router;
