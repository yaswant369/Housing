import React from 'react';

export const PropertyCardSkeleton = ({ variant = 'grid' }) => {
  return (
    <div className={`bg-white rounded-2xl shadow-lg overflow-hidden animate-pulse ${
      variant === 'list' ? 'flex' : ''
    }`}>
      
      {/* Image Section */}
      <div className={`relative ${variant === 'list' ? 'w-80 flex-shrink-0' : 'aspect-[4/3]'} bg-gray-200`}>
        {/* Status badges placeholders */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          <div className="h-6 bg-gray-300 rounded-full w-16"></div>
          <div className="h-6 bg-gray-300 rounded-full w-16"></div>
        </div>
        
        {/* Action buttons placeholder */}
        <div className="absolute top-3 right-3 flex flex-col gap-2">
          <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
          <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
          <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
        </div>
      </div>

      {/* Content Section */}
      <div className={`p-4 ${variant === 'list' ? 'flex-1 flex flex-col justify-between' : ''}`}>
        
        {/* Header */}
        <div className="mb-3">
          <div className="flex items-start justify-between mb-2">
            <div className="flex-1">
              <div className="h-5 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
            <div className="text-right ml-4">
              <div className="h-6 bg-gray-200 rounded w-20 mb-1"></div>
              <div className="h-3 bg-gray-200 rounded w-12"></div>
            </div>
          </div>
        </div>

        {/* Key Features */}
        <div className="flex items-center gap-4 mb-4">
          <div className="h-4 bg-gray-200 rounded w-12"></div>
          <div className="h-4 bg-gray-200 rounded w-12"></div>
          <div className="h-4 bg-gray-200 rounded w-16"></div>
        </div>

        {/* Amenities */}
        <div className="mb-4">
          <div className="flex gap-2">
            <div className="h-6 bg-gray-200 rounded-full w-16"></div>
            <div className="h-6 bg-gray-200 rounded-full w-20"></div>
            <div className="h-6 bg-gray-200 rounded-full w-14"></div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className={`${variant === 'list' ? 'mt-auto' : ''}`}>
          <div className="flex items-center justify-between pt-3 border-t border-gray-100">
            <div className="flex gap-2">
              <div className="h-8 bg-gray-200 rounded w-16"></div>
              <div className="h-8 bg-gray-200 rounded w-20"></div>
            </div>
            <div className="h-4 bg-gray-200 rounded w-20"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const PropertyListSkeleton = ({ count = 6, variant = 'grid' }) => {
  return (
    <div className={variant === 'grid' 
      ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
      : 'space-y-6'
    }>
      {[...Array(count)].map((_, index) => (
        <PropertyCardSkeleton key={index} variant={variant} />
      ))}
    </div>
  );
};

export const SearchBarSkeleton = () => {
  return (
    <div className="bg-white shadow-lg rounded-2xl border border-gray-100 overflow-hidden animate-pulse">
      
      {/* Main Search Bar */}
      <div className="p-4">
        <div className="flex flex-col lg:flex-row gap-4">
          
          {/* Location Input */}
          <div className="flex-1 relative">
            <div className="h-12 bg-gray-200 rounded-xl w-full"></div>
          </div>

          {/* Search Button */}
          <div className="h-12 bg-gray-200 rounded-xl w-24"></div>
        </div>
      </div>

      {/* Filter Tabs and Options */}
      <div className="border-t border-gray-100">
        
        {/* Listing Type Tabs */}
        <div className="p-4 border-b border-gray-50">
          <div className="flex flex-wrap gap-2">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-8 bg-gray-200 rounded-full w-16"></div>
            ))}
          </div>
        </div>

        {/* Quick Filters Row */}
        <div className="p-4">
          <div className="flex flex-wrap gap-4 items-center">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-8 bg-gray-200 rounded-lg w-24"></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export const PropertyDetailSkeleton = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      
      {/* Header */}
      <div className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="h-6 bg-gray-200 rounded w-32"></div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
              <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
              <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Image Gallery */}
            <div className="bg-white rounded-2xl overflow-hidden shadow-lg">
              <div className="aspect-[4/3] bg-gray-200"></div>
              <div className="p-4">
                <div className="flex gap-2 overflow-x-auto">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="flex-shrink-0 w-20 h-16 bg-gray-200 rounded-lg"></div>
                  ))}
                </div>
              </div>
            </div>

            {/* Property Details Tabs */}
            <div className="bg-white rounded-2xl shadow-lg">
              
              {/* Tab Headers */}
              <div className="border-b border-gray-200">
                <nav className="flex">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="px-6 py-4 h-12 bg-gray-200 w-20"></div>
                  ))}
                </nav>
              </div>

              {/* Tab Content */}
              <div className="p-6 space-y-6">
                <div className="space-y-3">
                  <div className="h-5 bg-gray-200 rounded w-1/4"></div>
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-full"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="h-5 bg-gray-200 rounded w-1/3"></div>
                  <div className="grid grid-cols-2 gap-3">
                    {[...Array(6)].map((_, i) => (
                      <div key={i} className="h-12 bg-gray-200 rounded"></div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            
            {/* Property Summary */}
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <div className="text-center mb-6">
                <div className="h-8 bg-gray-200 rounded w-3/4 mx-auto mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto mb-4"></div>
                <div className="h-8 bg-gray-200 rounded w-1/3 mx-auto"></div>
              </div>

              <div className="grid grid-cols-3 gap-4 mb-6">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="text-center">
                    <div className="h-6 bg-gray-200 rounded w-8 mx-auto mb-1"></div>
                    <div className="h-4 bg-gray-200 rounded w-6 mx-auto mb-1"></div>
                    <div className="h-3 bg-gray-200 rounded w-8 mx-auto"></div>
                  </div>
                ))}
              </div>

              <div className="space-y-3">
                <div className="h-12 bg-gray-200 rounded"></div>
                <div className="h-12 bg-gray-200 rounded"></div>
              </div>
            </div>

            {/* Agent Info */}
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-1"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2 mb-1"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/3"></div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const FilterPanelSkeleton = () => {
  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex justify-end">
      <div className="bg-white w-full max-w-md h-full overflow-y-auto">
        
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between">
          <div className="h-6 bg-gray-200 rounded w-32"></div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
            <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
          </div>
        </div>

        {/* Filter Sections */}
        <div className="flex-1 p-4 space-y-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="border-b border-gray-200 last:border-b-0 pb-6">
              <div className="h-6 bg-gray-200 rounded w-1/2 mb-4"></div>
              <div className="space-y-3">
                {[...Array(4)].map((_, j) => (
                  <div key={j} className="h-12 bg-gray-200 rounded-lg"></div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white border-t border-gray-200 p-4">
          <div className="h-12 bg-gray-200 rounded"></div>
        </div>
      </div>
    </div>
  );
};

export default {
  PropertyCardSkeleton,
  PropertyListSkeleton,
  SearchBarSkeleton,
  PropertyDetailSkeleton,
  FilterPanelSkeleton
};
