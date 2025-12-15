 // backend/server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

// --- 1. Import Routes ---
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const propertyRoutes = require('./routes/properties');
const subscriptionRoutes = require('./routes/subscription');
const uploadRoutes = require('./routes/uploads');
const databaseUploadRoutes = require('./routes/databaseUploads');
const notificationRoutes = require('./routes/notifications');
const chatRoutes = require('./routes/chat');
const chartRoutes = require('./routes/charts');

// --- 2. Setup App ---
const app = express();
app.use(cors());
app.use(express.json());
// Serve uploaded images with proper CORS and caching
app.use('/uploads', express.static(path.join(__dirname, 'uploads'), {
  maxAge: '1d', // Cache images for 1 day
  etag: true,
  lastModified: true
}));

const PORT = process.env.PORT || 5000;

// --- 3. Connect to MongoDB with Enhanced Configuration ---
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      // Connection pool settings for better performance
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      bufferCommands: false, // Disable mongoose buffering
      
      // Additional options for MongoDB Atlas
      retryWrites: true,
      w: 'majority'
    });

    console.log(`MongoDB connected: ${conn.connection.host}/${conn.connection.name}`);
    
    // Connection event listeners
    mongoose.connection.on('error', (err) => {
      console.error('MongoDB connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.log('MongoDB disconnected');
    });

    mongoose.connection.on('reconnected', () => {
      console.log('MongoDB reconnected');
    });

    // Graceful shutdown
    process.on('SIGINT', async () => {
      await mongoose.connection.close();
      console.log('MongoDB connection closed due to app termination');
      process.exit(0);
    });

  } catch (err) {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  }
};

connectDB();

// --- 4. Use API Routes ---
// All auth routes will be prefixed with /api/auth
app.use('/api/auth', authRoutes);
// All user routes will be prefixed with /api/user
app.use('/api/user', userRoutes);
// All property routes will be prefixed with /api/properties
app.use('/api/properties', propertyRoutes);
// All subscription routes will be prefixed with /api/subscription
app.use('/api/subscription', subscriptionRoutes);
// Uploads (image processing)
app.use('/api/uploads', uploadRoutes);
// Database uploads (store files in database)
app.use('/api/uploads', databaseUploadRoutes);
// All notification routes will be prefixed with /api/notifications
app.use('/api/notifications', notificationRoutes);
// All chat routes will be prefixed with /api/chat
app.use('/api/chat', chatRoutes);
// All chart routes will be prefixed with /api/charts
app.use('/api/charts', chartRoutes);

// --- GLOBAL ERROR HANDLING MIDDLEWARE ---
// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
    path: req.originalUrl
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Global error handler:', err);
  
  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map(e => e.message);
    return res.status(400).json({
      success: false,
      message: 'Validation error',
      errors
    });
  }
  
  // Mongoose duplicate key error
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    return res.status(400).json({
      success: false,
      message: `${field} already exists`
    });
  }
  
  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      success: false,
      message: 'Invalid token'
    });
  }
  
  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      success: false,
      message: 'Token expired'
    });
  }
  
  // Default error
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// --- 5. Start Server ---
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Backend server is running on http://localhost:${PORT}`);
  console.log(`Backend server is accessible on network at http://192.168.0.2:${PORT}`);
});