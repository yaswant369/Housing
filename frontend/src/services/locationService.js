// Location Service for handling geolocation and reverse geocoding

const LOCATION_SERVICE_CONFIG = {
  // OpenStreetMap Nominatim API for reverse geocoding (free, no API key required)
  REVERSE_GEOCODING_API: 'https://nominatim.openstreetmap.org/reverse',
  
  // Google Geocoding API (requires API key, more accurate)
  // GOOGLE_GEOCODING_API: 'https://maps.googleapis.com/maps/api/geocode/json',
  
  // Cache duration for location data (24 hours)
  CACHE_DURATION: 24 * 60 * 60 * 1000,
  
  // Default search radius options (in kilometers)
  RADIUS_OPTIONS: [
    { id: '1', label: '1 km', value: 1000 },
    { id: '5', label: '5 km', value: 5000 },
    { id: '10', label: '10 km', value: 10000 },
    { id: '25', label: '25 km', value: 25000 },
    { id: '50', label: '50 km', value: 50000 }
  ]
};

class LocationService {
  constructor() {
    this.locationCache = new Map();
  }

  /**
   * Get current location using browser geolocation API
   * @param {Object} options - Geolocation options
   * @returns {Promise<Object>} Location object with coordinates and address
   */
  async getCurrentLocation(options = {}) {
    const defaultOptions = {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 5 * 60 * 1000, // 5 minutes
      ...options
    };

    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported by this browser'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude, accuracy } = position.coords;
          
          try {
            const address = await this.reverseGeocode(latitude, longitude);
            resolve({
              latitude,
              longitude,
              accuracy,
              address,
              formattedAddress: this.formatAddress(address)
            });
          } catch (error) {
            console.warn('Reverse geocoding failed:', error);
            // Still resolve with coordinates even if geocoding fails
            resolve({
              latitude,
              longitude,
              accuracy,
              address: null,
              formattedAddress: `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`
            });
          }
        },
        (error) => {
          let errorMessage;
          switch (error.code) {
            case error.PERMISSION_DENIED:
              errorMessage = 'Location access denied. Please enable location services.';
              break;
            case error.POSITION_UNAVAILABLE:
              errorMessage = 'Location information is unavailable.';
              break;
            case error.TIMEOUT:
              errorMessage = 'Location request timed out.';
              break;
            default:
              errorMessage = 'An unknown error occurred while retrieving location.';
              break;
          }
          reject(new Error(errorMessage));
        },
        defaultOptions
      );
    });
  }

  /**
   * Reverse geocode coordinates to get address
   * @param {number} latitude 
   * @param {number} longitude 
   * @returns {Promise<Object>} Address object
   */
  async reverseGeocode(latitude, longitude) {
    const cacheKey = `${latitude.toFixed(4)},${longitude.toFixed(4)}`;
    
    // Check cache first
    const cached = this.locationCache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < LOCATION_SERVICE_CONFIG.CACHE_DURATION) {
      return cached.data;
    }

    try {
      const response = await fetch(
        `${LOCATION_SERVICE_CONFIG.REVERSE_GEOCODING_API}?` +
        `lat=${latitude}&lon=${longitude}&format=json&addressdetails=1`
      );
      
      if (!response.ok) {
        throw new Error(`Geocoding API error: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }

      // Cache the result
      this.locationCache.set(cacheKey, {
        data,
        timestamp: Date.now()
      });

      return data;
    } catch (error) {
      console.error('Reverse geocoding failed:', error);
      throw error;
    }
  }

  /**
   * Format address for display
   * @param {Object} addressData 
   * @returns {string} Formatted address
   */
  formatAddress(addressData) {
    if (!addressData || !addressData.address) {
      return 'Location found';
    }

    const { address } = addressData;
    const parts = [];

    // Add house number and road
    if (address.house_number) parts.push(address.house_number);
    if (address.road) parts.push(address.road);

    // Add locality/suburb
    if (address.suburb || address.neighbourhood) {
      parts.push(address.suburb || address.neighbourhood);
    }

    // Add city
    if (address.city || address.town || address.village) {
      parts.push(address.city || address.town || address.village);
    }

    // Add state
    if (address.state) {
      parts.push(address.state);
    }

    return parts.length > 0 ? parts.join(', ') : 'Current Location';
  }

  /**
   * Calculate distance between two coordinates using Haversine formula
   * @param {number} lat1 
   * @param {number} lon1 
   * @param {number} lat2 
   * @param {number} lon2 
   * @returns {number} Distance in kilometers
   */
  calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Radius of the Earth in kilometers
    const dLat = this.deg2rad(lat2 - lat1);
    const dLon = this.deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;
    return distance;
  }

  /**
   * Convert degrees to radians
   * @param {number} deg 
   * @returns {number} Radians
   */
  deg2rad(deg) {
    return deg * (Math.PI / 180);
  }

  /**
   * Check if location services are available
   * @returns {boolean} 
   */
  isLocationServiceAvailable() {
    return 'geolocation' in navigator;
  }

  /**
   * Get location permission status
   * @returns {Promise<string>} Permission status
   */
  async getLocationPermissionStatus() {
    if (!navigator.permissions) {
      return 'unknown';
    }

    try {
      const permission = await navigator.permissions.query({ name: 'geolocation' });
      return permission.state;
    } catch (error) {
      console.warn('Permission API not supported:', error);
      return 'unknown';
    }
  }

  /**
   * Watch position for continuous location updates
   * @param {Function} callback - Callback function for location updates
   * @param {Object} options - Geolocation options
   * @returns {number} Watch ID for clearing the watch
   */
  watchPosition(callback, options = {}) {
    const defaultOptions = {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 5 * 60 * 1000, // 5 minutes
      ...options
    };

    if (!navigator.geolocation) {
      throw new Error('Geolocation is not supported by this browser');
    }

    return navigator.geolocation.watchPosition(
      callback,
      (error) => {
        console.error('Geolocation watch error:', error);
      },
      defaultOptions
    );
  }

  /**
   * Clear position watch
   * @param {number} watchId 
   */
  clearWatch(watchId) {
    if (navigator.geolocation && watchId) {
      navigator.geolocation.clearWatch(watchId);
    }
  }

  /**
   * Get formatted distance for display
   * @param {number} distanceInKm 
   * @returns {string} Formatted distance
   */
  formatDistance(distanceInKm) {
    if (distanceInKm < 1) {
      return `${Math.round(distanceInKm * 1000)}m`;
    } else if (distanceInKm < 10) {
      return `${distanceInKm.toFixed(1)}km`;
    } else {
      return `${Math.round(distanceInKm)}km`;
    }
  }
}

// Export singleton instance
export const locationService = new LocationService();
export { LOCATION_SERVICE_CONFIG };
export default locationService;