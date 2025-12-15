// Property utility functions

/**
 * Format price with Indian currency format
 */
export const formatPrice = (price, listingType = 'buy', priceValue = null) => {
  // If price is valid, use it directly
  if (price && !isNaN(parseFloat(price))) {
    const numPrice = parseFloat(price);
    if (numPrice >= 10000000) {
      // Crores
      return `₹${(numPrice / 10000000).toFixed(numPrice % 10000000 === 0 ? 0 : 1)}Cr`;
    } else if (numPrice >= 100000) {
      // Lakhs
      return `₹${(numPrice / 100000).toFixed(numPrice % 100000 === 0 ? 0 : 1)}L`;
    } else {
      // Thousands
      return `₹${numPrice.toLocaleString('en-IN')}`;
    }
  }

  // If price is invalid but priceValue is available, use priceValue
  if (priceValue && !isNaN(priceValue)) {
    const numPrice = parseFloat(priceValue);
    if (numPrice >= 10000000) {
      // Crores
      return `₹${(numPrice / 10000000).toFixed(numPrice % 10000000 === 0 ? 0 : 1)}Cr`;
    } else if (numPrice >= 100000) {
      // Lakhs
      return `₹${(numPrice / 100000).toFixed(numPrice % 100000 === 0 ? 0 : 1)}L`;
    } else {
      // Thousands
      return `₹${numPrice.toLocaleString('en-IN')}`;
    }
  }

  // If neither price nor priceValue is valid, return a placeholder
  return 'Price on request';
};

/**
 * Format area with proper units
 */
export const formatArea = (area, unit = 'sq ft') => {
  if (!area) return 'N/A';
  
  const numArea = parseFloat(area);
  if (isNaN(numArea)) return area;
  
  return `${numArea.toLocaleString('en-IN')} ${unit}`;
};

/**
 * Get property status color
 */
export const getStatusColor = (status) => {
  switch (status?.toLowerCase()) {
    case 'verified':
      return 'bg-green-500';
    case 'featured':
      return 'bg-purple-500';
    case 'new':
      return 'bg-blue-500';
    case 'ready to move':
      return 'bg-emerald-500';
    case 'under construction':
      return 'bg-orange-500';
    default:
      return 'bg-gray-500';
  }
};

/**
 * Get property status icon
 */
export const getStatusIcon = (status) => {
  switch (status?.toLowerCase()) {
    case 'verified':
      return '✓';
    case 'featured':
      return '★';
    case 'new':
      return '🆕';
    case 'ready to move':
      return '🏠';
    case 'under construction':
      return '🏗️';
    default:
      return '●';
  }
};

/**
 * Calculate distance between two coordinates
 */
export const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Earth's radius in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
};

/**
 * Get similar properties based on criteria
 */
export const getSimilarProperties = (properties, referenceProperty, limit = 4) => {
  return properties
    .filter(property => property.id !== referenceProperty.id)
    .map(property => {
      let score = 0;
      
      // Location similarity (40% weight)
      if (property.location === referenceProperty.location) {
        score += 40;
      } else if (property.location && referenceProperty.location) {
        const refCity = referenceProperty.location.split(',')[0].toLowerCase();
        const propCity = property.location.split(',')[0].toLowerCase();
        if (refCity === propCity) score += 20;
      }
      
      // BHK similarity (30% weight)
      if (property.bhk === referenceProperty.bhk) {
        score += 30;
      } else if (Math.abs(property.bhk - referenceProperty.bhk) === 1) {
        score += 15;
      }
      
      // Price similarity (20% weight)
      const priceDiff = Math.abs(property.price - referenceProperty.price) / referenceProperty.price;
      if (priceDiff <= 0.2) {
        score += 20;
      } else if (priceDiff <= 0.4) {
        score += 10;
      }
      
      // Property type similarity (10% weight)
      if (property.propertyType === referenceProperty.propertyType) {
        score += 10;
      }
      
      return { ...property, similarityScore: score };
    })
    .sort((a, b) => b.similarityScore - a.similarityScore)
    .slice(0, limit);
};

/**
 * Validate property data
 */
export const validateProperty = (property) => {
  const errors = [];
  
  if (!property.bhk || property.bhk < 1) {
    errors.push('BHK is required and must be at least 1');
  }
  
  if (!property.price || property.price <= 0) {
    errors.push('Price is required and must be greater than 0');
  }
  
  if (!property.location || property.location.trim() === '') {
    errors.push('Location is required');
  }
  
  if (!property.propertyType) {
    errors.push('Property type is required');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Generate property URL slug
 */
export const generatePropertySlug = (property) => {
  const parts = [
    property.bhk,
    'bhk',
    property.propertyType?.toLowerCase().replace(/\s+/g, '-'),
    property.location?.toLowerCase().replace(/,\s*/g, '-').replace(/\s+/g, '-'),
    property.id
  ].filter(Boolean);
  
  return parts.join('-');
};

/**
 * Calculate EMI
 */
export const calculateEMI = (principal, rate, tenure) => {
  const monthlyRate = rate / (12 * 100);
  const months = tenure * 12;
  
  if (monthlyRate === 0) {
    return principal / months;
  }
  
  const emi = principal * (monthlyRate * Math.pow(1 + monthlyRate, months)) / 
              (Math.pow(1 + monthlyRate, months) - 1);
  
  return emi;
};

/**
 * Format date to relative time
 */
export const formatRelativeTime = (date) => {
  const now = new Date();
  const propertyDate = new Date(date);
  const diffInSeconds = Math.floor((now - propertyDate) / 1000);
  
  if (diffInSeconds < 60) {
    return 'Just now';
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60);
    return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);
    return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  } else if (diffInSeconds < 2592000) {
    const days = Math.floor(diffInSeconds / 86400);
    return `${days} day${days > 1 ? 's' : ''} ago`;
  } else {
    return propertyDate.toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }
};

/**
 * Get amenity display name
 */
export const getAmenityDisplayName = (amenity) => {
  const amenityMap = {
    'swimming_pool': 'Swimming Pool',
    'gym': 'Gym/Fitness Center',
    'parking': 'Parking',
    'lift': 'Lift',
    'security': '24/7 Security',
    'power_backup': 'Power Backup',
    'cctv': 'CCTV',
    'garden': 'Garden',
    'children_play_area': 'Children Play Area',
    'club_house': 'Club House',
    'water_supply': '24/7 Water Supply',
    'gas_pipeline': 'Gas Pipeline',
    'fire_safety': 'Fire Safety',
    'rainwater_harvesting': 'Rainwater Harvesting',
    'solar_panels': 'Solar Panels',
    'vaastu_compliant': 'Vaastu Compliant',
    'air_conditioning': 'Air Conditioning',
    'internet_connectivity': 'Internet Connectivity',
    'wash_area': 'Wash Area',
    'servant_room': 'Servant Room'
  };
  
  return amenityMap[amenity] || amenity.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
};

/**
 * Get listing type display name
 */
export const getListingTypeDisplay = (listingType) => {
  const typeMap = {
    'buy': 'For Sale',
    'rent': 'For Rent',
    'commercial': 'Commercial',
    'pg': 'PG'
  };
  
  return typeMap[listingType?.toLowerCase()] || listingType;
};

/**
 * Get furnishing status display
 */
export const getFurnishingDisplay = (furnishing) => {
  const furnishingMap = {
    'unfurnished': 'Unfurnished',
    'semi_furnished': 'Semi-Furnished',
    'fully_furnished': 'Fully Furnished'
  };
  
  return furnishingMap[furnishing?.toLowerCase()] || furnishing;
};

/**
 * Debounce function for search inputs
 */
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

/**
 * Local storage helpers
 */
export const storage = {
  get: (key, defaultValue = null) => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      return defaultValue;
    }
  },
  
  set: (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error('Error writing to localStorage:', error);
    }
  },
  
  remove: (key) => {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error('Error removing from localStorage:', error);
    }
  }
};

export default {
  formatPrice,
  formatArea,
  getStatusColor,
  getStatusIcon,
  calculateDistance,
  getSimilarProperties,
  validateProperty,
  generatePropertySlug,
  calculateEMI,
  formatRelativeTime,
  getAmenityDisplayName,
  getListingTypeDisplay,
  getFurnishingDisplay,
  debounce,
  storage
};