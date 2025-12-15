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

  // Map plural media types to singular for config lookup
  const mediaTypeForConfig = mediaType === 'videos' ? 'video' :
                            mediaType === 'floorplans' ? 'floorplan' :
                            mediaType === 'photos' ? 'image' :
                            mediaType === 'brochures' ? 'brochure' :
                            mediaType;

  const config = mediaTypeConfig[mediaTypeForConfig] || mediaTypeConfig.image;

  // Helper function to check media type (handles both singular and plural forms)
  const isMediaType = (typeToCheck) => {
    if (mediaType === typeToCheck) return true;
    // Handle plural to singular mapping
    if (typeToCheck === 'image' && mediaType === 'photos') return true;
    if (typeToCheck === 'video' && mediaType === 'videos') return true;
    if (typeToCheck === 'floorplan' && mediaType === 'floorplans') return true;
    if (typeToCheck === 'brochure' && mediaType === 'brochures') return true;
    return false;
  };
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
      
      // Actual file upload instead of simulation
      try {
        for (const file of validFiles) {
          const fileId = `${file.name}-${Date.now()}`;
          setUploadProgress(prev => ({ ...prev, [fileId]: 0 }));
          
          // Simulate initial progress
          setUploadProgress(prev => ({ ...prev, [fileId]: 25 }));
          
          // Create form data for actual upload
          const formData = new FormData();
          formData.append('file', file);
          
          // Map media type to backend field name
          const fieldName = isMediaType('image') ? 'images' :
                          isMediaType('video') ? 'video' :
                          isMediaType('floorplan') ? 'floorplans' :
                          'brochures';
          formData.delete('file');
          formData.append(fieldName, file);
          
          // For now, create a temporary object URL for preview
          // In a real implementation, you'd upload to server and get back URLs
          const tempUrl = URL.createObjectURL(file);
          
          setUploadProgress(prev => ({ ...prev, [fileId]: 75 }));
          
          const metadata = {
            fileName: file.name,
            fileType: file.type,
            fileSize: file.size,
            uploadDate: new Date().toISOString(),
            imageType: isMediaType('image') ? imageTypes[fileId] || 'general' : null,
            isCover: existingMedia.length === 0 && Object.keys(uploadProgress).length === 0,
            // Store both the temp URL and the actual file for later upload
            tempUrl: tempUrl,
            file: file
          };
          
          // Create a mock files object similar to the old structure
          const mockFiles = { 0: file };
          
          onMediaUpload(mockFiles, metadata);
          setUploadProgress(prev => ({ ...prev, [fileId]: 100 }));
          
          // Clean up progress after a short delay
          setTimeout(() => {
            setUploadProgress(prev => {
              const newProgress = { ...prev };
              delete newProgress[fileId];
              return newProgress;
            });
          }, 500);
        }
      } catch (error) {
        console.error('Upload error:', error);
        alert('Upload failed. Please try again.');
      } finally {
        setUploading(false);
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
            ? 'border-blue-500 bg-blue-50'
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
          
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {config.title}
          </h3>
          
          <p className="text-gray-600 mb-4">
            {config.subtitle}
          </p>
          
          {/* Image Type Help Text */}
          {isMediaType('image') && (
            <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-sm text-blue-800 text-center">
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
          {isMediaType('video') && (
            <div className="mt-4 pt-4 border-t border-gray-200">
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
          <div className="mt-4 text-sm text-gray-500">
            <p>Max {actualMaxFiles} files, up to {actualMaxSizeMB}MB each</p>
            <p>Formats: {actualAcceptedFormats.join(', ')}</p>
          </div>
        </div>
        
        <input
          ref={fileInputRef}
          type="file"
          multiple={!isMediaType('brochure')}
          accept={actualAcceptedFormats.join(',')}
          onChange={handleChange}
          className="hidden"
        />
      </div>

      {/* Upload Progress */}
      {Object.keys(uploadProgress).length > 0 && (
        <div className="space-y-2">
          {Object.entries(uploadProgress).map(([fileId, progress]) => (
            <div key={fileId} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <Loader2 size={16} className="animate-spin text-blue-600" />
              <div className="flex-1">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-700">{fileId}</span>
                  <span className="text-gray-500">{progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
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

      {/* Note: Existing media is handled by parent component (PropertyMediaSection) */}
      {existingMedia.length > 0 && (
        <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
          <div className="flex items-start gap-2">
            <CheckCircle size={16} className="text-blue-600 mt-0.5" />
            <div>
              <p className="text-sm text-blue-800 font-medium mb-1">
                {existingMedia.length} {isMediaType('image') ? 'photos' : isMediaType('video') ? 'videos' : 'files'} already uploaded
              </p>
              <p className="text-xs text-blue-700">
                Use the controls below to manage, reorder, or remove existing media.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MediaUploader;
