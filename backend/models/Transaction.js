const mongoose = require('mongoose');

const TransactionSchema = new mongoose.Schema({
  transactionId: { type: String, required: true, unique: true },
  userId: { type: String, required: true, ref: 'User' },
  subscriptionId: { type: String, ref: 'Subscription' },
  
  // Payment Details
  amount: { type: Number, required: true },
  gst: { type: Number, required: true },
  discount: { type: Number, default: 0 },
  totalAmount: { type: Number, required: true },
  currency: { type: String, default: 'INR' },
  
  // Transaction Status
  status: { 
    type: String, 
    required: true,
    enum: ['pending', 'processing', 'success', 'failed', 'refunded'],
    default: 'pending'
  },
  
  // Payment Method
  paymentMethod: { 
    type: String, 
    required: true,
    enum: ['card', 'upi', 'netbanking', 'wallet', 'paylater']
  },
  
  // Payment Gateway Details
  gatewayTransactionId: { type: String },
  gatewayName: { type: String, default: 'Razorpay' },
  gatewayResponse: { type: Object },
  
  // Plan Details
  planDetails: {
    planId: String,
    planName: String,
    planType: String,
    contactsAllowed: Number,
    validityDays: Number
  },
  
  // Billing Information
  billingInfo: {
    name: String,
    email: String,
    phone: String,
    address: String
  },
  
  // Transaction Metadata
  ipAddress: String,
  userAgent: String,
  
  // Timestamps
  initiatedAt: { type: Date, default: Date.now },
  completedAt: Date,
  failedAt: Date,
  refundedAt: Date,
  
  // Failure Reason
  failureReason: String,
  
}, { timestamps: true });

// Indexes for efficient querying
TransactionSchema.index({ userId: 1, createdAt: -1 });
TransactionSchema.index({ transactionId: 1 });
TransactionSchema.index({ status: 1 });

module.exports = mongoose.model('Transaction', TransactionSchema);
