// backend/middleware/upload.js
const multer = require('multer');
const path = require('path');

// --- Multer Storage Configuration ---
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); 
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

// Initialize Multer with the storage configuration
const upload = multer({ storage: storage });

// --- THIS IS THE FIX ---
// Create a new middleware that accepts the fields from your form
const uploadPropertyMedia = upload.fields([
  { name: 'images', maxCount: 20 }, // Accepts up to 20 files for 'images'
  { name: 'video', maxCount: 1 }    // Accepts 1 file for 'video'
]);

module.exports = { uploadPropertyMedia };