 // src/components/properties/PropertiesSection.jsx
 import React from 'react';
 import { useNavigate } from 'react-router-dom';
 import PropertyCard from '../PropertyCard';
 import { ChevronRight } from 'lucide-react';
 
 export default function PropertiesSection({
   title,
   data,
   isFeaturedSection = false, // Default to standard layout
   onToggleSaved,
   onViewDetails,
   addToComparison,
   API_BASE_URL = 'http://localhost:5000',
   savedPropertyIds = new Set() // Make sure to pass this from HomePage
 }) {
   const navigate = useNavigate();

  // Show a message if no data
  if (!data || data.length === 0) {
    return (
      <section className="py-8 px-4">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4">{title}</h2>
        <p className="text-gray-500 dark:text-gray-400">No properties to display in this section.</p>
      </section>
    );
  }

  // --- RENDER LOGIC 1: Featured Section (Horizontal Scroller) ---
  if (isFeaturedSection) {
    return (
      <section className="py-8">
        {/* Section Header with "See all" button */}
        <div className="flex justify-between items-center mb-4 px-4">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">{title}</h2>
          <button
            onClick={() => navigate('/properties')}
            className="flex items-center text-blue-600 dark:text-blue-400 font-semibold hover:underline"
          >
            See all <ChevronRight size={18} />
          </button>
        </div>

        
        {/* Horizontal scroll grid */}
        <div className="grid grid-flow-col auto-cols-[calc(100%-1rem)] xs:auto-cols-[280px] sm:auto-cols-[320px] md:auto-cols-[350px] gap-4 sm:gap-6 overflow-x-auto px-2 xs:px-4 pb-4" style={{ paddingBottom: '16px' }}>
          {data.map(property => (
            <div key={property.id} className="h-full">
              <PropertyCard
                property={property}
                isSaved={savedPropertyIds.has(property.id)}
                onToggleSaved={onToggleSaved}
                onViewDetails={onViewDetails}
                addToComparison={addToComparison}
                API_BASE_URL={API_BASE_URL}
                className="h-full"
              />
            </div>
          ))}
        </div>
      </section>
    );
  }

  // --- RENDER LOGIC 2: Standard Section (Grid Layout for Modern Cards) ---
  return (
    <section className="py-8 px-4">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6">{title}</h2>

      {/* Modern grid layout optimized for the new card design */}
      <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
        {data.map(property => (
          <div key={property.id} className="h-full">
            <PropertyCard
              property={property}
              isSaved={savedPropertyIds.has(property.id)}
              onToggleSaved={onToggleSaved}
              onViewDetails={onViewDetails}
              addToComparison={addToComparison}
              API_BASE_URL={API_BASE_URL}
              className="h-full"
            />
          </div>
        ))}
      </div>
    </section>
  );
}