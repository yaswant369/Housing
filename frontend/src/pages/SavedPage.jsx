 import React, { useContext, useEffect } from 'react';
import { ArrowLeft, Heart } from 'lucide-react';
import PropertyCard from '../components/PropertyCard.jsx';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext.jsx';

export default function SavedPage() {
  const navigate = useNavigate();

  const { 
    properties: allProperties, 
    savedPropertyIds, 
    onToggleSaved, // Renamed from handleToggleSaved to match context
    API_BASE_URL 
  } = useContext(AppContext);

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  
  const savedProperties = allProperties.filter(property => 
    savedPropertyIds.has(property.id)
  );
  
  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      {/* Main Header */}
      <header className="flex items-center p-4 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
        <button 
          onClick={() => navigate(-1)}
          className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
        >
          <ArrowLeft size={20} />
        </button>
        <div className="flex-1 text-center">
          <h2 className="font-bold text-lg">My Saved Properties</h2>
        </div>
        <div className="w-8"></div>
      </header>

      {/* Saved Properties Content */}
      <div className="flex-1 overflow-y-auto p-6">
        {savedProperties.length > 0 ? (
           
          
          /* #   Replaced 'grid' with 'flex flex-col' to fix layout  # */
          
          <div className="flex flex-col gap-6">
            {savedProperties.map(property => (
              <PropertyCard 
                key={property.id} 
                property={property}
                isSaved={true}
                onToggleSaved={onToggleSaved}
                onViewDetails={(id) => navigate(`/property/${id}`)}
                API_BASE_URL={API_BASE_URL} 
              />
            ))}
          </div>
           
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center text-gray-500 dark:text-gray-400">
            <Heart size={64} className="mb-4" />
            <h3 className="text-2xl font-bold mb-2">No Saved Properties</h3>
            <p className="max-w-xs">
              Tap the heart icon on any property to save it here for later.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}