import React, { useState, useEffect, useCallback, useMemo } from 'react';
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
  const [authLoading, setAuthLoading] = useState(true);
 
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
     minBedrooms: '',
     maxBedrooms: '',
     minBathrooms: '',
     propertyType: 'any',
     propertyKind: 'any',
     latitude: '',
     longitude: '',
     radiusKm: '',
   });

   // --- Property Comparison State ---
   const [comparedProperties, setComparedProperties] = useState(() => {
     const saved = localStorage.getItem('comparedProperties');
     return saved ? JSON.parse(saved) : [];
   });

   // --- Pagination State ---
   const [currentPage, setCurrentPage] = useState(1);
   const [totalPages, setTotalPages] = useState(1);
   const [hasMore, setHasMore] = useState(false);
   // --- Notifications State ---
   const [notifications, setNotifications] = useState([]);
   const [unreadCount, setUnreadCount] = useState(0);
   const [notificationsLoading, setNotificationsLoading] = useState(false);
   const [notificationSettings, setNotificationSettings] = useState(null);

   // --- Notification Handlers ---
   const fetchNotifications = useCallback(async (filters = {}) => {
     if (!currentUser) return;
     
     setNotificationsLoading(true);
     try {
       const params = new URLSearchParams({ page: '1', limit: '50', ...filters });
       const response = await api.get(`/notifications?${params}`);
       const data = response.data;
       
       setNotifications(data.notifications || []);
       setUnreadCount(data.unreadCount || 0);
       return data;
     } catch (err) {
       console.error('Failed to fetch notifications:', err);
       return { notifications: [], unreadCount: 0 };
     } finally {
       setNotificationsLoading(false);
     }
   }, [currentUser]);

   const markNotificationAsRead = useCallback(async (notificationId) => {
     try {
       await api.put(`/notifications/${notificationId}/read`);
       setNotifications(prev => prev.map(n => 
         n.id === notificationId ? { ...n, isRead: true } : n
       ));
       setUnreadCount(prev => Math.max(0, prev - 1));
     } catch (err) {
       console.error('Failed to mark notification as read:', err);
     }
   }, []);

   const markAllNotificationsAsRead = useCallback(async () => {
     try {
       await api.put('/notifications/mark-all-read');
       setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
       setUnreadCount(0);
     } catch (err) {
       console.error('Failed to mark all notifications as read:', err);
     }
   }, []);

   const deleteNotification = useCallback(async (notificationId) => {
     try {
       await api.delete(`/notifications/${notificationId}`);
       setNotifications(prev => prev.filter(n => n.id !== notificationId));
       const notification = notifications.find(n => n.id === notificationId);
       if (notification && !notification.isRead) {
         setUnreadCount(prev => Math.max(0, prev - 1));
       }
     } catch (err) {
       console.error('Failed to delete notification:', err);
     }
   }, [notifications]);

   const fetchNotificationSettings = useCallback(async () => {
     if (!currentUser) return;
     
     try {
       const response = await api.get('/notifications/settings');
       setNotificationSettings(response.data);
       return response.data;
     } catch (err) {
       console.error('Failed to fetch notification settings:', err);
       return null;
     }
   }, [currentUser]);

   const updateNotificationSettings = useCallback(async (settings) => {
     try {
       const response = await api.put('/notifications/settings', settings);
       setNotificationSettings(response.data.settings);
       return response.data;
     } catch (err) {
       console.error('Failed to update notification settings:', err);
       throw err;
     }
   }, []);

   const addPushToken = useCallback(async (token, platform, deviceId = null) => {
     try {
       await api.post('/notifications/push-token', { token, platform, deviceId });
     } catch (err) {
       console.error('Failed to add push token:', err);
     }
   }, []);

   const enableDoNotDisturb = useCallback(async (duration = null) => {
     try {
       await api.post('/notifications/do-not-disturb', { enabled: true, duration });
       await fetchNotificationSettings();
     } catch (err) {
       console.error('Failed to enable do not disturb:', err);
     }
   }, [fetchNotificationSettings]);

   const disableDoNotDisturb = useCallback(async () => {
     try {
       await api.post('/notifications/do-not-disturb', { enabled: false });
       await fetchNotificationSettings();
     } catch (err) {
       console.error('Failed to disable do not disturb:', err);
     }
   }, [fetchNotificationSettings]);

   const getNotificationStats = useCallback(async () => {
     try {
       const response = await api.get('/notifications/stats');
       return response.data;
     } catch (err) {
       console.error('Failed to fetch notification stats:', err);
       return null;
     }
   }, []);
 
   // --- Handlers ---
   const handlePropertyTypeChange = useCallback((newType) => setPropertyType(newType), []);
   const handleListingTypeChange = useCallback((newTab) => setListingType(newTab), []);
   const handleSearchTermChange = useCallback((term) => setSearchTerm(term), []);
   const handleFilterChange = useCallback((newFilters) => {
    const { listingType, ...otherFilters } = newFilters;
    if (listingType) {
      setListingType(listingType);
    }
    setFilters(otherFilters);
   }, []);
 
   // --- Auth Functions ---
   const login = (userData, access, refresh) => {
     localStorage.setItem('accessToken', access);
     localStorage.setItem('refreshToken', refresh);
     localStorage.setItem('user', JSON.stringify(userData));
     setAccessToken(access);
     setRefreshToken(refresh);
     setCurrentUser(userData);
     setAuthLoading(false);
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
       setAuthLoading(false);
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
      // Clean up filters - remove undefined values
      const cleanFilters = {};
      Object.keys(filters).forEach(key => {
        if (filters[key] !== undefined && filters[key] !== null && filters[key] !== '') {
          cleanFilters[key] = filters[key];
        }
      });
      
      const params = new URLSearchParams({
        page: '1',
        limit: '50',
        ...cleanFilters
      });
      
      console.log('Fetching user properties with filters:', cleanFilters);
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
     const initializeAuth = async () => {
       const storedUser = localStorage.getItem('user');
       const storedToken = localStorage.getItem('accessToken');
       const refreshToken = localStorage.getItem('refreshToken');
       
       if (!storedToken || !storedUser || !refreshToken) {
         // No tokens found, clear everything
         localStorage.removeItem('accessToken');
         localStorage.removeItem('refreshToken');
         localStorage.removeItem('user');
         setAccessToken(null);
         setCurrentUser(null);
         setAuthLoading(false);
       } else {
         try {
           // Try to validate the token
           const response = await api.get('/auth/verify');
           if (response.data && response.data.user) {
             setCurrentUser(response.data.user);
             setAccessToken(storedToken);
           } else {
             // Try to refresh token
             const refreshResponse = await api.post('/auth/refresh', { refreshToken });
             if (refreshResponse.data && refreshResponse.data.accessToken) {
               localStorage.setItem('accessToken', refreshResponse.data.accessToken);
               setAccessToken(refreshResponse.data.accessToken);
               setCurrentUser(JSON.parse(storedUser));
             } else {
               throw new Error('Invalid refresh response');
             }
           }
         } catch (error) {
           console.log('Token validation/refresh failed:', error.message);
           // Clear everything on error
           localStorage.removeItem('accessToken');
           localStorage.removeItem('refreshToken');
           localStorage.removeItem('user');
           setAccessToken(null);
           setCurrentUser(null);
         } finally {
           setAuthLoading(false);
         }
       }
       fetchProperties();
     };
     
     initializeAuth();
   }, [fetchProperties]);
 
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
   const handleToggleSaved = useCallback((id) => {
     setSavedPropertyIds(prev => {
       const newSet = new Set(prev);
       if (newSet.has(id)) newSet.delete(id);
       else newSet.add(id);
       return newSet;
     });
   }, []);
 
   // --- Property Comparison Functions ---
   const addToComparison = useCallback((property) => {
     setComparedProperties(prev => {
       if (prev.length >= 4) return prev; // Max 4 properties
       if (prev.some(p => p.id === property.id)) return prev; // Already in comparison
       const newCompared = [...prev, property];
       localStorage.setItem('comparedProperties', JSON.stringify(newCompared));
       return newCompared;
     });
   }, []);
 
   const removeFromComparison = useCallback((propertyId) => {
     setComparedProperties(prev => {
       const newCompared = prev.filter(p => p.id !== propertyId);
       localStorage.setItem('comparedProperties', JSON.stringify(newCompared));
       return newCompared;
     });
   }, []);
 
   const clearComparison = useCallback(() => {
     setComparedProperties([]);
     localStorage.removeItem('comparedProperties');
   }, []);
 
   const isInComparison = useCallback((propertyId) => {
     return comparedProperties.some(p => p.id === propertyId);
   }, [comparedProperties]);
 
  const value = useMemo(() => ({
    properties, loading, error, hasMore, loadMoreProperties,
    currentUser, accessToken, token: accessToken, login, logout, handleProfileUpdate,
    API_URL, API_BASE_URL,
    savedPropertyIds, handleToggleSaved,
    comparedProperties, addToComparison, removeFromComparison, clearComparison, isInComparison,
    propertyType, handlePropertyTypeChange,
    listingType, handleListingTypeChange,
    searchTerm, handleSearchTermChange,
    filters, handleFilterChange,
    isPostWizardOpen, handleOpenPostWizard, handleClosePostWizard,
    isAuthModalOpen, handleOpenAuthModal, handleCloseAuthModal, handleLoginSuccess,
    isEditProfileModalOpen, handleOpenEditProfile, handleCloseEditProfile,
    propertyToEdit,
    handleAddProperty, handleEditProperty, handleDeleteProperty, fetchUserProperties,
    currentPage, totalPages, setCurrentPage, setTotalPages,
    authLoading,
    // Notifications
    notifications, notificationsLoading, unreadCount, notificationSettings,
    fetchNotifications, markNotificationAsRead, markAllNotificationsAsRead, deleteNotification,
    fetchNotificationSettings, updateNotificationSettings, addPushToken,
    enableDoNotDisturb, disableDoNotDisturb, getNotificationStats
  }), [
    properties, loading, error, hasMore, loadMoreProperties,
    currentUser, accessToken, login, logout, handleProfileUpdate,
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
    currentPage, totalPages,
    authLoading,
    // Notifications
    notifications, notificationsLoading, unreadCount, notificationSettings,
    fetchNotifications, markNotificationAsRead, markAllNotificationsAsRead, deleteNotification,
    fetchNotificationSettings, updateNotificationSettings, addPushToken,
    enableDoNotDisturb, disableDoNotDisturb, getNotificationStats
  ]);
 
   return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
 };
