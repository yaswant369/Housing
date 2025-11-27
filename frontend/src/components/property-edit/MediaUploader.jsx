import React, { useState, useRef, useCallback } from 'react';
import {
  Upload,
  Image,
  Video,
  FileText,
  X,
  Camera,
  Play,
  Link,
  FileImage,
  FileVideo,
  File,
  Loader2,
  CheckCircle,
  AlertCircle,
  GripVertical,
  Menu,
  Edit3,
  Tag,
  List
} from 'lucide-react';

const MediaUploader = ({
  mediaType,
  onMediaUpload,
  existingMedia = [],
  maxFiles,
  maxSizeMB,
  acceptedFormats,
  ...props
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({});
  const [imageTypes, setImageTypes] = useState({});
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [showYoutubeInput, setShowYoutubeInput] = useState(false);
  const [dragIndex, setDragIndex] = useState(null);
  const [mediaOrder, setMediaOrder] = useState([]);
  const fileInputRef = useRef(null);

  const mediaTypeConfig = {
    image: {
      icon: Image,
      color: 'text-green-600 bg-green-50 border-green-200',
      title: 'Upload Images',
      subtitle: 'Drag and drop images or click to browse',
      acceptedFormats: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
      maxSizeMB: 10,
      maxFiles: 20
    },
    video: {
      icon: Video,
      color: 'text-blue-600 bg-blue-50 border-blue-200',
      title: 'Upload Videos',
      subtitle: 'Upload MP4 files or add YouTube links',
      acceptedFormats: ['video/mp4', 'video/webm'],
      maxSizeMB: 100,
      maxFiles: 5
    },
    floorplan: {
      icon: FileImage,
      color: 'text-purple-600 bg-purple-50 border-purple-200',
      title: 'Upload Floor Plans',
      subtitle: 'Images or PDF files',
      acceptedFormats: ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'],
      maxSizeMB: 20,
      maxFiles: 5
    },
    brochure: {
      icon: FileText,
      color: 'text-orange-600 bg-orange-50 border-orange-200',
      title: 'Upload Brochures',
      subtitle: 'PDF files only',
      acceptedFormats: ['application/pdf'],
      maxSizeMB: 50,
      maxFiles: 3
    }
  };

  const imageTypeOptions = [
    { value: 'bedroom', label: 'Bedroom', icon: '🛏️' },
    { value: 'living_room', label: 'Living Room', icon: '🛋️' },
    { value: 'kitchen', label: 'Kitchen', icon: '🍳' },
    { value: 'bathroom', label: 'Bathroom', icon: '🚿' },
    { value: 'balcony', label: 'Balcony', icon: '🌅' },
    { value: 'exterior', label: 'Exterior', icon: '🏠' },
    { value: 'society', label: 'Society', icon: '🏢' },
    { value: 'entrance', label: 'Entrance', icon: '🚪' }
  ];

  const config = mediaTypeConfig[mediaType] || mediaTypeConfig.image;
  const actualMaxFiles = maxFiles || config.maxFiles;
  const actualMaxSizeMB = maxSizeMB || config.maxSizeMB;
  const actualAcceptedFormats = acceptedFormats || config.acceptedFormats;

  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  }, []);

  const handleChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFiles(e.target.files);
    }
  };

  const handleFiles = async (files) => {
    if (existingMedia.length + Object.keys(uploadProgress).length >= actualMaxFiles) {
      alert(`Maximum ${actualMaxFiles} files allowed`);
      return;
    }

    const fileArray = Array.from(files);
    const validFiles = fileArray.filter(file => {
      // Check file type
      if (!actualAcceptedFormats.includes(file.type)) {
        alert(`${file.name} is not a supported format`);
        return false;
      }
      
      // Check file size
      if (file.size > actualMaxSizeMB * 1024 * 1024) {
        alert(`${file.name} is too large. Maximum size is ${actualMaxSizeMB}MB`);
        return false;
      }
      
      return true;
    });

    if (validFiles.length > 0) {
      setUploading(true);
      
      // Simulate upload progress
      for (const file of validFiles) {
        const fileId = `${file.name}-${Date.now()}`;
        setUploadProgress(prev => ({ ...prev, [fileId]: 0 }));
        
        // Simulate upload progress
        const progressInterval = setInterval(() => {
          setUploadProgress(prev => {
            const currentProgress = prev[fileId] || 0;
            if (currentProgress >= 100) {
              clearInterval(progressInterval);
              setUploading(false);
              return prev;
            }
            return { ...prev, [fileId]: currentProgress + 10 };
          });
        }, 200);
        
        // Complete upload after delay
        setTimeout(() => {
          const metadata = {
            fileName: file.name,
            fileType: file.type,
            fileSize: file.size,
            uploadDate: new Date().toISOString(),
            imageType: mediaType === 'image' ? imageTypes[fileId] || 'general' : null,
            isCover: existingMedia.length === 0 && Object.keys(uploadProgress).length === 0
          };
          
          onMediaUpload(files, metadata);
          setUploadProgress(prev => {
            const newProgress = { ...prev };
            delete newProgress[fileId];
            return newProgress;
          });
        }, 2000);
      }
    }
  };

  const removeFile = (index) => {
    // This would need to be implemented with actual file management
    console.log('Remove file at index:', index);
  };

  const setCoverImage = (index) => {
    // This would need to be implemented with actual file management
    console.log('Set as cover image:', index);
  };

  const handleYouTubeUpload = () => {
    if (youtubeUrl.trim()) {
      const metadata = {
        youtubeUrl: youtubeUrl.trim(),
        uploadDate: new Date().toISOString(),
        isVideo: true
      };
      
      // Create a mock file for YouTube URL
      const mockFileList = {
        0: new File([''], 'youtube-video', { type: 'video/youtube' })
      };
      
      onMediaUpload(mockFileList, metadata);
      setYoutubeUrl('');
      setShowYoutubeInput(false);
    }
  };

  const IconComponent = config.icon;

  return (
    <div className="space-y-4">
      {/* Upload Area */}
      <div
        className={`relative border-2 border-dashed rounded-lg p-6 transition-colors ${
          dragActive
            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
            : config.color.replace('bg-', 'border-').replace('-50', '-200')
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <div className="text-center">
          <IconComponent 
            size={48} 
            className={`mx-auto mb-4 ${config.color.split(' ')[0]}`} 
          />
          
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
            {config.title}
          </h3>
          
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            {config.subtitle}
          </p>
          
          {/* Image Type Help Text */}
          {mediaType === 'image' && (
            <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-700">
              <p className="text-sm text-blue-800 dark:text-blue-200 text-center">
                💡 <strong>Pro Tip:</strong> Tag each image with its location (bedroom, kitchen, etc.) for better organization and searchability
              </p>
            </div>
          )}
          
          {/* Upload Button */}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            {uploading ? (
              <Loader2 size={20} className="animate-spin" />
            ) : (
              <Upload size={20} />
            )}
            {uploading ? 'Uploading...' : 'Choose Files'}
          </button>
          
          {/* YouTube URL for videos */}
          {mediaType === 'video' && (
            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <button
                type="button"
                onClick={() => setShowYoutubeInput(!showYoutubeInput)}
                className="text-sm text-blue-600 hover:text-blue-700"
              >
                {showYoutubeInput ? 'Cancel' : 'Add YouTube Video'}
              </button>
              
              {showYoutubeInput && (
                <div className="mt-3 flex gap-2">
                  <input
                    type="url"
                    value={youtubeUrl}
                    onChange={(e) => setYoutubeUrl(e.target.value)}
                    placeholder="https://www.youtube.com/watch?v=..."
                    className="flex-1 px-3 py-2 border border-gray-300 rounded text-sm"
                  />
                  <button
                    type="button"
                    onClick={handleYouTubeUpload}
                    className="px-4 py-2 bg-red-600 text-white rounded text-sm hover:bg-red-700"
                  >
                    Add
                  </button>
                </div>
              )}
            </div>
          )}
          
          {/* File Info */}
          <div className="mt-4 text-sm text-gray-500 dark:text-gray-400">
            <p>Max {actualMaxFiles} files, up to {actualMaxSizeMB}MB each</p>
            <p>Formats: {actualAcceptedFormats.join(', ')}</p>
          </div>
        </div>
        
        <input
          ref={fileInputRef}
          type="file"
          multiple={mediaType !== 'brochure'}
          accept={actualAcceptedFormats.join(',')}
          onChange={handleChange}
          className="hidden"
        />
      </div>

      {/* Upload Progress */}
      {Object.keys(uploadProgress).length > 0 && (
        <div className="space-y-2">
          {Object.entries(uploadProgress).map(([fileId, progress]) => (
            <div key={fileId} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <Loader2 size={16} className="animate-spin text-blue-600" />
              <div className="flex-1">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-700 dark:text-gray-300">{fileId.split('-')[0]}</span>
                  <span className="text-gray-500">{progress}%</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Existing Media Preview */}
      {existingMedia.length > 0 && (
        <div className="space-y-4">
          {/* Header with Actions */}
          <div className="flex items-center justify-between">
            <h4 className="font-medium text-gray-900 dark:text-gray-100">
              Uploaded {mediaType}s ({existingMedia.length})
            </h4>
            {mediaType === 'image' && (
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <List size={14} />
                <span>Drag to reorder • Tag for organization</span>
              </div>
            )}
          </div>
          
          {/* Media Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {existingMedia.map((media, index) => (
              <div 
                key={media.id || index} 
                className="relative bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden group hover:shadow-lg transition-shadow"
                draggable
                onDragStart={() => setDragIndex(index)}
                onDragOver={(e) => e.preventDefault()}
                onDrop={() => {
                  if (dragIndex !== null && dragIndex !== index) {
                    const newMedia = [...existingMedia];
                    const draggedItem = newMedia.splice(dragIndex, 1)[0];
                    newMedia.splice(index, 0, draggedItem);
                    // This would need to be connected to parent component
                    console.log('Reordered media:', newMedia);
                  }
                  setDragIndex(null);
                }}
              >
                {/* Drag Handle */}
                <div className="absolute top-2 left-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="p-1 bg-black/50 rounded cursor-move">
                    <GripVertical size={12} className="text-white" />
                  </div>
                </div>

                {/* Preview */}
                <div className="aspect-video bg-gray-100 dark:bg-gray-800 relative">
                  {mediaType === 'image' || mediaType === 'floorplan' ? (
                    <img
                      src={media.url || URL.createObjectURL(media.file)}
                      alt={media.fileName}
                      className="w-full h-full object-cover"
                    />
                  ) : mediaType === 'video' ? (
                    <div className="w-full h-full flex items-center justify-center bg-gray-200 dark:bg-gray-700">
                      <Play size={32} className="text-gray-500" />
                    </div>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-red-50 dark:bg-red-900/20">
                      <FileText size={32} className="text-red-500" />
                    </div>
                  )}
                  
                  {/* Order Number */}
                  <div className="absolute top-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                    {index + 1}
                  </div>
                </div>
                
                {/* Content */}
                <div className="p-3">
                  {/* Image Type Selector for images */}
                  {mediaType === 'image' && (
                    <div className="mb-3">
                      <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                        <Tag size={12} className="inline mr-1" />
                        Image Type
                      </label>
                      <select
                        value={media.imageType || ''}
                        onChange={(e) => {
                          const updatedMedia = [...existingMedia];
                          updatedMedia[index] = { ...updatedMedia[index], imageType: e.target.value };
                          // This would need to be connected to parent component
                          console.log('Updated image type:', e.target.value, updatedMedia);
                        }}
                        className="w-full text-xs px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700"
                      >
                        <option value="">Select type</option>
                        {imageTypeOptions.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.icon} {option.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                  
                  {/* Cover Badge */}
                  {media.isCover && (
                    <div className="mb-2 flex items-center gap-1 text-xs bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-2 py-1 rounded">
                      <CheckCircle size={12} />
                      <span>Cover Photo</span>
                    </div>
                  )}
                  
                  {/* File Name */}
                  <p className="text-xs text-gray-600 dark:text-gray-400 truncate mb-2" title={media.fileName}>
                    {media.fileName}
                  </p>
                  
                  {/* Actions */}
                  <div className="flex items-center justify-between">
                    <div className="flex gap-1">
                      {!media.isCover && (
                        <button
                          onClick={() => setCoverImage(index)}
                          className="p-1.5 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded transition-colors"
                          title="Set as cover photo"
                        >
                          <Camera size={14} />
                        </button>
                      )}
                      <button
                        onClick={() => removeFile(index)}
                        className="p-1.5 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors"
                        title="Remove file"
                      >
                        <X size={14} />
                      </button>
                    </div>
                    {media.fileSize && (
                      <span className="text-xs text-gray-500">
                        {(media.fileSize / (1024 * 1024)).toFixed(1)}MB
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Tips */}
          {mediaType === 'image' && (
            <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg border border-blue-200 dark:border-blue-700">
              <div className="flex items-start gap-2">
                <Edit3 size={16} className="text-blue-600 mt-0.5" />
                <div>
                  <p className="text-sm text-blue-800 dark:text-blue-200 font-medium mb-1">
                    Organization Tips
                  </p>
                  <ul className="text-xs text-blue-700 dark:text-blue-300 space-y-0.5">
                    <li>• Drag files to change order • First image becomes cover automatically</li>
                    <li>• Tag images by location for better searchability</li>
                    <li>• Include all rooms, kitchen, bathrooms, and exterior views</li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MediaUploader;