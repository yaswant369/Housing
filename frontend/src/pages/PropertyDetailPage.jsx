import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import {
  ArrowLeft, Heart, Share2, Phone, MessageCircle, MapPin,
  Bed, Bath, Maximize, Calendar, User, Star, CheckCircle,
  ArrowRight, ArrowUp, ArrowDown, X, ChevronLeft, ChevronRight,
  Car, Wifi, Zap, Shield, Camera, Play, Video, Image as ImageIcon, FileText
} from 'lucide-react';
import { AppContext } from '../context/AppContext';
import { formatPrice, formatArea, getSimilarProperties, formatRelativeTime } from '../utils/propertyHelpers';
import MediaBox from '../components/MediaBox';
import ModernPropertyCard from '../components/properties/ModernPropertyCard';

const AMENITY_ICONS = {
  'swimming_pool': '🏊',
  'gym': '💪',
  'parking': '🅿️',
  'lift': '🛗',
  'security': '🔒',
  'power_backup': '🔋',
  'cctv': '📹',
  'garden': '🌿',
  'children_play_area': '🎮',
  'club_house': '🏢',
  'water_supply': '🚿',
  'air_conditioning': '❄️',
  'gas_pipeline': '🔥',
  'fire_safety': '🚒',
  'servant_room': '👩‍💼'
};

export default function PropertyDetailPage(props = {}) {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  // Check if property is passed as prop (from PropertyDetailWrapper)
  const {
    property: propProperty,
    onClose,
    isSaved: propIsSaved,
    onToggleSaved,
    allProperties: propAllProperties,
    onViewDetails,
    savedPropertyIds: propSavedPropertyIds,
    API_BASE_URL
  } = props;

  const {
    savedPropertyIds: contextSavedPropertyIds,
    handleToggleSaved: contextHandleToggleSaved,
    addToComparison,
    removeFromComparison,
    properties: contextAllProperties,
    comparedProperties
  } = useContext(AppContext);

  // Use prop values if available, otherwise use context values
  const savedPropertyIds = propSavedPropertyIds || contextSavedPropertyIds;
  const handleToggleSaved = onToggleSaved || contextHandleToggleSaved;
  const allProperties = propAllProperties || contextAllProperties;

  const [property, setProperty] = useState(null);
  const [similarProperties, setSimilarProperties] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    // If property was passed as prop, use it directly
    if (propProperty) {
      setProperty(propProperty);
      const allProps = propAllProperties || allProperties || [];
      const similar = getSimilarProperties(allProps, propProperty, 4);
      setSimilarProperties(similar);
      return;
    }

    // Try to get property from navigation state first (preferred method)
    if (location.state?.property) {
      const providedProperty = location.state.property;
      setProperty(providedProperty);
      // Get similar properties from allProperties
      const allProps = location.state.allProperties || allProperties || [];
      const similar = getSimilarProperties(allProps, providedProperty, 4);
      setSimilarProperties(similar);
      return;
    }

    // Try to find property in the current properties list
    const foundProperty = allProperties?.find(p => p.id === parseInt(id));
    if (foundProperty) {
      setProperty(foundProperty);
      const similar = getSimilarProperties(allProperties, foundProperty, 4);
      setSimilarProperties(similar);
      return;
    }

    // Last resort: Property not found in any source
    console.warn(`Property with ID ${id} not found in database`);

    // Property not found, redirect to home
    console.warn(`Property with ID ${id} not found, redirecting to home`);
    navigate('/', { replace: true });
  }, [id, navigate, location.state, allProperties, propProperty, propAllProperties]);

  const isSaved = propIsSaved !== undefined ? propIsSaved : (property && savedPropertyIds?.has(property.id));
  const isCompared = property && comparedProperties?.some(p => p.id === property.id);

  const handleSave = () => {
    if (property && handleToggleSaved) {
      handleToggleSaved(property.id);
    }
  };

  const handleShare = async () => {
    if (!property) return;

    const shareData = {
      title: `${property?.bhk} BHK ${property?.propertyType} in ${property?.location}`,
      text: `Check out this amazing property: ${property?.bhk} BHK ${property?.propertyType} in ${property?.location}`,
      url: `${window.location.origin}/property/${property?.id}`
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(shareData.url);
        // You could add a toast notification here
      }
    } catch (error) {
      console.log('Error sharing:', error);
    }
  };

  const handleCall = () => {
    if (property?.agent?.phone) {
      window.open(`tel:${property.agent.phone}`);
    }
  };

  const handleWhatsApp = () => {
    if (property?.agent?.phone) {
      const message = `Hi, I'm interested in the ${property?.bhk} BHK ${property?.propertyType} in ${property?.location}`;
      const whatsappUrl = `https://wa.me/${property.agent.phone.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`;
      window.open(whatsappUrl, '_blank');
    }
  };

  // Helper function to construct proper image URLs (similar to PropertyCard's getImageSrc)
  const constructImageUrl = (imagePath) => {
    if (!imagePath) return null;

    // Handle blob URLs (from file uploads) - these should be used directly
    if (imagePath.startsWith('blob:')) {
      return imagePath;
    }

    // Handle data URLs (base64 images)
    if (imagePath.startsWith('data:')) {
      return imagePath;
    }

    // Handle full URLs (http/https) - return as-is
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
      return imagePath;
    }

    // Handle relative paths - build proper backend URL
    // 1. Normalize backslashes to forward slashes
    const pathWithForwardSlashes = imagePath.replace(/\\/g, '/');

    // 2. Remove any leading slashes
    const cleanPath = pathWithForwardSlashes.startsWith('/')
      ? pathWithForwardSlashes.substring(1)
      : pathWithForwardSlashes;

    // 3. Build the full URL using API_BASE_URL
    const baseUrl = API_BASE_URL ? API_BASE_URL.replace(/\/$/, '') : '';
    return `${baseUrl}/uploads/${cleanPath}`;
  };

  // Prepare media data for MediaBox component
  const getMediaData = () => {
    // Extract images from property media
    const images = [];

    // Add photos from new media structure
    if (property?.media?.photos?.length > 0) {
      images.push(...property.media.photos.map(photo => {
        // For database-stored images, construct URL to the media endpoint
        if (photo.fileName) {
          return `/api/uploads/database/property/${property.id}/media/photos/${encodeURIComponent(photo.fileName)}?size=medium`;
        }
        // For legacy URL-based images
        return constructImageUrl(photo.optimizedData || photo.mediumData || photo.data || photo.url);
      }));
    }

    // Legacy support for old images field
    if (images.length === 0 && property?.images?.length > 0) {
      images.push(...property.images.map(image => {
        if (typeof image === 'object') {
          return constructImageUrl(image.medium || image.thumbnail || image.optimized || image.url);
        } else {
          return constructImageUrl(image);
        }
      }));
    }

    // Extract videos from property media
    const videos = [];

    // Add videos from new media structure
    if (property?.media?.videos?.length > 0) {
      videos.push(...property.media.videos.map(video => {
        // For database-stored videos, construct URL to the media endpoint
        if (video.fileName) {
          return `/api/uploads/database/property/${property.id}/media/videos/${encodeURIComponent(video.fileName)}`;
        }
        // For legacy URL-based videos
        return constructImageUrl(video.data || video.url);
      }));
    }

    // Legacy support for old videos field
    if (videos.length === 0 && property?.videos?.length > 0) {
      videos.push(...property.videos.map(video => {
        if (typeof video === 'object') {
          return constructImageUrl(video.url || video.optimized || video.thumbnail);
        } else {
          return constructImageUrl(video);
        }
      }));
    }

    // Legacy support for single video field
    if (videos.length === 0 && property?.video) {
      videos.push(constructImageUrl(property.video));
    }

    return { images, videos };
  };

  const { images, videos } = getMediaData();

  if (!property) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading property details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Header */}
      <div className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">

            {/* Back Button */}
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="font-medium">Back to Search</span>
            </button>

            {/* Action Buttons */}
            <div className="flex items-center gap-3">
              <button
                onClick={handleSave}
                className={`p-2 rounded-full transition-colors ${
                  isSaved
                    ? 'bg-red-500 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <Heart className="w-5 h-5" fill={isSaved ? 'currentColor' : 'none'} />
              </button>

              <button
                onClick={handleShare}
                className="p-2 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
              >
                <Share2 className="w-5 h-5" />
              </button>

            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Left Column - Images and Details */}
          <div className="lg:col-span-2 space-y-6">

            {/* Media Gallery using MediaBox component */}
            <div className="bg-white rounded-2xl overflow-hidden shadow-lg">
              <MediaBox images={images} videos={videos} property={property} />
            </div>

            {/* Property Details Tabs */}
            <div className="bg-white rounded-2xl shadow-lg">

              {/* Tab Headers */}
              <div className="border-b border-gray-200">
                <nav className="flex">
                  {
                    [
                      { id: 'overview', label: 'Overview' },
                      { id: 'amenities', label: 'Amenities' },
                      { id: 'location', label: 'Location' },
                      { id: 'details', label: 'Details' }
                    ].map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                          activeTab === tab.id
                            ? 'border-blue-500 text-blue-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700'
                        }`}
                      >
                        {tab.label}
                      </button>
                    ))
                  }
                </nav>
              </div>

              {/* Tab Content */}
              <div className="p-6">

                {/* Overview Tab */}
                {activeTab === 'overview' && (
                  <div className="space-y-6">

                    {/* Description */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">Description</h3>
                      <p className="text-gray-700 leading-relaxed">{property.description}</p>
                    </div>

                    {/* Key Highlights */}
                    {property.keyHighlights && property.keyHighlights.length > 0 && (
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-3">Key Highlights</h3>
                        <ul className="space-y-2">
                          {property.keyHighlights.map((highlight, index) => (
                            <li key={index} className="flex items-start gap-2">
                              <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                              <span className="text-gray-700">{highlight}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Nearby Landmarks */}
                    {property.nearbyLandmarks && property.nearbyLandmarks.length > 0 && (
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-3">Nearby Landmarks</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {property.nearbyLandmarks.map((landmark, index) => (
                            <div key={index} className="flex items-center gap-2 text-gray-700">
                              <MapPin className="w-4 h-4 text-gray-400" />
                              <span className="text-sm">{landmark}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Amenities Tab */}
                {activeTab === 'amenities' && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Amenities</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {property.amenities?.map((amenity) => (
                        <div key={amenity} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                          <span className="text-lg">{AMENITY_ICONS[amenity] || '•'}</span>
                          <span className="text-sm font-medium text-gray-700">
                            {amenity.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Location Tab */}
                {activeTab === 'location' && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Location</h3>
                    <div className="bg-gray-100 rounded-lg p-6 text-center">
                      <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-600">Interactive map would be displayed here</p>
                      <p className="text-sm text-gray-500 mt-1">{property.location}</p>
                    </div>
                  </div>
                )}

                {/* Details Tab */}
                {activeTab === 'details' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                    <div className="space-y-4">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Property Type</span>
                        <span className="font-medium">{property.propertyType}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">BHK</span>
                        <span className="font-medium">{property.bhk}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Bathrooms</span>
                        <span className="font-medium">{property.bathrooms}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Balconies</span>
                        <span className="font-medium">{property.balconies}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Floor</span>
                        <span className="font-medium">{property.floor}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Total Floors</span>
                        <span className="font-medium">{property.totalFloors}</span>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Facing</span>
                        <span className="font-medium">{property.facing}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Furnishing</span>
                        <span className="font-medium">{property.furnishing?.replace('_', ' ')}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Construction Status</span>
                        <span className="font-medium">{property.constructionStatus?.replace('_', ' ')}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Property Age</span>
                        <span className="font-medium">{property.propertyAge}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Ownership</span>
                        <span className="font-medium">{property.ownership}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Posted</span>
                        <span className="font-medium">{formatRelativeTime(property.createdAt)}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Contact and Summary */}
          <div className="space-y-6">

            {/* Property Summary */}
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <div className="text-center mb-6">
                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                  {property.bhk} BHK {property.propertyType}
                </h1>
                <div className="flex items-center justify-center gap-1 text-gray-600 mb-4">
                  <MapPin className="w-4 h-4" />
                  <span>{property.location}</span>
                </div>
                <div className="text-3xl font-bold text-blue-600">
                  {formatPrice(property.price, property.listingType, property.priceValue)}
                </div>
                <div className="text-sm text-gray-500">
                  {property.listingType === 'rent' ? 'per month' : 'total price'}
                </div>
              </div>

              {/* Key Features */}
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 text-gray-600 mb-1">
                    <Bed className="w-5 h-5" />
                  </div>
                  <div className="font-semibold">{property.bhk}</div>
                  <div className="text-xs text-gray-500">BHK</div>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 text-gray-600 mb-1">
                    <Bath className="w-5 h-5" />
                  </div>
                  <div className="font-semibold">{property.bathrooms}</div>
                  <div className="text-xs text-gray-500">Bath</div>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 text-gray-600 mb-1">
                    <Maximize className="w-5 h-5" />
                  </div>
                  <div className="font-semibold">{formatArea(property.area)}</div>
                  <div className="text-xs text-gray-500">Area</div>
                </div>
              </div>

              {/* Contact Buttons */}
              <div className="space-y-3">
                <button
                  onClick={handleCall}
                  className="w-full flex items-center justify-center gap-2 bg-blue-500 text-white py-3 rounded-lg font-semibold hover:bg-blue-600 transition-colors"
                >
                  <Phone className="w-5 h-5" />
                  Call Now
                </button>

                <button
                  onClick={handleWhatsApp}
                  className="w-full flex items-center justify-center gap-2 bg-green-500 text-white py-3 rounded-lg font-semibold hover:bg-green-600 transition-colors"
                >
                  <MessageCircle className="w-5 h-5" />
                  WhatsApp
                </button>
              </div>
            </div>

            {/* Agent Info */}
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Agent</h3>
              <div className="flex items-center gap-4 mb-4">
                <img
                  src={property.agent?.profileImage}
                  alt={property.agent?.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <div className="font-semibold text-gray-900">{property.agent?.name}</div>
                  <div className="text-sm text-gray-500">Real Estate Agent</div>
                  {property.agent?.isVerified && (
                    <div className="flex items-center gap-1 text-green-600 text-xs">
                      <CheckCircle className="w-3 h-3" />
                      Verified
                    </div>
                  )}
                </div>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-gray-400" />
                  <span>{property.agent?.phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Star className="w-4 h-4 text-gray-400" />
                  <span>{property.agent?.totalListings} properties listed</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Similar Properties */}
        {similarProperties.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Similar Properties</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {similarProperties.map((similarProperty) => (
                <ModernPropertyCard
                  key={similarProperty.id}
                  property={similarProperty}
                  variant="grid"
                  onViewDetails={(id) => navigate(`/property/${id}`)}
                />
              ))}
            </div>
          </div>
        )}
    </div>
  </div>
);
}
