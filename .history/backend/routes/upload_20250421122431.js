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
router.post("/upload-images", upload.array("images", 5), (req, res) => {
  const uploadedFiles = req.files.map((file) => `/uploads/${file.filename}`);
  res.json({ uploadedFiles });
});

module.exports = router;
