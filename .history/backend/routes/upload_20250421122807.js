const express = require('express');
const multer = require('multer');
const path = require('path');

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../../uploads'));
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

// Route to handle image uploads
router.post('/upload-images', upload.array('images', 5), (req, res) => {
  try {
    const filePaths = req.files.map(file => `/uploads/${file.filename}`);
    res.status(200).json({ message: 'Images uploaded successfully', filePaths });
  } catch (error) {
    res.status(500).json({ message: 'Failed to upload images', error: error.message });
  }
});

module.exports = router;