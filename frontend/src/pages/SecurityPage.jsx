// src/SecurityPage.jsx
import React from 'react';
import { ArrowLeft, Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function SecurityPage() {
  const navigate = useNavigate();

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      {/* Header */}
      <header className="flex items-center p-4 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
        <button 
          onClick={() => navigate(-1)} // Navigates back
          className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
        >
          <ArrowLeft size={20} />
        </button>
        <div className="flex-1 text-center">
          <h2 className="font-bold text-lg">Security & Privacy</h2>
        </div>
        <div className="w-8"></div>
      </header>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="flex flex-col items-center justify-center h-full text-center text-gray-500 dark:text-gray-400">
          <Shield size={64} className="mb-4" />
          <h3 className="text-2xl font-bold mb-2">Security & Privacy</h3>
          <p className="max-w-xs">
            This page will contain options for changing your password,
            managing privacy settings, and two-factor authentication.
          </p>
        </div>
      </div>
    </div>
  );
}