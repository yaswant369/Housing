// backend/routes/notifications.js
const express = require('express');
const crypto = require('crypto');
const User = require('../models/User');
const Notification = require('../models/Notification');
const NotificationSettings = require('../models/NotificationSettings');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Generate unique notification ID
const generateNotificationId = () => `notif_${Date.now()}_${crypto.randomBytes(8).toString('hex')}`;

// GET /api/notifications - Get user's notifications
router.get('/', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const { 
      page = 1, 
      limit = 20, 
      category, 
      type, 
      isRead,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    // Build query
    const query = { 
      userId: userId,
      $or: [
        { expiresAt: { $gt: new Date() } },
        { expiresAt: { $exists: false } }
      ]
    };

    if (category) query.category = category;
    if (type) query.type = type;
    if (isRead !== undefined) query.isRead = isRead === 'true';

    // Execute query with pagination
    const skip = (page - 1) * limit;
    const notifications = await Notification.find(query)
      .sort({ [sortBy]: sortOrder === 'desc' ? -1 : 1 })
      .skip(skip)
      .limit(parseInt(limit));

    const totalNotifications = await Notification.countDocuments(query);
    const unreadCount = await Notification.getUnreadCount(userId);

    res.json({
      notifications,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalNotifications / limit),
        totalNotifications,
        hasMore: skip + notifications.length < totalNotifications
      },
      unreadCount
    });

  } catch (err) {
    console.error('Error fetching notifications:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/notifications/unread - Get unread notifications count
router.get('/unread', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const unreadCount = await Notification.getUnreadCount(userId);
    
    res.json({ unreadCount });

  } catch (err) {
    console.error('Error fetching unread count:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/notifications/settings - Get notification settings
router.get('/settings', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    
    const user = await User.findOne({ id: userId });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    const settings = await user.getNotificationSettings();
    res.json(settings);

  } catch (err) {
    console.error('Error fetching notification settings:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/notifications/preferences - Get notification preferences summary
router.get('/preferences', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    
    const user = await User.findOne({ id: userId });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    const settings = await user.getNotificationSettings();
    
    const preferences = {
      global: {
        enabled: settings.enabled,
        doNotDisturb: settings.doNotDisturb
      },
      categories: Object.keys(settings.categories || {}).reduce((acc, category) => {
        acc[category] = {
          enabled: settings.categories[category].enabled,
          frequency: settings.categories[category].frequency,
          channels: settings.categories[category].channels
        };
        return acc;
      }, {}),
      pushTokens: (user.getActivePushTokens ? user.getActivePushTokens() : []).map(token => ({
        platform: token.platform,
        deviceId: token.deviceId,
        lastUsed: token.lastUsed
      }))
    };

    res.json(preferences);

  } catch (err) {
    console.error('Error fetching notification preferences:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/notifications/stats - Get notification statistics
router.get('/stats', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    
    const totalNotifications = await Notification.countDocuments({ userId });
    const unreadCount = await Notification.getUnreadCount(userId);
    
    const categoryStats = await Notification.aggregate([
      { $match: { userId } },
      { $group: { _id: '$category', count: { $sum: 1 } } }
    ]);

    const typeStats = await Notification.aggregate([
      { $match: { userId } },
      { $group: { _id: '$type', count: { $sum: 1 } } }
    ]);

    const recentActivity = await Notification.find({ userId })
      .sort({ createdAt: -1 })
      .limit(5)
      .select('type category createdAt isRead');

    res.json({
      total: totalNotifications,
      unread: unreadCount,
      read: totalNotifications - unreadCount,
      categories: categoryStats.reduce((acc, stat) => {
        acc[stat._id] = stat.count;
        return acc;
      }, {}),
      types: typeStats.reduce((acc, stat) => {
        acc[stat._id] = stat.count;
        return acc;
      }, {}),
      recentActivity
    });

  } catch (err) {
    console.error('Error fetching notification stats:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/notifications/:id - Get specific notification
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const notification = await Notification.findOne({ 
      id: id, 
      userId: userId 
    });

    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    // Mark as opened for analytics
    await notification.markAsOpened();

    res.json(notification);

  } catch (err) {
    console.error('Error fetching notification:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// PUT /api/notifications/:id/read - Mark notification as read
router.put('/:id/read', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const notification = await Notification.findOne({ 
      id: id, 
      userId: userId 
    });

    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    await notification.markAsRead();
    
    // Update user's notification count
    const user = await User.findOne({ id: userId });
    await user.updateNotificationCount();

    res.json({ message: 'Notification marked as read' });

  } catch (err) {
    console.error('Error marking notification as read:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// PUT /api/notifications/:id/unread - Mark notification as unread
router.put('/:id/unread', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const notification = await Notification.findOne({ 
      id: id, 
      userId: userId 
    });

    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    await notification.markAsUnread();
    
    // Update user's notification count
    const user = await User.findOne({ id: userId });
    await user.updateNotificationCount();

    res.json({ message: 'Notification marked as unread' });

  } catch (err) {
    console.error('Error marking notification as unread:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// PUT /api/notifications/mark-all-read - Mark all notifications as read
router.put('/mark-all-read', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await User.findOne({ id: userId });
    await user.markAllNotificationsAsRead();

    res.json({ message: 'All notifications marked as read' });

  } catch (err) {
    console.error('Error marking all notifications as read:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// DELETE /api/notifications/:id - Delete specific notification
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const notification = await Notification.findOneAndDelete({ 
      id: id, 
      userId: userId 
    });

    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    // Update user's notification count
    const user = await User.findOne({ id: userId });
    await user.updateNotificationCount();

    res.json({ message: 'Notification deleted successfully' });

  } catch (err) {
    console.error('Error deleting notification:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// DELETE /api/notifications - Delete multiple notifications
router.delete('/', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const { notificationIds, deleteAll = false } = req.body;

    let deleteQuery = { userId: userId };

    if (!deleteAll && notificationIds && Array.isArray(notificationIds)) {
      deleteQuery.id = { $in: notificationIds };
    }

    const result = await Notification.deleteMany(deleteQuery);
    
    // Update user's notification count
    const user = await User.findOne({ id: userId });
    await user.updateNotificationCount();

    res.json({ 
      message: 'Notifications deleted successfully',
      deletedCount: result.deletedCount
    });

  } catch (err) {
    console.error('Error deleting notifications:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// PUT /api/notifications/settings - Update notification settings
router.put('/settings', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const settingsData = req.body;

    const user = await User.findOne({ id: userId });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    const settings = await user.getNotificationSettings();

    // Update settings with provided data
    Object.keys(settingsData).forEach(key => {
      if (settings[key] !== undefined) {
        settings[key] = settingsData[key];
      }
    });

    await settings.save();

    res.json({ 
      message: 'Notification settings updated successfully',
      settings 
    });

  } catch (err) {
    console.error('Error updating notification settings:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/notifications/push-token - Add push notification token
router.post('/push-token', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const { token, platform, deviceId } = req.body;

    if (!token || !platform) {
      return res.status(400).json({ message: 'Token and platform are required' });
    }

    const user = await User.findOne({ id: userId });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    await user.addPushToken(token, platform, deviceId);

    res.json({ message: 'Push token added successfully' });

  } catch (err) {
    console.error('Error adding push token:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// DELETE /api/notifications/push-token/:token - Remove push notification token
router.delete('/push-token/:token', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const { token } = req.params;

    const user = await User.findOne({ id: userId });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    await user.removePushToken(token);

    res.json({ message: 'Push token removed successfully' });

  } catch (err) {
    console.error('Error removing push token:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/notifications/do-not-disturb - Enable/disable do not disturb
router.post('/do-not-disturb', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const { enabled, duration } = req.body;

    const user = await User.findOne({ id: userId });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    const settings = await user.getNotificationSettings();

    if (enabled) {
      await settings.enableDoNotDisturb(duration);
    } else {
      await settings.disableDoNotDisturb();
    }

    res.json({ 
      message: `Do not disturb ${enabled ? 'enabled' : 'disabled'} successfully`,
      doNotDisturb: settings.doNotDisturb
    });

  } catch (err) {
    console.error('Error updating do not disturb:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;