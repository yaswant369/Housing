const mongoose = require('mongoose');
const Property = require('./models/Property');
const fs = require('fs').promises;
const path = require('path');
const sharp = require('sharp');
require('dotenv').config();

async function migrateMediaToDatabase() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Get all properties
    const properties = await Property.find({});
    console.log(`Found ${properties.length} properties to check`);

    let migratedCount = 0;
    let errorCount = 0;

    for (const property of properties) {
      try {
        console.log(`Processing property ${property.id}...`);
        let hasChanges = false;

        // Initialize media structure if not exists
        if (!property.media) {
          property.media = {
            photos: [],
            videos: [],
            floorplans: [],
            brochures: []
          };
        }

        // Migrate legacy images
        if (property.images && Array.isArray(property.images) && property.images.length > 0) {
          console.log(`Property ${property.id} has ${property.images.length} legacy images:`, property.images);

          for (const imagePath of property.images) {
            console.log(`Processing imagePath: "${imagePath}"`);
            try {
              // Handle different image path formats and normalize path separators
              let normalizedPath = imagePath.replace(/\\/g, '/'); // Convert backslashes to forward slashes

              let relativePath;
              if (normalizedPath.startsWith('/uploads/')) {
                relativePath = normalizedPath.substring(1); // Remove leading /
              } else if (normalizedPath.startsWith('uploads/')) {
                relativePath = normalizedPath;
              } else if (normalizedPath.startsWith('/')) {
                relativePath = 'uploads' + normalizedPath; // /file.jpg -> uploads/file.jpg
              } else {
                relativePath = 'uploads/' + normalizedPath; // file.jpg -> uploads/file.jpg
              }

              const fullPath = path.join(__dirname, relativePath);

              console.log(`Reading image: ${fullPath}`);

              // Check if file exists
              try {
                await fs.access(fullPath);
              } catch (err) {
                console.warn(`File not found: ${fullPath}, skipping...`);
                continue;
              }

              // Read file
              const fileBuffer = await fs.readFile(fullPath);
              const fileName = path.basename(fullPath);
              const fileType = 'image/webp'; // Assume webp since processed

              // Process with sharp to create different sizes
              const imageBuffer = fileBuffer;

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
                fileName: fileName,
                fileType: fileType,
                fileSize: fileBuffer.length,
                data: imageBuffer,
                thumbnailData: thumbnailBuffer,
                mediumData: mediumBuffer,
                optimizedData: optimizedBuffer,
                uploadDate: property.createdAt || new Date(),
                isLegacy: true
              });

              console.log(`Migrated image: ${fileName}`);
              hasChanges = true;

            } catch (err) {
              console.error(`Error processing image ${imagePath}:`, err.message);
              errorCount++;
            }
          }
        }

        // Migrate legacy video
        if (property.video && typeof property.video === 'string') {
          try {
            let normalizedVideoPath = property.video.replace(/\\/g, '/'); // Convert backslashes to forward slashes

            let relativePath;
            if (normalizedVideoPath.startsWith('/uploads/')) {
              relativePath = normalizedVideoPath.substring(1); // Remove leading /
            } else if (normalizedVideoPath.startsWith('uploads/')) {
              relativePath = normalizedVideoPath;
            } else if (normalizedVideoPath.startsWith('/')) {
              relativePath = 'uploads' + normalizedVideoPath; // /file.mp4 -> uploads/file.mp4
            } else {
              relativePath = 'uploads/' + normalizedVideoPath; // file.mp4 -> uploads/file.mp4
            }

            const fullPath = path.join(__dirname, relativePath);

            console.log(`Reading video: ${fullPath}`);

            // Check if file exists
            try {
              await fs.access(fullPath);
            } catch (err) {
              console.warn(`Video file not found: ${fullPath}, skipping...`);
              continue;
            }

            // Read file
            const fileBuffer = await fs.readFile(fullPath);
            const fileName = path.basename(fullPath);
            const fileType = 'video/mp4'; // Assume mp4

            // Add to property media
            property.media.videos.push({
              fileName: fileName,
              fileType: fileType,
              fileSize: fileBuffer.length,
              data: fileBuffer,
              uploadDate: property.createdAt || new Date(),
              isLegacy: true
            });

            console.log(`Migrated video: ${fileName}`);
            hasChanges = true;

          } catch (err) {
            console.error(`Error processing video ${property.video}:`, err.message);
            errorCount++;
          }
        }

        // Save property if changes were made
        if (hasChanges) {
          await property.save();
          console.log(`Property ${property.id} updated with migrated media`);
          migratedCount++;
        } else {
          console.log(`Property ${property.id} has no legacy media to migrate`);
        }

      } catch (err) {
        console.error(`Error processing property ${property.id}:`, err.message);
        errorCount++;
      }
    }

    console.log(`\nMigration completed:`);
    console.log(`- Properties migrated: ${migratedCount}`);
    console.log(`- Errors: ${errorCount}`);

  } catch (err) {
    console.error('Migration failed:', err);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

// Run migration
if (require.main === module) {
  migrateMediaToDatabase();
}

module.exports = migrateMediaToDatabase;