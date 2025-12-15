const mongoose = require('mongoose');

const PropertySchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  userId: { type: String, required: true, index: true }, // Added index for better query performance
  
  // --- ENHANCED MEDIA FIELDS WITH DATABASE STORAGE ---
  media: {
    photos: [{
      fileName: { type: String, required: true },
      fileType: { type: String, required: true },
      fileSize: { type: Number, required: true },
      imageType: { type: String }, // bedroom, living_room, kitchen, etc.
      sortOrder: { type: Number, default: 0 },
      isCover: { type: Boolean, default: false },
      uploadDate: { type: Date, default: Date.now },
      // Store binary data in database
      data: { type: Buffer },
      thumbnailData: { type: Buffer },
      mediumData: { type: Buffer },
      optimizedData: { type: Buffer }
    }],
    videos: [{
      fileName: { type: String, required: true },
      fileType: { type: String, required: true },
      fileSize: { type: Number, required: true },
      sortOrder: { type: Number, default: 0 },
      uploadDate: { type: Date, default: Date.now },
      // Store binary data in database
      data: { type: Buffer },
      youtubeUrl: { type: String }
    }],
    floorplans: [{
      fileName: { type: String, required: true },
      fileType: { type: String, required: true },
      fileSize: { type: Number, required: true },
      sortOrder: { type: Number, default: 0 },
      uploadDate: { type: Date, default: Date.now },
      // Store binary data in database
      data: { type: Buffer }
    }],
    brochures: [{
      fileName: { type: String, required: true },
      fileType: { type: String, required: true },
      fileSize: { type: Number, required: true },
      sortOrder: { type: Number, default: 0 },
      uploadDate: { type: Date, default: Date.now },
      // Store binary data in database
      data: { type: Buffer }
    }]
  },
  
  // Legacy fields for backward compatibility
  images: { type: [require('mongoose').Schema.Types.Mixed], default: [] },
  video: { type: String },

  // --- CORE FIELDS ---
  type: { type: String, required: true }, // rent/sale
  bhk: { type: Number, required: true },
  area: { type: String, required: true },
  price: { type: String, required: true },
  priceValue: { type: Number, required: true },
  location: { type: String, required: true },
  title: { type: String }, // Property title field
  status: { 
    type: String, 
    required: true,
    enum: ['draft', 'pending', 'active', 'paused', 'expired', 'sold', 'rejected', 'For Sale', 'For Rent'],
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
  
  // --- ENHANCED CONTACT & OWNER FIELDS ---
  ownerName: { type: String },
  contactRole: { type: String, enum: ['owner', 'agent', 'builder', 'tenant'], default: 'owner' },
  alternatePhone: { type: String },
  email: { type: String },
  whatsapp: { type: Boolean, default: false },
  contactOnlyLoggedIn: { type: Boolean, default: false },
  
  // --- SEO & META FIELDS ---
  urlSlug: { type: String },
  metaTitle: { type: String },
  metaDescription: { type: String },
  
  // --- ENHANCED LOCATION FIELDS ---
  country: { type: String, default: 'India' },
  state: { type: String },
  city: { type: String },
  locality: { type: String },
  landmark: { type: String },
  pincode: { type: String },
  addressLine: { type: String },
  latitude: { type: Number, default: 19.0760 },
  longitude: { type: Number, default: 72.8777 },
  hideExactLocation: { type: Boolean, default: false },
  
  // --- ENHANCED PRICING FIELDS ---
  maintenanceAmount: { type: Number },
  maintenancePeriod: { type: String, enum: ['Monthly', 'Yearly', 'One-Time', 'monthly', 'yearly', 'one-time'], default: 'monthly' },
  negotiable: { type: Boolean, default: false },
  securityDeposit: { type: String },
  preferredTenants: { type: [String], default: [] },
  
  // --- ENHANCED PROPERTY DETAILS ---
  superBuiltUpArea: { type: String },
  bedrooms: { type: Number },
  bathrooms: { type: Number },
  balconies: { type: Number },
  coveredParking: { type: Number },
  openParking: { type: Number },
  coveredBikeParking: { type: Number },
  openBikeParking: { type: Number },
  flooring: { type: String },
  waterSupply: { type: String },
  powerBackup: { type: String },
  
  // --- All other fields from the wizard ---
  userType: { type: String },
  phoneNumber: { type: String },
  lookingTo: { type: String },
  propertyKind: { type: String },
  propertyType: { type: String },
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
  security: { type: Boolean, default: false },
  cctv: { type: Boolean, default: false },
  fireSafety: { type: Boolean, default: false },
  lift: { type: Boolean, default: false },
  park: { type: Boolean, default: false },
  gym: { type: Boolean, default: false },
  pool: { type: Boolean, default: false },
  parking: { type: Boolean, default: false },
  maintenance: {
    amount: { type: Number },
    period: { type: String, enum: ['Monthly', 'Yearly', 'One-Time'] }
  },
  nearbyLandmarks: { type: [String], default: [] },
  
}, { 
  timestamps: true,
  // Add indexes for better query performance and scalability
});

// Add compound indexes for better query optimization
PropertySchema.index({ userId: 1, status: 1 });
PropertySchema.index({ status: 1, createdAt: -1 });
PropertySchema.index({ userId: 1, createdAt: -1 });
PropertySchema.index({ userId: 1, updatedAt: -1 });

// Add a text index for search functionality
PropertySchema.index({ 
  location: 'text', 
  description: 'text', 
  type: 'text',
  buildingName: 'text',
  title: 'text'
});

// Pre-save middleware to ensure data consistency
PropertySchema.pre('save', function(next) {
  // Ensure userId is always a string and properly formatted
  if (this.userId && typeof this.userId !== 'string') {
    this.userId = String(this.userId);
  }
  
  // Ensure priceValue is a number
  if (this.price && !this.priceValue) {
    const priceStr = this.price.toString();
    const numericValue = parseFloat(priceStr.replace(/[^0-9.-]+/g, ''));
    if (!isNaN(numericValue)) {
      this.priceValue = numericValue * (priceStr.includes('Cr') ? 10000000 : (priceStr.includes('L') ? 100000 : 1));
    }
  }
  
  next();
});

module.exports = mongoose.model('Property', PropertySchema);