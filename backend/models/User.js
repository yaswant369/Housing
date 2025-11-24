 const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  password: { type: String, required: true },
  savedProperties: [{ type: Number, ref: 'Property' }],
  
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
  
}, { timestamps: true });

// Method to check if user has active premium
UserSchema.methods.hasActivePremium = async function() {
  if (!this.isPremium || !this.currentSubscription) return false;
  
  const Subscription = require('./Subscription');
  const subscription = await Subscription.findById(this.currentSubscription);
  
  return subscription && subscription.isValid();
};

module.exports = mongoose.model('User', UserSchema);