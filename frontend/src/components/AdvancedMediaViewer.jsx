import React, { useState, useEffect, useRef } from 'react';
import { 
  X, ChevronLeft, ChevronRight, ZoomIn, ZoomOut, RotateCw, 
  Download, Maximize, Minimize, Play, Pause, Volume2, VolumeX,
  Image as ImageIcon, Video, FileText, Camera
} from 'lucide-react';

export default function AdvancedMediaViewer({ 
  isOpen, 
  onClose, 
  mediaItems = [], 
  currentIndex = 0, 
  onIndexChange,
  property 
}) {
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [rotation, setRotation] = useState(0);
  
  const containerRef = useRef(null);
  const videoRef = useRef(null);
  const controlsTimeoutRef = useRef(null);

  const currentMedia = mediaItems[currentIndex];

  // Reset zoom and pan when media changes
  useEffect(() => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
    setRotation(0);
  }, [currentIndex]);

  // Auto-hide controls
  useEffect(() => {
    if (showControls && currentMedia?.type === 'video') {
      clearTimeout(controlsTimeoutRef.current);
      controlsTimeoutRef.current = setTimeout(() => {
        setShowControls(false);
      }, 3000);
    }
    return () => clearTimeout(controlsTimeoutRef.current);
  }, [showControls, currentMedia]);

  // Keyboard shortcuts
  useEffect(() => {
    if (!isOpen) return;
    
    const handleKeyDown = (e) => {
      switch (e.key) {
        case 'Escape':
          onClose();
          break;
        case 'ArrowLeft':
          goToPrevious();
          break;
        case 'ArrowRight':
          goToNext();
          break;
        case '+':
        case '=':
          e.preventDefault();
          setZoom(prev => Math.min(prev + 0.2, 3));
          break;
        case '-':
          e.preventDefault();
          setZoom(prev => Math.max(prev - 0.2, 0.5));
          break;
        case '0':
          e.preventDefault();
          setZoom(1);
          setPan({ x: 0, y: 0 });
          break;
        case 'r':
        case 'R':
          e.preventDefault();
          setRotation(prev => (prev + 90) % 360);
          break;
        case 'f':
        case 'F':
          e.preventDefault();
          toggleFullscreen();
          break;
        case ' ':
          e.preventDefault();
          if (currentMedia?.type === 'video') {
            togglePlayPause();
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, currentMedia]);

  const goToPrevious = () => {
    const newIndex = currentIndex > 0 ? currentIndex - 1 : mediaItems.length - 1;
    onIndexChange?.(newIndex);
  };

  const goToNext = () => {
    const newIndex = currentIndex < mediaItems.length - 1 ? currentIndex + 1 : 0;
    onIndexChange?.(newIndex);
  };

  const handleMouseDown = (e) => {
    if (zoom > 1 && currentMedia?.type === 'image') {
      setIsDragging(true);
      setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
    }
  };

  const handleMouseMove = (e) => {
    if (isDragging && zoom > 1) {
      setPan({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    }
    setShowControls(true);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleWheel = (e) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.1 : 0.1;
    setZoom(prev => Math.max(0.5, Math.min(3, prev + delta)));
  };

  const togglePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (videoRef.current) {
      videoRef.current.volume = newVolume;
    }
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const handleDownload = () => {
    if (currentMedia?.src) {
      const link = document.createElement('a');
      link.href = currentMedia.src;
      link.download = currentMedia.fileName || `media-${currentIndex + 1}`;
      link.click();
    }
  };

  const renderNoContent = (type) => {
    const icons = {
      image: <Camera className="w-16 h-16 text-gray-400" />,
      video: <Video className="w-16 h-16 text-gray-400" />,
      floorplan: <FileText className="w-16 h-16 text-gray-400" />,
      document: <FileText className="w-16 h-16 text-gray-400" />
    };

    const messages = {
      image: "No images available",
      video: "No videos available", 
      floorplan: "No floor plans available",
      document: "No documents available"
    };

    return (
      <div className="flex flex-col items-center justify-center h-full bg-gray-50">
        <div className="mb-4">
          {icons[type] || <ImageIcon className="w-16 h-16 text-gray-400" />}
        </div>
        <p className="text-gray-600 font-medium text-lg mb-2">{messages[type]}</p>
        <p className="text-gray-500 text-sm">Check back later for updates</p>
      </div>
    );
  };

  const renderImageContent = () => {
    if (!currentMedia?.src) {
      return renderNoContent('image');
    }

    return (
      <div 
        className="w-full h-full overflow-hidden cursor-move bg-gray-100"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onWheel={handleWheel}
      >
        <img
          src={currentMedia.src}
          alt={`${property?.bhk} BHK ${property?.propertyType} - Image ${currentIndex + 1}`}
          className="max-w-none transition-transform duration-200"
          style={{
            transform: `scale(${zoom}) rotate(${rotation}deg) translate(${pan.x / zoom}px, ${pan.y / zoom}px)`,
            transformOrigin: 'center center'
          }}
          draggable={false}
          onError={(e) => {
            e.target.src = 'https://placehold.co/800x600/e2e8f0/64748b?text=Image+Not+Found';
          }}
        />
      </div>
    );
  };

  const renderVideoContent = () => {
    if (!currentMedia?.src) {
      return renderNoContent('video');
    }

    return (
      <div className="w-full h-full bg-black relative">
        <video
          ref={videoRef}
          src={currentMedia.src}
          className="w-full h-full object-contain"
          onLoadedData={() => setIsPlaying(false)}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          onVolumeChange={(e) => setVolume(e.target.volume)}
          poster={currentMedia.thumbnail}
        />
        
        {/* Video Controls Overlay */}
        <div 
          className={`absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent transition-opacity duration-300 ${
            showControls ? 'opacity-100' : 'opacity-0'
          }`}
          onMouseMove={() => setShowControls(true)}
        >
          {/* Center Play Button */}
          <div className="absolute inset-0 flex items-center justify-center">
            <button
              onClick={togglePlayPause}
              className="bg-black/50 hover:bg-black/70 text-white p-4 rounded-full transition-all duration-200"
            >
              {isPlaying ? <Pause className="w-8 h-8" /> : <Play className="w-8 h-8 ml-1" />}
            </button>
          </div>

          {/* Bottom Controls */}
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <div className="flex items-center gap-3">
              <button onClick={togglePlayPause} className="text-white hover:text-gray-300">
                {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
              </button>
              
              <div className="flex items-center gap-2 flex-1">
                <Volume2 className="w-4 h-4 text-white" />
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={volume}
                  onChange={handleVolumeChange}
                  className="w-20"
                />
                <button onClick={toggleMute} className="text-white hover:text-gray-300">
                  {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                </button>
              </div>

              <button onClick={toggleFullscreen} className="text-white hover:text-gray-300">
                {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderDocumentContent = () => {
    if (!currentMedia?.src) {
      return renderNoContent(currentMedia?.type || 'document');
    }

    return (
      <div className="w-full h-full bg-gray-100 flex flex-col items-center justify-center p-8">
        <FileText className="w-20 h-20 text-gray-400 mb-6" />
        <h3 className="text-xl font-semibold text-gray-700 mb-2">
          {currentMedia.type === 'floorplan' ? 'Floor Plan' : 'Document'}
        </h3>
        <p className="text-gray-600 mb-6 text-center">{currentMedia.fileName}</p>
        
        <div className="flex gap-4">
          <button
            onClick={() => window.open(currentMedia.src, '_blank')}
            className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2"
          >
            <Maximize className="w-4 h-4" />
            View {currentMedia.fileType?.includes('pdf') ? 'PDF' : 'Document'}
          </button>
          
          {currentMedia.src && (
            <button
              onClick={handleDownload}
              className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Download
            </button>
          )}
        </div>
      </div>
    );
  };

  if (!isOpen) return null;

  return (
    <div 
      ref={containerRef}
      className={`fixed inset-0 z-50 bg-black flex ${isFullscreen ? '' : 'items-center justify-center'} p-4`}
    >
      {/* Header Controls */}
      <div className="absolute top-0 left-0 right-0 z-10 bg-gradient-to-b from-black/80 to-transparent p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={onClose}
              className="bg-white/20 hover:bg-white/30 text-white p-2 rounded-full transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
            
            <div className="text-white">
              <h2 className="font-semibold">{property?.bhk} BHK {property?.propertyType}</h2>
              <p className="text-sm opacity-80">{currentIndex + 1} of {mediaItems.length}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {currentMedia?.type === 'image' && (
              <>
                <button
                  onClick={() => setZoom(prev => Math.max(0.5, prev - 0.2))}
                  className="bg-white/20 hover:bg-white/30 text-white p-2 rounded-full transition-colors"
                  disabled={zoom <= 0.5}
                >
                  <ZoomOut className="w-4 h-4" />
                </button>
                
                <span className="text-white text-sm min-w-[60px] text-center">
                  {Math.round(zoom * 100)}%
                </span>
                
                <button
                  onClick={() => setZoom(prev => Math.min(3, prev + 0.2))}
                  className="bg-white/20 hover:bg-white/30 text-white p-2 rounded-full transition-colors"
                  disabled={zoom >= 3}
                >
                  <ZoomIn className="w-4 h-4" />
                </button>
                
                <button
                  onClick={() => setRotation(prev => (prev + 90) % 360)}
                  className="bg-white/20 hover:bg-white/30 text-white p-2 rounded-full transition-colors"
                >
                  <RotateCw className="w-4 h-4" />
                </button>
              </>
            )}
            
            {currentMedia?.src && (
              <button
                onClick={handleDownload}
                className="bg-white/20 hover:bg-white/30 text-white p-2 rounded-full transition-colors"
              >
                <Download className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Navigation Arrows */}
      {mediaItems.length > 1 && (
        <>
          <button
            onClick={goToPrevious}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-3 rounded-full transition-colors z-10"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          
          <button
            onClick={goToNext}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-3 rounded-full transition-colors z-10"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </>
      )}

      {/* Main Content */}
      <div className="w-full h-full flex items-center justify-center">
        {currentMedia?.type === 'image' && renderImageContent()}
        {currentMedia?.type === 'video' && renderVideoContent()}
        {(currentMedia?.type === 'floorplan' || currentMedia?.type === 'document') && renderDocumentContent()}
        {!currentMedia && renderNoContent('image')}
      </div>

      {/* Thumbnail Strip */}
      {mediaItems.length > 1 && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/80 backdrop-blur-sm rounded-lg p-2">
          <div className="flex gap-2 overflow-x-auto max-w-md">
            {mediaItems.map((item, index) => (
              <button
                key={index}
                onClick={() => onIndexChange?.(index)}
                className={`flex-shrink-0 w-12 h-8 rounded border-2 transition-all ${
                  index === currentIndex ? 'border-blue-500' : 'border-white/30 hover:border-white/60'
                }`}
              >
                {item.type === 'image' && item.thumbnail ? (
                  <img src={item.thumbnail} alt={`Thumbnail ${index + 1}`} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-gray-700 flex items-center justify-center">
                    {item.type === 'video' ? (
                      <Video className="w-4 h-4 text-white" />
                    ) : (
                      <FileText className="w-4 h-4 text-white" />
                    )}
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
