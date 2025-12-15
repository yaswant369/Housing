import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search, Filter, X, MapPin, Building, Home,
  Map, Users, Briefcase, ChevronDown, User, Plus, Star, MessageCircle
} from 'lucide-react';
import { AppContext } from '../../context/AppContext';
import { useContext } from 'react';
import NotificationBell from '../notifications/NotificationBell';
  
const propertyTypes = [
  { name: 'Residential', icon: Home },
  { name: 'Commercial', icon: Briefcase },
  { name: 'Plots', icon: Map },
  { name: 'PG', icon: Users },
  { name: 'Projects', icon: Building },
];
const listingTypes = ['Buy', 'Rent', 'Sell'];
  
const popularCities = [
  'Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Chennai',
  'Pune', 'Kolkata', 'Ahmedabad', 'Gurgaon', 'Noida',
  'Nellore', 'Visakhapatnam', 'Vijayawada', 'Tirupati'
];
  
  
export default function Header({
  currentUser,
  onLoginClick,
  onPostPropertyClick,
  onPremiumClick,
  onFilterClick,
}) {
     
  const navigate = useNavigate();
   
  const {
    propertyType,
    handlePropertyTypeChange,
    listingType,
    handleListingTypeChange,
    searchTerm,
    handleSearchTermChange
  } = useContext(AppContext);
  

const [localSearch, setLocalSearch] = useState(searchTerm);
const [isHeaderVisible, setIsHeaderVisible] = useState(true);
const [lastScrollY, setLastScrollY] = useState(0);
const [showLocationDropdown, setShowLocationDropdown] = useState(false);
  
// --- Smart Scroll Effect for Auto-Hide/Show Header ---
useEffect(() => {
  let ticking = false;
  let scrollY = 0;
  
  // Define the scroll point where the header should start hiding.
  const HIDE_THRESHOLD = 100; // Reduced for more responsive behavior
  const SCROLL_UP_THRESHOLD = 10; // Minimal upward scroll to show header
  
  const controlNavbar = () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        const currentScrollY = window.scrollY;
        
        // 1. Always show header when at or near the top
        if (currentScrollY <= HIDE_THRESHOLD) {
          setIsHeaderVisible(true);
        }
        // 2. Hide header when scrolling down past the threshold
        else if (currentScrollY > scrollY + SCROLL_UP_THRESHOLD) {
          setIsHeaderVisible(false);
        }
        // 3. Show header when scrolling up (even slightly)
        else if (currentScrollY < scrollY - SCROLL_UP_THRESHOLD) {
          setIsHeaderVisible(true);
        }
        
        scrollY = currentScrollY <= 0 ? 0 : currentScrollY; // Prevent negative scroll
        setLastScrollY(scrollY);
        ticking = false;
      });
 
      ticking = true;
    }
  };
 
  // Set initial scroll position
  scrollY = window.scrollY;
  setLastScrollY(window.scrollY);
 
  window.addEventListener('scroll', controlNavbar, { passive: true });
  
  return () => {
    window.removeEventListener('scroll', controlNavbar);
  };
}, []); // Empty dependency array - we handle state internally

// Close location dropdown when clicking outside
useEffect(() => {
  const handleClickOutside = (event) => {
    if (showLocationDropdown && !event.target.closest('.location-dropdown-container')) {
      setShowLocationDropdown(false);
    }
  };

  document.addEventListener('mousedown', handleClickOutside);
  return () => {
    document.removeEventListener('mousedown', handleClickOutside);
  };
}, [showLocationDropdown]);

  
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    handleSearchTermChange(localSearch);
    
    // Build URL with search parameters similar to 99acres format
    const params = new URLSearchParams();
    if (localSearch) params.append('keyword', localSearch);
    if (listingType) params.append('preference', listingType === 'Buy' ? 'S' : 'R');
    
    // Navigate to search results page with all parameters
    navigate(`/search-results/${propertyType}?${params.toString()}`);
  };
 
  // Modified property type change handler to prevent auto-search
  const handlePropertyTypeButtonClick = (newType) => {
    // Update the property type in context with user triggered flag
    // Don't change URL here - let the search button handle that
    handlePropertyTypeChange(newType, true);
  };
  
  const clearSearch = () => {
    setLocalSearch('');
    handleSearchTermChange('');
  };
  
  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 bg-white shadow-md transform transition-all duration-300 ease-in-out ${
        isHeaderVisible ? 'translate-y-0' : '-translate-y-full'
      }`}
    >
      <div className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* --- Top Bar --- */}
        <div className="flex justify-between items-center py-3 sm:py-4">
          <div className="relative flex-1 min-w-0">
            <button
              onClick={() => setShowLocationDropdown(!showLocationDropdown)}
              className="flex items-center space-x-1 min-w-0 flex-1 w-full"
            >
              <MapPin size={16} className="text-blue-600 sm:w-[18px] sm:h-[18px] flex-shrink-0" />
              <span className="font-semibold text-gray-800 text-sm sm:text-base truncate">Nellore</span>
              <ChevronDown size={14} className={`sm:w-[16px] sm:h-[16px] flex-shrink-0 transition-transform ${showLocationDropdown ? 'rotate-180' : ''}`} />
            </button>
            
            {/* Location Dropdown - Instant appearance with no layout shift */}
            {showLocationDropdown && (
              <div className="absolute left-0 mt-1 w-full bg-white rounded-lg shadow-xl border border-gray-200 z-50 py-2">
                <div className="max-h-60 overflow-y-auto">
                  {popularCities.map((city) => (
                    <button
                      key={city}
                      onClick={() => {
                        setShowLocationDropdown(false);
                        // TODO: Implement location change logic
                        console.log('Location selected:', city);
                      }}
                      className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors"
                    >
                      {city}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          <div className="flex items-center space-x-3 sm:space-x-4 ml-2">
            {/* Post Property for Free Button - Enhanced for Attraction */}
            <button 
              onClick={onPostPropertyClick}
              className="hidden xs:flex items-center space-x-1.5 text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 px-3 sm:px-4 py-2 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 animate-pulse"
            >
              <Plus size={14} className="sm:w-[16px] sm:h-[16px]" />
              <span className="hidden sm:inline">Post Property FREE</span>
              <span className="xs:hidden">FREE</span>
            </button>
            
            {/* Premium and Profile Section */}
            <div className="flex items-center space-x-2">
              <button
                onClick={onPremiumClick}
                className="hidden lg:flex items-center space-x-1 text-xs sm:text-sm font-semibold text-yellow-500 px-2 py-1 rounded-full hover:bg-yellow-50 transition-colors"
              >
                <Star size={14} className="sm:w-[16px] sm:h-[16px]" />
                <span>Premium</span>
              </button>
               
              {/* Notification Bell */}
              <NotificationBell currentUser={currentUser} />

              {/* Simple Chat Button - Always visible */}
              <button
                onClick={() => {
                  if (currentUser) {
                    navigate('/chat-support');
                  } else {
                    onLoginClick();
                  }
                }}
                className="relative p-2 rounded-full transition-all duration-200 hover:bg-gradient-to-br hover:from-blue-50 hover:to-purple-50 group"
                title="Chat"
              >
                <div className="relative">
                  <MessageCircle
                    size={20}
                    className="transition-all duration-300 text-gray-600 group-hover:text-blue-600"
                  />
                  {/* Unread messages badge */}
                  <div
                    className="absolute -top-1 -right-2 min-w-[16px] h-[16px] bg-gradient-to-r from-red-500 to-orange-500 text-white text-xs font-bold rounded-full flex items-center justify-center transform shadow-lg shadow-red-500/30 ring-2 ring-white"
                  >
                    1
                  </div>
                </div>
              </button>
              

              <button
                onClick={currentUser ? () => navigate('/profile') : onLoginClick}
                className="flex flex-col items-center p-2 rounded-full hover:bg-gray-100 transition-colors group"
              >
                <User size={18} className="text-gray-700 sm:w-[20px] sm:h-[20px] group-hover:text-blue-600 transition-colors" />
                <span className="text-[10px] sm:text-xs text-gray-600 mt-0.5 font-medium">
                  Profile
                </span>
              </button>
            </div>
          </div>
        </div>
 
        {/* --- Property Type Tabs --- */}
        <div className="flex items-center justify-between overflow-x-auto pb-2 mb-3 scrollbar-hide">
          {propertyTypes.map((type) => {
            const isActive = propertyType === type.name;
            return (
              <button
                key={type.name}
                onClick={() => handlePropertyTypeButtonClick(type.name)}
                className={`flex flex-col items-center px-2 sm:px-4 py-2 transition-colors whitespace-nowrap ${
                  isActive
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-500 hover:text-gray-800'
                }`}
              >
                <type.icon size={16} className="sm:w-[20px] sm:h-[20px]" />
                <span className="text-[10px] sm:text-xs font-semibold mt-1">{type.name}</span>
              </button>
            );
          })}
        </div>
         
        {/* --- Buy/Rent/Sell Toggle --- */}
        {(
         <div className="flex justify-center items-center bg-gray-100 rounded-full p-1 mb-4 w-fit mx-auto">
          {listingTypes.map((tab) => {
            const isActive = listingType === tab;
            return (
              <button
                key={tab}
                onClick={() => handleListingTypeChange(tab)}
                className={`px-3 sm:px-6 py-2 rounded-full text-xs sm:text-sm font-bold transition-all ${
                  isActive
                    ? 'bg-white text-blue-700 shadow'
                    : 'text-gray-600'
                }`}
              >
                {tab}
              </button>
            );
          })}
        </div>
        )}
 
        {/* --- Search Bar --- */}
        <form onSubmit={handleSearchSubmit} className="relative flex items-center pb-4">
          <div className="relative w-full">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search size={18} className="text-gray-400 sm:w-[20px] sm:h-[20px]" />
            </div>
            <input
              type="text"
              name="keyword"
              id="keyword"
              autoComplete="off"
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              placeholder={`Search in ${propertyType}...`}
              className="w-full pl-10 pr-10 py-2.5 sm:py-3 text-sm text-gray-900 bg-gray-50 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 list_header_semiBold"
            />
            {localSearch && (
              <button
                type="button"
                onClick={clearSearch}
                className="absolute inset-y-0 right-0 flex items-center pr-3"
              >
                <X size={16} className="text-gray-400 hover:text-gray-600 sm:w-[18px] sm:h-[18px]" />
              </button>
            )}
          </div>
          <button
            type="button"
            onClick={onFilterClick}
            className="p-2.5 sm:p-3 ml-2 text-blue-600 bg-blue-100 rounded-full shadow hover:bg-blue-200 transition-colors"
          >
            <Filter size={18} className="sm:w-[20px] sm:h-[20px]" />
          </button>
        </form>
      </div>
    </header>
  );
}
