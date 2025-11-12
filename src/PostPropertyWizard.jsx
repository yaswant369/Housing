 import React, { useState } from 'react';
import { 
  X, ArrowLeft, User, Building, Phone, MapPin, LocateFixed, Upload, 
  BedDouble, Bath, Plus, Minus, Home, Aperture, Star, CheckSquare, Trash2
} from 'lucide-react';

// Main Wizard Component
export default function PostPropertyWizard({ onClose, onAddProperty }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    userType: 'Owner',
    phoneNumber: '',
    lookingTo: 'Sell',
    propertyKind: 'Residential',
    propertyType: 'Apartment',
    city: 'Nellore',
    location: '',
    bedrooms: 1,
    bathrooms: 1,
    balconies: 0,
    plotArea: '',
    carpetArea: '',
    furnishing: 'Unfurnished',
    coveredParking: 0,
    openParking: 0,
    totalFloors: 1,
    availability: 'Ready to move',
    propertyAge: '1-5 years',
    photos: [],
    ownership: 'Freehold',
    expectedPrice: '',
    allInclusive: false,
    priceNegotiable: true,
    taxExcluded: false,
    brokerage: 'None',
    description: '',
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
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

  const handleNext = () => {
    if (currentStep === 1 && !formData.phoneNumber) {
      alert('Please enter your phone number.');
      return;
    }
    setCurrentStep(prev => prev + 1);
  };

  const handleBack = () => {
    setCurrentStep(prev => prev - 1);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newProperty = {
      type: `${formData.bedrooms} BHK`,
      price: `₹${formData.expectedPrice || '0'}`,
      location: `${formData.location || 'Location'}, ${formData.city || 'Nellore'}`,
      area: `${formData.carpetArea || formData.plotArea || '1800'} sqft`,
      status: formData.lookingTo === 'Sell' ? 'For Sale' : 'For Rent',
      isFeatured: false,
      image: formData.photos.length > 0 ? URL.createObjectURL(formData.photos[0]) : 'https://placehold.co/400x300/a5f3fc/083344?text=New+Listing',
    };
    
    onAddProperty(newProperty);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
      <div className="bg-gray-100 dark:bg-gray-900 w-full max-w-lg h-full max-h-[calc(100vh-2rem)] rounded-2xl shadow-xl flex flex-col overflow-y-auto">
        
        <header className="flex items-center p-4 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
          {currentStep > 1 ? (
            <button onClick={handleBack} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
              <ArrowLeft size={20} />
            </button>
          ) : (
            <div className="w-8"></div>
          )}
          <div className="flex-1 text-center">
            <h2 className="font-bold text-lg text-gray-800 dark:text-gray-100">
              {currentStep === 1 && 'Post Your Property'}
              {currentStep === 2 && 'Add Basic Details'}
              {currentStep === 3 && 'Add Property Details'}
              {currentStep === 4 && 'Photos & Pricing'}
            </h2>
            <span className="text-sm text-gray-500">Step {currentStep} of 4</span>
          </div>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
            <X size={20} />
          </button>
        </header>

        <div className="flex-1 p-6 space-y-6 overflow-y-auto">
          {currentStep === 1 && <Step1_RoleContact formData={formData} handleChipChange={handleChipChange} handleChange={handleChange} />}
          {currentStep === 2 && <Step2_BasicDetails formData={formData} handleChipChange={handleChipChange} />}
          {currentStep === 3 && <Step3_PropertyDetails formData={formData} handleChipChange={handleChipChange} handleChange={handleChange} handleCounterChange={handleCounterChange} />}
          {currentStep === 4 && <Step4_PhotosPricing formData={formData} handleChipChange={handleChipChange} handleChange={handleChange} setFormData={setFormData} />}
        </div>

        <footer className="p-4 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 flex-shrink-0">
          {currentStep < 4 ? (
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
              Submit Property
            </button>
          )}
        </footer>
      </div>
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

function Step1_RoleContact({ formData, handleChipChange, handleChange }) {
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
      <button className="w-full py-3 bg-cyan-500 text-white font-bold rounded-lg flex items-center justify-center space-x-2 hover:bg-cyan-600">
        <Phone size={18} />
        <span>One Tap Login with Truecaller</span>
      </button>
      <p className="text-center text-sm text-gray-500">
        Existing user? <a href="#" className="font-medium text-blue-600">Login Here</a>
      </p>
    </div>
  );
}

function Step2_BasicDetails({ formData, handleChipChange }) {
  const propertyTypes = {
    Residential: ['Apartment', 'Independent House / Villa', 'Independent / Builder Floor', 'Plot / Land', '1 RK/ Studio Apartment', 'Serviced Apartment', 'Farmhouse', 'Other'],
    Commercial: ['Office Space', 'Co-Working', 'Shop', 'Showroom', 'Godown / Warehouse', 'Industrial Shed', 'Other'],
  };

  return (
    <div className="space-y-6">
      <div className="relative bg-yellow-50 dark:bg-yellow-900 border border-yellow-200 dark:border-yellow-700 p-4 rounded-lg">
        <button className="absolute top-2 right-2 text-gray-500 dark:text-gray-400"><X size={16} /></button>
        <h4 className="font-bold text-yellow-800 dark:text-yellow-100">Resale offer</h4>
        <p className="text-sm text-yellow-700 dark:text-yellow-200"><span className="font-bold text-red-600">50% off</span> for price up to ₹50 Lacs</p>
        <h4 className="font-bold text-yellow-800 dark:text-yellow-100 mt-2">Rental/Lease offers</h4>
        <p className="text-sm text-yellow-700 dark:text-yellow-200">
          <span className="font-bold text-red-600">75% off</span> for rent up to ₹15,000 & <span className="font-bold text-red-600">50% off</span> above it
        </p>
      </div>

      <FormSection title="You're looking to?">
        <div className="flex space-x-3">
          <ChoiceChip label="Sell" name="lookingTo" value="Sell" selected={formData.lookingTo} onChange={handleChipChange} />
          <ChoiceChip label="Rent / Lease" name="lookingTo" value="Rent" selected={formData.lookingTo} onChange={handleChipChange} />
          <ChoiceChip label="Paying Guest" name="lookingTo" value="PG" selected={formData.lookingTo} onChange={handleChipChange} />
        </div>
      </FormSection>

      <FormSection title="What kind of property?">
        <div className="flex space-x-3">
          <ChoiceChip label="Residential" name="propertyKind" value="Residential" selected={formData.propertyKind} onChange={handleChipChange} />
          <ChoiceChip label="Commercial" name="propertyKind" value="Commercial" selected={formData.propertyKind} onChange={handleChipChange} />
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

function Step3_PropertyDetails({ formData, handleChipChange, handleChange, handleCounterChange }) {
  return (
    <div className="space-y-6">
      <FormSection title="Where is your property located?">
        <div className="space-y-4">
          <FormInput label="City" id="city" name="city" value={formData.city} onChange={handleChange} />
          <FormInput label="Location" id="location" name="location" value={formData.location} onChange={handleChange} placeholder="e.g., Magunta Layout" />
          <button className="flex items-center space-x-2 text-blue-600 font-medium">
            <LocateFixed size={18} />
            <span>Detect my location</span>
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
        <FormInput label="Carpet Area" id="carpetArea" name="carpetArea" value={formData.carpetArea} onChange={handleChange} placeholder="sq.ft." />
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

function Step4_PhotosPricing({ formData, handleChipChange, handleChange, setFormData }) {
  
  const handlePhotoUpload = (e) => {
    const files = Array.from(e.target.files);
    setFormData(prev => ({
      ...prev,
      photos: [...prev.photos, ...files].slice(0, 50)
    }));
  };

  const removePhoto = (index) => {
    setFormData(prev => ({
      ...prev,
      photos: prev.photos.filter((_, i) => i !== index)
    }));
  };

  return (
    <div className="space-y-6">
      {formData.photos.length === 0 && (
        <div className="flex items-center bg-yellow-100 dark:bg-yellow-900 p-3 rounded-lg">
          <Aperture size={20} className="text-yellow-700 dark:text-yellow-200 mr-3 flex-shrink-0" />
          <p className="text-sm text-yellow-800 dark:text-yellow-100">
            <span className="font-bold">No photos uploaded?</span> Your property will get neglected by buyers.
          </p>
        </div>
      )}

      <FormSection title="Add property photos">
        <div className="space-y-4">
          <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center">
            <Upload size={40} className="mx-auto text-gray-400" />
            <label htmlFor="photoUpload" className="font-medium text-blue-600 cursor-pointer hover:underline">
              Add at least 5 photos
              <input 
                id="photoUpload" 
                type="file" 
                multiple 
                accept="image/png, image/jpeg, image/jpg" 
                className="hidden"
                onChange={handlePhotoUpload}
              />
            </label>
            <p className="text-sm text-gray-500">Click from camera or browse to upload</p>
          </div>
          <p className="text-xs text-gray-500 text-center">Upload up to 50 photos of max size 10 mb in format png, jpg, jpeg.</p>
          
          <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
            {formData.photos.map((file, index) => (
              <div key={index} className="relative aspect-square">
                <img 
                  src={URL.createObjectURL(file)} 
                  alt={`preview ${index}`} 
                  className="w-full h-full object-cover rounded-lg"
                  onLoad={e => URL.revokeObjectURL(e.target.src)}
                />
                <button 
                  type="button" 
                  onClick={() => removePhoto(index)}
                  className="absolute top-1 right-1 bg-black bg-opacity-50 p-1 rounded-full text-white"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>

          <div className="flex items-center bg-blue-50 dark:bg-blue-900 p-3 rounded-lg">
            <CheckSquare size={24} className="text-blue-500 mr-3 flex-shrink-0" />
            <p className="text-sm text-blue-800 dark:text-blue-200">
              <span className="font-bold">NEW:</span> Verify your property by adding photos with location data. <a href="#" className="font-bold underline">Learn more</a>
            </p>
          </div>
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
        <FormInput label="Expected Price" id="expectedPrice" name="expectedPrice" value={formData.expectedPrice} onChange={handleChange} placeholder="₹" type="number" />
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
          maxLength="5000"
        />
        <p className="text-right text-xs text-gray-500">{formData.description.length}/5000 (Min. 30 characters)</p>
      </FormSection>
    </div>
  );
}

function FormSection({ title, children }) {
  return (
    <div className="space-y-4">
      <h3 className="font-bold text-lg text-gray-800 dark:text-gray-100">{title}</h3>
      {children}
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