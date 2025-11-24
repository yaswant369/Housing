 // src/components/PropertyCard.jsx
import React, { useState } from 'react';
import { 
  MapPin, Heart, Star, Share2, 
  ChevronLeft, ChevronRight, Camera, BadgeCheck, 
  BedDouble, Bath, Ruler 
} from 'lucide-react';
import ExpandableText from './ExpandableText';

// --- Helper Function (No changes) ---
function calculateTimeAgo(dateString) {
  if (!dateString) return null;
  const postedDate = new Date(dateString);
  const now = new Date();
  const diffInMs = now.getTime() - postedDate.getTime();
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

  if (diffInDays === 0) return 'Today';
  if (diffInDays === 1) return '1 day ago';
  return `${diffInDays} days ago`;
}

export default function PropertyCard({ 
  property, isSaved, onToggleSaved, onViewDetails, API_BASE_URL 
}) {
  
  // --- Destructure ALL properties, including new optional ones ---
  const { 
    id, type, location, price, status, description,
    images = [], image, isFeatured, isVerified,
    bhk, bathrooms, area, dealerName, postedOn,
    buildingName, // New: e.g., "Appaswamy Splendour"
    highlights = [] // New: e.g., ["Swimming Pool", "Lift"]
  } = property;

  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // --- Image Carousel Logic (No changes) ---
  const allImageUrls = (images.length > 0 ? images : (image ? [image] : []))
    .map(img => `${API_BASE_URL}/${img.replace(/\\/g, '/')}`);

  if (allImageUrls.length === 0) {
    allImageUrls.push('https://placehold.co/400x300/e2e8f0/64748b?text=Image+Not+Found');
  }

  const goToPrevious = (e) => {
    e.stopPropagation();
    const isFirstSlide = currentImageIndex === 0;
    const newIndex = isFirstSlide ? allImageUrls.length - 1 : currentImageIndex - 1;
    setCurrentImageIndex(newIndex);
  };

  const goToNext = (e) => {
    e.stopPropagation();
    const isLastSlide = currentImageIndex === allImageUrls.length - 1;
    const newIndex = isLastSlide ? 0 : currentImageIndex + 1;
    setCurrentImageIndex(newIndex);
  };
  
  // --- Event Handlers (No changes) ---
  const handleContact = (e) => {
    e.stopPropagation(); 
    alert(`Contacting agent for property at ${location} (ID: ${id}).`);
  };

  const handleShare = (e) => {
    e.stopPropagation();
    alert('Share functionality');
  };

  const handleToggleSaved = (e) => {
    e.stopPropagation();
    onToggleSaved(id);
  };

  const timeAgo = calculateTimeAgo(postedOn);

  // ######################################################################
  // #
  // #   NEW RESPONSIVE JSX LAYOUT
  // #   Stacks on mobile, goes horizontal (landscape) on larger screens
  // #
  // ######################################################################
  return (
    <div 
      onClick={() => onViewDetails(id)}
      className="bg-white dark:bg-gray-800 rounded-3xl shadow-lg hover:shadow-2xl overflow-hidden transition-all relative cursor-pointer
                 flex flex-col sm:flex-row" // <-- Stacks on mobile, row on desktop
    >
      {/* --- Image Section (Left Side on Desktop) --- */}
      <div className="relative w-full sm:w-2/5 flex-shrink-0">
        <img
          src={allImageUrls[currentImageIndex]}
          alt={type}
          className="w-full h-48 sm:h-full object-cover object-center" // <-- Full height on desktop
          onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/400x300/e2e8f0/64748b?text=Image+Not+Found' }}
        />

        {/* Carousel Arrows */}
        {allImageUrls.length > 1 && (
          <>
            <button 
              onClick={goToPrevious}
              className="absolute top-1/2 left-2 -translate-y-1/2 bg-white/70 text-gray-900 p-1.5 rounded-full hover:bg-white transition-all z-10 shadow-md"
            >
              <ChevronLeft size={20} />
            </button>
            <button 
              onClick={goToNext}
              className="absolute top-1/2 right-2 -translate-y-1/2 bg-white/70 text-gray-900 p-1.5 rounded-full hover:bg-white transition-all z-10 shadow-md"
            >
              <ChevronRight size={20} />
            </button>
          </>
        )}

        {/* Photo Count Badge */}
        <div className="absolute bottom-3 left-3 bg-black/60 text-white text-xs font-semibold px-2 py-1 rounded-full flex items-center space-x-1 z-10">
          <Camera size={14} />
          <span>{currentImageIndex + 1} / {allImageUrls.length}</span>
        </div>
        
        {/* Featured Badge */}
        {isFeatured && (
          <div className="absolute top-3 left-3 bg-yellow-400 text-yellow-900 text-xs font-bold px-3 py-1 rounded-full shadow-md flex items-center space-x-1 z-10">
            <Star size={14} fill="currentColor" />
            <span>Featured</span>
          </div>
        )}

        {/* Verified Badge */}
        {isVerified && (
          <div className="absolute top-3 right-3 bg-blue-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md flex items-center space-x-1 z-10">
            <BadgeCheck size={14} fill="currentColor" />
            <span>Verified</span>
          </div>
        )}
      </div>
      
      {/* --- Card Content Body (Right Side on Desktop) --- */}
      <div className="p-4 flex-1 flex flex-col w-full sm:w-3/5">
        
        {/* Top Row: Title/Location and Save Button */}
        <div className="flex justify-between items-start mb-2">
          <div className="flex-1">
            {buildingName && (
              <span className="text-sm text-gray-500 dark:text-gray-400">{buildingName}</span>
            )}
            <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 leading-tight">{type}</h2>
            <div className="flex items-center space-x-1 text-gray-600 dark:text-gray-400 text-sm mt-1">
              <MapPin size={16} className="flex-shrink-0" />
              <span className="truncate">{location}</span>
            </div>
          </div>
          <button
            onClick={handleToggleSaved}
            className={`ml-2 p-3 rounded-full transition-colors shadow flex-shrink-0 ${
              isSaved ? 'bg-red-100 text-red-500' : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
            }`}
            aria-label="Like property"
          >
            <Heart size={20} fill={isSaved ? "currentColor" : "none"} />
          </button>
        </div>

        {/* --- Key Specs Grid (Inspired by 99acres) --- */}
        <div className="grid grid-cols-3 gap-2 text-center border-y dark:border-gray-700 my-3 py-3">
          <div>
            <span className="text-xl font-bold text-blue-600 dark:text-blue-400 block">{price}</span>
            <span className="text-xs text-gray-500 dark:text-gray-400">{status}</span>
          </div>
          <div>
            <span className="text-xl font-bold text-gray-800 dark:text-gray-200 block">{area}</span>
            <span className="text-xs text-gray-500 dark:text-gray-400">Built-up Area</span>
          </div>
          <div>
            <span className="text-xl font-bold text-gray-800 dark:text-gray-200 block">{bhk} BHK</span>
            <span className="text-xs text-gray-500 dark:text-gray-400">{bathrooms || '1'} {bathrooms > 1 ? 'Baths' : 'Bath'}</span>
          </div>
        </div>

        {/* --- Highlights Row (New) --- */}
        {highlights.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Highlights:</span>
            {highlights.slice(0, 3).map((highlight, index) => (
              <span key={index} className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-0.5 rounded-full text-xs">
                {highlight}
              </span>
            ))}
            {highlights.length > 3 && (
              <span className="text-xs text-gray-500">+ {highlights.length - 3} more</span>
            )}
          </div>
        )}

        {/* --- Description (Using ExpandableText) --- */}
        {description && (
          <ExpandableText 
            text={description} 
            maxLength={70} // Shorter max length for this layout
            className="text-gray-500 dark:text-gray-400 text-sm"
          />
        )}
        
        {/* Spacer to push footer down */}
        <div className="flex-grow"></div> 
        
        {/* --- Footer Actions --- */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700 mt-4">
          {/* Agent Info */}
          <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
            {dealerName && <span className="font-bold">{dealerName}</span>}
            {dealerName && timeAgo && <span> &bull; </span>}
            {timeAgo && <span>{timeAgo}</span>}
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-2 ml-3 flex-shrink-0">
             <button
              onClick={handleShare}
              className="p-2.5 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors shadow-md"
              aria-label="Share property"
            >
              <Share2 size={18} />
            </button>
            <button
              onClick={handleContact}
              className="bg-gradient-to-r from-blue-600 to-blue-800 text-white font-bold py-2.5 px-5 rounded-full hover:from-blue-700 hover:to-blue-900 transition-colors text-sm shadow-lg"
            >
              Contact
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}