const mongoose = require('mongoose');

const PropertyHistorySchema = new mongoose.Schema({
  propertyId: { type: Number, required: true, ref: 'Property' },
  userId: { type: String, required: true },
  
  // Change tracking
  changeType: { 
    type: String, 
    enum: ['created', 'updated', 'status_changed', 'price_changed', 'media_changed', 'deleted'],
    required: true 
  },
  
  // Previous state (for updates)
  previousData: { type: mongoose.Schema.Types.Mixed },
  
  // Current state (after change)
  currentData: { type: mongoose.Schema.Types.Mixed },
  
  // Change details
  changedFields: [{ type: String }],
  changeReason: { type: String },
  changeNotes: { type: String },
  
  // Metadata
  changedBy: { type: String },
  ipAddress: { type: String },
  userAgent: { type: String },
  timestamp: { type: Date, default: Date.now },
  
  // For bulk operations
  isBulkOperation: { type: Boolean, default: false },
  bulkOperationId: { type: String },
  
  // Validation
  isValid: { type: Boolean, default: true },
  validationErrors: [{ type: String }]
}, { timestamps: true });

// Indexes for efficient querying
PropertyHistorySchema.index({ propertyId: 1, timestamp: -1 });
PropertyHistorySchema.index({ userId: 1, timestamp: -1 });
PropertyHistorySchema.index({ changeType: 1, timestamp: -1 });

module.exports = mongoose.model('PropertyHistory', PropertyHistorySchema);