import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import PropertyEditPage from '../components/property-edit/PropertyEditPage';
import { ArrowLeft, Loader2, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

export default function PropertyEditPageWrapper() {
  const { propertyId } = useParams();
  const navigate = useNavigate();
  const {
    currentUser,
    properties,
    handleEditProperty,
    API_BASE_URL
  } = React.useContext(AppContext);

  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
      return;
    }

    if (!propertyId) {
      setError('Property ID is required');
      setLoading(false);
      return;
    }

    // Find the property from the context or fetch it
    const foundProperty = properties.find(p => p.id === parseInt(propertyId));
    
    if (foundProperty) {
      // Verify the property belongs to the current user
      if (foundProperty.userId !== currentUser.id && foundProperty.userId !== currentUser._id) {
        setError('You do not have permission to edit this property');
        setLoading(false);
        return;
      }
      setProperty(foundProperty);
      setLoading(false);
    } else {
      setError('Property not found');
      setLoading(false);
    }
  }, [propertyId, currentUser, properties, navigate]);

  const handleSave = async (propertyId, formData) => {
    try {
      // Convert plain object to FormData for backend compatibility
      const formDataToSend = new FormData();
      
      // Add all form fields to FormData
      Object.keys(formData).forEach(key => {
        const value = formData[key];
        if (value !== undefined && value !== null && value !== '') {
          // Handle arrays (like amenities, keyHighlights)
          if (Array.isArray(value)) {
            formDataToSend.append(key, JSON.stringify(value));
          }
          // Handle objects (like maintenance)
          else if (typeof value === 'object') {
            formDataToSend.append(key, JSON.stringify(value));
          }
          // Handle regular values
          else {
            formDataToSend.append(key, value.toString());
          }
        }
      });
      
      await handleEditProperty(propertyId, formDataToSend);
      toast.success('Property updated successfully');
      
      // Navigate back to my-listings page after successful save
      navigate('/my-listings');
    } catch (error) {
      toast.error('Failed to update property: ' + error.message);
      throw error; // Re-throw to let PropertyEditPage handle the error
    }
  };

  const handleChangeStatus = async (property, newStatus, additionalData = {}) => {
    try {
      const formData = new FormData();
      formData.append('status', newStatus);
      
      // Add additional data if provided
      Object.keys(additionalData).forEach(key => {
        if (additionalData[key] !== undefined && additionalData[key] !== null) {
          formData.append(key, additionalData[key]);
        }
      });
      
      await handleEditProperty(property.id, formData);
      toast.success(`Property ${newStatus === 'active' ? 'activated' : 'paused'} successfully`);
    } catch (error) {
      toast.error('Failed to change status: ' + error.message);
    }
  };

  const handleEditPhotos = (property) => {
    // Navigate to post wizard for photo editing
    navigate('/my-listings');
    // This could open the post wizard with the property for editing
  };

  const handleDuplicate = (property) => {
    // For now, just show a message
    toast.info('Duplicate feature coming soon');
  };

  const handlePreviewListing = (property) => {
    // Navigate to public property page
    navigate(`/property/${property.id}`);
  };

  const handleClose = () => {
    navigate('/my-listings');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50  flex items-center justify-center">
        <div className="flex items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          <span className="text-gray-900">Loading property...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50  flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="mx-auto h-12 w-12 text-red-500" />
          <h2 className="mt-2 text-lg font-medium text-gray-900">Error</h2>
          <p className="mt-1 text-gray-500">An error occurred while loading the property.</p>
          <button
            onClick={() => navigate('/my-listings')}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Back to My Properties
          </button>
        </div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen bg-gray-50  flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="mx-auto h-12 w-12 text-red-500" />
          <h2 className="mt-2 text-lg font-medium text-gray-900">Property Not Found</h2>
          <p className="mt-1 text-gray-500">The property you're looking for doesn't exist.</p>
          <button
            onClick={() => navigate('/my-listings')}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Back to My Properties
          </button>
        </div>
      </div>
    );
  }

  return (
    <PropertyEditPage
      property={property}
      isOpen={true} // Always open since this is a dedicated page
      onClose={handleClose}
      onSave={handleSave}
      onChangeStatus={handleChangeStatus}
      onEditPhotos={handleEditPhotos}
      onDuplicate={handleDuplicate}
      onPreviewListing={handlePreviewListing}
      API_BASE_URL={API_BASE_URL}
    />
  );
}
