import React, { useState, useEffect, useCallback } from 'react';
import api from '../utils/api'; // Import the api instance
import { API_URL, API_BASE_URL } from './constants';
import { AppContext } from './context';
export { AppContext };
 
 export const AppProvider = ({ children }) => {
   const [properties, setProperties] = useState([]);
   const [loading, setLoading] = useState(true);
   const [error, setError] = useState(null);
   const [savedPropertyIds, setSavedPropertyIds] = useState(new Set());
 
   // --- Auth State ---
   const [currentUser, setCurrentUser] = useState(null);
  const [accessToken, setAccessToken] = useState(localStorage.getItem('accessToken'));
  const [, setRefreshToken] = useState(localStorage.getItem('refreshToken'));
 
   // --- Modal States ---
   const [isPostWizardOpen, setIsPostWizardOpen] = useState(false);
   const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
   const [isEditProfileModalOpen, setIsEditProfileModalOpen] = useState(false);
   const [propertyToEdit, setPropertyToEdit] = useState(null); // For editing a property
 
   // --- Filter/Search State ---
   const [propertyType, setPropertyType] = useState('Residential');
   const [listingType, setListingType] = useState('Buy');
   const [searchTerm, setSearchTerm] = useState('');
   const [filters, setFilters] = useState({
     bhk: 'any',
     furnishing: 'any',
     minPrice: '',
     maxPrice: '',
   });
 
   // --- Pagination State ---
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
   const [hasMore, setHasMore] = useState(false);
 
   // --- Handlers ---
   const handlePropertyTypeChange = (newType) => setPropertyType(newType);
   const handleListingTypeChange = (newTab) => setListingType(newTab);
   const handleSearchTermChange = (term) => setSearchTerm(term);
   const handleFilterChange = (newFilters) => {
    const { listingType, ...otherFilters } = newFilters;
    if (listingType) {
      setListingType(listingType);
    }
    setFilters(otherFilters);
   };
 
   // --- Auth Functions ---
   const login = (userData, access, refresh) => {
     localStorage.setItem('accessToken', access);
     localStorage.setItem('refreshToken', refresh);
     localStorage.setItem('user', JSON.stringify(userData));
     setAccessToken(access);
     setRefreshToken(refresh);
     setCurrentUser(userData);
   };
 
   const logout = useCallback(async () => {
     try {
       await api.post('/auth/logout');
     } catch (e) {
       console.error('Logout failed', e);
     } finally {
       localStorage.removeItem('accessToken');
       localStorage.removeItem('refreshToken');
       localStorage.removeItem('user');
       setAccessToken(null);
       setRefreshToken(null);
       setCurrentUser(null);
     }
   }, []);
 
   const handleProfileUpdate = (updatedUser) => {
     setCurrentUser(updatedUser);
     localStorage.setItem('user', JSON.stringify(updatedUser));
   };
 
   // --- Modal Handlers ---
   const handleOpenPostWizard = (property = null) => {
     if (property) {
       setPropertyToEdit(property);
     } else {
       setPropertyToEdit(null);
     }
     setIsPostWizardOpen(true);
   };
   const handleClosePostWizard = () => setIsPostWizardOpen(false);
   const handleOpenAuthModal = () => setIsAuthModalOpen(true);
   const handleCloseAuthModal = () => setIsAuthModalOpen(false);
   const handleOpenEditProfile = () => setIsEditProfileModalOpen(true);
   const handleCloseEditProfile = () => setIsEditProfileModalOpen(false);
 
   // Handle successful login/signup
   const handleLoginSuccess = (data) => {
     login(data.user, data.accessToken, data.refreshToken);
     handleCloseAuthModal();
   };
 
   // --- Data Processing Helper ---
   const processProperties = (data) => {
     const propertiesArray = Array.isArray(data) ? data : data.properties;
     if (!Array.isArray(propertiesArray)) return [];
     return propertiesArray.map(p => ({
       ...p,
       priceValue: parseFloat(p.price.replace(/[^0-9.-]+/g, '')) * (p.price.includes('Cr') ? 10000000 : (p.price.includes('L') ? 100000 : 1)),
       propertyType: p.propertyType || 'Residential'
     }));
   };
 
   // --- Data Fetching ---
   const fetchProperties = useCallback(async () => {
     setLoading(true);
     try {
       const response = await api.get('/properties?page=1');
       const data = response.data;
       setProperties(processProperties(data));
       setCurrentPage(data.currentPage);
       setTotalPages(data.totalPages);
       setHasMore(data.currentPage < data.totalPages);
       setError(null);
     } catch (err) {
       setError(err.message);
     }
     setLoading(false);
   }, []);
 
   // --- Fetch User Properties (for MyListingsPage) - IMPROVED VERSION ---
  const fetchUserProperties = useCallback(async (filters = {}) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: '1',
        limit: '50',
        ...filters
      });
      
      console.log('Fetching user properties with filters:', filters);
      const response = await api.get(`/properties/user/my-properties?${params}`);
      const data = response.data;
      
      // Process properties and ensure data consistency
      const processedProps = processProperties(data);
      setProperties(processedProps);
      setError(null);
      
      console.log(`Successfully fetched ${processedProps.length} properties for user`);
      return data;
    } catch (err) {
      console.error('Failed to fetch user properties:', err);
      
      // More specific error handling
      if (err.response?.status === 401) {
        setError('Authentication required. Please login again.');
        logout(); // Auto logout on auth error
      } else if (err.response?.status === 403) {
        setError('Access denied. Please check your permissions.');
      } else {
        setError(err.message || 'Failed to fetch properties');
      }
      
      return { properties: [], totalCount: 0 };
    } finally {
      setLoading(false);
    }
  }, [logout]);

  // --- Initial Load (Auth + Properties) ---
   useEffect(() => {
     const storedUser = localStorage.getItem('user');
     if (accessToken && storedUser) {
       setCurrentUser(JSON.parse(storedUser));
     }
     fetchProperties();
   }, [accessToken, fetchProperties]);
 
   // --- Load More Properties ---
   const loadMoreProperties = useCallback(async () => {
     if (loading || !hasMore) return;
     setLoading(true);
     try {
       const nextPage = currentPage + 1;
       const response = await api.get(`/properties?page=${nextPage}`);
       const data = response.data;
       setProperties(prev => [...prev, ...processProperties(data)]);
       setCurrentPage(data.currentPage);
       setHasMore(data.currentPage < data.totalPages);
     } catch (err) {
       setError(err.message);
     }
     setLoading(false);
   }, [currentPage, hasMore, loading]);
 
   // --- CRUD Operations (Post/Edit Property) ---
   const handleAddProperty = async (formData) => {
     try {
       const response = await api.post('/properties', formData, {
         headers: { 'Content-Type': 'multipart/form-data' }
       });
       const newProperty = response.data;
        
        // Add the new property to the current properties state for immediate UI update
        setProperties(prev => [newProperty, ...prev]);
        
        // Also refresh the user properties specifically to ensure consistency
        try {
          await fetchUserProperties();
        } catch (refreshError) {
          console.warn('Failed to refresh user properties:', refreshError);
        }
        
        return newProperty;

     } catch (err) {
      if (err.response && err.response.status === 401) {
        logout();
      }
       console.error(err);
       setError(err.message);
       throw err; // Re-throw to let the wizard handle the error
     }
   };
 
  const handleEditProperty = async (id, formData) => {
    try {
      const response = await api.put(`/properties/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      const updatedProperty = response.data;
      setProperties((prev) =>
        prev.map((p) => (p.id === id ? updatedProperty : p))
      );
    } catch (err) {
      if (err.response && err.response.status === 401) {
        logout();
      }
      console.error(err);
      setError(err.message);
    }
  };

  const handleDeleteProperty = async (id) => {
    try {
      await api.delete(`/properties/${id}`);
      setProperties(prev => prev.filter(p => p.id !== id));
    } catch (err) {
      if (err.response && err.response.status === 401) {
        logout();
      }
      console.error(err);
      setError(err.message);
      throw err;
    }
  };
 
   // --- Saved Properties ---
   const handleToggleSaved = (id) => {
     setSavedPropertyIds(prev => {
       const newSet = new Set(prev);
       if (newSet.has(id)) newSet.delete(id);
       else newSet.add(id);
       return newSet;
     });
   };
 
  const value = {
    properties, loading, error, hasMore, loadMoreProperties,
    currentUser, accessToken: accessToken, token: accessToken, login, logout, handleProfileUpdate,
    API_URL, API_BASE_URL,
    savedPropertyIds, handleToggleSaved,
    propertyType, handlePropertyTypeChange,
    listingType, handleListingTypeChange,
    searchTerm, handleSearchTermChange,
    filters, handleFilterChange,
    isPostWizardOpen, handleOpenPostWizard, handleClosePostWizard,
    isAuthModalOpen, handleOpenAuthModal, handleCloseAuthModal, handleLoginSuccess,
    isEditProfileModalOpen, handleOpenEditProfile, handleCloseEditProfile,
    propertyToEdit,
    handleAddProperty, handleEditProperty, handleDeleteProperty, fetchUserProperties,
    currentPage, totalPages, setCurrentPage, setTotalPages
  };
 
   return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
 };