import React, { useContext, useState, useEffect } from 'react';
import { X, Plus, Minus, Scale, MapPin, BedDouble, Bath, Ruler, Home, Check, AlertTriangle, Search } from 'lucide-react';
import { AppContext } from '../../context/AppContext';
import PropertyCard from '../PropertyCard';
import { formatPrice, formatArea } from '../../utils/propertyHelpers';

export default function PropertyComparison() {
  const {
    comparedProperties,
    removeFromComparison,
    clearComparison,
    isInComparison,
    addToComparison,
    properties,
    API_BASE_URL
  } = useContext(AppContext);

  const [showComparison, setShowComparison] = useState(false);
  const [availableProperties, setAvailableProperties] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Filter available properties (not already in comparison)
  useEffect(() => {
    const filtered = properties.filter(
      prop => !comparedProperties.some(cp => cp.id === prop.id)
    );
    setAvailableProperties(filtered);
  }, [properties, comparedProperties, API_BASE_URL]);

  // Filter available properties based on search term
  const filteredAvailable = availableProperties.filter(prop =>
    prop.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    prop.type?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    prop.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleComparison = () => {
    setShowComparison(!showComparison);
  };

  const handleAddToComparison = (property) => {
    addToComparison(property);
    setShowAddModal(false);
  };

  const getComparisonFeatures = () => {
    if (comparedProperties.length === 0) return [];

    // Get all unique features from compared properties
    const allFeatures = new Set();

    comparedProperties.forEach(property => {
      if (property.bhk) allFeatures.add('BHK');
      if (property.area) allFeatures.add('Area');
      if (property.price) allFeatures.add('Price');
      if (property.location) allFeatures.add('Location');
      if (property.bathrooms) allFeatures.add('Bathrooms');
      if (property.furnishing) allFeatures.add('Furnishing');
      if (property.amenities) allFeatures.add('Amenities');
    });

    return Array.from(allFeatures);
  };

  const renderFeatureComparison = () => {
    const features = getComparisonFeatures();

    return (
      <div className="overflow-hidden">
        <table className="w-full table-fixed">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500 bg-gray-50 sticky left-0 z-10"></th>
              {comparedProperties.map((property, index) => (
                <th key={property.id} className="px-4 py-3 text-center text-sm font-medium text-gray-900 bg-white">
                  <div className="flex flex-col items-center">
                    <span className="text-xs text-gray-500">Property {index + 1}</span>
                    <button
                      onClick={() => removeFromComparison(property.id)}
                      className="mt-1 px-2 py-1 text-xs text-red-600 hover:text-red-800 hover:bg-red-50 rounded transition-colors"
                      title="Remove this property from comparison"
                    >
                      <div className="flex items-center gap-1">
                        <Minus size={14} />
                        <span>Remove</span>
                      </div>
                    </button>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {features.map((feature, featureIndex) => (
              <tr key={featureIndex} className="border-b border-gray-100">
                <td className="px-4 py-3 text-sm font-medium text-gray-900 bg-gray-50 sticky left-0 z-10">
                  {feature}
                </td>
                {comparedProperties.map((property) => (
                  <td key={`${property.id}-${feature}`} className="px-4 py-3 text-center text-sm text-gray-700 bg-white">
                    {renderFeatureValue(property, feature)}
                  </td>
                ))}
              </tr>
            ))}
            <tr>
              <td className="px-4 py-3 text-sm font-medium text-gray-900 bg-gray-50 sticky left-0 z-10">Actions</td>
              {comparedProperties.map((property) => (
                <td key={`actions-${property.id}`} className="px-4 py-3 text-center text-sm text-gray-700 bg-white">
                  <button
                    onClick={() => window.open(`/property/${property.id}`, '_blank')}
                    className="text-blue-600 hover:text-blue-800 text-sm"
                  >
                    View Details
                  </button>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    );
  };

  const renderFeatureValue = (property, feature) => {
    switch (feature) {
      case 'BHK':
        return property.bhk ? `${property.bhk} BHK` : '-';
      case 'Area':
        return property.area ? formatArea(property.area) : '-';
      case 'Price':
        return property.price ? formatPrice(property.price) : '-';
      case 'Location':
        return property.location ? (
          <div className="flex items-center justify-center gap-1">
            <MapPin size={14} className="text-gray-400" />
            <span className="text-xs">{property.location.split(',')[0]}</span>
          </div>
        ) : '-';
      case 'Bathrooms':
        return property.bathrooms ? `${property.bathrooms} Bath` : '-';
      case 'Furnishing':
        return property.furnishing || '-';
      case 'Amenities':
        return property.amenities ? (
          <div className="flex flex-wrap gap-1 justify-center">
            {property.amenities.slice(0, 2).map((amenity, i) => (
              <span key={i} className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                {amenity}
              </span>
            ))}
            {property.amenities?.length > 2 && (
              <span className="text-xs text-gray-500">+{property.amenities.length - 2} more</span>
            )}
          </div>
        ) : '-';
      default:
        return '-';
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* Comparison Button */}
      <button
        onClick={toggleComparison}
        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-full shadow-lg flex items-center gap-2 transition-all"
      >
        <Scale size={18} />
        <span>Compare ({comparedProperties.length}/4)</span>
      </button>

      {/* Comparison Panel */}
      {showComparison && (
        <div className="fixed bottom-20 right-4 w-[95vw] max-w-6xl max-h-[80vh] bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden">
          <div className="p-4 border-b border-gray-200 flex justify-between items-center">
            <h3 className="font-semibold text-gray-900">Property Comparison</h3>
            <button
              onClick={toggleComparison}
              className="text-gray-400 hover:text-gray-600"
            >
              <X size={18} />
            </button>
          </div>

          {comparedProperties.length === 0 ? (
            <div className="p-4 text-center">
              <AlertTriangle size={32} className="text-gray-400 mx-auto mb-2 flex-shrink-0" />
              <p className="text-gray-600 mb-4">No properties selected for comparison</p>
              <button
                onClick={() => setShowAddModal(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm"
              >
                <Plus size={16} className="inline mr-1" />
                Add Properties
              </button>
            </div>
          ) : (
            <div className="p-4 flex flex-col h-full">
              <div className="flex-1 overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <span className="text-sm text-gray-600">
                  {comparedProperties.length} properties selected
                </span>
                <button
                  onClick={clearComparison}
                  className="text-red-500 hover:text-red-700 text-sm flex items-center gap-1 px-2 py-1 hover:bg-red-50 rounded transition-colors"
                >
                  <X size={14} />
                  Clear All
                </button>
              </div>

              {comparedProperties.length < 4 && (
                <button
                  onClick={() => setShowAddModal(true)}
                  className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded-lg text-sm mb-4 flex items-center justify-center gap-1"
                >
                  <Plus size={16} />
                  Add More Properties
                </button>
              )}

                {renderFeatureComparison()}
              </div>
              
              <div className="mt-4 pt-4 border-t border-gray-200 flex-shrink-0">
                <button
                  onClick={() => setShowComparison(false)}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg text-sm"
                >
                  Close Comparison
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Add Property Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
            <div className="p-4 border-b border-gray-200 flex justify-between items-center">
              <h3 className="font-semibold text-gray-900">Add Properties to Compare</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-4">
              <div className="relative mb-4">
                <input
                  type="text"
                  placeholder="Search properties..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-4 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
                <Search size={18} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>

              {filteredAvailable.length === 0 ? (
                <div className="text-center py-8">
                  <Home size={48} className="text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-600">No properties available to add</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 overflow-y-auto max-h-[50vh]">
                  {filteredAvailable.slice(0, 10).map((property) => (
                    <div key={property.id} className="border border-gray-200 rounded-lg p-3">
                      <div className="flex items-center gap-3">
                        <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                          {property.images?.[0] ? (
                            <img
                              src={`${API_BASE_URL}/uploads/${property.images[0]}`}
                              alt={property.type}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.target.src = 'https://via.placeholder.com/64x64?text=No+Image';
                              }}
                            />
                          ) : (
                            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                              <Home size={20} className="text-gray-400" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-gray-900 truncate">
                            {property.bhk} BHK {property.type}
                          </h4>
                          <p className="text-sm text-gray-600 truncate">
                            {property.location?.split(',')[0]}
                          </p>
                          <p className="text-sm font-medium text-gray-900">
                            {formatPrice(property.price)}
                          </p>
                        </div>
                        <button
                          onClick={() => handleAddToComparison(property)}
                          disabled={isInComparison(property.id)}
                          className={`p-2 rounded-lg ${isInComparison(property.id) ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600 hover:bg-blue-200'}`}
                        >
                          {isInComparison(property.id) ? (
                            <Check size={16} />
                          ) : (
                            <Plus size={16} />
                          )}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}