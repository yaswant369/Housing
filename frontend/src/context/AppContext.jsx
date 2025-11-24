 import React, { useState, createContext, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

export const AppContext = createContext();

// Use Vite's env variable for API URL
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

export const AppProvider = ({ children }) => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [savedPropertyIds, setSavedPropertyIds] = useState(new Set());

  // --- Auth State ---
  const [currentUser, setCurrentUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));

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
  const handleFilterChange = (newFilters) => setFilters(newFilters);

  // --- Auth Functions ---
  const login = (userData, userToken) => {
    localStorage.setItem('token', userToken);
    localStorage.setItem('user', JSON.stringify(userData));
    setToken(userToken);
    setCurrentUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setCurrentUser(null);
    // Optionally, navigate to home
  };

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
  const handleLoginSuccess = (userToken, userData) => {
    login(userData, userToken);
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
      const response = await fetch(`${API_URL}/properties?page=1`);
      if (!response.ok) throw new Error('Network response was not ok');
      const data = await response.json();
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

  // --- Initial Load (Auth + Properties) ---
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (token && storedUser) {
      setCurrentUser(JSON.parse(storedUser));
    }
    fetchProperties();
  }, [token, fetchProperties]);

  // --- Load More Properties ---
  const loadMoreProperties = useCallback(async () => {
    if (loading || !hasMore) return;
    setLoading(true);
    try {
      const nextPage = currentPage + 1;
      const response = await fetch(`${API_URL}/properties?page=${nextPage}`);
      if (!response.ok) throw new Error('Network response was not ok');
      const data = await response.json();
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
      const response = await fetch(`${API_URL}/properties`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData,
      });
      if (!response.ok) throw new Error('Failed to post property');
      const newProperty = await response.json();
      setProperties(prev => [newProperty, ...prev]); // Add new property to list
    } catch (err) {
      console.error(err);
      setError(err.message);
    }
  };

  const handleEditProperty = async (id, formData) => {
    try {
      const response = await fetch(`${API_URL}/properties/${id}`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData,
      });
      if (!response.ok) throw new Error('Failed to update property');
      const updatedProperty = await response.json();
      setProperties(prev => 
        prev.map(p => (p.id === id ? updatedProperty : p))
      );
    } catch (err) {
      console.error(err);
      setError(err.message);
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
    currentUser, token, login, logout, handleProfileUpdate,
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
    handleAddProperty, handleEditProperty,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};