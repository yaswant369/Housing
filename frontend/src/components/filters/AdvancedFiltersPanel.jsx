import React, { useState, useEffect } from 'react';
import { X, ChevronDown, ChevronUp, RotateCcw } from 'lucide-react';
import { useSearch } from '../../contexts/SearchContext';

const AMENITIES = [
  { id: 'swimming_pool', name: 'Swimming Pool', icon: '🏊' },
  { id: 'gym', name: 'Gym/Fitness Center', icon: '💪' },
  { id: 'parking', name: 'Parking', icon: '🅿️' },
  { id: 'lift', name: 'Lift', icon: '🛗' },
  { id: 'security', name: '24/7 Security', icon: '🔒' },
  { id: 'power_backup', name: 'Power Backup', icon: '🔋' },
  { id: 'cctv', name: 'CCTV', icon: '📹' },
  { id: 'garden', name: 'Garden', icon: '🌿' },
  { id: 'children_play_area', name: 'Children Play Area', icon: '🎮' },
  { id: 'club_house', name: 'Club House', icon: '🏢' },
  { id: 'water_supply', name: '24/7 Water Supply', icon: '🚿' },
  { id: 'gas_pipeline', name: 'Gas Pipeline', icon: '🔥' },
  { id: 'fire_safety', name: 'Fire Safety', icon: '🚒' },
  { id: 'rainwater_harvesting', name: 'Rainwater Harvesting', icon: '💧' },
  { id: 'solar_panels', name: 'Solar Panels', icon: '☀️' },
  { id: 'vaastu_compliant', name: 'Vaastu Compliant', icon: '🕉️' },
  { id: 'air_conditioning', name: 'Air Conditioning', icon: '❄️' },
  { id: 'internet_connectivity', name: 'Internet Connectivity', icon: '📶' },
  { id: 'wash_area', name: 'Wash Area', icon: '🧽' },
  { id: 'servant_room', name: 'Servant Room', icon: '👩‍💼' }
];

const FURNISHING_OPTIONS = [
  { id: 'unfurnished', name: 'Unfurnished', icon: '📦' },
  { id: 'semi_furnished', name: 'Semi-Furnished', icon: '🪑' },
  { id: 'fully_furnished', name: 'Fully Furnished', icon: '🏠' }
];

const CONSTRUCTION_STATUS_OPTIONS = [
  { id: 'ready_to_move', name: 'Ready to Move', icon: '✅' },
  { id: 'under_construction', name: 'Under Construction', icon: '🏗️' },
  { id: 'new_launch', name: 'New Launch', icon: '🚀' }
];

const SELLER_TYPES = [
  { id: 'owner', name: 'Owner', icon: '👤' },
  { id: 'broker', name: 'Broker', icon: '🤝' },
  { id: 'builder', name: 'Builder', icon: '🏗️' },
  { id: 'developer', name: 'Developer', icon: '🏢' }
];

const AVAILABILITY_OPTIONS = [
  { id: 'immediate', name: 'Immediate', icon: '⚡' },
  { id: '1_month', name: 'Within 1 Month', icon: '📅' },
  { id: '3_months', name: 'Within 3 Months', icon: '📅' },
  { id: '6_months', name: 'Within 6 Months', icon: '📅' }
];

const AREA_TYPES = [
  { id: 'carpet', name: 'Carpet Area', unit: 'sq ft' },
  { id: 'built_up', name: 'Built-up Area', unit: 'sq ft' },
  { id: 'super_built_up', name: 'Super Built-up Area', unit: 'sq ft' }
];

export default function AdvancedFiltersPanel({ isOpen, onClose }) {
  const {
    furnishing,
    constructionStatus,
    amenities,
    sellerTypes,
    availability,
    areaRange,
    setFurnishing,
    setConstructionStatus,
    setAmenities,
    setSellerTypes,
    setAvailability,
    setAreaRange,
    resetFilters
  } = useSearch();

  const [expandedSections, setExpandedSections] = useState({
    propertyDetails: true,
    budget: false,
    area: false,
    amenities: false,
    sellerPreferences: false,
    availability: false
  });

  const [localAreaRange, setLocalAreaRange] = useState(areaRange);

  // Update local state when context changes
  useEffect(() => {
    setLocalAreaRange(areaRange);
  }, [areaRange, furnishing, constructionStatus, amenities, sellerTypes, availability]);

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleAmenityToggle = (amenityId) => {
    const newAmenities = amenities.includes(amenityId)
      ? amenities.filter(id => id !== amenityId)
      : [...amenities, amenityId];
    setAmenities(newAmenities);
  };

  const handleFurnishingToggle = (furnishingId) => {
    const newFurnishing = furnishing.includes(furnishingId)
      ? furnishing.filter(id => id !== furnishingId)
      : [...furnishing, furnishingId];
    setFurnishing(newFurnishing);
  };

  const handleConstructionStatusToggle = (statusId) => {
    const newStatus = constructionStatus.includes(statusId)
      ? constructionStatus.filter(id => id !== statusId)
      : [...constructionStatus, statusId];
    setConstructionStatus(newStatus);
  };

  const handleSellerTypeToggle = (sellerId) => {
    const newSellerTypes = sellerTypes.includes(sellerId)
      ? sellerTypes.filter(id => id !== sellerId)
      : [...sellerTypes, sellerId];
    setSellerTypes(newSellerTypes);
  };

  const handleAvailabilityToggle = (availabilityId) => {
    const newAvailability = availability.includes(availabilityId)
      ? availability.filter(id => id !== availabilityId)
      : [...availability, availabilityId];
    setAvailability(newAvailability);
  };

  const handleAreaRangeChange = (field, value) => {
    const newRange = { ...localAreaRange, [field]: value };
    setLocalAreaRange(newRange);
    setAreaRange(newRange);
  };

  const handleReset = () => {
    // Reset all filter states
    resetFilters();
    
    // Reset local component state
    setLocalAreaRange({ min: null, max: null });
    
    // Reset expanded sections to default state
    setExpandedSections({
      propertyDetails: true,
      budget: false,
      area: false,
      amenities: false,
      sellerPreferences: false,
      availability: false
    });
    
    // Close the filter panel after reset
    onClose();
  };

  const FilterSection = ({ title, sectionKey, children, icon }) => (
    <div className="border-b border-gray-200 last:border-b-0">
      <button
        onClick={() => toggleSection(sectionKey)}
        className="w-full flex items-center justify-between p-3 text-left hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-2">
          <span className="text-base">{icon}</span>
          <h3 className="font-medium text-gray-900">{title}</h3>
        </div>
        {expandedSections[sectionKey] ? (
          <ChevronUp className="w-4 h-4 text-gray-400" />
        ) : (
          <ChevronDown className="w-4 h-4 text-gray-400" />
        )}
      </button>
      
      {expandedSections[sectionKey] && (
        <div className="px-3 pb-3">
          {children}
        </div>
      )}
    </div>
  );

  const CheckboxGrid = ({ options, selected, onToggle, columns = 2 }) => (
    <div className={`grid grid-cols-${columns} gap-2`}>
      {options.map((option) => (
        <label
          key={option.id}
          className="flex items-center gap-2 cursor-pointer p-2 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-colors"
        >
          <input
            type="checkbox"
            checked={selected.includes(option.id)}
            onChange={() => onToggle(option.id)}
            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <span className="text-base">{option.icon}</span>
          <span className="text-sm font-medium text-gray-700">{option.name}</span>
        </label>
      ))}
    </div>
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex justify-end">
      <div className="bg-white w-full max-w-md h-full overflow-y-auto pb-20 sm:pb-0 sm:h-auto sm:max-h-[90vh] sm:rounded-l-xl sm:shadow-xl">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-3 flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-900">Filters</h2>
          <div className="flex items-center gap-1">
            <button
              onClick={handleReset}
              className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              title="Reset All Filters"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Filter Sections */}
        <div className="flex-1">
          
          {/* Property Details */}
          <FilterSection
            title="Property Details"
            sectionKey="propertyDetails"
            icon="🏠"
          >
            <div className="space-y-4">
              {/* Furnishing */}
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Furnishing Status</h4>
                <CheckboxGrid
                  options={FURNISHING_OPTIONS}
                  selected={furnishing}
                  onToggle={handleFurnishingToggle}
                  columns={1}
                />
              </div>

              {/* Construction Status */}
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Construction Status</h4>
                <CheckboxGrid
                  options={CONSTRUCTION_STATUS_OPTIONS}
                  selected={constructionStatus}
                  onToggle={handleConstructionStatusToggle}
                  columns={1}
                />
              </div>
            </div>
          </FilterSection>

          {/* Budget */}
          <FilterSection
            title="Budget Range"
            sectionKey="budget"
            icon="💰"
          >
            <div className="space-y-4">
              <p className="text-sm text-gray-600">Use the search bar above for budget selection</p>
            </div>
          </FilterSection>

          {/* Area */}
          <FilterSection
            title="Area Filters"
            sectionKey="area"
            icon="📐"
          >
            <div className="space-y-3">
              {AREA_TYPES.map((areaType) => (
                <div key={areaType.id}>
                  <h4 className="font-medium text-gray-900 mb-1.5">{areaType.name}</h4>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      placeholder="Min"
                      value={localAreaRange[areaType.id]?.min || ''}
                      onChange={(e) => {
                        const newRange = { ...localAreaRange };
                        if (!newRange[areaType.id]) newRange[areaType.id] = { min: null, max: null };
                        newRange[areaType.id].min = e.target.value ? parseInt(e.target.value) : null;
                        setLocalAreaRange(newRange);
                        setAreaRange(newRange);
                      }}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <span className="self-center text-gray-500">to</span>
                    <input
                      type="number"
                      placeholder="Max"
                      value={localAreaRange[areaType.id]?.max || ''}
                      onChange={(e) => {
                        const newRange = { ...localAreaRange };
                        if (!newRange[areaType.id]) newRange[areaType.id] = { min: null, max: null };
                        newRange[areaType.id].max = e.target.value ? parseInt(e.target.value) : null;
                        setLocalAreaRange(newRange);
                        setAreaRange(newRange);
                      }}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <span className="self-center text-gray-500 text-sm">{areaType.unit}</span>
                  </div>
                </div>
              ))}
            </div>
          </FilterSection>

          {/* Amenities */}
          <FilterSection
            title="Amenities"
            sectionKey="amenities"
            icon="⭐"
          >
            <CheckboxGrid
              options={AMENITIES}
              selected={amenities}
              onToggle={handleAmenityToggle}
              columns={1}
            />
          </FilterSection>

          {/* Seller Preferences */}
          <FilterSection
            title="Preferred Sellers"
            sectionKey="sellerPreferences"
            icon="👥"
          >
            <CheckboxGrid
              options={SELLER_TYPES}
              selected={sellerTypes}
              onToggle={handleSellerTypeToggle}
              columns={2}
            />
          </FilterSection>

          {/* Availability */}
          <FilterSection
            title="Availability"
            sectionKey="availability"
            icon="📅"
          >
            <CheckboxGrid
              options={AVAILABILITY_OPTIONS}
              selected={availability}
              onToggle={handleAvailabilityToggle}
              columns={1}
            />
          </FilterSection>

        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white border-t border-gray-200 p-3">
          <button
            onClick={onClose}
            className="w-full bg-blue-600 text-white py-2.5 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Apply Filters
          </button>
        </div>
      </div>
    </div>
  );
}
