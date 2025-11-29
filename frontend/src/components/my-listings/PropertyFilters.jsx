import React, { useState, useEffect, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  ChevronDown, 
  Grid3X3, 
  List,
  ArrowUpDown,
  Calendar,
  DollarSign,
  Eye,
  MessageSquare,
  Heart,
  MapPin,
  Home,
  Building,
  Car,
  Zap,
  Wifi,
  Shield,
  Trees,
  Waves,
  Dumbbell,
  X,
  SlidersHorizontal,
  Star,
  Award,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle,
  XCircle,
  Pause,
  Play,
  Edit3
} from 'lucide-react';

const statusTabs = [
  { key: 'all', label: 'All', icon: Home, count: 0 },
  { key: 'active', label: 'Online / Active', icon: CheckCircle, count: 0, color: 'text-green-600' },
  { key: 'paused', label: 'Offline / Paused', icon: Pause, count: 0, color: 'text-yellow-600' },
  { key: 'pending', label: 'Under review', icon: AlertCircle, count: 0, color: 'text-blue-600' },
  { key: 'expired', label: 'Expired', icon: Clock, count: 0, color: 'text-gray-600' },
  { key: 'draft', label: 'Drafts', icon: Edit3, count: 0, color: 'text-gray-500' },
  { key: 'archived', label: 'Archived', icon: XCircle, count: 0, color: 'text-red-600' }
];

const sortOptions = [
  { key: 'newest', label: 'Newest first', icon: Calendar, description: 'Recently added properties' },
  { key: 'oldest', label: 'Oldest first', icon: Calendar, description: 'Longest listed properties' },
  { key: 'highest_price', label: 'Highest price', icon: DollarSign, description: 'High to low price' },
  { key: 'lowest_price', label: 'Lowest price', icon: DollarSign, description: 'Low to high price' },
  { key: 'most_views', label: 'Most views', icon: Eye, description: 'Popular properties' },
  { key: 'most_leads', label: 'Most leads', icon: MessageSquare, description: 'High engagement' },
  { key: 'most_shortlists', label: 'Most shortlists', icon: Heart, description: 'Most liked properties' },
  { key: 'quality_score', label: 'Best quality', icon: Award, description: 'Highest quality listings' }
];

const propertyTypes = [
  { key: 'apartment', label: 'Apartment', icon: Building },
  { key: 'villa', label: 'Villa', icon: Home },
  { key: 'independent', label: 'Independent House', icon: Home },
  { key: 'plot', label: 'Plot/Land', icon: MapPin },
  { key: 'office', label: 'Office Space', icon: Building },
  { key: 'shop', label: 'Shop', icon: Building },
  { key: 'warehouse', label: 'Warehouse', icon: Building },
  { key: 'pg', label: 'PG/Co-living', icon: Home }
];

const amenitiesList = [
  { key: 'lift', label: 'Lift/Elevator', icon: ArrowUpDown },
  { key: 'parking', label: 'Parking', icon: Car },
  { key: 'power_backup', label: 'Power Backup', icon: Zap },
  { key: 'security', label: 'Security', icon: Shield },
  { key: 'gym', label: 'Gym', icon: Dumbbell },
  { key: 'swimming_pool', label: 'Swimming Pool', icon: Waves },
  { key: 'clubhouse', label: 'Club House', icon: Home },
  { key: 'park', label: 'Park/Garden', icon: Trees },
  { key: 'wifi', label: 'Wi-Fi', icon: Wifi },
  { key: 'intercom', label: 'Intercom', icon: MessageSquare }
];

const furnishingOptions = [
  { key: 'unfurnished', label: 'Unfurnished' },
  { key: 'semi_furnished', label: 'Semi-Furnished' },
  { key: 'fully_furnished', label: 'Fully Furnished' }
];

const planTypes = [
  { key: 'free', label: 'Free', color: 'bg-gray-100 text-gray-700' },
  { key: 'featured', label: 'Featured', color: 'bg-yellow-100 text-yellow-700' },
  { key: 'premium', label: 'Premium', color: 'bg-purple-100 text-purple-700' },
  { key: 'boosted', label: 'Boosted', color: 'bg-blue-100 text-blue-700' }
];

export default function PropertyFilters({
  activeFilter,
  onFilterChange,
  searchTerm,
  onSearchChange,
  sortBy,
  onSortChange,
  viewMode,
  onViewModeChange,
  totalCount,
  properties = [],
  onAdvancedFilterChange,
  advancedFilters = {}
}) {
  const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState(false);
  const [isSortDropdownOpen, setIsSortDropdownOpen] = useState(false);
  const [isAdvancedFiltersOpen, setIsAdvancedFiltersOpen] = useState(false);
  const [localAdvancedFilters, setLocalAdvancedFilters] = useState({
    propertyTypes: [],
    bhk: [],
    priceRange: { min: '', max: '' },
    areaRange: { min: '', max: '' },
    furnishing: [],
    amenities: [],
    planTypes: [],
    locations: [],
    ...advancedFilters
  });

  // Calculate filtered counts with enhanced logic
  const getFilteredCount = (status) => {
    if (status === 'all') return totalCount;
    
    return properties.filter(property => {
      if (!property.status) return false;
      return property.status.toLowerCase() === status.toLowerCase();
    }).length;
  };

  // Search suggestions
  const searchSuggestions = useMemo(() => {
    if (!searchTerm || searchTerm.length < 2) return [];
    
    const suggestions = new Set();
    const term = searchTerm.toLowerCase();
    
    properties.forEach(property => {
      if (property.location?.toLowerCase().includes(term)) {
        suggestions.add(property.location);
      }
      if (property.type?.toLowerCase().includes(term)) {
        suggestions.add(property.type);
      }
      if (property.buildingName?.toLowerCase().includes(term)) {
        suggestions.add(property.buildingName);
      }
    });
    
    return Array.from(suggestions).slice(0, 5);
  }, [searchTerm, properties]);

  // Apply advanced filters
  const applyAdvancedFilters = () => {
    onAdvancedFilterChange?.(localAdvancedFilters);
    setIsAdvancedFiltersOpen(false);
  };

  const clearAdvancedFilters = () => {
    const clearedFilters = {
      propertyTypes: [],
      bhk: [],
      priceRange: { min: '', max: '' },
      areaRange: { min: '', max: '' },
      furnishing: [],
      amenities: [],
      planTypes: [],
      locations: []
    };
    setLocalAdvancedFilters(clearedFilters);
    onAdvancedFilterChange?.(clearedFilters);
  };

  const hasActiveFilters = useMemo(() => {
    return Object.entries(localAdvancedFilters).some(([key, value]) => {
      if (key === 'priceRange' || key === 'areaRange') {
        return value.min || value.max;
      }
      return value.length > 0;
    });
  }, [localAdvancedFilters]);

  const getActiveFiltersCount = () => {
    return Object.entries(localAdvancedFilters).reduce((count, [key, value]) => {
      if (key === 'priceRange' || key === 'areaRange') {
        return count + ((value.min || value.max) ? 1 : 0);
      }
      return count + value.length;
    }, 0);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6">
      {/* Enhanced Search Bar */}
      <div className="flex items-center gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search by Property ID, Title, Location, Building name..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          
          {/* Search Suggestions */}
          {searchSuggestions.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg z-50">
              {searchSuggestions.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => onSearchChange(suggestion)}
                  className="w-full text-left px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-700 first:rounded-t-lg last:rounded-b-lg flex items-center gap-2"
                >
                  <Search size={16} className="text-gray-400" />
                  <span className="text-gray-700 dark:text-gray-300">{suggestion}</span>
                </button>
              ))}
            </div>
          )}
        </div>
        
        {/* Enhanced View Mode Toggle */}
        <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
          <button
            onClick={() => onViewModeChange('grid')}
            className={`p-2 rounded-md transition-colors ${
              viewMode === 'grid' 
                ? 'bg-white dark:bg-gray-600 text-blue-600 shadow-sm' 
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
            }`}
            title="Grid View"
          >
            <Grid3X3 size={20} />
          </button>
          <button
            onClick={() => onViewModeChange('list')}
            className={`p-2 rounded-md transition-colors ${
              viewMode === 'list' 
                ? 'bg-white dark:bg-gray-600 text-blue-600 shadow-sm' 
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
            }`}
            title="List View"
          >
            <List size={20} />
          </button>
        </div>
      </div>

      {/* Status Filter Tabs */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex flex-wrap gap-2">
          {statusTabs.map(tab => {
            const IconComponent = tab.icon;
            return (
              <button
                key={tab.key}
                onClick={() => onFilterChange(tab.key)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  activeFilter === tab.key
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                <IconComponent size={16} className={activeFilter === tab.key ? 'text-white' : tab.color || 'text-gray-500'} />
                <span>{tab.label}</span>
                <span className={`text-xs px-2 py-0.5 rounded-full ${
                  activeFilter === tab.key 
                    ? 'bg-white/20 text-white' 
                    : 'bg-gray-200 dark:bg-gray-600 text-gray-600 dark:text-gray-400'
                }`}>
                  {getFilteredCount(tab.key)}
                </span>
              </button>
            );
          })}
        </div>

        {/* Enhanced Sort Dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsSortDropdownOpen(!isSortDropdownOpen)}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          >
            <ArrowUpDown size={16} />
            <span className="text-sm font-medium">
              {sortOptions.find(opt => opt.key === sortBy)?.label || 'Sort by'}
            </span>
            <ChevronDown size={16} className={`transition-transform ${isSortDropdownOpen ? 'rotate-180' : ''}`} />
          </button>

          {isSortDropdownOpen && (
            <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50">
              <div className="p-2">
                <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 px-3 py-2">Sort Properties</h4>
                {sortOptions.map(option => {
                  const IconComponent = option.icon;
                  return (
                    <button
                      key={option.key}
                      onClick={() => {
                        onSortChange(option.key);
                        setIsSortDropdownOpen(false);
                      }}
                      className={`w-full flex items-start gap-3 px-3 py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors rounded-lg ${
                        sortBy === option.key ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                      }`}
                    >
                      <IconComponent size={16} className={`mt-0.5 ${sortBy === option.key ? 'text-blue-600' : 'text-gray-400'}`} />
                      <div className="flex-1">
                        <div className={`text-sm font-medium ${sortBy === option.key ? 'text-blue-700 dark:text-blue-300' : 'text-gray-700 dark:text-gray-300'}`}>
                          {option.label}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                          {option.description}
                        </div>
                      </div>
                      {sortBy === option.key && (
                        <CheckCircle size={16} className="text-blue-600" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Results Summary and Advanced Filters */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-600 dark:text-gray-400">
            Showing <span className="font-semibold text-gray-900 dark:text-gray-100">{totalCount}</span> properties
          </span>
          
          {hasActiveFilters && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500 dark:text-gray-400">•</span>
              <span className="text-sm text-blue-600 dark:text-blue-400">
                {getActiveFiltersCount()} filter{getActiveFiltersCount() !== 1 ? 's' : ''} applied
              </span>
              <button
                onClick={clearAdvancedFilters}
                className="text-sm text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300"
              >
                Clear all
              </button>
            </div>
          )}
        </div>
        
        <div className="flex items-center gap-2">
          {/* Advanced Filters Button */}
          <button
            onClick={() => setIsAdvancedFiltersOpen(!isAdvancedFiltersOpen)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-md transition-colors ${
              hasActiveFilters 
                ? 'bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-700' 
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            <SlidersHorizontal size={16} />
            <span>Advanced Filters</span>
            {getActiveFiltersCount() > 0 && (
              <span className="bg-blue-600 text-white text-xs px-1.5 py-0.5 rounded-full">
                {getActiveFiltersCount()}
              </span>
            )}
            <ChevronDown size={16} className={`transition-transform ${isAdvancedFiltersOpen ? 'rotate-180' : ''}`} />
          </button>
        </div>
      </div>

      {/* Advanced Filters Panel */}
      {isAdvancedFiltersOpen && (
        <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* Property Types */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Property Type
              </label>
              <div className="space-y-2">
                {propertyTypes.map(type => {
                  const IconComponent = type.icon;
                  const isSelected = localAdvancedFilters.propertyTypes.includes(type.key);
                  return (
                    <label key={type.key} className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={(e) => {
                          const newTypes = e.target.checked
                            ? [...localAdvancedFilters.propertyTypes, type.key]
                            : localAdvancedFilters.propertyTypes.filter(t => t !== type.key);
                          setLocalAdvancedFilters(prev => ({ ...prev, propertyTypes: newTypes }));
                        }}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <IconComponent size={16} className="text-gray-500" />
                      <span className="text-sm text-gray-700 dark:text-gray-300">{type.label}</span>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* BHK Configuration */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                BHK Configuration
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[1, 2, 3, 4, 5].map(bhk => {
                  const isSelected = localAdvancedFilters.bhk.includes(bhk);
                  return (
                    <button
                      key={bhk}
                      onClick={() => {
                        const newBhk = isSelected
                          ? localAdvancedFilters.bhk.filter(b => b !== bhk)
                          : [...localAdvancedFilters.bhk, bhk];
                        setLocalAdvancedFilters(prev => ({ ...prev, bhk: newBhk }));
                      }}
                      className={`py-2 px-3 text-sm rounded-lg border transition-colors ${
                        isSelected
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600'
                      }`}
                    >
                      {bhk} BHK
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Price Range */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Price Range (₹)
              </label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="number"
                  placeholder="Min"
                  value={localAdvancedFilters.priceRange.min}
                  onChange={(e) => setLocalAdvancedFilters(prev => ({
                    ...prev,
                    priceRange: { ...prev.priceRange, min: e.target.value }
                  }))}
                  className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700"
                />
                <input
                  type="number"
                  placeholder="Max"
                  value={localAdvancedFilters.priceRange.max}
                  onChange={(e) => setLocalAdvancedFilters(prev => ({
                    ...prev,
                    priceRange: { ...prev.priceRange, max: e.target.value }
                  }))}
                  className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700"
                />
              </div>
              <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                Price in Lakhs (e.g., 10 = ₹10 Lakh)
              </div>
            </div>

            {/* Area Range */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Area Range (sq.ft)
              </label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="number"
                  placeholder="Min"
                  value={localAdvancedFilters.areaRange.min}
                  onChange={(e) => setLocalAdvancedFilters(prev => ({
                    ...prev,
                    areaRange: { ...prev.areaRange, min: e.target.value }
                  }))}
                  className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700"
                />
                <input
                  type="number"
                  placeholder="Max"
                  value={localAdvancedFilters.areaRange.max}
                  onChange={(e) => setLocalAdvancedFilters(prev => ({
                    ...prev,
                    areaRange: { ...prev.areaRange, max: e.target.value }
                  }))}
                  className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700"
                />
              </div>
            </div>

            {/* Furnishing */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Furnishing Status
              </label>
              <div className="space-y-2">
                {furnishingOptions.map(option => {
                  const isSelected = localAdvancedFilters.furnishing.includes(option.key);
                  return (
                    <label key={option.key} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={(e) => {
                          const newFurnishing = e.target.checked
                            ? [...localAdvancedFilters.furnishing, option.key]
                            : localAdvancedFilters.furnishing.filter(f => f !== option.key);
                          setLocalAdvancedFilters(prev => ({ ...prev, furnishing: newFurnishing }));
                        }}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300">{option.label}</span>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Plan Types */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Plan Type
              </label>
              <div className="space-y-2">
                {planTypes.map(plan => {
                  const isSelected = localAdvancedFilters.planTypes.includes(plan.key);
                  return (
                    <label key={plan.key} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={(e) => {
                          const newPlans = e.target.checked
                            ? [...localAdvancedFilters.planTypes, plan.key]
                            : localAdvancedFilters.planTypes.filter(p => p !== plan.key);
                          setLocalAdvancedFilters(prev => ({ ...prev, planTypes: newPlans }));
                        }}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <span className={`px-2 py-1 text-xs rounded-full ${plan.color}`}>{plan.label}</span>
                    </label>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Amenities */}
          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Amenities & Features
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
              {amenitiesList.map(amenity => {
                const IconComponent = amenity.icon;
                const isSelected = localAdvancedFilters.amenities.includes(amenity.key);
                return (
                  <button
                    key={amenity.key}
                    onClick={() => {
                      const newAmenities = isSelected
                        ? localAdvancedFilters.amenities.filter(a => a !== amenity.key)
                        : [...localAdvancedFilters.amenities, amenity.key];
                      setLocalAdvancedFilters(prev => ({ ...prev, amenities: newAmenities }));
                    }}
                    className={`flex items-center gap-2 p-3 rounded-lg border transition-colors ${
                      isSelected
                        ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-700 text-blue-700 dark:text-blue-300'
                        : 'bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600'
                    }`}
                  >
                    <IconComponent size={16} />
                    <span className="text-xs font-medium">{amenity.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={() => setIsAdvancedFiltersOpen(false)}
              className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={clearAdvancedFilters}
              className="px-4 py-2 text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 transition-colors"
            >
              Clear All
            </button>
            <button
              onClick={applyAdvancedFilters}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Apply Filters
            </button>
          </div>
        </div>
      )}
    </div>
  );
}