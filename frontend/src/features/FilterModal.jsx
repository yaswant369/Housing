 import React, { useState } from 'react';
import { X } from 'lucide-react';
import { useNavigate } from 'react-router-dom'; // 1. Import

const FilterButton = ({ label, value, current, onClick }) => (
  <button
    onClick={() => onClick(value)}
    className={`py-2 px-4 rounded-full border text-sm font-medium transition-colors ${
      current === value
        ? 'bg-blue-600 border-blue-600 text-white'
        : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
    }`}
  >
    {label}
  </button>
);

export default function FilterModal({ onApplyFilters, currentFilters }) {
  const navigate = useNavigate(); // 2. Get navigate
  const [tempFilters, setTempFilters] = useState(currentFilters);

  const handleBhkChange = (value) => {
    setTempFilters(prev => ({ ...prev, bhk: value }));
  };

  const handleFurnishingChange = (value) => {
    setTempFilters(prev => ({ ...prev, furnishing: value }));
  };

  const handlePriceChange = (e) => {
    const { name, value } = e.target;
    setTempFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleReset = () => {
    setTempFilters({
      bhk: 'any',
      furnishing: 'any',
      minPrice: '',
      maxPrice: '',
    });
  };

  const handleApply = () => {
    onApplyFilters(tempFilters);
    navigate(-1); // Go back after applying filters
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      {/* Header */}
      <header className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-bold">Filters</h2>
        <button 
          onClick={() => navigate(-1)} // 3. Use navigate
          className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          <X size={20} />
        </button>
      </header>

      {/* Content */}
      <div className="p-6 space-y-6 overflow-y-auto max-h-[70vh]">
        {/* BHK Type */}
        <section>
          <h3 className="text-lg font-semibold mb-3">BHK Type</h3>
          <div className="flex flex-wrap gap-2">
            <FilterButton label="Any" value="any" current={tempFilters.bhk} onClick={handleBhkChange} />
            <FilterButton label="1 BHK" value="1" current={tempFilters.bhk} onClick={handleBhkChange} />
            <FilterButton label="2 BHK" value="2" current={tempFilters.bhk} onClick={handleBhkChange} />
            <FilterButton label="3 BHK" value="3" current={tempFilters.bhk} onClick={handleBhkChange} />
            <FilterButton label="4 BHK" value="4" current={tempFilters.bhk} onClick={handleBhkChange} />
            <FilterButton label="5+ BHK" value="5" current={tempFilters.bhk} onClick={handleBhkChange} />
          </div>
        </section>

        {/* Price Range */}
        <section>
          <h3 className="text-lg font-semibold mb-3">Price Range</h3>
          <div className="flex items-center gap-4">
            <input
              type="number"
              name="minPrice"
              value={tempFilters.minPrice}
              onChange={handlePriceChange}
              placeholder="Min Price (₹)"
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <span className="text-gray-500">to</span>
            <input
              type="number"
              name="maxPrice"
              value={tempFilters.maxPrice}
              onChange={handlePriceChange}
              placeholder="Max Price (₹)"
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </section>

        {/* Furnishing Status */}
        <section>
          <h3 className="text-lg font-semibold mb-3">Furnishing</h3>
          <div className="flex flex-wrap gap-2">
            <FilterButton label="Any" value="any" current={tempFilters.furnishing} onClick={handleFurnishingChange} />
            <FilterButton label="Unfurnished" value="Unfurnished" current={tempFilters.furnishing} onClick={handleFurnishingChange} />
            <FilterButton label="Semi-Furnished" value="Semi-Furnished" current={tempFilters.furnishing} onClick={handleFurnishingChange} />
            <FilterButton label="Furnished" value="Furnished" current={tempFilters.furnishing} onClick={handleFurnishingChange} />
          </div>
        </section>
      </div>

      {/* Footer */}
      <footer className="flex items-center justify-between p-4 border-t border-gray-200 dark:border-gray-700">
        <button
          onClick={handleReset}
          className="py-2 px-6 font-semibold text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          Reset
        </button>
        <button
          onClick={handleApply}
          className="py-2 px-8 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700"
        >
          Apply
        </button>
      </footer>
    </div>
  );
}