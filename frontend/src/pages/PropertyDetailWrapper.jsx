// src/pages/PropertyDetailWrapper.jsx
import React, { useState, useContext, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AppContext } from '../context/context';
import { API_URL } from '../context/constants';
import PropertyDetailPage from './PropertyDetailPage'; // Assumes PropertyDetailPage is in the same 'pages' folder

export default function PropertyDetailWrapper() {
  const { properties, savedPropertyIds, handleToggleSaved, API_BASE_URL } = useContext(AppContext);
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProperty = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${API_URL}/properties/${id}`);
        if (!response.ok) {
          if (response.status === 404) {
            throw new Error("Property not found. This property may have been deleted.");
          }
          throw new Error(`Failed to fetch property: ${response.status} ${response.statusText}`);
        }
        const data = await response.json();
        
        // Additional validation to ensure property data is valid
        if (!data || !data.id || !data.type || !data.location) {
          throw new Error("Property data is invalid or incomplete");
        }
        
        setProperty(data);
      } catch (error) {
        console.error("Failed to fetch property:", error);
        setProperty(null); 
      }
      setLoading(false);
    };

    fetchProperty();
  }, [id]); 

  if (loading) {
    return (
      <div className="flex justify-center items-center p-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="p-8 text-center">
        <div className="max-w-md mx-auto">
          <div className="mb-6">
            <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Property Unavailable</h2>
            <p className="text-gray-600 mb-4">
              This property may have been deleted by the owner or is no longer available.
            </p>
          </div>
          
          <div className="space-y-3">
            <button 
              onClick={() => navigate('/')} 
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Browse Properties
            </button>
            <button 
              onClick={() => navigate('/saved')} 
              className="w-full border border-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-50 transition-colors"
            >
              View Saved Properties
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <PropertyDetailPage
      property={property}
      onClose={() => navigate(-1)}
      isSaved={savedPropertyIds.has(property.id)}
      onToggleSaved={handleToggleSaved}
      allProperties={properties} 
      onViewDetails={(idOrPath) => {
        if (typeof idOrPath === 'string' && idOrPath.startsWith('/')) {
          // It's a full path, navigate to it
          navigate(idOrPath);
        } else {
          // It's a property ID, navigate to the property detail
          navigate(`/property/${idOrPath}`);
        }
      }}
      savedPropertyIds={savedPropertyIds}
      API_BASE_URL={API_BASE_URL}
    />
  );
}