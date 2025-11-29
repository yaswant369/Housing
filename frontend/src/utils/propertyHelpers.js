// src/utils/propertyHelpers.js

/**
 * Format price to display in lakhs, crores, etc.
 * @param {string|number} price - Raw price value
 * @returns {string} Formatted price string
 */
export const formatPrice = (price) => {
  if (!price || price === '₹0' || price === '0') return 'Price on Request';
  
  // Remove ₹ symbol and any existing formatting
  const cleanPrice = price.toString().replace(/[₹,\s]/g, '');
  const priceNum = parseFloat(cleanPrice);
  
  if (isNaN(priceNum)) return price;
  
  if (priceNum >= 10000000) {
    return `₹${(priceNum / 10000000).toFixed(2)} Cr`;
  } else if (priceNum >= 100000) {
    return `₹${(priceNum / 100000).toFixed(2)} L`;
  } else if (priceNum >= 1000) {
    return `₹${(priceNum / 1000).toFixed(2)} K`;
  }
  
  return `₹${priceNum.toLocaleString('en-IN')}`;
};

/**
 * Format area to display with sqft suffix
 * @param {string|number} area - Raw area value
 * @returns {string} Formatted area string
 */
export const formatArea = (area) => {
  if (!area) return 'N/A';
  const areaStr = area.toString();
  return areaStr.includes('sqft') ? areaStr : `${areaStr} sqft`;
};

/**
 * Calculate time ago from date string
 * @param {string} dateString - ISO date string
 * @returns {string} Time ago string
 */
export const calculateTimeAgo = (dateString) => {
  if (!dateString) return null;
  const postedDate = new Date(dateString);
  const now = new Date();
  const diffInMs = now.getTime() - postedDate.getTime();
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

  if (diffInDays === 0) return 'Today';
  if (diffInDays === 1) return '1 day ago';
  if (diffInDays < 7) return `${diffInDays} days ago`;
  if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`;
  if (diffInDays < 365) return `${Math.floor(diffInDays / 30)} months ago`;
  return `${Math.floor(diffInDays / 365)} years ago`;
};