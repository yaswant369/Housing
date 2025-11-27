// backend/routes/properties.js
const express = require('express');
const Property = require('../models/Property');
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

// Run status updates every hour
setInterval(updatePropertyStatuses, 60 * 60 * 1000);

// Call initialization on server start
initializeAnalyticsData();

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

// --- THIS IS THE FIX for POSTING ---
// Create new property
router.post('/', authMiddleware, uploadPropertyMedia, async (req, res) => { 
  try {
    const lastProperty = await Property.findOne().sort({ id: -1 });
    const newId = lastProperty ? lastProperty.id + 1 : 1;
    
    const structuredData = parseStructuredData(req.body);
    const propertyData = { ...req.body, ...structuredData, id: newId, userId: req.user.id };

    // Handle new images (process and store medium versions)
    if (req.files.images) {
      const processed = await processImagesAndReturnPaths(req.files.images, newId);
      propertyData.images = processed; // e.g. 'uploads/properties/{id}/{filename}_medium.webp'
    }

    // Handle new video
    if (req.files.video) {
      propertyData.video = req.files.video[0].path;
    }

    const property = new Property(propertyData);
    const newProperty = await property.save();
    res.status(201).json(newProperty);
  } catch (err) {
    console.error(err.message); // Log the full error
    res.status(400).json({ message: err.message });
  }
});

// --- THIS IS THE FIX for UPDATING ---
// Update a property
router.put('/:id', authMiddleware, uploadPropertyMedia, async (req, res) => { 
  try {
    const property = await Property.findOne({ id: req.params.id });
    if (!property) return res.status(404).json({ message: 'Property not found' });
    if (property.userId !== req.user.id) {
      return res.status(401).json({ message: 'User not authorized' });
    }

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

// UPDATE PROPERTY STATUS
router.patch('/:id/status', authMiddleware, async (req, res) => {
  try {
    const { status } = req.body;
    
    if (!status) {
      return res.status(400).json({ message: 'Status is required' });
    }

    const validStatuses = ['draft', 'pending', 'active', 'paused', 'expired', 'sold'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const property = await Property.findOne({ id: req.params.id });
    if (!property) return res.status(404).json({ message: 'Property not found' });
    
    if (property.userId !== req.user.id) {
      return res.status(401).json({ message: 'User not authorized' });
    }

    const updatedProperty = await Property.findOneAndUpdate(
      { id: req.params.id },
      { 
        status,
        updatedAt: new Date()
      },
      { new: true }
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

// DELETE A PROPERTY
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const property = await Property.findOne({ id: req.params.id });
    if (!property) return res.status(404).json({ message: 'Property not found' });
    
    if (property.userId !== req.user.id) {
      return res.status(401).json({ message: 'User not authorized' });
    }

    await Property.findOneAndDelete({ id: req.params.id });
    res.json({ message: 'Property deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;