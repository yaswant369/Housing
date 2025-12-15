import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft, MessageSquare, Headset, X
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function ChatSupportPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('help-center');
  const [tawkLoaded, setTawkLoaded] = useState(false);

  // Initialize Tawk.to chat
  useEffect(() => {
    // Check if Tawk.to script is already loaded
    if (window.Tawk_API) {
      setTawkLoaded(true);
      // Show the widget when on chat support page
      window.Tawk_API.showWidget();
      return;
    }

    // Create script element
    const script = document.createElement('script');
    script.async = true;
    script.src = 'https://embed.tawk.to/692ff2b5de5fd21978d17b8d/1jbhko5b0';
    script.charset = 'UTF-8';
    script.setAttribute('crossorigin', '*');

    // Add script to document
    document.body.appendChild(script);

    // Set up Tawk.to when loaded
    script.onload = () => {
      setTawkLoaded(true);
      if (window.Tawk_API) {
        window.Tawk_API.onLoad = function() {
          // Customize chat widget
          window.Tawk_API.setAttributes({
            name: 'Customer',
            email: 'customer@example.com'
          }, function(error) {
            if (error) {
              console.error('Tawk.to error:', error);
            }
          });
          // Show the widget when on chat support page
          window.Tawk_API.showWidget();
        };
      }
    };

    // Cleanup - hide widget when leaving the page
    return () => {
      if (window.Tawk_API) {
        window.Tawk_API.hideWidget();
      }
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  // Function to open Tawk.to chat
  const openTawkChat = () => {
    if (window.Tawk_API) {
      window.Tawk_API.maximize();
      window.Tawk_API.showWidget();
    } else {
      toast.info('Loading live chat...');
    }
  };

  // Function to hide Tawk.to chat
  const hideTawkChat = () => {
    if (window.Tawk_API) {
      window.Tawk_API.hideWidget();
    }
  };

  // FAQ items
  const faqItems = [
    {
      question: 'How do I list my property?',
      answer: 'You can list your property by clicking "Post Property" in the header and following the step-by-step wizard.'
    },
    {
      question: 'What are the premium features?',
      answer: 'Premium features include advanced analytics, priority listings, and dedicated account management.'
    },
    {
      question: 'How does the chat system work?',
      answer: 'Our chat system connects you with agents and property owners in real-time for instant communication.'
    },
    {
      question: 'What payment methods do you accept?',
      answer: 'We accept all major credit cards, bank transfers, and digital payment methods.'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Back Button */}
        <div className="mb-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center space-x-2 text-blue-600  hover:text-blue-700  transition-colors"
          >
            <ArrowLeft size={20} />
            <span className="font-medium">Back</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Sidebar - Support Options */}
          <div className="lg:col-span-1 space-y-6">
            {/* Support Header */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 text-white">
              <h2 className="text-xl font-bold mb-4">Support Center</h2>
              <p className="text-blue-100 mb-6">Connect with our support team</p>

              {/* Support Tabs */}
              <div className="space-y-2">
                <button
                  onClick={() => setActiveTab('help-center')}
                  className={`w-full flex items-center justify-between p-3 rounded-lg transition-colors ${
                    activeTab === 'help-center' ? 'bg-white text-blue-600' : 'hover:bg-white/10'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <Headset size={18} />
                    <span className="font-medium">Help Center</span>
                  </div>
                  <span className="bg-yellow-500 text-white text-xs font-bold px-2 py-1 rounded-full">FAQ</span>
                </button>

                {/* Tawk.to Live Chat Button */}
                <button
                  onClick={openTawkChat}
                  className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-white/10 transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <MessageSquare size={18} />
                    <span className="font-medium">Live Chat (Tawk.to)</span>
                  </div>
                  <span className="bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full">24/7</span>
                </button>
              </div>
            </div>

            {/* FAQ Section */}
            <div className="bg-white  rounded-xl shadow-sm p-4">
              <h3 className="font-semibold text-gray-900  mb-4 flex items-center space-x-2">
                <Headset size={18} className="text-blue-600" />
                <span>Frequently Asked Questions</span>
              </h3>

              <div className="space-y-3">
                {faqItems.map((item, index) => (
                  <div key={index} className="border border-gray-100  rounded-lg">
                    <button
                      onClick={() => navigate('/faq')}
                      className="w-full flex items-center justify-between p-3 text-left hover:bg-gray-50 transition-colors"
                    >
                      <span className="font-medium text-gray-900">{item.question}</span>
                      <span className="text-blue-600">→</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-2">
            {/* Help Center Content */}
            {activeTab === 'help-center' && (
              <div className="bg-white  rounded-xl shadow-sm p-6">
                <h2 className="text-xl font-bold text-gray-900  mb-4">Welcome to Help Center</h2>
                <p className="text-gray-500  mb-6">Find answers to common questions and get support</p>

                <div className="space-y-4">
                  <div className="bg-blue-50  p-4 rounded-lg">
                    <h3 className="font-semibold text-gray-900  mb-2">Need immediate help?</h3>
                    <p className="text-gray-600  mb-3">Click the button below to start a live chat with our support team.</p>
                    <button
                      onClick={openTawkChat}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                    >
                      Start Live Chat
                    </button>
                  </div>

                  <div className="bg-green-50  p-4 rounded-lg">
                    <h3 className="font-semibold text-gray-900  mb-2">Browse FAQ</h3>
                    <p className="text-gray-600  mb-3">Visit our comprehensive FAQ section for detailed answers.</p>
                    <button
                      onClick={() => navigate('/faq')}
                      className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors font-medium"
                    >
                      Visit FAQ Page
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
