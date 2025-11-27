 // src/PostPropertyWizard.jsx
import React, { useState, useEffect, useRef, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  X, ArrowLeft, User, Building, Phone, MapPin, LocateFixed, Upload, 
  BedDouble, Bath, Plus, Minus, Home, Aperture, Star, CheckSquare, Trash2,
  Text, DollarSign, Ruler, ImageIcon, Video, Loader2
} from 'lucide-react';
import { AppContext } from '../context/context.js'; // 1. Import AppContext

// --------------------------------------------------
// --- MAIN WIZARD COMPONENT ---
// --------------------------------------------------
export default function PostPropertyWizard({ onClose, onAddProperty, onEditProperty, existingProperty }) {
  
  const isEditing = !!existingProperty;
  const contentRef = useRef(null);
  const { currentUser, API_BASE_URL } = useContext(AppContext); // 2. Get currentUser and API_BASE_URL
  const navigate = useNavigate();
  const [isDetecting, setIsDetecting] = useState(false);

  const [currentStep, setCurrentStep] = useState(1);
  // Helper to combine old single 'image' with new 'images' array
  const getInitialImages = () => {
    if (!existingProperty) return [];
    const allImages = [
      ...(existingProperty.images || []), // New images array
      ...(existingProperty.image ? [existingProperty.image] : []) // Old single image
    ];
    // Add full base URL for preview
    return allImages.filter(Boolean).map(img => {
      if (!img) return null;
      if (typeof img === 'string') {
        const clean = img.replace(/\\/g, '/');
        return clean.startsWith('http') ? clean : (clean.startsWith('/') ? `${API_BASE_URL}${clean}` : `${API_BASE_URL}/${clean}`);
      }
      // object form
      const thumb = img.thumbnail || img.medium || img.optimized;
      if (!thumb) return null;
      const clean = thumb.replace(/\\/g, '/');
      return clean.startsWith('http') ? clean : (clean.startsWith('/') ? `${API_BASE_URL}${clean}` : `${API_BASE_URL}/${clean}`);
    }).filter(Boolean);
  };
  
  const [formData, setFormData] = useState({
    // Step 1
    userType: existingProperty?.userType || 'Owner',
    phoneNumber: existingProperty?.phoneNumber || currentUser?.phone || '', // 3. Pre-fill phone
    // Step 2
    lookingTo: existingProperty?.lookingTo || 'Sell',
    propertyKind: existingProperty?.propertyKind || 'Residential',
    propertyType: existingProperty?.propertyType || 'Apartment',
    // Step 3
    city: existingProperty?.city || 'Nellore',
    location: existingProperty?.location || '',
    bedrooms: existingProperty?.bhk || 1,
    bathrooms: existingProperty?.bathrooms || 1,
    balconies: existingProperty?.balconies || 0,
    plotArea: existingProperty?.plotArea || '',
    carpetArea: existingProperty?.area || '',
    furnishing: existingProperty?.furnishing || 'Unfurnished',
    coveredParking: existingProperty?.coveredParking || 0,
    openParking: existingProperty?.openParking || 0,
    totalFloors: existingProperty?.totalFloors || 1,
    availability: existingProperty?.availability || 'Ready to move',
    propertyAge: existingProperty?.propertyAge || '1-5 years',
    // Step 4 (new)
    keyHighlights: existingProperty?.keyHighlights || [],
    amenities: existingProperty?.amenities || [],
    facing: existingProperty?.facing || 'North',
    propertyOnFloor: existingProperty?.propertyOnFloor || '',
    reraId: existingProperty?.reraId || '',
    priceIncludes: existingProperty?.priceIncludes || [],
    gatedCommunity: existingProperty?.gatedCommunity || false,
    maintenanceAmount: existingProperty?.maintenance?.amount || '',
    maintenancePeriod: existingProperty?.maintenance?.period || 'Monthly',
    nearbyLandmarks: existingProperty?.nearbyLandmarks || [],
    // Step 5
    ownership: existingProperty?.ownership || 'Freehold',
    expectedPrice: existingProperty?.priceValue || '',
    allInclusive: existingProperty?.allInclusive || false,
    priceNegotiable: existingProperty?.priceNegotiable || true,
    taxExcluded: existingProperty?.taxExcluded || false,
    brokerage: existingProperty?.brokerage || 'None',
    description: existingProperty?.description || '',
    // 4. Update image/video previews
    imagePreviews: getInitialImages(), 
    videoPreview: existingProperty?.video ? `${API_BASE_URL}/${existingProperty.video}` : null,
  });
  
  // 5. State for multiple new image files and one new video file
  const [imageFiles, setImageFiles] = useState([]);
  const [videoFile, setVideoFile] = useState(null);

  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.scrollTo(0, 0);
    }
  }, [currentStep]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };
  
  // 6. Handle multiple file changes
  const handleFileChange = (e) => {
    const newFiles = Array.from(e.target.files);
    const newFilePreviews = newFiles.map(file => URL.createObjectURL(file));

    // Enforce max 20 images
    const totalFiles = [...imageFiles, ...newFiles].slice(0, 20);
    const totalPreviews = [...formData.imagePreviews, ...newFilePreviews].slice(0, 20);

    setImageFiles(totalFiles);
    setFormData(prev => ({
      ...prev,
      imagePreviews: totalPreviews
    }));
  };
  
  // 7. Handle video file change
  const handleVideoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setVideoFile(file);
      setFormData(prev => ({
        ...prev,
        videoPreview: URL.createObjectURL(file)
      }));
    }
  };
  
  // 8. Handle deleting an image (works for new blobs and old URLs)
  const handleDeleteImage = (indexToDelete) => {
    const previewToDelete = formData.imagePreviews[indexToDelete];
    
    // Filter out the deleted preview
    setFormData(prev => ({
      ...prev,
      imagePreviews: prev.imagePreviews.filter((_, i) => i !== indexToDelete)
    }));

    // If it was a new file (blob), remove it from imageFiles state
    if (previewToDelete.startsWith('blob:')) {
      // This is tricky, we need to find the matching file
      // For simplicity, let's find the file by its preview URL
      // Let's find the index *within* the blob URLs
      let blobIndex = -1;
      for (let i = 0; i <= indexToDelete; i++) {
        if (formData.imagePreviews[i].startsWith('blob:')) {
          blobIndex++;
        }
      }
      
      if (blobIndex !== -1) {
         setImageFiles(prev => prev.filter((_, i) => i !== blobIndex));
      }
    }
  };
  
  // 9. Handle deleting video
  const handleDeleteVideo = () => {
    setVideoFile(null);
    setFormData(prev => ({ ...prev, videoPreview: null }));
  };

  const handleChipChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCounterChange = (name, delta) => {
    setFormData(prev => ({
      ...prev,
      [name]: Math.max(0, (prev[name] || 0) + delta)
    }));
  };
  
  // 10. Handle "Detect my location"
  const handleDetectLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }
    
    setIsDetecting(true);
    
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          // Use OpenStreetMap (Nominatim) for reverse geocoding (free, no API key)
          const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`);
          if (!response.ok) throw new Error('Failed to fetch location data');
          
          const data = await response.json();
          const address = data.address;
          
          setFormData(prev => ({
            ...prev,
            city: address.city || address.town || 'Nellore',
            location: address.suburb || address.road || address.neighbourhood || 'Unknown Location'
          }));
        } catch (error) {
          console.error("Reverse geocoding failed:", error);
          alert("Could not detect your location details.");
        }
        setIsDetecting(false);
      },
      (error) => {
        console.error("Geolocation failed:", error);
        alert("Unable to retrieve your location. Please enable location services.");
        setIsDetecting(false);
      }
    );
  };

  const handleNext = () => setCurrentStep(prev => prev + 1);
  const handleBack = () => setCurrentStep(prev => prev - 1);

  // 11. Handle final submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    const formDataToSubmit = new FormData();
    
    // --- 1. Manually map form state to the *exact* backend model fields ---
    const priceNum = Number(formData.expectedPrice);
    let priceFormatted = `₹${new Intl.NumberFormat('en-IN').format(priceNum)}`;
    if (priceNum >= 10000000) {
      priceFormatted = `₹${(priceNum / 10000000).toFixed(2)} Cr`;
    } else if (priceNum >= 100000) {
      priceFormatted = `₹${(priceNum / 100000).toFixed(2)} Lakh`;
    }

    formDataToSubmit.append('type', `${formData.bedrooms} BHK`);
    formDataToSubmit.append('bhk', formData.bedrooms);
    formDataToSubmit.append('area', formData.carpetArea || formData.plotArea || '1500 sqft');
    formDataToSubmit.append('price', priceFormatted);
    formDataToSubmit.append('priceValue', priceNum);
    formDataToSubmit.append('location', `${formData.location || 'Location'}, ${formData.city || 'Nellore'}`);
    formDataToSubmit.append('status', formData.lookingTo === 'Sell' ? 'For Sale' : 'For Rent');
    
    // --- 2. Add all other fields from the form state ---
    formDataToSubmit.append('userType', formData.userType);
    formDataToSubmit.append('phoneNumber', formData.phoneNumber);
    formDataToSubmit.append('lookingTo', formData.lookingTo);
    formDataToSubmit.append('propertyKind', formData.propertyKind);
    formDataToSubmit.append('propertyType', formData.propertyType);
    formDataToSubmit.append('city', formData.city);
    formDataToSubmit.append('bathrooms', formData.bathrooms);
    formDataToSubmit.append('balconies', formData.balconies);
    formDataToSubmit.append('plotArea', formData.plotArea);
    formDataToSubmit.append('carpetArea', formData.carpetArea);
    formDataToSubmit.append('furnishing', formData.furnishing);
    formDataToSubmit.append('coveredParking', formData.coveredParking);
    formDataToSubmit.append('openParking', formData.openParking);
    formDataToSubmit.append('totalFloors', formData.totalFloors);
    formDataToSubmit.append('availability', formData.availability);
    formDataToSubmit.append('propertyAge', formData.propertyAge);
    formDataToSubmit.append('ownership', formData.ownership);
    formDataToSubmit.append('expectedPrice', formData.expectedPrice);
    formDataToSubmit.append('allInclusive', formData.allInclusive);
    formDataToSubmit.append('priceNegotiable', formData.priceNegotiable);
    formDataToSubmit.append('taxExcluded', formData.taxExcluded);
    formDataToSubmit.append('brokerage', formData.brokerage);
    formDataToSubmit.append('description', formData.description);

    // --- NEW: Append structured data ---
    formDataToSubmit.append('keyHighlights', JSON.stringify(formData.keyHighlights));
    formDataToSubmit.append('amenities', JSON.stringify(formData.amenities));
    formDataToSubmit.append('priceIncludes', JSON.stringify(formData.priceIncludes));
    formDataToSubmit.append('nearbyLandmarks', JSON.stringify(formData.nearbyLandmarks));
    
    formDataToSubmit.append('facing', formData.facing);
    formDataToSubmit.append('propertyOnFloor', formData.propertyOnFloor);
    formDataToSubmit.append('reraId', formData.reraId);
    formDataToSubmit.append('gatedCommunity', formData.gatedCommunity);
    
    const maintenance = {
      amount: formData.maintenanceAmount,
      period: formData.maintenancePeriod
    };
    formDataToSubmit.append('maintenance', JSON.stringify(maintenance));

    // --- 3. Handle NEWLY ADDED media ---
    for (const file of imageFiles) {
      formDataToSubmit.append('images', file);
    }
    if (videoFile) {
      formDataToSubmit.append('video', videoFile);
    }

    // --- 4. Handle EXISTING media (for edits) ---
    if (isEditing) {
      // Find all previews that are *strings* (not blobs) and extract the path
      const keptImages = formData.imagePreviews
        .filter(p => typeof p === 'string' && p.startsWith(API_BASE_URL))
        .map(url => url.replace(`${API_BASE_URL}/`, '')); // Send only the path
        
      formDataToSubmit.append('keptImages', JSON.stringify(keptImages));
      
      if (typeof formData.videoPreview === 'string' && formData.videoPreview.startsWith(API_BASE_URL)) {
        const keptVideo = formData.videoPreview.replace(`${API_BASE_URL}/`, '');
        formDataToSubmit.append('keptVideo', keptVideo);
      }
    }

    if (isEditing) {
      onEditProperty(existingProperty.id, formDataToSubmit);
    } else {
      onAddProperty(formDataToSubmit);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
      <div className="bg-gray-100 dark:bg-gray-900 w-full max-w-lg h-full max-h-[calc(100vh-2rem)] rounded-2xl shadow-xl flex flex-col overflow-y-auto">
        
        {/* Header */}
        <header className="flex items-center p-4 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
          {currentStep > 1 ? (
            <button onClick={handleBack} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
              <ArrowLeft size={20} />
            </button>
          ) : <div className="w-8"></div>}
          
          <div className="flex-1 text-center">
            <h2 className="font-bold text-lg text-gray-800 dark:text-gray-100">
              {isEditing ? 'Edit Your Property' : 'Post Your Property'}
            </h2>
            <span className="text-sm text-gray-500">Step {currentStep} of 5</span>
          </div>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
            <X size={20} />
          </button>
        </header>

        {/* Wizard Body */}
        <div ref={contentRef} className="flex-1 overflow-y-auto p-6 space-y-6">
          {currentStep === 1 && (
            <Step1_RoleContact 
              formData={formData} 
              handleChipChange={handleChipChange} 
              handleChange={handleChange}
              currentUser={currentUser} // 12. Pass currentUser down
              navigate={navigate}
            />
          )}
          {currentStep === 2 && <Step2_BasicDetails formData={formData} handleChipChange={handleChipChange} />}
          {currentStep === 3 && (
            <Step3_PropertyDetails 
              formData={formData} 
              handleChipChange={handleChipChange} 
              handleChange={handleChange} 
              handleCounterChange={handleCounterChange}
              onDetectLocation={handleDetectLocation} // 13. Pass handler down
              isDetecting={isDetecting} // 14. Pass loading state
            />
          )}
          {currentStep === 4 && (
            <Step4_AdditionalDetails
              formData={formData}
              handleChange={handleChange}
              setFormData={setFormData}
            />
          )}
          {currentStep === 5 && (
            <Step5_PhotosPricing 
              formData={formData} 
              handleChipChange={handleChipChange} 
              handleChange={handleChange}
              handleFileChange={handleFileChange}
              handleVideoChange={handleVideoChange} // 15. Pass handlers down
              handleDeleteImage={handleDeleteImage}
              handleDeleteVideo={handleDeleteVideo}
            />
          )}
        </div>

        {/* Footer */}
        <footer className="p-4 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 flex-shrink-0">
          {currentStep < 5 ? (
            <button
              onClick={handleNext}
              className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Next
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              {isEditing ? 'Update Property' : 'Submit Property'}
            </button>
          )}
        </footer>
      </div>
    </div>
  );
}

// --------------------------------------------------
// --- ALL REUSABLE SUB-COMPONENTS ARE BELOW ---
// --------------------------------------------------

// --------------------------------------------------
// --- ALL REUSABLE SUB-COMPONENTS ARE BELOW ---
// --------------------------------------------------

// NEW: TagInput component
function TagInput({ label, name, tags, setTags }) {
  const [inputValue, setInputValue] = useState('');

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && inputValue.trim()) {
      e.preventDefault();
      setTags([...tags, inputValue.trim()]);
      setInputValue('');
    }
  };

  const removeTag = (indexToRemove) => {
    setTags(tags.filter((_, index) => index !== indexToRemove));
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{label}</label>
      <div className="flex flex-wrap items-center w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800">
        {tags.map((tag, index) => (
          <div key={index} className="flex items-center bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full px-3 py-1 text-sm font-medium mr-2 mb-1">
            <span>{tag}</span>
            <button
              type="button"
              onClick={() => removeTag(index)}
              className="ml-2 text-blue-600 hover:text-blue-800"
            >
              <X size={14} />
            </button>
          </div>
        ))}
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type and press Enter"
          className="flex-grow bg-transparent focus:outline-none"
        />
      </div>
    </div>
  );
}

// NEW: CheckboxGrid component
function CheckboxGrid({ label, name, options, selectedOptions, setSelectedOptions }) {
  const handleToggle = (option) => {
    const isSelected = selectedOptions.includes(option);
    if (isSelected) {
      setSelectedOptions(selectedOptions.filter(item => item !== option));
    } else {
      setSelectedOptions([...selectedOptions, option]);
    }
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{label}</label>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
        {options.map((option) => (
          <label
            key={option}
            className={`flex items-center space-x-2 p-2 border rounded-lg cursor-pointer ${
              selectedOptions.includes(option)
                ? 'bg-blue-50 border-blue-500 dark:bg-blue-900 dark:border-blue-500'
                : 'bg-white border-gray-300 dark:bg-gray-800 dark:border-gray-600'
            }`}
          >
            <input
              type="checkbox"
              checked={selectedOptions.includes(option)}
              onChange={() => handleToggle(option)}
              className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
            />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{option}</span>
          </label>
        ))}
      </div>
    </div>
  );
}

// NEW: FormSwitch component
function FormSwitch({ label, name, checked, onChange }) {
  return (
    <div className="flex items-center justify-between">
      <label className="font-medium text-gray-700 dark:text-gray-300">{label}</label>
      <button
        type="button"
        onClick={() => onChange({ target: { name, value: !checked, type: 'checkbox', checked: !checked } })}
        className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors ${
          checked ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'
        }`}
      >
        <span
          className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${
            checked ? 'translate-x-6' : 'translate-x-1'
          }`}
        />
      </button>
    </div>
  );
}


function FormInput({ label, id, ...props }) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{label}</label>
      <input
        id={id}
        {...props}
        className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800"
      />
    </div>
  );
}

// ... (keep FormSection, ChoiceChip, CounterInput)
function FormSection({ title, children }) {
  return (
    <div className="space-y-4">
      <h3 className="font-bold text-lg text-gray-800 dark:text-gray-100">{title}</h3>
      {children}
    </div>
  );
}

function ChoiceChip({ label, name, value, selected, onChange, icon: Icon }) {
  const isSelected = selected === value;
  return (
    <button
      type="button"
      onClick={() => onChange(name, value)}
      className={`flex-1 py-3 px-4 border rounded-lg text-center font-medium transition-all ${
        isSelected
          ? 'bg-blue-50 border-blue-500 text-blue-700 dark:bg-blue-900 dark:border-blue-500 dark:text-blue-300'
          : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700'
      }`}
    >
      <div className="flex items-center justify-center space-x-2">
        {Icon && <Icon size={18} />}
        <span>{label}</span>
      </div>
    </button>
  );
}

function CounterInput({ label, name, value, onCounterChange }) {
  return (
    <div className="flex items-center justify-between">
      <label className="font-medium text-gray-700 dark:text-gray-300">{label}</label>
      <div className="flex items-center space-x-3">
        <button
          type="button"
          onClick={() => onCounterChange(name, -1)}
          className="bg-gray-200 dark:bg-gray-700 p-1 rounded-full w-8 h-8 flex items-center justify-center"
          disabled={value <= 0}
        >
          <Minus size={16} />
        </button>
        <span className="text-lg font-bold w-6 text-center">{value}</span>
        <button
          type="button"
          onClick={() => onCounterChange(name, 1)}
          className="bg-gray-200 dark:bg-gray-700 p-1 rounded-full w-8 h-8 flex items-center justify-center"
        >
          <Plus size={16} />
        </button>
      </div>
    </div>
  );
}


// ... (keep Step1, Step2, Step3)
function Step1_RoleContact({ formData, handleChipChange, handleChange, currentUser, navigate }) { // 1. Receive currentUser
  return (
    <div className="space-y-6">
      <div className="flex items-center bg-blue-50 dark:bg-blue-900 border-l-4 border-blue-500 p-3 rounded-lg">
        <Star size={20} className="text-blue-500 mr-3 flex-shrink-0" />
        <p className="text-sm text-blue-800 dark:text-blue-200">
          Post property for free and get verified buyers and personalized assistance.
        </p>
      </div>
      
      <div className="flex space-x-4">
        <ChoiceChip label="Owner" name="userType" value="Owner" selected={formData.userType} onChange={handleChipChange} icon={User} />
        <ChoiceChip label="Broker/Builder" name="userType" value="Broker" selected={formData.userType} onChange={handleChipChange} icon={Building} />
      </div>
      
      <div>
        <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Enter Phone Number</label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3">
            <span className="text-gray-500 dark:text-gray-400">+91</span>
          </div>
          <input
            type="tel"
            id="phoneNumber"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleChange}
            placeholder="Enter Phone Number"
            className="w-full pl-12 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800"
          />
          <div className="absolute inset-y-0 right-0 flex items-center pr-3">
            <Phone size={18} className="text-gray-400" />
          </div>
        </div>
      </div>
       <button className="w-full py-3 bg-cyan-500 text-black font-bold rounded-lg flex items-center justify-center space-x-2 hover:bg-cyan-600">
        <Phone size={18} />
        <span>One Tap Login with Truecaller</span>
      </button>
      
      {/* 2. Conditionally render the "Login" link */}
      {!currentUser && (
        <p className="text-center text-sm text-gray-500">
          Existing user? <a href="#" onClick={() => navigate('/login')} className="font-medium text-blue-600">Login Here</a>
        </p>
      )}
    </div>
  );
}

function Step2_BasicDetails({ formData, handleChipChange }) {
  const propertyTypes = {
    Residential: ['Apartment', 'Independent House / Villa', 'Independent / Builder Floor', '1 RK/ Studio Apartment', 'Serviced Apartment', 'Farmhouse', 'Other'],
    Commercial: ['Office Space', 'Co-Working', 'Shop', 'Showroom', 'Godown / Warehouse', 'Industrial Shed', 'Other'],
    Plots: ['Residential Plot', 'Commercial Plot', 'Agricultural Land', 'Industrial Plot', 'Institutional Plot'],
    PG: ['PG for Men', 'PG for Women', 'PG for All', 'Hostel', 'Coliving'],
    Projects: ['Upcoming Project', 'Under Construction', 'Ready to Move', 'New Launch']
  };

  return (
    <div className="space-y-6">
      <FormSection title="You're looking to?">
        <div className="flex space-x-3">
          <ChoiceChip label="Sell" name="lookingTo" value="Sell" selected={formData.lookingTo} onChange={handleChipChange} />
          <ChoiceChip label="Rent / Lease" name="lookingTo" value="Rent" selected={formData.lookingTo} onChange={handleChipChange} />
        </div>
      </FormSection>
      
      <FormSection title="What kind of property?">
        <div className="grid grid-cols-2 gap-3">
          <ChoiceChip label="Residential" name="propertyKind" value="Residential" selected={formData.propertyKind} onChange={handleChipChange} icon={Home} />
          <ChoiceChip label="Commercial" name="propertyKind" value="Commercial" selected={formData.propertyKind} onChange={handleChipChange} icon={Building} />
          <ChoiceChip label="Plots" name="propertyKind" value="Plots" selected={formData.propertyKind} onChange={handleChipChange} icon={Aperture} />
          <ChoiceChip label="PG" name="propertyKind" value="PG" selected={formData.propertyKind} onChange={handleChipChange} icon={BedDouble} />
          <ChoiceChip label="Projects" name="propertyKind" value="Projects" selected={formData.propertyKind} onChange={handleChipChange} icon={Building} />
        </div>
      </FormSection>
      
      <FormSection title="Select Property Type">
        <div className="flex flex-wrap gap-3">
          {propertyTypes[formData.propertyKind].map(type => (
            <button
              key={type}
              type="button"
              onClick={() => handleChipChange('propertyType', type)}
              className={`py-2 px-4 border rounded-full text-sm font-medium transition-all ${
                formData.propertyType === type
                  ? 'bg-blue-50 border-blue-500 text-blue-700 dark:bg-blue-900 dark:border-blue-500 dark:text-blue-300'
                  : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </FormSection>
    </div>
  );
}

function Step3_PropertyDetails({ formData, handleChipChange, handleChange, handleCounterChange, onDetectLocation, isDetecting }) { // 1. Receive handlers
  return (
    <div className="space-y-6">
      <FormSection title="Where is your property located?">
        <div className="space-y-4">
          <FormInput label="City" id="city" name="city" value={formData.city} onChange={handleChange} />
          <FormInput label="Location" id="location" name="location" value={formData.location} onChange={handleChange} placeholder="e.g., Magunta Layout" />
          
          {/* 2. Wire up the button */}
          <button 
            type="button"
            onClick={onDetectLocation}
            disabled={isDetecting}
            className="flex items-center space-x-2 text-blue-600 font-medium disabled:opacity-50"
          >
            {isDetecting ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              <LocateFixed size={18} />
            )}
            <span>{isDetecting ? 'Detecting...' : 'Detect my location'}</span>
          </button>
        </div>
      </FormSection>
      <FormSection title="Add Room Details">
        <div className="space-y-4 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-inner">
          <CounterInput label="No. of Bedrooms" name="bedrooms" value={formData.bedrooms} onCounterChange={handleCounterChange} />
          <CounterInput label="No. of Bathrooms" name="bathrooms" value={formData.bathrooms} onCounterChange={handleCounterChange} />
          <CounterInput label="Balconies" name="balconies" value={formData.balconies} onCounterChange={handleCounterChange} />
        </div>
      </FormSection>
      <FormSection title="Add Area Details">
        <p className="text-sm text-gray-500 -mt-2 mb-2">At least one area type is mandatory.</p>
        <FormInput label="Plot Area" id="plotArea" name="plotArea" value={formData.plotArea} onChange={handleChange} placeholder="sq.ft." />
        <FormInput label="Carpet Area (main)" id="carpetArea" name="carpetArea" value={formData.carpetArea} onChange={handleChange} placeholder="sq.ft." />
      </FormSection>
      <FormSection title="Furnishing">
        <div className="flex space-x-3">
          <ChoiceChip label="Unfurnished" name="furnishing" value="Unfurnished" selected={formData.furnishing} onChange={handleChipChange} />
          <ChoiceChip label="Semi-Furnished" name="furnishing" value="Semi-Furnished" selected={formData.furnishing} onChange={handleChipChange} />
          <ChoiceChip label="Furnished" name="furnishing" value="Furnished" selected={formData.furnishing} onChange={handleChipChange} />
        </div>
      </FormSection>
      <FormSection title="Reserved Parking (Optional)">
        <div className="space-y-4 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-inner">
          <CounterInput label="Covered Parking" name="coveredParking" value={formData.coveredParking} onCounterChange={handleCounterChange} />
          <CounterInput label="Open Parking" name="openParking" value={formData.openParking} onCounterChange={handleCounterChange} />
        </div>
      </FormSection>
      <FormSection title="Floor Details">
        <FormInput label="Total Floors" id="totalFloors" name="totalFloors" value={formData.totalFloors} onChange={handleChange} type="number" />
      </FormSection>
      <FormSection title="Availability Status">
        <div className="flex space-x-3">
          <ChoiceChip label="Ready to move" name="availability" value="Ready to move" selected={formData.availability} onChange={handleChipChange} />
          <ChoiceChip label="Under construction" name="availability" value="Under construction" selected={formData.availability} onChange={handleChipChange} />
        </div>
      </FormSection>
      <FormSection title="Age of property">
        <div className="flex flex-wrap gap-3">
          {['0-1 years', '1-5 years', '5-10 years', '10+ years'].map(age => (
            <button
              key={age}
              type="button"
              onClick={() => handleChipChange('propertyAge', age)}
              className={`py-2 px-4 border rounded-full text-sm font-medium transition-all ${
                formData.propertyAge === age
                  ? 'bg-blue-50 border-blue-500 text-blue-700 dark:bg-blue-900 dark:border-blue-500 dark:text-blue-300'
                  : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700'
              }`}
            >
              {age}
            </button>
          ))}
        </div>
      </FormSection>
    </div>
  );
}

// NEW: Step4_AdditionalDetails component
function Step4_AdditionalDetails({ formData, handleChange, setFormData }) {
  const commonAmenities = [
    'Lift', 'Power Backup', 'Gym', 'Swimming Pool', 'Clubhouse', 'Park',
    'Security', 'Visitor Parking', 'Piped Gas', 'Rainwater Harvesting', 'Vaastu Compliant'
  ];
  const priceInclusions = [
    'Club Membership', 'Car Parking', 'PLC', 'EDC/IDC', 'GST'
  ];
  const facingOptions = [
    'North', 'South', 'East', 'West', 'North-East', 'North-West', 'South-East', 'South-West'
  ];

  return (
    <div className="space-y-6">
      <FormSection title="Key Highlights">
        <TagInput
          label="Add highlights (e.g., 'Near metro', 'Corner plot')"
          tags={formData.keyHighlights}
          setTags={(newTags) => setFormData(prev => ({ ...prev, keyHighlights: newTags }))}
        />
      </FormSection>
      
      <FormSection title="Amenities">
        <CheckboxGrid
          label="Select available amenities"
          options={commonAmenities}
          selectedOptions={formData.amenities}
          setSelectedOptions={(newAmenities) => setFormData(prev => ({ ...prev, amenities: newAmenities }))}
        />
      </FormSection>

      <FormSection title="Additional Information">
        <div className="space-y-4">
          <FormSwitch
            label="Gated Community"
            name="gatedCommunity"
            checked={formData.gatedCommunity}
            onChange={handleChange}
          />
          <FormInput
            label="Property on Floor"
            id="propertyOnFloor"
            name="propertyOnFloor"
            value={formData.propertyOnFloor}
            onChange={handleChange}
            placeholder="e.g., 5"
          />
          <div>
            <label htmlFor="facing" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Facing Direction</label>
            <select
              id="facing"
              name="facing"
              value={formData.facing}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800"
            >
              {facingOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
            </select>
          </div>
          <FormInput
            label="RERA ID (Optional)"
            id="reraId"
            name="reraId"
            value={formData.reraId}
            onChange={handleChange}
            placeholder="e.g., P-123456"
          />
        </div>
      </FormSection>

      <FormSection title="Maintenance Details">
        <div className="flex space-x-2">
          <FormInput
            label="Maintenance Amount (₹)"
            id="maintenanceAmount"
            name="maintenanceAmount"
            type="number"
            value={formData.maintenanceAmount}
            onChange={handleChange}
            placeholder="e.g., 2000"
          />
          <div className="flex-1">
            <label htmlFor="maintenancePeriod" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Period</label>
            <select
              id="maintenancePeriod"
              name="maintenancePeriod"
              value={formData.maintenancePeriod}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800"
            >
              <option value="Monthly">Monthly</option>
              <option value="Yearly">Yearly</option>
              <option value="One-Time">One-Time</option>
            </select>
          </div>
        </div>
      </FormSection>

       <FormSection title="Price Includes">
        <CheckboxGrid
          label="Select what's included in the price"
          options={priceInclusions}
          selectedOptions={formData.priceIncludes}
          setSelectedOptions={(newInclusions) => setFormData(prev => ({ ...prev, priceIncludes: newInclusions }))}
        />
      </FormSection>

      <FormSection title="Nearby Landmarks">
        <TagInput
          label="Add landmarks (e.g., 'City Hospital', 'Central Park')"
          tags={formData.nearbyLandmarks}
          setTags={(newLandmarks) => setFormData(prev => ({ ...prev, nearbyLandmarks: newLandmarks }))}
        />
      </FormSection>
    </div>
  );
}


function Step5_PhotosPricing({ formData, handleChipChange, handleChange, handleFileChange, handleVideoChange, handleDeleteImage, handleDeleteVideo, onImageZoom }) {
  return (
    <div className="space-y-6">
      <FormSection title="Add property photos">
        <div className="space-y-4">
          <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center">
            <Upload size={40} className="mx-auto text-gray-400" />
            <label htmlFor="photoUpload" className="font-medium text-blue-600 cursor-pointer hover:underline">
              {formData.imagePreviews.length > 0 ? "Add More Photos" : "Upload Photos"}
              <input 
                id="photoUpload" 
                type="file" 
                accept="image/png, image/jpeg, image/jpg" 
                className="hidden"
                onChange={handleFileChange}
                multiple // 1. Allow multiple files
              />
            </label>
            <p className="text-sm text-gray-500">Click to upload (max 20 photos)</p>
          </div>
          
          {/* 2. Show a grid of all preview images */}
          {formData.imagePreviews.length > 0 && (
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
              {formData.imagePreviews.map((previewUrl, index) => (
                <div key={index} className="relative aspect-square">
                  <img 
                    src={previewUrl} // URL is already full path or blob
                    alt="Property preview" 
                    className="w-full h-full object-contain rounded-lg bg-gray-100"
                  />
                  <button
                    type="button"
                    onClick={() => handleDeleteImage(index)}
                    className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full p-1 shadow-md"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </FormSection>
      
      {/* 3. Add Video Upload Section */}
      <FormSection title="Add property video (Optional)">
        <div className="space-y-4">
          <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center">
            <Video size={40} className="mx-auto text-gray-400" />
            <label htmlFor="videoUpload" className="font-medium text-blue-600 cursor-pointer hover:underline">
              {formData.videoPreview ? "Change Video" : "Upload a Video"}
              <input 
                id="videoUpload" 
                type="file" 
                accept="video/mp4, video/quicktime" 
                className="hidden"
                onChange={handleVideoChange}
              />
            </label>
            <p className="text-sm text-gray-500">Upload one video (max 50MB)</p>
          </div>
          
          {formData.videoPreview && (
            <div className="relative">
              <video 
                src={formData.videoPreview} // URL is already full path or blob
                controls 
                className="w-full rounded-lg"
              />
              <button
                type="button"
                onClick={handleDeleteVideo}
                className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full p-1 shadow-md"
              >
                <Trash2 size={12} />
              </button>
            </div>
          )}
        </div>
      </FormSection>

      <FormSection title="Ownership">
        <div className="flex flex-wrap gap-3">
          {['Freehold', 'Leasehold', 'Co-operative society', 'Power of Attorney'].map(type => (
            <button
              key={type}
              type="button"
              onClick={() => handleChipChange('ownership', type)}
              className={`py-2 px-4 border rounded-full text-sm font-medium transition-all ${
                formData.ownership === type
                  ? 'bg-blue-50 border-blue-500 text-blue-700 dark:bg-blue-900 dark:border-blue-500 dark:text-blue-300'
                  : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </FormSection>

      <FormSection title="Price Details">
        <FormInput label="Expected Price (₹)" id="expectedPrice" name="expectedPrice" value={formData.expectedPrice} onChange={handleChange} placeholder="e.g. 5000000" type="number" />
        <div className="space-y-2 mt-2">
          <label className="flex items-center">
            <input type="checkbox" name="allInclusive" checked={formData.allInclusive} onChange={handleChange} className="h-4 w-4 text-blue-600 rounded" />
            <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">All inclusive price</span>
          </label>
          <label className="flex items-center">
            <input type="checkbox" name="priceNegotiable" checked={formData.priceNegotiable} onChange={handleChange} className="h-4 w-4 text-blue-600 rounded" />
            <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Price Negotiable</span>
          </label>
          <label className="flex items-center">
            <input type="checkbox" name="taxExcluded" checked={formData.taxExcluded} onChange={handleChange} className="h-4 w-4 text-blue-600 rounded" />
            <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Tax and Govt. charges excluded</span>
          </label>
        </div>
      </FormSection>

      <FormSection title="Do you charge brokerage?">
        <div className="flex space-x-3">
          <ChoiceChip label="Fixed" name="brokerage" value="Fixed" selected={formData.brokerage} onChange={handleChipChange} />
          <ChoiceChip label="Percentage of Price" name="brokerage" value="Percentage" selected={formData.brokerage} onChange={handleChipChange} />
          <ChoiceChip label="None" name="brokerage" value="None" selected={formData.brokerage} onChange={handleChipChange} />
        </div>
      </FormSection>

      <FormSection title="What makes your property unique">
        <textarea
          id="description"
          name="description"
          rows="4"
          value={formData.description}
          onChange={handleChange}
          placeholder="Share some details about your property like spacious rooms, well maintained facilities..."
          className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800"
          maxLength="8000" // 4. Increase character limit
        />
        <p className="text-right text-xs text-gray-500">{formData.description.length}/8000 (Min. 30 characters)</p>
      </FormSection>
    </div>
  );
}