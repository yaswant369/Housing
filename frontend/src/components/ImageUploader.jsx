import React, { useState, useContext, useCallback } from 'react';
import axios from 'axios';
import { AppContext } from '../context/context';
import { Upload, X, Image as ImageIcon, RotateCcw, Maximize2 } from 'lucide-react';

export default function ImageUploader({ propertyId, onUploadComplete }) {
  const { API_URL } = useContext(AppContext);
  const [files, setFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const [dragActive, setDragActive] = useState(false);

  // Enhanced file handling with validation and preview generation
  const handleFiles = useCallback((fileList) => {
    const validFiles = [];
    const validPreviews = [];
    
    Array.from(fileList).slice(0, 20).forEach(file => {
      // Validate file type and size
      if (!file.type.startsWith('image/')) {
        setError(`${file.name} is not an image file`);
        return;
      }
      
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        setError(`${file.name} is too large (max 10MB)`);
        return;
      }
      
      validFiles.push(file);
      
      // Create enhanced preview with object URL
      const previewUrl = URL.createObjectURL(file);
      validPreviews.push({ 
        name: file.name, 
        url: previewUrl,
        size: file.size,
        type: file.type
      });
    });
    
    setFiles(prevFiles => [...prevFiles, ...validFiles]);
    setPreviews(prevPreviews => [...prevPreviews, ...validPreviews]);
    setError(null);
  }, []);

  const handleChange = (e) => {
    handleFiles(e.target.files);
  };

  // Drag and drop functionality
  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
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
  }, [handleFiles]);

  const handleRemove = (index) => {
    const newFiles = files.slice();
    const newPreviews = previews.slice();
    
    // Revoke the object URL to prevent memory leaks
    URL.revokeObjectURL(newPreviews[index].url);
    
    newFiles.splice(index, 1);
    newPreviews.splice(index, 1);
    
    setFiles(newFiles);
    setPreviews(newPreviews);
  };

  const handleClearAll = () => {
    // Revoke all object URLs
    previews.forEach(p => URL.revokeObjectURL(p.url));
    setFiles([]);
    setPreviews([]);
    setError(null);
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleUpload = async () => {
    if (!files.length) return;
    setUploading(true);
    setError(null);
    try {
      const fd = new FormData();
      files.forEach(f => fd.append('images', f));
      const resp = await axios.post(`${API_URL}/uploads/property/${propertyId}`, fd, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (resp.data && resp.data.images) {
        onUploadComplete && onUploadComplete(resp.data.images);
        handleClearAll(); // Clear all previews after successful upload
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || err.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="image-uploader">
      <label className="block mb-2 font-medium text-gray-700">
        <Upload className="inline w-5 h-5 mr-2" />
        Upload Property Images
      </label>
      
      {/* Enhanced Drag & Drop Area */}
      <div
        className={`relative border-2 border-dashed rounded-lg p-6 text-center transition-all ${
          dragActive
            ? 'border-blue-500 bg-blue-50'
            : 'border-gray-300 hover:border-gray-400'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        <div className="space-y-2">
          <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
          <div>
            <p className="text-gray-600">
              Drag and drop images here, or <span className="text-blue-600 font-medium">browse</span>
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Supports JPG, PNG, WebP up to 10MB each (max 20 images)
            </p>
          </div>
        </div>
      </div>

      {error && (
        <div className="mt-2 p-3 bg-red-100  border border-red-300  rounded-lg">
          <p className="text-red-700  text-sm">{error}</p>
        </div>
      )}

      {/* Enhanced Preview Grid */}
      {previews.length > 0 && (
        <div className="mt-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-medium text-gray-700">
              Image Previews ({previews.length}/20)
            </h3>
            <button
              onClick={handleClearAll}
              className="text-sm text-red-600 hover:text-red-700 flex items-center gap-1"
            >
              <X className="w-4 h-4" />
              Clear All
            </button>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {previews.map((p, i) => (
              <div key={i} className="relative group">
                <div className="relative aspect-square bg-gray-100  rounded-lg overflow-hidden shadow-md">
                  <img 
                    src={p.url} 
                    alt={p.name} 
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = 'https://placehold.co/200x200/e2e8f0/64748b?text=Error';
                    }}
                  />
                  
                  {/* Image Info Overlay */}
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 flex items-center justify-center">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 space-x-2">
                      <button
                        type="button"
                        onClick={() => window.open(p.url, '_blank')}
                        className="bg-white/90 text-gray-800 rounded-full p-2 hover:bg-white transition-colors"
                        title="View full size"
                      >
                        <Maximize2 className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleRemove(i)}
                        className="bg-red-600/90 text-white rounded-full p-2 hover:bg-red-600 transition-colors"
                        title="Remove image"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
                
                {/* File Info */}
                <div className="mt-2 space-y-1">
                  <p className="text-xs font-medium text-gray-700  truncate" title={p.name}>
                    {p.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {formatFileSize(p.size)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Upload Button */}
      {files.length > 0 && (
        <div className="mt-6 flex justify-between items-center">
          <div className="text-sm text-gray-600">
            {files.length} image{files.length !== 1 ? 's' : ''} ready to upload
          </div>
          <button 
            onClick={handleUpload} 
            disabled={uploading || !files.length} 
            className="px-6 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg font-medium hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md flex items-center gap-2"
          >
            {uploading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Uploading...
              </>
            ) : (
              <>
                <Upload className="w-4 h-4" />
                Upload {files.length} Image{files.length !== 1 ? 's' : ''}
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
}
