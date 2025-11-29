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

  // Prevent background scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    // Cleanup on unmount
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && property) {
      fetchAnalytics();
    }
  }, [isOpen, property]);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      // Mock analytics data
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
        comparisonPercentile: Math.floor(Math.random() * 40) + 60,
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

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen || !property) return null;

  return (
    <>
      {/* Modal Overlay - Fixed positioning with backdrop */}
      <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/30 overflow-y-auto py-8 pb-20">
        <div 
          className="w-full max-w-6xl mx-auto rounded-2xl shadow-lg bg-white dark:bg-gray-900 max-h-[calc(85vh-80px)] overflow-hidden border border-gray-200 dark:border-gray-700"
          onClick={(e) => e.stopPropagation()}
        >
          
          {/* Header - Fixed height with close button */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex-1 min-w-0">
              <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 truncate">
                Property Analytics
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                {property.type} - ID: #{property.id}
              </p>
            </div>
            
            <button
              onClick={onClose}
              className="flex-shrink-0 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Tabs - Fixed height */}
          <div className="flex-shrink-0 border-b border-gray-200 dark:border-gray-700">
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
                  className={`inline-flex items-center gap-2 px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
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

          {/* Scrollable Content Area - Only this area scrolls */}
          <div className="overflow-y-auto flex-1 min-h-0">
            <div className="p-6">
              {loading ? (
                <div className="flex items-center justify-center h-64">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
              ) : analytics ? (
                <>
                  {activeTab === 'overview' && (
                    <div className="space-y-6">
                      {/* Metrics Grid - Responsive but constrained */}
                      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                          <div className="flex items-center justify-between">
                            <div className="flex-1 min-w-0">
                              <p className="text-sm text-blue-600 dark:text-blue-400 truncate">Total Views</p>
                              <p className="text-xl font-bold text-blue-900 dark:text-blue-100">
                                {analytics.totalViews.toLocaleString()}
                              </p>
                              <p className="text-xs text-blue-600 dark:text-blue-400">
                                {analytics.viewsLast7Days} this week
                              </p>
                            </div>
                            <Eye className="h-6 w-6 text-blue-500 flex-shrink-0 ml-2" />
                          </div>
                        </div>

                        <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                          <div className="flex items-center justify-between">
                            <div className="flex-1 min-w-0">
                              <p className="text-sm text-green-600 dark:text-green-400 truncate">Total Leads</p>
                              <p className="text-xl font-bold text-green-900 dark:text-green-100">
                                {analytics.leadsLast30Days}
                              </p>
                              <p className="text-xs text-green-600 dark:text-green-400">
                                {analytics.leadsLast7Days} this week
                              </p>
                            </div>
                            <MessageSquare className="h-6 w-6 text-green-500 flex-shrink-0 ml-2" />
                          </div>
                        </div>

                        <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
                          <div className="flex items-center justify-between">
                            <div className="flex-1 min-w-0">
                              <p className="text-sm text-purple-600 dark:text-purple-400 truncate">Shortlists</p>
                              <p className="text-xl font-bold text-purple-900 dark:text-purple-100">
                                {analytics.shortlistsCount}
                              </p>
                              <p className="text-xs text-purple-600 dark:text-purple-400">
                                Saved by users
                              </p>
                            </div>
                            <Heart className="h-6 w-6 text-purple-500 flex-shrink-0 ml-2" />
                          </div>
                        </div>

                        <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg">
                          <div className="flex items-center justify-between">
                            <div className="flex-1 min-w-0">
                              <p className="text-sm text-yellow-600 dark:text-yellow-400 truncate">Unique Visitors</p>
                              <p className="text-xl font-bold text-yellow-900 dark:text-yellow-100">
                                {analytics.uniqueVisitors.toLocaleString()}
                              </p>
                              <p className="text-xs text-yellow-600 dark:text-yellow-400">
                                {analytics.totalViews > 0 ? Math.round((analytics.uniqueVisitors / analytics.totalViews) * 100) : 0}% of views
                              </p>
                            </div>
                            <Users className="h-6 w-6 text-yellow-500 flex-shrink-0 ml-2" />
                          </div>
                        </div>
                      </div>

                      {/* Lead Breakdown - Card with proper constraints */}
                      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Lead Breakdown (Last 30 Days)</h3>
                        <div className="space-y-3">
                          {[
                            { label: 'Phone Calls', value: analytics.callsRevealed, icon: Phone, color: 'text-blue-500', percentage: analytics.leadsLast30Days > 0 ? Math.round((analytics.callsRevealed / analytics.leadsLast30Days) * 100) : 0 },
                            { label: 'WhatsApp Clicks', value: analytics.whatsappClicks, icon: MessageSquare, color: 'text-green-500', percentage: analytics.leadsLast30Days > 0 ? Math.round((analytics.whatsappClicks / analytics.leadsLast30Days) * 100) : 0 },
                            { label: 'Contact Form Submissions', value: analytics.contactFormSubmissions, icon: Calendar, color: 'text-purple-500', percentage: analytics.leadsLast30Days > 0 ? Math.round((analytics.contactFormSubmissions / analytics.leadsLast30Days) * 100) : 0 }
                          ].map((item, index) => {
                            const IconComponent = item.icon;
                            return (
                              <div key={index} className="flex items-center justify-between">
                                <div className="flex items-center gap-3 min-w-0 flex-1">
                                  <IconComponent className={`h-5 w-5 ${item.color} flex-shrink-0`} />
                                  <span className="text-gray-700 dark:text-gray-300 truncate">{item.label}</span>
                                </div>
                                <div className="text-right flex-shrink-0 ml-4">
                                  <span className="font-semibold">{item.value}</span>
                                  <span className="text-sm text-gray-500 ml-2">({item.percentage}%)</span>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Traffic Sources - Card with proper constraints */}
                      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Traffic Sources</h3>
                        <div className="space-y-3">
                          {analytics.topReferrers.map((referrer, index) => (
                            <div key={index} className="flex items-center justify-between">
                              <span className="text-gray-700 dark:text-gray-300 truncate flex-1 min-w-0">{referrer.source}</span>
                              <div className="flex items-center gap-2 flex-shrink-0 ml-4">
                                <div className="w-20 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                  <div 
                                    className="bg-blue-600 h-2 rounded-full"
                                    style={{ width: `${referrer.percentage}%` }}
                                  />
                                </div>
                                <span className="text-sm font-medium w-10 text-right">
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
                      {/* Quality Score - Centered design */}
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

                      {/* Quality Checklist - Compact design */}
                      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Quality Checklist</h3>
                        <div className="space-y-3">
                          {[
                            { 
                              condition: (property.images?.length || 0) >= 5, 
                              text: 'Add at least 5 photos',
                              current: `${property.images?.length || 0}/5 photos`
                            },
                            { 
                              condition: property.description && property.description.length >= 100, 
                              text: 'Description too short – add 100+ words',
                              current: `${property.description?.length || 0} words`
                            },
                            { 
                              condition: property.location, 
                              text: 'No map location – add on map',
                              current: 'Required'
                            }
                          ].map((item, index) => (
                            <div key={index} className="flex items-center justify-between">
                              <div className="flex items-center gap-3 min-w-0 flex-1">
                                {item.condition ? (
                                  <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                                ) : (
                                  <AlertCircle className="h-5 w-5 text-yellow-500 flex-shrink-0" />
                                )}
                                <span className="text-gray-700 dark:text-gray-300 truncate">{item.text}</span>
                              </div>
                              <span className="text-sm text-gray-500 flex-shrink-0 ml-4">{item.current}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Performance Comparison - Compact design */}
                      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Performance Comparison</h3>
                        <div className="flex items-center gap-4">
                          <Target className="h-8 w-8 text-blue-500 flex-shrink-0" />
                          <div className="flex-1 min-w-0">
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
                      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">30-Day View Trend</h3>
                        <div className="h-48 flex items-end justify-between gap-1">
                          {analytics.dailyViews.slice(-14).map((day, index) => (
                            <div key={index} className="flex-1 flex flex-col items-center">
                              <div className="text-xs text-gray-500 mb-1">
                                {new Date(day.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                              </div>
                              <div 
                                className="bg-blue-500 rounded-t w-full min-h-[4px]"
                                style={{ 
                                  height: `${Math.max((day.views / Math.max(...analytics.dailyViews.map(d => d.views))) * 160, 4)}px` 
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
      </div>
    </>
  );
}