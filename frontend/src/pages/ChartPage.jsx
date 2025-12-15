import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Lock, BarChart3 } from 'lucide-react';

export default function ChartPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate(-1)}
                className="p-2 rounded-lg hover:bg-gray-100"
              >
                <ArrowLeft size={20} />
              </button>
              <div>
                <h1 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                  <BarChart3 className="text-blue-600" size={24} />
                  <span className="font-medium text-gray-800">Charts & Analytics</span>
                </h1>
                <p className="text-sm text-gray-600">
                  Advanced property performance insights and reporting
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content - Coming Soon */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center max-w-md">
            <div className="bg-gray-100 rounded-full p-6 w-24 h-24 mx-auto mb-6 flex items-center justify-center">
              <Lock size={48} className="text-gray-400" />
            </div>
            
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Coming Soon
            </h2>
            
            <p className="text-gray-600 mb-6">
              We're working hard to bring you advanced charts and analytics features.
              This section will help you track your property performance, view trends,
              and get valuable insights about your listings.
            </p>
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-semibold text-blue-900 mb-2">
                Upcoming Features:
              </h3>
              <ul className="text-sm text-blue-700 space-y-1 text-left">
                <li>• Property view analytics</li>
                <li>• Lead generation tracking</li>
                <li>• Performance insights</li>
                <li>• Conversion rate analysis</li>
                <li>• Custom date range reports</li>
                <li>• Data export functionality</li>
              </ul>
            </div>
            
            <button
              onClick={() => navigate('/my-listings')}
              className="mt-6 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Back to My Listings
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
