import React, { useEffect } from 'react';
import { ArrowLeft, MessageCircle, Clock, Users, Headphones } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ChatSupportPage = () => {
  const navigate = useNavigate();

useEffect(() => {
    // Function to initialize and show the Tawk.to widget
    const initTawkTo = () => {
      if (window.Tawk_API && typeof window.Tawk_API.showWidget === 'function') {
        window.Tawk_API.showWidget();
      }
    };

    // Load Tawk.to script if it's not already on the page
    if (!window.Tawk_API) {
      const script = document.createElement("script");
      script.async = true;
      script.src = 'https://embed.tawk.to/692ff2b5de5fd21978d17b8d/1jbhko5b0';
      script.charset = 'UTF-8';
      script.setAttribute('crossorigin', '*');
      
      // Show the widget once the script is loaded
      script.onload = initTawkTo;

      document.head.appendChild(script);
    } else {
      // If script is already there, just show the widget
      initTawkTo();
    }

    // Cleanup: Hide the widget when the component unmounts
    return () => {
      if (window.Tawk_API && typeof window.Tawk_API.hideWidget === 'function') {
        window.Tawk_API.hideWidget();
      }
    };
  }, []);

  const handleBackClick = () => {
    navigate('/profile');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <button
                onClick={handleBackClick}
                className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft className="h-5 w-5 mr-2" />
                <span className="text-sm font-medium">Back</span>
              </button>
            </div>
            <div className="flex items-center">
              <MessageCircle className="h-6 w-6 text-blue-600 mr-2" />
              <h1 className="text-xl font-semibold text-gray-900">Chat Support</h1>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
            <Headphones className="h-8 w-8 text-blue-600" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            How can we help you today?
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Connect with our support team through live chat. We're here to assist you with any questions about properties, listings, or your account.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-lg mb-4">
              <Clock className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Quick Response</h3>
            <p className="text-gray-600">
              Get instant replies to your questions during our support hours. Average response time: 2-5 minutes.
            </p>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-center w-12 h-12 bg-purple-100 rounded-lg mb-4">
              <Users className="h-6 w-6 text-purple-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Expert Support</h3>
            <p className="text-gray-600">
              Our knowledgeable support team specializes in real estate, property listings, and platform features.
            </p>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-center w-12 h-12 bg-orange-100 rounded-lg mb-4">
              <MessageCircle className="h-6 w-6 text-orange-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Live Chat</h3>
            <p className="text-gray-600">
              Real-time messaging with file sharing capabilities for screenshots and documents.
            </p>
          </div>
        </div>

        {/* Chat Widget Container */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4">
            <h3 className="text-lg font-semibold text-white">Start Your Conversation</h3>
            <p className="text-blue-100 text-sm">
              Click the chat button below to connect with our support team
            </p>
          </div>
          
          <div className="p-6">
            {/* Tawk.to chat widget will appear here */}
            <div className="bg-gray-50 rounded-lg p-8 text-center border-2 border-dashed border-gray-300">
              <MessageCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-4">
                Our live chat widget is loading...
              </p>
              <p className="text-sm text-gray-500">
                If the chat widget doesn't appear automatically, please refresh the page or try again in a moment.
              </p>
            </div>
          </div>
        </div>

        {/* Additional Help Section */}
        <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <MessageCircle className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-3">
              <h4 className="text-lg font-medium text-yellow-800 mb-2">
                Need immediate assistance?
              </h4>
              <p className="text-yellow-700 mb-4">
                If you're experiencing technical issues or need urgent support, our team is ready to help. 
                The chat widget should appear in the bottom-right corner of your screen.
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                  💬 Live Chat
                </span>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                  ⚡ Instant Response
                </span>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                  🖼️ File Sharing
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatSupportPage;