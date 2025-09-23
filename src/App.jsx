import React, { useState } from 'react';
import { Search, MapPin, Heart, Plus, User, Home, Tag, Star, Share2, X, Sun, Moon, DollarSign, Text, Ruler, ImageIcon, FileText } from 'lucide-react';

// --------------------------------------------------
// Mock Data for the Application
// --------------------------------------------------
// Expanded data to add more properties and variety.
const initialPropertyData = [
  {
    id: 1,
    image: 'https://placehold.co/400x300/fecaca/991b1b?text=Luxury+Villa',
    type: '3 BHK',
    area: '2500 sqft',
    price: '₹2.5 Cr',
    location: 'Nellore, V',
    status: 'For Rent',
    contact: 'Contact',
    isFeatured: true,
  },
  {
    id: 2,
    image: 'https://placehold.co/400x300/dbeafe/1e40af?text=Cozy+Apartment',
    type: '2 BHK',
    area: '1800 sqft',
    price: '₹1.8 Cr',
    location: 'Nellore, V',
    status: 'For Sale',
    contact: 'Contact',
    isFeatured: true,
  },
  {
    id: 3,
    image: 'https://placehold.co/400x300/d9f99d/3f6212?text=Modern+Studio',
    type: '1 BHK',
    area: '1200 sqft',
    price: '₹80 Lakh',
    location: 'Nellore, V',
    status: 'For Rent',
    contact: 'Contact',
    isFeatured: true,
  },
  {
    id: 4,
    image: 'https://placehold.co/400x300/a5f3fc/083344?text=Spacious+House',
    type: '4 BHK',
    area: '3200 sqft',
    price: '₹3.5 Cr',
    location: 'Nellore, V',
    status: 'For Sale',
    contact: 'Contact',
    isFeatured: false,
  },
  {
    id: 5,
    image: 'https://placehold.co/400x300/a78bfa/431c9a?text=Hillside+Retreat',
    type: '2 BHK',
    area: '1500 sqft',
    price: '₹1.2 Cr',
    location: 'Nellore, A',
    status: 'For Sale',
    contact: 'Contact',
    isFeatured: true,
  },
  {
    id: 6,
    image: 'https://placehold.co/400x300/c7d2fe/3730a3?text=Urban+Flat',
    type: '3 BHK',
    area: '2000 sqft',
    price: '₹2.1 Cr',
    location: 'Nellore, V',
    status: 'For Rent',
    contact: 'Contact',
    isFeatured: false,
  },
  {
    id: 7,
    image: 'https://placehold.co/400x300/f0abfc/701a75?text=Luxury+Duplex',
    type: '5 BHK',
    area: '4000 sqft',
    price: '₹5.0 Cr',
    location: 'Nellore,V',
    status: 'For Sale',
    contact: 'Contact',
    isFeatured: true,
  },
  {
    id: 8,
    image: 'https://placehold.co/400x300/fde047/854d0e?text=Compact+Studio',
    type: '1 BHK',
    area: '900 sqft',
    price: '₹55 Lakh',
    location: 'Nellore , V',
    status: 'For Rent',
    contact: 'Contact',
    isFeatured: false,
  },
  {
    id: 9,
    image: 'https://placehold.co/400x300/fca5a5/7f1d1d?text=City+Apartment',
    type: '2 BHK',
    area: '1750 sqft',
    price: '₹1.5 Cr',
    location: 'Mumbai, M',
    status: 'For Sale',
    contact: 'Contact',
    isFeatured: true,
  },
  {
    id: 10,
    image: 'https://placehold.co/400x300/bbf7d0/166534?text=Suburban+Home',
    type: '3 BHK',
    area: '2800 sqft',
    price: '₹3.2 Cr',
    location: 'Nellore , V',
    status: 'For Rent',
    contact: 'Contact',
    isFeatured: false,
  },
  {
    id: 11,
    image: 'https://placehold.co/400x300/a5b4fc/4f46e5?text=Riverside+Cottage',
    type: '4 BHK',
    area: '3000 sqft',
    price: '₹2.8 Cr',
    location: 'Pune, M',
    status: 'For Sale',
    contact: 'Contact',
    isFeatured: true,
  },
  {
    id: 12,
    image: 'https://placehold.co/400x300/e9d5ff/86198f?text=Seaside+Condo',
    type: '2 BHK',
    area: '1600 sqft',
    price: '₹1.9 Cr',
    location: 'Nellore , V',
    status: 'For Rent',
    contact: 'Contact',
    isFeatured: false,
  },
  {
    id: 13,
    image: 'https://placehold.co/400x300/bfdbfe/1d4ed8?text=Luxury+Penthouse',
    type: '5 BHK',
    area: '4500 sqft',
    price: '₹6.5 Cr',
    location: 'Nellore, V',
    status: 'For Rent',
    contact: 'Contact',
    isFeatured: true,
  },
  {
    id: 14,
    image: 'https://placehold.co/400x300/fed7aa/ea580c?text=Chic+Loft',
    type: '1 BHK',
    area: '1100 sqft',
    price: '₹90 Lakh',
    location: 'Nellore, V',
    status: 'For Rent',
    contact: 'Contact',
    isFeatured: false,
  },
  {
    id: 15,
    image: 'https://placehold.co/400x300/fecdd3/f43f5e?text=Family+Home',
    type: '3 BHK',
    area: '2200 sqft',
    price: '₹2.3 Cr',
    location: 'Hyderabad, T',
    status: 'For Sale',
    contact: 'Contact',
    isFeatured: true,
  },
  {
    id: 16,
    image: 'https://placehold.co/400x300/f0f9ff/0c4a6e?text=Lakehouse+Estate',
    type: '4 BHK',
    area: '3500 sqft',
    price: '₹4.0 Cr',
    location: 'Nellore ,V',
    status: 'For Sell',
    contact: 'Contact',
    isFeatured: true,
  },
  {
    id: 17,
    image: 'https://placehold.co/400x300/fae8ff/9c1a7a?text=Beachfront+Villa',
    type: '3 BHK',
    area: '2800 sqft',
    price: '₹3.8 Cr',
    location: 'Nellore , V',
    status: 'For Sale',
    contact: 'Contact',
    isFeatured: false,
  },
  {
    id: 18,
    image: 'https://placehold.co/400x300/fee2e2/991b1b?text=Mountain+Chalet',
    type: '2 BHK',
    area: '1700 sqft',
    price: '₹1.5 Cr',
    location: 'Manali, H',
    status: 'For Rent',
    contact: 'Contact',
    isFeatured: true,
  },
  {
    id: 19,
    image: 'https://placehold.co/400x300/dcfce7/16a34a?text=Garden+Apartment',
    type: '1 BHK',
    area: '1000 sqft',
    price: '₹65 Lakh',
    location: 'Pune, M',
    status: 'For Rent',
    contact: 'Contact',
    isFeatured: false,
  },
  {
    id: 20,
    image: 'https://placehold.co/400x300/fecdd3/f43f5e?text=Skyline+Apartment',
    type: '4 BHK',
    area: '3100 sqft',
    price: '₹4.5 Cr',
    location: 'Mumbai, M',
    status: 'For Sale',
    contact: 'Contact',
    isFeatured: true,
  },
  // Added properties for 'For Sale' to reach at least 20
  {
    id: 21,
    image: 'https://placehold.co/400x300/f3e8ff/581c87?text=Modern+Townhouse',
    type: '3 BHK',
    area: '2700 sqft',
    price: '₹2.9 Cr',
    location: 'Kolkata, W',
    status: 'For Sale',
    contact: 'Contact',
    isFeatured: false,
  },
  {
    id: 22,
    image: 'https://placehold.co/400x300/fce7f3/9d174d?text=Luxury+Penthouse',
    type: '4 BHK',
    area: '3800 sqft',
    price: '₹5.5 Cr',
    location: 'Chennai, T',
    status: 'For Sale',
    contact: 'Contact',
    isFeatured: true,
  },
  {
    id: 23,
    image: 'https://placehold.co/400x300/d4d4d4/262626?text=Family+Bungalow',
    type: '5 BHK',
    area: '4200 sqft',
    price: '₹6.0 Cr',
    location: 'Bengaluru, K',
    status: 'For Sale',
    contact: 'Contact',
    isFeatured: false,
  },
  {
    id: 24,
    image: 'https://placehold.co/400x300/d1d5db/374151?text=Cozy+Cottage',
    type: '2 BHK',
    area: '1900 sqft',
    price: '₹1.6 Cr',
    location: 'Pune, M',
    status: 'For Sale',
    contact: 'Contact',
    isFeatured: true,
  },
  {
    id: 25,
    image: 'https://placehold.co/400x300/cffafe/155e75?text=Urban+Dwelling',
    type: '3 BHK',
    area: '2400 sqft',
    price: '₹2.6 Cr',
    location: 'Hyderabad, T',
    status: 'For Sale',
    contact: 'Contact',
    isFeatured: false,
  },
  {
    id: 26,
    image: 'https://placehold.co/400x300/c7d2fe/4338ca?text=Contemporary+Home',
    type: '4 BHK',
    area: '3000 sqft',
    price: '₹3.3 Cr',
    location: 'Goa, G',
    status: 'For Sale',
    contact: 'Contact',
    isFeatured: true,
  },
  {
    id: 27,
    image: 'https://placehold.co/400x300/fef08a/854d0e?text=Luxury+Condo',
    type: '2 BHK',
    area: '1850 sqft',
    price: '₹2.1 Cr',
    location: 'Mumbai, M',
    status: 'For Sale',
    contact: 'Contact',
    isFeatured: false,
  },
  {
    id: 28,
    image: 'https://placehold.co/400x300/fbcfe8/831843?text=Executive+Apartment',
    type: '3 BHK',
    area: '2600 sqft',
    price: '₹3.0 Cr',
    location: 'New Delhi, D',
    status: 'For Sale',
    contact: 'Contact',
    isFeatured: true,
  },
  {
    id: 29,
    image: 'https://placehold.co/400x300/ccfbf1/0f766e?text=Grand+Estate',
    type: '6 BHK',
    area: '5000 sqft',
    price: '₹8.0 Cr',
    location: 'Jaipur, R',
    status: 'For Sale',
    contact: 'Contact',
    isFeatured: true,
  },
  // Added properties for 'For Rent' to reach at least 20
  {
    id: 30,
    image: 'https://placehold.co/400x300/e0e7ff/4f46e5?text=Loft+Apartment',
    type: '1 BHK',
    area: '1150 sqft',
    price: '₹85 Lakh',
    location: 'Gurgaon, H',
    status: 'For Rent',
    contact: 'Contact',
    isFeatured: false,
  },
  {
    id: 31,
    image: 'https://placehold.co/400x300/fecdd3/e11d48?text=Family+Home',
    type: '4 BHK',
    area: '3400 sqft',
    price: '₹3.5 Cr',
    location: 'Ahmedabad, G',
    status: 'For Rent',
    contact: 'Contact',
    isFeatured: true,
  },
  {
    id: 32,
    image: 'https://placehold.co/400x300/e5e7eb/4b5563?text=Studio+Apartment',
    type: '1 BHK',
    area: '850 sqft',
    price: '₹50 Lakh',
    location: 'Lucknow, U',
    status: 'For Rent',
    contact: 'Contact',
    isFeatured: false,
  },
  {
    id: 33,
    image: 'https://placehold.co/400x300/dbeafe/1e40af?text=Cozy+Flat',
    type: '2 BHK',
    area: '1650 sqft',
    price: '₹1.7 Cr',
    location: 'Kochi, K',
    status: 'For Rent',
    contact: 'Contact',
    isFeatured: true,
  },
  {
    id: 34,
    image: 'https://placehold.co/400x300/fee2e2/991b1b?text=Urban+Townhouse',
    type: '3 BHK',
    area: '2550 sqft',
    price: '₹2.4 Cr',
    location: 'Bhopal, M',
    status: 'For Rent',
    contact: 'Contact',
    isFeatured: false,
  },
  {
    id: 35,
    image: 'https://placehold.co/400x300/fce7f3/9d174d?text=Luxury+Apartment',
    type: '4 BHK',
    area: '3200 sqft',
    price: '₹4.2 Cr',
    location: 'Pune, M',
    status: 'For Rent',
    contact: 'Contact',
    isFeatured: true,
  },
  {
    id: 36,
    image: 'https://placehold.co/400x300/f3e8ff/581c87?text=Spacious+Condo',
    type: '2 BHK',
    area: '1800 sqft',
    price: '₹1.9 Cr',
    location: 'Chennai, T',
    status: 'For Rent',
    contact: 'Contact',
    isFeatured: false,
  },
  {
    id: 37,
    image: 'https://placehold.co/400x300/d4d4d4/262626?text=Modern+Villa',
    type: '5 BHK',
    area: '4100 sqft',
    price: '₹5.5 Cr',
    location: 'Bengaluru, K',
    status: 'For Rent',
    contact: 'Contact',
    isFeatured: true,
  },
  {
    id: 38,
    image: 'https://placehold.co/400x300/a5f3fc/083344?text=Riverside+Home',
    type: '3 BHK',
    area: '2900 sqft',
    price: '₹2.8 Cr',
    location: 'Guwahati, A',
    status: 'For Rent',
    contact: 'Contact',
    isFeatured: false,
  },
  {
    id: 39,
    image: 'https://placehold.co/400x300/dcfce7/16a34a?text=Garden+Chalet',
    type: '2 BHK',
    area: '1750 sqft',
    price: '₹1.6 Cr',
    location: 'Agra, U',
    status: 'For Rent',
    contact: 'Contact',
    isFeatured: true,
  },
  {
    id: 40,
    image: 'https://placehold.co/400x300/cffafe/155e75?text=City+Flat',
    type: '1 BHK',
    area: '1050 sqft',
    price: '₹75 Lakh',
    location: 'Jaipur, R',
    status: 'For Rent',
    contact: 'Contact',
    isFeatured: true,
  },
];


// --------------------------------------------------
// Main App Component
// --------------------------------------------------
// This is the root component that renders the entire application.
// It acts as the main container and orchestrates the other components.
export default function App() {
  // State to manage the list of properties, now mutable.
  const [properties, setProperties] = useState(initialPropertyData);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('Buy');
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Function to add a new property to the state
  const addProperty = (newProperty) => {
    // Generate a unique ID for the new property
    const newId = properties.length > 0 ? Math.max(...properties.map(p => p.id)) + 1 : 1;
    const propertyWithId = { ...newProperty, id: newId };
    setProperties(prevProperties => [propertyWithId, ...prevProperties]);
  };

  // Filter properties based on search term and active tab
  const filteredProperties = properties.filter(property => {
    const matchesSearch = property.location.toLowerCase().includes(searchTerm.toLowerCase()) || property.type.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Add logic for the "Sell" tab.
    let matchesTab = true;
    if (activeTab === 'Buy' && property.status !== 'For Sale') {
      matchesTab = false;
    } else if (activeTab === 'Rent' && property.status !== 'For Rent') {
      matchesTab = false;
    }
    // The 'Sell' tab will show all properties since the form doesn't distinguish between 'For Sale' and 'For Sell'.
    // In a real app, this would be a separate user flow.
    
    return matchesSearch && matchesTab;
  });

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);
  const handleClearSearch = () => setSearchTerm('');

  const toggleDarkMode = () => setIsDarkMode(!isDarkMode);

  const themeClasses = isDarkMode ? 'bg-gray-900 text-gray-100' : 'bg-gray-100 text-gray-800';

  return (
    <div className={`min-h-screen font-sans antialiased flex flex-col items-center pb-20 ${themeClasses}`}>
      <div className="w-full max-w-7xl lg:px-8">
        {/* New Combined Header Section */}
        <Header
          toggleDarkMode={toggleDarkMode}
          isDarkMode={isDarkMode}
          onPostPropertyClick={handleOpenModal}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          handleClearSearch={handleClearSearch}
        />

        {/* Featured Properties Section - Filtered for Nellore and featured status */}
        <PropertiesSection
          title="Featured Properties"
          data={filteredProperties.filter(p => p.isFeatured && p.location.includes('Nellore'))}
          isFeaturedSection={true}
        />

        {/* Properties in Your Area Section - Filtered for Nellore location */}
        <PropertiesSection 
          title="Properties in your Area"
          data={filteredProperties.filter(p => p.location.includes('Nellore') && !p.isFeatured)}
        />

        {/* More Properties Section - Filtered for non-Nellore locations */}
        <PropertiesSection
          title="More properties"
          data={filteredProperties.filter(p => !p.location.includes('Nellore'))}
        />
        
        {/* App Info / Advertisement Section */}
        <AppInfoSection />
      </div>

      {/* Bottom Navigation Bar */}
      <BottomNav onPostPropertyClick={handleOpenModal} />

      {/* Post Property Modal - now receives the addProperty function */}
      {isModalOpen && <PostPropertyModal onClose={handleCloseModal} onAddProperty={addProperty} />}
    </div>
  );
}

// --------------------------------------------------
// NEW COMBINED HEADER Component
// --------------------------------------------------
// Combines logo, user info, search bar, and action tabs into one cohesive unit.
const Header = ({ toggleDarkMode, isDarkMode, onPostPropertyClick, searchTerm, setSearchTerm, activeTab, setActiveTab, handleClearSearch }) => {
  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  return (
    <header className="p-4 sm:p-6 bg-white dark:bg-gray-800 shadow-xl rounded-b-[2.5rem] transition-colors duration-300">
      {/* Top Row: Logo, User Info, and Theme Toggle */}
      <div className="flex justify-between items-center mb-6">
        {/* Logo and App Name */}
        <div className="flex items-center space-x-2">
          <div className="bg-gradient-to-r from-blue-500 to-indigo-600 w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg">
            <Home size={24} className="text-white" />
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-gray-100">Propy</h1>
        </div>

        {/* User Info and Post Property Button - Now visible on mobile */}
        <div className="flex items-center space-x-2 sm:space-x-4">
          {/* Mobile-friendly Post Property button */}
          <button
            onClick={onPostPropertyClick}
            className="flex sm:hidden p-2 rounded-full bg-blue-600 dark:bg-blue-500 text-white shadow-lg transition-transform transform hover:scale-105"
            aria-label="Post Property"
          >
            <Plus size={20} />
          </button>
          
          {/* Desktop Post Property button */}
          <button
            onClick={onPostPropertyClick}
            className="hidden sm:flex bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 text-white font-bold py-2 px-4 rounded-full shadow-lg transition-transform transform hover:scale-105 items-center space-x-2 text-sm"
          >
            <Plus size={16} />
            <span>Post Property</span>
          </button>
          
          {/* User greeting, now with responsive display */}
          <div className="sm:block text-right">
            <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 block">Greetings!</span>
            <span className="hidden sm:block text-sm sm:text-lg font-semibold text-gray-800 dark:text-gray-100">User Name</span>
          </div>
          
          {/* Dark mode toggle */}
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 transition-colors hover:bg-gray-300 dark:hover:bg-gray-600 shadow-md"
            aria-label="Toggle dark mode"
          >
            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </div>
      </div>
      
      {/* Location and Search/Tabs */}
      <div className="flex flex-col space-y-4">
        {/* User Location */}
        <div className="flex items-center space-x-1 text-gray-600 dark:text-gray-400">
          <MapPin size={16} />
          <span className="text-sm font-medium">Nellore V</span>
        </div>
        
        {/* Search Bar */}
        <div className="relative">
          <input
            type="text"
            placeholder="Search location or type..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-10 py-3 border border-gray-300 dark:border-gray-600 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all shadow-sm bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200"
          />
          <Search className="absolute left-3 top-4 -translate-y-1/2 text-gray-400 dark:text-gray-500" size={20} />
          {searchTerm && (
            <button
              onClick={handleClearSearch}
              className="absolute right-3 top-4 -translate-y-1/2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
              aria-label="Clear search"
            >
              <X size={20} />
            </button>
          )}
        </div>
        
        {/* Buy, Rent, Sell Tabs */}
        <div className="flex justify-around items-center bg-gray-50 dark:bg-gray-900 p-2 rounded-full shadow-lg">
          {['Buy', 'Rent', 'Sell'].map(tab => (
            <button
              key={tab}
              onClick={() => handleTabClick(tab)}
              className={`w-1/3 py-2 rounded-full transition-colors font-medium text-sm sm:text-base ${
                activeTab === tab ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>
    </header>
  );
};

// --------------------------------------------------
// Reusable Properties Section
// --------------------------------------------------
// A general component to display a grid of property cards.
const PropertiesSection = ({ title, data, isFeaturedSection = false }) => {
  return (
    <section className="p-4 sm:p-6 mt-6">
      {/* Conditional class for featured section title in dark mode for better visibility */}
      <h2 className={`text-xl sm:text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4 ${isFeaturedSection ? 'dark:text-indigo-400' : ''}`}>{title}</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {data.length > 0 ? (
          data.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))
        ) : (
          <p className="text-gray-500 dark:text-gray-400 col-span-full text-center p-8">No properties found matching your criteria.</p>
        )}
      </div>
    </section>
  );
};

// --------------------------------------------------
// Property Card Component
// --------------------------------------------------
// A single card component to display property details.
const PropertyCard = ({ property }) => {
  const isFeatured = property.isFeatured;
  const [isLiked, setIsLiked] = useState(false);
  const handleLike = () => setIsLiked(!isLiked);

  // Functionality for the "Contact Now" button
  const handleContact = () => {
    alert(`Contacting agent for property at ${property.location} (ID: ${property.id}).`);
    // In a real application, this would open a contact form, a chat window, or trigger an API call.
  };

  // Functionality for the "Share" button
  const handleShare = () => {
    // This is a placeholder for web share API or custom share logic
    const shareData = {
      title: 'Propy Property',
      text: `Check out this property: ${property.type} at ${property.location} for ${property.price}`,
      url: window.location.href,
    };
    if (navigator.share) {
      navigator.share(shareData)
        .then(() => console.log('Successfully shared'))
        .catch((error) => console.log('Error sharing:', error));
    } else {
      console.log('Web Share API not supported. Copying link to clipboard.');
      alert('Share functionality not supported. You can copy the URL from your browser.');
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-lg hover:shadow-2xl overflow-hidden transition-all transform hover:-translate-y-2 relative">
      {isFeatured && (
        <div className="absolute top-4 left-4 bg-yellow-400 text-yellow-900 text-xs font-bold px-3 py-1 rounded-full shadow-md flex items-center space-x-1">
          <Star size={14} fill="currentColor" className="text-yellow-900" />
          <span>Featured</span>
        </div>
      )}
      {/* Property Image */}
      <img
        src={property.image}
        alt="Property"
        className="w-full h-48 object-cover object-center"
        onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/400x300/e2e8f0/64748b?text=Image+Not+Found' }}
      />
      
      {/* Property Details */}
      <div className="p-4 relative">
        <div className="flex justify-between items-center mb-2">
          <span className="text-lg font-semibold text-gray-800 dark:text-gray-100">{property.type}</span>
          <span className="text-sm font-medium text-gray-500 dark:text-gray-400">{property.area}</span>
        </div>
        <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 text-sm mb-2">
          <MapPin size={16} />
          <span className="font-medium">{property.location}</span>
        </div>
        <div className="flex justify-between items-center mb-4">
          <span className="text-xl font-bold text-blue-600 dark:text-blue-400">{property.price}</span>
          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
            property.status === 'For Rent' ? 'bg-orange-100 text-orange-700 dark:bg-orange-700 dark:text-orange-100' : 'bg-green-100 text-green-700 dark:bg-green-700 dark:text-green-100'
          }`}>
            {property.status}
          </span>
        </div>
        {property.description && (
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-2 line-clamp-3">
            {property.description}
          </p>
        )}
        
        {/* The new "Instagram-like" button section */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700 mt-4">
          <button
            onClick={handleContact} // Added handler for "Contact Now" button
            className="flex-1 bg-gradient-to-r from-blue-600 to-blue-800 text-white font-bold py-2 rounded-full hover:from-blue-700 hover:to-blue-900 transition-colors text-sm shadow-lg"
          >
            Contact Now
          </button>
          <div className="flex space-x-2 ml-4">
            <button
              onClick={handleLike}
              className={`p-3 rounded-full transition-colors shadow-md ${
                isLiked ? 'bg-red-500 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
              }`}
              aria-label="Like property"
            >
              <Heart size={20} fill={isLiked ? "currentColor" : "none"} />
            </button>
            <button
              onClick={handleShare} // Added handler for "Share" button
              className="p-3 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors shadow-md"
              aria-label="Share property"
            >
              <Share2 size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// --------------------------------------------------
// App Info / Advertisement Section
// --------------------------------------------------
// A section for app information, feedback, and sharing.
const AppInfoSection = () => {
  // Handler for the "Give Feedback" button
  const handleFeedback = () => {
    window.location.href = 'mailto:feedback@propy.com?subject=App%20Feedback';
  };

  // Handler for the "Share the App" button
  const handleShareApp = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Propy Real Estate App',
        text: 'Find your dream home with Propy!',
        url: window.location.href
      })
      .then(() => console.log('App shared successfully'))
      .catch((error) => console.log('Error sharing app:', error));
    } else {
      alert('Share functionality not supported on this device.');
    }
  };

  return (
    <section className="p-4 sm:p-6 mt-6 bg-white dark:bg-gray-800 rounded shadow-lg">
      <h2 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4">App Info / Advertisement</h2>
      <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base mb-4">
        This section highlights key features and promotional content.
      </p>
      
      {/* Feedback Section */}
      <div className="flex flex-col sm:flex-row items-center justify-between p-4 bg-gray-50 dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700">
        <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4 mb-4 sm:mb-0">
          <div className="flex-shrink-0 text-center sm:text-left">
            <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">Feedback with E-mail</p>
            <div className="flex text-yellow-400 space-x-1 mt-1 justify-center sm:justify-start">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={20} fill="currentColor" />
              ))}
            </div>
          </div>
          <button
            onClick={handleFeedback} // Added handler for feedback button
            className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-2 px-4 rounded-full shadow-md text-sm font-semibold hover:from-blue-700 hover:to-blue-900 transition-colors transform hover:scale-105"
          >
            Give Feedback
          </button>
        </div>
        
        {/* Share the App Section */}
        <div className="flex items-center space-x-2">
          <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Share the App</span>
          <button
            onClick={handleShareApp} // Added handler for share app button
            className="p-3 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors shadow-md"
          >
            <Share2 size={20} />
          </button>
        </div>
      </div>
    </section>
  );
};

// --------------------------------------------------
// Bottom Navigation Bar
// --------------------------------------------------
// A fixed navigation bar at the bottom of the screen for mobile-friendly
// navigation.
const BottomNav = ({ onPostPropertyClick }) => {
  const [activeItem, setActiveItem] = useState('Home');

  const navItems = [
    { name: 'Home', icon: Home, route: 'home' },
    { name: 'Price', icon: Tag, route: 'price' },
    { name: 'Post', icon: Plus, route: 'post', onClick: onPostPropertyClick },
    { name: 'Saved', icon: Heart, route: 'saved' },
    { name: 'Profile', icon: User, route: 'profile' },
  ];

  const handleNavClick = (name) => {
    setActiveItem(name);
    // In a full-fledged app, this would trigger a router navigation.
    console.log(`Navigating to ${name} page.`);
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 shadow-2xl rounded-t-[2.5rem] p-4 z-50 transition-transform duration-300 ease-in-out">
      <div className="flex justify-around items-center max-w-lg mx-auto">
        {navItems.map((item) => (
          <NavItem
            key={item.name}
            icon={item.icon}
            name={item.name}
            isActive={activeItem === item.name}
            onClick={() => {
              if (item.onClick) {
                item.onClick();
              }
              handleNavClick(item.name);
            }}
          />
        ))}
      </div>
    </nav>
  );
};

// --------------------------------------------------
// Reusable Navigation Item Component
// --------------------------------------------------
// A single button component for the bottom navigation bar.
const NavItem = ({ icon: Icon, name, isActive, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center p-2 rounded-full transition-transform transform ${
        isActive ? 'text-blue-600 dark:text-blue-400 scale-110' : 'text-gray-500 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-300'
      }`}
      aria-label={`Maps to ${name}`}
    >
      <Icon size={24} className="transition-all duration-300" />
      <span className={`text-xs mt-1 ${isActive ? 'font-bold' : 'font-medium'}`}>{name}</span>
    </button>
  );
};

// --------------------------------------------------
// Post Property Modal Component (Updated)
// --------------------------------------------------
// A simple modal to simulate the "Post Property" functionality.
// Now handles form state and submission with all required fields.
const PostPropertyModal = ({ onClose, onAddProperty }) => {
  const [formData, setFormData] = useState({
    type: '',
    price: '',
    location: '',
    area: '',
    description: '',
    image: '',
    status: 'For Sale',
    isFeatured: false
  });

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [id]: value
    }));
  };

  const handleCheckboxChange = (e) => {
    const { id, checked } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [id]: checked
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const newProperty = { ...formData };
    // Set a default image if no URL is provided
    if (!newProperty.image) {
      newProperty.image = 'https://placehold.co/400x300/a5f3fc/083344?text=New+Listing';
    }

    onAddProperty(newProperty);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-6 w-full max-w-md relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors" aria-label="Close modal">
          <X size={24} />
        </button>
        <h3 className="text-2xl font-bold mb-4 text-center text-gray-800 dark:text-gray-100">Post a New Property</h3>
        <p className="text-gray-600 dark:text-gray-400 text-center mb-6">Fill out the details to list your property.</p>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="type" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Property Type</label>
            <div className="relative">
              <Text size={20} className="absolute left-3 top-4 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                id="type"
                placeholder="e.g., 3 BHK, 2BHK"
                value={formData.type}
                onChange={handleChange}
                className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 py-3"
                required
              />
            </div>
          </div>
          <div>
            <label htmlFor="price" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Price</label>
            <div className="relative">
              <DollarSign size={20} className="absolute left-3 top-4 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                id="price"
                placeholder="e.g., ₹2.5 Cr"
                value={formData.price}
                onChange={handleChange}
                className="pl-10 block py-3 w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600"
                required
              />
            </div>
          </div>
          <div>
            <label htmlFor="location" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Location</label>
            <div className="relative">
              <MapPin size={20} className="absolute left-3 top-4 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                id="location"
                placeholder="e.g., Nellore, V"
                value={formData.location}
                onChange={handleChange}
                className="pl-10 block py-3 w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600"
                required
              />
            </div>
          </div>
          <div>
            <label htmlFor="area" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Area (sqft)</label>
            <div className="relative">
              <Ruler size={20} className="absolute left-3 top-4 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                id="area"
                placeholder="e.g., 2500 sqft"
                value={formData.area}
                onChange={handleChange}
                className="pl-10 block py-3 w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600"
                required
              />
            </div>
          </div>
          <div>
            <label htmlFor="image" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Image URL</label>
            <div className="relative">
              <ImageIcon size={20} className="absolute left-3 top-4 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                id="image"
                placeholder="e.g., https://your-image-url.com"
                value={formData.image}
                onChange={handleChange}
                className="pl-10 block w-full py-3 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600"
              />
            </div>
          </div>
          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Status</label>
            <select
              id="status"
              value={formData.status}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600"
            >
              <option value="For Sale">For Sale</option>
              <option value="For Rent">For Rent</option>
            </select>
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="isFeatured"
              checked={formData.isFeatured}
              onChange={handleCheckboxChange}
              className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
            />
            <label htmlFor="isFeatured" className="ml-2 block text-sm text-gray-900 dark:text-gray-300">
              Mark as Featured
            </label>
          </div>
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-600 to-blue-800 text-white py-2 px-4 rounded-md font-semibold hover:from-blue-700 hover:to-blue-900 transition-colors"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};