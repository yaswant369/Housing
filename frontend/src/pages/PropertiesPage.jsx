import React, { useState, useEffect, useContext } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import PropertiesSection from '../components/properties/PropertiesSection';
import { ArrowLeft, Filter, Search } from 'lucide-react';
import FilterModal from '../features/FilterModal';
import ShareURL from '../components/ShareURL';

export default function PropertiesPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  
  const {
    properties,
    savedPropertyIds,
    handleToggleSaved,
    addToComparison,
    API_BASE_URL,
    filters,
    listingType,
    handleFilterChange,
    token
  } = useContext(AppContext);

  const [filteredProperties, setFilteredProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Get similar properties mode from URL params
  const isSimilarMode = searchParams.get('similar') === 'true';
  const similarToPropertyId = searchParams.get('similarTo');

  useEffect(() => {
    filterProperties();
  }, [properties, filters, listingType, searchQuery, isSimilarMode, similarToPropertyId]);

  const filterProperties = async () => {
    try {
      setLoading(true);
      let filtered = [...properties];

      // Apply search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        filtered = filtered.filter(property => 
          property.location?.toLowerCase().includes(query) ||
          property.type?.toLowerCase().includes(query) ||
          property.description?.toLowerCase().includes(query)
        );
      }

      // Apply listing type filter
      if (listingType && listingType !== 'any') {
        filtered = filtered.filter(property => 
          property.status === (listingType === 'Buy' ? 'For Sale' : 'For Rent')
        );
      }

      // Apply other filters
      if (filters.bhk && filters.bhk !== 'any') {
        if (filters.bhk === '5') {
          filtered = filtered.filter(property => property.bhk >= 5);
        } else {
          filtered = filtered.filter(property => property.bhk === parseInt(filters.bhk));
        }
      }

      if (filters.furnishing && filters.furnishing !== 'any') {
        filtered = filtered.filter(property => property.furnishing === filters.furnishing);
      }

      if (filters.priceRange && filters.priceRange.min) {
        filtered = filtered.filter(property => property.priceValue >= filters.priceRange.min);
      }

      if (filters.priceRange && filters.priceRange.max) {
        filtered = filtered.filter(property => property.priceValue <= filters.priceRange.max);
      }

      if (filters.amenities && filters.amenities.length > 0) {
        filtered = filtered.filter(property =>
          filters.amenities.every(amenity => property.amenities?.includes(amenity))
        );
      }

      // Similar properties mode: filter to show only properties similar to the specified one
      if (isSimilarMode && similarToPropertyId) {
        const referenceProperty = properties.find(p => p.id === parseInt(similarToPropertyId));
        if (referenceProperty) {
          filtered = filtered
            .filter(p => p.id !== referenceProperty.id) // Exclude the reference property
            .filter(p => {
              // Check for location similarity
              const locationMatch = p.location === referenceProperty.location ||
                (p.location && referenceProperty.location && 
                 p.location.toLowerCase().includes(referenceProperty.location.split(',')[0]) ||
                 referenceProperty.location.toLowerCase().includes(p.location.split(',')[0]));

              // Check for type similarity
              const typeMatch = p.type === referenceProperty.type ||
                (p.type && referenceProperty.type &&
                 (p.type.toLowerCase().includes(referenceProperty.type.toLowerCase()) ||
                  referenceProperty.type.toLowerCase().includes(p.type.toLowerCase())));

              // Check for BHK similarity
              const bhkMatch = p.bhk === referenceProperty.bhk;

              // Check for price range similarity (within 20% range)
              const priceRatio = Math.abs(p.priceValue - referenceProperty.priceValue) / referenceProperty.priceValue;
              const priceMatch = priceRatio <= 0.2;

              return locationMatch && (typeMatch || bhkMatch || priceMatch);
            })
            .slice(0, 12); // Limit to 12 similar properties
        }
      }

      setFilteredProperties(filtered);
    } catch (error) {
      console.error('Error filtering properties:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (id) => {
    if (id) {
      navigate(`/property/${id}`);
    }
  };

  const handleApplyFilters = (newFilters) => {
    handleFilterChange(newFilters);
    setShowFilters(false);
  };

  const getPageTitle = () => {
    if (isSimilarMode && similarToPropertyId) {
      const referenceProperty = properties.find(p => p.id === parseInt(similarToPropertyId));
      return referenceProperty 
        ? `Properties Similar to ${referenceProperty.type} in ${referenceProperty.location}`
        : 'Similar Properties';
    }
    
    let title = `${listingType === 'Buy' ? 'Properties for Sale' : 'Properties for Rent'}`;
    
    if (searchQuery.trim()) {
      title += ` matching "${searchQuery}"`;
    }
    
    return title;
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.bhk && filters.bhk !== 'any') count++;
    if (filters.furnishing && filters.furnishing !== 'any') count++;
    if (filters.priceRange && (filters.priceRange.min || filters.priceRange.max)) count++;
    if (filters.amenities && filters.amenities.length > 0) count++;
    return count;
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm sticky top-0 z-40 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button 
                onClick={() => navigate(-1)} 
                className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                title="Go Back"
              >
                <ArrowLeft size={20} />
              </button>
              <div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                  {getPageTitle()}
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {filteredProperties.length} properties found
                  {isSimilarMode && similarToPropertyId ? ' (similar properties)' : ''}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowFilters(true)}
                className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center gap-2 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              >
                <Filter size={18} />
                Filters
                {getActiveFiltersCount() > 0 && (
                  <span className="bg-blue-600 text-white text-xs rounded-full px-2 py-0.5">
                    {getActiveFiltersCount()}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Search Bar */}
          <div className="mt-4 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search by location, property type, or description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            />
          </div>

          {/* Share URL Section */}
          <div className="mt-4">
            <ShareURL 
              title={getPageTitle()}
              showLabel={true}
              size="small"
            />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        {loading ? (
          <div className="space-y-8">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-8 bg-gray-300 dark:bg-gray-700 rounded w-1/4 mb-4"></div>
                <div className="space-y-4">
                  {[...Array(2)].map((_, j) => (
                    <div key={j} className="h-40 bg-gray-300 dark:bg-gray-700 rounded"></div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : filteredProperties.length > 0 ? (
          <PropertiesSection
            title={getPageTitle()}
            data={filteredProperties}
            onToggleSaved={handleToggleSaved}
            onViewDetails={handleViewDetails}
            addToComparison={addToComparison}
            API_BASE_URL={API_BASE_URL}
            savedPropertyIds={savedPropertyIds}
          />
        ) : (
          <div className="text-center py-12">
            <div className="text-gray-400 dark:text-gray-500 text-6xl mb-4">🏠</div>
            <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-gray-100">
              No Properties Found
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              {isSimilarMode 
                ? 'No similar properties found. Try adjusting your search or browse all properties.'
                : 'No properties match your current filters. Try adjusting your search criteria.'
              }
            </p>
            <div className="flex gap-2 justify-center">
              {getActiveFiltersCount() > 0 && (
                <button
                  onClick={() => {
                    handleFilterChange({
                      bhk: 'any',
                      furnishing: 'any',
                      priceRange: { min: null, max: null },
                      amenities: []
                    });
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Clear Filters
                </button>
              )}
              <button
                onClick={() => {
                  setSearchQuery('');
                  handleFilterChange({
                    bhk: 'any',
                    furnishing: 'any',
                    priceRange: { min: null, max: null },
                    amenities: []
                  });
                }}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                Reset Search
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Filter Modal */}
      {showFilters && (
        <FilterModal
          onClose={() => setShowFilters(false)}
          onApplyFilters={handleApplyFilters}
          currentFilters={{ ...filters, listingType }}
        />
      )}
    </div>
  );
}