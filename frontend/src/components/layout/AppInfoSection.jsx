// src/components/layout/AppInfoSection.jsx
import React from 'react';
import { Star, Share2 } from 'lucide-react';

export default function AppInfoSection() {
  const handleFeedback = () => {
    window.location.href = 'mailto:feedback@propy.com?subject=App%20Feedback';
  };
  const handleShareApp = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Propy Real Estate App',
        text: 'Find your dream home with Propy!',
        url: window.location.href
      })
      .then(() => console.log('App shared successfully'))
      .catch((error) => console.log('Error sharing app:', error));
    } else {
      alert('Share functionality not supported on this device.');
    }
  };

  return (
    <section className="p-4 sm:p-6 mt-6 bg-white  rounded shadow-lg">
      <h2 className="text-xl sm:text-2xl font-bold text-gray-800  mb-4">App Info / Advertisement</h2>
      <p className="text-gray-600  text-sm sm:text-base mb-4">
        This section highlights key features and promotional content.
      </p>
      <div className="flex flex-col sm:flex-row items-center justify-between p-4 bg-gray-50  rounded-2xl border border-gray-200 
        <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4 mb-4 sm:mb-0">
          <div className="flex-shrink-0 text-center sm:text-left">
            <p className="text-sm font-semibold text-gray-700  with E-mail</p>
            <div className="flex text-yellow-400 space-x-1 mt-1 justify-center sm:justify-start">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={20} fill="currentColor" />
              ))}
            </div>
          </div>
          <button
            onClick={handleFeedback}
            className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-2 px-4 rounded-full shadow-md text-sm font-semibold hover:from-blue-700 hover:to-blue-900 transition-colors transform hover:scale-105"
          >
            Give Feedback
          </button>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-sm font-semibold text-gray-700  the App</span>
          <button
            onClick={handleShareApp}
            className="p-3 bg-gray-200  text-gray-700  rounded-full hover:bg-gray-300  transition-colors shadow-md"
          >
            <Share2 size={20} />
          </button>
        </div>
      </div>
    </section>
  );
}
