const express = require('express');
const path = require('path');
const fs = require('fs').promises;
const { uploadPropertyMedia } = require('../middleware/upload');

let sharp;
try {
  sharp = require('sharp');
} catch (e) {
  console.error('Sharp is required for image processing. Please run `npm install sharp` in backend.');
}

const router = express.Router();

// POST /api/uploads/property/:propertyId
// Accepts form-data with field `images` (multiple). Returns processed image URLs.
router.post('/property/:propertyId', uploadPropertyMedia, async (req, res) => {
  if (!sharp) return res.status(500).json({ message: 'Image processing not available (sharp missing).' });

  const propertyId = req.params.propertyId || 'common';
  const files = (req.files && req.files.images) || [];
  if (!files.length) return res.status(400).json({ message: 'No images uploaded' });

  const outDir = path.join(__dirname, '..', 'uploads', 'properties', propertyId);
  await fs.mkdir(outDir, { recursive: true });

  const results = [];

  try {
    for (const file of files) {
      const originalPath = file.path; // multer saved file
      const filenameBase = path.parse(file.filename).name; // timestamp

      // Dest paths
      const thumbName = `${filenameBase}_thumb.webp`;
      const mediumName = `${filenameBase}_medium.webp`;
      const optimizedName = `${filenameBase}_orig.webp`;

      const thumbPath = path.join(outDir, thumbName);
      const mediumPath = path.join(outDir, mediumName);
      const optimizedPath = path.join(outDir, optimizedName);

      // Read and process: center-crop (cover) and convert to webp
      // Thumbnail: 360x240 - preserve aspect ratio (no crop)
      await sharp(originalPath)
        .rotate() // auto-orient
        .resize(360, 240, { fit: 'inside', withoutEnlargement: true })
        .webp({ quality: 80 })
        .toFile(thumbPath);

      // Medium: 800x530 - preserve aspect ratio (no crop)
      await sharp(originalPath)
        .rotate()
        .resize(800, 530, { fit: 'inside', withoutEnlargement: true })
        .webp({ quality: 80 })
        .toFile(mediumPath);

      // Optimized original: max width 1600, preserve aspect ratio, webp quality 75
      const meta = await sharp(originalPath).metadata();
      const resizeWidth = meta.width && meta.width > 1600 ? 1600 : meta.width;
      if (resizeWidth) {
        await sharp(originalPath)
          .rotate()
          .resize({ width: resizeWidth, withoutEnlargement: true })
          .webp({ quality: 75 })
          .toFile(optimizedPath);
      } else {
        // fallback: still convert to webp
        await sharp(originalPath).rotate().webp({ quality: 75 }).toFile(optimizedPath);
      }

      // Optionally remove the raw uploaded file to save space
      try { await fs.unlink(originalPath); } catch (e) { /* ignore */ }

      // Build URLS (served from /uploads)
      const baseUrl = `/uploads/properties/${propertyId}`;
      results.push({
        originalName: file.originalname,
        thumbnail: `${baseUrl}/${thumbName}`,
        medium: `${baseUrl}/${mediumName}`,
        optimized: `${baseUrl}/${optimizedName}`,
      });
    }

    return res.json({ success: true, images: results });
  } catch (err) {
    console.error('Image processing error', err);
    return res.status(500).json({ success: false, message: 'Image processing failed', error: err.message });
  }
});

module.exports = router;
