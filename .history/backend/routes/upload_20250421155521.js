const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const multer = require('multer');

// ✅ Point to the uploads folder outside backend
const uploadPath = path.join(__dirname, '..', 'uploads');
const upload = multer({ storage: storage });

// ✅ Ensure the folder exists
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath);
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadPath); // Save outside backend folder
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});


// 🔥 Upload Route
router.post('/upload-images', upload.array('images', 5), (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      throw new Error('No files were uploaded');
    }

    const filePaths = req.files.map(file => `/uploads/${file.filename}`);
    res.status(200).json({ message: 'Images uploaded successfully', filePaths });
  } catch (error) {
    console.error('Upload Error:', error.message);
    res.status(500).json({ message: 'Failed to upload images', error: error.message });
  }
});

module.exports = router;
