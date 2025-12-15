import React, { useContext } from 'react';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import { AppProvider, AppContext } from './context/AppContext';
import { NotificationProvider } from './context/NotificationContext';
import { SearchProvider } from './contexts/SearchContext';
import { ChatProvider } from './context/ChatContext';
import { SettingsProvider } from './context/SettingsContext';
import { Toaster } from 'react-hot-toast';

// Import Your Components
import MainLayout from './components/layout/MainLayout';
import HomePage from './pages/HomePage';
import PropertyDetailWrapper from './pages/PropertyDetailWrapper';
import SavedPage from './pages/SavedPage';
import ProfilePage from './pages/ProfilePage';
import PropertiesPage from './pages/PropertiesPage';
import MyListingsPage from './pages/MyListingsPage';
import PropertyEditPageWrapper from './pages/PropertyEditPageWrapper';
import LoginPage from './pages/LoginPage';
import AboutPage from './pages/AboutPage';
import ChatPage from './pages/ChatPage';
import ChatSupportPage from './pages/ChatSupportPage';
import CheckoutPage from './pages/CheckoutPage';
import FilterPage from './pages/FilterPage';
import NotificationsPage from './pages/NotificationsPage';
import NotificationSettingsPage from './pages/NotificationSettingsPage';
import PaymentCheckoutPage from './pages/PaymentCheckoutPage';
import PaymentSuccessPage from './pages/PaymentSuccessPage';
import PremiumFeature from './pages/PremiumFeature';
import PremiumPage from './pages/PremiumPage';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import SecurityPage from './pages/SecurityPage';
import TermsPage from './pages/TermsPage';
import ToolsPage from './pages/ToolsPage';
import TransactionsPage from './pages/TransactionsPage';
import AgentsPage from './pages/AgentsPage';
import ContactPage from './pages/ContactPage';
import BlogPage from './pages/BlogPage';
import CareersPage from './pages/CareersPage';
import FAQPage from './pages/FAQPage';
import SitemapPage from './pages/SitemapPage';
import LinksPage from './pages/LinksPage';
import SearchResultsPage from './pages/SearchResultsPage';
import PropertyMarketingPage from './pages/PropertyMarketingPage';
import ChartPage from './pages/ChartPage';

// Test Components
import MediaUploaderTest from './test/MediaUploaderTest';
import MediaBoxDemo from './pages/MediaBoxDemo';

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
          onClose={handleCloseEditProfile}
          currentUser={currentUser}
          onProfileUpdate={handleProfileUpdate}
        />
      )}
    </>
  );
}

// This is the main App component
function App() {
  return (
    <div className="min-h-screen font-sans antialiased flex flex-col bg-gray-100 text-gray-800">
      <Routes>
        <Route path="/" element={<MainLayout />}>
          {/* Main Pages */}
          <Route index element={<HomePage />} />
          <Route path="property/:id" element={<PropertyDetailWrapper />} />
          <Route path="properties" element={<PropertiesPage />} />
          <Route path="search" element={<SearchResultsPage />} />
          <Route path="property-search" element={<SearchResultsPage />} />
          <Route path="search-results/:propertyType?" element={<SearchResultsPage />} />
          <Route path="saved" element={<SavedPage />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="my-listings" element={<MyListingsPage />} />
          <Route path="my-listings/edit/:propertyId" element={<PropertyEditPageWrapper />} />
          <Route path="chat-support" element={<ChatSupportPage />} />
          
          {/* Authentication & Account */}
          <Route path="login" element={<LoginPage />} />
          
          {/* Property Management */}
          <Route path="filter" element={<FilterPage />} />
          <Route path="chat" element={<ChatPage />} />
          
          {/* Premium & Payments */}
          <Route path="premium" element={<PremiumPage />} />
          <Route path="premium-features" element={<PremiumFeature />} />
          <Route path="checkout" element={<CheckoutPage />} />
          <Route path="payment-checkout" element={<PaymentCheckoutPage />} />
          <Route path="payment-success" element={<PaymentSuccessPage />} />
          <Route path="transactions" element={<TransactionsPage />} />
          
          {/* Tools & Utilities */}
          <Route path="tools" element={<ToolsPage />} />
          
          {/* System Pages */}
          <Route path="about" element={<AboutPage />} />
          <Route path="notifications" element={<NotificationsPage />} />
          <Route path="notification-settings" element={<NotificationSettingsPage />} />
          <Route path="security" element={<SecurityPage />} />
          <Route path="privacy" element={<PrivacyPolicyPage />} />
          <Route path="terms" element={<TermsPage />} />
          
          {/* Footer Pages */}
          <Route path="agents" element={<AgentsPage />} />
          <Route path="contact" element={<ContactPage />} />
          <Route path="blog" element={<BlogPage />} />
          <Route path="careers" element={<CareersPage />} />
          <Route path="faq" element={<FAQPage />} />
          <Route path="sitemap" element={<SitemapPage />} />
          <Route path="links" element={<LinksPage />} />
          <Route path="property-marketing" element={<PropertyMarketingPage />} />

          {/* Test Routes - Remove in production */}
          <Route path="test-media-uploader" element={<MediaUploaderTest />} />
          {/* Charting and Analytics */}
          <Route path="charts" element={<ChartPage />} />
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
        <SearchProvider>
          <NotificationProvider>
            <SettingsProvider>
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
              <ChatProvider>
                <App />
              </ChatProvider>
            </SettingsProvider>
          </NotificationProvider>
        </SearchProvider>
      </AppProvider>
    </BrowserRouter>
  );
}
