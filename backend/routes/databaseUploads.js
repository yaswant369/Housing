const express = require('express');
const path = require('path');
const Property = require('../models/Property');
const { uploadPropertyMediaToMemory } = require('../middleware/databaseUpload');
const authMiddleware = require('../middleware/authMiddleware');

let sharp;
try {
  sharp = require('sharp');
} catch (e) {
  console.error('Sharp is required for image processing. Please run `npm install sharp` in backend.');
}

const router = express.Router();

// POST /api/uploads/database/property/:propertyId
// Accepts form-data with fields: images, video, floorplans, brochures
// Returns processed media data stored in database
router.post('/database/property/:propertyId', authMiddleware, uploadPropertyMediaToMemory, async (req, res) => {
  try {
    const propertyId = req.params.propertyId;
    const files = req.files || {};

    // Find the property
    const property = await Property.findOne({ id: propertyId });
    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    const results = {
      photos: [],
      videos: [],
      floorplans: [],
      brochures: []
    };

    // Process images
    if (files.images && files.images.length > 0) {
      for (const file of files.images) {
        try {
          // Process image with sharp to create different sizes
          const imageBuffer = file.buffer;

          // Create thumbnail (360x240)
          const thumbnailBuffer = await sharp(imageBuffer)
            .rotate()
            .resize(360, 240, { fit: 'inside', withoutEnlargement: true })
            .webp({ quality: 80 })
            .toBuffer();

          // Create medium size (800x530)
          const mediumBuffer = await sharp(imageBuffer)
            .rotate()
            .resize(800, 530, { fit: 'inside', withoutEnlargement: true })
            .webp({ quality: 80 })
            .toBuffer();

          // Create optimized original (max width 1600)
          const meta = await sharp(imageBuffer).metadata();
          const resizeWidth = meta.width && meta.width > 1600 ? 1600 : meta.width;
          let optimizedBuffer;

          if (resizeWidth) {
            optimizedBuffer = await sharp(imageBuffer)
              .rotate()
              .resize({ width: resizeWidth, withoutEnlargement: true })
              .webp({ quality: 75 })
              .toBuffer();
          } else {
            optimizedBuffer = await sharp(imageBuffer)
              .rotate()
              .webp({ quality: 75 })
              .toBuffer();
          }

          // Add to property media
          property.media.photos.push({
            fileName: file.originalname,
            fileType: file.mimetype,
            fileSize: file.size,
            data: imageBuffer,
            thumbnailData: thumbnailBuffer,
            mediumData: mediumBuffer,
            optimizedData: optimizedBuffer,
            uploadDate: new Date()
          });

          results.photos.push({
            fileName: file.originalname,
            fileType: file.mimetype,
            fileSize: file.size,
            message: 'Image processed and stored in database'
          });
        } catch (err) {
          console.error('Error processing image:', err);
          results.photos.push({
            fileName: file.originalname,
            error: 'Failed to process image'
          });
        }
      }
    }

    // Process videos
    if (files.video && files.video.length > 0) {
      for (const file of files.video) {
        property.media.videos.push({
          fileName: file.originalname,
          fileType: file.mimetype,
          fileSize: file.size,
          data: file.buffer,
          uploadDate: new Date()
        });

        results.videos.push({
          fileName: file.originalname,
          fileType: file.mimetype,
          fileSize: file.size,
          message: 'Video stored in database'
        });
      }
    }

    // Process floor plans
    if (files.floorplans && files.floorplans.length > 0) {
      for (const file of files.floorplans) {
        property.media.floorplans.push({
          fileName: file.originalname,
          fileType: file.mimetype,
          fileSize: file.size,
          data: file.buffer,
          uploadDate: new Date()
        });

        results.floorplans.push({
          fileName: file.originalname,
          fileType: file.mimetype,
          fileSize: file.size,
          message: 'Floor plan stored in database'
        });
      }
    }

    // Process brochures
    if (files.brochures && files.brochures.length > 0) {
      for (const file of files.brochures) {
        property.media.brochures.push({
          fileName: file.originalname,
          fileType: file.mimetype,
          fileSize: file.size,
          data: file.buffer,
          uploadDate: new Date()
        });

        results.brochures.push({
          fileName: file.originalname,
          fileType: file.mimetype,
          fileSize: file.size,
          message: 'Brochure stored in database'
        });
      }
    }

    // Save the property with updated media
    await property.save();

    return res.json({
      success: true,
      message: 'Media files stored in database successfully',
      results: results
    });

  } catch (err) {
    console.error('Database upload error:', err);
    return res.status(500).json({
      success: false,
      message: 'Database upload failed',
      error: err.message
    });
  }
});

// GET /api/uploads/database/property/:propertyId/media/:mediaType/:fileName
// Serve media files from database
router.get('/database/property/:propertyId/media/:mediaType/:fileName', async (req, res) => {
  try {
    const propertyId = req.params.propertyId;
    const mediaType = req.params.mediaType; // photos, videos, floorplans, brochures
    const fileName = decodeURIComponent(req.params.fileName);

    // Find the property
    const property = await Property.findOne({ id: propertyId });
    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    // Find the media item
    let mediaItem = null;
    let sizeType = req.query.size; // original, thumbnail, medium, optimized

    if (mediaType === 'photos') {
      mediaItem = property.media.photos.find(photo => photo.fileName === fileName);
      if (mediaItem) {
        // Determine which size to serve
        if (sizeType === 'thumbnail' && mediaItem.thumbnailData) {
          res.set('Content-Type', 'image/webp');
          return res.send(mediaItem.thumbnailData);
        } else if (sizeType === 'medium' && mediaItem.mediumData) {
          res.set('Content-Type', 'image/webp');
          return res.send(mediaItem.mediumData);
        } else if (sizeType === 'optimized' && mediaItem.optimizedData) {
          res.set('Content-Type', 'image/webp');
          return res.send(mediaItem.optimizedData);
        } else if (mediaItem.data) {
          res.set('Content-Type', mediaItem.fileType);
          return res.send(mediaItem.data);
        }
      }
    } else if (mediaType === 'videos') {
      mediaItem = property.media.videos.find(video => video.fileName === fileName);
      if (mediaItem && mediaItem.data) {
        res.set('Content-Type', mediaItem.fileType);
        return res.send(mediaItem.data);
      }
    } else if (mediaType === 'floorplans') {
      mediaItem = property.media.floorplans.find(floorplan => floorplan.fileName === fileName);
      if (mediaItem && mediaItem.data) {
        res.set('Content-Type', mediaItem.fileType);
        return res.send(mediaItem.data);
      }
    } else if (mediaType === 'brochures') {
      mediaItem = property.media.brochures.find(brochure => brochure.fileName === fileName);
      if (mediaItem && mediaItem.data) {
        res.set('Content-Type', mediaItem.fileType);
        return res.send(mediaItem.data);
      }
    }

    if (!mediaItem) {
      return res.status(404).json({ message: 'Media file not found' });
    }

  } catch (err) {
    console.error('Error serving media from database:', err);
    return res.status(500).json({
      message: 'Failed to serve media file',
      error: err.message
    });
  }
});

module.exports = router;