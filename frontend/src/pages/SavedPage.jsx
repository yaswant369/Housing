 import React, { useContext, useEffect } from 'react';
import { ArrowLeft, Heart } from 'lucide-react';
import PropertyCard from '../components/PropertyCard.jsx';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../context/context';

export default function SavedPage() {
  const navigate = useNavigate();

  const { 
    properties: allProperties, 
    savedPropertyIds, 
    onToggleSaved, // Renamed from handleToggleSaved to match context
    addToComparison,
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
      <div className="flex-1 overflow-y-auto p-4">
        {savedProperties.length > 0 ? (
          /* # Better grid layout for saved properties with optimal sizing # */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {savedProperties.map(property => (
              <PropertyCard 
                key={property.id}
                property={property}
                isSaved={true}
                onToggleSaved={onToggleSaved}
                addToComparison={addToComparison}
                onViewDetails={(id) => navigate(`/property/${id}`)}
                API_BASE_URL={API_BASE_URL}
                variant="compact"
                className="h-full"
              />
            ))}
          </div>
           
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center text-gray-500 dark:text-gray-400 px-8">
            <div className="bg-gray-100 dark:bg-gray-800 rounded-full p-6 mb-6">
              <Heart size={48} className="text-gray-400" />
            </div>
            <h3 className="text-2xl font-bold mb-3">No Saved Properties</h3>
            <p className="text-sm leading-relaxed max-w-sm">
              Start exploring properties and tap the heart icon to save your favorites here.
            </p>
            <button
              onClick={() => navigate('/')}
              className="mt-6 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-full font-medium transition-colors"
            >
              Browse Properties
            </button>
          </div>
        )}
      </div>
    </div>
  );
}