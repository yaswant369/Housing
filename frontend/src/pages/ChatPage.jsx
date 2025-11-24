import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, MessageCircle, Phone, Mail, Clock } from 'lucide-react';

export default function ChatPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-16">
      <header className="bg-white dark:bg-gray-800 shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center">
          <button 
            onClick={() => navigate('/profile')}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg mr-4"
          >
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Chat Support</h1>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-8 text-center">
          <div className="w-20 h-20 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-6">
            <MessageCircle size={40} className="text-blue-600 dark:text-blue-400" />
          </div>
          
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            We're Here to Help!
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
            Our support team is available to assist you with any questions or concerns.
          </p>

          <div className="space-y-4 max-w-md mx-auto">
            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="flex items-center space-x-3">
                <Phone size={20} className="text-blue-600" />
                <div className="text-left">
                  <p className="text-sm text-gray-600 dark:text-gray-400">Call Us</p>
                  <p className="font-semibold text-gray-900 dark:text-white">+91 98765 43210</p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="flex items-center space-x-3">
                <Mail size={20} className="text-blue-600" />
                <div className="text-left">
                  <p className="text-sm text-gray-600 dark:text-gray-400">Email Us</p>
                  <p className="font-semibold text-gray-900 dark:text-white">support@housing.com</p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="flex items-center space-x-3">
                <Clock size={20} className="text-blue-600" />
                <div className="text-left">
                  <p className="text-sm text-gray-600 dark:text-gray-400">Working Hours</p>
                  <p className="font-semibold text-gray-900 dark:text-white">Mon-Sat: 9 AM - 6 PM</p>
                </div>
              </div>
            </div>
          </div>

          <button className="mt-8 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg transition-colors">
            Start Live Chat
          </button>
        </div>
      </div>
    </div>
  );
}
