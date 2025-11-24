const mongoose = require('mongoose');

const SubscriptionSchema = new mongoose.Schema({
  subscriptionId: { type: String, required: true, unique: true },
  userId: { type: String, required: true, ref: 'User' },
  planId: { type: String, required: true },
  planName: { type: String, required: true },
  planType: { type: String, required: true, enum: ['basic', 'professional', 'premium', 'enterprise'] },
  
  // Pricing
  amount: { type: Number, required: true },
  gst: { type: Number, required: true },
  discount: { type: Number, default: 0 },
  totalAmount: { type: Number, required: true },
  
  // Plan Benefits
  contactsAllowed: { type: Number, required: true },
  contactsUsed: { type: Number, default: 0 },
  validityDays: { type: Number, required: true },
  
  // Status
  status: { 
    type: String, 
    required: true,
    enum: ['active', 'expired', 'cancelled'],
    default: 'active'
  },
  
  // Dates
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  
  // Features
  features: {
    prioritySupport: { type: Boolean, default: false },
    instantAlerts: { type: Boolean, default: true },
    relationshipManager: { type: Boolean, default: false },
    aiRecommendations: { type: Boolean, default: false },
    fullLocationAccess: { type: Boolean, default: true },
    contactNumberAccess: { type: Boolean, default: true }
  },
  
  // Transaction Reference
  transactionId: { type: String },
  
}, { timestamps: true });

// Index for quick lookups
SubscriptionSchema.index({ userId: 1, status: 1 });
SubscriptionSchema.index({ endDate: 1 });

// Method to check if subscription is valid
SubscriptionSchema.methods.isValid = function() {
  return this.status === 'active' && new Date() < this.endDate;
};

// Method to check if user can access contact
SubscriptionSchema.methods.canAccessContact = function() {
  return this.isValid() && this.contactsUsed < this.contactsAllowed;
};

// Method to use a contact
SubscriptionSchema.methods.useContact = async function() {
  if (!this.canAccessContact()) {
    throw new Error('Contact limit reached or subscription expired');
  }
  this.contactsUsed += 1;
  await this.save();
};

module.exports = mongoose.model('Subscription', SubscriptionSchema);
