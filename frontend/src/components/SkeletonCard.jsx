import React from 'react';

export default function SkeletonCard() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-lg overflow-hidden animate-pulse">
      {/* Image Placeholder */}
      <div className="w-full h-48 bg-gray-300 dark:bg-gray-700"></div>
      
      <div className="p-4">
        {/* Text Placeholders */}
        <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded-md w-3/4 mb-2"></div>
        <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded-md w-1/2 mb-4"></div>
        <div className="h-8 bg-gray-300 dark:bg-gray-700 rounded-md w-1/3 mb-4"></div>
        
        {/* Button Placeholders */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700 mt-4">
          <div className="h-10 bg-gray-300 dark:bg-gray-700 rounded-full w-2/3"></div>
          <div className="flex space-x-2 ml-4">
            <div className="h-10 w-10 bg-gray-300 dark:bg-gray-700 rounded-full"></div>
            <div className="h-10 w-10 bg-gray-300 dark:bg-gray-700 rounded-full"></div>
          </div>
        </div>
      </div>
    </div>
  );
}