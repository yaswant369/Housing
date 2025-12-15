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
      // Enhanced analytics data with market comparison and recommendations
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

        // Enhanced trend data
        dailyViews: Array.from({ length: 30 }, (_, i) => ({
          date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          views: Math.floor(Math.random() * 20) + 1,
          leads: Math.floor(Math.random() * 3),
          engagementTime: Math.floor(Math.random() * 120) + 30 // seconds
        })),

        // Enhanced traffic sources
        topReferrers: [
          { source: 'Google Search', percentage: 35, quality: 'high' },
          { source: 'Direct Traffic', percentage: 25, quality: 'medium' },
          { source: 'Facebook', percentage: 15, quality: 'medium' },
          { source: '99acres.com', percentage: 12, quality: 'high' },
          { source: 'MagicBricks', percentage: 13, quality: 'high' }
        ],

        // Lead quality analysis
        leadQuality: {
          highQuality: Math.floor((property.leadsLast30Days || 0) * 0.4),
          mediumQuality: Math.floor((property.leadsLast30Days || 0) * 0.35),
          lowQuality: Math.floor((property.leadsLast30Days || 0) * 0.25),
          conversionRate: Math.min(Math.random() * 15 + 5, 20).toFixed(1) + '%'
        },

        // Market comparison data
        marketComparison: {
          averagePricePerSqft: Math.floor(Math.random() * 5000) + 8000,
          yourPricePerSqft: property.priceValue && property.area ?
            Math.floor(property.priceValue / parseFloat(property.area.replace(/,/g, ''))) : 0,
          priceCompetitive: Math.random() > 0.5 ? 'competitive' : 'above_market',
          similarProperties: Array.from({ length: 5 }, (_, i) => ({
            id: i + 1,
            price: `₹${Math.floor(Math.random() * 50) + 70}L`,
            priceValue: Math.floor(Math.random() * 5000000) + 7000000,
            area: `${Math.floor(Math.random() * 500) + 800} sq.ft`,
            bhk: Math.floor(Math.random() * 2) + property.bhk - 1,
            views: Math.floor(Math.random() * 500) + 100,
            pricePerSqft: Math.floor(Math.random() * 5000) + 6000
          }))
        },

        // Performance benchmarks
        performanceBenchmarks: {
          industryAverageViews: Math.floor(Math.random() * 300) + 200,
          industryAverageLeads: Math.floor(Math.random() * 50) + 30,
          industryAverageShortlists: Math.floor(Math.random() * 20) + 10,
          industryAverageConversion: Math.min(Math.random() * 10 + 8, 15).toFixed(1) + '%'
        },

        // Recommendations
        recommendations: generateRecommendations(property, calculateQualityScore(property)),

        // Engagement metrics
        engagementMetrics: {
          averageTimeOnPage: Math.floor(Math.random() * 90) + 60, // seconds
          bounceRate: Math.min(Math.random() * 40 + 30, 70).toFixed(1) + '%',
          scrollDepth: Math.min(Math.random() * 30 + 60, 90).toFixed(1) + '%',
          photoGalleryViews: Math.floor((property.viewsLast30Days || 0) * 0.8),
          videoViews: property.video ? Math.floor((property.viewsLast30Days || 0) * 0.3) : 0
        }
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

    // Photos (30 points) - Enhanced with quality checks
    const photoCount = property.images?.length || 0;
    if (photoCount >= 10) score += 30;
    else if (photoCount >= 8) score += 28;
    else if (photoCount >= 6) score += 25;
    else if (photoCount >= 4) score += 20;
    else if (photoCount >= 2) score += 15;
    else if (photoCount >= 1) score += 10;

    // Description (25 points) - Enhanced with content quality
    const descLength = property.description?.length || 0;
    if (descLength >= 800) score += 25;
    else if (descLength >= 600) score += 22;
    else if (descLength >= 400) score += 20;
    else if (descLength >= 200) score += 15;
    else if (descLength >= 100) score += 10;
    else if (descLength >= 50) score += 5;

    // Price information (15 points) - Enhanced with completeness
    if (property.price && property.priceValue) {
      score += 15;
      // Bonus for detailed pricing
      if (property.maintenance?.amount || property.securityDeposit) score += 2;
    }

    // Amenities (15 points) - Enhanced with premium amenities
    const amenityCount = property.amenities?.length || 0;
    const premiumAmenities = ['Gym', 'Swimming Pool', 'Club House', 'Security', 'Power Backup', 'Lift', 'Parking'];
    const hasPremiumAmenities = property.amenities?.some(amenity =>
      premiumAmenities.includes(amenity)
    );

    if (amenityCount >= 15) score += 15;
    else if (amenityCount >= 10) score += 13;
    else if (amenityCount >= 8) score += 11;
    else if (amenityCount >= 5) score += 8;
    else if (amenityCount >= 3) score += 5;
    else if (amenityCount >= 1) score += 3;

    if (hasPremiumAmenities) score += 2;

    // Key highlights (10 points) - Enhanced
    const highlightCount = property.keyHighlights?.length || 0;
    if (highlightCount >= 8) score += 10;
    else if (highlightCount >= 6) score += 8;
    else if (highlightCount >= 4) score += 6;
    else if (highlightCount >= 2) score += 4;
    else if (highlightCount >= 1) score += 2;

    // Furnishing status (5 points) - Enhanced
    if (property.furnishing === 'Fully Furnished') score += 5;
    else if (property.furnishing === 'Semi-Furnished') score += 3;
    else if (property.furnishing === 'Unfurnished') score += 1;

    // Location completeness (10 points) - New
    const locationFields = [property.city, property.locality, property.landmark, property.pincode];
    const locationScore = locationFields.filter(field => field && field.trim()).length;
    if (locationScore >= 4) score += 10;
    else if (locationScore >= 3) score += 7;
    else if (locationScore >= 2) score += 5;
    else if (locationScore >= 1) score += 3;

    // Media richness (5 points) - New
    const hasVideo = property.video || (property.media?.videos?.length > 0);
    const hasFloorPlan = property.media?.floorplans?.length > 0;
    if (hasVideo && hasFloorPlan) score += 5;
    else if (hasVideo || hasFloorPlan) score += 3;

    // Property details completeness (5 points) - New
    const detailFields = [
      property.bedrooms, property.bathrooms, property.balconies,
      property.facing, property.propertyOnFloor, property.totalFloors
    ];
    const detailScore = detailFields.filter(field => field && field !== 'undefined').length;
    if (detailScore >= 5) score += 5;
    else if (detailScore >= 3) score += 3;
    else if (detailScore >= 1) score += 1;

    return Math.min(score, maxScore);
  };

  const getQualityColor = (score) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getQualityBg = (score) => {
    if (score >= 80) return 'bg-green-100';
    if (score >= 60) return 'bg-yellow-100';
    return 'bg-red-100';
  };
  const generateRecommendations = (property, qualityScore) => {
    const recommendations = [];

    // Photo recommendations
    const photoCount = property.images?.length || 0;
    if (photoCount < 5) {
      recommendations.push({
        type: 'critical',
        title: 'Add More Photos',
        description: `Your listing has only ${photoCount} photos. Add at least 8-10 high-quality photos including bedroom, living room, kitchen, bathroom, and balcony views.`,
        impact: 'High',
        action: 'Add photos'
      });
    } else if (photoCount < 8) {
      recommendations.push({
        type: 'important',
        title: 'Add More Photos',
        description: `Consider adding 2-3 more photos to showcase different angles and features of your property.`,
        impact: 'Medium',
        action: 'Add photos'
      });
    }

    // Description recommendations
    const descLength = property.description?.length || 0;
    if (descLength < 100) {
      recommendations.push({
        type: 'critical',
        title: 'Improve Description',
        description: 'Your property description is too short. Add detailed information about the property, neighborhood, amenities, and unique selling points (300+ words recommended).',
        impact: 'High',
        action: 'Edit description'
      });
    } else if (descLength < 300) {
      recommendations.push({
        type: 'important',
        title: 'Enhance Description',
        description: 'Expand your property description to include more details about the neighborhood, nearby amenities, transportation options, and what makes this property special.',
        impact: 'Medium',
        action: 'Edit description'
      });
    }

    // Price recommendations
    if (!property.priceValue || property.priceValue === 0) {
      recommendations.push({
        type: 'critical',
        title: 'Add Price Information',
        description: 'Your listing is missing price information. Properties with clear pricing get 3x more views and 5x more leads.',
        impact: 'Critical',
        action: 'Add price'
      });
    }

    // Amenities recommendations
    const amenityCount = property.amenities?.length || 0;
    if (amenityCount < 3) {
      recommendations.push({
        type: 'important',
        title: 'Add More Amenities',
        description: 'List all available amenities. Properties with 5+ amenities get 40% more interest from buyers/renters.',
        impact: 'High',
        action: 'Add amenities'
      });
    }

    // Key highlights recommendations
    const highlightCount = property.keyHighlights?.length || 0;
    if (highlightCount < 3) {
      recommendations.push({
        type: 'recommended',
        title: 'Add Key Highlights',
        description: 'Highlight unique features like "Close to Metro", "24/7 Security", "Modern Kitchen", etc. This helps your listing stand out.',
        impact: 'Medium',
        action: 'Add highlights'
      });
    }

    // Media recommendations
    const hasVideo = property.video || (property.media?.videos?.length > 0);
    const hasFloorPlan = property.media?.floorplans?.length > 0;

    if (!hasVideo) {
      recommendations.push({
        type: 'recommended',
        title: 'Add Video Tour',
        description: 'Properties with video tours get 2-3x more engagement and 50% more leads. Consider adding a walkthrough video.',
        impact: 'High',
        action: 'Add video'
      });
    }

    if (!hasFloorPlan && property.bhk >= 2) {
      recommendations.push({
        type: 'recommended',
        title: 'Add Floor Plan',
        description: 'Floor plans help buyers visualize the layout and are especially important for larger properties.',
        impact: 'Medium',
        action: 'Add floor plan'
      });
    }

    // Location recommendations
    const locationFields = [property.city, property.locality, property.landmark, property.pincode];
    const locationScore = locationFields.filter(field => field && field.trim()).length;

    if (locationScore < 3) {
      recommendations.push({
        type: 'important',
        title: 'Complete Location Details',
        description: 'Add detailed location information including locality, landmark, and pincode. This improves search visibility and helps buyers find your property.',
        impact: 'High',
        action: 'Complete location'
      });
    }

    // Property details recommendations
    const detailFields = [
      property.bedrooms, property.bathrooms, property.balconies,
      property.facing, property.propertyOnFloor, property.totalFloors
    ];
    const detailScore = detailFields.filter(field => field && field !== 'undefined').length;

    if (detailScore < 4) {
      recommendations.push({
        type: 'recommended',
        title: 'Add Property Details',
        description: 'Complete all property details including bedrooms, bathrooms, balconies, facing direction, and floor information for better search filtering.',
        impact: 'Medium',
        action: 'Complete details'
      });
    }

    // Performance-based recommendations
    if (property.viewsLast30Days < 50) {
      recommendations.push({
        type: 'important',
        title: 'Improve Listing Visibility',
        description: 'Your listing is getting low views. Consider boosting your listing, improving photos, or adjusting the price to be more competitive.',
        impact: 'High',
        action: 'Boost listing'
      });
    }

    if (property.leadsLast30Days < 10 && property.viewsLast30Days > 100) {
      recommendations.push({
        type: 'recommended',
        title: 'Improve Conversion Rate',
        description: 'Your listing is getting views but few leads. Consider adding more compelling photos, a better description, or adjusting the price.',
        impact: 'Medium',
        action: 'Optimize listing'
      });
    }

    return recommendations.slice(0, 6); // Return top 6 recommendations
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
          className="w-full max-w-6xl mx-auto rounded-2xl shadow-lg bg-white max-h-[calc(85vh-80px)] overflow-hidden border border-gray-200"
          onClick={(e) => e.stopPropagation()}
        >
          
          {/* Header - Fixed height with close button */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div className="flex-1 min-w-0">
              <h2 className="text-xl font-bold text-gray-900 truncate">
                Property Analytics
              </h2>
              <p className="text-sm text-gray-600 truncate">
                {property.type} - ID: #{property.id}
              </p>
            </div>
            
            <button
              onClick={onClose}
              className="flex-shrink-0 p-2 rounded-full hover:bg-gray-100 transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Tabs - Fixed height */}
          <div className="flex-shrink-0 border-b border-gray-200">
            {[
              { id: 'overview', label: 'Overview', icon: BarChart3 },
              { id: 'quality', label: 'Quality Score', icon: Award },
              { id: 'market', label: 'Market Comparison', icon: Target },
              { id: 'recommendations', label: 'Recommendations', icon: AlertCircle },
              { id: 'trends', label: 'Trends', icon: TrendingUp }
            ].map(tab => {
              const IconComponent = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`inline-flex items-center gap-2 px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-600 hover:text-gray-800'
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
                        <div className="bg-blue-50 p-4 rounded-lg">
                          <div className="flex items-center justify-between">
                            <div className="flex-1 min-w-0">
                              <p className="text-sm text-blue-600 truncate">Total Views</p>
                              <p className="text-xl font-bold text-blue-900">
                                {analytics.totalViews.toLocaleString()}
                              </p>
                              <p className="text-xs text-blue-600">
                                {analytics.viewsLast7Days} this week
                              </p>
                            </div>
                            <Eye className="h-6 w-6 text-blue-500 flex-shrink-0 ml-2" />
                          </div>
                        </div>

                        <div className="bg-green-50 p-4 rounded-lg">
                          <div className="flex items-center justify-between">
                            <div className="flex-1 min-w-0">
                              <p className="text-sm text-green-600 truncate">Total Leads</p>
                              <p className="text-xl font-bold text-green-900">
                                {analytics.leadsLast30Days}
                              </p>
                              <p className="text-xs text-green-600">
                                {analytics.leadsLast7Days} this week
                              </p>
                            </div>
                            <MessageSquare className="h-6 w-6 text-green-500 flex-shrink-0 ml-2" />
                          </div>
                        </div>

                        <div className="bg-purple-50 p-4 rounded-lg">
                          <div className="flex items-center justify-between">
                            <div className="flex-1 min-w-0">
                              <p className="text-sm text-purple-600 truncate">Shortlists</p>
                              <p className="text-xl font-bold text-purple-900">
                                {analytics.shortlistsCount}
                              </p>
                              <p className="text-xs text-purple-600">
                                Saved by users
                              </p>
                            </div>
                            <Heart className="h-6 w-6 text-purple-500 flex-shrink-0 ml-2" />
                          </div>
                        </div>

                        <div className="bg-yellow-50 p-4 rounded-lg">
                          <div className="flex items-center justify-between">
                            <div className="flex-1 min-w-0">
                              <p className="text-sm text-yellow-600 truncate">Unique Visitors</p>
                              <p className="text-xl font-bold text-yellow-900">
                                {analytics.uniqueVisitors.toLocaleString()}
                              </p>
                              <p className="text-xs text-yellow-600">
                                {analytics.totalViews > 0 ? Math.round((analytics.uniqueVisitors / analytics.totalViews) * 100) : 0}% of views
                              </p>
                            </div>
                            <Users className="h-6 w-6 text-yellow-500 flex-shrink-0 ml-2" />
                          </div>
                        </div>
                      </div>

                      {/* Lead Breakdown - Card with proper constraints */}
                      <div className="bg-white p-4 rounded-lg border border-gray-200">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Lead Breakdown (Last 30 Days)</h3>
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
                                  <span className="text-gray-700 truncate">{item.label}</span>
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

                      {/* Lead Quality Analysis */}
                      <div className="bg-white p-4 rounded-lg border border-gray-200">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Lead Quality Analysis</h3>
                        <div className="grid grid-cols-3 gap-4 mb-4">
                          <div className="text-center">
                            <p className="text-sm text-green-600">High Quality</p>
                            <p className="text-xl font-bold text-green-900">
                              {analytics.leadQuality.highQuality}
                            </p>
                            <p className="text-xs text-green-600">buyers</p>
                          </div>
                          <div className="text-center">
                            <p className="text-sm text-yellow-600">Medium Quality</p>
                            <p className="text-xl font-bold text-yellow-900">
                              {analytics.leadQuality.mediumQuality}
                            </p>
                            <p className="text-xs text-yellow-600">leads</p>
                          </div>
                          <div className="text-center">
                            <p className="text-sm text-blue-600">Low Quality</p>
                            <p className="text-xl font-bold text-blue-900">
                              {analytics.leadQuality.lowQuality}
                            </p>
                            <p className="text-xs text-blue-600">inquiries</p>
                          </div>
                        </div>
                        <div className="flex items-center justify-center gap-2">
                          <span className="text-sm text-gray-600">Conversion Rate:</span>
                          <span className="text-lg font-bold text-purple-600">
                            {analytics.leadQuality.conversionRate}
                          </span>
                        </div>
                      </div>

                      {/* Traffic Sources - Enhanced with quality indicators */}
                      <div className="bg-white p-4 rounded-lg border border-gray-200">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Traffic Sources</h3>
                        <div className="space-y-3">
                          {analytics.topReferrers.map((referrer, index) => {
                            const getQualityColor = () => {
                              if (referrer.quality === 'high') return 'bg-green-100 text-green-700';
                              if (referrer.quality === 'medium') return 'bg-yellow-100 text-yellow-700';
                              return 'bg-blue-100 text-blue-700';
                            };

                            return (
                              <div key={index} className="flex items-center justify-between">
                                <div className="flex items-center gap-3 flex-1 min-w-0">
                                  <span className={`text-xs font-medium px-2 py-1 rounded-full ${getQualityColor()}`}>
                                    {referrer.quality.toUpperCase()}
                                  </span>
                                  <span className="text-gray-700 truncate">{referrer.source}</span>
                                </div>
                                <div className="flex items-center gap-2 flex-shrink-0 ml-4">
                                  <div className="w-20 bg-gray-200 rounded-full h-2">
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
                            );
                          })}
                        </div>
                      </div>

                      {/* Engagement Metrics */}
                      <div className="bg-white p-4 rounded-lg border border-gray-200">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Engagement Metrics</h3>
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                          <div className="text-center">
                            <p className="text-sm text-gray-600">Time on Page</p>
                            <p className="text-xl font-bold text-blue-600">
                              {analytics.engagementMetrics.averageTimeOnPage}s
                            </p>
                          </div>
                          <div className="text-center">
                            <p className="text-sm text-gray-600">Bounce Rate</p>
                            <p className="text-xl font-bold text-yellow-600">
                              {analytics.engagementMetrics.bounceRate}
                            </p>
                          </div>
                          <div className="text-center">
                            <p className="text-sm text-gray-600">Scroll Depth</p>
                            <p className="text-xl font-bold text-green-600">
                              {analytics.engagementMetrics.scrollDepth}
                            </p>
                          </div>
                          <div className="text-center">
                            <p className="text-sm text-gray-600">Photo Views</p>
                            <p className="text-xl font-bold text-purple-600">
                              {analytics.engagementMetrics.photoGalleryViews}
                            </p>
                          </div>
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
                              className="text-gray-200"
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
                              <div className="text-xs text-gray-500">Quality Score</div>
                            </div>
                          </div>
                        </div>
                        
                        <p className="mt-4 text-gray-600">
                          Your listing quality score is {analytics.qualityScore >= 80 ? 'excellent' : analytics.qualityScore >= 60 ? 'good' : 'needs improvement'}
                        </p>
                      </div>

                      {/* Quality Checklist - Compact design */}
                      <div className="bg-white p-4 rounded-lg border border-gray-200">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quality Checklist</h3>
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
                                <span className="text-gray-700 truncate">{item.text}</span>
                              </div>
                              <span className="text-sm text-gray-500 flex-shrink-0 ml-4">{item.current}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Performance Comparison - Compact design */}
                      <div className="bg-white p-4 rounded-lg border border-gray-200">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Comparison</h3>
                        <div className="flex items-center gap-4">
                          <Target className="h-8 w-8 text-blue-500 flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm text-gray-600">
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

                  {activeTab === 'market' && (
                    <div className="space-y-6">
                      {/* Price Comparison */}
                      <div className="bg-white p-4 rounded-lg border border-gray-200">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Price Comparison</h3>
                        <div className="grid grid-cols-2 gap-4 mb-4">
                          <div className="text-center">
                            <p className="text-sm text-gray-600">Your Price per sq.ft</p>
                            <p className="text-2xl font-bold text-blue-600">
                              ₹{analytics.marketComparison.yourPricePerSqft.toLocaleString()}
                            </p>
                          </div>
                          <div className="text-center">
                            <p className="text-sm text-gray-600">Market Average</p>
                            <p className="text-2xl font-bold text-green-600">
                              ₹{analytics.marketComparison.averagePricePerSqft.toLocaleString()}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center justify-center gap-4">
                          {analytics.marketComparison.priceCompetitive === 'competitive' ? (
                            <div className="flex items-center gap-2 text-green-600">
                              <TrendingUp className="h-5 w-5" />
                              <span className="font-medium">Your price is competitive</span>
                            </div>
                          ) : (
                            <div className="flex items-center gap-2 text-yellow-600">
                              <AlertCircle className="h-5 w-5" />
                              <span className="font-medium">Your price is above market average</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Similar Properties Comparison */}
                      <div className="bg-white p-4 rounded-lg border border-gray-200">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Similar Properties in {property.city || 'Your Area'}</h3>
                        <div className="overflow-x-auto">
                          <table className="w-full min-w-[600px]">
                            <thead>
                              <tr className="border-b border-gray-200">
                                <th className="text-left text-sm font-medium text-gray-500 pb-2">Property</th>
                                <th className="text-left text-sm font-medium text-gray-500 pb-2">Price</th>
                                <th className="text-left text-sm font-medium text-gray-500 pb-2">Area</th>
                                <th className="text-left text-sm font-medium text-gray-500 pb-2">Price/sq.ft</th>
                                <th className="text-left text-sm font-medium text-gray-500 pb-2">Views</th>
                              </tr>
                            </thead>
                            <tbody>
                              {analytics.marketComparison.similarProperties.map((prop, index) => (
                                <tr key={index} className="border-b border-gray-100">
                                  <td className="py-3">
                                    <div className="font-medium text-gray-900">{prop.bhk} BHK</div>
                                    <div className="text-xs text-gray-500">Property #{prop.id}</div>
                                  </td>
                                  <td className="py-3">
                                    <div className="font-medium text-gray-900">
                                      ₹{prop.priceValue?.toLocaleString()}
                                    </div>
                                  </td>
                                  <td className="py-3">
                                    <div className="text-gray-700">
                                      {prop.area}
                                    </div>
                                  </td>
                                  <td className="py-3">
                                    <div className="text-gray-700">
                                      ₹{prop.pricePerSqft.toLocaleString()}
                                    </div>
                                  </td>
                                  <td className="py-3">
                                    <div className="text-gray-700">
                                      {prop.views}
                                    </div>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>

                      {/* Performance Benchmarks */}
                      <div className="bg-white p-4 rounded-lg border border-gray-200">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Benchmarks</h3>
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <span className="text-gray-700">Views (30 days)</span>
                            <div className="flex items-center gap-2">
                              <span className="font-semibold">{analytics.totalViews}</span>
                              <span className="text-sm text-gray-500">vs {analytics.performanceBenchmarks.industryAverageViews} avg</span>
                              {analytics.totalViews > analytics.performanceBenchmarks.industryAverageViews ? (
                                <TrendingUp className="h-4 w-4 text-green-500" />
                              ) : (
                                <TrendingDown className="h-4 w-4 text-red-500" />
                              )}
                            </div>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-gray-700">Leads (30 days)</span>
                            <div className="flex items-center gap-2">
                              <span className="font-semibold">{analytics.leadsLast30Days}</span>
                              <span className="text-sm text-gray-500">vs {analytics.performanceBenchmarks.industryAverageLeads} avg</span>
                              {analytics.leadsLast30Days > analytics.performanceBenchmarks.industryAverageLeads ? (
                                <TrendingUp className="h-4 w-4 text-green-500" />
                              ) : (
                                <TrendingDown className="h-4 w-4 text-red-500" />
                              )}
                            </div>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-gray-700">Shortlists</span>
                            <div className="flex items-center gap-2">
                              <span className="font-semibold">{analytics.shortlistsCount}</span>
                              <span className="text-sm text-gray-500">vs {analytics.performanceBenchmarks.industryAverageShortlists} avg</span>
                              {analytics.shortlistsCount > analytics.performanceBenchmarks.industryAverageShortlists ? (
                                <TrendingUp className="h-4 w-4 text-green-500" />
                              ) : (
                                <TrendingDown className="h-4 w-4 text-red-500" />
                              )}
                            </div>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-gray-700">Conversion Rate</span>
                            <div className="flex items-center gap-2">
                              <span className="font-semibold">{analytics.leadQuality.conversionRate}</span>
                              <span className="text-sm text-gray-500">vs {analytics.performanceBenchmarks.industryAverageConversion} avg</span>
                              {parseFloat(analytics.leadQuality.conversionRate) > parseFloat(analytics.performanceBenchmarks.industryAverageConversion) ? (
                                <TrendingUp className="h-4 w-4 text-green-500" />
                              ) : (
                                <TrendingDown className="h-4 w-4 text-red-500" />
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === 'recommendations' && (
                    <div className="space-y-6">
                      <div className="bg-white p-4 rounded-lg border border-gray-200">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">AI-Powered Recommendations</h3>
                        <p className="text-sm text-gray-600 mb-4">
                          Based on your property's performance and market analysis, here are personalized recommendations to improve your listing:
                        </p>

                        {analytics.recommendations.length === 0 ? (
                          <div className="text-center py-8">
                            <CheckCircle className="h-8 w-8 text-green-500 mx-auto mb-2" />
                            <p className="text-gray-600">Great job! Your listing is well-optimized.</p>
                            <p className="text-sm text-gray-500 mt-1">Keep up the good work and monitor performance.</p>
                          </div>
                        ) : (
                          <div className="space-y-4">
                            {analytics.recommendations.map((rec, index) => {
                              const getPriorityColor = () => {
                                if (rec.type === 'critical') return 'border-red-200 bg-red-50';
                                if (rec.type === 'important') return 'border-yellow-200 bg-yellow-50';
                                return 'border-blue-200 bg-blue-50';
                              };

                              const getPriorityTextColor = () => {
                                if (rec.type === 'critical') return 'text-red-600';
                                if (rec.type === 'important') return 'text-yellow-600';
                                return 'text-blue-600';
                              };

                              const getImpactColor = () => {
                                if (rec.impact === 'High') return 'bg-red-100 text-red-700';
                                if (rec.impact === 'Medium') return 'bg-yellow-100 text-yellow-700';
                                return 'bg-blue-100 text-blue-700';
                              };

                              return (
                                <div key={index} className={`border-l-4 pl-4 ${getPriorityColor()}`}>
                                  <div className="flex items-start justify-between gap-4">
                                    <div className="flex-1">
                                      <div className="flex items-center gap-2 mb-1">
                                        <span className={`text-sm font-medium ${getPriorityTextColor()}`}>
                                          {rec.type === 'critical' ? '🚨 CRITICAL' : rec.type === 'important' ? '⚠️ IMPORTANT' : '💡 RECOMMENDED'}
                                        </span>
                                      </div>
                                      <h4 className="font-semibold text-gray-900 mb-1">{rec.title}</h4>
                                      <p className="text-sm text-gray-600 mb-2">{rec.description}</p>
                                      <span className={`text-xs font-medium px-2 py-1 rounded-full ${getImpactColor()}`}>
                                        Impact: {rec.impact}
                                      </span>
                                    </div>
                                    <button
                                      onClick={() => {
                                        // Handle recommendation action
                                        console.log('Recommendation action:', rec.action);
                                      }}
                                      className="flex-shrink-0 px-3 py-1 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                                    >
                                      {rec.action}
                                    </button>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>

                      {/* Engagement Metrics */}
                      <div className="bg-white p-4 rounded-lg border border-gray-200">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Engagement Metrics</h3>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="text-center">
                            <p className="text-sm text-gray-600">Time on Page</p>
                            <p className="text-xl font-bold text-blue-600">
                              {analytics.engagementMetrics.averageTimeOnPage}s
                            </p>
                          </div>
                          <div className="text-center">
                            <p className="text-sm text-gray-600">Bounce Rate</p>
                            <p className="text-xl font-bold text-yellow-600">
                              {analytics.engagementMetrics.bounceRate}
                            </p>
                          </div>
                          <div className="text-center">
                            <p className="text-sm text-gray-600">Scroll Depth</p>
                            <p className="text-xl font-bold text-green-600">
                              {analytics.engagementMetrics.scrollDepth}
                            </p>
                          </div>
                          <div className="text-center">
                            <p className="text-sm text-gray-600">Photo Views</p>
                            <p className="text-xl font-bold text-purple-600">
                              {analytics.engagementMetrics.photoGalleryViews}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === 'trends' && (
                    <div className="space-y-6">
                      <div className="bg-white p-4 rounded-lg border border-gray-200">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">30-Day View Trend</h3>
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
                              <div className="text-xs text-gray-600 mt-1">
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
