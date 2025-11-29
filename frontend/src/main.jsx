 import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import './index.css'; // Your main CSS file

// --- Layouts ---
import MainLayout from './components/layout/MainLayout';

// --- Pages (from your '/pages' folder) ---
import HomePage from './pages/HomePage';
import ProfilePage from './pages/ProfilePage';
import SavedPage from './pages/SavedPage';
import MyListingsPage from './pages/MyListingsPage';
import NotificationsPage from './pages/NotificationsPage';
import PremiumPage from './pages/PremiumPage';
import CheckoutPage from './pages/CheckoutPage';
import PaymentCheckoutPage from './pages/PaymentCheckoutPage';
import SecurityPage from './pages/SecurityPage';
import PropertyDetailPage from './pages/PropertyDetailPage';
import LoginPage from './pages/LoginPage';
import FilterPage from './pages/FilterPage';
import TransactionsPage from './pages/TransactionsPage';
import PaymentSuccessPage from './pages/PaymentSuccessPage';
import ToolsPage from './pages/ToolsPage';
import ChatPage from './pages/ChatPage';
import AboutPage from './pages/AboutPage';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import TermsPage from './pages/TermsPage';
import PropertiesPage from './pages/PropertiesPage';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    {/* 1. AppProvider wraps everything so all pages get data */}
    <AppProvider>
      {/* 2. BrowserRouter handles all routing */}
      <BrowserRouter>
        {/* 3. Routes defines all the possible pages */}
        <Routes>
          {/* 4. MainLayout wraps all pages to show Header/Footer */}
          <Route path="/" element={<MainLayout />}>
            {/* --- Your Main App Pages --- */}
            <Route index element={<HomePage />} />
            <Route path="profile" element={<ProfilePage />} />
            <Route path="saved" element={<SavedPage />} />
            <Route path="my-listings" element={<MyListingsPage />} />
            <Route path="notifications" element={<NotificationsPage />} />
            <Route path="premium" element={<PremiumPage />} />
            <Route path="checkout" element={<PaymentCheckoutPage />} />
            <Route path="transactions" element={<TransactionsPage />} />
            <Route path="payment-success" element={<PaymentSuccessPage />} />
            <Route path="security" element={<SecurityPage />} />
            <Route path="property/:id" element={<PropertyDetailPage />} />
            <Route path="properties" element={<PropertiesPage />} />
            <Route path="login" element={<LoginPage />} />
            <Route path="filter" element={<FilterPage />} />
            <Route path="tools" element={<ToolsPage />} />
            <Route path="chat" element={<ChatPage />} />
            <Route path="about" element={<AboutPage />} />
            <Route path="privacy-policy" element={<PrivacyPolicyPage />} />
            <Route path="terms" element={<TermsPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AppProvider>
  </React.StrictMode>
);