import React, { useState, useEffect, useRef } from 'react';
import { Search, MapPin, X, ChevronDown, SlidersHorizontal, Home, Building, Landmark, Hotel, Factory, Warehouse, Store, Bed, IndianRupee, Check, Clock, User, Navigation, Target, Loader2 } from 'lucide-react';
import { useSearch } from '../../contexts/SearchContext';
import { useNavigate } from 'react-router-dom';
import { locationService, LOCATION_SERVICE_CONFIG } from '../../services/locationService';

const PROPERTY_TYPES = [
  { id: 'apartment', name: 'Flat/Apartment', icon: <Home size={16} /> },
  { id: 'villa', name: 'Independent House/Villa', icon: <Home size={16} /> },
  { id: 'house', name: 'House', icon: <Home size={16} /> },
  { id: 'plot', name: 'Residential Land', icon: <Landmark size={16} /> },
  { id: 'office', name: 'Office', icon: <Building size={16} /> },
  { id: 'shop', name: 'Shop', icon: <Store size={16} /> },
  { id: 'warehouse', name: 'Warehouse', icon: <Warehouse size={16} /> },
  { id: 'studio', name: '1 RK/ Studio Apartment', icon: <Hotel size={16} /> },
  { id: 'farmhouse', name: 'Farm House', icon: <Landmark size={16} /> },
  { id: 'serviced', name: 'Serviced Apartments', icon: <Hotel size={16} /> },
  { id: 'other', name: 'Other', icon: <Building size={16} /> }
];

const BHK_OPTIONS = [
  { id: '1', label: '1 BHK' },
  { id: '2', label: '2 BHK' },
  { id: '3', label: '3 BHK' },
  { id: '4', label: '4 BHK' },
  { id: '5', label: '5+ BHK' }
];

const BUDGET_RANGES = [
  { id: '0-25l', label: 'Under ₹25L', min: 0, max: 2500000 },
  { id: '25l-50l', label: '₹25L - ₹50L', min: 2500000, max: 5000000 },
  { id: '50l-1cr', label: '₹50L - ₹1Cr', min: 5000000, max: 10000000 },
  { id: '1cr-2cr', label: '₹1Cr - ₹2Cr', min: 10000000, max: 20000000 },
  { id: '2cr+', label: 'Above ₹2Cr', min: 20000000, max: null }
];

const CONSTRUCTION_STATUS = [
  { id: 'ready', label: 'Ready to Move', icon: <Check size={16} /> },
  { id: 'under', label: 'Under Construction', icon: <Clock size={16} /> }
];

const POSTED_BY = [
  { id: 'owner', label: 'Owner', icon: <User size={16} /> },
  { id: 'broker', label: 'Broker', icon: <User size={16} /> },
  { id: 'builder', label: 'Builder', icon: <User size={16} /> }
];

const LISTING_TYPES = [
  { id: 'buy', label: 'Buy', color: 'bg-blue-500' },
  { id: 'rent', label: 'Rent', color: 'bg-green-500' },
  { id: 'commercial', label: 'Commercial', color: 'bg-purple-500' },
  { id: 'pg', label: 'PG', color: 'bg-orange-500' }
];

// Mock location data for autocomplete
const MOCK_LOCATIONS = [
  'Mumbai, Maharashtra',
  'Delhi, New Delhi',
  'Bangalore, Karnataka',
  'Chennai, Tamil Nadu',
  'Kolkata, West Bengal',
  'Hyderabad, Telangana',
  'Pune, Maharashtra',
  'Ahmedabad, Gujarat',
  'Jaipur, Rajasthan',
  'Surat, Gujarat',
  'Lucknow, Uttar Pradesh',
  'Kanpur, Uttar Pradesh',
  'Nagpur, Maharashtra',
  'Visakhapatnam, Andhra Pradesh',
  'Indore, Madhya Pradesh',
  'Thane, Maharashtra',
  'Bhopal, Madhya Pradesh',
  'Pimpri-Chinchwad, Maharashtra',
  'Patna, Bihar',
  'Vadodara, Gujarat',
  'Nellore, Andhra Pradesh',
  'Vijayawada, Andhra Pradesh',
  'Tirupati, Andhra Pradesh',
  'Guntur, Andhra Pradesh',
  'Kakinada, Andhra Pradesh',
  'Rajahmundry, Andhra Pradesh'
];

export default function AdvancedSearchBar({ onToggleFilters, showFilters }) {
  const {
    searchQuery,
    location,
    userLocation,
    searchRadius,
    useCurrentLocation,
    locationLoading,
    locationError,
    listingType,
    propertyTypes,
    bhkTypes,
    priceRange,
    constructionStatus,
    sellerTypes,
    setSearchQuery,
    setLocation,
    setUserLocation,
    setSearchRadius,
    setUseCurrentLocation,
    setLocationLoading,
    setLocationError,
    setListingType,
    setPropertyTypes,
    setBHKTypes,
    setPriceRange,
    setConstructionStatus,
    setSellerTypes,
    hasActiveFilters,
    activeFiltersCount
  } = useSearch();

  const navigate = useNavigate();

  const [locationQuery, setLocationQuery] = useState(location);
  const [searchInput, setSearchInput] = useState(searchQuery);
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);
  const [showPropertyTypeDropdown, setShowPropertyTypeDropdown] = useState(false);
  const [showBudgetDropdown, setShowBudgetDropdown] = useState(false);
  const [showConstructionStatusDropdown, setShowConstructionStatusDropdown] = useState(false);
  const [showPostedByDropdown, setShowPostedByDropdown] = useState(false);
  const [showRadiusDropdown, setShowRadiusDropdown] = useState(false);
  const [filteredLocations, setFilteredLocations] = useState([]);
  const locationRef = useRef(null);

  // Filter locations based on query
  useEffect(() => {
    if (locationQuery.length > 0) {
      const filtered = MOCK_LOCATIONS.filter(loc =>
        loc.toLowerCase().includes(locationQuery.toLowerCase())
      );
      setFilteredLocations(filtered);
      setShowLocationDropdown(true);
    } else {
      setFilteredLocations([]);
      setShowLocationDropdown(false);
    }
  }, [locationQuery]);

  // Handle location selection
  const handleLocationSelect = (selectedLocation) => {
    setLocationQuery(selectedLocation);
    setLocation(selectedLocation);
    setUseCurrentLocation(false); // Disable current location when manual location is selected
    setShowLocationDropdown(false);
  };

  // Enhanced near me search functionality
  const handleNearMeSearch = async () => {
    if (!locationService.isLocationServiceAvailable()) {
      setLocationError('Geolocation is not supported by this browser');
      return;
    }

    setLocationLoading(true);
    setLocationError(null);

    try {
      const locationData = await locationService.getCurrentLocation();
      
      // Update context with location data
      setUserLocation({
        latitude: locationData.latitude,
        longitude: locationData.longitude,
        address: locationData.address,
        formattedAddress: locationData.formattedAddress,
        accuracy: locationData.accuracy
      });

      // Clear manual location when using current location
      setLocationQuery('');
      setLocation('');
      setUseCurrentLocation(true);

      // Show success message or auto-search
      console.log('Location found:', locationData.formattedAddress);
      
    } catch (error) {
      console.error('Location error:', error);
      setLocationError(error.message);
    } finally {
      setLocationLoading(false);
    }
  };

  // Handle radius selection
  const handleRadiusSelect = (radiusValue) => {
    setSearchRadius(radiusValue);
    setShowRadiusDropdown(false);
  };

  // Handle property type toggle
  const handlePropertyTypeToggle = (typeId) => {
    const newTypes = propertyTypes.includes(typeId)
      ? propertyTypes.filter(id => id !== typeId)
      : [...propertyTypes, typeId];
    setPropertyTypes(newTypes);
  };

  // Handle BHK selection
  const handleBHKSelect = (bhkId) => {
    const newBHKs = bhkTypes.includes(bhkId)
      ? bhkTypes.filter(id => id !== bhkId)
      : [bhkId]; // Single selection for BHK
    setBHKTypes(newBHKs);
  };

  // Handle budget selection
  const handleBudgetSelect = (range) => {
    setPriceRange({
      min: range.min,
      max: range.max,
      predefined: range.id
    });
    setShowBudgetDropdown(false);
  };

  // Clear search
  const clearSearch = () => {
    setSearchQuery('');
    setSearchInput('');
    setLocationQuery('');
    setLocation('');
    setUseCurrentLocation(false);
    setUserLocation({
      latitude: null,
      longitude: null,
      address: '',
      formattedAddress: '',
      accuracy: null
    });
    setPropertyTypes([]);
    setBHKTypes([]);
    setPriceRange({ min: null, max: null, predefined: null });
  };

  // Handle search submit
  const handleSearch = (e) => {
    e.preventDefault();
    // Update location in context
    setLocation(locationQuery);
    setSearchQuery(searchInput);
    
    // Build URL with search parameters similar to 99acres format
    const params = new URLSearchParams();
    if (searchInput) params.append('keyword', searchInput);
    if (locationQuery) params.append('location', locationQuery);
    if (useCurrentLocation && userLocation.latitude) {
      params.append('lat', userLocation.latitude.toString());
      params.append('lng', userLocation.longitude.toString());
      params.append('radius', searchRadius.toString());
      params.append('nearMe', 'true');
    }
    if (listingType) params.append('preference', listingType === 'buy' ? 'S' : 'R');
    if (propertyTypes.length > 0) {
      propertyTypes.forEach(type => params.append('propertyType', type));
    }
    if (bhkTypes.length > 0) {
      bhkTypes.forEach(bhk => params.append('bhk', bhk));
    }
    if (priceRange.predefined) params.append('budget', priceRange.predefined);
    if (constructionStatus.length > 0) {
      constructionStatus.forEach(status => params.append('constructionStatus', status));
    }
    if (sellerTypes.length > 0) {
      sellerTypes.forEach(type => params.append('postedBy', type));
    }
    
    // Navigate to search results page with all parameters
    const propertyTypeParam = propertyTypes.length > 0 ? propertyTypes[0] : 'Residential';
    navigate(`/search-results/${propertyTypeParam}?${params.toString()}`);
  };

  // Get current radius label
  const getCurrentRadiusLabel = () => {
    const radius = LOCATION_SERVICE_CONFIG.RADIUS_OPTIONS.find(r => r.value === searchRadius);
    return radius ? radius.label : '10 km';
  };

  return (
    <div className="bg-white shadow-lg rounded-2xl border border-gray-100 overflow-hidden">
      {/* Main Search Bar */}
      <form onSubmit={handleSearch} className="p-4">
        <div className="flex flex-col lg:flex-row gap-4">
          
          {/* Location Input */}
          <div className="flex-1 relative" ref={locationRef}>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Enter location, city, or locality"
                value={locationQuery}
                onChange={(e) => setLocationQuery(e.target.value)}
                onFocus={() => setShowLocationDropdown(true)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700 placeholder-gray-400"
                disabled={useCurrentLocation && userLocation.latitude}
              />
              {locationQuery && (
                <button
                  type="button"
                  onClick={() => handleLocationSelect('')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
            
            {/* Location Dropdown */}
            {showLocationDropdown && filteredLocations.length > 0 && (
              <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg max-h-60 overflow-y-auto">
                {filteredLocations.map((loc, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => handleLocationSelect(loc)}
                    className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center gap-3 first:rounded-t-xl last:rounded-b-xl"
                  >
                    <MapPin className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-700">{loc}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Search Button */}
          <button
            type="submit"
            className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-8 py-3 rounded-xl font-semibold transition-all duration-200 flex items-center gap-2 shadow-md hover:shadow-lg"
          >
            <Search className="w-5 h-5" />
            Search
          </button>
        </div>
        
        {/* Quick Action Buttons */}
        <div className="flex gap-2 mt-4">
          <button
            type="button"
            onClick={handleNearMeSearch}
            disabled={locationLoading}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gray-50 hover:bg-gray-100 rounded-xl text-sm font-medium text-gray-700 transition-colors border border-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {locationLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Navigation className="w-4 h-4" />
            )}
            <span>{locationLoading ? 'Getting Location...' : 'Near Me'}</span>
            {userLocation.latitude && (
              <span className="text-xs text-blue-600">
                {userLocation.formattedAddress.split(',')[0]}
              </span>
            )}
          </button>
          
          {/* Radius Selector (when current location is active) */}
          {useCurrentLocation && userLocation.latitude && (
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowRadiusDropdown(!showRadiusDropdown)}
                className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-50 hover:bg-blue-100 rounded-xl text-sm font-medium text-blue-700 transition-colors border border-blue-200"
              >
                <Target className="w-4 h-4" />
                <span>{getCurrentRadiusLabel()}</span>
                <ChevronDown className="w-4 h-4" />
              </button>
              
              {showRadiusDropdown && (
                <div className="absolute z-50 mt-1 w-32 bg-white border border-gray-200 rounded-xl shadow-lg">
                  <div className="p-2">
                    {LOCATION_SERVICE_CONFIG.RADIUS_OPTIONS.map((radius) => (
                      <button
                        key={radius.id}
                        type="button"
                        onClick={() => handleRadiusSelect(radius.value)}
                        className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                          searchRadius === radius.value
                            ? 'bg-blue-50 text-blue-700'
                            : 'hover:bg-gray-50'
                        }`}
                      >
                        {radius.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
        
        {/* Location Error Display */}
        {locationError && (
          <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-red-600" />
              <span className="text-sm text-red-700">{locationError}</span>
            </div>
          </div>
        )}
        
        {/* Current Location Info */}
        {useCurrentLocation && userLocation.latitude && (
          <div className="mt-2 p-3 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Navigation className="w-4 h-4 text-green-600" />
                <span className="text-sm text-green-700">
                  Searching near: {userLocation.formattedAddress}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setUseCurrentLocation(false)}
                className="text-green-600 hover:text-green-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </form>

      {/* Filter Tabs and Options */}
      <div className="border-t border-gray-100">
        {/* Listing Type Tabs */}
        <div className="p-4 border-b border-gray-50">
          <div className="flex flex-wrap gap-2">
            {LISTING_TYPES.map((type) => (
              <button
                key={type.id}
                onClick={() => setListingType(type.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                  listingType === type.id
                    ? `${type.color} text-white shadow-md`
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {type.label}
              </button>
            ))}
          </div>
        </div>

        {/* Quick Filters Row */}
        <div className="p-4">
          <div className="flex flex-wrap gap-4 items-center">
            
            {/* Property Type Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowPropertyTypeDropdown(!showPropertyTypeDropdown)}
                className="flex items-center gap-2 px-4 py-2 bg-gray-50 hover:bg-gray-100 rounded-lg text-sm font-medium text-gray-700 transition-colors"
              >
                Property Type
                <ChevronDown className="w-4 h-4" />
                {propertyTypes.length > 0 && (
                  <span className="bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {propertyTypes.length}
                  </span>
                )}
              </button>
              
              {showPropertyTypeDropdown && (
                <div className="absolute z-50 mt-1 w-64 bg-white border border-gray-200 rounded-xl shadow-lg">
                  <div className="p-3">
                    <div className="grid grid-cols-2 gap-2">
                      {PROPERTY_TYPES.map((type) => (
                        <label key={type.id} className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={propertyTypes.includes(type.id)}
                            onChange={() => handlePropertyTypeToggle(type.id)}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                          <span className="text-lg">{type.icon}</span>
                          <span className="text-sm text-gray-700">{type.name}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* BHK Selection */}
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-700">BHK:</span>
              <div className="flex gap-1">
                {BHK_OPTIONS.map((bhk) => (
                  <button
                    key={bhk.id}
                    onClick={() => handleBHKSelect(bhk.id)}
                    className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                      bhkTypes.includes(bhk.id)
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {bhk.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Budget Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowBudgetDropdown(!showBudgetDropdown)}
                className="flex items-center gap-2 px-4 py-2 bg-gray-50 hover:bg-gray-100 rounded-lg text-sm font-medium text-gray-700 transition-colors"
              >
                Budget
                <ChevronDown className="w-4 h-4" />
                {priceRange.predefined && (
                  <span className="bg-green-500 text-white text-xs rounded-full px-2 py-0.5">
                    Selected
                  </span>
                )}
              </button>
              
              {showBudgetDropdown && (
                <div className="absolute z-50 mt-1 w-56 bg-white border border-gray-200 rounded-xl shadow-lg">
                  <div className="p-3">
                    <div className="space-y-2">
                      {BUDGET_RANGES.map((range) => (
                        <button
                          key={range.id}
                          onClick={() => handleBudgetSelect(range)}
                          className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                            priceRange.predefined === range.id
                              ? 'bg-blue-50 text-blue-700'
                              : 'hover:bg-gray-50'
                          }`}
                        >
                          {range.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Advanced Filters Button */}
            <button
              onClick={onToggleFilters}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                showFilters || hasActiveFilters
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
              }`}
            >
              <SlidersHorizontal className="w-4 h-4" />
              Filters
              {activeFiltersCount > 0 && (
                <span className="bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {activeFiltersCount}
                </span>
              )}
            </button>

            {/* Clear All Button */}
            {hasActiveFilters && (
              <button
                onClick={clearSearch}
                className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 transition-colors"
              >
                Clear All
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Active Filter Chips */}
      {hasActiveFilters && (
        <div className="px-4 pb-4">
          <div className="flex flex-wrap gap-2">
            {propertyTypes.map((typeId) => {
              const type = PROPERTY_TYPES.find(t => t.id === typeId);
              return (
                <span
                  key={typeId}
                  className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full"
                >
                  {type?.icon} {type?.name}
                  <button
                    onClick={() => handlePropertyTypeToggle(typeId)}
                    className="ml-1 hover:text-blue-600"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              );
            })}
            
            {bhkTypes.map((bhkId) => {
              const bhk = BHK_OPTIONS.find(b => b.id === bhkId);
              return (
                <span
                  key={bhkId}
                  className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full"
                >
                  {bhk?.label}
                  <button
                    onClick={() => handleBHKSelect(bhkId)}
                    className="ml-1 hover:text-green-600"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              );
            })}
            
            {priceRange.predefined && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-purple-100 text-purple-800 text-xs font-medium rounded-full">
                {BUDGET_RANGES.find(r => r.id === priceRange.predefined)?.label}
                <button
                  onClick={() => handleBudgetSelect({ min: null, max: null, id: null })}
                  className="ml-1 hover:text-purple-600"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            
            {useCurrentLocation && userLocation.latitude && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-orange-100 text-orange-800 text-xs font-medium rounded-full">
                <Navigation className="w-3 h-3" />
                Near {userLocation.formattedAddress.split(',')[0]}
                <button
                  onClick={() => setUseCurrentLocation(false)}
                  className="ml-1 hover:text-orange-600"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
