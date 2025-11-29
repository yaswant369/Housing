import React, { useState } from 'react';
import { Copy, Share2, Check } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ShareURL({ 
  url = window.location.href, 
  title = "Share this page", 
  showLabel = true,
  className = "",
  size = "default" 
}) {
  const [copied, setCopied] = useState(false);
  
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      toast.success('Link copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = url;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      toast.success('Link copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: title,
          url: url,
        });
      } catch (err) {
        // User cancelled sharing or error occurred
        console.log('Error sharing:', err);
      }
    } else {
      // Fallback to copy if Web Share API is not supported
      handleCopy();
    }
  };

  const sizeClasses = {
    small: 'text-xs px-2 py-1',
    default: 'text-sm px-3 py-2',
    large: 'text-base px-4 py-3'
  };

  const iconSizes = {
    small: 14,
    default: 16,
    large: 18
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {showLabel && (
        <span className={`text-gray-600 dark:text-gray-400 ${sizeClasses[size]}`}>
          Share:
        </span>
      )}
      
      <div className="flex items-center gap-1">
        {/* URL Display */}
        <div className={`bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 ${sizeClasses[size]}`}>
          <span className="text-gray-700 dark:text-gray-300 font-mono truncate max-w-xs">
            {url}
          </span>
        </div>
        
        {/* Copy Button */}
        <button
          onClick={handleCopy}
          className={`flex items-center gap-1 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors ${sizeClasses[size]} ${
            copied ? 'bg-green-600 hover:bg-green-700' : ''
          }`}
          title="Copy link to clipboard"
        >
          {copied ? (
            <>
              <Check size={iconSizes[size]} />
              <span className="hidden sm:inline">Copied!</span>
            </>
          ) : (
            <>
              <Copy size={iconSizes[size]} />
              <span className="hidden sm:inline">Copy</span>
            </>
          )}
        </button>
        
        {/* Share Button (Mobile/Native) */}
        {navigator.share && (
          <button
            onClick={handleShare}
            className={`flex items-center gap-1 bg-gray-600 hover:bg-gray-700 text-white rounded-md transition-colors ${sizeClasses[size]}`}
            title="Share using device native sharing"
          >
            <Share2 size={iconSizes[size]} />
            <span className="hidden sm:inline">Share</span>
          </button>
        )}
      </div>
    </div>
  );
}