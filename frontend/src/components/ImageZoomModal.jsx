import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';

/**
 * ImageZoomModal Component - Simplified Carousel View
 * - Shows images at their natural dimensions (respecting upload size)
 * - Navigate with arrow buttons
 * - Keyboard support for arrow keys and Esc
 * - Centered, properly aligned display
 */
export default function ImageZoomModal({ images, initialIndex = 0, onClose, API_BASE_URL }) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  // Normalize image URL (handle both strings and objects)
  const normalizeImageUrl = (img) => {
    if (!img) return null;
    if (typeof img === 'string') {
      const clean = img.replace(/\\/g, '/');
      if (clean.startsWith('http')) return clean;
      return clean.startsWith('/') ? `${API_BASE_URL}${clean}` : `${API_BASE_URL}/${clean}`;
    }
    // object form - use optimized or medium for best quality
    const url = img.optimized || img.medium || img.thumbnail;
    if (!url) return null;
    const clean = url.replace(/\\/g, '/');
    return clean.startsWith('http') ? clean : (clean.startsWith('/') ? `${API_BASE_URL}${clean}` : `${API_BASE_URL}/${clean}`);
  };

  const normalizedImages = images.map(normalizeImageUrl).filter(Boolean);
  const currentImage = normalizedImages[currentIndex];

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') goToPrevious();
      if (e.key === 'ArrowRight') goToNext();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex]);

  // Lock body scroll while modal is open and ensure modal is above all stacking contexts
  useEffect(() => {
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prevOverflow; };
  }, []);

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? normalizedImages.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev === normalizedImages.length - 1 ? 0 : prev + 1));
  };

  const modal = (
    <div style={{ position: 'fixed', inset: 0, zIndex: 2147483647 }} className="bg-black bg-opacity-95 flex flex-col justify-center items-center p-4">
      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 bg-white/20 hover:bg-white/30 text-white p-2 rounded-full z-10 transition"
      >
        <X size={24} />
      </button>

      {/* Main Image Container - Centered with fixed reasonable size */}
      <div className="relative w-full max-w-4xl h-auto flex justify-center items-center">
        {currentImage && (
          <img
            src={currentImage}
            alt={`Property ${currentIndex + 1}`}
            className="max-w-full max-h-96 object-contain" // Fixed max height of 24rem (384px)
            style={{ 
              maxWidth: 'min(90vw, 800px)', // Reasonable max width
              maxHeight: '384px', // Fixed reasonable height
              width: 'auto',
              height: 'auto'
            }}
            onError={(e) => {
              e.target.src = 'https://placehold.co/800x600/e2e8f0/64748b?text=Image+Not+Found';
            }}
          />
        )}
      </div>

      {/* Navigation Arrows - Clean and Simple */}
      {normalizedImages.length > 1 && (
        <>
          <button
            onClick={goToPrevious}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 text-white p-3 rounded-full transition duration-200"
          >
            <ChevronLeft size={28} />
          </button>

          <button
            onClick={goToNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 text-white p-3 rounded-full transition duration-200"
          >
            <ChevronRight size={28} />
          </button>
        </>
      )}
    </div>
  );

  return createPortal(modal, document.body);
}
