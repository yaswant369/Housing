// src/components/PropertyCardExample.jsx
import React, { useState, useEffect } from 'react';
import PropertyCard from './PropertyCard';

const API_BASE_URL = 'http://localhost:5000';

export default function PropertyCardExample() {
  const [properties, setProperties] = useState([]);
  const [savedProperties, setSavedProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/api/properties`);
      if (!response.ok) {
        throw new Error('Failed to fetch properties');
      }
      const data = await response.json();
      setProperties(data.properties || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleSaved = (propertyId) => {
    setSavedProperties(prev => 
      prev.includes(propertyId) 
        ? prev.filter(id => id !== propertyId)
        : [...prev, propertyId]
    );
  };

  const handleViewDetails = (propertyId) => {
    alert(`View details for property ${propertyId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="bg-white rounded-lg border border-gray-200 p-3 animate-pulse">
                <div className="h-48 bg-gray-200 rounded mb-3"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-5 bg-gray-200 rounded w-1/3"></div>
                  <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <h2 className="text-red-800 font-medium text-lg mb-2">Error Loading Properties</h2>
            <p className="text-red-600 mb-4">{error}</p>
            <button 
              onClick={fetchProperties}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-1">
            Property Listings
          </h1>
          <p className="text-gray-600">
            Real properties from database ({properties.length} loaded)
          </p>
        </div>

        {/* Property Grid */}
        {properties.length === 0 ? (
          <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Properties Found</h3>
            <p className="text-gray-600">Add some properties to the database to see them here.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {properties.map((property) => (
              <PropertyCard
                key={property.id}
                property={property}
                isSaved={savedProperties.includes(property.id)}
                onToggleSaved={handleToggleSaved}
                onViewDetails={handleViewDetails}
                API_BASE_URL={API_BASE_URL}
                className="h-full"
              />
            ))}
          </div>
        )}

        {/* Info */}
        <div className="mt-8 bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-3">
            Simple & Professional Design
          </h2>
          <div className="text-sm text-gray-600 space-y-1">
            <p>• Clean property cards with clear images</p>
            <p>• Click on cards to view details</p>
            <p>• Backend integration with real property data</p>
            <p>• Responsive design (1-4 cards per row)</p>
          </div>
        </div>
      </div>
    </div>
  );
}