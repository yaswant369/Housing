// backend/routes/properties.js
const express = require('express');
const Property = require('../models/Property');
const authMiddleware = require('../middleware/authMiddleware');
const { uploadPropertyMedia } = require('../middleware/upload'); // Import new upload middleware
const { optionalPremiumCheck } = require('../middleware/premiumMiddleware');

const router = express.Router();

// GET ALL PROPERTIES (with pagination)
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 9;
    const skip = (page - 1) * limit;

    const properties = await Property.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
      
    const totalCount = await Property.countDocuments();
    
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
    
    const propertyData = { ...req.body, id: newId, userId: req.user.id };

    // Handle new images
    if (req.files.images) {
      propertyData.images = req.files.images.map(file => file.path);
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

    const updateData = { ...req.body };
    
    // Get kept images/video paths from frontend
    const keptImages = req.body.keptImages ? JSON.parse(req.body.keptImages) : [];
    const keptVideo = req.body.keptVideo ? req.body.keptVideo : null;

    // Get new image paths
    const newImages = req.files.images ? req.files.images.map(file => file.path) : [];
    
    // Combine kept + new images
    updateData.images = [...keptImages, ...newImages];
    
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