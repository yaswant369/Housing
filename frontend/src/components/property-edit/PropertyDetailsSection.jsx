import React from 'react';
import {
  Home,
  Bath,
  Car,
  Bike,
  Building,
  Layers,
  Zap,
  Droplets,
  CheckCircle,
  Info,
  Shield,
  TreePine,
  Lock
} from 'lucide-react';

const furnishingOptions = [
  { value: 'unfurnished', label: 'Unfurnished', description: 'No furniture' },
  { value: 'semi-furnished', label: 'Semi-Furnished', description: 'Basic furniture' },
  { value: 'furnished', label: 'Furnished', description: 'Full furniture' }
];

const flooringTypes = [
  { value: 'marble', label: 'Marble', icon: Building },
  { value: 'vitrified', label: 'Vitrified Tiles', icon: Building },
  { value: 'ceramic', label: 'Ceramic Tiles', icon: Building },
  { value: 'wooden', label: 'Wooden Flooring', icon: Building },
  { value: 'laminate', label: 'Laminate', icon: Building },
  { value: 'concrete', label: 'Concrete', icon: Building },
  { value: 'granite', label: 'Granite', icon: Building }
];

const waterSupplyOptions = [
  { value: '24x7', label: '24x7 Water Supply' },
  { value: 'limited', label: 'Limited Water Supply' },
  { value: 'borewell', label: 'Borewell' },
  { value: 'municipal', label: 'Municipal Supply' },
  { value: 'tanker', label: 'Tanker Water' }
];

const powerBackupOptions = [
  { value: 'full', label: 'Full Power Backup' },
  { value: 'partial', label: 'Partial Power Backup' },
  { value: 'none', label: 'No Power Backup' }
];

export default function PropertyDetailsSection({
  property,
  formData,
  onInputChange
}) {
  const handleAreaChange = (field, value) => {
    // Keep only numbers and decimal points
    const cleaned = value.replace(/[^\d.]/g, '');
    onInputChange(field, cleaned);
  };

  const calculateTotalArea = () => {
    const builtUp = parseFloat(formData.builtUpArea?.replace(/[^\d.]/g, '')) || 0;
    const carpet = parseFloat(formData.carpetArea?.replace(/[^\d.]/g, '')) || 0;
    const superBuiltUp = parseFloat(formData.superBuiltUpArea?.replace(/[^\d.]/g, '')) || 0;
    return { builtUp, carpet, superBuiltUp };
  };

  const { builtUp, carpet, superBuiltUp } = calculateTotalArea();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
          <Home className="text-blue-600" size={24} />
          Property Details
        </h2>
        <div className="text-sm text-gray-500">
          Section 5 of 5
        </div>
      </div>

      {/* Area Information */}
      <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Layers className="text-blue-600" size={20} />
          Area Measurements
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Built-up Area */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Built-up Area *
            </label>
            <div className="relative">
              <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                value={formData.builtUpArea || ''}
                onChange={(e) => handleAreaChange('builtUpArea', e.target.value)}
                placeholder="950 sq.ft"
                className="w-full pl-10 pr-20 py-3 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white"
              />
              <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-gray-500">
                sq.ft
              </span>
            </div>
          </div>

          {/* Carpet Area */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Carpet Area
            </label>
            <div className="relative">
              <Home className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                value={formData.carpetArea || ''}
                onChange={(e) => handleAreaChange('carpetArea', e.target.value)}
                placeholder="800 sq.ft"
                className="w-full pl-10 pr-20 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white"
              />
              <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-gray-500">
                sq.ft
              </span>
            </div>
          </div>

          {/* Super Built-up Area */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Super Built-up Area
            </label>
            <div className="relative">
              <Layers className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                value={formData.superBuiltUpArea || ''}
                onChange={(e) => handleAreaChange('superBuiltUpArea', e.target.value)}
                placeholder="1200 sq.ft"
                className="w-full pl-10 pr-20 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white"
              />
              <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-gray-500">
                sq.ft
              </span>
            </div>
          </div>
        </div>

        {/* Area Relationships */}
        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-3 bg-white rounded-lg border">
            <p className="text-sm text-gray-600">Carpet Ratio</p>
            <p className="font-semibold text-gray-900">
              {builtUp > 0 && carpet > 0 ? `${Math.round((carpet / builtUp) * 100)}%` : 'N/A'}
            </p>
          </div>
          <div className="text-center p-3 bg-white rounded-lg border">
            <p className="text-sm text-gray-600">Super Built-up Ratio</p>
            <p className="font-semibold text-gray-900">
              {builtUp > 0 && superBuiltUp > 0 ? `${Math.round((superBuiltUp / builtUp) * 100)}%` : 'N/A'}
            </p>
          </div>
          <div className="text-center p-3 bg-white rounded-lg border">
            <p className="text-sm text-gray-600">Largest Area</p>
            <p className="font-semibold text-gray-900">
              {Math.max(builtUp, carpet, superBuiltUp) || 'N/A'} sq.ft
            </p>
          </div>
        </div>
      </div>

      {/* Room Configuration */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Bedrooms */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Bedrooms
          </label>
          <div className="relative">
            <Home className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <select
              value={formData.bedrooms || ''}
              onChange={(e) => onInputChange('bedrooms', parseInt(e.target.value))}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white text-gray-900"
            >
              <option value="">Select bedrooms</option>
              {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                <option key={num} value={num}>
                  {num === 0 ? 'Studio' : `${num} ${num === 1 ? 'Bedroom' : 'Bedrooms'}`}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Bathrooms */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Bathrooms
          </label>
          <div className="relative">
            <Bath className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <select
              value={formData.bathrooms || ''}
              onChange={(e) => onInputChange('bathrooms', parseInt(e.target.value))}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white text-gray-900"
            >
              <option value="">Select bathrooms</option>
              {[1, 2, 3, 4, 5, 6].map((num) => (
                <option key={num} value={num}>
                  {num} {num === 1 ? 'Bathroom' : 'Bathrooms'}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Balconies */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Balconies
          </label>
          <div className="relative">
            <TreePine className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <select
              value={formData.balconies || ''}
              onChange={(e) => onInputChange('balconies', parseInt(e.target.value))}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white text-gray-900"
            >
              <option value="">Select balconies</option>
              {[0, 1, 2, 3, 4, 5].map((num) => (
                <option key={num} value={num}>
                  {num} {num === 1 ? 'Balcony' : 'Balconies'}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Parking */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Car className="text-blue-600" size={20} />
          Parking Information
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Car Parking - Covered */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Car Parking (Covered)
            </label>
            <div className="relative">
              <Car className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <select
                value={formData.coveredParking || ''}
                onChange={(e) => onInputChange('coveredParking', parseInt(e.target.value))}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white text-gray-900"
              >
                <option value="">Select</option>
                {[0, 1, 2, 3, 4].map((num) => (
                  <option key={num} value={num}>
                    {num} {num === 1 ? 'Spot' : 'Spots'}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Car Parking - Open */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Car Parking (Open)
            </label>
            <div className="relative">
              <Car className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <select
                value={formData.openParking || ''}
                onChange={(e) => onInputChange('openParking', parseInt(e.target.value))}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white text-gray-900"
              >
                <option value="">Select</option>
                {[0, 1, 2, 3, 4].map((num) => (
                  <option key={num} value={num}>
                    {num} {num === 1 ? 'Spot' : 'Spots'}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Bike Parking - Covered */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Bike Parking (Covered)
            </label>
            <div className="relative">
              <Bike className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <select
                value={formData.coveredBikeParking || ''}
                onChange={(e) => onInputChange('coveredBikeParking', parseInt(e.target.value))}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white text-gray-900"
              >
                <option value="">Select</option>
                {[0, 1, 2, 3, 4, 5, 6].map((num) => (
                  <option key={num} value={num}>
                    {num} {num === 1 ? 'Spot' : 'Spots'}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Bike Parking - Open */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Bike Parking (Open)
            </label>
            <div className="relative">
              <Bike className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <select
                value={formData.openBikeParking || ''}
                onChange={(e) => onInputChange('openBikeParking', parseInt(e.target.value))}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white text-gray-900"
              >
                <option value="">Select</option>
                {[0, 1, 2, 3, 4, 5, 6].map((num) => (
                  <option key={num} value={num}>
                    {num} {num === 1 ? 'Spot' : 'Spots'}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Parking Summary */}
        <div className="mt-4 p-4 bg-gray-50 rounded-lg border">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <p className="text-sm text-gray-600">Total Car Parking</p>
              <p className="font-semibold text-gray-900">
                {((formData.coveredParking || 0) + (formData.openParking || 0))} spots
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Bike Parking</p>
              <p className="font-semibold text-gray-900">
                {((formData.coveredBikeParking || 0) + (formData.openBikeParking || 0))} spots
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Covered Parking</p>
              <p className="font-semibold text-gray-900">
                {((formData.coveredParking || 0) + (formData.coveredBikeParking || 0))} spots
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Open Parking</p>
              <p className="font-semibold text-gray-900">
                {((formData.openParking || 0) + (formData.openBikeParking || 0))} spots
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Furnishing and Amenities */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Furnishing Status */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Furnishing Status
          </label>
          <div className="space-y-3">
            {furnishingOptions.map((option) => (
              <label
                key={option.value}
                className="flex items-center gap-3 p-4 border border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 transition-colors"
              >
                <input
                  type="radio"
                  name="furnishing"
                  value={option.value}
                  checked={formData.furnishing === option.value}
                  onChange={(e) => onInputChange('furnishing', e.target.value)}
                  className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                />
                <div className="flex-1">
                  <div className="font-medium text-gray-900">{option.label}</div>
                  <div className="text-sm text-gray-600">{option.description}</div>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Flooring Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Flooring Type
          </label>
          <div className="grid grid-cols-2 gap-3">
            {flooringTypes.map((type) => {
              const IconComponent = type.icon;
              return (
                <label
                  key={type.value}
                  className="flex items-center gap-3 p-3 border border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 transition-colors"
                >
                  <input
                    type="radio"
                    name="flooring"
                    value={type.value}
                    checked={formData.flooring === type.value}
                    onChange={(e) => onInputChange('flooring', e.target.value)}
                    className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                  />
                  <IconComponent size={16} className="text-gray-600" />
                  <span className="text-sm font-medium text-gray-900">{type.label}</span>
                </label>
              );
            })}
          </div>
        </div>
      </div>

      {/* Utilities */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Zap className="text-blue-600" size={20} />
          Utilities & Infrastructure
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Water Supply */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Water Supply
            </label>
            <div className="space-y-2">
              {waterSupplyOptions.map((option) => (
                <label
                  key={option.value}
                  className="flex items-center gap-3 p-3 border border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 transition-colors"
                >
                  <input
                    type="radio"
                    name="waterSupply"
                    value={option.value}
                    checked={formData.waterSupply === option.value}
                    onChange={(e) => onInputChange('waterSupply', e.target.value)}
                    className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                  />
                  <Droplets size={16} className="text-blue-600" />
                  <span className="text-sm font-medium text-gray-900">{option.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Power Backup */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Power Backup
            </label>
            <div className="space-y-2">
              {powerBackupOptions.map((option) => (
                <label
                  key={option.value}
                  className="flex items-center gap-3 p-3 border border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 transition-colors"
                >
                  <input
                    type="radio"
                    name="powerBackup"
                    value={option.value}
                    checked={formData.powerBackup === option.value}
                    onChange={(e) => onInputChange('powerBackup', e.target.value)}
                    className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                  />
                  <Zap size={16} className="text-yellow-600" />
                  <span className="text-sm font-medium text-gray-900">{option.label}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Property Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Area Summary */}
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Layers className="text-blue-600" size={20} />
            </div>
            <div>
              <p className="text-sm text-blue-600 font-medium">Area</p>
              <p className="font-bold text-blue-900 text-sm">
                {builtUp || carpet || superBuiltUp ? `${Math.max(builtUp, carpet, superBuiltUp)} sq.ft` : 'Not set'}
              </p>
            </div>
          </div>
        </div>

        {/* Room Configuration */}
        <div className="bg-green-50 p-4 rounded-lg border border-green-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <Home className="text-green-600" size={20} />
            </div>
            <div>
              <p className="text-sm text-green-600 font-medium">Configuration</p>
              <p className="font-bold text-green-900 text-sm">
                {formData.bedrooms || 0}B/{formData.bathrooms || 0}Ba/{formData.balconies || 0}Bl
              </p>
            </div>
          </div>
        </div>

        {/* Parking */}
        <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-100 rounded-lg">
              <Car className="text-orange-600" size={20} />
            </div>
            <div>
              <p className="text-sm text-orange-600 font-medium">Parking</p>
              <p className="font-bold text-orange-900 text-sm">
                {((formData.coveredParking || 0) + (formData.openParking || 0))} cars
              </p>
            </div>
          </div>
        </div>

        {/* Furnishing */}
        <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <CheckCircle className="text-purple-600" size={20} />
            </div>
            <div>
              <p className="text-sm text-purple-600 font-medium">Furnishing</p>
              <p className="font-bold text-purple-900 text-sm">
                {furnishingOptions.find(f => f.value === formData.furnishing)?.label || 'Not set'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Additional Features */}
      <div className="bg-gray-50 p-6 rounded-lg border">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Additional Features</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Security Features */}
          <div>
            <h4 className="font-medium text-gray-900 mb-3">Security & Safety</h4>
            <div className="space-y-2">
              {[
                { key: 'gatedCommunity', label: 'Gated Community' },
                { key: 'security', label: '24/7 Security' },
                { key: 'cctv', label: 'CCTV Surveillance' },
                { key: 'fireSafety', label: 'Fire Safety' }
              ].map((feature) => (
                <label key={feature.key} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={!!formData[feature.key]}
                    onChange={(e) => onInputChange(feature.key, e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">{feature.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Additional Amenities */}
          <div>
            <h4 className="font-medium text-gray-900 mb-3">Amenities</h4>
            <div className="space-y-2">
              {[
                { key: 'lift', label: 'Lift/Elevator' },
                { key: 'park', label: 'Park/Garden' },
                { key: 'gym', label: 'Gym/Fitness Center' },
                { key: 'pool', label: 'Swimming Pool' },
                { key: 'parking', label: 'Parking Available' },
                { key: 'waterSupply', label: 'Regular Water Supply' }
              ].map((feature) => (
                <label key={feature.key} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={!!formData[feature.key]}
                    onChange={(e) => onInputChange(feature.key, e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">{feature.label}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Tips */}
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <div className="p-1 bg-amber-100 rounded">
            <Info className="text-amber-600" size={16} />
          </div>
          <div>
            <h4 className="font-semibold text-amber-800 mb-1">
              Property Details Tips
            </h4>
            <ul className="text-sm text-amber-700 space-y-1">
              <li>• Complete area details help tenants understand the space better</li>
              <li>• Accurate room configuration improves search ranking</li>
              <li>• Parking information is crucial for tenants with vehicles</li>
              <li>• Additional amenities can command higher rent/sale prices</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
