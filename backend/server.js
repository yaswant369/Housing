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

// --- 2. Setup App ---
const app = express();
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const PORT = process.env.PORT || 5000;

// --- 3. Connect to MongoDB ---
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log('MongoDB connected successfully.'))
.catch(err => console.log('MongoDB connection error:', err));

// --- 4. Use API Routes ---
// All auth routes will be prefixed with /api/auth
app.use('/api/auth', authRoutes);
// All user routes will be prefixed with /api/user
app.use('/api/user', userRoutes);
// All property routes will be prefixed with /api/properties
app.use('/api/properties', propertyRoutes);
// All subscription routes will be prefixed with /api/subscription
app.use('/api/subscription', subscriptionRoutes);

// --- 5. Start Server ---
app.listen(PORT, () => {
  console.log(`Backend server is running on http://localhost:${PORT}`);
});