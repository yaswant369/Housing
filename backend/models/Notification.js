const mongoose = require('mongoose');

const NotificationSchema = new mongoose.Schema({
  // Core identification
  id: { type: String, required: true, unique: true, index: true },
  userId: { type: String, required: true, ref: 'User', index: true },
  
  // Notification content
  title: { type: String, required: true },
  message: { type: String, required: true },
  type: { 
    type: String, 
    required: true,
    enum: [
      'property_alert',
      'price_change',
      'status_update',
      'new_match',
      'saved_property_update',
      'premium_feature',
      'welcome',
      'system_update',
      'security_alert',
      'chat_message',
      'booking_confirmation',
      'payment_update',
      'new_inquiry',
      'lead_generated',
      'property_expired',
      'search_alert',
      'general'
    ]
  },
  
  // Priority and categorization
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  category: {
    type: String,
    enum: ['property', 'account', 'system', 'premium', 'marketing', 'security'],
    default: 'general'
  },
  
  // Status tracking
  status: {
    type: String,
    enum: ['pending', 'sent', 'delivered', 'read', 'failed'],
    default: 'pending',
    index: true
  },
  isRead: { type: Boolean, default: false, index: true },
  readAt: { type: Date },
  
  // Delivery channels
  channels: {
    inApp: { type: Boolean, default: true },
    email: { type: Boolean, default: false },
    push: { type: Boolean, default: false },
    sms: { type: Boolean, default: false }
  },
  deliveryStatus: {
    inApp: { type: Boolean, default: false },
    email: { type: Boolean, default: false },
    push: { type: Boolean, default: false },
    sms: { type: Boolean, default: false }
  },
  
  // Related entities
  relatedEntity: {
    type: {
      type: String,
      enum: ['property', 'user', 'subscription', 'payment', 'chat', 'booking', null],
      default: null
    },
    id: { type: mongoose.Schema.Types.Mixed, default: null },
    reference: { type: mongoose.Schema.Types.ObjectId, refPath: 'relatedEntity.type', default: null }
  },
  
  // Rich content
  actionUrl: { type: String },
  imageUrl: { type: String },
  metadata: { type: mongoose.Schema.Types.Mixed, default: {} },
  
  // Scheduling and batching
  scheduledAt: { type: Date },
  expiresAt: { type: Date, index: true },
  batchId: { type: String, index: true },
  
  // Analytics and tracking
  tracking: {
    opened: { type: Boolean, default: false },
    clicked: { type: Boolean, default: false },
    actionTaken: { type: Boolean, default: false },
    openedAt: { type: Date },
    clickedAt: { type: Date }
  },
  
  // User preferences check
  userPreferences: {
    category: { type: String },
    frequency: { type: String, enum: ['immediate', 'daily', 'weekly', 'never'], default: 'immediate' }
  },

}, { 
  timestamps: true,
  // Add indexes for better query performance
});

// Compound indexes for common queries
NotificationSchema.index({ userId: 1, status: 1 });
NotificationSchema.index({ userId: 1, isRead: 1, createdAt: -1 });
NotificationSchema.index({ userId: 1, category: 1, createdAt: -1 });
NotificationSchema.index({ type: 1, createdAt: -1 });
NotificationSchema.index({ batchId: 1, createdAt: -1 });
NotificationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 }); // TTL index for automatic cleanup

// Text index for search functionality
NotificationSchema.index({ 
  title: 'text', 
  message: 'text'
});

// Virtual for getting read status
NotificationSchema.virtual('isReadStatus').get(function() {
  return this.isRead;
});

// Method to mark as read
NotificationSchema.methods.markAsRead = function() {
  this.isRead = true;
  this.readAt = new Date();
  this.status = 'read';
  return this.save();
};

// Method to mark as unread
NotificationSchema.methods.markAsUnread = function() {
  this.isRead = false;
  this.readAt = null;
  this.status = 'sent';
  return this.save();
};

// Method to mark as opened (for analytics)
NotificationSchema.methods.markAsOpened = function() {
  this.tracking.opened = true;
  this.tracking.openedAt = new Date();
  if (!this.isRead) {
    this.markAsRead();
  }
  return this.save();
};

// Method to check if notification is expired
NotificationSchema.methods.isExpired = function() {
  return this.expiresAt && new Date() > this.expiresAt;
};

// Method to get delivery completion percentage
NotificationSchema.methods.getDeliveryCompletion = function() {
  const channels = Object.keys(this.channels).filter(ch => this.channels[ch]);
  const delivered = Object.keys(this.deliveryStatus).filter(ch => this.deliveryStatus[ch]);
  return channels.length > 0 ? Math.round((delivered.length / channels.length) * 100) : 0;
};

// Static method to get unread count for user
NotificationSchema.statics.getUnreadCount = function(userId) {
  return this.countDocuments({ 
    userId: userId, 
    isRead: false,
    $or: [
      { expiresAt: { $gt: new Date() } },
      { expiresAt: { $exists: false } }
    ]
  });
};

// Static method to get recent notifications for user
NotificationSchema.statics.getRecentNotifications = function(userId, limit = 20) {
  return this.find({ 
    userId: userId,
    $or: [
      { expiresAt: { $gt: new Date() } },
      { expiresAt: { $exists: false } }
    ]
  })
  .sort({ createdAt: -1 })
  .limit(limit);
};

// Pre-save middleware to set default values
NotificationSchema.pre('save', function(next) {
  // Set readAt when marking as read
  if (this.isRead && !this.readAt) {
    this.readAt = new Date();
    this.status = 'read';
  }
  
  // Set default expiration to 30 days from now if not set
  if (!this.expiresAt) {
    this.expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days
  }
  
  next();
});

// Export the model
module.exports = mongoose.model('Notification', NotificationSchema);