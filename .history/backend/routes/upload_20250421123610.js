const express = require("express");
const router = express.Router();
const multer = require("multer");

// Configure Multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // folder to save images
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });

// 👇 Your upload route
router.post('/upload-images', upload.array('images', 5), (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      throw new Error('No files were uploaded');
    }

    const filePaths = req.files.map(file => `/uploads/${file.filename}`);
    res.status(200).json({ message: 'Images uploaded successfully', filePaths });
  } catch (error) {
    console.error('Upload Error:', error.message); // Enhanced error logging
    res.status(500).json({ message: 'Failed to upload images', error: error.message });
  }
});

module.exports = router;
