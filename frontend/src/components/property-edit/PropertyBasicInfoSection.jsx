import React from 'react';
import {
  Home,
  Building,
  MapPin,
  Calendar,
  Users,
  Hash,
  ArrowUpDown,
  Navigation,
  FileText,
  Lightbulb,
  Map,
  Edit3
} from 'lucide-react';

const listingTypes = [
  { value: 'rent', label: 'Rent', icon: Home },
  { value: 'sell', label: 'Sell', icon: Building },
  { value: 'pg', label: 'PG / Co-living', icon: Users },
  { value: 'commercial', label: 'Commercial', icon: Building },
  { value: 'plots', label: 'Plots', icon: Map },
  { value: 'residential', label: 'Residential', icon: Home }
];

const propertyTypes = [
  { value: 'apartment', label: 'Apartment' },
  { value: 'villa', label: 'Villa' },
  { value: 'independent_house', label: 'Independent House' },
  { value: 'plot', label: 'Plot / Land' },
  { value: 'office', label: 'Office Space' },
  { value: 'shop', label: 'Shop / Retail' },
  { value: 'warehouse', label: 'Warehouse' },
  { value: 'factory', label: 'Factory' },
  { value: 'studio', label: 'Studio' },
  { value: 'penthouse', label: 'Penthouse' },
  { value: 'duplex', label: 'Duplex' },
  { value: 'builder_floor', label: 'Builder Floor' },
  { value: 'farm_house', label: 'Farm House' },
  { value: 'serviced_apartment', label: 'Serviced Apartment' },
  { value: 'shared_accommodation', label: 'Shared Accommodation' },
  { value: 'hostel', label: 'Hostel' },
  { value: 'guest_house', label: 'Guest House' },
  { value: 'hotel', label: 'Hotel' },
  { value: 'resort', label: 'Resort' },
  { value: 'land', label: 'Commercial Land' },
  { value: 'showroom', label: 'Showroom' },
  { value: 'mall', label: 'Mall Space' },
  { value: 'cinema_hall', label: 'Cinema Hall' },
  { value: 'theater', label: 'Theater' },
  { value: 'restaurant', label: 'Restaurant Space' },
  { value: 'gas_station', label: 'Gas Station' },
  { value: 'petrol_pump', label: 'Petrol Pump' },
  { value: 'solar_plant', label: 'Solar Plant' },
  { value: 'wind_mill', label: 'Wind Mill' },
  { value: 'custom', label: 'Custom Property Type' }
];

const facingOptions = [
  { value: 'north', label: 'North' },
  { value: 'south', label: 'South' },
  { value: 'east', label: 'East' },
  { value: 'west', label: 'West' },
  { value: 'north-east', label: 'North-East' },
  { value: 'north-west', label: 'North-West' },
  { value: 'south-east', label: 'South-East' },
  { value: 'south-west', label: 'South-West' }
];

const propertyAges = [
  { value: 'new', label: 'New (0-1 years)' },
  { value: '1-3', label: '1-3 years' },
  { value: '3-5', label: '3-5 years' },
  { value: '5-10', label: '5-10 years' },
  { value: '10+', label: '10+ years' }
];

export default function PropertyBasicInfoSection({
  property,
  formData,
  onInputChange
}) {
  const generateAutoTitle = () => {
    const parts = [];
    
    // BHK configuration
    if (formData.bhk && propertyTypes.find(pt => pt.value === formData.propertyType)?.label !== 'Plot / Land') {
      parts.push(`${formData.bhk} BHK`);
    }
    
    // Property type
    const propertyTypeLabel = propertyTypes.find(pt => pt.value === formData.propertyType)?.label || '';
    if (propertyTypeLabel) {
      parts.push(propertyTypeLabel);
    }
    
    // Location
    if (formData.city || formData.locality) {
      parts.push(`in ${formData.locality || formData.city}`);
    }
    
    return parts.join(' ');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
          <Home className="text-blue-600" size={24} />
          Basic Property Info
        </h2>
        <div className="text-sm text-gray-500">
          Section 1 of 5
        </div>
      </div>

      {/* You're looking to? */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          You're looking to? *
        </label>
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => {
              onInputChange('lookingFor', 'sell');
              onInputChange('listingType', 'sell'); // Sync listingType
            }}
            className={`p-4 rounded-lg border-2 transition-all ${
              formData.lookingFor === 'sell' || formData.listingType === 'sell'
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="text-center">
              <Building
                size={24}
                className={`mx-auto mb-2 ${
                  formData.lookingFor === 'sell' || formData.listingType === 'sell' ? 'text-blue-600' : 'text-gray-600'
                }`}
              />
              <span className={`font-medium ${
                formData.lookingFor === 'sell' || formData.listingType === 'sell'
                  ? 'text-blue-600'
                  : 'text-gray-900'
              }`}>
                Sell
              </span>
            </div>
          </button>
          <button
            type="button"
            onClick={() => {
              onInputChange('lookingFor', 'rent');
              onInputChange('listingType', 'rent'); // Sync listingType
            }}
            className={`p-4 rounded-lg border-2 transition-all ${
              formData.lookingFor === 'rent' || formData.listingType === 'rent'
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="text-center">
              <Home
                size={24}
                className={`mx-auto mb-2 ${
                  formData.lookingFor === 'rent' || formData.listingType === 'rent' ? 'text-blue-600' : 'text-gray-600'
                }`}
              />
              <span className={`font-medium ${
                formData.lookingFor === 'rent' || formData.listingType === 'rent'
                  ? 'text-blue-600'
                  : 'text-gray-900'
              }`}>
                Rent / Lease
              </span>
            </div>
          </button>
        </div>
      </div>

      {/* Listing Type */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Listing Type *
        </label>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          <button
            type="button"
            onClick={() => onInputChange('propertyKind', 'residential')}
            className={`p-3 rounded-lg border-2 transition-all ${
              formData.propertyKind === 'residential'
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="text-center">
              <Home
                size={20}
                className={`mx-auto mb-2 ${
                  formData.propertyKind === 'residential' ? 'text-blue-600' : 'text-gray-600'
                }`}
              />
              <span className={`text-sm font-medium ${
                formData.propertyKind === 'residential'
                  ? 'text-blue-600'
                  : 'text-gray-900'
              }`}>
                Residential
              </span>
            </div>
          </button>
          <button
            type="button"
            onClick={() => onInputChange('propertyKind', 'commercial')}
            className={`p-3 rounded-lg border-2 transition-all ${
              formData.propertyKind === 'commercial'
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="text-center">
              <Building
                size={20}
                className={`mx-auto mb-2 ${
                  formData.propertyKind === 'commercial' ? 'text-blue-600' : 'text-gray-600'
                }`}
              />
              <span className={`text-sm font-medium ${
                formData.propertyKind === 'commercial'
                  ? 'text-blue-600'
                  : 'text-gray-900'
              }`}>
                Commercial
              </span>
            </div>
          </button>
          <button
            type="button"
            onClick={() => onInputChange('propertyKind', 'plots')}
            className={`p-3 rounded-lg border-2 transition-all ${
              formData.propertyKind === 'plots'
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="text-center">
              <Map
                size={20}
                className={`mx-auto mb-2 ${
                  formData.propertyKind === 'plots' ? 'text-blue-600' : 'text-gray-600'
                }`}
              />
              <span className={`text-sm font-medium ${
                formData.propertyKind === 'plots'
                  ? 'text-blue-600'
                  : 'text-gray-900'
              }`}>
                Plots
              </span>
            </div>
          </button>
          <button
            type="button"
            onClick={() => onInputChange('propertyKind', 'pg')}
            className={`p-3 rounded-lg border-2 transition-all ${
              formData.propertyKind === 'pg'
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="text-center">
              <Users
                size={20}
                className={`mx-auto mb-2 ${
                  formData.propertyKind === 'pg' ? 'text-blue-600' : 'text-gray-600'
                }`}
              />
              <span className={`text-sm font-medium ${
                formData.propertyKind === 'pg'
                  ? 'text-blue-600'
                  : 'text-gray-900'
              }`}>
                PG
              </span>
            </div>
          </button>
          <button
            type="button"
            onClick={() => onInputChange('propertyKind', 'projects')}
            className={`p-3 rounded-lg border-2 transition-all ${
              formData.propertyKind === 'projects'
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="text-center">
              <Building
                size={20}
                className={`mx-auto mb-2 ${
                  formData.propertyKind === 'projects' ? 'text-blue-600' : 'text-gray-600'
                }`}
              />
              <span className={`text-sm font-medium ${
                formData.propertyKind === 'projects'
                  ? 'text-blue-600'
                  : 'text-gray-900'
              }`}>
                Projects
              </span>
            </div>
          </button>
        </div>
      </div>

      {/* Property Type & BHK */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Property Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Property Type *
          </label>
          <select
            value={formData.propertyType || ''}
            onChange={(e) => onInputChange('propertyType', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white text-gray-900"
          >
            <option value="">Select property type</option>
            {propertyTypes.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
          
          {/* Custom Property Type Input */}
          {formData.propertyType === 'custom' && (
            <div className="mt-3">
              <div className="relative">
                <Edit3 className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  value={formData.customPropertyType || ''}
                  onChange={(e) => onInputChange('customPropertyType', e.target.value)}
                  placeholder="Enter custom property type (e.g., Co-working Space, Boutique Hotel)"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white text-gray-900"
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Please specify your custom property type
              </p>
            </div>
          )}
        </div>

        {/* BHK Configuration */}
        {formData.propertyType !== 'plot' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              BHK / Configuration
            </label>
            <select
              value={formData.bhk || ''}
              onChange={(e) => onInputChange('bhk', parseInt(e.target.value))}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white text-gray-900"
            >
              <option value="">Select BHK</option>
              {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                <option key={num} value={num}>
                  {num} BHK
                </option>
              ))}
              <option value="0">Studio / 1 RK</option>
            </select>
          </div>
        )}
      </div>

      {/* Property Title */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="block text-sm font-medium text-gray-700">
            Property Title
          </label>
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              const autoTitle = generateAutoTitle();
              if (autoTitle) {
                onInputChange('title', autoTitle);
              }
            }}
            className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700"
          >
            <Lightbulb size={12} />
            Auto-generate
          </button>
        </div>
        <div className="relative">
          <FileText className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            value={formData.title || ''}
            onChange={(e) => onInputChange('title', e.target.value)}
            placeholder="e.g., 2 BHK Apartment in Andheri East"
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white"
          />
        </div>
        <p className="text-xs text-gray-500 mt-1">
          {formData.title?.length || 0}/100 characters. Auto-generated: "{generateAutoTitle()}"
        </p>
      </div>

      {/* Project/Society Name */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Project / Society Name
        </label>
        <div className="relative">
          <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            value={formData.buildingName || ''}
            onChange={(e) => onInputChange('buildingName', e.target.value)}
            placeholder="e.g., Brigade Gateway, Prestige Lakeside Heights"
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white"
          />
        </div>
      </div>

      {/* Property Age & Facing */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Property Age */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Property Age
          </label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <select
              value={formData.propertyAge || ''}
              onChange={(e) => onInputChange('propertyAge', e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white text-gray-900"
            >
              <option value="">Select age</option>
              {propertyAges.map((age) => (
                <option key={age.value} value={age.value}>
                  {age.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Facing */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Facing Direction
          </label>
          <div className="relative">
            <Navigation className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <select
              value={formData.facing || ''}
              onChange={(e) => onInputChange('facing', e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white text-gray-900"
            >
              <option value="">Select facing</option>
              {facingOptions.map((facing) => (
                <option key={facing.value} value={facing.value}>
                  {facing.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Floor Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Current Floor */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Floor Number
          </label>
          <div className="relative">
            <Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="number"
              value={formData.propertyOnFloor || ''}
              onChange={(e) => onInputChange('propertyOnFloor', e.target.value)}
              placeholder="e.g., 3"
              min="0"
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white"
            />
          </div>
          <div className="mt-2">
            <label className="flex items-center gap-2 text-sm text-gray-600">
              <input
                type="checkbox"
                checked={formData.propertyOnFloor === 'ground'}
                onChange={(e) => onInputChange('propertyOnFloor', e.target.checked ? 'ground' : '')}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              Ground Floor
            </label>
          </div>
        </div>

        {/* Total Floors */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Total Floors in Building
          </label>
          <div className="relative">
            <ArrowUpDown className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="number"
              value={formData.totalFloors || ''}
              onChange={(e) => onInputChange('totalFloors', parseInt(e.target.value))}
              placeholder="e.g., 15"
              min="1"
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white"
            />
          </div>
        </div>
      </div>

      {/* Additional Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Status Indicator */}
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <FileText className="text-blue-600" size={20} />
            </div>
            <div>
              <p className="text-sm text-blue-600 font-medium">Auto Title</p>
              <p className="font-bold text-blue-900 text-sm">
                {generateAutoTitle() || 'Not generated'}
              </p>
            </div>
          </div>
        </div>

        {/* Configuration Summary */}
        <div className="bg-green-50 p-4 rounded-lg border border-green-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <Home className="text-green-600" size={20} />
            </div>
            <div>
              <p className="text-sm text-green-600 font-medium">Configuration</p>
              <p className="font-bold text-green-900 text-sm">
                {formData.bhk ? `${formData.bhk} BHK` : 'Not set'}
              </p>
            </div>
          </div>
        </div>

        {/* Property Type */}
        <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-100 rounded-lg">
              <Building className="text-orange-600" size={20} />
            </div>
            <div>
              <p className="text-sm text-orange-600 font-medium">Property Type</p>
              <p className="font-bold text-orange-900 text-sm">
                {propertyTypes.find(pt => pt.value === formData.propertyType)?.label || 'Not selected'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Validation Messages */}
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <div className="p-1 bg-amber-100 rounded">
            <Lightbulb className="text-amber-600" size={16} />
          </div>
          <div>
            <h4 className="font-semibold text-amber-800 mb-1">
              Tips for better visibility
            </h4>
            <ul className="text-sm text-amber-700 space-y-1">
              <li>• Include specific locality name for better search results</li>
              <li>• Complete all fields to improve listing quality score</li>
              <li>• Use the auto-generate feature for consistent formatting</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
