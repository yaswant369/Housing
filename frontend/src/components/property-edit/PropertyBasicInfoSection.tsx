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
  Lightbulb
} from 'lucide-react';

interface PropertyBasicInfoSectionProps {
  property: any;
  formData: any;
  onInputChange: (field: string, value: any) => void;
}

const listingTypes = [
  { value: 'rent', label: 'Rent', icon: Home },
  { value: 'sell', label: 'Sell', icon: Building },
  { value: 'pg', label: 'PG / Co-living', icon: Users },
  { value: 'commercial', label: 'Commercial', icon: Building }
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
  { value: 'duplex', label: 'Duplex' }
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
}: PropertyBasicInfoSectionProps) {
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
        <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
          <Home className="text-blue-600" size={24} />
          Basic Property Info
        </h2>
        <div className="text-sm text-gray-500 dark:text-gray-400">
          Section 2 of 5
        </div>
      </div>

      {/* Listing Type */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
          Listing Type *
        </label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {listingTypes.map((type) => {
            const IconComponent = type.icon;
            return (
              <button
                key={type.value}
                type="button"
                onClick={() => onInputChange('listingType', type.value)}
                className={`p-4 rounded-lg border-2 transition-all ${
                  formData.listingType === type.value
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                }`}
              >
                <div className="text-center">
                  <div className="flex justify-center mb-2">
                    <IconComponent 
                      size={24} 
                      className={formData.listingType === type.value ? 'text-blue-600' : 'text-gray-600'} 
                    />
                  </div>
                  <span className={`font-medium ${
                    formData.listingType === type.value 
                      ? 'text-blue-600 dark:text-blue-400' 
                      : 'text-gray-900 dark:text-gray-100'
                  }`}>
                    {type.label}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Property Type & BHK */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Property Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Property Type *
          </label>
          <select
            value={formData.propertyType || ''}
            onChange={(e) => onInputChange('propertyType', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
          >
            <option value="">Select property type</option>
            {propertyTypes.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>

        {/* BHK Configuration */}
        {formData.propertyType !== 'plot' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              BHK / Configuration
            </label>
            <select
              value={formData.bhk || ''}
              onChange={(e) => onInputChange('bhk', parseInt(e.target.value))}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
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
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Property Title
          </label>
          <button
            type="button"
            onClick={() => {
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
            className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800"
          />
        </div>
        <p className="text-xs text-gray-500 mt-1">
          {formData.title?.length || 0}/100 characters. Auto-generated: "{generateAutoTitle()}"
        </p>
      </div>

      {/* Project/Society Name */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Project / Society Name
        </label>
        <div className="relative">
          <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            value={formData.buildingName || ''}
            onChange={(e) => onInputChange('buildingName', e.target.value)}
            placeholder="e.g., Brigade Gateway, Prestige Lakeside Heights"
            className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800"
          />
        </div>
      </div>

      {/* Property Age & Facing */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Property Age */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Property Age
          </label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <select
              value={formData.propertyAge || ''}
              onChange={(e) => onInputChange('propertyAge', e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
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
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Facing Direction
          </label>
          <div className="relative">
            <Navigation className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <select
              value={formData.facing || ''}
              onChange={(e) => onInputChange('facing', e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
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
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
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
              className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800"
            />
          </div>
          <div className="mt-2">
            <label className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
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
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
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
              className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800"
            />
          </div>
        </div>
      </div>

      {/* Additional Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Status Indicator */}
        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-700">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-800 rounded-lg">
              <FileText className="text-blue-600" size={20} />
            </div>
            <div>
              <p className="text-sm text-blue-600 dark:text-blue-400 font-medium">Auto Title</p>
              <p className="font-bold text-blue-900 dark:text-blue-100 text-sm">
                {generateAutoTitle() || 'Not generated'}
              </p>
            </div>
          </div>
        </div>

        {/* Configuration Summary */}
        <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-200 dark:border-green-700">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 dark:bg-green-800 rounded-lg">
              <Home className="text-green-600" size={20} />
            </div>
            <div>
              <p className="text-sm text-green-600 dark:text-green-400 font-medium">Configuration</p>
              <p className="font-bold text-green-900 dark:text-green-100 text-sm">
                {formData.bhk ? `${formData.bhk} BHK` : 'Not set'}
              </p>
            </div>
          </div>
        </div>

        {/* Property Type */}
        <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg border border-orange-200 dark:border-orange-700">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-100 dark:bg-orange-800 rounded-lg">
              <Building className="text-orange-600" size={20} />
            </div>
            <div>
              <p className="text-sm text-orange-600 dark:text-orange-400 font-medium">Property Type</p>
              <p className="font-bold text-orange-900 dark:text-orange-100 text-sm">
                {propertyTypes.find(pt => pt.value === formData.propertyType)?.label || 'Not selected'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Validation Messages */}
      <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <div className="p-1 bg-amber-100 dark:bg-amber-800 rounded">
            <Lightbulb className="text-amber-600" size={16} />
          </div>
          <div>
            <h4 className="font-semibold text-amber-800 dark:text-amber-200 mb-1">
              Tips for better visibility
            </h4>
            <ul className="text-sm text-amber-700 dark:text-amber-300 space-y-1">
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