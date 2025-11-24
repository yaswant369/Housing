 // src/components/properties/PropertiesSection.jsx
import React from 'react';
import PropertyCard from '../PropertyCard'; // Adjust path if needed
import { ChevronRight } from 'lucide-react';

export default function PropertiesSection({
  title,
  data,
  isFeaturedSection = false, // Default to standard layout
  onToggleSaved,
  onViewDetails,
  API_BASE_URL,
  savedPropertyIds // Make sure to pass this from HomePage
}) {

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
  // Uses the vertical card layout, as it's constrained by the grid cell
  if (isFeaturedSection) {
    return (
      <section className="py-8">
        {/* Section Header with "See all" button */}
        <div className="flex justify-between items-center mb-4 px-4">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">{title}</h2>
          <button className="flex items-center text-blue-600 dark:text-blue-400 font-semibold hover:underline">
            See all <ChevronRight size={18} />
          </button>
        </div>
        
        {/* This grid creates the horizontal scroller. 
          - auto-cols-[calc(100%-2rem)] makes it snap on mobile
          - sm:auto-cols-[320px] gives it a fixed width on desktop
        */}
        <div className="grid grid-flow-col auto-cols-[calc(100%-2rem)] sm:auto-cols-[320px] gap-6 overflow-x-auto px-4" style={{ paddingBottom: '16px' }}>
          {data.map(property => (
            <PropertyCard
              key={property.id}
              property={property}
              isSaved={savedPropertyIds.has(property.id)}
              onToggleSaved={onToggleSaved}
              onViewDetails={onViewDetails}
              API_BASE_URL={API_BASE_URL}
            />
          ))}
        </div>
      </section>
    );
  }

  // --- RENDER LOGIC 2: Standard Section (Vertical List of Wide Cards) ---
  // This is the FIX for your broken layout.
  return (
    <section className="py-8 px-4">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6">{title}</h2>
      
      {/* This flex-col layout gives each PropertyCard 100% width,
        allowing it to switch to its wide, horizontal (sm:flex-row) layout.
      */}
      <div className="flex flex-col gap-6">
        {data.map(property => (
          <PropertyCard
            key={property.id}
            property={property}
            isSaved={savedPropertyIds.has(property.id)}
            onToggleSaved={onToggleSaved}
            onViewDetails={onViewDetails}
            API_BASE_URL={API_BASE_URL}
          />
        ))}
      </div>
    </section>
  );
}