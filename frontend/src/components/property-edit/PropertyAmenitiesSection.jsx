import React from 'react';
import {
  Home,
  Building,
  ChefHat,
  Shirt,
  AirVent,
  Thermometer,
  Wind,
  Lightbulb,
  ArrowUp,
  Shield,
  Video,
  Dumbbell,
  Waves,
  Home as Clubhouse,
  TreePine,
  Gamepad2,
  Car,
  Package,
  CheckCircle,
  Plus
} from 'lucide-react';

const PropertyAmenitiesSection = ({ property, formData, onInputChange }) => {
  const insideHouseAmenities = [
    { id: 'modularKitchen', label: 'Modular Kitchen', icon: ChefHat, category: 'kitchen' },
    { id: 'wardrobes', label: 'Built-in Wardrobes', icon: Shirt, category: 'storage' },
    { id: 'airConditioner', label: 'Air Conditioner', icon: AirVent, category: 'climate' },
    { id: 'geyser', label: 'Geyser', icon: Thermometer, category: 'utilities' },
    { id: 'chimney', label: 'Chimney', icon: Wind, category: 'kitchen' },
    { id: 'ceilingFans', label: 'Ceiling Fans', icon: Wind, category: 'utilities' },
    { id: 'lighting', label: 'Adequate Lighting', icon: Lightbulb, category: 'utilities' },
    { id: 'intercom', label: 'Intercom', icon: Plus, category: 'security' },
    { id: 'internet', label: 'High-speed Internet', icon: Plus, category: 'connectivity' },
    { id: 'cableTV', label: 'Cable TV Connection', icon: Plus, category: 'entertainment' }
  ];

  const buildingAmenities = [
    { id: 'lift', label: 'Lift/Elevator', icon: ArrowUp, category: 'accessibility' },
    { id: 'securityGuard', label: '24/7 Security Guard', icon: Shield, category: 'security' },
    { id: 'cctv', label: 'CCTV Surveillance', icon: Video, category: 'security' },
    { id: 'gym', label: 'Gym/Fitness Center', icon: Dumbbell, category: 'recreation' },
    { id: 'swimmingPool', label: 'Swimming Pool', icon: Waves, category: 'recreation' },
    { id: 'clubhouse', label: 'Clubhouse', icon: Clubhouse, category: 'recreation' },
    { id: 'park', label: 'Park/Garden', icon: TreePine, category: 'outdoor' },
    { id: 'childrenPlayArea', label: "Children's Play Area", icon: Gamepad2, category: 'family' },
    { id: 'visitorParking', label: 'Visitor Parking', icon: Car, category: 'parking' },
    { id: 'powerBackup', label: 'Power Backup', icon: Plus, category: 'utilities' },
    { id: 'waterSupply', label: '24/7 Water Supply', icon: Plus, category: 'utilities' },
    { id: 'storeRoom', label: 'Store Room', icon: Package, category: 'storage' }
  ];

  const handleAmenityChange = (amenityId, checked) => {
    const currentAmenities = formData.amenities || [];
    if (checked) {
      onInputChange('amenities', [...currentAmenities, amenityId]);
    } else {
      onInputChange('amenities', currentAmenities.filter(id => id !== amenityId));
    }
  };

  const isAmenitySelected = (amenityId) => {
    return formData.amenities?.includes(amenityId) || false;
  };

  const getSelectedCount = (amenitiesList) => {
    return amenitiesList.filter(amenity => isAmenitySelected(amenity.id)).length;
  };

  const renderAmenityGrid = (amenities, title, bgColor) => {
    return (
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
            <Building className={bgColor} size={20} />
            {title}
          </h4>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            {getSelectedCount(amenities)} of {amenities.length} selected
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {amenities.map((amenity) => {
            const IconComponent = amenity.icon;
            const isSelected = isAmenitySelected(amenity.id);
            
            return (
              <button
                key={amenity.id}
                type="button"
                onClick={() => handleAmenityChange(amenity.id, !isSelected)}
                className={`p-4 rounded-lg border-2 transition-all duration-200 text-left ${
                  isSelected
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 shadow-md'
                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 hover:shadow-sm'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-lg ${
                    isSelected 
                      ? 'bg-blue-100 dark:bg-blue-800' 
                      : 'bg-gray-100 dark:bg-gray-700'
                  }`}>
                    <IconComponent 
                      size={20} 
                      className={isSelected ? 'text-blue-600' : 'text-gray-600 dark:text-gray-400'} 
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h5 className={`font-medium text-sm ${
                      isSelected 
                        ? 'text-blue-900 dark:text-blue-100' 
                        : 'text-gray-900 dark:text-gray-100'
                    }`}>
                      {amenity.label}
                    </h5>
                    {isSelected && (
                      <div className="flex items-center gap-1 mt-1">
                        <CheckCircle size={12} className="text-blue-600" />
                        <span className="text-xs text-blue-600">Selected</span>
                      </div>
                    )}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  const totalInsideAmenities = insideHouseAmenities.length;
  const totalBuildingAmenities = buildingAmenities.length;
  const selectedInsideAmenities = getSelectedCount(insideHouseAmenities);
  const selectedBuildingAmenities = getSelectedCount(buildingAmenities);
  const totalSelected = selectedInsideAmenities + selectedBuildingAmenities;
  const totalPossible = totalInsideAmenities + totalBuildingAmenities;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
          <Home className="text-blue-600" size={24} />
          Amenities & Features
        </h2>
        <div className="text-sm text-gray-500 dark:text-gray-400">
          Section 6 of 9
        </div>
      </div>

      {/* Selection Summary */}
      <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">
          Amenities Summary
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-3 bg-white dark:bg-gray-800 rounded-lg border">
            <p className="text-2xl font-bold text-blue-600">{totalSelected}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Total Selected</p>
          </div>
          <div className="text-center p-3 bg-white dark:bg-gray-800 rounded-lg border">
            <p className="text-2xl font-bold text-green-600">{selectedInsideAmenities}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Inside House</p>
          </div>
          <div className="text-center p-3 bg-white dark:bg-gray-800 rounded-lg border">
            <p className="text-2xl font-bold text-purple-600">{selectedBuildingAmenities}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Building/Society</p>
          </div>
        </div>
        <div className="mt-3">
          <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400 mb-1">
            <span>Overall Completion</span>
            <span>{Math.round((totalSelected / totalPossible) * 100)}%</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(totalSelected / totalPossible) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Inside House Amenities */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-6 flex items-center gap-2">
          <Home className="text-green-600" size={20} />
          Inside Your House
        </h3>
        
        {/* Quick Grid View */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-md font-medium text-gray-800 dark:text-gray-200">Quick Selection</h4>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => {
                  const allSelected = insideHouseAmenities.every(amenity => isAmenitySelected(amenity.id));
                  if (allSelected) {
                    // Deselect all
                    onInputChange('amenities', formData.amenities?.filter(id => 
                      !insideHouseAmenities.some(amenity => amenity.id === id)
                    ) || []);
                  } else {
                    // Select all
                    const currentAmenities = formData.amenities || [];
                    const newAmenities = [...currentAmenities];
                    insideHouseAmenities.forEach(amenity => {
                      if (!newAmenities.includes(amenity.id)) {
                        newAmenities.push(amenity.id);
                      }
                    });
                    onInputChange('amenities', newAmenities);
                  }
                }}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                {insideHouseAmenities.every(amenity => isAmenitySelected(amenity.id)) ? 'Deselect All' : 'Select All'}
              </button>
            </div>
          </div>
          {renderAmenityGrid(insideHouseAmenities, '', 'text-green-600')}
        </div>
      </div>

      {/* Building/Society Amenities */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-6 flex items-center gap-2">
          <Building className="text-purple-600" size={20} />
          Building & Society Facilities
        </h3>
        
        {/* Quick Grid View */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-md font-medium text-gray-800 dark:text-gray-200">Quick Selection</h4>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => {
                  const allSelected = buildingAmenities.every(amenity => isAmenitySelected(amenity.id));
                  if (allSelected) {
                    // Deselect all
                    onInputChange('amenities', formData.amenities?.filter(id => 
                      !buildingAmenities.some(amenity => amenity.id === id)
                    ) || []);
                  } else {
                    // Select all
                    const currentAmenities = formData.amenities || [];
                    const newAmenities = [...currentAmenities];
                    buildingAmenities.forEach(amenity => {
                      if (!newAmenities.includes(amenity.id)) {
                        newAmenities.push(amenity.id);
                      }
                    });
                    onInputChange('amenities', newAmenities);
                  }
                }}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                {buildingAmenities.every(amenity => isAmenitySelected(amenity.id)) ? 'Deselect All' : 'Select All'}
              </button>
            </div>
          </div>
          {renderAmenityGrid(buildingAmenities, '', 'text-purple-600')}
        </div>
      </div>

      {/* Tips */}
      <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <div className="p-1 bg-amber-100 dark:bg-amber-800 rounded">
            <CheckCircle className="text-amber-600" size={16} />
          </div>
          <div>
            <h4 className="font-semibold text-amber-800 dark:text-amber-200 mb-1">
              Amenities Selection Tips
            </h4>
            <ul className="text-sm text-amber-700 dark:text-amber-300 space-y-1">
              <li>• More amenities typically increase property value and tenant interest</li>
              <li>• Select only amenities that are actually available</li>
              <li>• Inside house amenities are crucial for immediate rental decisions</li>
              <li>• Building amenities attract long-term tenants and families</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyAmenitiesSection;