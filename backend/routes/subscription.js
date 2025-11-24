const express = require('express');
const Subscription = require('../models/Subscription');
const Transaction = require('../models/Transaction');
const User = require('../models/User');
const authMiddleware = require('../middleware/authMiddleware');
const { checkPremiumAccess } = require('../middleware/premiumMiddleware');

const router = express.Router();

// Premium Plans Configuration
const PREMIUM_PLANS = {
  basic: {
    planId: 'basic_90',
    planName: 'Basic Plan',
    planType: 'basic',
    contactsAllowed: 10,
    validityDays: 90,
    amount: 999,
    features: {
      prioritySupport: false,
      instantAlerts: true,
      relationshipManager: false,
      aiRecommendations: false,
      fullLocationAccess: true,
      contactNumberAccess: true
    }
  },
  professional: {
    planId: 'professional_90',
    planName: 'Professional Plan',
    planType: 'professional',
    contactsAllowed: 50,
    validityDays: 90,
    amount: 2499,
    features: {
      prioritySupport: true,
      instantAlerts: true,
      relationshipManager: false,
      aiRecommendations: true,
      fullLocationAccess: true,
      contactNumberAccess: true
    }
  },
  premium: {
    planId: 'premium_90',
    planName: 'Premium Plan',
    planType: 'premium',
    contactsAllowed: 100,
    validityDays: 90,
    amount: 3999,
    features: {
      prioritySupport: true,
      instantAlerts: true,
      relationshipManager: true,
      aiRecommendations: true,
      fullLocationAccess: true,
      contactNumberAccess: true
    }
  },
  enterprise: {
    planId: 'enterprise_90',
    planName: 'Enterprise Plan',
    planType: 'enterprise',
    contactsAllowed: 999999, // Unlimited
    validityDays: 365,
    amount: 9999,
    features: {
      prioritySupport: true,
      instantAlerts: true,
      relationshipManager: true,
      aiRecommendations: true,
      fullLocationAccess: true,
      contactNumberAccess: true
    }
  }
};

// GET all available plans
router.get('/plans', (req, res) => {
  try {
    const plans = Object.values(PREMIUM_PLANS).map(plan => ({
      ...plan,
      gst: Math.floor(plan.amount * 0.18),
      totalAmount: Math.floor(plan.amount * 1.18)
    }));
    
    res.json({ plans });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET user's current subscription
router.get('/my-subscription', authMiddleware, async (req, res) => {
  try {
    const user = await User.findOne({ id: req.user.id }).populate('currentSubscription');
    
    if (!user.isPremium || !user.currentSubscription) {
      return res.json({ 
        hasPremium: false,
        subscription: null
      });
    }
    
    const subscription = user.currentSubscription;
    
    res.json({
      hasPremium: subscription.isValid(),
      subscription: {
        subscriptionId: subscription.subscriptionId,
        planName: subscription.planName,
        planType: subscription.planType,
        contactsAllowed: subscription.contactsAllowed,
        contactsUsed: subscription.contactsUsed,
        contactsRemaining: subscription.contactsAllowed - subscription.contactsUsed,
        startDate: subscription.startDate,
        endDate: subscription.endDate,
        daysRemaining: Math.ceil((subscription.endDate - new Date()) / (1000 * 60 * 60 * 24)),
        status: subscription.status,
        features: subscription.features
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST initiate payment (create transaction)
router.post('/initiate-payment', authMiddleware, async (req, res) => {
  try {
    const { planType, paymentMethod, discount = 0 } = req.body;
    const userId = req.user.id;
    
    // Validate plan
    const plan = PREMIUM_PLANS[planType];
    if (!plan) {
      return res.status(400).json({ message: 'Invalid plan' });
    }
    
    // Calculate amounts
    const amount = plan.amount;
    const discountAmount = Math.floor(amount * (discount / 100));
    const discountedAmount = amount - discountAmount;
    const gst = Math.floor(discountedAmount * 0.18);
    const totalAmount = discountedAmount + gst;
    
    // Create transaction ID
    const transactionId = `TXN_${Date.now()}_${userId}`;
    
    // Get user info for billing
    const user = await User.findOne({ id: userId });
    
    // Create transaction record
    const transaction = new Transaction({
      transactionId,
      userId,
      amount: discountedAmount,
      gst,
      discount: discountAmount,
      totalAmount,
      status: 'pending',
      paymentMethod,
      planDetails: {
        planId: plan.planId,
        planName: plan.planName,
        planType: plan.planType,
        contactsAllowed: plan.contactsAllowed,
        validityDays: plan.validityDays
      },
      billingInfo: {
        name: user.name,
        email: user.email,
        phone: user.phone
      },
      ipAddress: req.ip,
      userAgent: req.get('user-agent')
    });
    
    await transaction.save();
    
    // In production, integrate with Razorpay/Stripe here
    // For now, return transaction details
    res.json({
      success: true,
      transactionId,
      amount: totalAmount,
      currency: 'INR',
      planDetails: plan,
      // In production, return payment gateway order ID
      // razorpayOrderId: order.id
    });
    
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST verify and complete payment
router.post('/complete-payment', authMiddleware, async (req, res) => {
  try {
    const { 
      transactionId, 
      gatewayTransactionId, 
      gatewayResponse 
    } = req.body;
    
    const userId = req.user.id;
    
    // Find transaction
    const transaction = await Transaction.findOne({ transactionId, userId });
    
    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }
    
    if (transaction.status !== 'pending') {
      return res.status(400).json({ message: 'Transaction already processed' });
    }
    
    // In production, verify payment with Razorpay/Stripe
    // const isValid = await verifyPaymentSignature(gatewayResponse);
    // For demo, assuming payment is successful
    const isValid = true;
    
    if (!isValid) {
      transaction.status = 'failed';
      transaction.failedAt = new Date();
      transaction.failureReason = 'Payment verification failed';
      await transaction.save();
      
      return res.status(400).json({ 
        success: false,
        message: 'Payment verification failed' 
      });
    }
    
    // Update transaction
    transaction.status = 'success';
    transaction.completedAt = new Date();
    transaction.gatewayTransactionId = gatewayTransactionId;
    transaction.gatewayResponse = gatewayResponse;
    await transaction.save();
    
    // Create subscription
    const subscriptionId = `SUB_${Date.now()}_${userId}`;
    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + transaction.planDetails.validityDays);
    
    const subscription = new Subscription({
      subscriptionId,
      userId,
      planId: transaction.planDetails.planId,
      planName: transaction.planDetails.planName,
      planType: transaction.planDetails.planType,
      amount: transaction.amount,
      gst: transaction.gst,
      discount: transaction.discount,
      totalAmount: transaction.totalAmount,
      contactsAllowed: transaction.planDetails.contactsAllowed,
      validityDays: transaction.planDetails.validityDays,
      startDate,
      endDate,
      status: 'active',
      transactionId,
      features: PREMIUM_PLANS[transaction.planDetails.planType].features
    });
    
    await subscription.save();
    
    // Update user
    const user = await User.findOne({ id: userId });
    user.isPremium = true;
    user.currentSubscription = subscription._id;
    user.subscriptionHistory.push(subscription._id);
    await user.save();
    
    res.json({
      success: true,
      message: 'Payment successful',
      subscription: {
        subscriptionId: subscription.subscriptionId,
        planName: subscription.planName,
        endDate: subscription.endDate
      }
    });
    
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET transaction history
router.get('/transactions', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const page = parseInt(req.query.page) || 1;
    const limit = 10;
    const skip = (page - 1) * limit;
    
    const transactions = await Transaction.find({ userId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .select('-gatewayResponse -userAgent');
    
    const totalCount = await Transaction.countDocuments({ userId });
    
    res.json({
      transactions,
      totalCount,
      totalPages: Math.ceil(totalCount / limit),
      currentPage: page
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET subscription history
router.get('/subscription-history', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    
    const subscriptions = await Subscription.find({ userId })
      .sort({ createdAt: -1 });
    
    res.json({ subscriptions });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
