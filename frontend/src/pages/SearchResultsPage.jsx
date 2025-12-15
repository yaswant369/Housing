import React, { useState, useEffect, useCallback, useContext } from 'react';
import {
  Grid, List, SlidersHorizontal, ArrowUpDown,
  RefreshCw, CheckSquare, Eye, Filter, MapPin, Search
} from 'lucide-react';
import { useSearch } from '../contexts/SearchContext';
import { AppContext } from '../context/AppContext';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import AdvancedFiltersPanel from '../components/filters/AdvancedFiltersPanel';
import ModernPropertyCard from '../components/properties/ModernPropertyCard';
import PropertyComparison from '../components/properties/PropertyComparison';
import PropertiesSection from '../components/properties/PropertiesSection';
import api from '../utils/api';


const SORT_OPTIONS = [
  { id: 'relevance', label: 'Relevance' },
  { id: 'newest', label: 'Newest First' },
  { id: 'price_low_high', label: 'Price: Low to High' },
  { id: 'price_high_low', label: 'Price: High to Low' },
  { id: 'area_low_high', label: 'Area: Small to Large' },
  { id: 'area_high_low', label: 'Area: Large to Small' }
];

const QUICK_FILTERS = [
  { id: 'verified', label: 'Verified', icon: '✓' },
  { id: 'featured', label: 'Featured', icon: '★' },
  { id: 'new', label: 'New Launch', icon: '🆕' },
  { id: 'owner_listed', label: 'Owner Listed', icon: '👤' },
  { id: 'ready_to_move', label: 'Ready to Move', icon: '🏠' }
];

export default function SearchResultsPage() {
  const {
    searchQuery,
    location,
    propertyTypes,
    bhkTypes,
    priceRange,
    viewMode,
    sortBy,
    currentPage,
    isLoading,
    filteredProperties,
    setViewMode,
    setSortBy,
    setCurrentPage,
    hasActiveFilters,
    activeFiltersCount,
    comparedProperties,
    clearComparison,
    setResults,
    setSearchQuery,
    setLocation,
    setPropertyTypes,
    setBHKTypes,
    setPriceRange
  } = useSearch();

  // Get listingType and propertyType from AppContext instead of SearchContext
  const { listingType, propertyType, handlePropertyTypeChange, propertyTypeChangedByUser, handleResetPropertyTypeChangeFlag } = useContext(AppContext);

  const [showFilters, setShowFilters] = useState(false);
  const [properties, setProperties] = useState([]);
  const [activeQuickFilters, setActiveQuickFilters] = useState([]);
  const [showComparison, setShowComparison] = useState(false);
  const [searchCompleted, setSearchCompleted] = useState(false);
  const navigate = useNavigate();
  const locationState = useLocation();
  const { propertyType: urlPropertyType } = useParams();

  // Determine if this is a general search (no property type specified)
  const isGeneralSearch = !urlPropertyType;

  // Only sync URL property type with AppContext on initial load if no property type is set
  // This prevents URL changes from overriding user's property type selection
  const [initialLoad, setInitialLoad] = useState(true);
  
  useEffect(() => {
    if (initialLoad && urlPropertyType && propertyType === 'Residential') {
      // Only set property type from URL on initial load if it's the default
      handlePropertyTypeChange(urlPropertyType);
      setInitialLoad(false);
    }
  }, [urlPropertyType, propertyType, handlePropertyTypeChange, initialLoad]);

  // Reset the flag when URL changes (meaning user clicked a button or navigated)
  useEffect(() => {
    handleResetPropertyTypeChangeFlag();
  }, [urlPropertyType, handleResetPropertyTypeChangeFlag]);

  // Handle filter changes
  const handleSearch = useCallback(async () => {
    try {

      // Build query parameters for API call
      const params = new URLSearchParams();
      params.append('page', '1');
      params.append('limit', '50');

      if (searchQuery) {
        params.append('q', searchQuery);
      }

      if (location) {
        params.append('location', location);
      }

      if (listingType) {
        params.append('listingType', listingType);
      }

      // Handle property type - prioritize URL property type, then context property type
      if (urlPropertyType) {
        params.append('propertyType', urlPropertyType);
      } else if (propertyType && propertyType !== 'any') {
        params.append('propertyType', propertyType);
      }

      if (propertyTypes.length > 0) {
        propertyTypes.forEach(type => params.append('propertyType', type));
      }

      if (bhkTypes.length > 0) {
        bhkTypes.forEach(bhk => params.append('bhk', bhk));
      }

      if (priceRange.min) {
        params.append('minPrice', priceRange.min);
      }

      if (priceRange.max) {
        params.append('maxPrice', priceRange.max);
      }

      // Create a cache key based on current search parameters
      const cacheKey = `${searchQuery}-${location}-${listingType}-${propertyTypes.join(',')}-${urlPropertyType || ''}-${bhkTypes.join(',')}-${priceRange.min || '0'}-${priceRange.max || '0'}-${sortBy}`;

      // Check if we have cached results for this search
      const cachedResults = localStorage.getItem(`searchResults-${cacheKey}`);
      if (cachedResults) {
        const parsedResults = JSON.parse(cachedResults);
        setProperties(parsedResults.properties);
        setResults(parsedResults);
        return; // Skip API call if we have cached results
      }

      // Fetch real properties from API
      const response = await api.get(`/properties?${params.toString()}`);
      let properties = response.data.properties || [];

      // Apply additional filtering that can't be done via API
      if (activeQuickFilters.length > 0) {
        properties = properties.filter(property => {
          return activeQuickFilters.every(filterId => {
            switch (filterId) {
              case 'verified': return property.isVerified;
              case 'featured': return property.isFeatured;
              case 'new': return property.isNew;
              case 'owner_listed': return true; // Placeholder - would need owner data
              case 'ready_to_move': return true; // Placeholder - would need status data
              default: return true;
            }
          });
        });
      }

      // Additional property type filtering on frontend for safety
      // Use the property type from context (user's selection) instead of URL
      const selectedPropertyTypes = [...propertyTypes];
      if (propertyType && propertyType !== 'any' && !selectedPropertyTypes.includes(propertyType)) {
        selectedPropertyTypes.push(propertyType);
      }

      if (selectedPropertyTypes.length > 0) {
        properties = properties.filter(property =>
          selectedPropertyTypes.includes(property.propertyType)
        );
      }

      // Apply sorting
      switch (sortBy) {
        case 'newest':
          properties.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
          break;
        case 'price_low_high':
          properties.sort((a, b) => a.priceValue - b.priceValue);
          break;
        case 'price_high_low':
          properties.sort((a, b) => b.priceValue - a.priceValue);
          break;
        case 'area_low_high':
          properties.sort((a, b) => parseInt(a.area) - parseInt(b.area));
          break;
        case 'area_high_low':
          properties.sort((a, b) => parseInt(b.area) - parseInt(a.area));
          break;
        case 'relevance':
        default:
          // Default sorting - prioritize verified and featured properties
          properties.sort((a, b) => {
            if (a.isVerified !== b.isVerified) return a.isVerified ? -1 : 1;
            if (a.isFeatured !== b.isFeatured) return a.isFeatured ? -1 : 1;
            return new Date(b.createdAt) - new Date(a.createdAt); // Newer first as fallback
          });
          break;
      }

      // Cache the results
      const resultsToCache = {
        properties: properties,
        totalCount: properties.length
      };
      localStorage.setItem(`searchResults-${cacheKey}`, JSON.stringify(resultsToCache));

      setProperties(properties);
      setResults(resultsToCache);
      setSearchCompleted(true);
      // Hide the success message after 5 seconds
      setTimeout(() => setSearchCompleted(false), 5000);
    } catch (error) {
      console.error('Error fetching properties:', error);
      setProperties([]);
      setResults({ properties: [], totalCount: 0 });
      setSearchCompleted(false);
    }
  }, [searchQuery, location, listingType, propertyTypes, bhkTypes, priceRange, sortBy, activeQuickFilters, setResults]);

  // Handle quick filter toggle
  const toggleQuickFilter = (filterId) => {
    setActiveQuickFilters(prev =>
      prev.includes(filterId)
        ? prev.filter(id => id !== filterId)
        : [...prev, filterId]
    );
  };

  // Handle property actions
  const handleViewDetails = (propertyId) => {
    navigate(`/property/${propertyId}`);
  };

  const handleCall = (property) => {
    console.log('Call property:', property);
    // Implement call functionality
  };

  const handleWhatsApp = (property) => {
    console.log('WhatsApp property:', property);
    // Implement WhatsApp functionality
  };

  // Load more properties (infinite scroll simulation)
  const loadMoreProperties = () => {
    setCurrentPage(currentPage + 1);
    // In real implementation, fetch more properties
  };

  // Debounce function to prevent rapid re-renders
  const debounce = (func, delay) => {
    let timeoutId;
    return (...args) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func(...args), delay);
    };
  };

  // Debounced search function
  const debouncedSearch = useCallback(debounce(handleSearch, 500), [handleSearch]);

  // Run search when component mounts or search criteria change
  // But only if it's not just a property type change from button click
  useEffect(() => {
    // If the property type was changed by user clicking a button, don't auto-search
    // The search will be triggered when user explicitly clicks search button
    if (!propertyTypeChangedByUser) {
      debouncedSearch();
    }
    return () => clearTimeout(debouncedSearch);
  }, [debouncedSearch, propertyTypeChangedByUser]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with Search Info */}
      <div className="sticky top-[80px] z-40 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          {/* Mobile Filter Button - Visible on smaller screens */}
          <div className="lg:hidden mb-4">
            <button
              onClick={() => setShowFilters(true)}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors"
            >
              <SlidersHorizontal className="w-4 h-4" />
              Filters
              {hasActiveFilters && (
                <span className="bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {activeFiltersCount}
                </span>
              )}
            </button>
          </div>

          {/* Search Info */}
          <div className="flex items-center gap-2 mb-4">
            <Search className="text-blue-600 w-5 h-5" />
            <h1 className="text-xl font-bold text-gray-900">{isGeneralSearch ? 'Property Search' : 'Search Results'}</h1>

            {/* Show active filters */}
            {location && (
              <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                <MapPin className="inline w-4 h-4 mr-1" />
                {location}
              </span>
            )}
            {listingType && (
              <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                {listingType.toUpperCase()}
              </span>
            )}
            {(propertyTypes.length > 0 || propertyType !== 'any') && (
              <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium">
                {propertyTypes.length > 0 ? propertyTypes.join(', ') : propertyType}
              </span>
            )}
            {bhkTypes.length > 0 && (
              <span className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm font-medium">
                {bhkTypes.join(', ')} BHK
              </span>
            )}
            {(priceRange.min || priceRange.max) && (
              <span className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm font-medium">
                ₹{priceRange.min ? priceRange.min/100000 + 'L' : '0'} - ₹{priceRange.max ? priceRange.max/100000 + 'L' : '∞'}
              </span>
            )}
          </div>

          {/* Search Success Message */}
          {searchCompleted && (
            <div className="bg-green-50 border border-green-100 rounded-lg p-3 mb-4">
              <div className="flex items-center gap-2">
                <Search className="text-green-600 w-4 h-4" />
                <span className="text-sm text-green-800 font-medium">
                  Search completed successfully! Found {properties.length} properties.
                </span>
              </div>
            </div>
          )}

          {/* Search Summary - Shows when filters are active */}
          {hasActiveFilters && (
            <div className="bg-blue-50 border border-blue-100 rounded-lg p-3 mb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Search className="text-blue-600 w-4 h-4" />
                  <span className="text-sm text-blue-800 font-medium">
                    Showing {properties.length} properties matching your criteria
                  </span>
                </div>
                <button
                  onClick={() => {
                    // Reset filters logic
                    setSearchQuery('');
                    setLocation('');
                    setPropertyTypes([]);
                    setBHKTypes([]);
                    setPriceRange({ min: null, max: null, predefined: null });
                    setActiveQuickFilters([]);
                    handleSearch();
                  }}
                  className="text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1"
                >
                  <RefreshCw className="w-3 h-3" />
                  Reset
                </button>
              </div>
            </div>
          )}


          {/* Toolbar */}
          <div className="flex items-center justify-between mt-4">
            {/* Results Info */}
            <div className="flex items-center gap-4">
              <span className="text-gray-600">
                {properties.length} properties found
              </span>

              {/* Active Filters Count */}
              {hasActiveFilters && (
                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm font-medium">
                  Filters Active
                </span>
              )}
            </div>

            {/* View and Sort Controls */}
            <div className="flex items-center gap-4">
              {/* Filter Button - Now visible on all screen sizes */}
              <button
                onClick={() => setShowFilters(true)}
                className="flex items-center gap-2 px-3 py-2 bg-blue-500 text-white rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors"
              >
                <SlidersHorizontal className="w-4 h-4" />
                Filters
                {hasActiveFilters && (
                  <span className="bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {activeFiltersCount}
                  </span>
                )}
              </button>

              {/* Quick Filters - Only on larger screens */}
              <div className="hidden lg:flex items-center gap-2">
                {QUICK_FILTERS.map((filter) => (
                  <button
                    key={filter.id}
                    onClick={() => toggleQuickFilter(filter.id)}
                    className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                      activeQuickFilters.includes(filter.id)
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <span>{filter.icon}</span>
                    {filter.label}
                  </button>
                ))}
              </div>

              {/* View Mode Toggle */}
              <div className="flex items-center bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-md transition-colors ${
                    viewMode === 'grid'
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-md transition-colors ${
                    viewMode === 'list'
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>

              {/* Enhanced Sort Dropdown with better options */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {SORT_OPTIONS.map((option) => (
                  <option key={option.id} value={option.id}>
                    {option.label}
                  </option>
                ))}
              </select>

              {/* Comparison Button */}
              {comparedProperties.length > 0 && (
                <button
                  onClick={() => setShowComparison(true)}
                  className="flex items-center gap-2 px-3 py-2 bg-green-500 text-white rounded-lg text-sm font-medium hover:bg-green-600 transition-colors"
                >
                  <CheckSquare className="w-4 h-4" />
                  Compare ({comparedProperties.length})
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 pt-4 pb-6">
        {/* Properties Grid/List */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl overflow-hidden animate-pulse">
                <div className="aspect-[4/3] bg-gray-200"></div>
                <div className="p-4 space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                </div>
              </div>
            ))}
          </div>
        ) : properties.length > 0 ? (
          <div className={
            viewMode === 'grid'
              ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
              : 'space-y-6'
          }>
            {properties.map((property) => (
              <ModernPropertyCard
                key={property.id}
                property={property}
                variant={viewMode}
                onViewDetails={handleViewDetails}
                onCall={handleCall}
                onWhatsApp={handleWhatsApp}
              />
            ))}
          </div>
        ) : (
          /* Enhanced Empty State */
          <div className="text-center py-16 px-4">
            <div className="text-gray-400 text-6xl mb-4">🏠</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">
              {hasActiveFilters ? 'No Properties Found' : 'Explore Properties'}
            </h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              {hasActiveFilters ?
                'We couldn\'t find any properties matching your criteria. Try adjusting your search filters or broadening your search area.' :
                'Start your property search by entering a location, selecting filters, or browsing our featured properties.'}
            </p>

            {hasActiveFilters ? (
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  onClick={() => {
                    // Reset filters logic
                    setSearchQuery('');
                    setLocation('');
                    setPropertyTypes([]);
                    setBHKTypes([]);
                    setPriceRange({ min: null, max: null, predefined: null });
                    setActiveQuickFilters([]);
                    handleSearch();
                  }}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium"
                >
                  <RefreshCw className="w-4 h-4" />
                  Reset Filters
                </button>
                <button
                  onClick={() => setShowFilters(true)}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                >
                  <SlidersHorizontal className="w-4 h-4" />
                  Adjust Filters
                </button>
              </div>
            ) : (
              <button
                onClick={async () => {
                  try {
                    console.log('Start Searching button clicked');
                    // For general search, just trigger a search with default criteria
                    setSearchQuery('');
                    setLocation('');
                    setPropertyTypes([]);
                    setBHKTypes([]);
                    setPriceRange({ min: null, max: null, predefined: null });
                    setActiveQuickFilters([]);
                    await handleSearch();
                    console.log('Search completed successfully');
                  } catch (error) {
                    console.error('Error during search:', error);
                  }
                }}
                className="inline-flex items-center gap-2 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium"
              >
                <Search className="w-4 h-4" />
                {isGeneralSearch ? 'Refresh Search' : 'Start Searching'}
              </button>
            )}

            {/* Suggested searches for better UX */}
            {!hasActiveFilters && (
              <div className="mt-8">
                <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">POPULAR SEARCHES</h4>
                <div className="flex flex-wrap justify-center gap-3">
                  {['Mumbai', 'Delhi', 'Bangalore', 'Pune', 'Hyderabad'].map((city) => (
                    <button
                      key={city}
                      onClick={() => {
                        setLocation(city);
                        handleSearch();
                      }}
                      className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm"
                    >
                      {city}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Properties Section based on propertyTypes and listingType from search criteria */}
        {(propertyTypes.length > 0 || urlPropertyType) && listingType && (
          <div className="max-w-7xl mx-auto px-4 py-6">
            <PropertiesSection
              title={`${urlPropertyType || propertyTypes.join(', ')} for ${listingType} in your Area`}
              data={properties}
              isFeaturedSection={false}
              onToggleSaved={() => {}}
              onViewDetails={handleViewDetails}
              addToComparison={() => {}}
              API_BASE_URL={'http://localhost:5000'}
              savedPropertyIds={new Set()}
            />
          </div>
        )}

        {/* Load More Button */}
        {properties.length > 0 && (
          <div className="text-center mt-8">
            <button
              onClick={loadMoreProperties}
              className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Load More Properties
            </button>
          </div>
        )}
      </div>

      {/* Advanced Filters Panel */}
      <AdvancedFiltersPanel
        isOpen={showFilters}
        onClose={() => setShowFilters(false)}
      />

      {/* Property Comparison Modal */}
      {showComparison && (
        <PropertyComparison
          properties={comparedProperties}
          onClose={() => setShowComparison(false)}
          onClear={clearComparison}
        />
      )}
    </div>
  );
}
