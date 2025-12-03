const express = require('express');
const Property = require('../models/Property');
const PropertyHistory = require('../models/PropertyHistory');
const User = require('../models/User');
const authMiddleware = require('../middleware/authMiddleware');
const { uploadPropertyMedia } = require('../middleware/upload');
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
router.post('/', authMiddleware, uploadPropertyMedia, async (req, res) => {
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
router.put('/:id', authMiddleware, uploadPropertyMedia, async (req, res) => {
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
    
    // Update property data
    Object.keys(req.body).forEach(key => {
      if (req.body[key] !== undefined) {
        property[key] = req.body[key];
      }
    });
    
    // Handle price formatting
    if (req.body.price && !req.body.priceValue) {
      const priceStr = req.body.price.toString();
      const numericValue = parseFloat(priceStr.replace(/[^0-9.-]+/g, ''));
      if (!isNaN(numericValue)) {
        property.priceValue = numericValue * (priceStr.includes('Cr') ? 10000000 : (priceStr.includes('L') ? 100000 : 1));
      }
    }
    
    await property.save();
    
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

    // Only show active properties to public (exclude paused, draft, expired, sold)
    query.status = { $in: ['active', 'For Sale', 'For Rent'] };

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
      if (req.query.propertyType && req.query.propertyType !== 'any') {
        query.propertyType = req.query.propertyType;
      }
      if (req.query.propertyKind && req.query.propertyKind !== 'any') {
        query.propertyKind = req.query.propertyKind;
      }

      // Location radius filter (requires lat/lng and radius in km)
      if (req.query.latitude && req.query.longitude && req.query.radiusKm) {
        const lat = parseFloat(req.query.latitude);
        const lng = parseFloat(req.query.longitude);
        const radius = parseFloat(req.query.radiusKm) / 6371; // Radius in radians (Earth radius = 6371km)
        query.latitude = { $exists: true };
        query.longitude = { $exists: true };
        query.$expr = {
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
        };
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
      
      return propertyObj;
    });
    
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

module.exports = router;