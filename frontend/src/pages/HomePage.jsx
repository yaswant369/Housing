 import React, { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { WifiOff } from 'lucide-react';
import { AppContext } from '../context/context';
import PropertiesSection from '../components/properties/PropertiesSection';
import PropertiesSectionSkeleton from '../components/properties/PropertiesSectionSkeleton';

export default function HomePage() {
  const { 
    properties, loading, error, 
    savedPropertyIds, handleToggleSaved,
    hasMore, loadMoreProperties, API_BASE_URL,
    // --- NEW CONTEXT VALUES ---
    propertyType, // 'Residential', 'Commercial', etc.
    listingType,  // 'Buy', 'Rent'
    searchTerm, 
    filters 
  } = useContext(AppContext);
  
  const navigate = useNavigate();

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // --- ADVANCED FILTERING LOGIC ---
  const filteredProperties = React.useMemo(() => {
    return properties.filter(property => {
      if (!property || !property.location || !property.type) return false; 
      
      // 1. Filter by Main Property Type (Residential, Commercial, Plots, PG, Projects)
      // Check both propertyKind and propertyType fields for compatibility
      const propertyKind = property.propertyKind || property.propertyType || 'Residential';
      if (propertyKind !== propertyType) {
        return false;
      }

      // 2. Filter by Listing Type (Buy/Rent/Sell)
      let matchesListingType = false;
      if (listingType === 'any') {
        matchesListingType = true;
      } else if (listingType === 'Buy' || listingType === 'Sell') {
        matchesListingType = property.status === 'For Sale' || property.lookingTo === 'Sell';
      } else if (listingType === 'Rent') {
        matchesListingType = property.status === 'For Rent' || property.lookingTo === 'Rent';
      }
      
      // For Projects, PG, and Plots, show all (no listing type filter)
      if (propertyType === 'Projects' || propertyType === 'PG' || propertyType === 'Plots') {
        matchesListingType = true; // Always show these
      }
      
      if (!matchesListingType) {
        return false;
      }
      
      // 3. Filter by Search Term
      const matchesSearch = property.location.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            property.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            (property.buildingName && property.buildingName.toLowerCase().includes(searchTerm.toLowerCase()));

      if (!matchesSearch) return false;

      // 4. Filter by Advanced Filters (BHK, Price, etc.)
      // Only apply BHK/furnishing filters for Residential
      if (propertyType === 'Residential') {
        const matchesBhk = filters.bhk === 'any' || (filters.bhk === '5' ? property.bhk >= 5 : property.bhk === parseInt(filters.bhk));
        if (!matchesBhk) return false;

        const matchesFurnishing = filters.furnishing === 'any' || property.furnishing === filters.furnishing;
        if (!matchesFurnishing) return false;
      }
      
      // Apply Price filters to all
      const matchesMinPrice = !filters.minPrice || property.priceValue >= parseInt(filters.minPrice);
      const matchesMaxPrice = !filters.maxPrice || property.priceValue <= parseInt(filters.maxPrice);
      
      return matchesMinPrice && matchesMaxPrice;
    });
  }, [properties, propertyType, listingType, searchTerm, filters]);


  if (loading && properties.length === 0) { 
    return <PropertiesSectionSkeleton title={`Loading ${propertyType}...`} />;
  }

  if (error) {
    return (
      <div className="p-8 text-center text-red-500">
        <WifiOff size={48} className="mx-auto mb-4" />
        <h2 className="text-2xl font-bold mb-2">Failed to Load Properties</h2>
        <p>{error}</p>
        <p>Please check your backend server or network connection.</p>
      </div>
    );
  }
  
  // --- Dynamic Sections ---
  // Now we filter the *already filtered* list
  const featured = filteredProperties.filter(p => p.isFeatured);
  const others = filteredProperties.filter(p => !p.isFeatured);

  return (
    <>
      {featured.length > 0 && (
        <PropertiesSection
          title={`Featured ${propertyType} for ${listingType}`}
          data={featured}
          isFeaturedSection={true}
          onToggleSaved={handleToggleSaved}
          onViewDetails={(id) => navigate(`/property/${id}`)}
          API_BASE_URL={API_BASE_URL}
          savedPropertyIds={savedPropertyIds}
        />
      )}
      
      <PropertiesSection 
        title={`${propertyType} for ${listingType} in your Area`}
        data={others} // Show all non-featured results in the main list
        isFeaturedSection={false}
        onToggleSaved={handleToggleSaved}
        onViewDetails={(id) => navigate(`/property/${id}`)}
        API_BASE_URL={API_BASE_URL}
        savedPropertyIds={savedPropertyIds}
      />
      
      {/* Show 'No Results' message only if not loading */}
      {!loading && filteredProperties.length === 0 && (
        <div className="p-8 text-center text-gray-500">
          <h2 className="text-2xl font-bold mb-2">No Properties Found</h2>
          <p>Try adjusting your search or filters.</p>
        </div>
      )}
      
      {hasMore && !loading && ( 
        <div className="text-center p-6">
          <button
            onClick={loadMoreProperties}
            className="bg-blue-600 text-white font-bold py-3 px-8 rounded-full hover:bg-blue-700 transition-colors"
          >
            Load More
          </button>
        </div>
      )}
      {loading && properties.length > 0 && ( 
        <div className="flex justify-center items-center p-6">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      )}
    </>
  );
}