const mongoose = require('mongoose');

const NotificationSettingsSchema = new mongoose.Schema({
  userId: { 
    type: String, 
    required: true, 
    unique: true, 
    ref: 'User', 
    index: true 
  },

  // Global notification preferences
  enabled: { type: Boolean, default: true },
  
  // Category-specific preferences
  categories: {
    property: {
      enabled: { type: Boolean, default: true },
      frequency: { 
        type: String, 
        enum: ['immediate', 'daily', 'weekly', 'never'], 
        default: 'immediate' 
      },
      channels: {
        inApp: { type: Boolean, default: true },
        email: { type: Boolean, default: true },
        push: { type: Boolean, default: true }
      }
    },
    
    account: {
      enabled: { type: Boolean, default: true },
      frequency: { 
        type: String, 
        enum: ['immediate', 'daily', 'weekly', 'never'], 
        default: 'immediate' 
      },
      channels: {
        inApp: { type: Boolean, default: true },
        email: { type: Boolean, default: true },
        push: { type: Boolean, default: false }
      }
    },
    
    system: {
      enabled: { type: Boolean, default: true },
      frequency: { 
        type: String, 
        enum: ['immediate', 'daily', 'weekly', 'never'], 
        default: 'immediate' 
      },
      channels: {
        inApp: { type: Boolean, default: true },
        email: { type: Boolean, default: false },
        push: { type: Boolean, default: false }
      }
    },
    
    premium: {
      enabled: { type: Boolean, default: true },
      frequency: { 
        type: String, 
        enum: ['immediate', 'daily', 'weekly', 'never'], 
        default: 'immediate' 
      },
      channels: {
        inApp: { type: Boolean, default: true },
        email: { type: Boolean, default: true },
        push: { type: Boolean, default: true }
      }
    },
    
    marketing: {
      enabled: { type: Boolean, default: false },
      frequency: { 
        type: String, 
        enum: ['immediate', 'daily', 'weekly', 'never'], 
        default: 'weekly' 
      },
      channels: {
        inApp: { type: Boolean, default: false },
        email: { type: Boolean, default: false },
        push: { type: Boolean, default: false }
      }
    },
    
    security: {
      enabled: { type: Boolean, default: true },
      frequency: { 
        type: String, 
        enum: ['immediate', 'daily', 'weekly', 'never'], 
        default: 'immediate' 
      },
      channels: {
        inApp: { type: Boolean, default: true },
        email: { type: Boolean, default: true },
        push: { type: Boolean, default: false }
      }
    }
  },

  // Type-specific preferences
  types: {
    property_alert: {
      enabled: { type: Boolean, default: true },
      frequency: { 
        type: String, 
        enum: ['immediate', 'daily', 'weekly', 'never'], 
        default: 'immediate' 
      },
      channels: {
        inApp: { type: Boolean, default: true },
        email: { type: Boolean, default: true },
        push: { type: Boolean, default: true }
      }
    },
    
    price_change: {
      enabled: { type: Boolean, default: true },
      frequency: { 
        type: String, 
        enum: ['immediate', 'daily', 'weekly', 'never'], 
        default: 'immediate' 
      },
      channels: {
        inApp: { type: Boolean, default: true },
        email: { type: Boolean, default: true },
        push: { type: Boolean, default: true }
      }
    },
    
    new_match: {
      enabled: { type: Boolean, default: true },
      frequency: { 
        type: String, 
        enum: ['immediate', 'daily', 'weekly', 'never'], 
        default: 'immediate' 
      },
      channels: {
        inApp: { type: Boolean, default: true },
        email: { type: Boolean, default: true },
        push: { type: Boolean, default: true }
      }
    },
    
    saved_property_update: {
      enabled: { type: Boolean, default: true },
      frequency: { 
        type: String, 
        enum: ['immediate', 'daily', 'weekly', 'never'], 
        default: 'immediate' 
      },
      channels: {
        inApp: { type: Boolean, default: true },
        email: { type: Boolean, default: true },
        push: { type: Boolean, default: true }
      }
    },
    
    welcome: {
      enabled: { type: Boolean, default: true },
      frequency: { 
        type: String, 
        enum: ['immediate', 'daily', 'weekly', 'never'], 
        default: 'immediate' 
      },
      channels: {
        inApp: { type: Boolean, default: true },
        email: { type: Boolean, default: true },
        push: { type: Boolean, default: false }
      }
    },
    
    system_update: {
      enabled: { type: Boolean, default: true },
      frequency: { 
        type: String, 
        enum: ['immediate', 'daily', 'weekly', 'never'], 
        default: 'immediate' 
      },
      channels: {
        inApp: { type: Boolean, default: true },
        email: { type: Boolean, default: false },
        push: { type: Boolean, default: false }
      }
    }
  },

  // Do not disturb settings
  doNotDisturb: {
    enabled: { type: Boolean, default: false },
    startTime: { type: String, default: '22:00' }, // 10 PM
    endTime: { type: String, default: '07:00' },   // 7 AM
    timezone: { type: String, default: 'Asia/Calcutta' }
  },

  // Batch preferences
  batch: {
    enabled: { type: Boolean, default: true },
    frequency: { 
      type: String, 
      enum: ['daily', 'weekly'], 
      default: 'daily' 
    },
    time: { type: String, default: '09:00' }, // 9 AM
    timezone: { type: String, default: 'Asia/Calcutta' }
  },

  // Frequency overrides
  frequencyOverride: {
    type: String,
    enum: ['immediate', 'daily', 'weekly', 'never'],
    default: null
  },

  // User's quiet hours preference (for push notifications)
  quietHours: {
    enabled: { type: Boolean, default: false },
    start: { type: String, default: '22:00' },
    end: { type: String, default: '07:00' }
  },

  // Mobile app notification settings
  mobile: {
    sound: { type: Boolean, default: true },
    vibration: { type: Boolean, default: true },
    badge: { type: Boolean, default: true },
    led: { type: Boolean, default: true }
  },

  // Email preferences
  email: {
    frequency: { 
      type: String, 
      enum: ['immediate', 'daily', 'weekly', 'never'], 
      default: 'immediate' 
    },
    batchEmails: { type: Boolean, default: true },
    promotional: { type: Boolean, default: false }
  }

}, { 
  timestamps: true,
  // Add indexes for better query performance
});

// Compound indexes
NotificationSettingsSchema.index({ userId: 1 });
NotificationSettingsSchema.index({ 'doNotDisturb.enabled': 1 });
NotificationSettingsSchema.index({ 'enabled': 1 });

// Method to check if user can receive notifications at current time
NotificationSettingsSchema.methods.canReceiveNotification = function(notificationType = null, category = null) {
  if (!this.enabled) return false;
  
  // Check do not disturb
  if (this.doNotDisturb.enabled) {
    const now = new Date();
    const currentTime = now.getHours() * 100 + now.getMinutes(); // HHMM format
    const startTime = parseInt(this.doNotDisturb.startTime.replace(':', ''));
    const endTime = parseInt(this.doNotDisturb.endTime.replace(':', ''));
    
    // Check if current time falls within DND period
    if (startTime > endTime) {
      // Crosses midnight (e.g., 22:00 to 07:00)
      if (currentTime >= startTime || currentTime <= endTime) {
        return false;
      }
    } else {
      // Same day (e.g., 09:00 to 17:00)
      if (currentTime >= startTime && currentTime <= endTime) {
        return false;
      }
    }
  }
  
  // Check notification type specific settings
  if (notificationType && this.types[notificationType]) {
    return this.types[notificationType].enabled;
  }
  
  // Check category specific settings
  if (category && this.categories[category]) {
    return this.categories[category].enabled;
  }
  
  return true;
};

// Method to get notification frequency
NotificationSettingsSchema.methods.getNotificationFrequency = function(notificationType = null, category = null) {
  // Check frequency override first
  if (this.frequencyOverride) {
    return this.frequencyOverride;
  }
  
  // Check notification type specific settings
  if (notificationType && this.types[notificationType]) {
    return this.types[notificationType].frequency;
  }
  
  // Check category specific settings
  if (category && this.categories[category]) {
    return this.categories[category].frequency;
  }
  
  return 'immediate';
};

// Method to get preferred channels for a notification
NotificationSettingsSchema.methods.getPreferredChannels = function(notificationType = null, category = null) {
  let channels = { inApp: true, email: false, push: false };
  
  // Check notification type specific settings
  if (notificationType && this.types[notificationType]) {
    channels = { ...channels, ...this.types[notificationType].channels };
  }
  
  // Check category specific settings
  if (category && this.categories[category]) {
    channels = { ...channels, ...this.categories[category].channels };
  }
  
  return channels;
};

// Method to disable all notifications temporarily
NotificationSettingsSchema.methods.enableDoNotDisturb = function(duration = 1) {
  this.doNotDisturb.enabled = true;
  
  // Set temporary end time if duration is provided (in hours)
  if (duration > 0) {
    const endTime = new Date(Date.now() + duration * 60 * 60 * 1000);
    const hours = endTime.getHours().toString().padStart(2, '0');
    const minutes = endTime.getMinutes().toString().padStart(2, '0');
    this.doNotDisturb.endTime = `${hours}:${minutes}`;
  }
  
  return this.save();
};

// Method to re-enable notifications
NotificationSettingsSchema.methods.disableDoNotDisturb = function() {
  this.doNotDisturb.enabled = false;
  return this.save();
};

// Static method to create default settings for a user
NotificationSettingsSchema.statics.createDefaultSettings = function(userId) {
  return new this({
    userId: userId,
    enabled: true,
    categories: {
      property: { enabled: true, frequency: 'immediate', channels: { inApp: true, email: true, push: true } },
      account: { enabled: true, frequency: 'immediate', channels: { inApp: true, email: true, push: false } },
      system: { enabled: true, frequency: 'immediate', channels: { inApp: true, email: false, push: false } },
      premium: { enabled: true, frequency: 'immediate', channels: { inApp: true, email: true, push: true } },
      marketing: { enabled: false, frequency: 'weekly', channels: { inApp: false, email: false, push: false } },
      security: { enabled: true, frequency: 'immediate', channels: { inApp: true, email: true, push: false } }
    },
    types: {
      property_alert: { enabled: true, frequency: 'immediate', channels: { inApp: true, email: true, push: true } },
      price_change: { enabled: true, frequency: 'immediate', channels: { inApp: true, email: true, push: true } },
      new_match: { enabled: true, frequency: 'immediate', channels: { inApp: true, email: true, push: true } },
      saved_property_update: { enabled: true, frequency: 'immediate', channels: { inApp: true, email: true, push: true } },
      welcome: { enabled: true, frequency: 'immediate', channels: { inApp: true, email: true, push: false } },
      system_update: { enabled: true, frequency: 'immediate', channels: { inApp: true, email: false, push: false } }
    }
  });
};

// Export the model
module.exports = mongoose.model('NotificationSettings', NotificationSettingsSchema);