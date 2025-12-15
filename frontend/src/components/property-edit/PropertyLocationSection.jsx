import React, { useState, useRef, useEffect } from 'react';
import {
  MapPin,
  Navigation,
  Search,
  Eye,
  EyeOff,
  Map,
  Pin,
  Building,
  Landmark,
  Phone,
  Home,
  RefreshCw
} from 'lucide-react';

const majorCities = [
  { value: 'mumbai', label: 'Mumbai', state: 'Maharashtra' },
  { value: 'delhi', label: 'Delhi', state: 'Delhi' },
  { value: 'bangalore', label: 'Bangalore', state: 'Karnataka' },
  { value: 'hyderabad', label: 'Hyderabad', state: 'Telangana' },
  { value: 'ahmedabad', label: 'Ahmedabad', state: 'Gujarat' },
  { value: 'chennai', label: 'Chennai', state: 'Tamil Nadu' },
  { value: 'kolkata', label: 'Kolkata', state: 'West Bengal' },
  { value: 'pune', label: 'Pune', state: 'Maharashtra' },
  { value: 'jaipur', label: 'Jaipur', state: 'Rajasthan' },
  { value: 'surat', label: 'Surat', state: 'Gujarat' }
];

const states = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Goa',
  'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala',
  'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland',
  'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura',
  'Uttar Pradesh', 'Uttarakhand', 'West Bengal', 'Delhi'
];

export default function PropertyLocationSection({
  property,
  formData,
  onInputChange,
  onLocationSelect
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [showMap, setShowMap] = useState(false);
  const [isLocationLoading, setIsLocationLoading] = useState(false);
  const mapRef = useRef(null);
  const searchInputRef = useRef(null);

  // Initialize coordinates if they don't exist
  useEffect(() => {
    if (!formData.latitude || !formData.longitude) {
      // Default to Mumbai coordinates as fallback
      onInputChange('latitude', 19.0760);
      onInputChange('longitude', 72.8777);
    }
  }, []);

  const handleAddressChange = (field, value) => {
    onInputChange(field, value);
    
    // Auto-suggest city based on area/landmark
    if (field === 'locality' || field === 'landmark') {
      const majorCity = majorCities.find(city => 
        value.toLowerCase().includes(city.label.toLowerCase()) ||
        city.label.toLowerCase().includes(value.toLowerCase())
      );
      if (majorCity) {
        onInputChange('city', majorCity.label);
        onInputChange('state', majorCity.state);
      }
    }
  };

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by this browser.');
      return;
    }

    setIsLocationLoading(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        onInputChange('latitude', latitude);
        onInputChange('longitude', longitude);
        setIsLocationLoading(false);
        
        // Reverse geocoding to get address
        fetchAddressFromCoordinates(latitude, longitude);
      },
      (error) => {
        console.error('Error getting location:', error);
        alert('Unable to get your location. Please enter it manually.');
        setIsLocationLoading(false);
      }
    );
  };

  const fetchAddressFromCoordinates = async (lat, lng) => {
    try {
      // This would typically use Google Maps Geocoding API
      // For now, we'll just simulate the response
      console.log(`Fetching address for coordinates: ${lat}, ${lng}`);
    } catch (error) {
      console.error('Error fetching address:', error);
    }
  };

  const searchLocation = async () => {
    if (!searchTerm.trim()) return;
    
    setIsLocationLoading(true);
    try {
      // This would typically use Google Maps Geocoding API
      // For now, we'll simulate searching
      console.log(`Searching for location: ${searchTerm}`);
      
      // Simulate API response
      setTimeout(() => {
        setIsLocationLoading(false);
        // Mock coordinates for demonstration
        onInputChange('latitude', 19.0760 + Math.random() * 0.1);
        onInputChange('longitude', 72.8777 + Math.random() * 0.1);
      }, 1000);
    } catch (error) {
      console.error('Error searching location:', error);
      setIsLocationLoading(false);
    }
  };

  const getFullAddress = () => {
    const parts = [];
    if (formData.landmark) parts.push(formData.landmark);
    if (formData.locality) parts.push(formData.locality);
    if (formData.city) parts.push(formData.city);
    if (formData.state) parts.push(formData.state);
    if (formData.pincode) parts.push(formData.pincode);
    return parts.join(', ');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
          <MapPin className="text-blue-600" size={24} />
          Location Details
        </h2>
        <div className="text-sm text-gray-500">
          Section 3 of 5
        </div>
      </div>

      {/* Location Search */}
      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">
          Quick Location Search
        </h3>
        <div className="flex gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              ref={searchInputRef}
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search for area, landmark, or address..."
              className="w-full pl-10 pr-4 py-3 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white"
              onKeyPress={(e) => e.key === 'Enter' && searchLocation()}
            />
          </div>
          <button
            onClick={searchLocation}
            disabled={isLocationLoading || !searchTerm.trim()}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
          >
            {isLocationLoading ? (
              <RefreshCw size={16} className="animate-spin" />
            ) : (
              <Search size={16} />
            )}
            Search
          </button>
          <button
            onClick={getCurrentLocation}
            disabled={isLocationLoading}
            className="px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            title="Use current location"
          >
            <Navigation size={16} />
          </button>
        </div>
      </div>

      {/* Primary Location Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Country */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Country *
          </label>
          <div className="relative">
            <Home className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <select
              value={formData.country || 'India'}
              onChange={(e) => onInputChange('country', e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white text-gray-900"
            >
              <option value="India">India</option>
            </select>
          </div>
        </div>

        {/* State */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            State *
          </label>
          <select
            value={formData.state || ''}
            onChange={(e) => onInputChange('state', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white text-gray-900"
          >
            <option value="">Select state</option>
            {states.map((state) => (
              <option key={state} value={state}>
                {state}
              </option>
            ))}
          </select>
        </div>

        {/* City */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            City *
          </label>
          <div className="relative">
            <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              value={formData.city || ''}
              onChange={(e) => onInputChange('city', e.target.value)}
              placeholder="e.g., Mumbai, Delhi, Bangalore"
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white"
            />
          </div>
        </div>

        {/* Pin Code */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Pin Code *
          </label>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              value={formData.pincode || ''}
              onChange={(e) => onInputChange('pincode', e.target.value.replace(/\D/g, '').slice(0, 6))}
              placeholder="400001"
              maxLength={6}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white"
            />
          </div>
        </div>
      </div>

      {/* Locality and Landmark */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Locality/Area */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Locality / Area *
          </label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              value={formData.locality || ''}
              onChange={(e) => handleAddressChange('locality', e.target.value)}
              placeholder="e.g., Andheri East, Koramangala"
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white"
            />
          </div>
        </div>

        {/* Landmark */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Landmark
          </label>
          <div className="relative">
            <Landmark className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              value={formData.landmark || ''}
              onChange={(e) => handleAddressChange('landmark', e.target.value)}
              placeholder="e.g., Near Metro Station, Opposite Mall"
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white"
            />
          </div>
        </div>
      </div>

      {/* Address Line */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Complete Address
        </label>
        <textarea
          value={formData.addressLine || ''}
          onChange={(e) => onInputChange('addressLine', e.target.value)}
          placeholder="Enter detailed address (optional - will be auto-generated from above fields)"
          rows={3}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white"
        />
        <div className="mt-2 p-3 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-600">
            <strong>Auto-generated address:</strong> {getFullAddress() || 'Complete the fields above to generate address'}
          </p>
        </div>
      </div>

      {/* Map Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <Map className="text-blue-600" size={20} />
            Property Location on Map
          </h3>
          <button
            onClick={() => setShowMap(!showMap)}
            className="flex items-center gap-2 px-4 py-2 text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
          >
            {showMap ? <EyeOff size={16} /> : <Eye size={16} />}
            {showMap ? 'Hide Map' : 'Show Map'}
          </button>
        </div>

        {/* Privacy Checkbox */}
        <div className="mb-4">
          <label className="flex items-center gap-2 text-sm text-gray-700">
            <input
              type="checkbox"
              checked={!!formData.hideExactLocation}
              onChange={(e) => onInputChange('hideExactLocation', e.target.checked)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span>Hide exact location, show only area (for privacy)</span>
          </label>
        </div>

        {/* Map Display */}
        {showMap && (
          <div className="border border-gray-300 rounded-lg overflow-hidden">
            <div 
              ref={mapRef}
              className="h-64 bg-gray-100 flex items-center justify-center relative"
            >
              {/* Mock Map Interface */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center">
                <div className="text-center">
                  <Map size={48} className="text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-600 font-medium">
                    Interactive Map
                  </p>
                  <p className="text-sm text-gray-500">
                    Google Maps integration would be here
                  </p>
                  <p className="text-xs text-gray-400 mt-2">
                    Coordinates: {formData.latitude?.toFixed(6)}, {formData.longitude?.toFixed(6)}
                  </p>
                </div>
              </div>
              
              {/* Draggable Marker */}
              <div 
                className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-move hover:scale-110 transition-transform"
                style={{
                  left: '50%',
                  top: '50%',
                }}
                title="Drag to adjust location"
              >
                <div className="p-2 bg-red-500 rounded-full shadow-lg">
                  <Pin size={24} className="text-white" />
                </div>
              </div>
            </div>
            
            {/* Map Controls */}
            <div className="p-4 bg-gray-50 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-600">
                  <span className="font-medium">Location:</span> {formData.latitude?.toFixed(6)}, {formData.longitude?.toFixed(6)}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      // Recenter to entered address
                      console.log('Recenter to address');
                    }}
                    className="px-3 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                  >
                    Recenter
                  </button>
                  <button
                    onClick={() => {
                      // Reset to default location
                      onInputChange('latitude', 19.0760);
                      onInputChange('longitude', 72.8777);
                    }}
                    className="px-3 py-1 text-xs bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
                  >
                    Reset
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Location Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Address Summary */}
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <MapPin className="text-blue-600" size={20} />
            </div>
            <div>
              <p className="text-sm text-blue-600 font-medium">Full Address</p>
              <p className="font-bold text-blue-900 text-sm">
                {getFullAddress() || 'Incomplete'}
              </p>
            </div>
          </div>
        </div>

        {/* Coordinates */}
        <div className="bg-green-50 p-4 rounded-lg border border-green-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <Navigation className="text-green-600" size={20} />
            </div>
            <div>
              <p className="text-sm text-green-600 font-medium">Coordinates</p>
              <p className="font-bold text-green-900 text-sm">
                {formData.latitude && formData.longitude 
                  ? `${formData.latitude.toFixed(4)}, ${formData.longitude.toFixed(4)}`
                  : 'Not set'
                }
              </p>
            </div>
          </div>
        </div>

        {/* Privacy Status */}
        <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-100 rounded-lg">
              {formData.hideExactLocation ? <EyeOff className="text-orange-600" size={20} /> : <Eye className="text-orange-600" size={20} />}
            </div>
            <div>
              <p className="text-sm text-orange-600 font-medium">Location Privacy</p>
              <p className="font-bold text-orange-900 text-sm">
                {formData.hideExactLocation ? 'Area Only' : 'Exact Location'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Tips */}
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <div className="p-1 bg-amber-100 rounded">
            <MapPin className="text-amber-600" size={16} />
          </div>
          <div>
            <h4 className="font-semibold text-amber-800 mb-1">
              Location Tips
            </h4>
            <ul className="text-sm text-amber-700 space-y-1">
              <li>• Accurate location helps tenants find your property easily</li>
              <li>• Use "Hide exact location" for privacy while maintaining searchability</li>
              <li>• Include landmarks for better direction finding</li>
              <li>• Search function can auto-detect coordinates</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
