import React, { useState, useEffect, useMemo } from 'react';
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
import PropertyQuickActions from './PropertyQuickActions';
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
  const [preservedSection, setPreservedSection] = useState(0);
  const [formData, setFormData] = useState({});
  const [isSaving, setIsSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [isDirty, setIsDirty] = useState({});
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // All sections including optional advanced section
  const sections = useMemo(() => [
    { id: 'basic', title: 'Basic Property Info', component: PropertyBasicInfoSection, required: true },
    { id: 'location', title: 'Location Details', component: PropertyLocationSection, required: true },
    { id: 'price', title: 'Price & Availability', component: PropertyPriceSection, required: true },
    { id: 'details', title: 'Property Details', component: PropertyDetailsSection, required: true },
    { id: 'amenities', title: 'Amenities & Features', component: PropertyAmenitiesSection, required: false },
    { id: 'media', title: 'Photos, Videos & Floorplans', component: PropertyMediaSection, required: false },
    { id: 'description', title: 'Description & Highlights', component: PropertyDescriptionSection, required: false },
    { id: 'contact', title: 'Contact / Owner Details', component: PropertyContactSection, required: true },
    { id: 'advanced', title: 'SEO / Analytics / Boost', component: PropertyEditLayout, required: false, advanced: true }
  ], []);

  // Only non-advanced sections for main navigation
  const mainSections = useMemo(() => sections.filter(section => !section.advanced), [sections]);
  const totalSections = showAdvanced ? sections.length : mainSections.length;

  // Initialize form data only once when property changes and component is opened
  useEffect(() => {
    if (property && isOpen && !isInitialized) {
      // Migrate legacy images to new media structure if needed
      let migratedMedia = property.media || {};
      
      // If no media structure exists but legacy images do, migrate them
      // Only migrate if no photos exist or all photos are non-legacy
      const shouldMigrateLegacy = (!migratedMedia.photos || migratedMedia.photos.length === 0) &&
                                  property.images && property.images.length > 0 &&
                                  (!migratedMedia.photos || !migratedMedia.photos.some(photo => photo.isLegacy));
      
      if (shouldMigrateLegacy) {
        console.log('Migrating legacy images to new media structure');
        
        migratedMedia = {
          ...migratedMedia,
          photos: property.images.map((imageData, index) => {
            // Handle different legacy image formats
            let imageUrl = '';
            let fileName = `image_${index + 1}.webp`;
            
            if (typeof imageData === 'string') {
              // Simple string path
              imageUrl = imageData;
              fileName = imageData.split('/').pop() || fileName;
            } else if (imageData && typeof imageData === 'object') {
              // Object with different sizes (thumbnail, medium, optimized)
              // Prefer optimized, then medium, then thumbnail
              imageUrl = imageData.optimized || imageData.medium || imageData.thumbnail || '';
              
              if (imageUrl) {
                fileName = imageUrl.split('/').pop() || fileName;
              }
            }
            
            // Validate final image URL
            if (!imageUrl) {
              console.warn(`No valid image URL found at index ${index}:`, imageData);
              return {
                id: `legacy_${index}`,
                fileName: fileName,
                fileType: 'image/webp',
                fileSize: 0,
                url: `${API_BASE_URL}/uploads/default-placeholder.webp`,
                isCover: index === 0,
                sortOrder: index,
                uploadDate: property.createdAt || new Date().toISOString(),
                imageType: null,
                isLegacy: true,
                isError: true
              };
            }
            
            return {
              id: `legacy_${index}`,
              fileName: fileName,
              fileType: 'image/webp',
              fileSize: 0, // Size not available for legacy images
              url: imageUrl.startsWith('http') ? imageUrl : `${API_BASE_URL}${imageUrl}`,
              isCover: index === 0, // First image becomes cover
              sortOrder: index,
              uploadDate: property.createdAt || new Date().toISOString(),
              imageType: null,
              isLegacy: true // Flag to identify migrated images
            };
          })
        };
      }
      
      const initialData = {
        // Basic Info - Fix field mappings
        listingType: property.type || 'rent',
        propertyType: property.propertyType || '',
        lookingFor: property.lookingTo || property.type || 'rent', // Map lookingTo to lookingFor
        propertyKind: property.propertyKind || '', // Property kind mapping
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
        
        // Price - Fix maintenance charges mapping
        price: property.price || '',
        maintenanceAmount: property.maintenanceAmount || property.maintenance?.amount || '',
        maintenancePeriod: property.maintenancePeriod || property.maintenance?.period || 'monthly',
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
        
        // Media - Use migrated media structure
        media: migratedMedia,
        
        // Legacy image deletion tracking
        legacyImagesToDelete: [],
        
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
        status: property.status || 'draft',
        
        // Additional Features - Security & Safety
        gatedCommunity: property.gatedCommunity || false,
        security: property.security || false,
        cctv: property.cctv || false,
        fireSafety: property.fireSafety || false,
        
        // Additional Features - Amenities
        lift: property.lift || false,
        park: property.park || false,
        gym: property.gym || false,
        pool: property.pool || false,
        parking: property.parking || false
      };
      
      setFormData(initialData);
      setHasChanges(false);
      setIsDirty({});
      setIsInitialized(true);
    }
  }, [property, isOpen, isInitialized]);

  // Handle section restoration separately
  useEffect(() => {
    if (property && isOpen) {
      // Restore the preserved section if it exists and is valid
      const visibleSections = showAdvanced ? sections : mainSections;
      if (preservedSection >= 0 && preservedSection < visibleSections.length) {
        setActiveSection(preservedSection);
      } else {
        setActiveSection(0); // Reset to first section if preserved section is invalid
      }
    }
  }, [preservedSection, showAdvanced, property, isOpen, sections, mainSections]);

  // Reset initialization when modal closes
  useEffect(() => {
    if (!isOpen) {
      setIsInitialized(false);
    }
  }, [isOpen]);

  if (!isOpen || !property) return null;

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setHasChanges(true);
    setIsDirty(prev => ({ ...prev, [field]: true }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Preserve current section before saving
      setPreservedSection(activeSection);
      
      // Prepare form data with proper file handling
      const saveData = new FormData();
      
      // Add all non-media form fields
      Object.keys(formData).forEach(key => {
        if (key !== 'media' && key !== 'legacyImagesToDelete') {
          const value = formData[key];
          if (value !== undefined && value !== null) {
            if (Array.isArray(value)) {
              saveData.append(key, JSON.stringify(value));
            } else {
              saveData.append(key, value.toString());
            }
          }
        }
      });
      
      // Handle legacy images to delete
      if (formData.legacyImagesToDelete && formData.legacyImagesToDelete.length > 0) {
        saveData.append('legacyImagesToDelete', JSON.stringify(formData.legacyImagesToDelete));
      }
      
      // Handle media files - separate files from metadata
      let mediaMetadata = {};
      if (formData.media) {
        mediaMetadata = { ...formData.media };
        
        // Process each media section
        Object.keys(mediaMetadata).forEach(sectionKey => {
          if (Array.isArray(mediaMetadata[sectionKey])) {
            const validMediaItems = [];
            
            mediaMetadata[sectionKey].forEach((mediaItem, index) => {
              // Skip deleted items
              if (mediaItem.isDeleted) return;
              
              // If there's a file, append it to FormData
              if (mediaItem.file) {
                const fieldName = sectionKey === 'photos' ? 'images' :
                                sectionKey === 'videos' ? 'video' :
                                sectionKey === 'floorplans' ? 'floorplans' :
                                'brochures';
                
                // For photos, we can have multiple files
                if (fieldName === 'images' || fieldName === 'floorplans') {
                  saveData.append(fieldName, mediaItem.file, mediaItem.fileName);
                } else {
                  // For single-file fields, only add if not already added
                  if (!saveData.has(fieldName)) {
                    saveData.append(fieldName, mediaItem.file, mediaItem.fileName);
                  }
                }
              }
              
              // Add to metadata (without the file object)
              const { file, ...metadataWithoutFile } = mediaItem;
              validMediaItems.push(metadataWithoutFile);
            });
            
            mediaMetadata[sectionKey] = validMediaItems;
          }
        });
      }
      
      // Add media metadata as JSON string
      saveData.append('media', JSON.stringify(mediaMetadata));
      
      console.log('Saving property with files and metadata');
      
      const updatedProperty = await onSave(property.id, saveData);
      
      // Update form data with the latest property information from backend
      if (updatedProperty) {
        // Migrate legacy images to new media structure if needed
        let migratedMedia = updatedProperty.media || {};
        
        // If no media structure exists but legacy images do, migrate them
        // Only migrate if no photos exist or all photos are non-legacy
        const shouldMigrateLegacy = (!migratedMedia.photos || migratedMedia.photos.length === 0) &&
                                    updatedProperty.images && updatedProperty.images.length > 0 &&
                                    (!migratedMedia.photos || !migratedMedia.photos.some(photo => photo.isLegacy));
        
        if (shouldMigrateLegacy) {
          console.log('Migrating legacy images to new media structure after update');
          
          // Get the list of images to delete from the filtered form data
          const imagesToDelete = formData.legacyImagesToDelete || [];
          const deletedLegacyIndexes = new Set(imagesToDelete);
          
          migratedMedia = {
            ...migratedMedia,
            photos: updatedProperty.images.map((imageData, index) => {
              // Skip deleted legacy images
              if (deletedLegacyIndexes.has(index)) {
                console.log(`Skipping deleted legacy image at index ${index} during post-update migration`);
                return null; // Skip deleted photos
              }
              
              // Handle different legacy image formats
              let imageUrl = '';
              let fileName = `image_${index + 1}.webp`;
              
              if (typeof imageData === 'string') {
                // Simple string path
                imageUrl = imageData;
                fileName = imageData.split('/').pop() || fileName;
              } else if (imageData && typeof imageData === 'object') {
                // Object with different sizes (thumbnail, medium, optimized)
                // Prefer optimized, then medium, then thumbnail
                imageUrl = imageData.optimized || imageData.medium || imageData.thumbnail || '';
                
                if (imageUrl) {
                  fileName = imageUrl.split('/').pop() || fileName;
                }
              }
              
              // Validate final image URL
              if (!imageUrl) {
                console.warn(`No valid image URL found at index ${index}:`, imageData);
                return {
                  id: `legacy_${index}`,
                  fileName: fileName,
                  fileType: 'image/webp',
                  fileSize: 0,
                  url: `${API_BASE_URL}/uploads/default-placeholder.webp`,
                  isCover: index === 0,
                  sortOrder: index,
                  uploadDate: updatedProperty.createdAt || new Date().toISOString(),
                  imageType: null,
                  isLegacy: true,
                  isError: true
                };
              }
              
              return {
                id: `legacy_${index}`,
                fileName: fileName,
                fileType: 'image/webp',
                fileSize: 0, // Size not available for legacy images
                url: imageUrl.startsWith('http') ? imageUrl : `${API_BASE_URL}${imageUrl}`,
                isCover: index === 0, // First image becomes cover
                sortOrder: index,
                uploadDate: updatedProperty.createdAt || new Date().toISOString(),
                imageType: null,
                isLegacy: true // Flag to identify migrated images
              };
            }).filter(photo => photo !== null) // Remove deleted photos
          };
          
          if (deletedLegacyIndexes.size > 0) {
            console.log(`Skipping ${deletedLegacyIndexes.size} deleted legacy photos:`, Array.from(deletedLegacyIndexes));
          }
        }
        
        const refreshedData = {
          // Basic Info - Fix field mappings
          listingType: updatedProperty.type || 'rent',
          propertyType: updatedProperty.propertyType || '',
          lookingFor: updatedProperty.lookingTo || updatedProperty.type || 'rent', // Map lookingTo to lookingFor
          propertyKind: updatedProperty.propertyKind || '', // Property kind mapping
          bhk: updatedProperty.bhk || '',
          title: updatedProperty.title || '',
          buildingName: updatedProperty.buildingName || '',
          propertyAge: updatedProperty.propertyAge || '',
          propertyOnFloor: updatedProperty.propertyOnFloor || '',
          totalFloors: updatedProperty.totalFloors || '',
          facing: updatedProperty.facing || '',
          
          // Location
          country: updatedProperty.country || 'India',
          state: updatedProperty.state || '',
          city: updatedProperty.city || '',
          locality: updatedProperty.locality || '',
          landmark: updatedProperty.landmark || '',
          pincode: updatedProperty.pincode || '',
          addressLine: updatedProperty.addressLine || '',
          latitude: updatedProperty.latitude || 19.0760,
          longitude: updatedProperty.longitude || 72.8777,
          hideExactLocation: updatedProperty.hideExactLocation || false,
          
          // Price - Fix maintenance charges mapping
          price: updatedProperty.price || '',
          maintenanceAmount: updatedProperty.maintenanceAmount || updatedProperty.maintenance?.amount || '',
          maintenancePeriod: updatedProperty.maintenancePeriod || updatedProperty.maintenance?.period || 'monthly',
          negotiable: updatedProperty.negotiable || false,
          availability: updatedProperty.availability || '',
          securityDeposit: updatedProperty.securityDeposit || '',
          preferredTenants: updatedProperty.preferredTenants || [],
          
          // Details
          builtUpArea: updatedProperty.area || '',
          carpetArea: updatedProperty.carpetArea || '',
          superBuiltUpArea: updatedProperty.superBuiltUpArea || '',
          bedrooms: updatedProperty.bedrooms || '',
          bathrooms: updatedProperty.bathrooms || '',
          balconies: updatedProperty.balconies || '',
          coveredParking: updatedProperty.coveredParking || '',
          openParking: updatedProperty.openParking || '',
          coveredBikeParking: updatedProperty.coveredBikeParking || '',
          openBikeParking: updatedProperty.openBikeParking || '',
          furnishing: updatedProperty.furnishing || 'unfurnished',
          flooring: updatedProperty.flooring || '',
          waterSupply: updatedProperty.waterSupply || '',
          powerBackup: updatedProperty.powerBackup || '',
          
          // Amenities
          amenities: updatedProperty.amenities || [],
          
          // Media - Use migrated media structure
          media: migratedMedia,
          
          // Legacy image deletion tracking
          legacyImagesToDelete: [],
          
          // Description
          description: updatedProperty.description || '',
          keyHighlights: updatedProperty.keyHighlights || [],
          
          // Contact
          ownerName: updatedProperty.ownerName || '',
          contactRole: updatedProperty.contactRole || 'owner',
          phoneNumber: updatedProperty.phoneNumber || '',
          alternatePhone: updatedProperty.alternatePhone || '',
          email: updatedProperty.email || '',
          whatsapp: updatedProperty.whatsapp || false,
          contactOnlyLoggedIn: updatedProperty.contactOnlyLoggedIn || false,
          
          // Advanced
          urlSlug: updatedProperty.urlSlug || '',
          metaTitle: updatedProperty.metaTitle || '',
          metaDescription: updatedProperty.metaDescription || '',
          
          // Status
          status: updatedProperty.status || 'draft',
          
          // Additional Features - Security & Safety
          gatedCommunity: updatedProperty.gatedCommunity || false,
          security: updatedProperty.security || false,
          cctv: updatedProperty.cctv || false,
          fireSafety: updatedProperty.fireSafety || false,
          
          // Additional Features - Amenities
          lift: updatedProperty.lift || false,
          park: updatedProperty.park || false,
          gym: updatedProperty.gym || false,
          pool: updatedProperty.pool || false,
          parking: updatedProperty.parking || false
        };
        
        setFormData(refreshedData);
      }
      
      // Don't show success toast here - it's handled by MyListingsPage.jsx to avoid duplicates
      setHasChanges(false);
      setIsDirty({});
      // Section will be restored by useEffect when property changes
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
    const visibleSections = getVisibleSections();
    const currentSection = visibleSections[activeSection];
    if (currentSection?.advanced) return true; // Advanced sections are optional
    
    switch (currentSection?.id) {
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
    const visibleSections = getVisibleSections();
    if (validateCurrentSection() && activeSection < visibleSections.length - 1) {
      const newSection = activeSection + 1;
      setActiveSection(newSection);
      setPreservedSection(newSection);
    }
  };

  const goToPreviousSection = () => {
    if (activeSection > 0) {
      const newSection = activeSection - 1;
      setActiveSection(newSection);
      setPreservedSection(newSection);
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
    <div className="fixed inset-0 bg-white z-50 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-white">
        <div className="flex items-center gap-4">
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Property</h1>
            <p className="text-sm text-gray-600">ID: #{property.id}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          {/* Advanced Toggle */}
          <button
            onClick={() => {
              const newShowAdvanced = !showAdvanced;
              setShowAdvanced(newShowAdvanced);
              
              // Ensure activeSection is valid for the new visibility mode
              const visibleSections = newShowAdvanced ? sections : mainSections;
              if (activeSection >= visibleSections.length) {
                const newActiveSection = Math.max(0, visibleSections.length - 1);
                setActiveSection(newActiveSection);
                setPreservedSection(newActiveSection);
              }
            }}
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
            <div className="text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-green-500 transition-all duration-300"
                    style={{ width: `${calculateCompleteness()}%` }}
                  />
                </div>
                <span className="text-sm font-medium text-gray-900 min-w-[3rem]">
                  {calculateCompleteness()}%
                </span>
              </div>
            </div>
          </div>
          
          {hasChanges && (
            <span className="text-sm text-amber-600 font-medium">
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
      <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-900">
            Section {activeSection + 1} of {totalSections}
          </span>
          <span className="text-sm text-gray-600">
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
                  : 'bg-gray-200'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex min-h-0">
        {/* Sidebar Navigation */}
        <div className="w-80 bg-gray-50 border-r border-gray-200 overflow-y-auto">
          <div className="p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
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
                    onClick={() => {
                      setActiveSection(index);
                      setPreservedSection(index);
                    }}
                    className={`w-full text-left p-3 rounded-lg transition-colors ${
                      isActive
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                          isActive
                            ? 'bg-white text-blue-600'
                            : isCompleted
                            ? 'bg-green-500 text-white'
                            : 'bg-gray-200 text-gray-600'
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
            <div className="p-4 border-t border-gray-200">
              <PropertyQuickActions
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
                onPreviewListing={() => onPreviewListing?.(property)}
                onSaveDraft={() => {
                  handleInputChange('status', 'draft');
                  toast.success('Draft saved');
                }}
                onRefreshData={() => {
                  window.location.reload();
                }}
                onChangeStatus={(newStatus) => {
                  console.log('Status change requested:', newStatus);
                  handleInputChange('status', newStatus);
                  onChangeStatus?.(property, newStatus);
                  toast.success(`Property status changed to ${newStatus}`);
                }}
                onDeleteProperty={() => {
                  if (confirm('Are you sure you want to delete this property? This action cannot be undone.')) {
                    toast.success('Property deleted successfully');
                    onClose();
                  }
                }}
                isSaving={isSaving}
                hasUnsavedChanges={hasChanges}
                currentStatus={formData.status}
              />
            </div>
          )}
        </div>

        {/* Main Content Area */}
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-4xl mx-auto p-6">
            {/* Validation Warning */}
            {!validateCurrentSection() && !currentSection?.advanced && (
              <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-3">
                <AlertCircle className="text-amber-600 mt-0.5" size={20} />
                <div>
                  <h4 className="font-semibold text-amber-800">
                    Incomplete Section
                  </h4>
                  <p className="text-sm text-amber-700">
                    Please fill in the required fields before proceeding to the next section.
                  </p>
                </div>
              </div>
            )}

            {/* Current Section Component */}
            <div className="bg-white rounded-lg">
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
      <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-white">
        <div className="flex items-center gap-4">
          <button
            onClick={goToPreviousSection}
            disabled={activeSection === 0}
            className="flex items-center gap-2 px-4 py-2 text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed hover:text-gray-900 transition-colors"
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
                  : 'bg-gray-300'
              }`}
            />
          ))}
        </div>

        <div className="flex items-center gap-4">
          <div className="text-sm text-gray-600">
            {!currentSection?.advanced && validateCurrentSection() ? (
              <span className="flex items-center gap-1 text-green-600">
                <CheckCircle size={14} />
                Ready to continue
              </span>
            ) : !currentSection?.advanced ? (
              <span className="flex items-center gap-1 text-amber-600">
                <AlertCircle size={14} />
                Complete required fields
              </span>
            ) : (
              <span className="text-gray-500">Optional section</span>
            )}
          </div>
          
          <button
            onClick={goToNextSection}
            disabled={activeSection === getVisibleSections().length - 1 || (!currentSection?.advanced && !validateCurrentSection())}
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
