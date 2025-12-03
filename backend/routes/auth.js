// backend/routes/auth.js
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('../models/User');
const Property = require('../models/Property');
const authMiddleware = require('../middleware/authMiddleware');
const NotificationService = require('../services/notificationService');
require('dotenv').config();

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'your-refresh-secret'; // Add a refresh secret to your .env

// --- Helper function to generate tokens ---
const generateTokens = (user) => {
  const accessToken = jwt.sign(
    { user: { id: user.id, _id: user._id } },
    JWT_SECRET,
    { expiresIn: '15m' } // Short-lived access token
  );
  const refreshToken = jwt.sign(
    { user: { id: user.id, _id: user._id } },
    JWT_REFRESH_SECRET,
    { expiresIn: '7d' } // Long-lived refresh token
  );
  return { accessToken, refreshToken };
};


// REGISTER
router.post('/register', async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'User already exists' });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const userId = `user_${Date.now()}`;

    user = new User({
      id: userId,
      name,
      email,
      phone,
      password: hashedPassword,
      savedProperties: [] 
    });
    
    const { accessToken, refreshToken } = generateTokens(user);
    user.refreshToken = refreshToken;
    await user.save();

    // Create notification settings for the new user
    await user.getNotificationSettings();

    // Send welcome notification
    try {
      await NotificationService.sendWelcomeNotification(user.id);
    } catch (notifError) {
      console.error('Failed to send welcome notification:', notifError);
      // Don't fail registration if notification fails
    }

    const userResponse = {
      _id: user._id,
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      savedProperties: user.savedProperties
    };
    res.status(201).json({ accessToken, refreshToken, user: userResponse });

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// LOGIN
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'This email is not registered. Please sign up.' });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Incorrect password. Please try again.' });
    }

    const { accessToken, refreshToken } = generateTokens(user);
    user.refreshToken = refreshToken;
    await user.save();

    const userResponse = {
      _id: user._id,
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      savedProperties: user.savedProperties
    };
    res.json({ accessToken, refreshToken, user: userResponse });

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// --- NEW: REFRESH TOKEN ENDPOINT ---
router.post('/refresh', async (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) {
    return res.status(401).json({ message: 'Refresh token not provided.' });
  }

  try {
    const decoded = jwt.verify(refreshToken, JWT_REFRESH_SECRET);
    const user = await User.findOne({ id: decoded.user.id });

    if (!user || user.refreshToken !== refreshToken) {
      return res.status(403).json({ message: 'Invalid refresh token.' });
    }

    const { accessToken, refreshToken: newRefreshToken } = generateTokens(user);
    user.refreshToken = newRefreshToken;
    await user.save();

    res.json({ accessToken, refreshToken: newRefreshToken });

  } catch (err) {
    return res.status(403).json({ message: 'Invalid or expired refresh token.' });
  }
});

// --- NEW: VERIFY TOKEN ENDPOINT ---
router.get('/verify', authMiddleware, async (req, res) => {
  try {
    const user = await User.findOne({ id: req.user.id }).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ user });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// --- NEW: LOGOUT ENDPOINT ---
router.post('/logout', authMiddleware, async (req, res) => {
  try {
    const user = await User.findOne({ id: req.user.id });
    if (user) {
      user.refreshToken = null;
      await user.save();
    }
    res.status(200).json({ message: 'Logged out successfully.' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});


// UPDATE USER PROFILE
router.put('/profile', authMiddleware, async (req, res) => {
  try {
    const { name, phone } = req.body;
    const userId = req.user.id;

    const updatedUser = await User.findOneAndUpdate(
      { id: userId },
      { $set: { name: name, phone: phone } },
      { new: true } 
    ).select('-password'); 

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(updatedUser);

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// DELETE USER ACCOUNT
 // DELETE USER ACCOUNT
router.delete('/account', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    await Property.deleteMany({ userId: userId });
    const deletedUser = await User.findOneAndDelete({ id: userId });

    if (!deletedUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ message: 'Account deleted successfully' });

  } catch (err) { // <-- FIXED LINE (was a period, now a brace)
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;