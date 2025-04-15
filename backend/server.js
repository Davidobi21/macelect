const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require('./routes/userRoutes');
const otpRoutes = require("./routes/sendOtp");
const productRoutes = require('./routes/productRoutes');
const wishlistRoutes = require("./routes/wishlistRoutes");
const cartRoutes = require("./routes/cart");
const orderRoutes = require("./routes/order");
const messageRoutes = require("./routes/message");

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use("/api/auth", authRoutes);
app.use('/api/user', userRoutes);
app.use("/api", otpRoutes);
app.use('/api/products', productRoutes);
app.use("/api/wishlist", wishlistRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/messages", messageRoutes);

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("MongoDB connected"))
.catch((err) => console.error("MongoDB Error:", err));


// Basic route
app.get("/", (req, res) => {
  res.send("API is working!");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
