import React, { useState, useEffect, useCallback } from 'react';
import { Camera, Maximize, ChevronLeft, ChevronRight, X } from 'lucide-react';

/**
 * MediaBox Component - 99acres.com style image viewer
 * Features:
 * - 16:9 aspect ratio container
 * - Media tabs (Videos/Property)
 * - Carousel with navigation arrows
 * - Fallback placeholder for no images
 * - Fullscreen modal viewer
 * - Responsive design
 */
export default function MediaBox({ images = [], videos = [], property }) {
  const [activeTab, setActiveTab] = useState('property');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);

  // Combine all media items
  const mediaItems = [
    ...images.map((img, index) => ({
      type: 'image',
      src: img,
      index: index
    })),
    ...videos.map((video, index) => ({
      type: 'video',
      src: video,
      index: index + images.length
    }))
  ];

  const filteredMedia = activeTab === 'property'
    ? mediaItems.filter(item => item.type === 'image')
    : mediaItems.filter(item => item.type === 'video');

  // Auto-switch to property tab if no videos exist
  useEffect(() => {
    if (activeTab === 'videos' && videos.length === 0) {
      setActiveTab('property');
    }
  }, [videos, activeTab]);

  const goToPrevious = () => {
    setCurrentIndex(prev => prev > 0 ? prev - 1 : filteredMedia.length - 1);
  };

  const goToNext = () => {
    setCurrentIndex(prev => prev < filteredMedia.length - 1 ? prev + 1 : 0);
  };

  const handleTouchStart = (e) => {
    setStartX(e.touches[0].clientX);
    setIsDragging(true);
  };

  const handleTouchMove = (e) => {
    if (!isDragging) return;
    const currentX = e.touches[0].clientX;
    const diff = startX - currentX;

    if (diff > 50) {
      goToNext();
      setIsDragging(false);
    } else if (diff < -50) {
      goToPrevious();
      setIsDragging(false);
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  const currentMedia = filteredMedia[currentIndex];

  // Fallback placeholder for no images - 99acres media box style
  const renderNoImagesPlaceholder = () => (
    <div className="ytvideo__videoBackdrop w-full h-full bg-gray-100 rounded-lg flex flex-col items-center justify-center border border-gray-200">
      <Camera className="w-12 h-12 text-gray-400 mb-3" />
      <p className="text-gray-600 font-medium">No Image Available</p>
    </div>
  );


  // Render media content
  const renderMediaContent = () => {
    if (!currentMedia) return renderNoImagesPlaceholder();

    if (currentMedia.type === 'image') {
      return (
        <div className="w-full h-full overflow-hidden rounded-lg">
          <img
            src={currentMedia.src}
            alt={`${property?.bhk} BHK ${property?.propertyType} - Image ${currentIndex + 1}`}
            className="w-full h-full object-cover object-center transition-transform duration-300"
            onError={(e) => {
              e.target.src = 'https://placehold.co/800x450/e2e8f0/64748b?text=Image+Not+Found';
            }}
          />
        </div>
      );
    } else if (currentMedia.type === 'video') {
      return (
        <div className="w-full h-full bg-black rounded-lg flex items-center justify-center">
          <video
            src={currentMedia.src}
            controls
            className="w-full h-full object-contain rounded-lg"
            poster="https://placehold.co/800x450/000000/ffffff?text=Video"
          />
        </div>
      );
    }
  };

  // Modal viewer
  const renderModal = () => {
    if (!isModalOpen || !currentMedia) return null;

    // Handle keyboard events for modal
    useEffect(() => {
      const handleKeyDown = (e) => {
        if (e.key === 'Escape') {
          setIsModalOpen(false);
        }
      };

      const handleOutsideClick = (e) => {
        if (e.target === e.currentTarget) {
          setIsModalOpen(false);
        }
      };

      window.addEventListener('keydown', handleKeyDown);
      return () => {
        window.removeEventListener('keydown', handleKeyDown);
      };
    }, []);

    return (
      <div className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center p-4" onClick={(e) => {
        if (e.target === e.currentTarget) {
          setIsModalOpen(false);
        }
      }}>
        <div className="relative w-full max-w-6xl h-[80vh] flex items-center justify-center" onClick={e => e.stopPropagation()}>
          {/* Close button */}
          <button
            onClick={() => setIsModalOpen(false)}
            className="absolute top-4 right-4 bg-white/20 hover:bg-white/30 text-white p-2 rounded-full z-10 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Navigation arrows */}
          {filteredMedia.length > 1 && (
            <>
              <button
                onClick={goToPrevious}
                className="absolute left-4 bg-white/20 hover:bg-white/30 text-white p-3 rounded-full z-10 transition-colors"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={goToNext}
                className="absolute right-4 bg-white/20 hover:bg-white/30 text-white p-3 rounded-full z-10 transition-colors"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </>
          )}

          {/* Media content */}
          <div className="w-full h-full flex items-center justify-center">
            {currentMedia.type === 'image' ? (
              <img
                src={currentMedia.src}
                alt={`Full view - ${currentIndex + 1}`}
                className="max-w-full max-h-full object-contain"
                onError={(e) => {
                  e.target.src = 'https://placehold.co/1200x800/e2e8f0/64748b?text=Image+Not+Found';
                }}
              />
            ) : (
              <video
                src={currentMedia.src}
                controls
                autoPlay
                className="max-w-full max-h-full object-contain"
              />
            )}
          </div>

          {/* Counter */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/60 text-white px-4 py-2 rounded-full text-sm">
            {currentIndex + 1} of {filteredMedia.length}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full max-w-7xl mx-auto">
      {/* Media Tabs */}
      <div className="flex border-b border-gray-200 mb-4">
        <button
          onClick={() => setActiveTab('property')}
          className={`px-4 py-2 text-sm font-medium transition-colors ${
            activeTab === 'property'
              ? 'border-b-2 border-primary text-primary'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Property ({images.length})
        </button>
        <button
          onClick={() => setActiveTab('videos')}
          className={`px-4 py-2 text-sm font-medium transition-colors ${
            activeTab === 'videos'
              ? 'border-b-2 border-primary text-primary'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Videos ({videos.length})
        </button>
      </div>

      {/* Media Container - 16:9 aspect ratio */}
      <div className="relative aspect-video w-full bg-gray-50 rounded-lg shadow-sm overflow-hidden">
        {/* Carousel navigation arrows (only show if multiple items) */}
        {filteredMedia.length > 1 && (
          <>
            <button
              onClick={goToPrevious}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white text-gray-700 p-2 rounded-full shadow-md z-10 transition-all"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={goToNext}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white text-gray-700 p-2 rounded-full shadow-md z-10 transition-all"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </>
        )}

        {/* Fullscreen button (only show if images exist) */}
        {filteredMedia.length > 0 && (
          <button
            onClick={() => setIsModalOpen(true)}
            className="absolute bottom-4 right-4 bg-white/80 hover:bg-white text-gray-700 p-2 rounded-full shadow-md z-10 transition-all"
          >
            <Maximize className="w-5 h-5" />
          </button>
        )}

        {/* Media content or placeholder */}
        <div
          className="w-full h-full"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {/* Show no images placeholder immediately if no media exists */}
          {filteredMedia.length === 0 ? (
            renderNoImagesPlaceholder()
          ) : (
            renderMediaContent()
          )}
        </div>

        {/* Counter indicator */}
        {filteredMedia.length > 1 && (
          <div className="absolute bottom-4 left-4 bg-black/60 text-white px-3 py-1 rounded-full text-sm">
            {currentIndex + 1} of {filteredMedia.length}
          </div>
        )}
      </div>

      {/* Modal viewer */}
      {renderModal()}
    </div>
  );
}
