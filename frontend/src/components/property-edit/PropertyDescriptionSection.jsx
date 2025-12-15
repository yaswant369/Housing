import React, { useState } from 'react';
import {
  FileText,
  Lightbulb,
  CheckCircle,
  Star,
  MapPin,
  Clock,
  Home,
  Shield,
  TreePine,
  Zap,
  Users,
  Car,
  Plus,
  X,
  Wand2,
  Eye
} from 'lucide-react';

const PropertyDescriptionSection = ({ property, formData, onInputChange }) => {
  const [description, setDescription] = useState(formData.description || '');
  const [showHighlights, setShowHighlights] = useState(false);

  const keyHighlightsOptions = [
    { id: 'cornerProperty', label: 'Corner Property', icon: Home, category: 'location' },
    { id: 'parkFacing', label: 'Park Facing', icon: TreePine, category: 'location' },
    { id: 'mainRoadFacing', label: 'Main Road Facing', icon: MapPin, category: 'location' },
    { id: 'recentlyRenovated', label: 'Recently Renovated', icon: Wand2, category: 'condition' },
    { id: 'newConstruction', label: 'New Construction', icon: Star, category: 'age' },
    { id: 'vaastuCompliant', label: 'Vaastu Compliant', icon: Shield, category: 'spiritual' },
    { id: 'gatedSociety', label: 'Gated Society', icon: Shield, category: 'security' },
    { id: 'readyToMove', label: 'Ready to Move', icon: CheckCircle, category: 'availability' },
    { id: 'furnished', label: 'Fully Furnished', icon: Star, category: 'furnishing' },
    { id: 'primeLocation', label: 'Prime Location', icon: MapPin, category: 'location' },
    { id: 'quietArea', label: 'Quiet Area', icon: Users, category: 'environment' },
    { id: 'wellConnected', label: 'Well Connected', icon: Car, category: 'connectivity' },
    { id: 'powerBackup', label: 'Power Backup', icon: Zap, category: 'utilities' },
    { id: 'high ceilings', label: 'High Ceilings', icon: Home, category: 'structure' },
    { id: 'abundant natural light', label: 'Abundant Natural Light', icon: Star, category: 'environment' },
    { id: 'good ventilation', label: 'Good Ventilation', icon: Zap, category: 'environment' }
  ];

  const descriptionSuggestions = [
    "Mention nearby metro stations, schools, and hospitals",
    "Highlight unique features like renovated kitchen or bathroom",
    "Describe the neighborhood and connectivity",
    "Mention nearby shopping malls, markets, and restaurants",
    "Talk about safety and security in the area",
    "Describe parking availability and visitor access",
    "Mention any recent improvements or upgrades",
    "Talk about the building amenities and society features"
  ];

  const handleDescriptionChange = (value) => {
    setDescription(value);
    onInputChange('description', value);
  };

  const handleHighlightsChange = (highlightId, checked) => {
    const currentHighlights = formData.keyHighlights || [];
    if (checked) {
      onInputChange('keyHighlights', [...currentHighlights, highlightId]);
    } else {
      onInputChange('keyHighlights', currentHighlights.filter(id => id !== highlightId));
    }
  };

  const autoGenerateHighlights = () => {
    const relevantHighlights = [];
    
    // Auto-select based on property data
    if (formData.furnishing === 'furnished') relevantHighlights.push('furnished');
    if (formData.propertyAge === 'new') relevantHighlights.push('newConstruction');
    if (formData.powerBackup || formData.utilities?.powerBackup) relevantHighlights.push('powerBackup');
    if (formData.gatedCommunity) relevantHighlights.push('gatedSociety');
    if (formData.park) relevantHighlights.push('parkFacing');
    if (formData.lift) relevantHighlights.push('readyToMove');
    
    // Add location-based highlights
    if (formData.city && ['Mumbai', 'Delhi', 'Bangalore', 'Pune'].includes(formData.city)) {
      relevantHighlights.push('primeLocation');
    }
    
    onInputChange('keyHighlights', relevantHighlights);
    setShowHighlights(true);
  };

  const generateDescription = () => {
    const parts = [];
    
    // Property type and configuration
    if (formData.bhk) {
      parts.push(`This beautiful ${formData.bhk} BHK ${formData.propertyType || 'apartment'} offers`);
    }
    
    // Area and key features
    if (formData.builtUpArea) {
      parts.push(`${formData.builtUpArea} sq ft of well-designed living space`);
    }
    
    // Location
    if (formData.city && formData.locality) {
      parts.push(`located in the desirable ${formData.locality}, ${formData.city}`);
    }
    
    // Amenities
    const selectedAmenities = formData.amenities || [];
    const keyAmenities = selectedAmenities.filter(id => 
      ['lift', 'securityGuard', 'park', 'powerBackup'].includes(id)
    );
    
    if (keyAmenities.length > 0) {
      parts.push(`with access to ${keyAmenities.length} premium amenities including ${keyAmenities.join(', ')}`);
    }
    
    // Furnishing
    if (formData.furnishing) {
      parts.push(`The property is ${formData.furnishing} and ready for immediate occupancy`);
    }
    
    // Connect to end
    parts.push("This is an excellent opportunity for families and professionals looking for quality living space with modern conveniences.");
    
    const generatedDescription = parts.join('. ') + '.';
    handleDescriptionChange(generatedDescription);
  };

  const getHighlightIcon = (highlightId) => {
    const highlight = keyHighlightsOptions.find(h => h.id === highlightId);
    return highlight ? highlight.icon : Star;
  };

  const getHighlightColor = (highlightId) => {
    const highlight = keyHighlightsOptions.find(h => h.id === highlightId);
    const colors = {
      location: 'text-green-600 bg-green-50 border-green-200',
      condition: 'text-blue-600 bg-blue-50 border-blue-200',
      age: 'text-purple-600 bg-purple-50 border-purple-200',
      security: 'text-red-600 bg-red-50 border-red-200',
      availability: 'text-orange-600 bg-orange-50 border-orange-200',
      furnishing: 'text-pink-600 bg-pink-50 border-pink-200',
      environment: 'text-teal-600 bg-teal-50 border-teal-200',
      connectivity: 'text-indigo-600 bg-indigo-50 border-indigo-200',
      utilities: 'text-yellow-600 bg-yellow-50 border-yellow-200',
      structure: 'text-gray-600 bg-gray-50 border-gray-200'
    };
    return colors[highlight?.category] || 'text-gray-600 bg-gray-50 border-gray-200';
  };

  const isHighlightSelected = (highlightId) => {
    return formData.keyHighlights?.includes(highlightId) || false;
  };

  const wordCount = description.split(/\s+/).filter(word => word.length > 0).length;
  const characterCount = description.length;
  const isOptimalLength = wordCount >= 50 && wordCount <= 300;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
          <FileText className="text-blue-600" size={24} />
          Description & Highlights
        </h2>
        <div className="text-sm text-gray-500">
          Section 8 of 9
        </div>
      </div>

      {/* Character Count */}
      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">
          Content Overview
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-3 bg-white rounded-lg border">
            <p className="text-2xl font-bold text-blue-600">{wordCount}</p>
            <p className="text-sm text-gray-600">Words</p>
          </div>
          <div className="text-center p-3 bg-white rounded-lg border">
            <p className="text-2xl font-bold text-green-600">{characterCount}</p>
            <p className="text-sm text-gray-600">Characters</p>
          </div>
          <div className="text-center p-3 bg-white rounded-lg border">
            <p className="text-2xl font-bold text-purple-600">{formData.keyHighlights?.length || 0}</p>
            <p className="text-sm text-gray-600">Highlights</p>
          </div>
        </div>
        <div className="mt-3">
          <div className="flex items-center justify-between text-sm text-gray-600 mb-1">
            <span>Description Length</span>
            <span className={isOptimalLength ? 'text-green-600' : 'text-amber-600'}>
              {isOptimalLength ? 'Optimal' : 'Needs Improvement'}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className={`h-2 rounded-full transition-all duration-300 ${
                isOptimalLength ? 'bg-green-500' : 'bg-amber-500'
              }`}
              style={{ width: `${Math.min((wordCount / 300) * 100, 100)}%` }}
            />
          </div>
        </div>
      </div>

      {/* Description Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            Property Description
          </h3>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={generateDescription}
              className="flex items-center gap-2 px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            >
              <Wand2 size={14} />
              Auto Generate
            </button>
            <button
              type="button"
              onClick={() => setShowHighlights(!showHighlights)}
              className={`flex items-center gap-2 px-3 py-1 text-sm border rounded transition-colors ${
                showHighlights 
                  ? 'bg-purple-50 border-purple-200 text-purple-700' 
                  : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Lightbulb size={14} />
              {showHighlights ? 'Hide' : 'Show'} Highlights
            </button>
          </div>
        </div>
        
        <div className="space-y-3">
          <textarea
            value={description}
            onChange={(e) => handleDescriptionChange(e.target.value)}
            placeholder="Describe your property highlighting key features, location benefits, and what makes it special. Mention nearby metro stations, schools, hospitals, and connectivity..."
            rows={8}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white text-gray-900"
          />
          
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              {wordCount} words • {characterCount} characters
              {!isOptimalLength && (
                <span className="text-amber-600 ml-2">
                  (Recommended: 50-300 words)
                </span>
              )}
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Eye size={14} />
              <span>Preview available</span>
            </div>
          </div>
        </div>

        {/* Description Suggestions */}
        <div className="mt-4 p-4 bg-gray-50 rounded-lg border">
          <h4 className="font-medium text-gray-900 mb-2">
            💡 Writing Tips
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {descriptionSuggestions.map((suggestion, index) => (
              <div key={index} className="text-sm text-gray-600 flex items-start gap-2">
                <CheckCircle size={14} className="text-green-500 mt-0.5 flex-shrink-0" />
                <span>{suggestion}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Key Highlights Section */}
      {showHighlights && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Key Highlights
            </h3>
            <button
              type="button"
              onClick={autoGenerateHighlights}
              className="flex items-center gap-2 px-3 py-1 text-sm bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors"
            >
              <Wand2 size={14} />
              Auto Select
            </button>
          </div>

          {/* Selected Highlights Preview */}
          {formData.keyHighlights?.length > 0 && (
            <div className="mb-4 p-4 bg-green-50 rounded-lg border border-green-200">
              <h4 className="font-medium text-green-900 mb-2">
                Selected Highlights ({formData.keyHighlights.length})
              </h4>
              <div className="flex flex-wrap gap-2">
                {formData.keyHighlights.map((highlightId) => {
                  const highlight = keyHighlightsOptions.find(h => h.id === highlightId);
                  if (!highlight) return null;
                  
                  const IconComponent = highlight.icon;
                  return (
                    <div
                      key={highlightId}
                      className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm border ${getHighlightColor(highlightId)}`}
                    >
                      <IconComponent size={14} />
                      <span>{highlight.label}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Highlights Options */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {keyHighlightsOptions.map((highlight) => {
              const IconComponent = highlight.icon;
              const isSelected = isHighlightSelected(highlight.id);
              
              return (
                <button
                  key={highlight.id}
                  type="button"
                  onClick={() => handleHighlightsChange(highlight.id, !isSelected)}
                  className={`p-4 rounded-lg border-2 text-left transition-all ${
                    isSelected
                      ? `${getHighlightColor(highlight.id)} border-opacity-100 shadow-md`
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-lg ${
                      isSelected 
                        ? 'bg-white'
                        : 'bg-gray-100'
                    }`}>
                      <IconComponent 
                        size={20} 
                        className={isSelected ? 'text-current' : 'text-gray-600'}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h5 className={`font-medium text-sm ${
                        isSelected 
                          ? 'text-current' 
                          : 'text-gray-900'
                      }`}>
                        {highlight.label}
                      </h5>
                      {isSelected && (
                        <div className="flex items-center gap-1 mt-1">
                          <CheckCircle size={12} className="text-current" />
                          <span className="text-xs opacity-75">Selected</span>
                        </div>
                      )}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* SEO Suggestions */}
      <div className="bg-gray-50 p-4 rounded-lg border">
        <h4 className="font-medium text-gray-900 mb-3">
          📈 SEO & Visibility Tips
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <h5 className="font-medium text-gray-800 mb-2">Description Best Practices</h5>
            <ul className="space-y-1 text-gray-600">
              <li>• Use local area names for better searchability</li>
              <li>• Mention transport connectivity (metro, bus)</li>
              <li>• Include nearby landmarks and facilities</li>
              <li>• Write in active voice and engaging tone</li>
            </ul>
          </div>
          <div>
            <h5 className="font-medium text-gray-800 mb-2">Key Highlights Benefits</h5>
            <ul className="space-y-1 text-gray-600">
              <li>• Increases property visibility in search results</li>
              <li>• Helps tenants quickly identify key features</li>
              <li>• Improves listing quality score</li>
              <li>• Attracts more qualified leads</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Tips */}
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <div className="p-1 bg-amber-100 rounded">
            <FileText className="text-amber-600" size={16} />
          </div>
          <div>
            <h4 className="font-semibold text-amber-800 mb-1">
              Content Guidelines
            </h4>
            <ul className="text-sm text-amber-700 space-y-1">
              <li>• Be honest and accurate about the property condition</li>
              <li>• Highlight what makes your property unique</li>
              <li>• Include practical information (parking, security, etc.)</li>
              <li>• Use keywords that tenants might search for</li>
              <li>• Keep descriptions between 100-300 words for best results</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyDescriptionSection;
