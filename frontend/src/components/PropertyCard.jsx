 // src/components/PropertyCard.jsx
import React, { useState } from 'react';
import { MapPin, BadgeCheck, BedDouble, Bath, Ruler, Home, Archive, Heart, Share2, ExternalLink, Scale } from 'lucide-react';
import toast from 'react-hot-toast';
import { formatPrice, formatArea } from '../utils/propertyHelpers';

// Backward compatibility with old PropertyCard usage
const normalizeLegacyProperty = (property, API_BASE_URL) => {
  if (!property) return {};
  
  // Get image from legacy images array or new media structure
  let imageUrl = null;
  if (property.images && property.images.length > 0) {
    const firstImage = property.images[0];
    if (typeof firstImage === 'object') {
      imageUrl = firstImage.medium || firstImage.thumbnail || firstImage.optimized;
    } else {
      imageUrl = firstImage;
    }
  } else if (property.media?.photos?.length > 0) {
    const firstPhoto = property.media.photos.find(p => p.isCover) || property.media.photos[0];
    imageUrl = firstPhoto?.thumbnail || firstPhoto?.url;
  }

  return {
    title: property.type || property.title || 'Property',
    bhk: property.bhk,
    location: property.location,
    price: property.price,
    priceLabel: property.status === 'For Sale' || property.status === 'active' ? 'For Sale' : 'For Rent',
    isArchived: property.status === 'expired' || property.status === 'paused',
    isVerified: property.isFeatured || false,
    area: property.area,
    baths: property.bathrooms || property.bhk,
    imageUrl, // Store raw imageUrl, let getImageSrc handle URL building
    description: property.description,
    id: property.id,
    onContact: () => console.log(`Contact property ${property.id}`)
  };
};

export default function PropertyCard({ 
  // New API props
  title, bhk, location, price, priceLabel = "For Sale", isArchived = false, 
  isVerified = false, area, baths, imageUrl, description, onContact, className = "", id,
  
  // Legacy API props for backward compatibility
  property, API_BASE_URL = '', onViewDetails,
  

  
  // New props for save/share functionality
  isSaved = false, 
  onToggleSaved,
  
  // Comparison functionality
  addToComparison,
  
  // Layout variant for different contexts
  variant = "default" // "default" or "compact"
}) {
  const [imageError, setImageError] = useState(false);

  // Handle backward compatibility
  let props = {
    title, bhk, location, price, priceLabel, isArchived, isVerified, area, baths, imageUrl, description, onContact, id
  };

  if (property) {
    // Using legacy API - normalize the property data
    props = { ...props, ...normalizeLegacyProperty(property, API_BASE_URL) };
  }

  const {
    title: propTitle,
    bhk: propBhk,
    location: propLocation,
    price: propPrice,
    priceLabel: propPriceLabel,
    isArchived: propIsArchived,
    isVerified: propIsVerified,
    area: propArea,
    baths: propBaths,
    imageUrl: propImageUrl,
    description: propDescription,
    onContact: propOnContact,
    id: propId,
    onViewDetails: propOnViewDetails
  } = props;

  const handleImageError = (e) => {
    // Only log image errors in development mode to reduce console noise
    if (import.meta.env.DEV) {
      console.warn('Image failed to load:', propImageUrl);
    }
    setImageError(true);
  };

  // Enhanced image URL processing
  const getImageSrc = () => {
    if (!propImageUrl) return null;
    
    // Handle blob URLs (from file uploads) - these should be used directly
    if (propImageUrl.startsWith('blob:')) {
      return propImageUrl;
    }
    
    // Handle data URLs (base64 images)
    if (propImageUrl.startsWith('data:')) {
      return propImageUrl;
    }
    
    // Handle full URLs (http/https) - return as-is
    if (propImageUrl.startsWith('http://') || propImageUrl.startsWith('https://')) {
      return propImageUrl;
    }
    
    // Handle relative paths - build proper backend URL
    // 1. Normalize backslashes to forward slashes
    const pathWithForwardSlashes = propImageUrl.replace(/\\/g, '/');

    // 2. Remove any "uploads/" prefix
    const cleanPath = pathWithForwardSlashes.startsWith('uploads/') 
      ? pathWithForwardSlashes.substring('uploads/'.length) 
      : pathWithForwardSlashes;

    // 3. Build the full URL using API_BASE_URL
    const baseUrl = API_BASE_URL.replace(/\/$/, '');
    return `${baseUrl}/uploads/${cleanPath}`;
  };

  const handleCardClick = () => {
    // Handle navigation based on available props
    if (propOnViewDetails && propId) {
      propOnViewDetails(propId);
    } else if (onViewDetails && propId) {
      onViewDetails(propId);
    } else if (propOnContact) {
      propOnContact();
    }
  };

  const handleContact = (e) => {
    e.stopPropagation();
    if (propOnContact) {
      propOnContact();
    } else {
      alert('Contact functionality not implemented yet');
    }
  };

  const handleSave = (e) => {
    e.stopPropagation();
    if (onToggleSaved && propId) {
      onToggleSaved(propId);
      toast.success(isSaved ? 'Removed from saved' : 'Saved property');
    } else {
      toast.error('Save functionality not available');
    }
  };

  const handleAddToComparison = (e) => {
    e.stopPropagation();
    if (addToComparison && propId) {
      const propertyToAdd = {
        id: propId,
        bhk: propBhk,
        location: propLocation,
        price: propPrice,
        area: propArea,
        bathrooms: propBaths,
        type: propTitle,
        images: property?.images || []
      };
      addToComparison(propertyToAdd);
      toast.success('Added to comparison');
    } else {
      toast.error('Comparison functionality not available');
    }
  };

  const handleShare = (e) => {
    e.stopPropagation();
    const shareUrl = `${window.location.origin}/property/${propId}`;
    
    if (navigator.share) {
      navigator.share({
        title: `${propBhk} BHK ${propTitle}`,
        text: `Check out this property: ${propTitle}`,
        url: shareUrl
      });
    } else {
      navigator.clipboard.writeText(shareUrl).then(() => {
        toast.success('Link copied to clipboard');
      }).catch(() => {
        toast.error('Failed to copy link');
      });
    }
  };





  return (
    <div 
      onClick={handleCardClick}
      className={`bg-white rounded-lg border border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all duration-200 overflow-hidden cursor-pointer group h-full flex flex-col ${className}`}
    >
      {/* Image Section with Fixed Aspect Ratio */}
      <div className={`relative w-full ${variant === 'compact' ? 'aspect-[16/11]' : 'aspect-[4/3]'} bg-gray-100 overflow-hidden flex-shrink-0`}>
        {(() => {
          const imageSrc = getImageSrc();
          return imageSrc && !imageError ? (
            <img
              src={imageSrc}
              alt={propTitle}
              className="w-full h-full object-cover object-center transition-transform duration-200 group-hover:scale-105"
              onError={handleImageError}
              loading="lazy"
            />
          ) : (
            <div className={`w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex flex-col items-center justify-center ${variant === 'compact' ? 'p-6' : 'p-6'}`}>
              <Home size={variant === 'compact' ? 32 : 36} className="text-gray-400 mb-2 flex-shrink-0" />
              <span className={`text-gray-500 text-center font-medium leading-tight ${variant === 'compact' ? 'text-sm' : 'text-sm'}`}>No Image Available</span>
            </div>
          );
        })()}

        {/* Status Badges */}
        {(propIsVerified || propIsArchived) && (
          <div className="absolute top-2 left-2 sm:top-3 sm:left-3 flex flex-col gap-1">
            {propIsVerified && (
              <span className={`bg-green-500 text-white font-medium px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full flex items-center gap-1 shadow-sm ${
                variant === 'compact' ? 'text-[10px]' : 'text-xs'
              }`}>
                <BadgeCheck size={variant === 'compact' ? 8 : 10} className="sm:w-[12px] sm:h-[12px]" />
                <span className="hidden xs:inline">Verified</span>
              </span>
            )}
            {propIsArchived && (
              <span className={`bg-gray-500 text-white font-medium px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full flex items-center gap-1 shadow-sm ${
                variant === 'compact' ? 'text-[10px]' : 'text-xs'
              }`}>
                <Archive size={variant === 'compact' ? 8 : 10} className="sm:w-[12px] sm:h-[12px]" />
                <span className="hidden xs:inline">Archived</span>
              </span>
            )}
          </div>
        )}

        {/* Save/Share/Compare Buttons */}
        <div className="absolute top-1 right-1 sm:top-2 sm:right-2 flex gap-1 sm:gap-1.5">
          <button
            onClick={handleSave}
            className={`rounded-full shadow-sm transition-all duration-200 backdrop-blur-sm touch-manipulation ${
              isSaved
                ? 'bg-red-500 text-white hover:bg-red-600'
                : 'bg-white/90 text-gray-700 hover:bg-white hover:text-red-500'
            } ${variant === 'compact' ? 'p-1 sm:p-1.5' : 'p-1.5 sm:p-2'}`}
            title={isSaved ? 'Remove from saved' : 'Save property'}
          >
            <Heart size={variant === 'compact' ? 10 : 12} className="sm:w-[16px] sm:h-[16px]" fill={isSaved ? 'currentColor' : 'none'} />
          </button>
          <button
            onClick={handleShare}
            className={`rounded-full bg-white/90 text-gray-700 hover:bg-white hover:text-blue-500 transition-all duration-200 shadow-sm backdrop-blur-sm touch-manipulation ${
              variant === 'compact' ? 'p-1 sm:p-1.5' : 'p-1.5 sm:p-2'
            }`}
            title="Share property"
          >
            <Share2 size={variant === 'compact' ? 10 : 12} className="sm:w-[16px] sm:h-[16px]" />
          </button>
          <button
            onClick={handleAddToComparison}
            className={`rounded-full bg-white/90 text-gray-700 hover:bg-white hover:text-green-500 transition-all duration-200 shadow-sm backdrop-blur-sm touch-manipulation ${
              variant === 'compact' ? 'p-1 sm:p-1.5' : 'p-1.5 sm:p-2'
            }`}
            title="Add to comparison"
          >
            <Scale size={variant === 'compact' ? 10 : 12} className="sm:w-[16px] sm:h-[16px]" />
          </button>
        </div>

      </div>

      {/* Content Section - Using flex to ensure consistent heights */}
      <div className={`flex flex-col flex-1 p-3 sm:p-4`}>
        {/* Title */}
        <h3 className={`font-semibold text-gray-900 leading-tight group-hover:text-blue-600 line-clamp-2 ${
          variant === 'compact' ? 'text-sm mb-1' : 'text-base sm:text-lg mb-2'
        }`}>
          {(() => {
            // Check if propTitle already contains BHK information to avoid duplication
            const titleLower = propTitle.toLowerCase();
            const hasBHK = titleLower.includes('bhk') || titleLower.includes('bedroom') || titleLower.includes('bed');
            
            if (hasBHK) {
              return propTitle; // Title already contains BHK info
            } else {
              return `${propBhk} BHK ${propTitle}`; // Add BHK prefix
            }
          })()}
        </h3>

        {/* Location */}
        <div className={`flex items-center text-gray-600 ${variant === 'compact' ? 'text-xs mb-2 sm:mb-3' : 'text-sm mb-3'}`}>
          <MapPin size={variant === 'compact' ? 12 : 14} className="mr-1.5 sm:mr-2 flex-shrink-0 text-gray-400" />
          <span className="truncate text-xs sm:text-sm">{propLocation}</span>
        </div>

        {/* Price */}
        <div className={`${variant === 'compact' ? 'mb-2 sm:mb-3' : 'mb-3'}`}>
          <span className={`font-bold text-gray-900 ${variant === 'compact' ? 'text-base sm:text-lg' : 'text-lg sm:text-xl'}`}>
            {formatPrice(propPrice)}
          </span>
          <span className={`text-gray-500 ml-1.5 sm:ml-2 ${variant === 'compact' ? 'text-[10px] sm:text-xs' : 'text-xs sm:text-sm'}`}>
            {propPriceLabel}
          </span>
        </div>

        {/* Features - Fixed layout for consistency */}
        <div className={`flex items-center justify-between text-gray-600 bg-gray-50 rounded-lg p-2 ${
          variant === 'compact' ? 'mb-3' : 'mb-4'
        }`}>
          <div className="flex items-center gap-1">
            <Ruler size={variant === 'compact' ? 12 : 14} className="text-gray-400" />
            <span className={`font-medium ${variant === 'compact' ? 'text-xs' : 'text-xs'}`}>{formatArea(propArea)}</span>
          </div>
          <div className="flex items-center gap-1">
            <BedDouble size={variant === 'compact' ? 12 : 14} className="text-gray-400" />
            <span className={`font-medium ${variant === 'compact' ? 'text-xs' : 'text-xs'}`}>{propBhk} BHK</span>
          </div>
          <div className="flex items-center gap-1">
            <Bath size={variant === 'compact' ? 12 : 14} className="text-gray-400" />
            <span className={`font-medium ${variant === 'compact' ? 'text-xs' : 'text-xs'}`}>{propBaths || '1'} Bath</span>
          </div>
        </div>

        {/* Description - Limited to maintain consistency */}
        {propDescription && variant === 'default' && (
          <p className="text-sm text-gray-500 line-clamp-2 mb-4 flex-1">
            {propDescription}
          </p>
        )}

        {/* Footer - Always at bottom */}
        <div className={`flex items-center justify-between pt-3 border-t border-gray-100 mt-auto ${
          variant === 'compact' ? 'pt-3' : 'pt-3'
        }`}>
          <button
            onClick={handleContact}
            className={`flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium transition-colors ${
              variant === 'compact' ? 'text-xs' : 'text-sm'
            }`}
          >
            <ExternalLink size={variant === 'compact' ? 14 : 16} />
            Contact
          </button>
          
          {variant === 'default' && (
            <span className="text-xs text-gray-400">
              Click to view details
            </span>
          )}
        </div>
      </div>
    </div>
  );
}