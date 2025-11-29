const express = require('express');
const Property = require('../models/Property');
const PropertyHistory = require('../models/PropertyHistory');
const authMiddleware = require('../middleware/authMiddleware');
const { uploadPropertyMedia } = require('../middleware/upload');
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
    // Note: If status is 'all' or not provided, we don't add a status filter at all
    // This allows all statuses including active, draft, paused, etc.

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

// POST - Create a new property
router.post('/', authMiddleware, async (req, res) => {
  try {
    // Get user ID from token
    const userId = req.user.id || req.user._id;
    
    console.log(`Creating property for user: ${userId}`);
    
    // Generate a unique property ID
    const lastProperty = await Property.findOne().sort({ id: -1 });
    const newPropertyId = lastProperty ? lastProperty.id + 1 : 1;
    
    // Create property data
    const propertyData = {
      id: newPropertyId,
      userId: userId,
      ...req.body
    };
    
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

module.exports = router;