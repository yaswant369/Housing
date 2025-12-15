const express = require('express');
const Property = require('../models/Property');
const PropertyHistory = require('../models/PropertyHistory');
const User = require('../models/User');
const authMiddleware = require('../middleware/authMiddleware');
const { uploadPropertyMediaToMemory } = require('../middleware/databaseUpload');
const { optionalPremiumCheck } = require('../middleware/premiumMiddleware');
const NotificationService = require('../services/notificationService');

const router = express.Router();

let sharp;
try {
  sharp = require('sharp');
} catch (e) {
  console.error('Sharp not installed. Please run `npm install sharp` in backend to enable image processing.');
}

const fs = require('fs').promises;
const path = require('path');

// Helper function to calculate distance using Haversine formula
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Radius of the Earth in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const distance = R * c;
  return distance;
}

// Helper function to process media files and store in database
async function processMediaFiles(property, files) {
  try {
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
        } catch (err) {
          console.error('Error processing image:', err);
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
      }
    }

  } catch (err) {
    console.error('Error processing media files:', err);
    throw err;
  }
}

// GET USER PROPERTIES (for MyListingsPage) - FIXED VERSION
router.get('/user/my-properties', authMiddleware, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = Math.min(parseInt(req.query.limit) || 50, 100);
    const skip = (page - 1) * limit;

    // Get user ID from token
    const userId = req.user.id || req.user._id;
    
    console.log(`Fetching properties for user: ${userId}`);

    // Build query - using exact match first
    const query = { userId: userId };

    // Add status filter if provided (but allow draft, active, paused, etc.)
    if (req.query.status && req.query.status !== 'all') {
      query.status = req.query.status;
    }
      

    // Add search filter if provided
    if (req.query.search && req.query.search.trim()) {
      const searchTerm = req.query.search.trim();
      query.$and = query.$and || [];
      query.$and.push({
        $or: [
          { location: { $regex: searchTerm, $options: 'i' } },
          { type: { $regex: searchTerm, $options: 'i' } },
          { description: { $regex: searchTerm, $options: 'i' } },
          { buildingName: { $regex: searchTerm, $options: 'i' } }
        ]
      });
    }

    const properties = await Property.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();
      
    const totalCount = await Property.countDocuments(query);
    
    console.log(`Found ${properties.length} properties (total: ${totalCount}) for user ${userId}`);
    
    // Transform image URLs to use relative paths
    const transformedProperties = properties.map(property => {
      // Fix legacy images array URLs - use relative paths
      if (property.images && Array.isArray(property.images)) {
        property.images = property.images.map(imagePath => {
          // If it's not a string, return as is
          if (typeof imagePath !== 'string') {
            return imagePath;
          }
          
          // If it's an absolute URL, rewrite it to relative path
          if (imagePath.startsWith('http')) {
            try {
              // Extract the path part from the absolute URL
              const url = new URL(imagePath);
              const path = url.pathname;
              return path.startsWith('/') ? path : '/' + path;
            } catch (e) {
              // If URL parsing fails, fallback to relative path conversion
              const relativePath = imagePath.replace(/^https?:\/\/[^/]+/, '');
              return relativePath.startsWith('/') ? relativePath : '/' + relativePath;
            }
          }
          
          // For relative paths, normalize path separators and ensure relative path
          const normalizedPath = imagePath.replace(/^uploads[\\/]/, 'uploads/').replace(/\\/g, '/');
          return '/' + normalizedPath;
        });
      }
      
      // Fix video URL - use relative path
      if (property.video && typeof property.video === 'string' && !property.video.startsWith('http')) {
        const normalizedPath = property.video.replace(/^uploads[\\/]/, 'uploads/').replace(/\\/g, '/');
        property.video = '/' + normalizedPath;
      }
      
      return property;
    });
    
    res.json({
      properties: transformedProperties,
      totalCount,
      totalPages: Math.ceil(totalCount / limit),
      currentPage: page,
      hasMore: page * limit < totalCount
    });
  } catch (err) {
    console.error('Error fetching user properties:', err);
    res.status(500).json({ 
      message: 'Failed to fetch properties', 
      error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
    });
  }
});

// POST - Create a new property
router.post('/', authMiddleware, uploadPropertyMediaToMemory, async (req, res) => {
  try {
    // Get user ID from token
    const userId = req.user.id || req.user._id;
    
    console.log(`Creating property for user: ${userId}`);
    
    // Generate a unique property ID
    const lastProperty = await Property.findOne().sort({ id: -1 });
    const newPropertyId = lastProperty ? lastProperty.id + 1 : 1;
    
    // Create property data with sanitization
    const propertyData = {
      id: newPropertyId,
      userId: userId,
      ...req.body
    };

    // Sanitize FormData arrays - convert single-item arrays to strings
    const fieldsToSanitize = ['furnishing', 'propertyType', 'propertyKind', 'lookingTo', 'availability', 'propertyAge', 'facing', 'ownership', 'brokerage'];
    fieldsToSanitize.forEach(field => {
      if (propertyData[field]) {
        if (Array.isArray(propertyData[field])) {
          propertyData[field] = propertyData[field][0]; // Take first item if array
        } else if (typeof propertyData[field] === 'object') {
          // Handle JSON string fields that were parsed as objects
          propertyData[field] = JSON.stringify(propertyData[field]);
        }
      }
    });
    
    // Handle price formatting
    if (req.body.price && !req.body.priceValue) {
      const priceStr = req.body.price.toString();
      const numericValue = parseFloat(priceStr.replace(/[^0-9.-]+/g, ''));
      if (!isNaN(numericValue)) {
        propertyData.priceValue = numericValue * (priceStr.includes('Cr') ? 10000000 : (priceStr.includes('L') ? 100000 : 1));
      }
    }
    
    // Set default status
    if (!propertyData.status) {
      propertyData.status = 'draft';
    }
    
    const newProperty = new Property(propertyData);
    await newProperty.save();

    // Process uploaded media files and store in database
    if (req.files) {
      await processMediaFiles(newProperty, req.files);
      await newProperty.save(); // Save again with media
    }

    console.log(`Property created successfully with ID: ${newPropertyId} for user: ${userId}`);

    res.status(201).json(newProperty);
  } catch (err) {
    console.error('Error creating property:', err);
    res.status(500).json({
      message: 'Failed to create property',
      error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
    });
  }
});

// PUT - Update an existing property
router.put('/:id', authMiddleware, uploadPropertyMediaToMemory, async (req, res) => {
  try {
    const propertyId = parseInt(req.params.id);
    const userId = req.user.id || req.user._id;

    console.log(`Updating property ${propertyId} for user: ${userId}`);

    // Find the property and ensure it belongs to the user
    const property = await Property.findOne({ id: propertyId, userId: userId });
    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    // Store old values for notification comparison
    const oldPrice = property.price;
    const oldStatus = property.status;
    const oldDescription = property.description;

    console.log('Received request body:', req.body);
    console.log('Received files:', req.files);

    // Handle form data - properly extract from req.body for FormData submissions
    let updateData = {};
    
    if (req.body && Object.keys(req.body).length > 0) {
      // For FormData submissions, req.body contains the form fields
      updateData = { ...req.body };
      
      // Parse JSON strings back to objects/arrays
      Object.keys(updateData).forEach(key => {
        const value = updateData[key];
        if (typeof value === 'string') {
          try {
            // Try to parse JSON strings (for arrays and objects)
            if (value.startsWith('[') || value.startsWith('{')) {
              const parsed = JSON.parse(value);
              updateData[key] = parsed;
            }
          } catch (e) {
            // If parsing fails, keep the original string value
            console.log(`Could not parse JSON for field ${key}:`, value);
          }
        }
      });
    }

    console.log('Processed update data:', updateData);

    // Handle field transformations for frontend-backend compatibility
    const fieldMappings = {
      // Section 1: Looking to and Listing Type
      'lookingFor': 'lookingTo',
      'propertyKind': 'propertyKind',
      
      // Property Title
      'title': 'title',
      
      // Section 3: Maintenance Charges
      'maintenanceAmount': 'maintenanceAmount',
      'maintenancePeriod': 'maintenancePeriod',
      
      // Section 4: Additional Features
      'amenities': 'amenities',
      
      // Media (handled separately)
      'media': 'media'
    };

    // Apply field mappings first
    Object.keys(fieldMappings).forEach(frontendField => {
      if (updateData[frontendField] !== undefined) {
        const backendField = fieldMappings[frontendField];
        updateData[backendField] = updateData[frontendField];
        delete updateData[frontendField];
      }
    });

    // Handle maintenance structure transformation
    if (updateData.maintenanceAmount !== undefined || updateData.maintenancePeriod !== undefined) {
      property.maintenance = property.maintenance || {};
      if (updateData.maintenanceAmount !== undefined) {
        property.maintenance.amount = updateData.maintenanceAmount;
        delete updateData.maintenanceAmount;
      }
      if (updateData.maintenancePeriod !== undefined) {
        property.maintenance.period = updateData.maintenancePeriod;
        delete updateData.maintenancePeriod;
      }
    }

    // Update property data with proper type conversion
    Object.keys(updateData).forEach(key => {
      if (updateData[key] !== undefined && updateData[key] !== null && updateData[key] !== '') {
        const value = updateData[key];
        
        // Convert string "true"/"false" to boolean
        if (value === 'true') {
          property[key] = true;
        } else if (value === 'false') {
          property[key] = false;
        }
        // Convert numeric strings to numbers
        else if (!isNaN(value) && typeof value === 'string' && value.trim() !== '' && !isNaN(parseFloat(value))) {
          property[key] = parseFloat(value);
        }
        // Handle arrays that are already parsed
        else if (Array.isArray(value)) {
          property[key] = value;
        }
        // Handle objects that are already parsed
        else if (typeof value === 'object' && value !== null) {
          // Special handling for media objects - filter out deleted items
          if (key === 'media' && value.photos) {
            const filteredMedia = { ...value };
            // Filter out any photos marked as deleted
            if (filteredMedia.photos && Array.isArray(filteredMedia.photos)) {
              filteredMedia.photos = filteredMedia.photos.filter(photo => !photo.isDeleted);
            }
            // Filter out any videos marked as deleted
            if (filteredMedia.videos && Array.isArray(filteredMedia.videos)) {
              filteredMedia.videos = filteredMedia.videos.filter(video => !video.isDeleted);
            }
            // Filter out any floorplans marked as deleted
            if (filteredMedia.floorplans && Array.isArray(filteredMedia.floorplans)) {
              filteredMedia.floorplans = filteredMedia.floorplans.filter(plan => !plan.isDeleted);
            }
            // Filter out any brochures marked as deleted
            if (filteredMedia.brochures && Array.isArray(filteredMedia.brochures)) {
              filteredMedia.brochures = filteredMedia.brochures.filter(brochure => !brochure.isDeleted);
            }
            property[key] = filteredMedia;
          } else {
            property[key] = value;
          }
        }
        // Default: assign as-is
        else {
          property[key] = value;
        }
      }
    });
    
    // Handle price formatting if price is provided
    if (updateData.price && !updateData.priceValue) {
      const priceStr = updateData.price.toString();
      const numericValue = parseFloat(priceStr.replace(/[^0-9.-]+/g, ''));
      if (!isNaN(numericValue)) {
        property.priceValue = numericValue * (priceStr.includes('Cr') ? 10000000 : (priceStr.includes('L') ? 100000 : 1));
      }
    }
    
    // Process uploaded media files and store in database
    if (req.files && Object.keys(req.files).length > 0) {
      console.log('Processing media files:', req.files);
      await processMediaFiles(property, req.files);
    }

    // Handle legacy image deletion
    if (updateData.legacyImagesToDelete && Array.isArray(updateData.legacyImagesToDelete)) {
      console.log('Processing legacy images to delete:', updateData.legacyImagesToDelete);
      
      // Sort indices in descending order to avoid index shifting issues
      const indicesToDelete = updateData.legacyImagesToDelete
        .filter(index => typeof index === 'number' && index >= 0 && index < property.images.length)
        .sort((a, b) => b - a);
      
      console.log(`Removing ${indicesToDelete.length} legacy images at indices:`, indicesToDelete);
      
      // Remove images from the array using the indices
      indicesToDelete.forEach(index => {
        const deletedImage = property.images[index];
        console.log(`Removing legacy image at index ${index}:`, deletedImage);
        
        // Remove from array
        property.images.splice(index, 1);
        
        // Optionally delete the actual file from filesystem
        if (deletedImage && typeof deletedImage === 'string') {
          try {
            const imagePath = path.join(__dirname, '..', deletedImage.replace(/^\//, ''));
            fs.unlink(imagePath).catch(err => {
              console.warn(`Could not delete file ${imagePath}:`, err.message);
            });
          } catch (err) {
            console.warn(`Error handling file deletion for ${deletedImage}:`, err.message);
          }
        }
      });
      
      console.log(`Legacy images deleted. Remaining images: ${property.images.length}`);
      
      // Clean up the legacyImagesToDelete field since we've processed it
      delete updateData.legacyImagesToDelete;
    }

    // Save the updated property
    await property.save();
    
    console.log('Property updated successfully:', property._id);

    // Send notifications for property updates
    try {
      // Check for price changes
      if (oldPrice !== property.price && property.price) {
        await NotificationService.sendPriceChangeNotification(
          userId,
          propertyId,
          oldPrice,
          property.price
        );
      }
      
      // Check for status changes
      if (oldStatus !== property.status && property.status) {
        await NotificationService.sendPropertyStatusUpdateNotification(
          userId,
          propertyId,
          oldStatus,
          property.status
        );
      }
      
      // Check if property became active (for published listings)
      if (oldStatus !== 'active' && property.status === 'active') {
        await NotificationService.createNotification({
          userId,
          type: 'property_alert',
          title: 'Property Listed Successfully',
          message: `Your property at ${property.location} is now live and visible to potential buyers/renters.`,
          actionUrl: `/property/${propertyId}`
        });
      }
      
      // Check for expired property
      if (property.status === 'expired') {
        await NotificationService.createNotification({
          userId,
          type: 'property_expired',
          title: 'Property Listing Expired',
          message: `Your property at ${property.location} has expired. Consider renewing to keep it visible.`,
          actionUrl: `/property/${propertyId}`
        });
      }
      
    } catch (notificationError) {
      console.error('Error sending property update notifications:', notificationError);
      // Don't fail the update if notifications fail
    }
    
    console.log(`Property ${propertyId} updated successfully`);
    
    res.json(property);
  } catch (err) {
    console.error('Error updating property:', err);
    res.status(500).json({
      message: 'Failed to update property',
      error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
    });
  }
});

// DELETE - Delete a property
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const propertyId = parseInt(req.params.id);
    const userId = req.user.id || req.user._id;
    
    console.log(`Deleting property ${propertyId} for user: ${userId}`);
    
    // Find and delete the property, ensuring it belongs to the user
    const property = await Property.findOneAndDelete({ id: propertyId, userId: userId });
    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }
    
    console.log(`Property ${propertyId} deleted successfully`);
    
    res.json({ message: 'Property deleted successfully' });
  } catch (err) {
    console.error('Error deleting property:', err);
    res.status(500).json({
      message: 'Failed to delete property',
      error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
    });
  }
});

// GET ALL PROPERTIES (with pagination and filtering)
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 9;
    const skip = (page - 1) * limit;

    const query = {};

    // Only show active properties to public (exclude paused, expired, sold)
    // But include user's own properties regardless of status
    if (req.user && req.user.id) {
      // If user is authenticated, include their own properties regardless of status
      query.$or = [
        { status: { $in: ['active', 'For Sale', 'For Rent', 'draft'] } },
        { userId: req.user.id }
      ];
    } else {
      query.status = { $in: ['active', 'For Sale', 'For Rent', 'draft'] };
    }

    // Exclude test properties - only show real user-uploaded properties
    query.$and = query.$and || [];
    query.$and.push({
      $nor: [
        { title: { $regex: /^test_/, $options: 'i' } },
        { description: { $regex: /test property|sample property|demo property/, $options: 'i' } }
      ]
    });

    // Handle keyword search (location-based search)
    if (req.query.keyword) {
      query.$or = [
        { location: { $regex: req.query.keyword, $options: 'i' } },
        { description: { $regex: req.query.keyword, $options: 'i' } },
        { type: { $regex: req.query.keyword, $options: 'i' } },
        { id: isNaN(req.query.keyword) ? undefined : parseInt(req.query.keyword) }
      ].filter(condition => condition !== undefined);
    }
    
    // Handle legacy q parameter for backward compatibility
    if (req.query.q) {
      query.$or = [
        { location: { $regex: req.query.q, $options: 'i' } },
        { description: { $regex: req.query.q, $options: 'i' } },
        { type: { $regex: req.query.q, $options: 'i' } },
        { id: isNaN(req.query.q) ? undefined : parseInt(req.query.q) }
      ].filter(condition => condition !== undefined);
    }

    if (req.query.listingType) {
        // Combine listing type filter with existing status filter
        const listingStatus = req.query.listingType === 'Buy' ? 'For Sale' : 'For Rent';
        const validStatuses = ['active', 'For Sale', 'For Rent'];
        
        // If we already have a status filter from authentication, combine it
        if (query.$or) {
            // Already have authentication-based filter, add listing type to it
            query.$or[0].status.$in = query.$or[0].status.$in.filter(status => validStatuses.includes(status));
            if (!query.$or[0].status.$in.includes(listingStatus)) {
                query.$or[0].status.$in.push(listingStatus);
            }
        } else {
            // No authentication, create new filter
            query.$or = [
                { status: { $in: [listingStatus, 'active'] } },
                { lookingTo: req.query.listingType === 'Buy' ? 'Sell' : 'Rent' }
            ];
        }
    }

    if (req.query.bhk && req.query.bhk !== 'any') {
      if (req.query.bhk === '5') {
        query.bhk = { $gte: 5 };
      } else {
        query.bhk = parseInt(req.query.bhk);
      }
    }

    if (req.query.furnishing && req.query.furnishing !== 'any') {
      query.furnishing = req.query.furnishing;
    }

      // Bedrooms filter
      if (req.query.minBedrooms || req.query.maxBedrooms) {
        query.bedrooms = {};
        if (req.query.minBedrooms) {
          query.bedrooms.$gte = parseInt(req.query.minBedrooms);
        }
        if (req.query.maxBedrooms) {
          query.bedrooms.$lte = parseInt(req.query.maxBedrooms);
        }
      }

      // Bathrooms filter
      if (req.query.minBathrooms || req.query.maxBathrooms) {
        query.bathrooms = {};
        if (req.query.minBathrooms) {
          query.bathrooms.$gte = parseInt(req.query.minBathrooms);
        }
        if (req.query.maxBathrooms) {
          query.bathrooms.$lte = parseInt(req.query.maxBathrooms);
        }
      }

      // Property type/kind filter
      if (req.query.propertyType) {
        if (Array.isArray(req.query.propertyType)) {
          query.propertyType = { $in: req.query.propertyType };
        } else {
          query.propertyType = req.query.propertyType;
        }
      }
      if (req.query.propertyKind && req.query.propertyKind !== 'any') {
        query.propertyKind = req.query.propertyKind;
      }

      // Enhanced location radius filter (supports both legacy and new parameters)
      let useLocationFilter = false;
      let lat, lng, radiusKm;

      // Check for new near me parameters (from frontend)
      if (req.query.lat && req.query.lng && req.query.radius) {
        lat = parseFloat(req.query.lat);
        lng = parseFloat(req.query.lng);
        radiusKm = parseFloat(req.query.radius) / 1000; // Convert meters to kilometers
        useLocationFilter = true;
        console.log(`Using new near me parameters: lat=${lat}, lng=${lng}, radius=${radiusKm}km`);
      }
      // Check for legacy parameters
      else if (req.query.latitude && req.query.longitude && req.query.radiusKm) {
        lat = parseFloat(req.query.latitude);
        lng = parseFloat(req.query.longitude);
        radiusKm = parseFloat(req.query.radiusKm);
        useLocationFilter = true;
        console.log(`Using legacy location parameters: lat=${lat}, lng=${lng}, radius=${radiusKm}km`);
      }

      if (useLocationFilter && !isNaN(lat) && !isNaN(lng) && !isNaN(radiusKm)) {
        // First, get properties that have coordinates
        const radiusFilter = {
          latitude: { $exists: true, $ne: null },
          longitude: { $exists: true, $ne: null }
        };

        // Apply the radius filter
        const radius = radiusKm / 6371; // Convert km to radians (Earth radius = 6371km)
        query.$and = query.$and || [];
        query.$and.push({
          $expr: {
            $lte: [
              {
                $divide: [
                  {
                    $add: [
                      {
                        $pow: [{ $subtract: ["$latitude", lat] }, 2]
                      },
                      {
                        $pow: [{ $subtract: ["$longitude", lng] }, 2]
                      }
                    ]
                  },
                  1
                ]
              },
              radius * radius
            ]
          }
        });

        console.log(`Applied location filter: radius ${radiusKm}km around (${lat}, ${lng})`);
      }

    if (req.query.minPrice || req.query.maxPrice) {
      query.priceValue = {};
      if (req.query.minPrice) {
        query.priceValue.$gte = parseInt(req.query.minPrice);
      }
      if (req.query.maxPrice) {
        query.priceValue.$lte = parseInt(req.query.maxPrice);
      }
    }

    if (req.query.amenities) {
      const amenities = Array.isArray(req.query.amenities) ? req.query.amenities : req.query.amenities.split(',');
      if (amenities.length > 0) {
        query.amenities = { $all: amenities };
      }
    }
    
    // Construction status filter
    if (req.query.constructionStatus) {
      const statuses = Array.isArray(req.query.constructionStatus) ? req.query.constructionStatus : req.query.constructionStatus.split(',');
      if (statuses.length > 0) {
        query.constructionStatus = { $in: statuses };
      }
    }
    
    // Posted by filter
    if (req.query.postedBy) {
      const postedBy = Array.isArray(req.query.postedBy) ? req.query.postedBy : req.query.postedBy.split(',');
      if (postedBy.length > 0) {
        query.sellerType = { $in: postedBy };
      }
    }

    if (req.query.gatedCommunity === 'true') {
      query.gatedCommunity = true;
    }

    if (req.query.facing && req.query.facing !== 'any') {
      query.facing = req.query.facing;
    }

    const properties = await Property.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
      
    const totalCount = await Property.countDocuments(query);
    
    // Transform image URLs to use relative paths
    const transformedProperties = properties.map(property => {
      const propertyObj = property.toObject();
      
      // Fix legacy images array URLs - use relative paths
      if (propertyObj.images && Array.isArray(propertyObj.images)) {
        propertyObj.images = propertyObj.images.map(imagePath => {
          // If it's not a string, return as is
          if (typeof imagePath !== 'string') {
            return imagePath;
          }
          
          // If it's an absolute URL, rewrite it to relative path
          if (imagePath.startsWith('http')) {
            try {
              // Extract the path part from the absolute URL
              const url = new URL(imagePath);
              const path = url.pathname;
              return path.startsWith('/') ? path : '/' + path;
            } catch (e) {
              // If URL parsing fails, fallback to relative path conversion
              const relativePath = imagePath.replace(/^https?:\/\/[^/]+/, '');
              return relativePath.startsWith('/') ? relativePath : '/' + relativePath;
            }
          }
          
          // For relative paths, normalize path separators and ensure relative path
          const normalizedPath = imagePath.replace(/^uploads[\\/]/, 'uploads/').replace(/\\/g, '/');
          return '/' + normalizedPath;
        });
      }
      
      // Fix video URL - use relative path
      if (propertyObj.video && typeof propertyObj.video === 'string' && !propertyObj.video.startsWith('http')) {
        const normalizedPath = propertyObj.video.replace(/^uploads[\\/]/, 'uploads/').replace(/\\/g, '/');
        propertyObj.video = '/' + normalizedPath;
      }

      // Add distance calculation for location-based searches
      if (useLocationFilter && propertyObj.latitude && propertyObj.longitude) {
        const distance = calculateDistance(lat, lng, propertyObj.latitude, propertyObj.longitude);
        propertyObj.distance = Math.round(distance * 100) / 100; // Round to 2 decimal places
      }
      
      return propertyObj;
    });

    // Sort by distance if location filter was applied
    if (useLocationFilter) {
      transformedProperties.sort((a, b) => {
        if (a.distance !== undefined && b.distance !== undefined) {
          return a.distance - b.distance;
        }
        return 0;
      });
    }
    
    res.json({
      properties: transformedProperties,
      totalCount,
      totalPages: Math.ceil(totalCount / limit),
      currentPage: page,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET SINGLE PROPERTY BY ID
router.get('/:id', async (req, res) => {
  try {
    const propertyId = parseInt(req.params.id);
    const property = await Property.findOne({ id: propertyId });

    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    // Transform image URLs to use relative paths
    const propertyObj = property.toObject();

    // Fix legacy images array URLs - use relative paths
    if (propertyObj.images && Array.isArray(propertyObj.images)) {
      propertyObj.images = propertyObj.images.map(imagePath => {
        // If it's not a string, return as is
        if (typeof imagePath !== 'string') {
          return imagePath;
        }

        // If it's an absolute URL, rewrite it to relative path
        if (imagePath.startsWith('http')) {
          try {
            // Extract the path part from the absolute URL
            const url = new URL(imagePath);
            const path = url.pathname;
            return path.startsWith('/') ? path : '/' + path;
          } catch (e) {
            // If URL parsing fails, fallback to relative path conversion
            const relativePath = imagePath.replace(/^https?:\/\/[^/]+/, '');
            return relativePath.startsWith('/') ? relativePath : '/' + relativePath;
          }
        }

        // For relative paths, normalize path separators and ensure relative path
        const normalizedPath = imagePath.replace(/^uploads[\\/]/, 'uploads/').replace(/\\/g, '/');
        return '/' + normalizedPath;
      });
    }

    // Fix video URL - use relative path
    if (propertyObj.video && typeof propertyObj.video === 'string' && !propertyObj.video.startsWith('http')) {
      const normalizedPath = propertyObj.video.replace(/^uploads[\\/]/, 'uploads/').replace(/\\/g, '/');
      propertyObj.video = '/' + normalizedPath;
    }

    res.json(propertyObj);
  } catch (err) {
    console.error('Error fetching property:', err);
    res.status(500).json({
      message: 'Failed to fetch property',
      error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
    });
  }
});

module.exports = router;