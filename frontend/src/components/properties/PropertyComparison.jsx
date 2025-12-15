import React from 'react';
import { X, Bed, Bath, Maximize, MapPin, Star, CheckCircle, Trash2 } from 'lucide-react';
import { formatPrice } from '../../utils/propertyHelpers';

const COMPARISON_FIELDS = [
  { key: 'price', label: 'Price', format: 'price' },
  { key: 'bhk', label: 'BHK', format: 'number' },
  { key: 'bathrooms', label: 'Bathrooms', format: 'number' },
  { key: 'area', label: 'Area', format: 'area' },
  { key: 'propertyType', label: 'Property Type', format: 'text' },
  { key: 'location', label: 'Location', format: 'text' },
  { key: 'furnishing', label: 'Furnishing', format: 'text' },
  { key: 'constructionStatus', label: 'Construction Status', format: 'text' },
  { key: 'amenities', label: 'Amenities', format: 'amenities' },
  { key: 'isVerified', label: 'Verified', format: 'boolean' },
  { key: 'isFeatured', label: 'Featured', format: 'boolean' }
];

const AMENITY_ICONS = {
  'swimming_pool': '🏊',
  'gym': '💪',
  'parking': '🅿️',
  'lift': '🛗',
  'security': '🔒',
  'power_backup': '🔋',
  'cctv': '📹',
  'garden': '🌿',
  'children_play_area': '🎮',
  'club_house': '🏢',
  'water_supply': '🚿',
  'air_conditioning': '❄️'
};

export default function PropertyComparison({ properties, onClose, onClear }) {
  // Ensure properties is always an array
  const validProperties = Array.isArray(properties) ? properties : [];
  
  // Early return if no valid properties
  if (validProperties.length === 0) {
    return (
      <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
        <div className="bg-white rounded-2xl p-8 max-w-md mx-4">
          <div className="text-center">
            <div className="text-gray-400 text-6xl mb-4">⚖️</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No Properties to Compare
            </h3>
            <p className="text-gray-600 mb-4">
              Add properties to comparison by clicking the scale icon on property cards.
            </p>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }


  // Format area
  const formatArea = (area) => {
    if (!area) return 'N/A';
    if (typeof area === 'string') return area;
    return `${area} sq ft`;
  };

  // Format field value
  const formatFieldValue = (value, format) => {
    switch (format) {
      case 'price':
        return formatPrice(value);
      case 'area':
        return formatArea(value);
      case 'number':
        return value || 'N/A';
      case 'boolean':
        return value ? (
          <CheckCircle className="w-5 h-5 text-green-500 mx-auto" />
        ) : (
          <span className="text-gray-400">-</span>
        );
      case 'amenities':
        if (!value || value.length === 0) return 'None';
        return (
          <div className="flex flex-wrap gap-1">
            {value.slice(0, 3).map((amenity) => (
              <span
                key={amenity}
                className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded"
              >
                <span>{AMENITY_ICONS[amenity] || '•'}</span>
                {amenity.replace('_', ' ')}
              </span>
            ))}
            {value.length > 3 && (
              <span className="text-xs text-gray-500 px-1">
                +{value.length - 3} more
              </span>
            )}
          </div>
        );
      default:
        return value || 'N/A';
    }
  };

  // Get image source
  const getImageSrc = (image) => {
    if (!image) return null;
    if (typeof image === 'string') return image;
    return image.medium || image.thumbnail || image.optimized || image.url;
  };

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 overflow-y-auto">
      <div className="min-h-screen py-8">
        <div className="max-w-7xl mx-auto px-4">
          
          {/* Header */}
          <div className="bg-white rounded-t-2xl p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Property Comparison
                </h2>
                <p className="text-gray-600 mt-1">
                  Comparing {validProperties.length} properties
                </p>
              </div>
              
              <div className="flex items-center gap-3">
                <button
                  onClick={onClear}
                  className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  Clear All
                </button>
                
                <button
                  onClick={onClose}
                  className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>
          </div>

          {/* Comparison Table */}
          <div className="bg-white rounded-b-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                
                {/* Property Headers */}
                <thead className="bg-gray-50">
                  <tr>
                    <th className="w-48 p-4 text-left text-sm font-medium text-gray-700 sticky left-0 bg-gray-50 z-10">
                      Features
                    </th>
                    {validProperties.map((property) => (
                      <th key={property.id} className="p-4 text-center min-w-80">
                        <div className="space-y-3">
                          
                          {/* Property Image */}
                          <div className="relative">
                            <img
                              src={getImageSrc(property.images?.[0]) || 'https://via.placeholder.com/300x200'}
                              alt={`${property.bhk} BHK ${property.propertyType}`}
                              className="w-full h-32 object-cover rounded-lg"
                            />
                            {property.isVerified && (
                              <div className="absolute top-2 right-2">
                                <CheckCircle className="w-5 h-5 text-green-500" />
                              </div>
                            )}
                            {property.isFeatured && (
                              <div className="absolute top-2 left-2">
                                <Star className="w-5 h-5 text-yellow-500" />
                              </div>
                            )}
                          </div>

                          {/* Property Info */}
                          <div>
                            <h3 className="font-semibold text-gray-900 text-sm">
                              {property.bhk} BHK {property.propertyType}
                            </h3>
                            <div className="flex items-center gap-1 text-gray-600 text-xs mt-1">
                              <MapPin className="w-3 h-3" />
                              <span className="truncate">{property.location}</span>
                            </div>
                            <div className="font-bold text-lg text-blue-600 mt-1">
                              {formatPrice(property.price, null, property.priceValue)}
                            </div>
                          </div>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>

                {/* Comparison Rows */}
                <tbody>
                  {COMPARISON_FIELDS.map((field, index) => (
                    <tr key={field.key} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                      
                      {/* Field Label */}
                      <td className="p-4 font-medium text-gray-900 sticky left-0 bg-inherit z-10 border-r border-gray-200">
                        {field.label}
                      </td>

                      {/* Field Values */}
                      {validProperties.map((property) => (
                        <td key={property.id} className="p-4 text-center">
                          <div className="flex items-center justify-center">
                            {formatFieldValue(property[field.key], field.format)}
                          </div>
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Quick Stats Row */}
            <div className="bg-blue-50 p-4 border-t border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                
                {/* Price Comparison */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Price Range</h4>
                  <div className="text-sm text-gray-600">
                    {formatPrice(Math.min(...validProperties.map(p => p.price)), null, Math.min(...validProperties.map(p => p.priceValue))) === 'Price on request' ? 'Price on request' : `${formatPrice(Math.min(...validProperties.map(p => p.price)), null, Math.min(...validProperties.map(p => p.priceValue)))} - ${formatPrice(Math.max(...validProperties.map(p => p.price)), null, Math.max(...validProperties.map(p => p.priceValue)))}`}
                  </div>
                </div>

                {/* Area Comparison */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Area Range</h4>
                  <div className="text-sm text-gray-600">
                    {formatArea(Math.min(...validProperties.map(p => parseInt(p.area) || 0)))} - {formatArea(Math.max(...validProperties.map(p => parseInt(p.area) || 0)))}
                  </div>
                </div>

                {/* BHK Comparison */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">BHK Range</h4>
                  <div className="text-sm text-gray-600">
                    {Math.min(...validProperties.map(p => p.bhk))} - {Math.max(...validProperties.map(p => p.bhk))} BHK
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="p-6 border-t border-gray-200 bg-gray-50 rounded-b-2xl">
              <div className="flex flex-wrap gap-3 justify-center">
                {validProperties.map((property) => (
                  <button
                    key={property.id}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                    onClick={() => {
                      // Navigate to property detail
                      console.log('View property:', property.id);
                    }}
                  >
                    View {property.bhk} BHK Details
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
