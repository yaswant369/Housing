import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  Save,
  Eye,
  Loader2,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  CheckCircle,
  X
} from 'lucide-react';
import toast from 'react-hot-toast';

// Import all property edit section components
import PropertyStatusSection from './PropertyStatusSection';
import PropertyActionsBar from './PropertyActionsBar';
import PropertyBasicInfoSection from './PropertyBasicInfoSection';
import PropertyLocationSection from './PropertyLocationSection';
import PropertyPriceSection from './PropertyPriceSection';
import PropertyDetailsSection from './PropertyDetailsSection';
import PropertyAmenitiesSection from './PropertyAmenitiesSection';
import PropertyMediaSection from './PropertyMediaSection';
import PropertyDescriptionSection from './PropertyDescriptionSection';
import PropertyContactSection from './PropertyContactSection';
import PropertyEditLayout from './PropertyEditLayout';

const PropertyEditPage = ({
  property,
  isOpen,
  onClose,
  onSave,
  onChangeStatus,
  onEditPhotos,
  onDuplicate,
  onPreviewListing,
  API_BASE_URL
}) => {
  const [activeSection, setActiveSection] = useState(0);
  const [formData, setFormData] = useState({});
  const [isSaving, setIsSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [isDirty, setIsDirty] = useState({});
  const [showAdvanced, setShowAdvanced] = useState(false);

  // All sections including optional advanced section
  const sections = [
    { id: 'status', title: 'Status & Actions', component: PropertyStatusSection, required: true },
    { id: 'basic', title: 'Basic Property Info', component: PropertyBasicInfoSection, required: true },
    { id: 'location', title: 'Location Details', component: PropertyLocationSection, required: true },
    { id: 'price', title: 'Price & Availability', component: PropertyPriceSection, required: true },
    { id: 'details', title: 'Property Details', component: PropertyDetailsSection, required: true },
    { id: 'amenities', title: 'Amenities & Features', component: PropertyAmenitiesSection, required: false },
    { id: 'media', title: 'Photos, Videos & Floorplans', component: PropertyMediaSection, required: false },
    { id: 'description', title: 'Description & Highlights', component: PropertyDescriptionSection, required: false },
    { id: 'contact', title: 'Contact / Owner Details', component: PropertyContactSection, required: true },
    { id: 'advanced', title: 'SEO / Analytics / Boost', component: PropertyEditLayout, required: false, advanced: true }
  ];

  // Only non-advanced sections for main navigation
  const mainSections = sections.filter(section => !section.advanced);
  const totalSections = showAdvanced ? sections.length : mainSections.length;

  // Initialize form data with property values
  useEffect(() => {
    if (property && isOpen) {
      const initialData = {
        // Basic Info
        listingType: property.type || 'rent',
        propertyType: property.propertyType || '',
        bhk: property.bhk || '',
        title: property.title || '',
        buildingName: property.buildingName || '',
        propertyAge: property.propertyAge || '',
        propertyOnFloor: property.propertyOnFloor || '',
        totalFloors: property.totalFloors || '',
        facing: property.facing || '',
        
        // Location
        country: property.country || 'India',
        state: property.state || '',
        city: property.city || '',
        locality: property.locality || '',
        landmark: property.landmark || '',
        pincode: property.pincode || '',
        addressLine: property.addressLine || '',
        latitude: property.latitude || 19.0760,
        longitude: property.longitude || 72.8777,
        hideExactLocation: property.hideExactLocation || false,
        
        // Price
        price: property.price || '',
        maintenanceAmount: property.maintenance?.amount || '',
        maintenancePeriod: property.maintenance?.period || 'monthly',
        negotiable: property.negotiable || false,
        availability: property.availability || '',
        securityDeposit: property.securityDeposit || '',
        preferredTenants: property.preferredTenants || [],
        
        // Details
        builtUpArea: property.area || '',
        carpetArea: property.carpetArea || '',
        superBuiltUpArea: property.superBuiltUpArea || '',
        bedrooms: property.bedrooms || '',
        bathrooms: property.bathrooms || '',
        balconies: property.balconies || '',
        coveredParking: property.coveredParking || '',
        openParking: property.openParking || '',
        coveredBikeParking: property.coveredBikeParking || '',
        openBikeParking: property.openBikeParking || '',
        furnishing: property.furnishing || 'unfurnished',
        flooring: property.flooring || '',
        waterSupply: property.waterSupply || '',
        powerBackup: property.powerBackup || '',
        
        // Amenities
        amenities: property.amenities || [],
        
        // Media
        media: property.media || {},
        
        // Description
        description: property.description || '',
        keyHighlights: property.keyHighlights || [],
        
        // Contact
        ownerName: property.ownerName || '',
        contactRole: property.contactRole || 'owner',
        phoneNumber: property.phoneNumber || '',
        alternatePhone: property.alternatePhone || '',
        email: property.email || '',
        whatsapp: property.whatsapp || false,
        contactOnlyLoggedIn: property.contactOnlyLoggedIn || false,
        
        // Advanced
        urlSlug: property.urlSlug || '',
        metaTitle: property.metaTitle || '',
        metaDescription: property.metaDescription || '',
        
        // Status
        status: property.status || 'draft'
      };
      
      setFormData(initialData);
      setHasChanges(false);
      setIsDirty({});
    }
  }, [property, isOpen]);

  if (!isOpen || !property) return null;

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setHasChanges(true);
    setIsDirty(prev => ({ ...prev, [field]: true }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onSave(property.id, formData);
      toast.success('Property updated successfully');
      setHasChanges(false);
      setIsDirty({});
    } catch (error) {
      toast.error('Failed to update property: ' + error.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleStatusChange = (newStatus) => {
    handleInputChange('status', newStatus);
    onChangeStatus?.(property, newStatus);
  };

  const calculateCompleteness = () => {
    const requiredFields = [
      'listingType', 'propertyType', 'city', 'locality', 'pincode', 
      'builtUpArea', 'price', 'bathrooms', 'ownerName', 'phoneNumber'
    ];
    const filledFields = requiredFields.filter(field => formData[field] && formData[field].toString().trim() !== '');
    return Math.round((filledFields.length / requiredFields.length) * 100);
  };

  const validateCurrentSection = () => {
    const currentSection = sections[activeSection];
    if (currentSection.advanced) return true; // Advanced sections are optional
    
    switch (currentSection.id) {
      case 'basic':
        return formData.listingType && formData.propertyType && formData.city && formData.locality;
      case 'location':
        return formData.country && formData.state && formData.city && formData.pincode;
      case 'price':
        return formData.price && (formData.listingType !== 'rent' || formData.availability);
      case 'details':
        return formData.builtUpArea && formData.bathrooms;
      case 'contact':
        return formData.ownerName && formData.phoneNumber && formData.contactRole;
      default:
        return true;
    }
  };

  const goToNextSection = () => {
    if (validateCurrentSection() && activeSection < sections.length - 1) {
      setActiveSection(activeSection + 1);
    }
  };

  const goToPreviousSection = () => {
    if (activeSection > 0) {
      setActiveSection(activeSection - 1);
    }
  };

  const getVisibleSections = () => {
    return showAdvanced ? sections : mainSections;
  };

  const getSectionIndex = (sectionId) => {
    const visibleSections = getVisibleSections();
    return visibleSections.findIndex(section => section.id === sectionId);
  };

  const getCurrentSection = () => {
    const visibleSections = getVisibleSections();
    return visibleSections[activeSection] || visibleSections[0];
  };

  const currentSection = getCurrentSection();
  const CurrentSectionComponent = currentSection?.component;

  return (
    <div className="fixed inset-0 bg-white dark:bg-gray-900 z-50 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
        <div className="flex items-center gap-4">
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Edit Property</h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">Property ID: #{property.id}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          {/* Advanced Toggle */}
          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className={`px-3 py-1 text-sm border rounded-lg transition-colors ${
              showAdvanced 
                ? 'bg-purple-50 border-purple-200 text-purple-700' 
                : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'
            }`}
          >
            {showAdvanced ? 'Hide Advanced' : 'Show Advanced'}
          </button>
          
          {/* Completeness Indicator */}
          <div className="flex items-center gap-2">
            <div className="text-sm text-gray-600 dark:text-gray-400">Completeness:</div>
            <div className="flex items-center gap-2">
              <div className="w-20 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-green-500 transition-all duration-300"
                  style={{ width: `${calculateCompleteness()}%` }}
                />
              </div>
              <span className="text-sm font-medium text-gray-900 dark:text-gray-100 min-w-[3rem]">
                {calculateCompleteness()}%
              </span>
            </div>
          </div>
          
          {hasChanges && (
            <span className="text-sm text-amber-600 dark:text-amber-400 font-medium">
              Unsaved changes
            </span>
          )}
          
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isSaving ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <Save size={16} />
            )}
            {isSaving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="px-6 py-4 bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
            Section {activeSection + 1} of {totalSections}
          </span>
          <span className="text-sm text-gray-600 dark:text-gray-400">
            {currentSection?.title}
          </span>
        </div>
        <div className="flex gap-1">
          {getVisibleSections().map((section, index) => (
            <div
              key={section.id}
              className={`h-2 flex-1 rounded-full transition-colors ${
                index <= activeSection
                  ? 'bg-blue-600'
                  : 'bg-gray-200 dark:bg-gray-700'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex min-h-0">
        {/* Sidebar Navigation */}
        <div className="w-80 bg-gray-50 dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 overflow-y-auto">
          <div className="p-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
              Sections
            </h3>
            <nav className="space-y-2">
              {getVisibleSections().map((section, index) => {
                const isActive = index === activeSection;
                const isCompleted = index < activeSection;
                const hasChanges = Object.keys(isDirty).some(key => 
                  key.toLowerCase().includes(section.id) || 
                  (section.id === 'basic' && ['listingType', 'propertyType', 'bhk'].includes(key))
                );
                
                return (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(index)}
                    className={`w-full text-left p-3 rounded-lg transition-colors ${
                      isActive
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                          isActive
                            ? 'bg-white text-blue-600'
                            : isCompleted
                            ? 'bg-green-500 text-white'
                            : 'bg-gray-200 dark:bg-gray-600 text-gray-600 dark:text-gray-300'
                        }`}>
                          {isCompleted ? (
                            <CheckCircle size={16} />
                          ) : (
                            index + 1
                          )}
                        </div>
                        <div className="flex-1">
                          <span className="font-medium text-sm">{section.title}</span>
                          {section.required && (
                            <div className="text-xs opacity-75">Required</div>
                          )}
                          {section.advanced && (
                            <div className="text-xs opacity-75">Advanced</div>
                          )}
                        </div>
                      </div>
                      {hasChanges && (
                        <div className="w-2 h-2 bg-amber-400 rounded-full" />
                      )}
                    </div>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Quick Actions Sidebar - only show for main sections */}
          {!currentSection?.advanced && (
            <div className="p-4 border-t border-gray-200 dark:border-gray-700">
              <PropertyActionsBar
                property={property}
                onEditPhotos={() => onEditPhotos?.(property)}
                onDuplicate={() => onDuplicate?.(property)}
                onShare={() => {
                  if (navigator.share) {
                    navigator.share({
                      title: property.title || 'Property Listing',
                      text: `Check out this property: ${formData.title}`,
                      url: window.location.href
                    });
                  } else {
                    navigator.clipboard.writeText(window.location.href);
                    toast.success('Link copied to clipboard');
                  }
                }}
                onAnalytics={() => {
                  toast('Analytics feature coming soon!', { icon: 'ℹ️' });
                }}
                onRefreshData={() => {
                  window.location.reload();
                }}
                onSaveDraft={() => {
                  handleInputChange('status', 'draft');
                  toast.success('Draft saved');
                }}
                isSaving={isSaving}
                hasUnsavedChanges={hasChanges}
              />
            </div>
          )}
        </div>

        {/* Main Content Area */}
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-4xl mx-auto p-6">
            {/* Validation Warning */}
            {!validateCurrentSection() && !currentSection?.advanced && (
              <div className="mb-6 p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 rounded-lg flex items-start gap-3">
                <AlertCircle className="text-amber-600 mt-0.5" size={20} />
                <div>
                  <h4 className="font-semibold text-amber-800 dark:text-amber-200">
                    Incomplete Section
                  </h4>
                  <p className="text-sm text-amber-700 dark:text-amber-300">
                    Please fill in the required fields before proceeding to the next section.
                  </p>
                </div>
              </div>
            )}

            {/* Current Section Component */}
            <div className="bg-white dark:bg-gray-900 rounded-lg">
              {CurrentSectionComponent && (
                <CurrentSectionComponent
                  property={property}
                  formData={formData}
                  onInputChange={handleInputChange}
                  onChangeStatus={handleStatusChange}
                  onEditPhotos={() => onEditPhotos?.(property)}
                  onDuplicate={() => onDuplicate?.(property)}
                  onPreviewListing={() => onPreviewListing?.(property)}
                  onDeleteProperty={() => {
                    if (confirm('Are you sure you want to delete this property? This action cannot be undone.')) {
                      toast.success('Property deleted successfully');
                      onClose();
                    }
                  }}
                  onArchiveProperty={() => {
                    handleInputChange('status', 'archived');
                    toast.success('Property archived');
                  }}
                  onLocationSelect={(location) => {
                    handleInputChange('latitude', location.lat);
                    handleInputChange('longitude', location.lng);
                  }}
                />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="flex items-center justify-between p-6 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
        <div className="flex items-center gap-4">
          <button
            onClick={goToPreviousSection}
            disabled={activeSection === 0}
            className="flex items-center gap-2 px-4 py-2 text-gray-600 dark:text-gray-400 disabled:opacity-50 disabled:cursor-not-allowed hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
          >
            <ChevronLeft size={16} />
            Previous
          </button>
        </div>

        <div className="flex items-center gap-2">
          {getVisibleSections().map((_, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full transition-colors ${
                index === activeSection
                  ? 'bg-blue-600'
                  : index < activeSection
                  ? 'bg-green-500'
                  : 'bg-gray-300 dark:bg-gray-600'
              }`}
            />
          ))}
        </div>

        <div className="flex items-center gap-4">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            {!currentSection?.advanced && validateCurrentSection() ? (
              <span className="flex items-center gap-1 text-green-600 dark:text-green-400">
                <CheckCircle size={14} />
                Ready to continue
              </span>
            ) : !currentSection?.advanced ? (
              <span className="flex items-center gap-1 text-amber-600 dark:text-amber-400">
                <AlertCircle size={14} />
                Complete required fields
              </span>
            ) : (
              <span className="text-gray-500">Optional section</span>
            )}
          </div>
          
          <button
            onClick={goToNextSection}
            disabled={activeSection === sections.length - 1 || (!currentSection?.advanced && !validateCurrentSection())}
            className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Next
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default PropertyEditPage;