const express = require('express');
const Property = require('../models/Property');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// GET property analytics for charts
router.get('/property-analytics', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id || req.user._id;

    // Get all properties for the user
    const properties = await Property.find({ userId: userId });

    if (!properties || properties.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No properties found for this user'
      });
    }

    // Generate mock chart data based on properties
    const labels = Array.from({ length: 30 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (29 - i));
      return date.toISOString().split('T')[0];
    });

    const chartData = {
      labels,
      datasets: {
        views: {
          label: 'Property Views',
          data: labels.map(() => Math.floor(Math.random() * 50) + 10),
          color: '#3b82f6',
          trend: Math.random() > 0.5 ? 'up' : 'down'
        },
        leads: {
          label: 'Leads Generated',
          data: labels.map(() => Math.floor(Math.random() * 10) + 2),
          color: '#10b981',
          trend: Math.random() > 0.5 ? 'up' : 'down'
        },
        shortlists: {
          label: 'Shortlists',
          data: labels.map(() => Math.floor(Math.random() * 5) + 1),
          color: '#8b5cf6',
          trend: Math.random() > 0.5 ? 'up' : 'down'
        },
        conversion_rate: {
          label: 'Conversion Rate (%)',
          data: labels.map(() => (Math.random() * 15 + 5).toFixed(1)),
          color: '#f59e0b',
          trend: Math.random() > 0.5 ? 'up' : 'down'
        }
      },
      summary: {
        total_views: Math.floor(Math.random() * 1000) + 500,
        total_leads: Math.floor(Math.random() * 200) + 100,
        total_shortlists: Math.floor(Math.random() * 50) + 20,
        avg_conversion_rate: (Math.random() * 10 + 5).toFixed(1) + '%',
        performance_score: Math.floor(Math.random() * 40) + 60
      }
    };

    res.json({
      success: true,
      data: chartData
    });

  } catch (err) {
    console.error('Error fetching property analytics:', err);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch property analytics',
      error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
    });
  }
});

module.exports = router;