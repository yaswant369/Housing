import React, { useContext } from 'react';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import { AppProvider, AppContext } from './context/AppContext';
import { Toaster } from 'react-hot-toast';

// Import Your Components
import MainLayout from './components/layout/MainLayout';
import HomePage from './pages/HomePage';
import PropertyDetailWrapper from './pages/PropertyDetailWrapper';
import SavedPage from './pages/SavedPage';
import ProfilePage from './pages/ProfilePage';
// ... import other pages

// Modals
import PostPropertyWizard from './features/PostPropertyWizard';
import AuthModal from './features/AuthModal';
import FilterModal from './features/FilterModal';
import EditProfileModal from './features/EditProfileModal';

// This component now reads from the context to render modals
function AppModals() {
  const {
    isPostWizardOpen, handleOpenPostWizard, handleClosePostWizard, handleAddProperty, handleEditProperty, propertyToEdit,
     isAuthModalOpen, handleOpenAuthModal, handleCloseAuthModal, handleLoginSuccess,
     filters, handleCloseFilterModal, handleApplyFilters,
     isEditProfileModalOpen, handleOpenEditProfile, handleCloseEditProfile, currentUser, handleProfileUpdate
  } = useContext(AppContext);

  // --- NAVIGATION LOGIC MOVED HERE ---
  // This is allowed because AppModals is rendered inside <App />, which is inside <Routes />
  const navigate = useNavigate();

  const onLoginSuccess = (token, user) => {
    handleLoginSuccess(token, user);
    navigate(-1); // Go back to the previous page after login
  };

  return (
    <>
      {isPostWizardOpen && (
       <PostPropertyWizard 
         onClose={handleClosePostWizard} 
         onAddProperty={handleAddProperty}
         onEditProperty={handleEditProperty}
         existingProperty={propertyToEdit}
       />
      )}
      {isAuthModalOpen && (
        <AuthModal 
          onClose={handleCloseAuthModal}
          onLoginSuccess={onLoginSuccess} // Use the new handler
        />
      )}
      {filters.isFilterModalOpen && (
        <FilterModal 
          onClose={handleCloseFilterModal}
          onApplyFilters={handleApplyFilters}
          currentFilters={filters}
        />
      )}
      {isEditProfileModalOpen && currentUser && (
        <EditProfileModal
          onClose={handleCloseEditProfileModal}
          currentUser={currentUser}
          onProfileUpdate={handleProfileUpdate}
        />
      )}
    </>
  );
}

// This is the main App component
function App() {
  const { isDarkMode } = useContext(AppContext);
  const themeClasses = isDarkMode ? 'bg-gray-900 text-gray-100' : 'bg-gray-100 text-gray-800';

  return (
    <div className={`min-h-screen font-sans antialiased flex flex-col ${themeClasses}`}>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<HomePage />} />
          <Route path="property/:id" element={<PropertyDetailWrapper />} />
          <Route path="saved" element={<SavedPage />} />
          <Route path="profile" element={<ProfilePage />} />

          {/* <Route path="notifications" element={<NotificationsPage />} /> */}
          {/* <Route path="security" element={<SecurityPage />} /> */}
          {/* <Route path="premium" element={<PremiumFeature />} /> */}
        </Route>
      </Routes>
      
      {/* Modals are rendered here, outside the main routes */}
      <AppModals />
    </div>
  );
}

// This is the default export that wraps everything
export default function AppWrapper() {
  return (
    <BrowserRouter>
      <AppProvider>
        <Toaster 
          position="bottom-center"
          toastOptions={{
            duration: 3000,
            style: {
              background: '#333',
              color: '#fff',
            },
          }}
        />
        <App />
      </AppProvider>
    </BrowserRouter>
  );
}