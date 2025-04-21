// filepath: backend/server.js
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');
const connectDB = require('./config/db');
const admin = require('./routes/admin');
const adminRoutes = require('./routes/adminRoutes');
const authRoutes = require('./routes/authRoutes');
const cartRoutes = require('./routes/cart');
const messageRoutes = require('./routes/message');
const orderRoutes = require('./routes/order');
const productRoutes = require('./routes/productRoutes');
const sendOtpRoutes = require('./routes/sendOtp');
const userRoutes = require('./routes/userRoutes');
const wishlistRoutes = require('./routes/wishlistRoutes');
const uploadRoutes = require("./routes/upload");

// Load environment variables
dotenv.config();

// Connect to the database
connectDB();

const app = express();

// Ensure uploads directory exists
const uploadsPath = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsPath)) {
  fs.mkdirSync(uploadsPath, { recursive: true });
}

// Middleware
app.use(cors({ origin: 'http://localhost:5500' })); // Allow requests from the frontend
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/admin', adminRoutes);
app.use('/api/admin', admin); // Admin routes
app.use('/api/auth', authRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/message', messageRoutes);
app.use('/api/order', orderRoutes);
app.use('/api/products', productRoutes);
app.use('/api/send-otp', sendOtpRoutes);
app.use('/api/users', userRoutes);
app.use('/api/wishlist', wishlistRoutes);
app.use("/upload", uploadRoutes);

// Static files
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Routes

app.get('/', (req, res) => {
    res.send('API is running...');
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send({ message: 'Something went wrong!' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});