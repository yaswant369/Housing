import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Check, Shield, Zap, Phone, MapPin, 
  Crown, Star, TrendingUp, Award, X
} from 'lucide-react';
import { AppContext } from '../context/AppContext';

export default function PremiumPage() {
  const navigate = useNavigate();
  const { API_URL, currentUser, token } = useContext(AppContext);
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [currentSubscription, setCurrentSubscription] = useState(null);

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    fetchPlans();
    if (currentUser) {
      fetchCurrentSubscription();
    }
  }, [currentUser]);

  const fetchPlans = async () => {
    try {
      const response = await fetch(`${API_URL}/subscription/plans`);
      const data = await response.json();
      setPlans(data.plans);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching plans:', error);
      setLoading(false);
    }
  };

  const fetchCurrentSubscription = async () => {
    try {
      const response = await fetch(`${API_URL}/subscription/my-subscription`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.hasPremium) {
        setCurrentSubscription(data.subscription);
      }
    } catch (error) {
      console.error('Error fetching subscription:', error);
    }
  };

  const handleSelectPlan = (plan) => {
    if (!currentUser) {
      navigate('/login');
      return;
    }
    setSelectedPlan(plan);
  };

  const handleProceedToPayment = () => {
    if (selectedPlan) {
      navigate('/checkout', { state: { selectedPlan } });
    }
  };

  const features = [
    { icon: Phone, title: 'Unlimited Contact Access', desc: 'Get owner contact numbers instantly' },
    { icon: MapPin, title: 'Exact Location', desc: 'View precise property locations' },
    { icon: Zap, title: 'Instant Notifications', desc: 'Get alerts for new listings first' },
    { icon: Shield, title: 'Priority Support', desc: '24/7 dedicated customer service' },
    { icon: TrendingUp, title: 'AI Recommendations', desc: 'Smart property suggestions' },
    { icon: Award, title: 'Verified Listings', desc: 'Access to premium verified properties' }
  ];

  const getPlanIcon = (planType) => {
    switch(planType) {
      case 'basic': return Star;
      case 'professional': return TrendingUp;
      case 'premium': return Crown;
      case 'enterprise': return Award;
      default: return Star;
    }
  };

  const getPlanColor = (planType) => {
    switch(planType) {
      case 'basic': return 'from-blue-500 to-blue-600';
      case 'professional': return 'from-purple-500 to-purple-600';
      case 'premium': return 'from-yellow-500 to-orange-500';
      case 'enterprise': return 'from-red-500 to-pink-600';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900 text-white pt-0">
      {/* Header */}
      <header className="bg-gray-900/80 backdrop-blur-lg border-b border-gray-800 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <button onClick={() => navigate('/')} className="p-2 hover:bg-gray-800 rounded-lg">
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-xl font-bold">Premium Plans</h1>
          <div className="w-10"></div>
        </div>
      </header>

      {/* Current Subscription Banner (if exists) */}
      {currentSubscription && (
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl p-6 shadow-2xl">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-bold mb-2">Active: {currentSubscription.planName}</h3>
                <p className="text-white/90">
                  {currentSubscription.contactsRemaining} contacts remaining • 
                  {currentSubscription.daysRemaining} days left
                </p>
              </div>
              <Crown size={48} className="text-yellow-300" />
            </div>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 py-12 text-center">
        <div className="inline-block mb-6">
          <div className="relative">
            <Crown size={64} className="text-yellow-400 mx-auto animate-pulse" />
            <div className="absolute inset-0 blur-xl bg-yellow-400/30"></div>
          </div>
        </div>
        <h2 className="text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-600">
          Unlock Premium Access
        </h2>
        <p className="text-xl text-gray-300 max-w-2xl mx-auto">
          Get instant access to owner contacts, exact locations, and exclusive property listings
        </p>
      </div>

      {/* Features Grid */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {features.map((feature, idx) => (
            <div key={idx} className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700 hover:border-purple-500 transition-all hover:scale-105">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl flex items-center justify-center mb-4">
                <feature.icon size={24} />
              </div>
              <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
              <p className="text-gray-400">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Pricing Plans */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <h3 className="text-3xl font-bold text-center mb-12">Choose Your Plan</h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {plans.map((plan) => {
            const Icon = getPlanIcon(plan.planType);
            const isSelected = selectedPlan?.planId === plan.planId;
            const isRecommended = plan.planType === 'professional';
            
            return (
              <div 
                key={plan.planId}
                onClick={() => handleSelectPlan(plan)}
                className={`relative bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border-2 cursor-pointer transition-all hover:scale-105 ${
                  isSelected ? 'border-purple-500 shadow-2xl shadow-purple-500/50' : 'border-gray-700'
                }`}
              >
                {isRecommended && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-4 py-1 rounded-full text-sm font-bold">
                      Most Popular
                    </span>
                  </div>
                )}
                
                <div className={`w-16 h-16 bg-gradient-to-br ${getPlanColor(plan.planType)} rounded-2xl flex items-center justify-center mb-4 mx-auto`}>
                  <Icon size={32} />
                </div>
                
                <h4 className="text-2xl font-bold text-center mb-2">{plan.planName}</h4>
                <div className="text-center mb-4">
                  <span className="text-4xl font-bold">₹{plan.amount}</span>
                  <span className="text-gray-400 text-sm">/90 days</span>
                </div>
                
                <div className="space-y-2 mb-6">
                  <div className="flex items-center text-sm">
                    <Check size={16} className="text-green-400 mr-2" />
                    <span>{plan.contactsAllowed === 999999 ? 'Unlimited' : plan.contactsAllowed} Contacts</span>
                  </div>
                  {plan.features.prioritySupport && (
                    <div className="flex items-center text-sm">
                      <Check size={16} className="text-green-400 mr-2" />
                      <span>Priority Support</span>
                    </div>
                  )}
                  {plan.features.aiRecommendations && (
                    <div className="flex items-center text-sm">
                      <Check size={16} className="text-green-400 mr-2" />
                      <span>AI Recommendations</span>
                    </div>
                  )}
                  {plan.features.relationshipManager && (
                    <div className="flex items-center text-sm">
                      <Check size={16} className="text-green-400 mr-2" />
                      <span>Relationship Manager</span>
                    </div>
                  )}
                </div>
                
                <button 
                  className={`w-full py-3 rounded-xl font-bold transition-all ${
                    isSelected 
                      ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white' 
                      : 'bg-gray-700 hover:bg-gray-600'
                  }`}
                >
                  {isSelected ? 'Selected' : 'Select Plan'}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* CTA Section */}
      {selectedPlan && (
        <div className="fixed bottom-0 left-0 right-0 bg-gray-900/95 backdrop-blur-lg border-t border-gray-800 p-4 z-50">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div>
              <h4 className="font-bold text-lg">{selectedPlan.planName}</h4>
              <p className="text-sm text-gray-400">₹{selectedPlan.totalAmount} (incl. GST)</p>
            </div>
            <button
              onClick={handleProceedToPayment}
              className="bg-gradient-to-r from-purple-600 to-blue-600 px-8 py-3 rounded-xl font-bold hover:from-purple-700 hover:to-blue-700 transition-all"
            >
              Proceed to Payment
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
