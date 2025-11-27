import React, { useState, useMemo, useEffect, useContext, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AppContext } from '../context/context';
import toast from 'react-hot-toast';
import {
  ArrowLeft, MapPin, Heart, Share2, Ruler, Building, Bath, Car,
  ChevronLeft, ChevronRight, Video, Copy, Camera, Maximize, Star, CheckCircle, ArrowUpDown,
  BatteryCharging, Dumbbell, Waves, Home, Trees, Shield, Flame, CloudRain, Compass, Calendar,
  Lock, FileText, Building2, Globe
} from 'lucide-react';
import PropertyCard from '../components/PropertyCard.jsx';
import ExpandableText from '../components/ExpandableText';
import ImageZoomModal from '../components/ImageZoomModal';

import { Pannellum } from 'react-pannellum';

// ...

// -------------------------------------------------------------------
// --- Property Media Gallery Component - ADVANCED VERSION ---
// -------------------------------------------------------------------
function PropertyMediaGallery({ property, API_BASE_URL }) {
  const [currentTabIndex, setCurrentTabIndex] = useState(0); // 0: Photos, 1: Video, 2: 360 View
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showZoomModal, setShowZoomModal] = useState(false);

  // Memoize media assets
  const { allImages, videoUrl, hasVideo, has360 } = useMemo(() => {
    const images = [...(property.images || []), ...(property.image ? [property.image] : [])]
      .filter(Boolean)
      .map(img => {
        if (!img) return null;
        if (typeof img === 'string') {
          const clean = img.replace(/\\/g, '/');
          return clean.startsWith('http') ? clean : `${API_BASE_URL}${clean.startsWith('/') ? '' : '/'}${clean}`;
        }
        const url = img.optimized || img.medium || img.thumbnail;
        if (!url) return null;
        const clean = url.replace(/\\/g, '/');
        return clean.startsWith('http') ? clean : `${API_BASE_URL}${clean.startsWith('/') ? '' : '/'}${clean}`;
      }).filter(Boolean);

    const vidUrl = property.video ? `${API_BASE_URL}/${property.video.replace(/\\/g, '/')}` : null;
    const is360 = property.is360 || (property.images && property.images.some(i => i.is360));

    return {
      allImages: images,
      videoUrl: vidUrl,
      hasVideo: !!vidUrl,
      has360: is360
    };
  }, [property, API_BASE_URL]);

  const currentImage = allImages[currentImageIndex];
  const hasMultipleImages = allImages.length > 1;

  const goToPrevious = () => setCurrentImageIndex(prev => (prev === 0 ? allImages.length - 1 : prev - 1));
  const goToNext = () => setCurrentImageIndex(prev => (prev === allImages.length - 1 ? 0 : prev + 1));

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (currentTabIndex === 0 && hasMultipleImages) {
        if (e.key === 'ArrowLeft') goToPrevious();
        if (e.key === 'ArrowRight') goToNext();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentTabIndex, currentImageIndex, allImages.length]);
  
  const tabs = [{ label: 'Photos', icon: 'Camera' }];
  if (hasVideo) tabs.push({ label: 'Video', icon: 'Video' });
  if (has360) tabs.push({ label: '360° View', icon: 'Globe' });

  return (
    <div className="w-full">
      {/* Tabs */}
      <div className="flex border-b border-gray-200 dark:border-gray-700 mb-4">
        {tabs.map((tab, index) => (
          <button
            key={index}
            onClick={() => setCurrentTabIndex(index)}
            className={`flex items-center gap-2 px-4 py-3 font-semibold border-b-2 ${
              currentTabIndex === index
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-800 dark:hover:text-gray-200'
            }`}
          >
            <Icon name={tab.icon} size={18} />
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Main Media Display */}
      <div className="relative w-full h-96 bg-gray-100 rounded-2xl shadow-lg overflow-hidden"> {/* Fixed height of h-96 (24rem = 384px) */}
        {currentTabIndex === 0 && (() => {
          // Check if we have any valid images
          const hasValidImages = allImages && allImages.length > 0 && allImages[0];
          
          if (hasValidImages) {
            return (
              <>
                <img
                  src={currentImage}
                  alt="Property"
                  className="w-full h-full object-contain"
                  onError={(e) => { 
                    e.target.src = 'https://placehold.co/800x600/e2e8f0/64748b?text=Image+Not+Found'; 
                  }}
                />
                {hasMultipleImages && (
                  <>
                    <button onClick={goToPrevious} className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/70 hover:bg-white p-3 rounded-full z-10">
                      <ChevronLeft size={24} />
                    </button>
                    <button onClick={goToNext} className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/70 hover:bg-white p-3 rounded-full z-10">
                      <ChevronRight size={24} />
                    </button>
                    <div className="absolute bottom-4 left-4 bg-black/60 text-white px-3 py-1 rounded-full text-sm">
                      {currentImageIndex + 1} / {allImages.length}
                    </div>
                  </>
                )}
                <button
                    onClick={() => setShowZoomModal(true)}
                    className="absolute top-4 right-4 bg-white/70 hover:bg-white p-3 rounded-full z-10"
                    title="Fullscreen"
                >
                    <Maximize size={20} />
                </button>
              </>
            );
          } else {
            // Show "No Image" placeholder
            return (
              <div className="w-full h-full flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-800">
                <div className="text-gray-400 dark:text-gray-500 text-6xl mb-4">📷</div>
                <div className="text-gray-600 dark:text-gray-400 text-lg font-medium mb-2">No Image Available</div>
                <div className="text-gray-500 dark:text-gray-500 text-sm">Property images will appear here</div>
              </div>
            );
          }
        })()}
        
        {currentTabIndex === 1 && (() => {
          if (videoUrl) {
            return (
              <video src={videoUrl} controls className="w-full h-full object-contain" />
            );
          } else {
            return (
              <div className="w-full h-full flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-800">
                <div className="text-gray-400 dark:text-gray-500 text-6xl mb-4">🎥</div>
                <div className="text-gray-600 dark:text-gray-400 text-lg font-medium mb-2">No Video Available</div>
                <div className="text-gray-500 dark:text-gray-500 text-sm">Property video will appear here</div>
              </div>
            );
          }
        })()}
        
        {currentTabIndex === 2 && (() => {
          if (has360 && currentImage) {
            return (
              <Pannellum
                width="100%"
                height="100%"
                image={currentImage}
                pitch={10}
                yaw={180}
                hfov={110}
                autoLoad
                showZoomCtrl={false}
                onLoad={() => console.log("360 view loaded")}
              >
                <Pannellum.Hotspot type="info" pitch={11} yaw={-167} text="Entrance" />
              </Pannellum>
            );
          } else {
            return (
              <div className="w-full h-full flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-800">
                <div className="text-gray-400 dark:text-gray-500 text-6xl mb-4">🌐</div>
                <div className="text-gray-600 dark:text-gray-400 text-lg font-medium mb-2">No 360° View Available</div>
                <div className="text-gray-500 dark:text-gray-500 text-sm">360° virtual tour will appear here</div>
              </div>
            );
          }
        })()}
      </div>

      {/* Thumbnail Scroller for Photos */}
      {currentTabIndex === 0 && hasMultipleImages && (
        <div className="w-full mt-4 overflow-x-auto pb-2">
          <div className="flex space-x-3 px-2">
            {allImages.map((imgUrl, index) => (
              <button
                key={index}
                onClick={() => setCurrentImageIndex(index)}
                className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-4 transition-all ${
                  index === currentImageIndex ? 'border-blue-500 ring-2 ring-blue-200' : 'border-transparent hover:border-gray-400 hover:ring-2 hover:ring-gray-200'
                }`}
              >
                <img 
                  src={imgUrl} 
                  alt={`Thumbnail ${index + 1}`} 
                  className="w-full h-full object-contain bg-gray-800" // Changed to object-contain for thumbnails
                  onError={(e) => {
                    e.target.src = 'https://placehold.co/80x80/e2e8f0/64748b?text=+';
                  }}
                />
              </button>
            ))}
          </div>
        </div>
      )}

      {showZoomModal && (
        <ImageZoomModal
          images={allImages.map(url => ({ optimized: url, medium: url, thumbnail: url }))}
          initialIndex={currentImageIndex}
          onClose={() => setShowZoomModal(false)}
          API_BASE_URL=""
        />
      )}
    </div>
  );
}



// -------------------------------------------------------------------
// --- NEW: Detailed Section Components ---
// -------------------------------------------------------------------

// Helper for icons
const iconComponents = {
  ArrowLeft, MapPin, Heart, Share2, Ruler, Building, Bath, Car,
  ChevronLeft, ChevronRight, Video, Copy, Camera, Maximize, Star, CheckCircle, ArrowUpDown,
  BatteryCharging, Dumbbell, Waves, Home, Trees, Shield, Flame, CloudRain, Compass, Calendar,
  Lock, FileText, Building2, Globe
};

const Icon = ({ name, ...props }) => {
  const LucideIcon = iconComponents[name];
  return LucideIcon ? <LucideIcon {...props} /> : null;
};

function KeyHighlightsSection({ highlights }) {
  if (!highlights || highlights.length === 0) return null;
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg mt-6">
      <h3 className="text-xl font-semibold mb-4">Key Highlights</h3>
      <div className="flex flex-wrap gap-3">
        {highlights.map((highlight, index) => (
          <div key={index} className="flex items-center bg-blue-50 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-sm font-medium px-3 py-1 rounded-full">
            <Icon name="Star" className="w-4 h-4 mr-2" />
            <span>{highlight}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function AmenitiesSection({ amenities }) {
  if (!amenities || amenities.length === 0) return null;
  const amenityIcons = {
    Lift: 'ArrowUpDown',
    'Power Backup': 'BatteryCharging',
    Gym: 'Dumbbell',
    'Swimming Pool': 'Waves',
    Clubhouse: 'Home',
    Park: 'Trees',
    Security: 'Shield',
    'Visitor Parking': 'Car',
    'Piped Gas': 'Flame',
    'Rainwater Harvesting': 'CloudRain',
    'Vaastu Compliant': 'Compass',
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg mt-6">
      <h3 className="text-xl font-semibold mb-4">Amenities</h3>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {amenities.map((amenity, index) => (
          <div key={index} className="flex items-center space-x-3">
            <Icon name={amenityIcons[amenity] || 'CheckCircle'} className="w-6 h-6 text-blue-500 flex-shrink-0" />
            <span className="font-medium">{amenity}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function DetailsSection({ property }) {
  const details = [
    { label: 'Facing', value: property.facing, icon: 'Compass' },
    { label: 'Property on Floor', value: property.propertyOnFloor, icon: 'Building2' },
    { label: 'Total Floors', value: property.totalFloors, icon: 'Building' },
    { label: 'Property Age', value: property.propertyAge, icon: 'Calendar' },
    { label: 'Gated Community', value: property.gatedCommunity ? 'Yes' : 'No', icon: 'Lock' },
    { label: 'RERA ID', value: property.reraId, icon: 'FileText' },
  ].filter(d => d.value);

  if (details.length === 0) return null;

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg mt-6">
      <h3 className="text-xl font-semibold mb-4">Additional Details</h3>
      <div className="grid grid-cols-2 gap-4">
        {details.map(detail => (
          <div key={detail.label} className="flex items-center space-x-3">
            <Icon name={detail.icon} className="text-blue-500 flex-shrink-0" size={24} />
            <div>
              <p className="text-sm text-gray-500">{detail.label}</p>
              <p className="font-bold">{detail.value}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function PriceDetailsSection({ property }) {
  const { priceIncludes, maintenance } = property;
  if ((!priceIncludes || priceIncludes.length === 0) && (!maintenance || !maintenance.amount)) return null;

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg mt-6">
      <h3 className="text-xl font-semibold mb-4">Price Details</h3>
      {priceIncludes && priceIncludes.length > 0 && (
        <div className="mb-4">
          <h4 className="font-semibold mb-2">Price Includes:</h4>
          <div className="flex flex-wrap gap-2">
            {priceIncludes.map((item, i) => <span key={i} className="text-sm bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded">{item}</span>)}
          </div>
        </div>
      )}
      {maintenance && maintenance.amount && (
        <div>
          <h4 className="font-semibold mb-2">Maintenance</h4>
          <p className="font-bold">₹{maintenance.amount.toLocaleString()} <span className="text-sm font-normal text-gray-500">({maintenance.period})</span></p>
        </div>
      )}
    </div>
  );
}

function LandmarksSection({ landmarks }) {
  if (!landmarks || landmarks.length === 0) return null;
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg mt-6">
      <h3 className="text-xl font-semibold mb-4">Nearby Landmarks</h3>
      <ul className="list-disc list-inside space-y-1">
        {landmarks.map((landmark, i) => <li key={i}>{landmark}</li>)}
      </ul>
    </div>
  );
}

// NEW: MapView placeholder component
function MapView({ location }) {
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg mt-6">
       <h3 className="text-xl font-semibold mb-4">Location Map</h3>
       <div className="relative h-64 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center">
         <img 
            src="https://www.mapsofindia.com/maps/andhrapradesh/tehsil/nellore-tehsil-map.jpg"
            alt="Map placeholder"
            className="w-full h-full object-cover rounded-lg"
         />
         <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center text-white p-4">
            <MapPin size={32} className="mb-2"/>
            <p className="text-center font-bold text-lg">{location}</p>
            <p className="text-center font-semibold mt-2 bg-white/20 px-3 py-1 rounded-full">Map functionality coming soon</p>
         </div>
       </div>
     </div>
   );
 }

// -------------------------------------------------------------------
// --- Property Detail Page Component (Route-based) ---
// -------------------------------------------------------------------
export default function PropertyDetailPage({
  property: propProperty,
  onClose,
  isSaved: propIsSaved,
  onToggleSaved: propOnToggleSaved,
  allProperties: propAllProperties,
  onViewDetails,
  savedPropertyIds: propSavedPropertyIds,
  API_BASE_URL: propApiBaseUrl
}) {
  // Determine if we're being used as a standalone route or as a wrapped component
  const isStandalone = !propProperty;
  const navigate = isStandalone ? useNavigate() : null;
  const { id } = isStandalone ? useParams() : { id: null };
  
  // Use props if provided (from wrapper), otherwise use context for standalone mode
  const {
    properties: contextProperties,
    savedPropertyIds: contextSavedPropertyIds,
    handleToggleSaved: contextHandleToggleSaved,
    API_BASE_URL: contextApiBaseUrl,
    API_URL,
    token
  } = isStandalone ? useContext(AppContext) : {};
  
  // Use props or context values
  const properties = propProperty ? propAllProperties : contextProperties;
  const savedPropertyIds = propProperty ? propSavedPropertyIds : contextSavedPropertyIds;
  const handleToggleSaved = propProperty ? propOnToggleSaved : contextHandleToggleSaved;
  const API_BASE_URL = propProperty ? propApiBaseUrl : contextApiBaseUrl;
  
  // Local state for standalone mode
  const [property, setProperty] = useState(propProperty || null);
  const [loading, setLoading] = useState(propProperty ? false : true);
  const [error, setError] = useState(null);

  // Sticky header state and ref (declare hooks before any early returns)
  // Removed sticky header functionality per user request
  const mainDetailsRef = useRef(null);

  // Derived values used in the UI (declare before early returns to keep hook order stable)
  const isSaved = propProperty ? propIsSaved : (savedPropertyIds ? savedPropertyIds.has(property?.id) : false);

  const similarProperties = useMemo(() => {
    if (!properties || !property || !property.id) {
      console.log('Similar properties filtered out - missing data:', { 
        hasProperties: !!properties, 
        propertyCount: properties?.length, 
        hasProperty: !!property, 
        propertyId: property?.id 
      });
      return [];
    }
    try {
      const filtered = properties
        .filter(p => {
          const isValid = p && p.id && p.id !== property.id;
          if (!isValid) {
            console.log('Property filtered out:', { 
              hasId: !!(p && p.id), 
              pId: p?.id, 
              currentId: property.id 
            });
          }
          return isValid;
        })
        .filter(p => {
          const hasLocation = p.location && property.location;
          const locationMatch = hasLocation && p.location === property.location;
          if (!locationMatch) {
            console.log('Location mismatch:', { 
              pLocation: p.location, 
              currentLocation: property.location 
            });
          }
          return locationMatch;
        })
        .slice(0, 6);
      
      console.log('Similar properties found:', filtered.length, filtered.map(p => p.id));
      return filtered;
    } catch (e) {
      console.error('Error filtering similar properties:', e);
      return [];
    }
  }, [properties, property]);

  // Scroll to top when component mounts (only for standalone mode)
  useEffect(() => {
    if (isStandalone) {
      window.scrollTo(0, 0);
    }
  }, [isStandalone]);

  // Fetch property by ID (only for standalone mode, when no propProperty is provided)
  useEffect(() => {
    if (!isStandalone || propProperty) {
      // In wrapper mode or when property is already provided, don't fetch
      setLoading(false);
      return;
    }

    const fetchProperty = async () => {
      // Validate id parameter
      if (!id || id === 'undefined') {
        setError('Invalid property ID');
        setLoading(false);
        return;
      }

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
          
          console.log(`Fetching property with ID: ${id}`);
          const response = await fetch(`${API_URL}/properties/${id}`, { headers });
          
          if (!response.ok) {
            if (response.status === 404) {
              setError('Property not found');
            } else {
              throw new Error(`Failed to fetch property: ${response.status} ${response.statusText}`);
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
    
    if (id) {
      fetchProperty();
    } else {
      setError('No property ID provided');
      setLoading(false);
    }
  }, [id, properties, API_URL, token, isStandalone, propProperty]);

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
    const handleGoBack = () => {
      if (isStandalone) {
        navigate('/');
      } else if (onClose) {
        onClose();
      }
    };

    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2 text-gray-900 dark:text-gray-100">Property Not Found</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">{error || "The property you're looking for doesn't exist."}</p>
          <button 
            onClick={handleGoBack}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            {isStandalone ? 'Go Back Home' : 'Go Back'}
          </button>
        </div>
      </div>
    );
  }

 

  // Sticky header logic is declared above to ensure hooks order remains stable

  const handleShare = async (e) => {
    e.preventDefault();
    try {
      if (navigator.share) {
        await navigator.share({
          title: `${property.type} for ${property.status}`,
          text: `Check out this ${property.type} in ${property.location} for ${property.price}`,
          url: window.location.href,
        });
      } else {
        // Fallback: copy to clipboard
        await navigator.clipboard.writeText(window.location.href);
        toast.success('Property link copied to clipboard!');
      }
    } catch (err) {
      console.error('Error sharing:', err);
      toast.error('Failed to share property');
    }
  };

  const handleContactClick = () => {
    // Replace with your actual contact logic (e.g., scroll to form, open modal)
    toast.success('Contact button clicked!');
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      
      {/* --- Compact Header (Only show back button) --- */}
      {isStandalone && (
        <header className="bg-white dark:bg-gray-800 shadow-sm sticky top-0 z-40">
          <div className="max-w-7xl mx-auto px-4 py-3 flex items-center">
            <button 
              onClick={() => navigate(-1)} 
              className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              title="Go Back"
            >
              <ArrowLeft size={20} />
            </button>
            <div className="flex-1 text-center">
              <h2 className="font-bold text-base text-gray-900 dark:text-gray-100">{property?.type || 'Property Details'}</h2>
            </div>
            <div className="w-10"></div>
          </div>
        </header>
      )}

      {/* Page Content (Scrollable) */}
      <div className="max-w-7xl mx-auto p-4 md:p-8">
        
        {/* --- Main Content Grid (Responsive) --- */}
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* --- Left Column: Media and Descriptions --- */}
          <div className="w-full lg:w-3/5">
            <PropertyMediaGallery property={property} API_BASE_URL={API_BASE_URL} />
            
            <KeyHighlightsSection highlights={property.keyHighlights} />
            
            {/* Description */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg mt-6">
              <h3 className="text-xl font-semibold mb-2">Description</h3>
              <ExpandableText 
                text={property.description || `(No description provided)`}
                maxLength={400}
                className="text-gray-700 dark:text-gray-300 leading-relaxed"
              />
            </div>
            
            <AmenitiesSection amenities={property.amenities} />
            <DetailsSection property={property} />
            <PriceDetailsSection property={property} />
            <LandmarksSection landmarks={property.nearbyLandmarks} />
            <MapView location={property.location} />

          </div>

          {/* --- Right Column: Core Details & Actions --- */}
          <div className="w-full lg:w-2/5 flex-shrink-0">
            <div ref={mainDetailsRef} className="sticky top-20">
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
                        isSaved ? 'bg-red-500 text-white' : 'bg-gray-200 dark:bg-gray-700'
                      }`}
                    >
                      <Heart size={20} fill={isSaved ? "currentColor" : "none"} />
                    </button>
                    <button
                      onClick={handleShare}
                      className="p-3 bg-gray-200 dark:bg-gray-700 rounded-full shadow-md"
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
                  onClick={handleContactClick}
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-800 text-white font-bold py-3 rounded-lg text-lg hover:from-blue-700 hover:to-blue-900 transition-colors shadow-lg"
                >
                  Contact Agent
                </button>
              </div>

              {/* Basic Details */}
              <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg mt-6">
                <h3 className="text-xl font-semibold mb-4">Basic Details</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center space-x-3">
                    <Ruler size={24} className="text-blue-500" />
                    <div>
                      <p className="text-sm text-gray-500">Area</p>
                      <p className="font-bold">{property.area}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Building size={24} className="text-blue-500" />
                    <div>
                      <p className="text-sm text-gray-500">Type</p>
                      <p className="font-bold">{property.bhk} BHK</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Bath size={24} className="text-blue-500" />
                    <div>
                      <p className="text-sm text-gray-500">Bathrooms</p>
                      <p className="font-bold">{property.bathrooms || 'N/A'}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Car size={24} className="text-blue-500" />
                    <div>
                      <p className="text-sm text-gray-500">Parking</p>
                      <p className="font-bold">{property.coveredParking || 'N/A'} Covered</p>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
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
                  onViewDetails={(id) => {
                    console.log('Similar property clicked with ID:', id);
                    if (!id) {
                      console.error('Property clicked has no ID');
                      toast.error('Invalid property ID');
                      return;
                    }
                    if (isStandalone) {
                      navigate(`/property/${id}`);
                    } else if (onViewDetails) {
                      onViewDetails(id);
                    }
                  }}
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