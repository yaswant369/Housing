import React, { useState, useEffect, useCallback } from 'react';
import { 
  Grid, List, SlidersHorizontal, ArrowUpDown, 
  RefreshCw, CheckSquare, Eye, Filter
} from 'lucide-react';
import { useSearch } from '../contexts/SearchContext';
import AdvancedSearchBar from '../components/search/AdvancedSearchBar';
import AdvancedFiltersPanel from '../components/filters/AdvancedFiltersPanel';
import ModernPropertyCard from '../components/properties/ModernPropertyCard';
import PropertyComparison from '../components/properties/PropertyComparison';

// Properties will be loaded from context or API
const SAMPLE_PROPERTIES = [];

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

export default function PropertySearchPage() {
  const {
    viewMode,
    sortBy,
    currentPage,
    isLoading,
    filteredProperties,
    setViewMode,
    setSortBy,
    setCurrentPage,
    hasActiveFilters,
    comparedProperties,
    clearComparison
  } = useSearch();

  const [showFilters, setShowFilters] = useState(false);
  const [properties, setProperties] = useState(filteredProperties);
  const [activeQuickFilters, setActiveQuickFilters] = useState([]);
  const [showComparison, setShowComparison] = useState(false);

  // Handle filter changes
  const handleSearch = useCallback(async () => {
    // Reset to show all filtered properties from context
    setProperties(filteredProperties);
    setActiveQuickFilters([]);
  }, [filteredProperties]);

  // Handle quick filter toggle
  const toggleQuickFilter = (filterId) => {
    setActiveQuickFilters(prev => {
      const newFilters = prev.includes(filterId)
        ? prev.filter(id => id !== filterId)
        : [...prev, filterId];

      // Apply filtering logic based on active filters
      applyQuickFilters(newFilters);
      return newFilters;
    });
  };

  // Apply quick filters to properties
  const applyQuickFilters = (filters) => {
    if (filters.length === 0) {
      // If no filters, show all properties from context
      setProperties(filteredProperties);
      return;
    }

    // Filter properties based on active filters
    const filtered = filteredProperties.filter(property => {
      return filters.every(filter => {
        switch (filter) {
          case 'verified': return property.isVerified;
          case 'featured': return property.isFeatured;
          case 'new': return property.isNew;
          case 'owner_listed': return property.ownerListed;
          case 'ready_to_move': return property.readyToMove;
          default: return true;
        }
      });
    });

    setProperties(filtered);
  };

  // Handle property actions
  const handleViewDetails = (propertyId) => {
    // Navigate to property detail page
    console.log('View details for property:', propertyId);
  };

  const handleCall = (property) => {
    console.log('Call property:', property);
    // Implement call functionality
  };

  const handleWhatsApp = (property) => {
    console.log('WhatsApp property:', property);
    // Implement WhatsApp functionality
  };

  // Load more properties - load more from context if available
  const loadMoreProperties = () => {
    // If we have filtered properties that we haven't shown yet, load them
    const currentProperties = properties || [];
    const allProperties = filteredProperties || [];

    if (currentProperties.length < allProperties.length) {
      // Load 6 more properties or whatever is remaining
      const remainingProperties = allProperties.slice(currentProperties.length, currentProperties.length + 6);
      setProperties([...currentProperties, ...remainingProperties]);
    } else {
      // No more properties to load
      console.log('No more properties to load');
      // In a real implementation, this would fetch more from API
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          
          {/* Search Bar - Removed as there's already a search bar in the header */}

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
              
              {/* Quick Filters */}
              <div className="hidden md:flex items-center gap-2">
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

              {/* Sort Dropdown */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {SORT_OPTIONS.map((option) => (
                  <option key={option.id} value={option.id}>
                    Sort by {option.label}
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
      <div className="max-w-7xl mx-auto px-4 py-6">
        
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
          /* Empty State */
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">🏠</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No Properties Found
            </h3>
            <p className="text-gray-600 mb-4">
              Try adjusting your search criteria or filters
            </p>
            <button
              onClick={handleSearch}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              Reset Search
            </button>
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
