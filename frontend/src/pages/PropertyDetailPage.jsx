import React, { useState, useMemo, useEffect, useContext, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AppContext } from '../context/context';
import toast from 'react-hot-toast';
import {
  ArrowLeft, MapPin, Heart, Share2, Ruler, Building, Bath, Car,
  ChevronLeft, ChevronRight, Video, Copy, Camera, Maximize, Star, CheckCircle, ArrowUpDown,
  BatteryCharging, Dumbbell, Waves, Home, Trees, Shield, Flame, CloudRain, Compass, Calendar,
  Lock, FileText, Building2, Globe, Phone, MessageSquare, Calculator, Eye, 
  TrendingUp, Users, Clock, Award, Filter, Grid, List, Search, Play, Pause,
  ExternalLink, Bookmark, Flag, AlertTriangle, Info, Wifi, Zap, ShieldCheck, Bed,
  Sofa, CarFront, Handshake, Mail, Clock3, BarChart3, FilterX
} from 'lucide-react';
import PropertyCard from '../components/PropertyCard.jsx';
import ExpandableText from '../components/ExpandableText';
import ImageZoomModal from '../components/ImageZoomModal';

import { Pannellum } from 'react-pannellum';

// -------------------------------------------------------------------
// --- Property Media Gallery Component - ADVANCED VERSION ---
// -------------------------------------------------------------------
function PropertyMediaGallery({ property, API_BASE_URL }) {
  const [currentTabIndex, setCurrentTabIndex] = useState(0); // 0: Photos, 1: Video, 2: 360 View
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showZoomModal, setShowZoomModal] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [slideshowActive, setSlideshowActive] = useState(false);
  const [autoplayInterval, setAutoplayInterval] = useState(null);

  // Memoize media assets with improved error handling
  const { allImages, videoUrl, hasVideo, has360 } = useMemo(() => {
    try {
      const images = [...(property.images || []), ...(property.image ? [property.image] : [])]
        .filter(Boolean)
        .map(img => {
          if (!img) return null;
          
          let imageUrl = null;
          
          if (typeof img === 'string') {
            // Handle string URLs - replace backslashes with forward slashes
            const clean = img.replace(/\\\\/g, '/').replace(/\\/g, '/');
            if (clean.startsWith('blob:')) {
              console.warn('Skipping expired blob URL:', clean);
              return null;
            }
            const normalizedPath = clean.startsWith('/') ? clean : `/${clean}`;
            imageUrl = clean.startsWith('http') ? clean : `${API_BASE_URL}${normalizedPath}`;
          } else if (typeof img === 'object') {
            // Handle image objects
            const url = img.optimized || img.medium || img.thumbnail || img.url;
            if (!url) return null;
            
            const clean = url.replace(/\\\\/g, '/').replace(/\\/g, '/');
            if (clean.startsWith('blob:')) {
              console.warn('Skipping expired blob URL in object:', clean);
              return null;
            }
            const normalizedPath = clean.startsWith('/') ? clean : `/${clean}`;
            imageUrl = clean.startsWith('http') ? clean : `${API_BASE_URL}${normalizedPath}`;
          }
          
          return imageUrl;
        })
        .filter(Boolean)
        .filter(url => !url.startsWith('blob:'));

      let vidUrl = null;
      if (property.video) {
        const videoClean = property.video.replace(/\\\\/g, '/').replace(/\\/g, '/');
        if (videoClean.startsWith('blob:')) {
          console.warn('Skipping expired blob video URL:', videoClean);
        } else {
          const normalizedPath = videoClean.startsWith('/') ? videoClean : `/${videoClean}`;
          vidUrl = videoClean.startsWith('http') ? videoClean : `${API_BASE_URL}${normalizedPath}`;
        }
      }
      
      const is360 = property.is360 || (property.images && property.images.some(i => i.is360));

      return {
        allImages: images,
        videoUrl: vidUrl,
        hasVideo: !!vidUrl,
        has360: is360
      };
    } catch (error) {
      console.error('Error processing media assets:', error);
      return {
        allImages: [],
        videoUrl: null,
        hasVideo: false,
        has360: false
      };
    }
  }, [property, API_BASE_URL]);

  const currentImage = allImages[currentImageIndex];
  const hasMultipleImages = allImages.length > 1;

  const goToPrevious = () => {
    setCurrentImageIndex(prev => (prev === 0 ? allImages.length - 1 : prev - 1));
    resetSlideshow();
  };
  const goToNext = () => {
    setCurrentImageIndex(prev => (prev === allImages.length - 1 ? 0 : prev + 1));
    resetSlideshow();
  };

  const resetSlideshow = () => {
    if (autoplayInterval) {
      clearInterval(autoplayInterval);
      setAutoplayInterval(null);
    }
    setSlideshowActive(false);
  };

  const toggleSlideshow = () => {
    if (slideshowActive) {
      resetSlideshow();
    } else {
      setSlideshowActive(true);
      const interval = setInterval(() => {
        setCurrentImageIndex(prev => (prev === allImages.length - 1 ? 0 : prev + 1));
      }, 3000);
      setAutoplayInterval(interval);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (currentTabIndex === 0 && hasMultipleImages) {
        if (e.key === 'ArrowLeft') goToPrevious();
        if (e.key === 'ArrowRight') goToNext();
        if (e.key === ' ') {
          e.preventDefault();
          toggleSlideshow();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      if (autoplayInterval) clearInterval(autoplayInterval);
    };
  }, [currentTabIndex, currentImageIndex, allImages.length, slideshowActive]);
  
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
      <div className="relative w-full h-64 xs:h-80 sm:h-96 bg-gray-100 rounded-2xl shadow-lg overflow-hidden">
        {currentTabIndex === 0 && (() => {
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
                
                {/* Media Controls */}
                <div className="absolute top-2 left-2 sm:top-4 sm:left-4 flex items-center gap-1 sm:gap-2">
                  <div className="bg-black/60 text-white px-2 py-0.5 sm:px-3 sm:py-1 rounded-full text-xs sm:text-sm">
                    {currentImageIndex + 1} / {allImages.length}
                  </div>
                  {hasMultipleImages && (
                    <>
                      <button
                        onClick={toggleSlideshow}
                        className="bg-black/60 hover:bg-black/80 text-white p-1.5 sm:p-2 rounded-full transition-colors"
                        title={slideshowActive ? 'Pause slideshow' : 'Start slideshow'}
                      >
                        {slideshowActive ? <Pause size={14} className="sm:w-4 sm:h-4" /> : <Play size={14} className="sm:w-4 sm:h-4" />}
                      </button>
                    </>
                  )}
                </div>

                {/* Navigation Controls */}
                {hasMultipleImages && (
                  <>
                    <button onClick={goToPrevious} className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 bg-white/70 hover:bg-white p-2 sm:p-3 rounded-full z-10 shadow-lg">
                      <ChevronLeft size={20} className="sm:w-6 sm:h-6" />
                    </button>
                    <button onClick={goToNext} className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 bg-white/70 hover:bg-white p-2 sm:p-3 rounded-full z-10 shadow-lg">
                      <ChevronRight size={20} className="sm:w-6 sm:h-6" />
                    </button>
                  </>
                )}

                {/* Action Buttons */}
                <div className="absolute top-2 right-2 sm:top-4 sm:right-4 flex items-center gap-1 sm:gap-2">
                  <button
                      onClick={() => setShowZoomModal(true)}
                      className="bg-white/70 hover:bg-white p-2 sm:p-3 rounded-full z-10 shadow-lg"
                      title="Fullscreen"
                  >
                      <Maximize size={16} className="sm:w-5 sm:h-5" />
                  </button>
                </div>
              </>
            );
          } else {
            return (
              <div className="w-full h-full flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-800 p-4">
                <div className="text-gray-400 dark:text-gray-500 text-4xl sm:text-6xl mb-4">📷</div>
                <div className="text-gray-600 dark:text-gray-400 text-base sm:text-lg font-medium mb-2 text-center">No Image Available</div>
                <div className="text-gray-500 dark:text-gray-500 text-xs sm:text-sm text-center">Property images will appear here</div>
              </div>
            );
          }
        })()}
        
        {currentTabIndex === 1 && (() => {
          if (videoUrl) {
            return (
              <video 
                src={videoUrl} 
                controls 
                className="w-full h-full object-contain"
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
              />
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
        <div className="w-full mt-3 sm:mt-4 overflow-x-auto pb-2 scrollbar-hide">
          <div className="flex space-x-2 sm:space-x-3 px-2">
            {allImages.map((imgUrl, index) => (
              <button
                key={index}
                onClick={() => {
                  setCurrentImageIndex(index);
                  resetSlideshow();
                }}
                className={`flex-shrink-0 w-14 h-14 sm:w-20 sm:h-20 rounded-lg overflow-hidden border-2 sm:border-4 transition-all touch-manipulation ${
                  index === currentImageIndex ? 'border-blue-500 ring-2 ring-blue-200' : 'border-transparent hover:border-gray-400 hover:ring-2 hover:ring-gray-200'
                }`}
              >
                <img 
                  src={imgUrl} 
                  alt={`Thumbnail ${index + 1}`} 
                  className="w-full h-full object-cover bg-gray-800"
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
// --- NEW: Advanced Section Components ---
// -------------------------------------------------------------------

// Helper for icons
const iconComponents = {
  ArrowLeft, MapPin, Heart, Share2, Ruler, Building, Bath, Car,
  ChevronLeft, ChevronRight, Video, Copy, Camera, Maximize, Star, CheckCircle, ArrowUpDown,
  BatteryCharging, Dumbbell, Waves, Home, Trees, Shield, Flame, CloudRain, Compass, Calendar,
  Lock, FileText, Building2, Globe, Phone, MessageSquare, Calculator, Eye, 
  TrendingUp, Users, Clock, Award, Filter, Grid, List, Search, Play, Pause,
  ExternalLink, Bookmark, Flag, AlertTriangle, Info, Wifi, Zap, ShieldCheck, Bed,
  Sofa, CarFront, Handshake, Mail, Clock3, BarChart3, FilterX
};

const Icon = ({ name, ...props }) => {
  const LucideIcon = iconComponents[name];
  return LucideIcon ? <LucideIcon {...props} /> : null;
};

// Enhanced Key Highlights Section
function KeyHighlightsSection({ highlights, property }) {
  if (!highlights || highlights.length === 0) return null;
  
  const calculatedHighlights = [
    ...highlights,
    property.gatedCommunity ? 'Gated Community' : null,
    property.furnishing && property.furnishing !== 'Unfurnished' ? `${property.furnishing}` : null,
    property.balconies > 0 ? `${property.balconies} Balcony${property.balconies > 1 ? 'ies' : ''}` : null,
    property.coveredParking > 0 || property.openParking > 0 ? 'Parking Available' : null
  ].filter(Boolean);

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg mt-6">
      <h3 className="text-xl font-semibold mb-4 flex items-center">
        <Star className="text-yellow-500 mr-2" size={24} />
        Key Highlights
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {calculatedHighlights.map((highlight, index) => (
          <div key={index} className="flex items-center bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 text-blue-800 dark:text-blue-200 text-sm font-medium px-4 py-3 rounded-lg border border-blue-200 dark:border-blue-700">
            <CheckCircle className="w-4 h-4 mr-3 text-blue-600 dark:text-blue-400" />
            <span>{highlight}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// Enhanced Amenities Section
function AmenitiesSection({ amenities, property }) {
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
    'High Speed Internet': 'Wifi',
    'Fire Safety': 'ShieldCheck',
    'Intercom': 'Phone',
    'Garden': 'Trees',
    'Children Play Area': 'Users',
    'Jogging Track': 'TrendingUp',
    'Indoor Games': 'GamepadIcon'
  };

  const allAmenities = [...(amenities || [])];
  
  // Add property-specific amenities
  if (property.coveredParking > 0 || property.openParking > 0) {
    allAmenities.push('Covered Parking');
  }
  if (property.balconies > 0) {
    allAmenities.push('Balcony');
  }
  if (property.furnishing && property.furnishing !== 'Unfurnished') {
    allAmenities.push(`${property.furnishing} Furnished`);
  }

  if (allAmenities.length === 0) return null;

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg mt-6">
      <h3 className="text-xl font-semibold mb-4 flex items-center">
        <Home className="text-blue-500 mr-2" size={24} />
        Amenities & Features
      </h3>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {allAmenities.map((amenity, index) => (
          <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
            <Icon name={amenityIcons[amenity] || 'CheckCircle'} className="w-6 h-6 text-blue-500 flex-shrink-0" />
            <span className="font-medium text-gray-700 dark:text-gray-300">{amenity}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// Enhanced Details Section
function DetailsSection({ property }) {
  const details = [
    { label: 'Facing', value: property.facing, icon: 'Compass' },
    { label: 'Property on Floor', value: property.propertyOnFloor, icon: 'Building2' },
    { label: 'Total Floors', value: property.totalFloors, icon: 'Building' },
    { label: 'Property Age', value: property.propertyAge, icon: 'Calendar' },
    { label: 'Availability', value: property.availability, icon: 'Clock' },
    { label: 'Gated Community', value: property.gatedCommunity ? 'Yes' : 'No', icon: 'Lock' },
    { label: 'RERA ID', value: property.reraId, icon: 'FileText' },
    { label: 'Ownership', value: property.ownership, icon: 'Handshake' }
  ].filter(d => d.value);

  if (details.length === 0) return null;

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg mt-6">
      <h3 className="text-xl font-semibold mb-4 flex items-center">
        <FileText className="text-blue-500 mr-2" size={24} />
        Property Details
      </h3>
      <div className="grid grid-cols-2 gap-6">
        {details.map(detail => (
          <div key={detail.label} className="flex items-center space-x-4 p-3 bg-gray-50 dark:bg-gray-700/30 rounded-lg">
            <Icon name={detail.icon} className="text-blue-500 flex-shrink-0" size={24} />
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">{detail.label}</p>
              <p className="font-bold text-gray-900 dark:text-gray-100">{detail.value}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Enhanced Price Details Section
function PriceDetailsSection({ property }) {
  const { priceIncludes, maintenance } = property;
  if ((!priceIncludes || priceIncludes.length === 0) && (!maintenance || !maintenance.amount)) return null;

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg mt-6">
      <h3 className="text-xl font-semibold mb-4 flex items-center">
        <Calculator className="text-green-500 mr-2" size={24} />
        Price Breakdown
      </h3>
      <div className="space-y-4">
        {priceIncludes && priceIncludes.length > 0 && (
          <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-700">
            <h4 className="font-semibold mb-2 text-green-800 dark:text-green-200">Price Includes:</h4>
            <div className="flex flex-wrap gap-2">
              {priceIncludes.map((item, i) => (
                <span key={i} className="text-sm bg-green-100 dark:bg-green-800 text-green-800 dark:text-green-200 px-3 py-1 rounded-full font-medium">
                  {item}
                </span>
              ))}
            </div>
          </div>
        )}
        {maintenance && maintenance.amount && (
          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-700">
            <h4 className="font-semibold mb-2 text-blue-800 dark:text-blue-200">Maintenance</h4>
            <div className="flex justify-between items-center">
              <span className="text-blue-700 dark:text-blue-300">₹{maintenance.amount.toLocaleString()}</span>
              <span className="text-sm text-blue-600 dark:text-blue-400 font-medium">({maintenance.period})</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Enhanced Landmarks Section
function LandmarksSection({ landmarks }) {
  if (!landmarks || landmarks.length === 0) return null;
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg mt-6">
      <h3 className="text-xl font-semibold mb-4 flex items-center">
        <MapPin className="text-red-500 mr-2" size={24} />
        Nearby Landmarks
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {landmarks.map((landmark, i) => (
          <div key={i} className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700/30 rounded-lg">
            <MapPin className="w-4 h-4 text-red-500 flex-shrink-0" />
            <span className="text-gray-700 dark:text-gray-300">{landmark}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// Enhanced Map View
function MapView({ location, property }) {
  const [mapLoaded, setMapLoaded] = useState(false);
  
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg mt-6">
       <h3 className="text-xl font-semibold mb-4 flex items-center">
         <Globe className="text-purple-500 mr-2" size={24} />
         Location & Nearby
       </h3>
       <div className="relative h-64 bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden">
         {!mapLoaded ? (
           <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/20 dark:to-purple-900/20 flex flex-col items-center justify-center">
             <Globe className="text-blue-500 mb-2" size={48} />
             <p className="text-gray-600 dark:text-gray-300 font-medium">Interactive Map</p>
             <p className="text-gray-500 dark:text-gray-400 text-sm">{location}</p>
           </div>
         ) : (
           <img 
              src={`https://maps.googleapis.com/maps/api/staticmap?center=${encodeURIComponent(location)}&zoom=15&size=600x400&markers=color:red%7C${encodeURIComponent(location)}&key=YOUR_API_KEY`}
              alt={`Map of ${location}`}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.src = `https://www.mapsofindia.com/maps/andhrapradesh/tehsil/nellore-tehsil-map.jpg`;
              }}
           />
         )}
         <div className="absolute inset-0 bg-black/20 flex flex-col items-center justify-center text-white p-4">
            <MapPin size={32} className="mb-2"/>
            <p className="text-center font-bold text-lg">{location}</p>
            <p className="text-center font-semibold mt-2 bg-white/20 px-3 py-1 rounded-full">
              {property.status} • {property.bhk} BHK
            </p>
         </div>
       </div>
       
       {/* Quick Location Stats */}
       <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
         <div className="text-center p-3 bg-gray-50 dark:bg-gray-700/30 rounded-lg">
           <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">500m</div>
           <div className="text-sm text-gray-500 dark:text-gray-400">Nearest School</div>
         </div>
         <div className="text-center p-3 bg-gray-50 dark:bg-gray-700/30 rounded-lg">
           <div className="text-2xl font-bold text-green-600 dark:text-green-400">1.2km</div>
           <div className="text-sm text-gray-500 dark:text-gray-400">Hospital</div>
         </div>
         <div className="text-center p-3 bg-gray-50 dark:bg-gray-700/30 rounded-lg">
           <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">800m</div>
           <div className="text-sm text-gray-500 dark:text-gray-400">Metro Station</div>
         </div>
         <div className="text-center p-3 bg-gray-50 dark:bg-gray-700/30 rounded-lg">
           <div className="text-2xl font-bold text-red-600 dark:text-red-400">2km</div>
           <div className="text-sm text-gray-500 dark:text-gray-400">Airport</div>
         </div>
       </div>
     </div>
   );
 }

// Property Comparison Component
function PropertyComparison({ currentProperty, allProperties }) {
  const [comparisonMode, setComparisonMode] = useState(false);
  const [selectedProperties, setSelectedProperties] = useState([]);
  
  const similarProperties = useMemo(() => {
    return allProperties
      ?.filter(p => p.id !== currentProperty.id && p.location === currentProperty.location)
      ?.slice(0, 3) || [];
  }, [allProperties, currentProperty]);

  const handleCompareSelect = (property) => {
    if (selectedProperties.includes(property.id)) {
      setSelectedProperties(prev => prev.filter(id => id !== property.id));
    } else if (selectedProperties.length < 2) {
      setSelectedProperties(prev => [...prev, property.id]);
    }
  };

  if (similarProperties.length === 0) return null;

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg mt-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-semibold flex items-center">
          <BarChart3 className="text-orange-500 mr-2" size={24} />
          Compare Similar Properties
        </h3>
        <button
          onClick={() => setComparisonMode(!comparisonMode)}
          className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
        >
          {comparisonMode ? 'Exit Compare' : 'Compare'}
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[currentProperty, ...similarProperties].map(property => (
          <div key={property.id} className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
            {comparisonMode && (
              <div className="mb-3">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={selectedProperties.includes(property.id)}
                    onChange={() => handleCompareSelect(property)}
                    className="mr-2"
                  />
                  <span className="text-sm">Select for comparison</span>
                </label>
              </div>
            )}
            
            <img
              src={property.images?.[0] || 'https://placehold.co/300x200'}
              alt={property.type}
              className="w-full h-32 object-cover rounded-lg mb-3"
            />
            
            <h4 className="font-semibold mb-2">{property.type}</h4>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span>Price:</span>
                <span className="font-medium">{property.price}</span>
              </div>
              <div className="flex justify-between">
                <span>Area:</span>
                <span className="font-medium">{property.area}</span>
              </div>
              <div className="flex justify-between">
                <span>BHK:</span>
                <span className="font-medium">{property.bhk}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Contact Form Component
function ContactForm({ property, onSubmit }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: `I'm interested in ${property.type} at ${property.location}. Please provide more details.`
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-2xl shadow-lg">
      <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 flex items-center">
        <Mail className="text-blue-500 mr-2" size={20} />
        Contact Owner
      </h3>
      
      <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
        <input
          type="text"
          id="contact-name"
          name="name"
          placeholder="Your Name"
          value={formData.name}
          onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
          className="w-full p-3 sm:p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-base"
          required
        />
        
        <input
          type="email"
          id="contact-email"
          name="email"
          placeholder="Your Email"
          value={formData.email}
          onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
          className="w-full p-3 sm:p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-base"
          required
        />
        
        <input
          type="tel"
          id="contact-phone"
          name="phone"
          placeholder="Your Phone Number"
          value={formData.phone}
          onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
          className="w-full p-3 sm:p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-base"
          required
        />
        
        <textarea
          id="contact-message"
          name="message"
          rows={4}
          placeholder="Your Message"
          value={formData.message}
          onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
          className="w-full p-3 sm:p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-base resize-none"
        />
        
        <button
          type="submit"
          className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 text-sm sm:text-base touch-manipulation"
        >
          <MessageSquare size={18} />
          <span>Send Message</span>
        </button>
      </form>
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
  const navigate = isStandalone ? useNavigate() : useNavigate(); // Always get navigate for back button functionality
  const { id } = isStandalone ? useParams() : { id: null };
  
  // Use props if provided (from wrapper), otherwise use context for standalone mode
  const {
    properties: contextProperties,
    savedPropertyIds: contextSavedPropertyIds,
    handleToggleSaved: contextHandleToggleSaved,
    addToComparison: contextAddToComparison,
    API_BASE_URL: contextApiBaseUrl,
    API_URL,
    token
  } = isStandalone ? useContext(AppContext) : {};
  
  // Use props or context values
  const properties = propProperty ? propAllProperties : contextProperties;
  const savedPropertyIds = propProperty ? propSavedPropertyIds : contextSavedPropertyIds;
  const handleToggleSaved = propProperty ? propOnToggleSaved : contextHandleToggleSaved;
  const addToComparison = propProperty ? undefined : contextAddToComparison;
  const API_BASE_URL = propProperty ? propApiBaseUrl : contextApiBaseUrl;
  
  // Local state for standalone mode
  const [property, setProperty] = useState(propProperty || null);
  const [loading, setLoading] = useState(propProperty ? false : true);
  const [error, setError] = useState(null);
  const [showContactForm, setShowContactForm] = useState(false);
  const [viewStats, setViewStats] = useState({
    totalViews: 0,
    todayViews: 0,
    weeklyViews: 0
  });

  // Sticky header state and ref
  const mainDetailsRef = useRef(null);

  // Derived values used in the UI
  const isSaved = propProperty ? propIsSaved : (savedPropertyIds ? savedPropertyIds.has(property?.id) : false);

  const similarProperties = useMemo(() => {
    if (!properties || !property || !property.id) {
      return [];
    }
    
    try {
      const filtered = properties
        .filter(p => {
          // Basic validation - must have valid ID and not be the same property
          if (!p || !p.id || p.id === property.id) {
            return false;
          }
          
          // Must have essential data
          if (!p.location || !p.type) {
            return false;
          }
          
          return true;
        })
        .filter(p => {
          // Location matching with error handling
          try {
            if (!p.location || !property.location) {
              return false;
            }
            
            // Exact location match
            if (p.location.trim().toLowerCase() === property.location.trim().toLowerCase()) {
              return true;
            }
            
            // Partial location match (same city or area)
            const currentLocation = property.location.toLowerCase();
            const propLocation = p.location.toLowerCase();
            
            // Extract city/area from location strings
            const getLocationKey = (location) => {
              const parts = location.split(',').map(s => s.trim());
              return {
                city: parts[parts.length - 1] || '',
                area: parts[0] || ''
              };
            };
            
            const currentLoc = getLocationKey(currentLocation);
            const propLoc = getLocationKey(propLocation);
            
            // Match if same city or same area (with minimum length check)
            const locationMatch = (
              (currentLoc.city && propLoc.city && currentLoc.city === propLoc.city) ||
              (currentLoc.area && propLoc.area && currentLoc.area === propLoc.area)
            );
            
            return locationMatch;
          } catch (err) {
            console.warn('Error in location matching:', err);
            return false;
          }
        })
        .filter(p => {
          // Property type matching with error handling
          try {
            if (!p.type || !property.type) {
              return true; // Allow properties without type info
            }
            
            const currentType = property.type.toLowerCase().trim();
            const propType = p.type.toLowerCase().trim();
            
            // Check for exact match first
            if (currentType === propType) {
              return true;
            }
            
            // Check for partial matches and common synonyms
            const typeMatch = 
              currentType.includes(propType) || 
              propType.includes(currentType) ||
              (currentType.includes('flat') && propType.includes('apartment')) ||
              (currentType.includes('apartment') && propType.includes('flat')) ||
              (currentType.includes('villa') && propType.includes('house')) ||
              (currentType.includes('house') && propType.includes('villa'));
            
            return typeMatch;
          } catch (err) {
            console.warn('Error in type matching:', err);
            return true; // Allow if type matching fails
          }
        })
        .slice(0, 6);
      
      return filtered;
    } catch (e) {
      console.error('Error filtering similar properties:', e);
      return [];
    }
  }, [properties, property]);

  // Scroll to top when component mounts
  useEffect(() => {
    if (isStandalone) {
      window.scrollTo(0, 0);
    }
  }, [isStandalone]);

  // Fetch property by ID (only for standalone mode, when no propProperty is provided)
  useEffect(() => {
    if (!isStandalone || propProperty) {
      setLoading(false);
      return;
    }

    const fetchProperty = async () => {
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
            // Simulate view stats
            setViewStats({
              totalViews: Math.floor(Math.random() * 1000) + 100,
              todayViews: Math.floor(Math.random() * 50) + 5,
              weeklyViews: Math.floor(Math.random() * 300) + 50
            });
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
        await navigator.clipboard.writeText(window.location.href);
        toast.success('Property link copied to clipboard!');
      }
    } catch (err) {
      console.error('Error sharing:', err);
      toast.error('Failed to share property');
    }
  };

  const handleContactSubmit = async (formData) => {
    try {
      // Here you would typically send the contact form data to your backend
      console.log('Contact form data:', formData);
      toast.success('Message sent successfully! The property owner will contact you soon.');
      setShowContactForm(false);
    } catch (error) {
      toast.error('Failed to send message. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
       
      {/* Enhanced Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm sticky top-0 z-40 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 py-2 sm:py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 sm:gap-4 min-w-0 flex-1">
              <button 
                onClick={() => {
                  if (navigate) {
                    navigate(-1);
                  } else if (onClose) {
                    onClose();
                  } else {
                    // Fallback to home page if navigate is not available
                    window.location.href = '/';
                  }
                }} 
                className="p-1.5 sm:p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors touch-manipulation"
                title="Go Back"
              >
                <ArrowLeft size={18} className="sm:w-5 sm:h-5" />
              </button>
              <div className="min-w-0 flex-1">
                <h2 className="font-bold text-sm sm:text-lg text-gray-900 dark:text-gray-100 truncate">{property?.type || 'Property Details'}</h2>
                <div className="flex items-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-0.5">
                  <span className="flex items-center gap-1">
                    <Eye size={12} className="sm:w-3.5 sm:h-3.5" />
                    <span className="hidden xs:inline">{viewStats.todayViews} views today</span>
                    <span className="xs:hidden">{viewStats.todayViews}v</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock3 size={12} className="sm:w-3.5 sm:h-3.5" />
                    <span className="hidden sm:inline">Listed {new Date(property.createdAt).toLocaleDateString()}</span>
                    <span className="sm:hidden">{new Date(property.createdAt).toLocaleDateString()}</span>
                  </span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-1 sm:gap-2">
              <button
                onClick={() => handleToggleSaved(property.id)}
                className={`p-2 sm:p-3 rounded-full transition-colors shadow-md touch-manipulation ${
                  isSaved ? 'bg-red-500 text-white' : 'bg-gray-200 dark:bg-gray-700'
                }`}
                title={isSaved ? 'Remove from favorites' : 'Add to favorites'}
              >
                <Heart size={16} className="sm:w-5 sm:h-5" fill={isSaved ? "currentColor" : "none"} />
              </button>
              <button
                onClick={handleShare}
                className="p-2 sm:p-3 bg-gray-200 dark:bg-gray-700 rounded-full shadow-md touch-manipulation"
                title="Share property"
              >
                <Share2 size={16} className="sm:w-5 sm:h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Page Content */}
      <div className="max-w-7xl mx-auto p-3 sm:p-4 md:p-6 lg:p-8">
        
        {/* Main Content Grid */}
        <div className="flex flex-col lg:flex-row gap-4 lg:gap-6 xl:gap-8">
          
          {/* Left Column: Media and Descriptions */}
          <div className="w-full lg:w-2/3 xl:w-3/5">
            <PropertyMediaGallery property={property} API_BASE_URL={API_BASE_URL} />
            
            <KeyHighlightsSection highlights={property.keyHighlights} property={property} />
            
            {/* Enhanced Description */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg mt-6">
              <h3 className="text-xl font-semibold mb-2 flex items-center">
                <FileText className="text-blue-500 mr-2" size={24} />
                Description
              </h3>
              <ExpandableText 
                text={property.description || `(No description provided)`}
                maxLength={400}
                className="text-gray-700 dark:text-gray-300 leading-relaxed"
              />
              
              {/* Description Tips */}
              <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-700">
                <div className="flex items-start gap-3">
                  <Info className="text-blue-500 mt-0.5" size={16} />
                  <div className="text-sm">
                    <p className="font-medium text-blue-800 dark:text-blue-200 mb-1">Property Description Tips:</p>
                    <ul className="text-blue-700 dark:text-blue-300 space-y-1">
                      <li>• High-quality photos increase inquiry rates by 40%</li>
                      <li>• Detailed descriptions help serious buyers connect</li>
                      <li>• Mention unique features and nearby amenities</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            
            <AmenitiesSection amenities={property.amenities} property={property} />
            <DetailsSection property={property} />
            <PriceDetailsSection property={property} />
            <LandmarksSection landmarks={property.nearbyLandmarks} />
            <MapView location={property.location} property={property} />
            <PropertyComparison currentProperty={property} allProperties={properties} />
          </div>

          {/* Right Column: Core Details & Actions */}
          <div className="w-full lg:w-1/3 xl:w-2/5 flex-shrink-0 order-first lg:order-last">
            <div ref={mainDetailsRef} className="sticky top-14 sm:top-16 lg:top-20 space-y-3 sm:space-y-4 lg:space-y-6">
              
              {/* Enhanced Price & Actions */}
              <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-2xl shadow-lg">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Total Price</p>
                    <h1 className="text-3xl font-bold text-blue-600 dark:text-blue-400">{property.price}</h1>
                    {property.priceValue && (
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        ₹{(property.priceValue / 100000).toFixed(2)} Lakh
                      </p>
                    )}
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

                {/* Location and Property Type */}
                <div className="mb-6">
                  <h2 className="text-xl font-semibold mb-2">{property.type} for {property.status}</h2>
                  <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 text-lg mb-2">
                    <MapPin size={20} />
                    <span className="font-medium">{property.location}</span>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                    <span className="flex items-center gap-1">
                      <Eye size={14} />
                      {viewStats.totalViews} total views
                    </span>
                    <span className="flex items-center gap-1">
                      <Star size={14} />
                      Verified Listing
                    </span>
                  </div>
                </div>
                
                {/* Action Buttons */}
                <div className="space-y-3">
                  <button
                    onClick={() => setShowContactForm(!showContactForm)}
                    className="w-full bg-gradient-to-r from-blue-600 to-blue-800 text-white font-bold py-3 rounded-lg text-lg hover:from-blue-700 hover:to-blue-900 transition-colors shadow-lg flex items-center justify-center gap-2"
                  >
                    <Phone size={18} />
                    Contact Agent
                  </button>
                  
                  <button className="w-full bg-green-600 text-white font-bold py-3 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2">
                    <MessageSquare size={18} />
                    Schedule Visit
                  </button>
                </div>
              </div>

              {/* Contact Form Modal */}
              {showContactForm && (
                <div className="transform transition-all duration-300">
                  <ContactForm property={property} onSubmit={handleContactSubmit} />
                </div>
              )}

              {/* Enhanced Basic Details */}
              <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg">
                <h3 className="text-xl font-semibold mb-4 flex items-center">
                  <Building className="text-blue-500 mr-2" size={24} />
                  Property Details
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700/30 rounded-lg">
                    <Ruler size={24} className="text-blue-500" />
                    <div>
                      <p className="text-sm text-gray-500">Area</p>
                      <p className="font-bold">{property.area}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700/30 rounded-lg">
                    <Building size={24} className="text-blue-500" />
                    <div>
                      <p className="text-sm text-gray-500">Type</p>
                      <p className="font-bold">{property.bhk} BHK</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700/30 rounded-lg">
                    <Bath size={24} className="text-blue-500" />
                    <div>
                      <p className="text-sm text-gray-500">Bathrooms</p>
                      <p className="font-bold">{property.bathrooms || 'N/A'}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700/30 rounded-lg">
                    <CarFront size={24} className="text-blue-500" />
                    <div>
                      <p className="text-sm text-gray-500">Parking</p>
                      <p className="font-bold">{(property.coveredParking || 0) + (property.openParking || 0)} slots</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700/30 rounded-lg">
                    <Sofa size={24} className="text-blue-500" />
                    <div>
                      <p className="text-sm text-gray-500">Furnishing</p>
                      <p className="font-bold">{property.furnishing || 'Unfurnished'}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700/30 rounded-lg">
                    <Clock size={24} className="text-blue-500" />
                    <div>
                      <p className="text-sm text-gray-500">Available</p>
                      <p className="font-bold">{property.availability || 'Ready'}</p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Property Analytics */}
              <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg">
                <h3 className="text-xl font-semibold mb-4 flex items-center">
                  <BarChart3 className="text-purple-500 mr-2" size={24} />
                  Property Analytics
                </h3>
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center p-3 bg-gray-50 dark:bg-gray-700/30 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{viewStats.todayViews}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">Views Today</div>
                  </div>
                  <div className="text-center p-3 bg-gray-50 dark:bg-gray-700/30 rounded-lg">
                    <div className="text-2xl font-bold text-green-600 dark:text-green-400">{viewStats.weeklyViews}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">This Week</div>
                  </div>
                  <div className="text-center p-3 bg-gray-50 dark:bg-gray-700/30 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">{property.shortlistsCount || 0}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">Shortlisted</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Enhanced Similar Properties Section */}
        {similarProperties.length > 0 && (
          <div className="mt-16 mb-8">
            {/* Section Header */}
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center">
                <div className="bg-gradient-to-r from-green-500 to-emerald-500 p-2 rounded-xl mr-3">
                  <TrendingUp className="text-white" size={24} />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    Similar Properties You Might Like
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
                    Based on location, price range, and property type
                  </p>
                </div>
              </div>
              <button 
                onClick={() => {
                  if (isStandalone) {
                    navigate(`/properties?similar=true&similarTo=${property.id}`);
                  } else if (onViewDetails) {
                    onViewDetails(`/properties?similar=true&similarTo=${property.id}`);
                  }
                }}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors shadow-md hover:shadow-lg"
              >
                View All
                <ExternalLink size={16} />
              </button>
            </div>
              
            {/* Properties Grid */}
            <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
              {similarProperties.map((prop, index) => (
                <div 
                  key={prop.id} 
                  className="transform hover:-translate-y-1 transition-all duration-300"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <PropertyCard
                    property={prop}
                    addToComparison={addToComparison}
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
                </div>
              ))}
            </div>

            {/* Call to Action */}
            <div className="mt-8 text-center">
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl p-6 border border-blue-200 dark:border-blue-700">
                <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  Can't find what you're looking for?
                </h4>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Browse our complete collection of properties in {property.location}
                </p>
                <button 
                  onClick={() => {
                    if (isStandalone) {
                      navigate(`/properties?location=${encodeURIComponent(property.location)}`);
                    } else if (onViewDetails) {
                      onViewDetails(`/properties?location=${encodeURIComponent(property.location)}`);
                    }
                  }}
                  className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-3 rounded-lg font-medium transition-all shadow-md hover:shadow-lg"
                >
                  Explore More Properties
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}