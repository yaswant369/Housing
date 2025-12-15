import React, { useEffect, useRef, useState } from 'react';
import { MapPin, Navigation, ZoomIn, ZoomOut, Layers, X } from 'lucide-react';
import { formatPrice } from '../../utils/propertyHelpers';

// Mock Leaflet implementation for demo purposes
// In real implementation, you would use: import L from 'leaflet'

const PropertyMap = ({ 
  properties = [], 
  center = { lat: 19.0760, lng: 72.8777 }, // Mumbai coordinates
  zoom = 12,
  onPropertyClick,
  onBoundsChange,
  showControls = true,
  className = "",
  height = "400px"
}) => {
  const mapRef = useRef(null);
  const [mapInstance, setMapInstance] = useState(null);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [mapStyle, setMapStyle] = useState('standard'); // standard, satellite, hybrid

  // Mock map implementation - replace with actual Leaflet integration
  useEffect(() => {
    // Simulate map initialization
    const mapContainer = mapRef.current;
    if (mapContainer && !mapInstance) {
      // In real implementation:
      // const map = L.map(mapContainer).setView([center.lat, center.lng], zoom);
      // L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);
      // setMapInstance(map);

      // Mock implementation for demo
      console.log('Map initialized with center:', center, 'zoom:', zoom);
      setMapInstance({ initialized: true, center, zoom });
    }
  }, [center, zoom, mapInstance]);

  // Add property markers to map
  useEffect(() => {
    if (mapInstance && properties.length > 0) {
      // In real implementation, you would:
      // properties.forEach(property => {
      //   const marker = L.marker([property.latitude, property.longitude])
      //     .addTo(mapInstance)
      //     .bindPopup(createPropertyPopup(property));
      // });

      console.log('Added', properties.length, 'property markers to map');
    }
  }, [mapInstance, properties]);

  const createPropertyPopup = (property) => {
    return `
      <div class="property-popup">
        <img src="${property.images?.[0]?.thumbnail || '/placeholder.jpg'}" alt="${property.title}" style="width: 100%; height: 120px; object-fit: cover; border-radius: 8px;" />
        <div style="padding: 12px;">
          <h3 style="margin: 0 0 8px 0; font-size: 16px; font-weight: bold;">${property.bhk} BHK ${property.propertyType}</h3>
          <p style="margin: 0 0 8px 0; color: #666; font-size: 14px;">📍 ${property.location}</p>
          <p style="margin: 0; font-size: 18px; font-weight: bold; color: #2563eb;">${formatPrice(property.price, null, property.priceValue)}</p>
        </div>
      </div>
    `;
  };

  const handlePropertyClick = (property) => {
    setSelectedProperty(property);
    onPropertyClick?.(property);
  };

  const handleZoomIn = () => {
    if (mapInstance) {
      // mapInstance.setZoom(mapInstance.getZoom() + 1);
      console.log('Zooming in');
    }
  };

  const handleZoomOut = () => {
    if (mapInstance) {
      // mapInstance.setZoom(mapInstance.getZoom() - 1);
      console.log('Zooming out');
    }
  };

  const toggleMapStyle = () => {
    const styles = ['standard', 'satellite', 'hybrid'];
    const currentIndex = styles.indexOf(mapStyle);
    const nextIndex = (currentIndex + 1) % styles.length;
    setMapStyle(styles[nextIndex]);
  };

  const getMapStyleClass = () => {
    switch (mapStyle) {
      case 'satellite':
        return 'map-satellite';
      case 'hybrid':
        return 'map-hybrid';
      default:
        return 'map-standard';
    }
  };

  return (
    <div className={`relative bg-gray-100 rounded-lg overflow-hidden ${className}`} style={{ height }}>
      
      {/* Map Container */}
      <div 
        ref={mapRef} 
        className={`w-full h-full ${getMapStyleClass()}`}
        style={{ 
          background: `linear-gradient(135deg, #667eea 0%, #764ba2 100%)`,
          position: 'relative'
        }}
      >
        {/* Mock map content for demonstration */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white">
            <MapPin className="w-12 h-12 mx-auto mb-2 opacity-60" />
            <p className="text-lg font-medium opacity-80">Interactive Map</p>
            <p className="text-sm opacity-60">Property locations would be displayed here</p>
            <p className="text-xs opacity-40 mt-2">
              Center: {center.lat.toFixed(4)}, {center.lng.toFixed(4)} | Zoom: {zoom}
            </p>
          </div>
        </div>

        {/* Property Markers Overlay (for demo) */}
        {properties.slice(0, 5).map((property, index) => (
          <div
            key={property.id}
            className="absolute w-8 h-8 bg-blue-500 rounded-full border-2 border-white shadow-lg cursor-pointer transform -translate-x-1/2 -translate-y-1/2 hover:bg-blue-600 transition-colors"
            style={{
              left: `${20 + (index * 15)}%`,
              top: `${30 + (index * 10)}%`
            }}
            onClick={() => handlePropertyClick(property)}
            title={`${property.bhk} BHK ${property.propertyType} - ${formatPrice(property.price)}`}
          >
            <div className="w-full h-full rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
              <span className="text-white text-xs font-bold">₹</span>
            </div>
          </div>
        ))}
      </div>

      {/* Map Controls */}
      {showControls && (
        <div className="absolute top-4 right-4 flex flex-col gap-2">
          
          {/* Zoom Controls */}
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <button
              onClick={handleZoomIn}
              className="p-3 hover:bg-gray-50 transition-colors border-b border-gray-100"
              title="Zoom In"
            >
              <ZoomIn className="w-4 h-4 text-gray-700" />
            </button>
            <button
              onClick={handleZoomOut}
              className="p-3 hover:bg-gray-50 transition-colors"
              title="Zoom Out"
            >
              <ZoomOut className="w-4 h-4 text-gray-700" />
            </button>
          </div>

          {/* Map Style Toggle */}
          <button
            onClick={toggleMapStyle}
            className="p-3 bg-white rounded-lg shadow-lg hover:bg-gray-50 transition-colors"
            title={`Current: ${mapStyle} map`}
          >
            <Layers className="w-4 h-4 text-gray-700" />
          </button>

          {/* My Location */}
          <button
            className="p-3 bg-white rounded-lg shadow-lg hover:bg-gray-50 transition-colors"
            title="My Location"
          >
            <Navigation className="w-4 h-4 text-gray-700" />
          </button>
        </div>
      )}

      {/* Selected Property Info */}
      {selectedProperty && (
        <div className="absolute bottom-4 left-4 right-4 bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="flex">
            <img
              src={selectedProperty.images?.[0]?.thumbnail || '/placeholder.jpg'}
              alt={selectedProperty.title}
              className="w-24 h-24 object-cover"
            />
            <div className="flex-1 p-3">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-gray-900 text-sm">
                    {selectedProperty.bhk} BHK {selectedProperty.propertyType}
                  </h3>
                  <p className="text-gray-600 text-xs mt-1 flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {selectedProperty.location}
                  </p>
                  <p className="text-blue-600 font-bold text-sm mt-1">
                    {formatPrice(selectedProperty.price, null, selectedProperty.priceValue)}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedProperty(null)}
                  className="p-1 hover:bg-gray-100 rounded"
                >
                  <X className="w-4 h-4 text-gray-500" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Map Legend */}
      <div className="absolute bottom-4 right-4 bg-white rounded-lg shadow-lg p-3">
        <h4 className="text-xs font-semibold text-gray-700 mb-2">Legend</h4>
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span className="text-xs text-gray-600">Properties</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-xs text-gray-600">Verified</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
            <span className="text-xs text-gray-600">Featured</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// Property Map Wrapper with additional features
export const PropertyMapWrapper = ({ 
  properties,
  selectedProperty,
  onPropertySelect,
  onLocationSelect,
  showPropertyList = false,
  mapHeight = "500px",
  ...props 
}) => {
  const [viewMode, setViewMode] = useState('map'); // map, list, split

  return (
    <div className="w-full">
      {/* View Mode Toggle */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">
          Properties on Map
        </h3>
        <div className="flex bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => setViewMode('map')}
            className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
              viewMode === 'map' 
                ? 'bg-white text-gray-900 shadow-sm' 
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Map
          </button>
          <button
            onClick={() => setViewMode('split')}
            className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
              viewMode === 'split' 
                ? 'bg-white text-gray-900 shadow-sm' 
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Split View
          </button>
        </div>
      </div>

      {/* Map View */}
      {viewMode !== 'list' && (
        <PropertyMap
          properties={properties}
          onPropertyClick={onPropertySelect}
          height={viewMode === 'split' ? mapHeight : '600px'}
          {...props}
        />
      )}

      {/* Split View */}
      {viewMode === 'split' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
          <div>
            <PropertyMap
              properties={properties}
              onPropertyClick={onPropertySelect}
              height={mapHeight}
              {...props}
            />
          </div>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {properties.map((property) => (
              <div
                key={property.id}
                className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                  selectedProperty?.id === property.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => onPropertySelect(property)}
              >
                <div className="flex gap-3">
                  <img
                    src={property.images?.[0]?.thumbnail || '/placeholder.jpg'}
                    alt={property.title}
                    className="w-16 h-16 object-cover rounded"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-gray-900 text-sm">
                      {property.bhk} BHK {property.propertyType}
                    </h4>
                    <p className="text-gray-600 text-xs mt-1">{property.location}</p>
                    <p className="text-blue-600 font-bold text-sm mt-1">
                      {formatPrice(property.price, null, property.priceValue)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PropertyMap;
