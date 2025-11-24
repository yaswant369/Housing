 import React, { useState, useMemo, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import { 
  ArrowLeft, MapPin, Heart, Share2, Ruler, Building, Bath, Car, 
  ChevronLeft, ChevronRight, Video 
} from 'lucide-react';
import PropertyCard from '../components/PropertyCard.jsx';
import ExpandableText from '../components/ExpandableText';

// -------------------------------------------------------------------
// --- Property Media Gallery Component (No changes) ---
// -------------------------------------------------------------------
function PropertyMediaGallery({ property, API_BASE_URL }) {
  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // 1. Combine all media (images and video) into one array
  const mediaItems = useMemo(() => {
    const items = [];
    
    // Add all images
    const allImages = [
      ...(property.images || []), 
      ...(property.image ? [property.image] : [])
    ].filter(Boolean); // Filter out any null/undefined

    allImages.forEach(img => {
      items.push({
        type: 'image',
        url: `${API_BASE_URL}/${img.replace(/\\/g, '/')}`,
        thumbnail: `${API_BASE_URL}/${img.replace(/\\/g, '/')}`
      });
    });

    // Add video if it exists
    if (property.video) {
      items.push({
        type: 'video',
        url: `${API_BASE_URL}/${property.video.replace(/\\/g, '/')}`,
        thumbnail: null // We'll use an icon for the video thumbnail
      });
    }

    // Fallback if no media exists
    if (items.length === 0) {
      items.push({
        type: 'image',
        url: 'https://placehold.co/1200x800/e2e8f0/64748b?text=Image+Not+Found',
        thumbnail: 'https://placehold.co/100x100/e2e8f0/64748b?text=N/A'
      });
    }
    
    return items;
  }, [property, API_BASE_URL]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const currentMedia = mediaItems[currentIndex];

  const goToPrevious = () => {
    const isFirstSlide = currentIndex === 0;
    const newIndex = isFirstSlide ? mediaItems.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
  };

  const goToNext = () => {
    const isLastSlide = currentIndex === mediaItems.length - 1;
    const newIndex = isLastSlide ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
  };

  return (
    <div className="w-full">
      {/* Main Media Display (Fixes "cut off" bug) */}
      <div className="relative w-full bg-black rounded-2xl shadow-lg overflow-hidden aspect-video">
        {currentMedia.type === 'image' ? (
          <img 
            src={currentMedia.url} 
            alt="Property" 
            className="w-full h-full object-contain" // 'object-contain' prevents cutoff
          />
        ) : (
          <video 
            src={currentMedia.url} 
            controls 
            autoPlay 
            muted 
            className="w-full h-full object-contain"
          >
            Your browser does not support the video tag.
          </video>
        )}

        {/* --- ARROW FIX --- */}
        {/* Navigation Arrows: Made larger, brighter, and added hover effect */}
        {mediaItems.length > 1 && (
          <>
            <button 
              onClick={goToPrevious}
              className="absolute top-1/2 left-2 sm:left-4 -translate-y-1/2 bg-white/70 text-gray-900 p-2 rounded-full hover:bg-white transition-all z-10 shadow-lg transform hover:scale-110"
            >
              <ChevronLeft size={28} />
            </button>
            <button 
              onClick={goToNext}
              className="absolute top-1/2 right-2 sm:right-4 -translate-y-1/2 bg-white/70 text-gray-900 p-2 rounded-full hover:bg-white transition-all z-10 shadow-lg transform hover:scale-110"
            >
              <ChevronRight size={28} />
            </button>
          </>
        )}
      </div>

      {/* Thumbnail Scroller */}
      {mediaItems.length > 1 && (
        <div className="w-full mt-4 overflow-x-auto">
          <div className="flex space-x-3 p-2">
            {mediaItems.map((item, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-4 transition-all ${
                  index === currentIndex ? 'border-blue-500' : 'border-transparent hover:border-gray-400'
                }`}
              >
                {item.type === 'image' ? (
                  <img src={item.thumbnail} alt="thumbnail" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-gray-700 flex flex-col items-center justify-center text-white">
                    <Video size={24} />
                    <span className="text-xs mt-1">Video</span>
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// -------------------------------------------------------------------
// --- Property Detail Page Component (Route-based) ---
// -------------------------------------------------------------------
export default function PropertyDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { properties, savedPropertyIds, handleToggleSaved, API_BASE_URL, API_URL, token } = useContext(AppContext);
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Fetch property by ID (from context or backend)
  useEffect(() => {
    const fetchProperty = async () => {
      setLoading(true);
      setError(null);
      
      // First try to find in context
      const foundProperty = properties.find(p => p.id === parseInt(id));
      
      if (foundProperty) {
        setProperty(foundProperty);
        setLoading(false);
      } else {
        // If not found in context, fetch from backend
        try {
          const headers = {};
          if (token) {
            headers['Authorization'] = `Bearer ${token}`;
          }
          
          const response = await fetch(`${API_URL}/properties/${id}`, { headers });
          
          if (!response.ok) {
            if (response.status === 404) {
              setError('Property not found');
            } else {
              throw new Error('Failed to fetch property');
            }
          } else {
            const data = await response.json();
            setProperty(data);
          }
        } catch (err) {
          console.error('Error fetching property:', err);
          setError(err.message || 'Failed to load property');
        } finally {
          setLoading(false);
        }
      }
    };
    
    fetchProperty();
  }, [id, properties, API_URL, token]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading property...</p>
        </div>
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2 text-gray-900 dark:text-gray-100">Property Not Found</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">{error || "The property you're looking for doesn't exist."}</p>
          <button 
            onClick={() => navigate('/')}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Go Back Home
          </button>
        </div>
      </div>
    );
  }

  const isSaved = savedPropertyIds.has(property.id);
  
  const similarProperties = properties.filter(p => 
    p.id !== property.id && 
    p.bhk === property.bhk
  ).slice(0, 4);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 pt-20">
      {/* --- Header --- */}
      <header className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center">
          <button 
            onClick={() => navigate(-1)} 
            className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
          >
            <ArrowLeft size={20} />
          </button>
          <div className="flex-1 text-center">
            <h2 className="font-bold text-lg">{property.type}</h2>
          </div>
          <div className="w-10"></div>
        </div>
      </header>

      {/* Page Content (Scrollable) */}
      <div className="max-w-7xl mx-auto p-4 md:p-8">
        
        {/* --- Main Content Grid (Responsive) --- */}
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* --- Left Column: Media Gallery --- */}
          <div className="w-full lg:w-3/5">
            <PropertyMediaGallery property={property} API_BASE_URL={API_BASE_URL} />
          </div>

          {/* --- Right Column: Details --- */}
          <div className="w-full lg:w-2/5 flex-shrink-0">
            {/* Price & Actions */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Total Price</p>
                  <h1 className="text-3xl font-bold text-blue-600 dark:text-blue-400">{property.price}</h1>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleToggleSaved(property.id)}
                    className={`p-3 rounded-full transition-colors shadow-md ${
                      isSaved ? 'bg-red-500 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                    }`}
                    aria-label="Like property"
                  >
                    <Heart size={20} fill={isSaved ? "currentColor" : "none"} />
                  </button>
                  <button
                    className="p-3 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full shadow-md"
                    aria-label="Share property"
                  >
                    <Share2 size={20} />
                  </button>
                </div>
              </div>

              {/* Location */}
              <div className="mb-6">
                <h2 className="text-xl font-semibold mb-2">{property.type} for {property.status}</h2>
                <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 text-lg">
                  <MapPin size={20} />
                  <span className="font-medium">{property.location}</span>
                </div>
              </div>
              
              <button
                className="w-full bg-gradient-to-r from-blue-600 to-blue-800 text-white font-bold py-3 rounded-lg text-lg hover:from-blue-700 hover:to-blue-900 transition-colors shadow-lg"
              >
                Contact Agent
              </button>
            </div>

            {/* Key Details */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg mt-6">
              <h3 className="text-xl font-semibold mb-4">Key Details</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center space-x-3">
                  <Ruler size={24} className="text-blue-500 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-gray-500">Area</p>
                    <p className="font-bold">{property.area}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Building size={24} className="text-blue-500 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-gray-500">Type</p>
                    <p className="font-bold">{property.bhk} BHK</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Bath size={24} className="text-blue-500 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-gray-500">Bathrooms</p>
                    <p className="font-bold">{property.bathrooms || 'N/A'}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Car size={24} className="text-blue-500 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-gray-500">Parking</p>
                    <p className="font-bold">{property.coveredParking || 'N/A'} Covered</p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
        
        {/* --- Description (Full Width Below) --- */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg mt-6">
          <h3 className="text-xl font-semibold mb-2">Description</h3>

          <ExpandableText 
            text={property.description || `This stunning ${property.type} in the heart of ${property.location} is now available. 
            Boasting ${property.area} of space, this property is perfect for a family or as a premium investment.
            (This is a placeholder description).`}
            maxLength={400}
            className="text-gray-700 dark:text-gray-300 leading-relaxed"
          />
        </div>

        {/* --- Similar Properties (Full Width Below) --- */}
        {similarProperties.length > 0 && (
          <div className="mt-8">
            <h3 className="text-2xl font-semibold mb-4">Similar Properties You Might Like</h3>
              
            <div className="flex flex-col gap-6">
              {similarProperties.map(prop => (
                <PropertyCard
                  key={prop.id}
                  property={prop}
                  isSaved={savedPropertyIds.has(prop.id)}
                  onToggleSaved={handleToggleSaved}
                  onViewDetails={(p) => navigate(`/property/${p.id}`)}
                  API_BASE_URL={API_BASE_URL}
                />
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}