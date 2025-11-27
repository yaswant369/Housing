 const mongoose = require('mongoose');

const PropertySchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  userId: { type: String, required: true },
  
  // --- NEW MEDIA FIELDS ---
  // images may be stored as either an array of strings (legacy) or
  // an array of objects with { thumbnail, medium, optimized }.
  images: { type: [require('mongoose').Schema.Types.Mixed], default: [] },
  video: { type: String },    // A single video path

  // --- CORE FIELDS ---
  type: { type: String, required: true },
  bhk: { type: Number, required: true },
  area: { type: String, required: true },
  price: { type: String, required: true },
  priceValue: { type: Number, required: true },
  location: { type: String, required: true },
  status: { 
    type: String, 
    required: true,
    enum: ['draft', 'pending', 'active', 'paused', 'expired', 'sold', 'rejected'],
    default: 'draft'
  },
  furnishing: { type: String, required: true },
  isFeatured: { type: Boolean, default: false },
  
  // --- NEW FIELDS FOR MY PROPERTIES ---
  planType: { 
    type: String, 
    enum: ['free', 'featured', 'premium'],
    default: 'free'
  },
  expiresAt: { type: Date },
  buildingName: { type: String },
  
  // Analytics fields
  viewsLast7Days: { type: Number, default: 0 },
  viewsLast30Days: { type: Number, default: 0 },
  leadsLast7Days: { type: Number, default: 0 },
  leadsLast30Days: { type: Number, default: 0 },
  shortlistsCount: { type: Number, default: 0 },
  
  // All other fields from the wizard
  userType: { type: String },
  phoneNumber: { type: String },
  lookingTo: { type: String },
  propertyKind: { type: String },
  propertyType: { type: String },
  city: { type: String },
  bathrooms: { type: Number },
  balconies: { type: Number },
  plotArea: { type: String },
  carpetArea: { type: String },
  coveredParking: { type: Number },
  openParking: { type: Number },
  totalFloors: { type: Number },
  availability: { type: String },
  propertyAge: { type: String },
  ownership: { type: String },
  expectedPrice: { type: Number },
  description: { type: String },
  keyHighlights: { type: [String], default: [] },
  amenities: { type: [String], default: [] },
  facing: { type: String },
  propertyOnFloor: { type: String },
  reraId: { type: String },
  priceIncludes: { type: [String], default: [] },
  gatedCommunity: { type: Boolean },
  maintenance: {
    amount: { type: Number },
    period: { type: String, enum: ['Monthly', 'Yearly', 'One-Time'] }
  },
  nearbyLandmarks: { type: [String], default: [] },
  
}, { timestamps: true }); // Automatically adds 'createdAt' and 'updatedAt'

// --- REMOVE OLD 'image' FIELD ---
// We no longer use the single 'image' field

module.exports = mongoose.model('Property', PropertySchema);