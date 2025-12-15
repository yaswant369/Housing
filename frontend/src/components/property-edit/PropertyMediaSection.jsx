import React, { useState, useEffect } from 'react';
import {
  Image,
  Video,
  FileText,
  Camera,
  Upload,
  Star,
  Eye,
  Trash2,
  StarHalf,
  CheckCircle,
  GripVertical
} from 'lucide-react';
import MediaUploader from './MediaUploader';

const PropertyMediaSection = ({ property, formData, onInputChange }) => {
  const [mediaSection, setMediaSection] = useState('photos');
  const [uploading, setUploading] = useState(false);
  const [dragIndex, setDragIndex] = useState(null);
  const [reordering, setReordering] = useState(false);

  const handleMediaUpload = (files, metadata) => {
    setUploading(true);
    
    // Process file upload
    setTimeout(() => {
      const currentMedia = formData.media || {
        photos: [],
        videos: [],
        floorplans: [],
        brochures: []
      };
      
      const sectionKey = mediaSection === 'photos' ? 'photos' :
                        mediaSection === 'videos' ? 'videos' :
                        mediaSection === 'floorplans' ? 'floorplans' : 'brochures';
      
      if (!currentMedia[sectionKey]) {
        currentMedia[sectionKey] = [];
      }
      
      const newMediaItem = {
        id: Date.now(),
        fileName: files[0].name,
        fileType: files[0].type,
        fileSize: files[0].size,
        metadata: metadata,
        uploadDate: new Date().toISOString(),
        isCover: currentMedia[sectionKey].length === 0,
        url: metadata.tempUrl || URL.createObjectURL(files[0]), // Use temp URL for preview
        sortOrder: currentMedia[sectionKey].length,
        imageType: metadata.imageType || null,
        // Store the actual file for upload
        file: metadata.file || files[0]
      };
      
      currentMedia[sectionKey] = [...currentMedia[sectionKey], newMediaItem];
      
      onInputChange('media', currentMedia);
      setUploading(false);
    }, 1000);
  };

  // Clean up object URLs when component unmounts or media changes
  React.useEffect(() => {
    return () => {
      const media = formData.media || {};
      const sectionKeys = ['photos', 'videos', 'floorplans', 'brochures'];
      
      sectionKeys.forEach(key => {
        if (media[key]) {
          media[key].forEach(item => {
            if (item.url && item.url.startsWith('blob:')) {
              URL.revokeObjectURL(item.url);
            }
          });
        }
      });
    };
  }, [formData.media]);

  const removeMedia = (sectionKey, index) => {
    const currentMedia = { ...formData };
    if (currentMedia.media[sectionKey] && currentMedia.media[sectionKey][index]) {
      const mediaItem = currentMedia.media[sectionKey][index];
      
      // For legacy images, we need to filter them out completely before sending to backend
      // to prevent them from being re-migrated. We also need to update the backend data.
      if (mediaItem.isLegacy) {
        console.log(`Removing legacy image at index ${index} - will be filtered from backend`);
        
        // Mark the legacy image as deleted instead of removing it immediately
        currentMedia.media[sectionKey] = currentMedia.media[sectionKey].map((item, i) =>
          i === index ? { ...item, isDeleted: true } : item
        );
        
        // For legacy images, we need to also modify the original property.images array
        // This is handled through a special field that the backend will process
        const existingLegacyImagesToDelete = Array.isArray(currentMedia.legacyImagesToDelete) ? currentMedia.legacyImagesToDelete : [];
        currentMedia.legacyImagesToDelete = [...existingLegacyImagesToDelete, index];
      } else {
        // For new images, remove completely
        currentMedia.media[sectionKey] = currentMedia.media[sectionKey].filter((_, i) => i !== index);
      }
      
      // Update both media and legacyImagesToDelete
      onInputChange('media', currentMedia.media);
      if (mediaItem.isLegacy) {
        onInputChange('legacyImagesToDelete', currentMedia.legacyImagesToDelete);
      }
    }
  };

  const setCoverImage = (sectionKey, index) => {
    const currentMedia = { ...formData.media };
    if (currentMedia[sectionKey]) {
      currentMedia[sectionKey] = currentMedia[sectionKey].map((item, i) => ({
        ...item,
        isCover: i === index
      }));
      onInputChange('media', currentMedia);
    }
  };

  const updateImageType = (sectionKey, index, imageType) => {
    const currentMedia = { ...formData.media };
    if (currentMedia[sectionKey] && currentMedia[sectionKey][index]) {
      currentMedia[sectionKey][index].imageType = imageType;
      onInputChange('media', currentMedia);
    }
  };

  const reorderMedia = (sectionKey, fromIndex, toIndex) => {
    const currentMedia = { ...formData.media };
    if (currentMedia[sectionKey]) {
      const items = [...currentMedia[sectionKey]];
      const [movedItem] = items.splice(fromIndex, 1);
      items.splice(toIndex, 0, movedItem);
      
      // Update sort orders
      items.forEach((item, index) => {
        item.sortOrder = index;
      });
      
      currentMedia[sectionKey] = items;
      onInputChange('media', currentMedia);
    }
  };

  const getMediaCount = (sectionKey) => {
    return formData.media?.[sectionKey]?.length || 0;
  };

  const getTotalMediaCount = () => {
    const media = formData.media || {};
    const sectionKeys = ['photos', 'videos', 'floorplans', 'brochures'];
    return sectionKeys.reduce((total, key) => total + (media[key]?.length || 0), 0);
  };

  const getSectionKey = (sectionId) => {
    switch (sectionId) {
      case 'photos': return 'photos';
      case 'videos': return 'videos';
      case 'floorplans': return 'floorplans';
      case 'brochures': return 'brochures';
      default: return 'photos';
    }
  };

  const getCurrentSectionKey = () => {
    return getSectionKey(mediaSection);
  };

  const mediaSections = [
    {
      id: 'photos',
      title: 'Photos',
      icon: Image,
      color: 'text-green-600',
      description: 'Property photos for better visibility',
      maxFiles: 20
    },
    {
      id: 'videos',
      title: 'Videos',
      icon: Video,
      color: 'text-blue-600',
      description: 'Property walkthrough videos',
      maxFiles: 5
    },
    {
      id: 'floorplans',
      title: 'Floor Plans',
      icon: FileText,
      color: 'text-purple-600',
      description: 'Architectural floor plans',
      maxFiles: 5
    },
    {
      id: 'brochures',
      title: 'Brochures',
      icon: Upload,
      color: 'text-orange-600',
      description: 'Property brochures and documents',
      maxFiles: 3
    }
  ];

  const renderMediaGrid = (sectionKey, mediaList) => {
    return (
      <div className="space-y-4">
        {mediaList.length > 0 && (
          <div className="flex items-center justify-between">
            <h4 className="font-medium text-gray-900">
              {mediaList.length} {sectionKey} uploaded
            </h4>
            <div className="text-sm text-gray-600">
              Drag to reorder • First image is cover
            </div>
          </div>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {mediaList.filter(media => !(media.isLegacy && media.isDeleted)).map((media, index) => {
            // Calculate the actual index in the original array (accounting for filtered items)
            const actualIndex = mediaList.findIndex((item, i) =>
              !item.isDeleted && i === index
            );
            
            return (
            <div
              key={media.id || index}
              className={`relative bg-white rounded-lg border border-gray-200 overflow-hidden group hover:shadow-lg transition-shadow ${
                media.isDeleted ? 'opacity-50' : ''
              }`}
              draggable={!media.isDeleted}
              onDragStart={() => !media.isDeleted && setDragIndex(actualIndex)}
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => {
                if (dragIndex !== null && dragIndex !== actualIndex && !media.isDeleted) {
                  reorderMedia(sectionKey, dragIndex, actualIndex);
                }
                setDragIndex(null);
              }}
            >
              {/* Drag Handle */}
              {!media.isDeleted && (
                <div className="absolute top-2 left-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="p-1 bg-black/50 rounded cursor-move">
                    <GripVertical size={12} className="text-white" />
                  </div>
                </div>
              )}

              {/* Preview */}
              <div className="aspect-video bg-gray-100 relative">
                {media.fileType?.startsWith('image/') || sectionKey === 'photos' ? (
                  <img
                    src={media.url}
                    alt={media.fileName}
                    className="w-full h-full object-cover cursor-pointer"
                    onClick={() => !media.isDeleted && setCoverImage(sectionKey, index)}
                  />
                ) : media.fileType?.startsWith('video/') || sectionKey === 'videos' ? (
                  <div className="w-full h-full flex items-center justify-center bg-gray-200">
                    <Video size={32} className="text-gray-500" />
                  </div>
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-blue-50">
                    <FileText size={32} className="text-blue-500" />
                  </div>
                )}
                
                {/* Cover Badge */}
                {media.isCover && !media.isDeleted && (
                  <div className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
                    <Star size={10} />
                    Cover
                  </div>
                )}
                
                {/* Deleted Badge */}
                {media.isDeleted && (
                  <div className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
                    <Trash2 size={10} />
                    Deleted
                  </div>
                )}
                
                {/* Order Number */}
                {!media.isDeleted && (
                  <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                    {index + 1}
                  </div>
                )}

                {/* Image Type for photos */}
                {sectionKey === 'photos' && media.imageType && !media.isDeleted && (
                  <div className="absolute top-2 right-8 bg-blue-600 text-white text-xs px-2 py-1 rounded">
                    {media.imageType.replace('_', ' ')}
                  </div>
                )}
                
                {/* Overlay Actions */}
                {!media.isDeleted && (
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    {!media.isCover && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setCoverImage(sectionKey, index);
                        }}
                        className="p-2 bg-white rounded-full text-green-600 hover:bg-green-50 transition-colors"
                        title="Set as cover image"
                      >
                        <Star size={16} />
                      </button>
                    )}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removeMedia(sectionKey, actualIndex);
                      }}
                      className="p-2 bg-white rounded-full text-red-600 hover:bg-red-50 transition-colors"
                      title={media.isLegacy ? "Remove (marked as deleted)" : "Remove media"}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                )}
              </div>
              
              {/* File Info */}
              <div className="p-3">
                <p className="text-xs text-gray-600 truncate" title={media.fileName}>
                  {media.fileName}
                </p>
                {media.fileSize && media.fileSize > 0 && (
                  <p className="text-xs text-gray-500">
                    {(media.fileSize / (1024 * 1024)).toFixed(1)} MB
                  </p>
                )}
                {media.isLegacy && (
                  <p className="text-xs text-gray-400 italic">
                    Legacy image
                  </p>
                )}
                {media.isDeleted && (
                  <p className="text-xs text-red-500 italic">
                    Will be removed on save
                  </p>
                )}
                {sectionKey === 'photos' && media.imageType && !media.isDeleted && (
                  <div className="mt-2">
                    <select
                      value={media.imageType || ''}
                      onChange={(e) => updateImageType(sectionKey, actualIndex, e.target.value)}
                      className="w-full text-xs px-2 py-1 border border-gray-300 rounded bg-white"
                    >
                      <option value="">Select type</option>
                      <option value="bedroom">🛏️ Bedroom</option>
                      <option value="living_room">🛋️ Living Room</option>
                      <option value="kitchen">🍳 Kitchen</option>
                      <option value="bathroom">🚿 Bathroom</option>
                      <option value="balcony">🌅 Balcony</option>
                      <option value="exterior">🏠 Exterior</option>
                      <option value="society">🏢 Society</option>
                      <option value="entrance">🚪 Entrance</option>
                    </select>
                  </div>
                )}
              </div>
            </div>
            );
          })}
          
          {/* Upload More Button */}
          {mediaList.length > 0 && (
            <div className="aspect-video">
              <label className="w-full h-full border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-colors">
                <div className="text-center">
                  <Upload size={24} className="text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">Upload More</p>
                </div>
                <input
                  type="file"
                  multiple
                  accept={sectionKey === 'photos' ? 'image/*' :
                         sectionKey === 'videos' ? 'video/*' :
                         sectionKey === 'floorplans' ? 'image/*,application/pdf' :
                         'application/pdf'}
                  onChange={(e) => e.target.files && handleMediaUpload(e.target.files, {})}
                  className="hidden"
                />
              </label>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
          <Camera className="text-blue-600" size={24} />
          Photos, Videos & Floorplans
        </h2>
        <div className="text-sm text-gray-500">
          Section 7 of 9
        </div>
      </div>

      {/* Media Summary */}
      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">
          Media Overview
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {mediaSections.map((section) => {
            const IconComponent = section.icon;
            const count = getMediaCount(getSectionKey(section.id));
            return (
              <div key={section.id} className="text-center p-3 bg-white rounded-lg border">
                <IconComponent size={24} className={`mx-auto mb-2 ${section.color}`} />
                <p className="text-lg font-bold text-gray-900">{count}</p>
                <p className="text-xs text-gray-600">{section.title}</p>
              </div>
            );
          })}
        </div>
        <div className="mt-4 flex items-center justify-between">
          <div className="text-sm text-gray-600">
            Total Media Files: <span className="font-semibold">{getTotalMediaCount()}</span>
          </div>
          <div className="text-sm text-green-600 flex items-center gap-1">
            <CheckCircle size={16} />
            Ready for upload
          </div>
        </div>
      </div>

      {/* Media Type Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          {mediaSections.map((section) => {
            const IconComponent = section.icon;
            const count = getMediaCount(getSectionKey(section.id));
            return (
              <button
                key={section.id}
                onClick={() => setMediaSection(section.id)}
                className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  mediaSection === section.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <IconComponent size={18} />
                <span>{section.title}</span>
                {count > 0 && (
                  <span className="bg-gray-100 text-gray-600 text-xs rounded-full px-2 py-1">
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Current Section Info */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="font-semibold text-gray-900 mb-2">
          {mediaSections.find(s => s.id === mediaSection)?.title}
        </h3>
        <p className="text-sm text-gray-600 mb-3">
          {mediaSections.find(s => s.id === mediaSection)?.description}
        </p>
        <div className="flex items-center gap-4 text-xs text-gray-500">
          <span>Max {mediaSections.find(s => s.id === mediaSection)?.maxFiles} files</span>
          <span>•</span>
          <span>Drag & drop supported</span>
          <span>•</span>
          <span>Auto-thumbnail generation</span>
        </div>
      </div>

      {/* Media Uploader */}
      <MediaUploader
        mediaType={mediaSection}
        onMediaUpload={handleMediaUpload}
        existingMedia={formData.media?.[getCurrentSectionKey()] || []}
        maxFiles={mediaSections.find(s => s.id === mediaSection)?.maxFiles}
      />

      {/* Existing Media Display */}
      {formData.media?.[getCurrentSectionKey()]?.length > 0 && renderMediaGrid(
        getCurrentSectionKey(),
        formData.media[getCurrentSectionKey()]
      )}

      {/* Tips */}
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <div className="p-1 bg-amber-100 rounded">
            <Camera className="text-amber-600" size={16} />
          </div>
          <div>
            <h4 className="font-semibold text-amber-800 mb-1">
              Media Upload Tips
            </h4>
            <ul className="text-sm text-amber-700 space-y-1">
              <li>• High-quality photos increase property views by 60%</li>
              <li>• Set the best photo as cover image for maximum impact</li>
              <li>• Include photos of all rooms, kitchen, bathrooms, and exterior</li>
              <li>• Videos help tenants visualize the space better</li>
              <li>• Floor plans help with layout understanding</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyMediaSection;
