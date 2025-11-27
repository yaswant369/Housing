import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  ChevronDown, 
  Grid3X3, 
  List,
  ArrowUpDown,
  Calendar,
  DollarSign,
  Eye,
  MessageSquare,
  Heart
} from 'lucide-react';

const statusTabs = [
  { key: 'all', label: 'All', count: 0 },
  { key: 'active', label: 'Online / Active', count: 0 },
  { key: 'paused', label: 'Offline / Paused', count: 0 },
  { key: 'pending', label: 'Under review', count: 0 },
  { key: 'expired', label: 'Expired', count: 0 },
  { key: 'draft', label: 'Drafts', count: 0 }
];

const sortOptions = [
  { key: 'newest', label: 'Newest first', icon: Calendar },
  { key: 'oldest', label: 'Oldest first', icon: Calendar },
  { key: 'highest_price', label: 'Highest price', icon: DollarSign },
  { key: 'most_views', label: 'Most views', icon: Eye },
  { key: 'most_leads', label: 'Most leads', icon: MessageSquare },
  { key: 'most_shortlists', label: 'Most shortlists', icon: Heart }
];

export default function PropertyFilters({
  activeFilter,
  onFilterChange,
  searchTerm,
  onSearchChange,
  sortBy,
  onSortChange,
  viewMode,
  onViewModeChange,
  totalCount
}) {
  const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState(false);
  const [isSortDropdownOpen, setIsSortDropdownOpen] = useState(false);

  const getFilteredCount = (status) => {
    // This would be calculated based on actual data
    if (status === 'all') return totalCount;
    return Math.floor(Math.random() * 20) + 1; // Mock data
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6">
      {/* Search Bar */}
      <div className="flex items-center gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search by Property ID / Title / Location..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        
        {/* View Mode Toggle */}
        <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
          <button
            onClick={() => onViewModeChange('grid')}
            className={`p-2 rounded-md transition-colors ${
              viewMode === 'grid' 
                ? 'bg-white dark:bg-gray-600 text-blue-600 shadow-sm' 
                : 'text-gray-600 dark:text-gray-400'
            }`}
          >
            <Grid3X3 size={20} />
          </button>
          <button
            onClick={() => onViewModeChange('list')}
            className={`p-2 rounded-md transition-colors ${
              viewMode === 'list' 
                ? 'bg-white dark:bg-gray-600 text-blue-600 shadow-sm' 
                : 'text-gray-600 dark:text-gray-400'
            }`}
          >
            <List size={20} />
          </button>
        </div>
      </div>

      {/* Status Filter Tabs */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex flex-wrap gap-2">
          {statusTabs.map(tab => (
            <button
              key={tab.key}
              onClick={() => onFilterChange(tab.key)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                activeFilter === tab.key
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              {tab.label}
              <span className="ml-2 text-xs bg-gray-200 dark:bg-gray-600 px-2 py-0.5 rounded-full">
                {getFilteredCount(tab.key)}
              </span>
            </button>
          ))}
        </div>

        {/* Sort Dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsSortDropdownOpen(!isSortDropdownOpen)}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          >
            <ArrowUpDown size={16} />
            <span className="text-sm font-medium">
              {sortOptions.find(opt => opt.key === sortBy)?.label || 'Sort by'}
            </span>
            <ChevronDown size={16} className={`transition-transform ${isSortDropdownOpen ? 'rotate-180' : ''}`} />
          </button>

          {isSortDropdownOpen && (
            <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50">
              {sortOptions.map(option => {
                const IconComponent = option.icon;
                return (
                  <button
                    key={option.key}
                    onClick={() => {
                      onSortChange(option.key);
                      setIsSortDropdownOpen(false);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors first:rounded-t-lg last:rounded-b-lg"
                  >
                    <IconComponent size={16} className="text-gray-400" />
                    <span className="text-sm text-gray-700 dark:text-gray-300">{option.label}</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Results Summary */}
      <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
        <span>Showing {totalCount} properties</span>
        <button
          onClick={() => setIsFilterDropdownOpen(!isFilterDropdownOpen)}
          className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 dark:bg-gray-700 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
        >
          <Filter size={16} />
          <span>More Filters</span>
        </button>
      </div>

      {/* Advanced Filters Dropdown */}
      {isFilterDropdownOpen && (
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Property Type
              </label>
              <select className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500">
                <option value="">All Types</option>
                <option value="apartment">Apartment</option>
                <option value="villa">Villa</option>
                <option value="plot">Plot</option>
                <option value="office">Office</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                BHK
              </label>
              <select className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500">
                <option value="">Any BHK</option>
                <option value="1">1 BHK</option>
                <option value="2">2 BHK</option>
                <option value="3">3 BHK</option>
                <option value="4">4 BHK</option>
                <option value="5">5+ BHK</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Plan Type
              </label>
              <select className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500">
                <option value="">All Plans</option>
                <option value="free">Free</option>
                <option value="featured">Featured</option>
                <option value="premium">Premium</option>
              </select>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}