 // src/MyListingsPage.jsx
import React, { useContext } from 'react'; // 1. Import useContext
import { ArrowLeft, Edit, Trash2, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext.jsx'; // 2. Import AppContext

// This is a special card just for the "My Listings" page
function MyListingCard({ property, onEdit, onDelete, API_BASE_URL }) { // 3. Accept API_BASE_URL
  
  // 4. Create the correct image URL
  const imageUrl = (property.images && property.images.length > 0)
    ? `${API_BASE_URL}/${property.images[0]}`
    : 'https://placehold.co/400x300/e2e8f0/64748b?text=Image+Not+Found';

  return (
    <div className="flex items-center p-4 bg-white dark:bg-gray-800 rounded-2xl shadow-lg">
      <img
        src={imageUrl} // 5. Use the correct URL
        alt={property.type}
        className="w-24 h-24 rounded-lg object-cover flex-shrink-0"
        onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/400x300/e2e8f0/64748b?text=Image+Not+Found' }}
      />
      <div className="flex-1 ml-4">
        <p className="font-bold text-lg">{property.type}</p>
        <p className="text-blue-600 dark:text-blue-400 font-semibold">{property.price}</p>
        <div className="flex items-center space-x-1 text-gray-600 dark:text-gray-400 text-sm mt-1">
          <MapPin size={14} />
          <span>{property.location}</span>
        </div>
      </div>
      <div className="flex flex-col space-y-2">
        <button 
          onClick={() => onEdit(property)}
          className="p-2 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 rounded-full hover:bg-blue-200 dark:hover:bg-blue-800"
        >
          <Edit size={18} />
        </button>
        <button 
          onClick={() => onDelete(property.id)}
          className="p-2 bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-300 rounded-full hover:bg-red-200 dark:hover:bg-red-800"
        >
          <Trash2 size={18} />
        </button>
      </div>
    </div>
  );
}

export default function MyListingsPage() { // 6. Remove props
  const navigate = useNavigate(); 
  
  // 7. Get everything from context
  const { 
    currentUser, 
    properties: allProperties, 
    handleOpenEditModal, 
    handleDeleteProperty,
    API_BASE_URL 
  } = useContext(AppContext);

  // 8. Handle loading state
  if (!currentUser || !allProperties) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Loading...</p>
      </div>
    );
  }
  
  // Filter all properties to find only the ones matching the current user's ID
 // This is the fixed line (changed .id to ._id)
const myListings = allProperties.filter(property => property.userId === currentUser.id);
  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      {/* Header */}
      <header className="flex items-center p-4 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
        <button 
          onClick={() => navigate(-1)} 
          className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
        >
          <ArrowLeft size={20} />
        </button>
        <div className="flex-1 text-center">
          <h2 className="font-bold text-lg">My Posted Properties</h2>
        </div>
        <div className="w-8"></div>
      </header>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        {myListings.length > 0 ? (
          <div className="space-y-4">
            {myListings.map(property => (
              <MyListingCard 
                key={property.id} 
                property={property}
                onEdit={handleOpenEditModal}    // 9. Use context handler
                onDelete={handleDeleteProperty} // 10. Use context handler
                API_BASE_URL={API_BASE_URL}     // 11. Pass URL to card
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center text-gray-500 dark:text-gray-400">
            <h3 className="text-2xl font-bold mb-2">You haven't posted any properties yet.</h3>
            <p className="max-w-xs">
              Click the "Post" button in the navigation bar to get started.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}