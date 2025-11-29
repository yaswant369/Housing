// backend/routes/properties.js
const express = require('express');
const Property = require('../models/Property');
const PropertyHistory = require('../models/PropertyHistory');
const authMiddleware = require('../middleware/authMiddleware');
const { uploadPropertyMedia } = require('../middleware/upload'); // Import new upload middleware
const { optionalPremiumCheck } = require('../middleware/premiumMiddleware');

const router = express.Router();

let sharp;
try {
  sharp = require('sharp');
} catch (e) {
  console.error('Sharp not installed. Please run `npm install sharp` in backend to enable image processing.');
}

const fs = require('fs').promises;
const path = require('path');

async function processImagesAndReturnPaths(files, propertyId) {
  if (!sharp) return files.map(f => f.path);
  const outDir = path.join(__dirname, '..', 'uploads', 'properties', String(propertyId));
  await fs.mkdir(outDir, { recursive: true });
  const results = [];
  for (const file of files) {
    const originalPath = file.path;
    const filenameBase = path.parse(file.filename).name;

    const thumbName = `${filenameBase}_thumb.webp`;
    const mediumName = `${filenameBase}_medium.webp`;
    const optimizedName = `${filenameBase}_orig.webp`;

    const thumbPath = path.join(outDir, thumbName);
    const mediumPath = path.join(outDir, mediumName);
    const optimizedPath = path.join(outDir, optimizedName);

    // Thumbnail: 360x240 - preserve aspect ratio (no crop)
    await sharp(originalPath)
      .rotate()
      .resize(360, 240, { fit: 'inside', withoutEnlargement: true })
      .webp({ quality: 80 })
      .toFile(thumbPath);

    // Medium: 800x530 - preserve aspect ratio (no crop)
    await sharp(originalPath)
      .rotate()
      .resize(800, 530, { fit: 'inside', withoutEnlargement: true })
      .webp({ quality: 80 })
      .toFile(mediumPath);

    // Optimized original: max width 1600
    const meta = await sharp(originalPath).metadata();
    const resizeWidth = meta.width && meta.width > 1600 ? 1600 : meta.width;
    if (resizeWidth) {
      await sharp(originalPath)
        .rotate()
        .resize({ width: resizeWidth, withoutEnlargement: true })
        .webp({ quality: 75 })
        .toFile(optimizedPath);
    } else {
      await sharp(originalPath).rotate().webp({ quality: 75 }).toFile(optimizedPath);
    }

    // remove original
    try { await fs.unlink(originalPath); } catch (e) { /* ignore */ }

    // store object with three sizes
    results.push({
      thumbnail: `/uploads/properties/${propertyId}/${thumbName}`,
      medium: `/uploads/properties/${propertyId}/${mediumName}`,
      optimized: `/uploads/properties/${propertyId}/${optimizedName}`
    });
  }

      return results;
  }
  
  function parseStructuredData(body) {
    const data = {};
    if (body.keyHighlights) {
      try {
        data.keyHighlights = JSON.parse(body.keyHighlights);
      } catch (e) {
        console.error("Error parsing keyHighlights", e);
      }
    }
    if (body.amenities) {
      try {
        data.amenities = JSON.parse(body.amenities);
      } catch (e) {
        console.error("Error parsing amenities", e);
      }
    }
      if (body.priceIncludes) {
      try {
        data.priceIncludes = JSON.parse(body.priceIncludes);
      } catch (e) {
        console.error("Error parsing priceIncludes", e);
      }
    }
      if (body.nearbyLandmarks) {
      try {
        data.nearbyLandmarks = JSON.parse(body.nearbyLandmarks);
      } catch (e) {
        console.error("Error parsing nearbyLandmarks", e);
      }
    }
    if (body.gatedCommunity) {
      data.gatedCommunity = body.gatedCommunity === 'true' || body.gatedCommunity === true;
    }
    if (body.maintenance) {
        try {
            data.maintenance = JSON.parse(body.maintenance);
        } catch (e) {
            console.error("Error parsing maintenance", e);
        }
    }
  
    // Also copy over other new string fields directly
    const otherFields = ['facing', 'propertyOnFloor', 'reraId'];
    otherFields.forEach(field => {
      if (body[field]) {
        data[field] = body[field];
      }
    });
  
    return data;
  }
// Initialize analytics data for existing properties
async function initializeAnalyticsData() {
  try {
    const properties = await Property.find({
      $or: [
        { viewsLast30Days: { $exists: false } },
        { viewsLast7Days: { $exists: false } },
        { leadsLast30Days: { $exists: false } },
        { leadsLast7Days: { $exists: false } },
        { shortlistsCount: { $exists: false } },
        { planType: { $exists: false } }
      ]
    });

    for (const property of properties) {
      // Generate random but realistic analytics data
      const updates = {
        viewsLast7Days: Math.floor(Math.random() * 50) + 10,
        viewsLast30Days: Math.floor(Math.random() * 200) + 50,
        leadsLast7Days: Math.floor(Math.random() * 15) + 2,
        leadsLast30Days: Math.floor(Math.random() * 60) + 10,
        shortlistsCount: Math.floor(Math.random() * 25) + 3,
        planType: ['free', 'featured', 'premium'][Math.floor(Math.random() * 3)],
        buildingName: property.type.includes('Apartment') ? 
          `${property.bhk}BHK in ${property.city || 'Premium Location'}` : undefined
      };

      // Set expiration date for non-free plans
      if (updates.planType !== 'free') {
        updates.expiresAt = new Date(Date.now() + Math.random() * 30 * 24 * 60 * 60 * 1000);
      }

      await Property.updateOne({ _id: property._id }, updates);
    }

    console.log(`Initialized analytics data for ${properties.length} properties`);
  } catch (error) {
    console.error('Failed to initialize analytics data:', error);
  }
}

// Update property statuses (check for expired listings)
async function updatePropertyStatuses() {
  try {
    const now = new Date();
    
    // Update expired properties
    const expiredUpdate = await Property.updateMany(
      {
        expiresAt: { $lt: now },
        status: { $in: ['active', 'featured', 'premium'] }
      },
      { 
        status: 'expired',
        updatedAt: now
      }
    );

    if (expiredUpdate.modifiedCount > 0) {
      console.log(`Marked ${expiredUpdate.modifiedCount} properties as expired`);
    }

    // Update draft properties that haven't been updated in 30 days to expired
    const oldDrafts = await Property.updateMany(
      {
        status: 'draft',
        updatedAt: { $lt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }
      },
      {
        status: 'expired',
        updatedAt: now
      }
    );

    if (oldDrafts.modifiedCount > 0) {
      console.log(`Marked ${oldDrafts.modifiedCount} old draft properties as expired`);
    }

  } catch (error) {
    console.error('Failed to update property statuses:', error);
  }
}

// Property History Tracking Middleware
async function trackPropertyHistory(propertyId, userId, changeType, previousData, currentData, req, additionalData = {}) {
  try {
    const changedFields = [];
    
    // Find changed fields if we have both previous and current data
    if (previousData && currentData) {
      const allKeys = new Set([...Object.keys(previousData), ...Object.keys(currentData)]);
      for (const key of allKeys) {
        if (JSON.stringify(previousData[key]) !== JSON.stringify(currentData[key])) {
          changedFields.push(key);
        }
      }
    }
    
    const historyEntry = new PropertyHistory({
      propertyId,
      userId,
      changeType,
      previousData,
      currentData,
      changedFields,
      changedBy: userId,
      ipAddress: req.ip || req.connection.remoteAddress,
      userAgent: req.get('User-Agent'),
      ...additionalData
    });
    
    await historyEntry.save();
    console.log(`Property history tracked: ${changeType} for property ${propertyId}`);
  } catch (error) {
    console.error('Failed to track property history:', error);
    // Don't throw error to avoid breaking the main operation
  }
}

// Run status updates every hour
setInterval(updatePropertyStatuses, 60 * 60 * 1000);

// GET ALL ACTIVE PROPERTIES FOR HOMEPAGE (with pagination and filtering)
router.get('/homepage', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 9;
    const skip = (page - 1) * limit;

    const query = {};
    
    // Show all active properties - both 'active' status and 'For Sale'/'For Rent' status
    query.$or = [
      { status: 'active' },
      { status: 'For Sale' },
      { status: 'For Rent' }
    ];

    if (req.query.q) {
      query.$and = query.$and || [];
      query.$and.push({
        $or: [
          { location: { $regex: req.query.q, $options: 'i' } },
          { description: { $regex: req.query.q, $options: 'i' } },
          { type: { $regex: req.query.q, $options: 'i' } },
          { id: isNaN(req.query.q) ? undefined : parseInt(req.query.q) }
        ].filter(condition => condition !== undefined)
      });
    }

    if (req.query.listingType) {
      if(req.query.listingType === 'Buy') {
        query.$and = query.$and || [];
        query.$and.push({
          $or: [
            { status: 'For Sale' },
            { lookingTo: 'Sell' }
          ]
        });
      }
      else if(req.query.listingType === 'Rent') {
        query.$and = query.$and || [];
        query.$and.push({
          $or: [
            { status: 'For Rent' },
            { lookingTo: 'Rent' }
          ]
        });
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

    if (req.query.gatedCommunity === 'true') {
      query.gatedCommunity = true;
    }

    if (req.query.facing && req.query.facing !== 'any') {
      query.facing = req.query.facing;
    }

    const properties = await Property.find(query)
      .sort({ isFeatured: -1, createdAt: -1 })
      .skip(skip)
      .limit(limit);
      
    const totalCount = await Property.countDocuments(query);
    
    res.json({
      properties,
      totalCount,
      totalPages: Math.ceil(totalCount / limit),
      currentPage: page,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Call initialization on server start (disabled to prevent startup error)
// initializeAnalyticsData();

// GET ALL PROPERTIES (with pagination and filtering)
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 9;
    const skip = (page - 1) * limit;

    const query = {};

    if (req.query.q) {
      query.$or = [
        { location: { $regex: req.query.q, $options: 'i' } },
        { description: { $regex: req.query.q, $options: 'i' } },
        { type: { $regex: req.query.q, $options: 'i' } },
        { id: isNaN(req.query.q) ? undefined : parseInt(req.query.q) }
      ].filter(condition => condition !== undefined);
    }

    if (req.query.listingType) {
        if(req.query.listingType === 'Buy') query.status = 'For Sale';
        else if(req.query.listingType === 'Rent') query.status = 'For Rent';
        // Also include properties with matching status in the enum
        const validStatuses = ['active', 'For Sale', 'For Rent'];
        query.$or = [
            { status: { $in: validStatuses } },
            { lookingTo: req.query.listingType === 'Buy' ? 'Sell' : 'Rent' }
        ];
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
    
    res.json({
      properties,
      totalCount,
      totalPages: Math.ceil(totalCount / limit),
      currentPage: page,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET ONE PROPERTY (with premium check for contact details)
router.get('/:id', optionalPremiumCheck, async (req, res) => {
  try {
    const property = await Property.findOne({ id: req.params.id });
    if (!property) return res.status(404).json({ message: 'Property not found' });
    
    // Hide sensitive info if user is not premium
    const propertyData = property.toObject();
    
    if (!req.isPremiumUser) {
      // Hide exact location (show only city/area)
      if (propertyData.location) {
        const locationParts = propertyData.location.split(',');
        propertyData.location = locationParts.slice(-2).join(',').trim(); // Show only city/state
        propertyData.locationHidden = true;
      }
      
      // Hide phone number
      if (propertyData.phoneNumber) {
        propertyData.phoneNumber = 'XXXXXXXXXX';
        propertyData.phoneNumberHidden = true;
      }
      
      propertyData.requiresPremium = true;
    } else {
      propertyData.requiresPremium = false;
      propertyData.locationHidden = false;
      propertyData.phoneNumberHidden = false;
    }
    
    res.json(propertyData);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET USER PROPERTIES (for MyListingsPage) - IMPROVED VERSION
router.get('/user/my-properties', authMiddleware, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = Math.min(parseInt(req.query.limit) || 50, 100); // Cap at 100 for performance
    const skip = (page - 1) * limit;

    // Ensure user ID is properly handled - check both id formats for backward compatibility
    const userId = req.user.id;
    const userObjectId = req.user._id;
    
    console.log(`Fetching properties for user: ${userId} (ObjectId: ${userObjectId})`);

    // Build the query with better filtering
    const query = {
      $or: [
        { userId: userId },
        { userId: userObjectId } // Handle both string and ObjectId formats
      ]
    };

    // Add status filter if provided
    if (req.query.status && req.query.status !== 'all') {
      query.status = req.query.status;
    }

    // Add search filter if provided with better error handling
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

    // Use lean() for better performance when we don't need Mongoose documents
    const properties = await Property.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();
      
    const totalCount = await Property.countDocuments(query);
    
    console.log(`Found ${properties.length} properties (total: ${totalCount}) for user ${userId}`);
    
    res.json({
      properties,
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

// POST access property contact (requires premium and uses contact quota)
router.post('/:id/access-contact', authMiddleware, async (req, res) => {
  try {
    const { checkPremiumAccess, checkContactLimit } = require('../middleware/premiumMiddleware');
    const User = require('../models/User');
    
    // Manual checks
    await new Promise((resolve, reject) => {
      checkPremiumAccess(req, res, (err) => {
        if (err) reject(err);
        else resolve();
      });
    });
    
    await new Promise((resolve, reject) => {
      checkContactLimit(req, res, (err) => {
        if (err) reject(err);
        else resolve();
      });
    });
    
    const property = await Property.findOne({ id: req.params.id });
    if (!property) return res.status(404).json({ message: 'Property not found' });
    
    // Use a contact from subscription
    await req.subscription.useContact();
    
    // Log access
    const user = req.userWithSubscription;
    user.contactAccessLog.push({
      propertyId: property.id,
      accessedAt: new Date(),
      subscriptionId: req.subscription.subscriptionId
    });
    await user.save();
    
    // Return full contact details
    res.json({
      success: true,
      contactDetails: {
        phoneNumber: property.phoneNumber,
        location: property.location,
        contactsRemaining: req.subscription.contactsAllowed - req.subscription.contactsUsed
      }
    });
    
  } catch (err) {
    if (err.message === 'Contact limit reached or subscription expired') {
      return res.status(403).json({ 
        message: err.message,
        code: 'CONTACT_LIMIT_REACHED'
      });
    }
    res.status(500).json({ message: err.message });
  }
});

// --- IMPROVED POSTING with Better Error Handling and User ID Validation ---
// Create new property
router.post('/', authMiddleware, uploadPropertyMedia, async (req, res) => { 
  try {
    // Validate user authentication and userId consistency
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: 'Invalid user authentication' });
    }

    console.log(`Creating property for user: ${req.user.id}`);

    // Get next available property ID with transaction-like behavior
    const session = await Property.startSession();
    session.startTransaction();
    
    try {
      const lastProperty = await Property.findOne().sort({ id: -1 }).session(session);
      const newId = lastProperty ? lastProperty.id + 1 : 1;
      
      const structuredData = parseStructuredData(req.body);
      
      // Ensure userId is properly set and consistent
      const userId = req.user.id;
      
      const propertyData = { 
        ...req.body, 
        ...structuredData, 
        id: newId, 
        userId: userId, // Ensure consistent userId format
        createdAt: new Date(),
        updatedAt: new Date()
      };

      // Validate required fields
      const requiredFields = ['type', 'location', 'price', 'priceValue'];
      for (const field of requiredFields) {
        if (!propertyData[field]) {
          throw new Error(`Missing required field: ${field}`);
        }
      }

      // Handle new images (process and store medium versions)
      if (req.files.images) {
        const processed = await processImagesAndReturnPaths(req.files.images, newId);
        propertyData.images = processed;
      }

      // Handle new video
      if (req.files.video) {
        propertyData.video = req.files.video[0].path;
      }

      // Create and save property
      const property = new Property(propertyData);
      const newProperty = await property.save({ session });
      
      // Commit the transaction
      await session.commitTransaction();
      session.endSession();
      
      console.log(`Successfully created property ${newId} for user ${userId}`);
      
      // Track property creation in history (outside transaction)
      await trackPropertyHistory(
        newId, 
        userId, 
        'created', 
        null, 
        newProperty.toObject(), 
        req,
        { changeReason: 'Property created via wizard' }
      );
      
      res.status(201).json({
        success: true,
        property: newProperty,
        message: 'Property created successfully'
      });
      
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      throw error;
    }
    
  } catch (err) {
    console.error('Property creation failed:', err);
    res.status(400).json({ 
      success: false,
      message: 'Failed to create property', 
      error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
    });
  }
});

// --- THIS IS THE FIX for UPDATING with History Tracking ---
// Update a property
router.put('/:id', authMiddleware, uploadPropertyMedia, async (req, res) => { 
  try {
    const property = await Property.findOne({ id: req.params.id });
    if (!property) return res.status(404).json({ message: 'Property not found' });
    if (property.userId !== req.user.id) {
      return res.status(401).json({ message: 'User not authorized' });
    }

    // Store previous state for history tracking
    const previousData = property.toObject();

    const structuredData = parseStructuredData(req.body);
    const updateData = { ...req.body, ...structuredData };
    
    // Get kept images/video paths from frontend
    const keptImages = req.body.keptImages ? JSON.parse(req.body.keptImages) : [];
    const keptVideo = req.body.keptVideo ? req.body.keptVideo : null;

    // Normalize kept images (they might be legacy strings or objects)
    function normalizeKeptImage(item) {
      if (!item) return null;
      if (typeof item === 'object') return item;
      let str = String(item);
      const ensureLeading = p => p.startsWith('/') ? p : `/${p}`;
      if (str.includes('_medium')) {
        const thumb = str.replace('_medium', '_thumb');
        const optimized = str.replace('_medium', '_orig');
        return { thumbnail: ensureLeading(thumb), medium: ensureLeading(str), optimized: ensureLeading(optimized) };
      } else if (str.includes('_thumb')) {
        const medium = str.replace('_thumb', '_medium');
        const optimized = str.replace('_thumb', '_orig');
        return { thumbnail: ensureLeading(str), medium: ensureLeading(medium), optimized: ensureLeading(optimized) };
      } else if (str.includes('_orig')) {
        const medium = str.replace('_orig', '_medium');
        const thumb = str.replace('_orig', '_thumb');
        return { thumbnail: ensureLeading(thumb), medium: ensureLeading(medium), optimized: ensureLeading(str) };
      } else {
        // fallback: use same path for all slots
        return { thumbnail: ensureLeading(str), medium: ensureLeading(str), optimized: ensureLeading(str) };
      }
    }

    // Get new image paths and process them
    const processedNewImages = req.files.images ? await processImagesAndReturnPaths(req.files.images, req.params.id) : [];
    // Combine normalized kept + new images
    const normalizedKept = keptImages.map(normalizeKeptImage).filter(Boolean);
    updateData.images = [...normalizedKept, ...processedNewImages];
    
    // Handle video
    if (req.files.video) {
      // If new video, it's the only one
      updateData.video = req.files.video[0].path;
    } else if (keptVideo) {
      // If no new video, keep the old one
      updateData.video = keptVideo;
    } else {
      // If no new and no kept, remove it
      updateData.video = null;
    }

    // Remove temp fields from updateData
    delete updateData.keptImages;
    delete updateData.keptVideo;

    const updatedProperty = await Property.findOneAndUpdate(
      { id: req.params.id }, 
      updateData, 
      { new: true }
    );
    
    // Determine change type for history
    let changeType = 'updated';
    if (updateData.status && updateData.status !== previousData.status) {
      changeType = 'status_changed';
    } else if (updateData.priceValue && updateData.priceValue !== previousData.priceValue) {
      changeType = 'price_changed';
    } else if (req.files.images || req.files.video || (updateData.images && JSON.stringify(updateData.images) !== JSON.stringify(previousData.images))) {
      changeType = 'media_changed';
    }
    
    // Track property update in history
    await trackPropertyHistory(
      req.params.id,
      req.user.id,
      changeType,
      previousData,
      updatedProperty.toObject(),
      req,
      { changeReason: 'Property updated via wizard' }
    );
    
    res.json(updatedProperty);
  } catch (err) {
    console.error(err.message); // Log the full error
    res.status(400).json({ message: err.message });
  }
});

// BULK UPDATE PROPERTIES
router.patch('/bulk', authMiddleware, async (req, res) => {
  try {
    const { propertyIds, action, data } = req.body;
    
    if (!Array.isArray(propertyIds) || propertyIds.length === 0) {
      return res.status(400).json({ message: 'Property IDs array is required' });
    }

    const properties = await Property.find({ 
      id: { $in: propertyIds },
      userId: req.user.id 
    });

    if (properties.length !== propertyIds.length) {
      return res.status(404).json({ message: 'Some properties not found or unauthorized' });
    }

    let updateData = {};
    let successMessage = '';

    switch (action) {
      case 'set-status':
        if (!data.status) {
          return res.status(400).json({ message: 'Status is required' });
        }
        updateData = { status: data.status };
        successMessage = `Status updated to ${data.status}`;
        break;
      
      case 'set-online':
        updateData = { status: 'active' };
        successMessage = 'Properties set to online';
        break;
      
      case 'set-offline':
        updateData = { status: 'paused' };
        successMessage = 'Properties set to offline';
        break;
      
      case 'mark-sold':
        updateData = { status: 'sold' };
        successMessage = 'Properties marked as sold';
        break;
      
      case 'renew':
        const newExpiryDate = new Date();
        newExpiryDate.setDate(newExpiryDate.getDate() + 30);
        updateData = { 
          status: 'active',
          expiresAt: newExpiryDate 
        };
        successMessage = 'Properties renewed for 30 days';
        break;
      
      case 'update-plan':
        if (!data.planType) {
          return res.status(400).json({ message: 'Plan type is required' });
        }
        updateData = { planType: data.planType };
        successMessage = `Plan updated to ${data.planType}`;
        break;
      
      default:
        return res.status(400).json({ message: 'Invalid action' });
    }

    // Add updated timestamp
    updateData.updatedAt = new Date();

    const result = await Property.updateMany(
      { 
        id: { $in: propertyIds },
        userId: req.user.id 
      },
      updateData
    );

    res.json({ 
      message: successMessage,
      modifiedCount: result.modifiedCount,
      matchedCount: result.matchedCount
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// UPDATE PROPERTY STATUS with History Tracking
router.patch('/:id/status', authMiddleware, async (req, res) => {
  try {
    const { status } = req.body;
    
    if (!status) {
      return res.status(400).json({ message: 'Status is required' });
    }

    const validStatuses = ['draft', 'pending', 'active', 'paused', 'expired', 'sold', 'For Sale', 'For Rent'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const property = await Property.findOne({ id: req.params.id });
    if (!property) return res.status(404).json({ message: 'Property not found' });
    
    if (property.userId !== req.user.id) {
      return res.status(401).json({ message: 'User not authorized' });
    }

    // Store previous state for history tracking
    const previousData = property.toObject();

    const updatedProperty = await Property.findOneAndUpdate(
      { id: req.params.id },
      { 
        status,
        updatedAt: new Date()
      },
      { new: true }
    );

    // Track status change in history
    await trackPropertyHistory(
      req.params.id,
      req.user.id,
      'status_changed',
      previousData,
      updatedProperty.toObject(),
      req,
      { changeReason: `Status changed from ${previousData.status} to ${status}` }
    );

    res.json({
      message: `Property status updated to ${status}`,
      property: updatedProperty
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DUPLICATE PROPERTY
router.post('/:id/duplicate', authMiddleware, async (req, res) => {
  try {
    const originalProperty = await Property.findOne({ id: req.params.id });
    if (!originalProperty) return res.status(404).json({ message: 'Property not found' });
    
    if (originalProperty.userId !== req.user.id) {
      return res.status(401).json({ message: 'User not authorized' });
    }

    // Get next available ID
    const lastProperty = await Property.findOne().sort({ id: -1 });
    const newId = lastProperty ? lastProperty.id + 1 : 1;

    // Create duplicate (exclude certain fields)
    const {
      _id, id, createdAt, updatedAt, viewsLast7Days, viewsLast30Days,
      leadsLast7Days, leadsLast30Days, shortlistsCount,
      ...propertyData
    } = originalProperty.toObject();

    // Modify title to indicate it's a copy
    propertyData.type = `${propertyData.type} (Copy)`;
    propertyData.status = 'draft'; // Set as draft initially
    propertyData.id = newId;
    propertyData.userId = req.user.id;

    const duplicatedProperty = new Property(propertyData);
    const savedProperty = await duplicatedProperty.save();

    res.status(201).json({
      message: 'Property duplicated successfully',
      property: savedProperty
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET PROPERTY ANALYTICS
router.get('/:id/analytics', authMiddleware, async (req, res) => {
  try {
    const property = await Property.findOne({ id: req.params.id });
    if (!property) return res.status(404).json({ message: 'Property not found' });
    
    if (property.userId !== req.user.id) {
      return res.status(401).json({ message: 'User not authorized' });
    }

    // Mock analytics data (in real app, this would come from analytics service)
    const analytics = {
      viewsLast7Days: property.viewsLast7Days || Math.floor(Math.random() * 100) + 10,
      viewsLast30Days: property.viewsLast30Days || Math.floor(Math.random() * 500) + 50,
      leadsLast7Days: property.leadsLast7Days || Math.floor(Math.random() * 20) + 2,
      leadsLast30Days: property.leadsLast30Days || Math.floor(Math.random() * 100) + 10,
      shortlistsCount: property.shortlistsCount || Math.floor(Math.random() * 50) + 5,
      clickThroughRate: Math.random() * 0.1 + 0.05, // 5-15%
      averageTimeOnPage: Math.random() * 180 + 60, // 60-240 seconds
      topReferrers: [
        'Google Search',
        'Direct Traffic',
        'Facebook',
        '99acres.com',
        'MagicBricks'
      ],
      dailyViews: Array.from({ length: 30 }, (_, i) => ({
        date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        views: Math.floor(Math.random() * 20) + 1
      }))
    };

    res.json(analytics);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE A PROPERTY with History Tracking
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const property = await Property.findOne({ id: req.params.id });
    if (!property) return res.status(404).json({ message: 'Property not found' });
    
    if (property.userId !== req.user.id) {
      return res.status(401).json({ message: 'User not authorized' });
    }

    // Store property data for history before deletion
    const propertyData = property.toObject();

    await Property.findOneAndDelete({ id: req.params.id });
    
    // Track property deletion in history
    await trackPropertyHistory(
      req.params.id,
      req.user.id,
      'deleted',
      propertyData,
      null,
      req,
      { changeReason: 'Property deleted by user' }
    );
    
    res.json({ message: 'Property deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET PROPERTY HISTORY
router.get('/:id/history', authMiddleware, async (req, res) => {
  try {
    const property = await Property.findOne({ id: req.params.id });
    if (!property) return res.status(404).json({ message: 'Property not found' });
    
    if (property.userId !== req.user.id) {
      return res.status(401).json({ message: 'User not authorized' });
    }

    const history = await PropertyHistory.find({ propertyId: req.params.id })
      .sort({ timestamp: -1 })
      .limit(50); // Limit to last 50 changes

    res.json(history);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;