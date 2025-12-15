 import React, { useContext, useState, useEffect } from 'react';
import { AppContext } from '../context/context';
import { useNavigate } from 'react-router-dom';
import {
  User, LogOut, Edit, Bell, Shield, FileText,
  MessageCircle, Info, Settings, ChevronRight, Crown, Plus, Home, BarChart3
} from 'lucide-react';

export default function ProfilePage() {
  const { currentUser, logout, handleOpenEditProfile, handleOpenPostWizard, authLoading } = useContext(AppContext);
  const navigate = useNavigate();
  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Handle navigation for unauthenticated users
  useEffect(() => {
    // Only redirect after authentication is finished loading
    if (!authLoading && !currentUser) {
      navigate('/login');
    }
  }, [currentUser, navigate, authLoading]);

  // Show loading spinner while authentication is being checked
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50  flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-gray-600  font-medium">Loading...</span>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return null;
  }

  const menuSections = [
    {
      title: 'Account',
      items: [
        { icon: Edit, label: 'Edit Profile', action: handleOpenEditProfile },
        { icon: Crown, label: 'Premium Plans', path: '/premium' },
        { icon: Bell, label: 'Notifications', path: '/notifications' },
      ]
    },
    {
      title: 'My Properties',
      items: [
        { icon: Home, label: 'Manage My Properties', path: '/my-listings' },
        { icon: BarChart3, label: 'Charts & Analytics', path: '/charts' },
        { icon: Plus, label: 'Post New Property', action: () => {
          if (!handleOpenPostWizard()) {
            navigate('/login');
          }
        }},
      ]
    },
    {
      title: 'Tools & Support',
      items: [
        { icon: Settings, label: 'Calculator Tools', path: '/tools' },
        { icon: MessageCircle, label: 'Chat Support', path: '/chat-support' },
      ]
    },
    {
      title: 'Security & Legal',
      items: [
        { icon: Shield, label: 'Security Settings', path: '/security' },
        { icon: FileText, label: 'Privacy Policy', path: '/privacy-policy' },
        { icon: FileText, label: 'Terms & Conditions', path: '/terms' },
        { icon: Info, label: 'About Us', path: '/about' },
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Profile Header - Now integrated with main page content */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto px-4 pt-8 pb-6">
          <div className="flex items-center space-x-4">
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-lg">
              <User size={40} className="text-blue-600" />
            </div>
            <div className="text-white">
              <h1 className="text-2xl font-bold">{currentUser.name}</h1>
              <p className="text-blue-100">{currentUser.email}</p>
              <p className="text-blue-100">{currentUser.phone}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Menu Sections */}
      <div className="max-w-4xl mx-auto px-4 pt-6">
        {menuSections.map((section, idx) => (
          <div key={idx} className="mb-6">
            <h3 className="text-sm font-semibold text-gray-500 mb-3 px-2">
              {section.title}
            </h3>
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              {section.items.map((item, itemIdx) => (
                <button
                  key={itemIdx}
                  onClick={() => item.action ? item.action() : navigate(item.path)}
                  className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0"
                >
                  <div className="flex items-center space-x-3">
                    <item.icon size={20} className="text-gray-600" />
                    <span className="font-medium text-gray-800">{item.label}</span>
                  </div>
                  <ChevronRight size={20} className="text-gray-400" />
                </button>
              ))}
            </div>
          </div>
        ))}

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center space-x-2 py-4 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl font-semibold transition-colors"
        >
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
}
