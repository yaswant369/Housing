 const mongoose = require('mongoose');

const PropertySchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  userId: { type: String, required: true },
  
  // --- NEW MEDIA FIELDS ---
  images: [{ type: String }], // An array of image paths
  video: { type: String },    // A single video path

  // --- CORE FIELDS ---
  type: { type: String, required: true },
  bhk: { type: Number, required: true },
  area: { type: String, required: true },
  price: { type: String, required: true },
  priceValue: { type: Number, required: true },
  location: { type: String, required: true },
  status: { type: String, required: true },
  furnishing: { type: String, required: true },
  isFeatured: { type: Boolean, default: false },
  
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
}, { timestamps: true }); // Automatically adds 'createdAt' and 'updatedAt'

// --- REMOVE OLD 'image' FIELD ---
// We no longer use the single 'image' field

module.exports = mongoose.model('Property', PropertySchema);