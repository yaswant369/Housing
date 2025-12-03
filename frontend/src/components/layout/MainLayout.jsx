import React, { useContext, useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { AppContext } from '../../context/AppContext';
import Header from './Header';
import Footer from './Footer'; 
import BottomNav from './BottomNav';
import { Toaster } from 'react-hot-toast';

// --- Import Your Modals ---
import PostPropertyWizard from '../../features/PostPropertyWizard';
import EditProfileModal from '../../features/EditProfileModal';
import PropertyComparison from '../properties/PropertyComparison';

export default function MainLayout() {
  const {
    currentUser,
    isPostWizardOpen, handleClosePostWizard, handleOpenPostWizard, propertyToEdit,
    isEditProfileModalOpen, handleCloseEditProfile, handleProfileUpdate,
    handleAddProperty, handleEditProperty,
  } = useContext(AppContext);
  
  const navigate = useNavigate();
  const location = useLocation();

  // Scroll to top whenever route changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  const hideBottomNavPaths = [
    '/property/',
    '/login',
    '/filter'
  ];

  const hideHeaderFooterPaths = [
    '/login',
    '/filter',
    '/profile'
  ];

  const hideComparisonPaths = [
    '/login',
    '/signup'
  ];

  const showBottomNav = !hideBottomNavPaths.some(path => location.pathname.startsWith(path)) && !isPostWizardOpen;
  const showHeaderFooter = !hideHeaderFooterPaths.some(path => location.pathname.startsWith(path)) && !isPostWizardOpen;
  const showComparison = !hideComparisonPaths.some(path => location.pathname.startsWith(path));
  const isFullScreen = hideHeaderFooterPaths.some(path => location.pathname.startsWith(path)) || isPostWizardOpen;

  return (
    <div className={`flex flex-col min-h-screen ${showBottomNav ? 'pb-16' : ''}`}>
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
      {showHeaderFooter && (
        <Header
          currentUser={currentUser}
          onLoginClick={() => navigate('/login')}
          onPostPropertyClick={() => handleOpenPostWizard()}
          onPremiumClick={() => navigate('/premium')}
          onFilterClick={() => navigate('/filter')}
        />
      )}
      
      <div className={`${isFullScreen ? 'w-full' : 'w-full mt-6 sm:mt-8 md:mt-10 lg:mt-12'} flex-grow ${showHeaderFooter && !isPostWizardOpen ? 'pt-40 sm:pt-44 md:pt-48 lg:pt-52 xl:pt-56' : ''}`}>
        <Outlet />
      </div>

      {showHeaderFooter && <Footer />}
      
      {showBottomNav && <BottomNav />}

      {/* --- Render Modals Controlled by Context --- */}
      {/* Auth modal removed - now using /login route */}

      {isPostWizardOpen && (
        <PostPropertyWizard
          onClose={handleClosePostWizard}
          onAddProperty={handleAddProperty}
          onEditProperty={handleEditProperty}
          existingProperty={propertyToEdit}
        />
      )}

      {isEditProfileModalOpen && currentUser && (
        <EditProfileModal
          onClose={handleCloseEditProfile}
          currentUser={currentUser}
          onProfileUpdate={handleProfileUpdate}
        />
      )}

      {showComparison && <PropertyComparison />}
    </div>
  );
}