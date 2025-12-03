 const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique:true },
  phone: { type: String, required: true },
  password: { type: String, required: true },
  savedProperties: [{ type: Number, ref: 'Property' }],
  refreshToken: { type: String },
  
  // Premium Subscription
  isPremium: { type: Boolean, default: false },
  currentSubscription: { type: mongoose.Schema.Types.ObjectId, ref: 'Subscription' },
  subscriptionHistory: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Subscription' }],
  
  // Contact Access History (for security and tracking)
  contactAccessLog: [{
    propertyId: Number,
    accessedAt: Date,
    subscriptionId: String
  }],
  
  // Notification System Integration
  notificationSettings: { type: mongoose.Schema.Types.ObjectId, ref: 'NotificationSettings' },
  lastNotificationCheck: { type: Date, default: Date.now },
  notificationCount: { 
    unread: { type: Number, default: 0 },
    total: { type: Number, default: 0 }
  },
  
  // Push notification tokens for mobile/web
  pushTokens: [{
    token: { type: String, required: true },
    platform: { 
      type: String, 
      enum: ['android', 'ios', 'web'], 
      required: true 
    },
    deviceId: { type: String },
    isActive: { type: Boolean, default: true },
    lastUsed: { type: Date, default: Date.now }
  }],
  
  // Notification preferences (for backward compatibility - deprecated in favor of NotificationSettings)
  legacyNotificationPrefs: {
    emailNotifications: { type: Boolean, default: true },
    pushNotifications: { type: Boolean, default: true },
    smsNotifications: { type: Boolean, default: false },
    marketingEmails: { type: Boolean, default: false }
  },
  
}, { timestamps: true });

// Method to check if user has active premium
UserSchema.methods.hasActivePremium = async function() {
  if (!this.isPremium || !this.currentSubscription) return false;
  
  const Subscription = require('./Subscription');
  const subscription = await Subscription.findById(this.currentSubscription);
  
  return subscription && subscription.isValid();
};

// Method to get or create notification settings
UserSchema.methods.getNotificationSettings = async function() {
  const NotificationSettings = require('./NotificationSettings');
  
  if (this.notificationSettings) {
    return await NotificationSettings.findById(this.notificationSettings);
  }
  
  // Create default settings if none exist
  const defaultSettings = await NotificationSettings.createDefaultSettings(this.id);
  await defaultSettings.save();
  
  this.notificationSettings = defaultSettings._id;
  await this.save();
  
  return defaultSettings;
};

// Method to add push token
UserSchema.methods.addPushToken = async function(token, platform, deviceId = null) {
  // Check if token already exists
  const existingToken = this.pushTokens.find(t => t.token === token);
  
  if (existingToken) {
    // Update existing token
    existingToken.platform = platform;
    existingToken.deviceId = deviceId;
    existingToken.lastUsed = new Date();
    existingToken.isActive = true;
  } else {
    // Add new token
    this.pushTokens.push({
      token: token,
      platform: platform,
      deviceId: deviceId,
      isActive: true,
      lastUsed: new Date()
    });
  }
  
  await this.save();
  return this;
};

// Method to remove push token
UserSchema.methods.removePushToken = async function(token) {
  this.pushTokens = this.pushTokens.filter(t => t.token !== token);
  await this.save();
  return this;
};

// Method to get active push tokens
UserSchema.methods.getActivePushTokens = function() {
  return this.pushTokens.filter(t => t.isActive);
};

// Method to update notification count
UserSchema.methods.updateNotificationCount = async function() {
  const Notification = require('./Notification');
  
  const unreadCount = await Notification.getUnreadCount(this.id);
  const totalCount = await Notification.countDocuments({ userId: this.id });
  
  this.notificationCount = {
    unread: unreadCount,
    total: totalCount
  };
  
  await this.save();
  return this.notificationCount;
};

// Method to mark all notifications as read
UserSchema.methods.markAllNotificationsAsRead = async function() {
  const Notification = require('./Notification');
  
  await Notification.updateMany(
    { userId: this.id, isRead: false },
    { isRead: true, readAt: new Date(), status: 'read' }
  );
  
  await this.updateNotificationCount();
  return this;
};

module.exports = mongoose.model('User', UserSchema);