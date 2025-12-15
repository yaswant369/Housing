const multer = require('multer');
const path = require('path');

// Memory storage for Multer - stores files in memory instead of disk
const memoryStorage = multer.memoryStorage();

// Initialize Multer with memory storage
const upload = multer({ storage: memoryStorage });

// Create a new middleware that accepts the fields from your form
const uploadPropertyMediaToMemory = upload.fields([
  { name: 'images', maxCount: 20 }, // Accepts up to 20 files for 'images'
  { name: 'video', maxCount: 1 },    // Accepts 1 file for 'video'
  { name: 'floorplans', maxCount: 10 }, // Accepts up to 10 floor plans
  { name: 'brochures', maxCount: 5 }   // Accepts up to 5 brochures
]);

module.exports = { uploadPropertyMediaToMemory };