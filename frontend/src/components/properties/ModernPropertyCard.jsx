import React, { useState } from 'react';
import {
  Heart, Share2, Scale, MapPin, Bed, Bath, Maximize,
  Phone, MessageCircle, Eye, Camera, Star, CheckCircle,
  ArrowLeft, ArrowRight, ChevronRight
} from 'lucide-react';
import { useSearch } from '../../contexts/SearchContext';
import { formatPrice } from '../../utils/propertyHelpers';

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
  'air_conditioning': '❄️'
};

export default function ModernPropertyCard({ 
  property, 
  variant = 'grid', // 'grid' or 'list'
  onViewDetails,
  onContact,
  onCall,
  onWhatsApp 
}) {
  const {
    savedPropertyIds,
    comparedProperties,
    toggleSavedProperty,
    addToComparison,
    removeFromComparison
  } = useSearch();

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [imageError, setImageError] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const isSaved = savedPropertyIds.has(property.id);
  const isCompared = comparedProperties.some(p => p.id === property.id);
  const images = property.images || [];


  // Format area
  const formatArea = (area) => {
    if (!area) return 'N/A';
    if (typeof area === 'string') return area;
    return `${area} sq ft`;
  };

  // Handle image navigation
  const nextImage = (e) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => 
      prev === images.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = (e) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => 
      prev === 0 ? images.length - 1 : prev - 1
    );
  };

  // Handle save/unsave
  const handleSave = (e) => {
    e.stopPropagation();
    toggleSavedProperty(property.id);
  };

  // Handle comparison
  const handleComparison = (e) => {
    e.stopPropagation();
    if (isCompared) {
      removeFromComparison(property.id);
    } else {
      addToComparison(property);
    }
  };

  // Handle share
  const handleShare = async (e) => {
    e.stopPropagation();
    const shareData = {
      title: `${property.bhk ? property.bhk + ' BHK ' : ''}${property.propertyType} in ${property.location}`,
      text: `Check out this amazing property: ${property.bhk ? property.bhk + ' BHK ' : ''}${property.propertyType} in ${property.location}`,
      url: `${window.location.origin}/property/${property.id}`
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

  // Get image source
  const getImageSrc = (image) => {
    if (!image) return null;
    if (typeof image === 'string') return image;
    return image.medium || image.thumbnail || image.optimized || image.url;
  };

  const cardContent = (
    <div 
      className={`bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden cursor-pointer group transform hover:-translate-y-1 ${
        variant === 'list' ? 'flex' : ''
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => onViewDetails?.(property.id)}
    >
      
      {/* Image Section */}
      <div className={`relative ${variant === 'list' ? 'w-80 flex-shrink-0' : 'aspect-[4/3]'} overflow-hidden`}>
        
        {/* Main Image */}
        <div className="relative w-full h-full">
          {images.length > 0 && !imageError ? (
            <img
              src={getImageSrc(images[currentImageIndex])}
              alt={`${property.bhk ? property.bhk + ' BHK ' : ''}${property.propertyType}`}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              onError={() => setImageError(true)}
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex flex-col items-center justify-center">
              <Camera className="w-12 h-12 text-gray-400 mb-2" />
              <span className="text-gray-500 font-medium">No Image Available</span>
            </div>
          )}

          {/* Image Navigation */}
          {images.length > 1 && (
            <>
              <button
                onClick={prevImage}
                className={`absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity ${
                  isHovered ? 'opacity-100' : 'opacity-0'
                }`}
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
              <button
                onClick={nextImage}
                className={`absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity ${
                  isHovered ? 'opacity-100' : 'opacity-0'
                }`}
              >
                <ArrowRight className="w-4 h-4" />
              </button>
            </>
          )}

          {/* Image Count */}
          {images.length > 0 && (
            <div className="absolute bottom-2 right-2 bg-black/70 text-white px-2 py-1 rounded-full text-xs flex items-center gap-1">
              <Camera className="w-3 h-3" />
              {currentImageIndex + 1}/{images.length}
            </div>
          )}
        </div>

        {/* Status Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {property.isVerified && (
            <span className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
              <CheckCircle className="w-3 h-3" />
              Verified
            </span>
          )}
          {property.isFeatured && (
            <span className="bg-purple-500 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
              <Star className="w-3 h-3" />
              Featured
            </span>
          )}
          {property.isNew && (
            <span className="bg-blue-500 text-white px-2 py-1 rounded-full text-xs font-medium">
              New
            </span>
          )}
        </div>

        {/* Action Buttons */}
        <div className="absolute top-3 right-3 flex flex-col gap-2">
          <button
            onClick={handleSave}
            className={`p-2 rounded-full backdrop-blur-sm transition-all ${
              isSaved 
                ? 'bg-red-500 text-white' 
                : 'bg-white/90 text-gray-700 hover:bg-white hover:text-red-500'
            }`}
          >
            <Heart className="w-4 h-4" fill={isSaved ? 'currentColor' : 'none'} />
          </button>
          
          <button
            onClick={handleShare}
            className="p-2 rounded-full bg-white/90 text-gray-700 hover:bg-white hover:text-blue-500 backdrop-blur-sm transition-all"
          >
            <Share2 className="w-4 h-4" />
          </button>
          
          <button
            onClick={handleComparison}
            className={`p-2 rounded-full backdrop-blur-sm transition-all ${
              isCompared
                ? 'bg-green-500 text-white'
                : 'bg-white/90 text-gray-700 hover:bg-white hover:text-green-500'
            }`}
          >
            <Scale className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Content Section */}
      <div className={`p-4 ${variant === 'list' ? 'flex-1 flex flex-col justify-between' : ''}`}>
        
        {/* Header */}
        <div className="mb-3">
          <div className="flex items-start justify-between mb-2">
            <div>
              <h3 className="text-lg font-bold text-gray-900 line-clamp-2">
                {property.bhk ? property.bhk + ' BHK ' : ''}{property.propertyType}
              </h3>
              <div className="flex items-center gap-1 text-gray-600 mt-1">
                <MapPin className="w-4 h-4 flex-shrink-0" />
                <span className="text-sm line-clamp-1">{property.location}</span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-xl font-bold text-gray-900">
                {formatPrice(property.price, null, property.priceValue)}
              </div>
              <div className="text-xs text-gray-500">
                {property.listingType === 'rent' ? '/month' : ''}
              </div>
            </div>
          </div>
        </div>

        {/* Key Features */}
        <div className="flex items-center gap-4 mb-4">
          {property.bhk && (
            <div className="flex items-center gap-1 text-gray-600">
              <Bed className="w-4 h-4" />
              <span className="text-sm font-medium">{property.bhk} BHK</span>
            </div>
          )}
          <div className="flex items-center gap-1 text-gray-600">
            <Bath className="w-4 h-4" />
            <span className="text-sm font-medium">{property.bathrooms || property.bhk} Bath</span>
          </div>
          <div className="flex items-center gap-1 text-gray-600">
            <Maximize className="w-4 h-4" />
            <span className="text-sm font-medium">{formatArea(property.area)}</span>
          </div>
        </div>

        {/* Amenities */}
        {property.amenities && property.amenities.length > 0 && (
          <div className="mb-4">
            <div className="flex flex-wrap gap-2">
              {property.amenities.slice(0, 3).map((amenity) => (
                <span
                  key={amenity}
                  className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                >
                  <span>{AMENITY_ICONS[amenity] || '•'}</span>
                  {amenity.replace('_', ' ')}
                </span>
              ))}
              {property.amenities.length > 3 && (
                <span className="text-xs text-gray-500 px-2 py-1">
                  +{property.amenities.length - 3} more
                </span>
              )}
            </div>
          </div>
        )}

        {/* Footer Actions */}
        <div className={`${variant === 'list' ? 'mt-auto' : ''}`}>
          <div className="flex items-center justify-between pt-3 border-t border-gray-100">
            
            {/* Contact Buttons */}
            <div className="flex gap-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onCall?.(property);
                }}
                className="flex items-center gap-1 px-3 py-2 bg-blue-500 text-white rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors"
              >
                <Phone className="w-4 h-4" />
                Call
              </button>
              
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onWhatsApp?.(property);
                }}
                className="flex items-center gap-1 px-3 py-2 bg-green-500 text-white rounded-lg text-sm font-medium hover:bg-green-600 transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
                WhatsApp
              </button>
            </div>

            {/* View Details */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onViewDetails?.(property.id);
              }}
              className="flex items-center gap-1 text-blue-600 hover:text-blue-700 font-medium text-sm"
            >
              View Details
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return cardContent;
}
