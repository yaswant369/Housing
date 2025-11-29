  import React, { useState, useEffect } from 'react';
 import { useNavigate } from 'react-router-dom';
 import { 
   Search, Filter, X, MapPin, Building, Home, 
   Map, Users, Briefcase, ChevronDown, User, Plus, Star
 } from 'lucide-react';
 import { AppContext } from '../../context/AppContext';
 import { useContext } from 'react';
 
 const propertyTypes = [
   { name: 'Residential', icon: Home },
   { name: 'Commercial', icon: Briefcase },
   { name: 'Plots', icon: Map },
   { name: 'PG', icon: Users },
   { name: 'Projects', icon: Building },
 ];
 const listingTypes = ['Buy', 'Rent', 'Sell'];
 
 
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
 
 // --- The Fixed useEffect Hook ---
 useEffect(() => {
   let ticking = false;
   
   // Define the scroll point where the header should start hiding.
   const HIDE_THRESHOLD = 200; 
 
   const controlNavbar = () => {
     if (!ticking) {
       window.requestAnimationFrame(() => {
         const currentScrollY = window.scrollY;
         
         // 1. Always show header when at or near the top
         if (currentScrollY <= HIDE_THRESHOLD) {
           setIsHeaderVisible(true);
         }
         // 2. Hide header when scrolling down past the threshold
         // This implicitly keeps it hidden when scrolling up mid-page.
         else if (currentScrollY > lastScrollY) {
           setIsHeaderVisible(false);
         } 
         
         setLastScrollY(currentScrollY);
         ticking = false;
       });
 
       ticking = true;
     }
   };
 
   window.addEventListener('scroll', controlNavbar, { passive: true });
   
   return () => {
     window.removeEventListener('scroll', controlNavbar);
   };
 }, [lastScrollY]); // lastScrollY dependency is fine here
 
 
   const handleSearchSubmit = (e) => {
     e.preventDefault();
     handleSearchTermChange(localSearch);
   };
   
   const clearSearch = () => {
     setLocalSearch('');
     handleSearchTermChange('');
   };
 
   return (
     <header 
       className={`fixed top-0 left-0 right-0 z-50 bg-white dark:bg-gray-900 shadow-md pb-4 transform transition-all duration-300 ease-in-out ${
         isHeaderVisible ? 'translate-y-0' : '-translate-y-full'
       }`}
     >
       <div className="p-4 max-w-7xl mx-auto">
         {/* --- Top Bar --- */}
         <div className="flex justify-between items-center mb-4">
           <button className="flex items-center space-x-1">
             <MapPin size={18} className="text-blue-600" />
             <span className="font-semibold text-gray-800 dark:text-gray-100">Nellore</span>
             <ChevronDown size={16} />
           </button>
           
           <div className="flex items-center space-x-3">
             <button 
               onClick={onPremiumClick}
               className="hidden sm:flex items-center space-x-1 text-sm font-semibold text-yellow-500"
             >
               <Star size={16} />
               <span>Premium</span>
             </button>
             <button 
               onClick={onPostPropertyClick}
               className="hidden sm:flex items-center space-x-1 text-sm font-semibold text-blue-600"
             >
               <Plus size={16} />
               <span>Post</span>
             </button>
             <button onClick={currentUser ? () => navigate('/profile') : onLoginClick} className="flex items-center">
               <User size={20} className="text-gray-700 dark:text-gray-200" />
             </button>
           </div>
         </div>
 
         {/* --- Property Type Tabs --- */}
         <div className="flex items-center justify-between overflow-x-auto mb-3">
           {propertyTypes.map((type) => {
             const isActive = propertyType === type.name;
             return (
               <button
                 key={type.name}
                 onClick={() => handlePropertyTypeChange(type.name)}
                 className={`flex flex-col items-center px-4 py-2 transition-colors ${
                   isActive
                     ? 'text-blue-600 border-b-2 border-blue-600'
                     : 'text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-100'
                 }`}
               >
                 <type.icon size={20} />
                 <span className="text-xs font-semibold mt-1">{type.name}</span>
               </button>
             );
           })}
         </div>
         
         {/* --- Buy/Rent/Sell Toggle --- */}
         {(
            <div className="flex justify-center items-center bg-gray-100 dark:bg-gray-800 rounded-full p-1 mb-4 w-fit mx-auto">
             {listingTypes.map((tab) => {
               const isActive = listingType === tab;
               return (
                 <button
                   key={tab}
                   onClick={() => handleListingTypeChange(tab)}
                   className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${
                     isActive
                       ? 'bg-white text-blue-700 shadow'
                       : 'text-gray-600 dark:text-gray-300'
                   }`}
                 >
                   {tab}
                 </button>
               );
             })}
           </div>
         )}
 
         {/* --- Search Bar --- */}
         <form onSubmit={handleSearchSubmit} className="relative flex items-center">
           <div className="relative w-full">
             <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
               <Search size={20} className="text-gray-400" />
             </div>
             <input
               type="text"
               value={localSearch}
               onChange={(e) => setLocalSearch(e.target.value)}
               placeholder={`Search in ${propertyType}...`}
               className="w-full pl-10 pr-10 py-3 text-sm text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
             />
             {localSearch && (
               <button
                 type="button"
                 onClick={clearSearch}
                 className="absolute inset-y-0 right-0 flex items-center pr-3"
               >
                 <X size={18} className="text-gray-400 hover:text-gray-600" />
               </button>
             )}
           </div>
           <button
             type="button"
             onClick={onFilterClick}
             className="p-3 ml-2 text-blue-600 bg-blue-100 dark:bg-gray-700 dark:text-blue-400 rounded-full shadow"
           >
             <Filter size={20} />
           </button>
         </form>
       </div>
     </header>
   );
 }   