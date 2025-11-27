import React, { useState, useEffect } from 'react';
import {
  X,
  Eye,
  Phone,
  MessageSquare,
  Heart,
  TrendingUp,
  TrendingDown,
  Users,
  Calendar,
  Award,
  AlertCircle,
  CheckCircle,
  Target,
  BarChart3
} from 'lucide-react';

export default function PropertyAnalyticsPanel({
  property,
  isOpen,
  onClose,
  API_BASE_URL
}) {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    if (isOpen && property) {
      fetchAnalytics();
    }
  }, [isOpen, property]);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      // In a real app, this would fetch from your analytics API
      const mockAnalytics = {
        totalViews: property.viewsLast30Days || 0,
        uniqueVisitors: Math.floor((property.viewsLast30Days || 0) * 0.7),
        viewsLast7Days: property.viewsLast7Days || 0,
        viewsLast30Days: property.viewsLast30Days || 0,
        leadsLast7Days: property.leadsLast7Days || 0,
        leadsLast30Days: property.leadsLast30Days || 0,
        callsRevealed: Math.floor((property.leadsLast30Days || 0) * 0.3),
        whatsappClicks: Math.floor((property.leadsLast30Days || 0) * 0.4),
        contactFormSubmissions: Math.floor((property.leadsLast30Days || 0) * 0.3),
        shortlistsCount: property.shortlistsCount || 0,
        qualityScore: calculateQualityScore(property),
        comparisonPercentile: Math.floor(Math.random() * 40) + 60, // Top 60-100%
        dailyViews: Array.from({ length: 30 }, (_, i) => ({
          date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          views: Math.floor(Math.random() * 20) + 1,
          leads: Math.floor(Math.random() * 3)
        })),
        topReferrers: [
          { source: 'Google Search', percentage: 35 },
          { source: 'Direct Traffic', percentage: 25 },
          { source: 'Facebook', percentage: 15 },
          { source: '99acres.com', percentage: 12 },
          { source: 'MagicBricks', percentage: 13 }
        ]
      };
      
      setAnalytics(mockAnalytics);
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateQualityScore = (property) => {
    let score = 0;
    const maxScore = 100;
    
    // Photos (30 points)
    const photoCount = property.images?.length || 0;
    if (photoCount >= 10) score += 30;
    else if (photoCount >= 5) score += 25;
    else if (photoCount >= 3) score += 20;
    else if (photoCount >= 1) score += 10;
    
    // Description (25 points)
    const descLength = property.description?.length || 0;
    if (descLength >= 500) score += 25;
    else if (descLength >= 300) score += 20;
    else if (descLength >= 100) score += 15;
    else if (descLength >= 50) score += 10;
    
    // Price information (15 points)
    if (property.price && property.priceValue) score += 15;
    
    // Amenities (15 points)
    const amenityCount = property.amenities?.length || 0;
    if (amenityCount >= 10) score += 15;
    else if (amenityCount >= 5) score += 12;
    else if (amenityCount >= 3) score += 8;
    else if (amenityCount >= 1) score += 5;
    
    // Key highlights (10 points)
    const highlightCount = property.keyHighlights?.length || 0;
    if (highlightCount >= 5) score += 10;
    else if (highlightCount >= 3) score += 7;
    else if (highlightCount >= 1) score += 5;
    
    // Furnishing status (5 points)
    if (property.furnishing && property.furnishing !== 'Unfurnished') score += 5;
    
    return Math.min(score, maxScore);
  };

  const getQualityColor = (score) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getQualityBg = (score) => {
    if (score >= 80) return 'bg-green-100 dark:bg-green-900/20';
    if (score >= 60) return 'bg-yellow-100 dark:bg-yellow-900/20';
    return 'bg-red-100 dark:bg-red-900/20';
  };

  if (!isOpen || !property) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
      <div className="bg-white dark:bg-gray-900 w-full max-w-6xl h-full max-h-[90vh] rounded-2xl shadow-xl flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-4">
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">Property Analytics</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {property.type} - ID: #{property.id}
              </p>
            </div>
          </div>
          
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <X size={20} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 dark:border-gray-700">
          {[
            { id: 'overview', label: 'Overview', icon: BarChart3 },
            { id: 'quality', label: 'Quality Score', icon: Award },
            { id: 'trends', label: 'Trends', icon: TrendingUp }
          ].map(tab => {
            const IconComponent = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
                }`}
              >
                <IconComponent size={16} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : analytics ? (
            <>
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  {/* Key Metrics Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-blue-600 dark:text-blue-400">Total Views</p>
                          <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                            {analytics.totalViews.toLocaleString()}
                          </p>
                          <p className="text-xs text-blue-600 dark:text-blue-400">
                            {analytics.viewsLast7Days} this week
                          </p>
                        </div>
                        <Eye className="h-8 w-8 text-blue-500" />
                      </div>
                    </div>

                    <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-green-600 dark:text-green-400">Total Leads</p>
                          <p className="text-2xl font-bold text-green-900 dark:text-green-100">
                            {analytics.leadsLast30Days}
                          </p>
                          <p className="text-xs text-green-600 dark:text-green-400">
                            {analytics.leadsLast7Days} this week
                          </p>
                        </div>
                        <MessageSquare className="h-8 w-8 text-green-500" />
                      </div>
                    </div>

                    <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-purple-600 dark:text-purple-400">Shortlists</p>
                          <p className="text-2xl font-bold text-purple-900 dark:text-purple-100">
                            {analytics.shortlistsCount}
                          </p>
                          <p className="text-xs text-purple-600 dark:text-purple-400">
                            Saved by users
                          </p>
                        </div>
                        <Heart className="h-8 w-8 text-purple-500" />
                      </div>
                    </div>

                    <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-yellow-600 dark:text-yellow-400">Unique Visitors</p>
                          <p className="text-2xl font-bold text-yellow-900 dark:text-yellow-100">
                            {analytics.uniqueVisitors.toLocaleString()}
                          </p>
                          <p className="text-xs text-yellow-600 dark:text-yellow-400">
                            {Math.round((analytics.uniqueVisitors / analytics.totalViews) * 100)}% of views
                          </p>
                        </div>
                        <Users className="h-8 w-8 text-yellow-500" />
                      </div>
                    </div>
                  </div>

                  {/* Lead Breakdown */}
                  <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Lead Breakdown (Last 30 Days)</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Phone className="h-5 w-5 text-blue-500" />
                          <span className="text-gray-700 dark:text-gray-300">Phone Calls</span>
                        </div>
                        <div className="text-right">
                          <span className="font-semibold">{analytics.callsRevealed}</span>
                          <span className="text-sm text-gray-500 ml-2">
                            ({Math.round((analytics.callsRevealed / analytics.leadsLast30Days) * 100)}%)
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <MessageSquare className="h-5 w-5 text-green-500" />
                          <span className="text-gray-700 dark:text-gray-300">WhatsApp Clicks</span>
                        </div>
                        <div className="text-right">
                          <span className="font-semibold">{analytics.whatsappClicks}</span>
                          <span className="text-sm text-gray-500 ml-2">
                            ({Math.round((analytics.whatsappClicks / analytics.leadsLast30Days) * 100)}%)
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Calendar className="h-5 w-5 text-purple-500" />
                          <span className="text-gray-700 dark:text-gray-300">Contact Form Submissions</span>
                        </div>
                        <div className="text-right">
                          <span className="font-semibold">{analytics.contactFormSubmissions}</span>
                          <span className="text-sm text-gray-500 ml-2">
                            ({Math.round((analytics.contactFormSubmissions / analytics.leadsLast30Days) * 100)}%)
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Top Referrers */}
                  <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Traffic Sources</h3>
                    <div className="space-y-3">
                      {analytics.topReferrers.map((referrer, index) => (
                        <div key={index} className="flex items-center justify-between">
                          <span className="text-gray-700 dark:text-gray-300">{referrer.source}</span>
                          <div className="flex items-center gap-2">
                            <div className="w-24 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                              <div 
                                className="bg-blue-600 h-2 rounded-full"
                                style={{ width: `${referrer.percentage}%` }}
                              />
                            </div>
                            <span className="text-sm font-medium w-12 text-right">
                              {referrer.percentage}%
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'quality' && (
                <div className="space-y-6">
                  {/* Quality Score */}
                  <div className="text-center">
                    <div className="relative inline-flex items-center justify-center w-32 h-32">
                      <svg className="w-32 h-32 transform -rotate-90">
                        <circle
                          cx="64"
                          cy="64"
                          r="56"
                          stroke="currentColor"
                          strokeWidth="8"
                          fill="transparent"
                          className="text-gray-200 dark:text-gray-700"
                        />
                        <circle
                          cx="64"
                          cy="64"
                          r="56"
                          stroke="currentColor"
                          strokeWidth="8"
                          fill="transparent"
                          strokeDasharray={`${2 * Math.PI * 56}`}
                          strokeDashoffset={`${2 * Math.PI * 56 * (1 - analytics.qualityScore / 100)}`}
                          className={getQualityColor(analytics.qualityScore)}
                          strokeLinecap="round"
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center">
                          <div className={`text-3xl font-bold ${getQualityColor(analytics.qualityScore)}`}>
                            {analytics.qualityScore}%
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">Quality Score</div>
                        </div>
                      </div>
                    </div>
                    
                    <p className="mt-4 text-gray-600 dark:text-gray-400">
                      Your listing quality score is {analytics.qualityScore >= 80 ? 'excellent' : 
                      analytics.qualityScore >= 60 ? 'good' : 'needs improvement'}
                    </p>
                  </div>

                  {/* Checklist */}
                  <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Quality Checklist</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          {(property.images?.length || 0) >= 5 ? (
                            <CheckCircle className="h-5 w-5 text-green-500" />
                          ) : (
                            <AlertCircle className="h-5 w-5 text-yellow-500" />
                          )}
                          <span className="text-gray-700 dark:text-gray-300">Add at least 5 photos</span>
                        </div>
                        <span className="text-sm text-gray-500">
                          {property.images?.length || 0}/5 photos
                        </span>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          {property.description && property.description.length >= 100 ? (
                            <CheckCircle className="h-5 w-5 text-green-500" />
                          ) : (
                            <AlertCircle className="h-5 w-5 text-yellow-500" />
                          )}
                          <span className="text-gray-700 dark:text-gray-300">Add floorplan</span>
                        </div>
                        <span className="text-sm text-gray-500">Optional</span>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          {property.description && property.description.length >= 100 ? (
                            <CheckCircle className="h-5 w-5 text-green-500" />
                          ) : (
                            <AlertCircle className="h-5 w-5 text-yellow-500" />
                          )}
                          <span className="text-gray-700 dark:text-gray-300">Description too short – add 100+ words</span>
                        </div>
                        <span className="text-sm text-gray-500">
                          {property.description?.length || 0} words
                        </span>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          {property.location ? (
                            <CheckCircle className="h-5 w-5 text-green-500" />
                          ) : (
                            <AlertCircle className="h-5 w-5 text-yellow-500" />
                          )}
                          <span className="text-gray-700 dark:text-gray-300">No map location – add on map</span>
                        </div>
                        <span className="text-sm text-gray-500">Required</span>
                      </div>
                    </div>
                  </div>

                  {/* Comparison */}
                  <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Performance Comparison</h3>
                    <div className="flex items-center gap-4">
                      <Target className="h-8 w-8 text-blue-500" />
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          You are in top {analytics.comparisonPercentile}% by views compared to similar properties in {property.city || 'your area'}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          Based on {property.bhk} BHK properties in {property.city || 'your area'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'trends' && (
                <div className="space-y-6">
                  <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">30-Day View Trend</h3>
                    <div className="h-64 flex items-end justify-between gap-1">
                      {analytics.dailyViews.slice(-14).map((day, index) => (
                        <div key={index} className="flex-1 flex flex-col items-center">
                          <div className="text-xs text-gray-500 mb-1">
                            {new Date(day.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                          </div>
                          <div 
                            className="bg-blue-500 rounded-t w-full"
                            style={{ 
                              height: `${Math.max((day.views / Math.max(...analytics.dailyViews.map(d => d.views))) * 200, 4)}px` 
                            }}
                          />
                          <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                            {day.views}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500">Failed to load analytics data</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}