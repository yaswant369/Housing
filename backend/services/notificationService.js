// backend/services/notificationService.js
const crypto = require('crypto');
const User = require('../models/User');
const Notification = require('../models/Notification');
const NotificationSettings = require('../models/NotificationSettings');

// Generate unique notification ID
const generateNotificationId = () => 
  `notif_${Date.now()}_${crypto.randomBytes(8).toString('hex')}`;

// Notification templates for different types
const notificationTemplates = {
  welcome: {
    title: 'Welcome to our Housing Platform!',
    message: 'Get started by exploring properties, saving favorites, and setting up your profile.',
    category: 'account',
    priority: 'medium',
    actionUrl: '/profile'
  },
  
  property_alert: {
    title: 'New Property Alert',
    message: 'A new property matching your criteria has been added.',
    category: 'property',
    priority: 'high'
  },
  
  price_change: {
    title: 'Price Update Alert',
    message: 'The price of one of your saved properties has been updated.',
    category: 'property',
    priority: 'high'
  },
  
  saved_property_update: {
    title: 'Property Update',
    message: 'One of your saved properties has been updated.',
    category: 'property',
    priority: 'medium'
  },
  
  new_match: {
    title: 'Perfect Match Found!',
    message: 'We found a property that perfectly matches your preferences.',
    category: 'property',
    priority: 'high'
  },
  
  premium_feature: {
    title: 'Premium Feature Unlocked',
    message: 'Your premium subscription has been activated! Enjoy exclusive features.',
    category: 'premium',
    priority: 'high'
  },
  
  property_expired: {
    title: 'Property Listing Expired',
    message: 'One of your property listings has expired. Consider renewing to keep it active.',
    category: 'account',
    priority: 'medium'
  },
  
  system_update: {
    title: 'System Update',
    message: 'We\'ve updated our platform with new features and improvements.',
    category: 'system',
    priority: 'low'
  },
  
  security_alert: {
    title: 'Security Alert',
    message: 'Important security information about your account.',
    category: 'security',
    priority: 'urgent'
  },
  
  new_inquiry: {
    title: 'New Property Inquiry',
    message: 'Someone is interested in your property listing.',
    category: 'property',
    priority: 'high'
  },
  
  booking_confirmation: {
    title: 'Booking Confirmed',
    message: 'Your property booking has been confirmed.',
    category: 'property',
    priority: 'high'
  }
};

class NotificationService {
  /**
   * Create and send a notification
   */
  static async createNotification({
    userId,
    type,
    title = null,
    message = null,
    category = null,
    priority = null,
    channels = null,
    relatedEntity = null,
    actionUrl = null,
    imageUrl = null,
    metadata = {},
    scheduledAt = null,
    expiresAt = null
  }) {
    try {
      // Get user and their notification settings
      const user = await User.findOne({ id: userId });
      if (!user) {
        throw new Error('User not found');
      }

      const settings = await user.getNotificationSettings();
      
      // Use template if specific values not provided
      const template = notificationTemplates[type] || {};
      const finalTitle = title || template.title || 'Notification';
      const finalMessage = message || template.message || 'You have a new notification.';
      const finalCategory = category || template.category || 'general';
      const finalPriority = priority || template.priority || 'medium';
      const finalActionUrl = actionUrl || template.actionUrl || null;
      
      // Check if user can receive this notification
      if (!settings.canReceiveNotification(type, finalCategory)) {
        console.log(`Notification blocked for user ${userId} due to preferences`);
        return null;
      }

      // Determine delivery channels based on user preferences
      const preferredChannels = settings.getPreferredChannels(type, finalCategory);
      const finalChannels = channels || {
        inApp: preferredChannels.inApp,
        email: preferredChannels.email,
        push: preferredChannels.pushPush,
        sms: preferredChannels.sms
      };

      // Check if any channels are enabled
      const hasActiveChannels = Object.values(finalChannels).some(channel => channel);
      if (!hasActiveChannels) {
        console.log(`No active channels for user ${userId}`);
        return null;
      }

      // Check for rate limiting and deduplication
      const shouldSend = await this.checkRateLimiting(userId, type);
      if (!shouldSend) {
        console.log(`Rate limited notification for user ${userId}, type: ${type}`);
        return null;
      }

      // Create notification
      const notificationId = generateNotificationId();
      const notification = new Notification({
        id: notificationId,
        userId,
        title: finalTitle,
        message: finalMessage,
        type,
        category: finalCategory,
        priority: finalPriority,
        channels: finalChannels,
        deliveryStatus: {
          inApp: false,
          email: false,
          push: false,
          sms: false
        },
        relatedEntity,
        actionUrl: finalActionUrl,
        imageUrl,
        metadata,
        scheduledAt,
        expiresAt: expiresAt || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days default
        userPreferences: {
          category: finalCategory,
          frequency: settings.getNotificationFrequency(type, finalCategory)
        }
      });

      await notification.save();
      
      // Update user notification count
      await user.updateNotificationCount();
      
      // Send notification through enabled channels
      await this.sendNotification(notification, user, settings);
      
      return notification;
    } catch (error) {
      console.error('Error creating notification:', error);
      throw error;
    }
  }

  /**
   * Send notification through enabled channels
   */
  static async sendNotification(notification, user, settings) {
    const promises = [];

    // In-app notification (always sent, it's just stored in DB)
    if (notification.channels.inApp) {
      promises.push(this.sendInApp(notification, user));
    }

    // Email notification
    if (notification.channels.email) {
      promises.push(this.sendEmail(notification, user));
    }

    // Push notification
    if (notification.channels.push) {
      promises.push(this.sendPush(notification, user));
    }

    // SMS notification
    if (notification.channels.sms) {
      promises.push(this.sendSMS(notification, user));
    }

    try {
      await Promise.allSettled(promises);
    } catch (error) {
      console.error('Error sending notification:', error);
    }
  }

  /**
   * Send in-app notification (store in database)
   */
  static async sendInApp(notification, user) {
    try {
      notification.deliveryStatus.inApp = true;
      notification.status = 'sent';
      await notification.save();
      console.log(`In-app notification sent to user ${user.id}`);
    } catch (error) {
      console.error('Error sending in-app notification:', error);
      notification.deliveryStatus.inApp = false;
      await notification.save();
    }
  }

  /**
   * Send email notification
   */
  static async sendEmail(notification, user) {
    try {
      // TODO: Integrate with email service (SendGrid, Mailgun, etc.)
      console.log(`Email notification sent to ${user.email}: ${notification.title}`);
      
      // For now, just mark as sent
      notification.deliveryStatus.email = true;
      await notification.save();
    } catch (error) {
      console.error('Error sending email notification:', error);
      notification.deliveryStatus.email = false;
      notification.status = 'failed';
      await notification.save();
    }
  }

  /**
   * Send push notification
   */
  static async sendPush(notification, user) {
    try {
      const pushTokens = user.getActivePushTokens();
      
      if (pushTokens.length === 0) {
        console.log(`No push tokens found for user ${user.id}`);
        notification.deliveryStatus.push = false;
        await notification.save();
        return;
      }

      // TODO: Integrate with FCM/APNS
      console.log(`Push notification sent to user ${user.id}: ${notification.title}`);
      
      // For now, just mark as sent
      notification.deliveryStatus.push = true;
      await notification.save();
    } catch (error) {
      console.error('Error sending push notification:', error);
      notification.deliveryStatus.push = false;
      notification.status = 'failed';
      await notification.save();
    }
  }

  /**
   * Send SMS notification
   */
  static async sendSMS(notification, user) {
    try {
      // TODO: Integrate with SMS service (Twilio, etc.)
      console.log(`SMS notification sent to ${user.phone}: ${notification.title}`);
      
      // For now, just mark as sent
      notification.deliveryStatus.sms = true;
      await notification.save();
    } catch (error) {
      console.error('Error sending SMS notification:', error);
      notification.deliveryStatus.sms = false;
      notification.status = 'failed';
      await notification.save();
    }
  }

  /**
   * Check rate limiting and deduplication
   */
  static async checkRateLimiting(userId, type) {
    try {
      // Check for duplicate notifications in the last hour
      const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
      const duplicateExists = await Notification.findOne({
        userId,
        type,
        createdAt: { $gte: oneHourAgo },
        status: { $ne: 'failed' }
      });

      if (duplicateExists) {
        return false;
      }

      // Additional rate limiting logic can be added here
      return true;
    } catch (error) {
      console.error('Error checking rate limiting:', error);
      return true; // Allow on error
    }
  }

  /**
   * Create bulk notifications for multiple users
   */
  static async createBulkNotifications(notifications) {
    const results = [];
    
    for (const notifData of notifications) {
      try {
        const notification = await this.createNotification(notifData);
        results.push({ success: true, notification, userId: notifData.userId });
      } catch (error) {
        console.error(`Failed to create notification for user ${notifData.userId}:`, error);
        results.push({ success: false, error: error.message, userId: notifData.userId });
      }
    }
    
    return results;
  }

  /**
   * Send batch notifications (daily/weekly digests)
   */
  static async sendBatchNotifications() {
    try {
      // This would be called by a cron job
      console.log('Sending batch notifications...');
      
      // TODO: Implement batching logic
      // - Group notifications by frequency preference
      // - Send daily digests
      // - Send weekly summaries
      // - Remove individual notifications that were batched
      
    } catch (error) {
      console.error('Error sending batch notifications:', error);
    }
  }

  /**
   * Clean up expired notifications
   */
  static async cleanupExpiredNotifications() {
    try {
      const result = await Notification.deleteMany({
        expiresAt: { $lt: new Date() }
      });
      
      console.log(`Cleaned up ${result.deletedCount} expired notifications`);
      return result.deletedCount;
    } catch (error) {
      console.error('Error cleaning up expired notifications:', error);
      throw error;
    }
  }

  /**
   * Get notification statistics
   */
  static async getNotificationStats(userId) {
    try {
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

      return {
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
        }, {})
      };
    } catch (error) {
      console.error('Error getting notification stats:', error);
      throw error;
    }
  }

  /**
   * Process scheduled notifications
   */
  static async processScheduledNotifications() {
    try {
      const now = new Date();
      const scheduledNotifications = await Notification.find({
        scheduledAt: { $lte: now },
        status: 'pending'
      });

      for (const notification of scheduledNotifications) {
        const user = await User.findOne({ id: notification.userId });
        if (user) {
          const settings = await user.getNotificationSettings();
          await this.sendNotification(notification, user, settings);
        }
      }
      
      console.log(`Processed ${scheduledNotifications.length} scheduled notifications`);
    } catch (error) {
      console.error('Error processing scheduled notifications:', error);
    }
  }
}

// Helper methods for specific notification types

/**
 * Send welcome notification to new user
 */
NotificationService.sendWelcomeNotification = async (userId) => {
  return await NotificationService.createNotification({
    userId,
    type: 'welcome'
  });
};

/**
 * Send property price change notification
 */
NotificationService.sendPriceChangeNotification = async (userId, propertyId, oldPrice, newPrice) => {
  return await NotificationService.createNotification({
    userId,
    type: 'price_change',
    relatedEntity: {
      type: 'property',
      id: propertyId
    },
    metadata: {
      oldPrice,
      newPrice
    },
    actionUrl: `/property/${propertyId}`
  });
};

/**
 * Send property status update notification
 */
NotificationService.sendPropertyStatusUpdateNotification = async (userId, propertyId, oldStatus, newStatus) => {
  return await NotificationService.createNotification({
    userId,
    type: 'status_update',
    relatedEntity: {
      type: 'property',
      id: propertyId
    },
    metadata: {
      oldStatus,
      newStatus
    },
    actionUrl: `/property/${propertyId}`
  });
};

/**
 * Send premium feature notification
 */
NotificationService.sendPremiumFeatureNotification = async (userId, featureName) => {
  return await NotificationService.createNotification({
    userId,
    type: 'premium_feature',
    title: 'Premium Feature Unlocked',
    message: `Your premium subscription includes: ${featureName}`,
    actionUrl: '/premium'
  });
};

/**
 * Send property inquiry notification
 */
NotificationService.sendPropertyInquiryNotification = async (propertyOwnerId, propertyId, inquirerName) => {
  return await NotificationService.createNotification({
    userId: propertyOwnerId,
    type: 'new_inquiry',
    title: 'New Property Inquiry',
    message: `${inquirerName} is interested in your property`,
    relatedEntity: {
      type: 'property',
      id: propertyId
    },
    actionUrl: `/property/${propertyId}`
  });
};

module.exports = NotificationService;