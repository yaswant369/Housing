// backend/routes/user.js
const express = require('express');
const User = require('../models/User');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// SAVE PROPERTY
router.post('/save', authMiddleware, async (req, res) => {
  try {
    const { propertyId } = req.body;
    const user = await User.findOne({ id: req.user.id });
    if (!user) return res.status(404).json({ message: "User not found" });

    if (!user.savedProperties.includes(propertyId)) {
      user.savedProperties.push(propertyId);
      await user.save();
    }
    res.json({ savedProperties: user.savedProperties });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// UNSAVE PROPERTY
router.delete('/unsave/:propertyId', authMiddleware, async (req, res) => {
  try {
    const { propertyId } = req.params;
    const user = await User.findOne({ id: req.user.id });
    if (!user) return res.status(404).json({ message: "User not found" });

    user.savedProperties = user.savedProperties.filter(id => id.toString() !== propertyId);
    await user.save();
    
    res.json({ savedProperties: user.savedProperties });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;