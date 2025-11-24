import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, FileText } from 'lucide-react';

export default function TermsPage() {
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
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Terms & Conditions</h1>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-8">
          <div className="flex items-center mb-6">
            <FileText size={32} className="text-blue-600 mr-3" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Terms of Service</h2>
          </div>

          <div className="prose dark:prose-invert max-w-none space-y-6">
            <section>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">1. Acceptance of Terms</h3>
              <p className="text-gray-700 dark:text-gray-300">
                By accessing and using this platform, you accept and agree to be bound by the terms and provisions 
                of this agreement. If you do not agree to these terms, please do not use our services.
              </p>
            </section>

            <section>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">2. User Responsibilities</h3>
              <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-2">
                <li>Provide accurate and truthful information</li>
                <li>Maintain the confidentiality of your account credentials</li>
                <li>Not misuse or abuse the platform</li>
                <li>Comply with all applicable laws and regulations</li>
              </ul>
            </section>

            <section>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">3. Property Listings</h3>
              <p className="text-gray-700 dark:text-gray-300">
                Users posting property listings must ensure all information is accurate and up-to-date. 
                We reserve the right to remove listings that violate our policies or contain false information.
              </p>
            </section>

            <section>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">4. Premium Services</h3>
              <p className="text-gray-700 dark:text-gray-300">
                Premium subscriptions provide additional features as described on the pricing page. 
                Subscriptions are non-refundable unless otherwise specified. We reserve the right to modify 
                pricing and features with notice to users.
              </p>
            </section>

            <section>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">5. Intellectual Property</h3>
              <p className="text-gray-700 dark:text-gray-300">
                All content on this platform, including text, graphics, logos, and software, is the property 
                of our company and is protected by copyright and intellectual property laws.
              </p>
            </section>

            <section>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">6. Limitation of Liability</h3>
              <p className="text-gray-700 dark:text-gray-300">
                We strive to provide accurate information but do not guarantee the completeness or accuracy 
                of property listings. Users are responsible for verifying all information independently.
              </p>
            </section>

            <section>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">7. Termination</h3>
              <p className="text-gray-700 dark:text-gray-300">
                We reserve the right to terminate or suspend access to our services at any time, 
                without prior notice, for conduct that violates these terms or is harmful to other users.
              </p>
            </section>

            <section>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">8. Changes to Terms</h3>
              <p className="text-gray-700 dark:text-gray-300">
                We may update these terms from time to time. Continued use of the platform after changes 
                constitutes acceptance of the new terms.
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
