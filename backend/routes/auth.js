// backend/routes/auth.js
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Property = require('../models/Property');
const authMiddleware = require('../middleware/authMiddleware');
require('dotenv').config();

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET;

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
    await user.save();

    const payload = { user: { id: user.id } };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });

    const userResponse = {
      _id: user._id, // Use MongoDB _id
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      savedProperties: user.savedProperties
    };
    res.status(201).json({ token, user: userResponse });

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

    const payload = { user: { id: user.id, _id: user._id } }; // Add _id
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });

    const userResponse = {
      _id: user._id, // Use MongoDB _id
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      savedProperties: user.savedProperties
    };
    res.json({ token, user: userResponse });

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