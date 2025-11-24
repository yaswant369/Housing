// Middleware to check if user has premium access
const Subscription = require('../models/Subscription');
const User = require('../models/User');

const checkPremiumAccess = async (req, res, next) => {
  try {
    const userId = req.user.id;
    
    // Get user
    const user = await User.findOne({ id: userId }).populate('currentSubscription');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Check if user has premium
    if (!user.isPremium || !user.currentSubscription) {
      return res.status(403).json({ 
        message: 'Premium subscription required',
        requiresPremium: true,
        code: 'NO_SUBSCRIPTION'
      });
    }
    
    // Check if subscription is valid
    const subscription = user.currentSubscription;
    
    if (!subscription.isValid()) {
      // Update user's premium status
      user.isPremium = false;
      await user.save();
      
      return res.status(403).json({ 
        message: 'Subscription expired',
        requiresPremium: true,
        code: 'SUBSCRIPTION_EXPIRED'
      });
    }
    
    // Attach subscription to request for further use
    req.subscription = subscription;
    req.userWithSubscription = user;
    
    next();
  } catch (error) {
    console.error('Premium access check error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

// Middleware to check contact access limit
const checkContactLimit = async (req, res, next) => {
  try {
    const subscription = req.subscription;
    
    if (!subscription) {
      return res.status(403).json({ 
        message: 'No active subscription',
        code: 'NO_SUBSCRIPTION'
      });
    }
    
    // Check if user can access more contacts
    if (!subscription.canAccessContact()) {
      return res.status(403).json({ 
        message: 'Contact limit reached',
        requiresUpgrade: true,
        code: 'CONTACT_LIMIT_REACHED',
        contactsAllowed: subscription.contactsAllowed,
        contactsUsed: subscription.contactsUsed
      });
    }
    
    next();
  } catch (error) {
    console.error('Contact limit check error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

// Optional premium middleware (doesn't block request, just adds subscription info)
const optionalPremiumCheck = async (req, res, next) => {
  try {
    const userId = req.user.id;
    
    const user = await User.findOne({ id: userId }).populate('currentSubscription');
    
    if (user && user.isPremium && user.currentSubscription) {
      const subscription = user.currentSubscription;
      if (subscription.isValid()) {
        req.subscription = subscription;
        req.isPremiumUser = true;
      } else {
        // Update expired subscription
        user.isPremium = false;
        await user.save();
        req.isPremiumUser = false;
      }
    } else {
      req.isPremiumUser = false;
    }
    
    next();
  } catch (error) {
    console.error('Optional premium check error:', error);
    req.isPremiumUser = false;
    next();
  }
};

module.exports = {
  checkPremiumAccess,
  checkContactLimit,
  optionalPremiumCheck
};
