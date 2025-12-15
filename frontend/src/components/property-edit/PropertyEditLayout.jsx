import React, { useState } from 'react';
import {
  Search,
  BarChart3,
  TrendingUp,
  Settings,
  Eye,
  Users,
  Phone,
  Heart,
  Star,
  ArrowUp,
  DollarSign,
  Target,
  Zap,
  CheckCircle,
  AlertCircle,
  Info
} from 'lucide-react';

const PropertyEditLayout = ({ property, formData, onInputChange }) => {
  const [activeTab, setActiveTab] = useState('seo');

  const tabs = [
    {
      id: 'seo',
      label: 'SEO & Meta',
      icon: Search,
      color: 'text-blue-600'
    },
    {
      id: 'analytics',
      label: 'Analytics',
      icon: BarChart3,
      color: 'text-green-600'
    },
    {
      id: 'boost',
      label: 'Boost & Plan',
      icon: TrendingUp,
      color: 'text-purple-600'
    }
  ];

  const renderSEOTab = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Search Engine Optimization
        </h3>
        
        {/* Custom URL Slug */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Custom URL Slug
          </label>
          <div className="flex items-center gap-2">
            <span className="text-gray-600">https://propy.com/property/</span>
            <input
              type="text"
              value={formData.urlSlug || ''}
              onChange={(e) => onInputChange('urlSlug', e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-'))}
              placeholder="beautiful-2bhk-andheri-east"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white"
            />
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Use hyphens to separate words. Only lowercase letters, numbers, and hyphens allowed.
          </p>
        </div>

        {/* Meta Title */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Meta Title
          </label>
          <input
            type="text"
            value={formData.metaTitle || ''}
            onChange={(e) => onInputChange('metaTitle', e.target.value)}
            placeholder="2 BHK Apartment for Rent in Andheri East, Mumbai | ₹25,000"
            maxLength={60}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white"
          />
          <div className="flex justify-between mt-1">
            <p className="text-xs text-gray-500">
              Recommended: 50-60 characters for optimal display in search results
            </p>
            <p className="text-xs text-gray-500">
              {(formData.metaTitle || '').length}/60
            </p>
          </div>
        </div>

        {/* Meta Description */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Meta Description
          </label>
          <textarea
            value={formData.metaDescription || ''}
            onChange={(e) => onInputChange('metaDescription', e.target.value)}
            placeholder="Spacious 2 BHK apartment in Andheri East with modern amenities, prime location near metro station. Rent ₹25,000/month. Ready to move."
            rows={3}
            maxLength={160}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white"
          />
          <div className="flex justify-between mt-1">
            <p className="text-xs text-gray-500">
              Recommended: 150-160 characters for optimal display in search results
            </p>
            <p className="text-xs text-gray-500">
              {(formData.metaDescription || '').length}/160
            </p>
          </div>
        </div>

        {/* SEO Score */}
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <h4 className="font-semibold text-blue-900 mb-3">
            SEO Health Score
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">85%</div>
              <p className="text-sm text-blue-700">SEO Score</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">Good</div>
              <p className="text-sm text-green-700">Title Length</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-amber-600">Fair</div>
              <p className="text-sm text-amber-700">Description Length</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderAnalyticsTab = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Property Performance Analytics
        </h3>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <div className="flex items-center gap-3">
              <Eye className="text-blue-600" size={24} />
              <div>
                <p className="text-2xl font-bold text-blue-900">
                  {property.viewsLast7Days || 0}
                </p>
                <p className="text-sm text-blue-600">Views (7 days)</p>
              </div>
            </div>
          </div>

          <div className="bg-green-50 p-4 rounded-lg border border-green-200">
            <div className="flex items-center gap-3">
              <Users className="text-green-600" size={24} />
              <div>
                <p className="text-2xl font-bold text-green-900">
                  {property.leadsLast7Days || 0}
                </p>
                <p className="text-sm text-green-600">Leads (7 days)</p>
              </div>
            </div>
          </div>

          <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
            <div className="flex items-center gap-3">
              <Phone className="text-purple-600" size={24} />
              <div>
                <p className="text-2xl font-bold text-purple-900">
                  {property.viewsLast7Days ? Math.round(((property.leadsLast7Days || 0) / property.viewsLast7Days) * 100) : 0}%
                </p>
                <p className="text-sm text-purple-600">Conversion Rate</p>
              </div>
            </div>
          </div>

          <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
            <div className="flex items-center gap-3">
              <Heart className="text-orange-600" size={24} />
              <div>
                <p className="text-2xl font-bold text-orange-900">
                  {property.shortlistsCount || 0}
                </p>
                <p className="text-sm text-orange-600">Shortlists</p>
              </div>
            </div>
          </div>
        </div>

        {/* Performance Comparison */}
        <div className="bg-gray-50 p-4 rounded-lg border">
          <h4 className="font-semibold text-gray-900 mb-3">
            Market Comparison
          </h4>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-gray-700">Property views vs. average</span>
              <div className="flex items-center gap-2">
                <div className="w-20 h-2 bg-gray-200 rounded-full">
                  <div className="w-3/4 h-2 bg-blue-500 rounded-full"></div>
                </div>
                <span className="text-sm text-blue-600">+75%</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-700">Conversion rate vs. average</span>
              <div className="flex items-center gap-2">
                <div className="w-20 h-2 bg-gray-200 rounded-full">
                  <div className="w-1/2 h-2 bg-green-500 rounded-full"></div>
                </div>
                <span className="text-sm text-green-600">+25%</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-700">Shortlist rate vs. average</span>
              <div className="flex items-center gap-2">
                <div className="w-20 h-2 bg-gray-200 rounded-full">
                  <div className="w-2/3 h-2 bg-purple-500 rounded-full"></div>
                </div>
                <span className="text-sm text-purple-600">+40%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Top Traffic Sources */}
        <div className="bg-gray-50 p-4 rounded-lg border">
          <h4 className="font-semibold text-gray-900 mb-3">
            Top Traffic Sources (Last 30 Days)
          </h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-gray-700">Search Results</span>
              <span className="font-medium">45%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-700">Direct Traffic</span>
              <span className="font-medium">30%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-700">Referral Sites</span>
              <span className="font-medium">20%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-700">Social Media</span>
              <span className="font-medium">5%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderBoostTab = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Boost Visibility & Upgrade Plan
        </h3>

        {/* Current Plan */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg border border-blue-200 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h4 className="text-xl font-bold text-blue-900">
                Current Plan: {property.planType === 'free' ? 'Free' : property.planType === 'featured' ? 'Featured' : 'Premium'}
              </h4>
              <p className="text-blue-700">
                {property.planType === 'free' ? 'Basic listing with standard visibility' :
                 property.planType === 'featured' ? 'Enhanced visibility with priority placement' :
                 'Maximum visibility with premium features'}
              </p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-blue-900">
                {property.planType === 'free' ? '₹0' : 
                 property.planType === 'featured' ? '₹299' : '₹599'}/month
              </div>
              <div className="text-sm text-blue-700">
                {property.planType === 'free' ? 'Forever free' : 'Auto-renewal'}
              </div>
            </div>
          </div>
          
          <div className="flex gap-3">
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              Upgrade Plan
            </button>
            <button className="px-4 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors">
              Change Plan
            </button>
          </div>
        </div>

        {/* Available Plans */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className={`border-2 rounded-lg p-6 ${
            property.planType === 'free' ? 'border-green-500 bg-green-50' : 'border-gray-200'
          }`}>
            <div className="text-center">
              <h4 className="text-xl font-bold text-gray-900 mb-2">Free Plan</h4>
              <div className="text-3xl font-bold text-gray-900 mb-1">₹0</div>
              <p className="text-gray-600 mb-4">Forever</p>
              <ul className="text-sm text-gray-600 space-y-2 mb-6">
                <li className="flex items-center gap-2">
                  <CheckCircle size={16} className="text-green-600" />
                  Basic listing
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle size={16} className="text-green-600" />
                  Standard visibility
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle size={16} className="text-green-600" />
                  Basic contact management
                </li>
              </ul>
              {property.planType === 'free' ? (
                <button className="w-full py-2 bg-green-600 text-white rounded-lg" disabled>
                  Current Plan
                </button>
              ) : (
                <button className="w-full py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                  Downgrade
                </button>
              )}
            </div>
          </div>

          <div className={`border-2 rounded-lg p-6 ${
            property.planType === 'featured' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
          }`}>
            <div className="text-center">
              <div className="bg-blue-600 text-white text-xs px-2 py-1 rounded-full mb-2 inline-block">
                POPULAR
              </div>
              <h4 className="text-xl font-bold text-gray-900 mb-2">Featured Plan</h4>
              <div className="text-3xl font-bold text-gray-900 mb-1">₹299</div>
              <p className="text-gray-600 mb-4">per month</p>
              <ul className="text-sm text-gray-600 space-y-2 mb-6">
                <li className="flex items-center gap-2">
                  <CheckCircle size={16} className="text-green-600" />
                  Priority placement
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle size={16} className="text-green-600" />
                  Enhanced visibility
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle size={16} className="text-green-600" />
                  Contact leads tracking
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle size={16} className="text-green-600" />
                  Basic analytics
                </li>
              </ul>
              {property.planType === 'featured' ? (
                <button className="w-full py-2 bg-blue-600 text-white rounded-lg" disabled>
                  Current Plan
                </button>
              ) : (
                <button className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  Upgrade
                </button>
              )}
            </div>
          </div>

          <div className={`border-2 rounded-lg p-6 ${
            property.planType === 'premium' ? 'border-purple-500 bg-purple-50' : 'border-gray-200'
          }`}>
            <div className="text-center">
              <h4 className="text-xl font-bold text-gray-900 mb-2">Premium Plan</h4>
              <div className="text-3xl font-bold text-gray-900 mb-1">₹599</div>
              <p className="text-gray-600 mb-4">per month</p>
              <ul className="text-sm text-gray-600 space-y-2 mb-6">
                <li className="flex items-center gap-2">
                  <CheckCircle size={16} className="text-green-600" />
                  Top placement
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle size={16} className="text-green-600" />
                  Maximum visibility
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle size={16} className="text-green-600" />
                  Advanced analytics
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle size={16} className="text-green-600" />
                  Priority support
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle size={16} className="text-green-600" />
                  Featured badge
                </li>
              </ul>
              {property.planType === 'premium' ? (
                <button className="w-full py-2 bg-purple-600 text-white rounded-lg" disabled>
                  Current Plan
                </button>
              ) : (
                <button className="w-full py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
                  Upgrade
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Quick Boost Options */}
        <div className="bg-yellow-50 p-6 rounded-lg border border-yellow-200">
          <h4 className="font-semibold text-yellow-800 mb-4">
            🚀 Quick Boost Options
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button className="flex items-center gap-3 p-4 bg-white rounded-lg border hover:shadow-md transition-shadow">
              <Zap className="text-yellow-600" size={24} />
              <div className="text-left">
                <div className="font-medium text-gray-900">Instant Boost</div>
                <div className="text-sm text-gray-600">• Increased visibility</div>
              </div>
            </button>
            
            <button className="flex items-center gap-3 p-4 bg-white rounded-lg border hover:shadow-md transition-shadow">
              <Target className="text-blue-600" size={24} />
              <div className="text-left">
                <div className="font-medium text-gray-900">Featured This Week</div>
                <div className="text-sm text-gray-600">• Priority placement</div>
              </div>
            </button>
            
            <button className="flex items-center gap-3 p-4 bg-white rounded-lg border hover:shadow-md transition-shadow">
              <Star className="text-purple-600" size={24} />
              <div className="text-left">
                <div className="font-medium text-gray-900">Premium Badge</div>
                <div className="text-sm text-gray-600">• Trust indicator</div>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'seo':
        return renderSEOTab();
      case 'analytics':
        return renderAnalyticsTab();
      case 'boost':
        return renderBoostTab();
      default:
        return renderSEOTab();
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
          <Settings className="text-blue-600" size={24} />
          Advanced Options
        </h2>
        <div className="text-sm text-gray-500">
          Optional Features
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          {tabs.map((tab) => {
            const IconComponent = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <IconComponent size={18} className={activeTab === tab.id ? tab.color : ''} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="min-h-[400px]">
        {renderActiveTab()}
      </div>

      {/* Info Box */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <Info className="text-blue-600 mt-0.5" size={16} />
          <div>
            <h4 className="font-semibold text-blue-800 mb-1">
              Advanced Features
            </h4>
            <p className="text-sm text-blue-700">
              These optional features help optimize your listing for better visibility and performance. 
              SEO optimization improves search rankings, analytics provide insights, and boosting options increase visibility.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyEditLayout;
