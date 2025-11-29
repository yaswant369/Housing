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
        if (!response.ok) throw new Error("Property not found");
        const data = await response.json();
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
        <h2 className="text-2xl font-bold">Property not found</h2>
        <button onClick={() => navigate('/')} className="text-blue-600">Go Home</button>
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