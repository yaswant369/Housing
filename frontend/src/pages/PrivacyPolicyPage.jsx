import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Shield } from 'lucide-react';

export default function PrivacyPolicyPage() {
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
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Privacy Policy</h1>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-8">
          <div className="flex items-center mb-6">
            <Shield size={32} className="text-blue-600 mr-3" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Your Privacy Matters</h2>
          </div>

          <div className="prose dark:prose-invert max-w-none space-y-6">
            <section>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">1. Information We Collect</h3>
              <p className="text-gray-700 dark:text-gray-300">
                We collect information you provide directly to us, including your name, email address, phone number, 
                and property preferences. We also collect information about how you use our platform.
              </p>
            </section>

            <section>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">2. How We Use Your Information</h3>
              <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-2">
                <li>To provide and improve our services</li>
                <li>To communicate with you about properties and updates</li>
                <li>To personalize your experience</li>
                <li>To ensure platform security and prevent fraud</li>
              </ul>
            </section>

            <section>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">3. Information Sharing</h3>
              <p className="text-gray-700 dark:text-gray-300">
                We do not sell your personal information. We may share your information with property owners or agents 
                only when you express interest in a specific property.
              </p>
            </section>

            <section>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">4. Data Security</h3>
              <p className="text-gray-700 dark:text-gray-300">
                We implement appropriate security measures to protect your personal information from unauthorized access, 
                alteration, disclosure, or destruction.
              </p>
            </section>

            <section>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">5. Your Rights</h3>
              <p className="text-gray-700 dark:text-gray-300">
                You have the right to access, update, or delete your personal information at any time. 
                Contact us at privacy@housing.com for any privacy-related requests.
              </p>
            </section>

            <section>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">6. Cookies</h3>
              <p className="text-gray-700 dark:text-gray-300">
                We use cookies and similar technologies to enhance your browsing experience and analyze platform usage.
              </p>
            </section>

            <p className="text-sm text-gray-600 dark:text-gray-400 mt-8">
              Last updated: November 2024
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
