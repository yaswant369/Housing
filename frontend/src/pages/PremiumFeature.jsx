 import React, { useState, useEffect } from 'react';
import { 
  X, ArrowLeft, Check, Info, Zap, Star, Heart, Percent, Gift, 
  CreditCard, Banknote, Wallet, History, Plus 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom'; // 1. Import

// --------------------------------------------------
// DATA (All data is in this file now)
// --------------------------------------------------
const premiumPlansData = [
  {
    id: 'sachet',
    title: 'Sachet',
    trial: '7 days trial',
    contacts: 5,
    price: 659,
    originalPrice: 1198,
    features: [
      'Contact up to 5 owners',
      'Priority Customer support',
      'Instant alerts on new properties',
    ],
    isPopular: false,
  },
  {
    id: 'connect',
    title: 'Connect',
    contacts: 25,
    price: 1319,
    originalPrice: 2398,
    features: [
      'Contact up to 25 owners',
      'Priority Customer support',
      'Instant alerts on new properties',
    ],
    isPopular: false,
  },
  {
    id: 'connect_plus',
    title: 'Connect+',
    contacts: 50,
    price: 1759,
    originalPrice: 3198,
    features: [
      'Contact up to 50 owners',
      'Priority Customer support',
      'Instant alerts on new properties',
    ],
    isPopular: true,
  },
  {
    id: 'relax',
    title: 'Relax',
    contacts: 100,
    price: 2859,
    originalPrice: 5198,
    features: [
      'Contact up to 100 owners',
      'Priority Customer support',
      'Instant alerts on new properties',
      'Dedicated relationship manager',
    ],
    isPopular: false,
  },
];

const addOnsData = [
  {
    id: 'ai_rec',
    title: 'AI-recommended properties',
    price: 199,
  },
  {
    id: 'relationship_manager',
    title: 'A Relationship Manager',
    price: 499,
  },
];

// --------------------------------------------------
// COMPONENT 1: The "Wizard's Cards" Game
// --------------------------------------------------
function DiscountGame({ onDiscountApply, onSkip }) {
  const [showGame, setShowGame] = useState(true);
  const [showCards, setShowCards] = useState(false);

  const discounts = [
    { type: 'discount', value: 55, icon: Percent },
    { type: 'discount', value: 60, icon: Percent },
    { type: 'discount', value: 65, icon: Percent },
    { type: 'cashback', value: 500, icon: Gift, isRare: true },
  ];

  const handlePlay = () => {
    setShowGame(false);
    setShowCards(true);
  };

  const handleSelectCard = (discount) => {
    alert(`You won ${discount.value}% discount!`);
    onDiscountApply(discount.value);
  };

  if (showGame) {
    return (
      <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-50 p-4">
        <div className="bg-gradient-to-br from-purple-900 to-indigo-900 rounded-2xl p-6 text-center text-white max-w-sm relative shadow-2xl">
          <button onClick={onSkip} className="absolute top-3 right-3 text-white/50 hover:text-white">
            <X size={20} />
          </button>
          <Star size={40} className="mx-auto text-yellow-400 mb-4" />
          <h2 className="text-2xl font-bold mb-2">Play the game to win</h2>
          <h3 className="text-3xl font-bold text-yellow-400 mb-4">Housing Premium for free</h3>
          <p className="text-white/80 mb-6">26 users won Premium for free in last 1 hour</p>
          <button
            onClick={handlePlay}
            className="w-full bg-pink-600 text-white font-bold py-3 rounded-lg text-lg hover:bg-pink-700 transition-colors"
          >
            Play and Win
          </button>
          <button onClick={onSkip} className="mt-4 text-white/70">
            Exit
          </button>
        </div>
      </div>
    );
  }

  if (showCards) {
    return (
      <div className="fixed inset-0 bg-gray-900 bg-opacity-80 backdrop-blur-md flex items-center justify-center z-50 p-4">
        <div className="text-center max-w-md">
          <h2 className="text-3xl font-bold text-white mb-8">Choose a card to reveal your prize!</h2>
          <div className="grid grid-cols-2 gap-4">
            {discounts.map((card, index) => (
              <button
                key={index}
                onClick={() => handleSelectCard(card)}
                className={`aspect-[3/4] p-4 rounded-2xl bg-purple-900 bg-opacity-40 border border-purple-500/30 text-white flex flex-col justify-between items-center transition-transform hover:scale-105 hover:shadow-2xl ${
                  card.isRare ? 'shadow-yellow-400/50' : ''
                }`}
              >
                <div className="text-left w-full">
                  <span className="text-xs uppercase opacity-70">Wizard's Cards</span>
                  {card.isRare && <span className="text-xs uppercase text-yellow-400 ml-2">Rare Card</span>}
                </div>
                <div className="text-center">
                  <card.icon size={40} className="mx-auto mb-2 opacity-80" />
                  <p className="text-sm opacity-80">Upto</p>
                  <p className="text-4xl font-bold">{card.value}{card.type === 'discount' ? '%' : ''}</p>
                  <p className="text-2xl font-light">{card.type}</p>
                </div>
                <div className="text-xs opacity-70 rotate-180">Wizard's Cards</div>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return null;
}

// --------------------------------------------------
// COMPONENT 2: The Checkout Page
// --------------------------------------------------
function CheckoutPage({ selectedPlan, discount }) {
  const [addOns, setAddOns] = useState([]);

  const planPrice = selectedPlan.price;
  const discountAmount = Math.floor(planPrice * (discount / 100));
  const discountedPrice = planPrice - discountAmount;
  const gst = Math.floor(discountedPrice * 0.18);
  const totalAddOnPrice = addOns.reduce((acc, curr) => acc + curr.price, 0);
  const total = discountedPrice + gst + totalAddOnPrice;

  const savings = selectedPlan.originalPrice - selectedPlan.price + discountAmount;

  const paymentOptions = [
    { name: 'Cards', description: 'VISA, Mastercard, Rupay & More', icon: CreditCard },
    { name: 'Net Banking', description: 'All Indian Banks', icon: Banknote },
    { name: 'Wallet', description: 'PhonePe & More', icon: Wallet },
    { name: 'Pay Later', description: 'Simpl & LazyPay', icon: History },
  ];

  const handleAddOnToggle = (addOn) => {
    if (addOns.find(a => a.id === addOn.id)) {
      setAddOns(prev => prev.filter(a => a.id !== addOn.id));
    } else {
      setAddOns(prev => [...prev, addOn]);
    }
  };

  return (
    <div className="bg-gray-100 dark:bg-gray-900 min-h-full">
      <div className="p-4 bg-gradient-to-r from-teal-400 to-blue-500 text-white text-center rounded-b-xl shadow-lg">
        <h2 className="text-lg font-semibold">Buying <span className="font-bold">{selectedPlan.title} Plan</span></h2>
        <h1 className="text-4xl font-bold my-1">₹{total.toLocaleString('en-IN')}</h1>
        <p className="text-sm">
          Plan Price: <span className="font-semibold">₹{discountedPrice.toLocaleString('en-IN')}</span> + GST: <span className="font-semibold">₹{gst.toLocaleString('en-IN')}</span>
          {totalAddOnPrice > 0 && ` + Add-ons: ₹${totalAddOnPrice.toLocaleString('en-IN')}`}
        </p>
        <div className="mt-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-1 inline-block">
          <p className="text-sm font-semibold">You are saving ₹{savings.toLocaleString('en-IN')} on this payment</p>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Add more for less */}
        <div className="space-y-3">
          <h3 className="font-bold text-lg text-gray-800 dark:text-gray-100">Add more for less</h3>
          {addOnsData.map(addOn => {
            const isAdded = addOns.find(a => a.id === addOn.id);
            return (
              <div key={addOn.id} className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
                <div>
                  <h4 className="font-semibold text-gray-800 dark:text-gray-100">{addOn.title}</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">for <span className="font-bold text-gray-900 dark:text-white">₹{addOn.price}</span></p>
                </div>
                <button
                  onClick={() => handleAddOnToggle(addOn)}
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                    isAdded ? 'bg-green-600 text-white' : 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300'
                  }`}
                >
                  {isAdded ? <Check size={20} /> : <Plus size={20} />}
                </button>
              </div>
            );
          })}
        </div>

        {/* Payment Options */}
        <div>
          <h3 className="font-bold text-lg text-gray-800 dark:text-gray-100 mb-3">Payment Options</h3>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow divide-y divide-gray-200 dark:divide-gray-700">
            {paymentOptions.map(option => (
              <button key={option.name} className="w-full flex items-center p-4 text-left hover:bg-gray-50 dark:hover:bg-gray-700">
                <option.icon className="w-6 h-6 text-blue-600 dark:text-blue-400 mr-4" />
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-800 dark:text-gray-100">{option.name}</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{option.description}</p>
                </div>
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 sticky bottom-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
        <button className="w-full bg-gradient-to-r from-orange-500 to-pink-600 text-white font-bold py-3 rounded-lg text-lg">
          Pay ₹{total.toLocaleString('en-IN')}
        </button>
        <p className="text-center text-xs text-gray-500 dark:text-gray-400 mt-2">
          <svg viewBox="0 0 16 16" className="w-4 h-4 inline-block -mt-0.5"><path fill="#008C00" d="M12.4 3.6l-5 5-2.8-2.8-1.2 1.2 4 4 6.2-6.2z M8 0C3.6 0 0 3.6 0 8s3.6 8 8 8 8-3.6 8-8-3.6-8-8-8z"></path></svg>
          100% secure payments. Powered by <span className="font-bold">Razorpay</span>
        </p>
      </div>
    </div>
  );
}


// --------------------------------------------------
// COMPONENT 3: Timer
// --------------------------------------------------
const OfferTimer = ({ onExpire }) => {
  const [timeLeft, setTimeLeft] = useState(15 * 60); // 15 minutes
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          onExpire();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [onExpire]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  return <span>{String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}</span>;
};


// --------------------------------------------------
// MAIN EXPORT: The Premium Plans Modal
// --------------------------------------------------
export default function PremiumFeature() { // 2. No 'onClose' prop
  const navigate = useNavigate(); // 3. Get navigate
  const [currentStep, setCurrentStep] = useState('plans');
  const [selectedPlanId, setSelectedPlanId] = useState(
    premiumPlansData.find(p => p.isPopular)?.id || premiumPlansData[0].id
  );
  const [appliedDiscount, setAppliedDiscount] = useState(0);
  const [offerExpired, setOfferExpired] = useState(false);
  const [validity, setValidity] = useState('90'); 

  const selectedPlan = premiumPlansData.find(p => p.id === selectedPlanId);

  const handleProceedToPay = () => {
    setCurrentStep('game');
  };

  const handleDiscountApply = (discount) => {
    setAppliedDiscount(discount);
    setCurrentStep('checkout');
  };

  const handleSkipGame = () => {
    setAppliedDiscount(0);
    setCurrentStep('checkout');
  };

  const handleGoBack = () => {
    if (currentStep === 'checkout' || currentStep === 'game') {
      setCurrentStep('plans');
      setAppliedDiscount(0);
    }
  };

  // Main render logic
  const renderStep = () => {
    if (currentStep === 'game') {
      return (
        <DiscountGame 
          onDiscountApply={handleDiscountApply} 
          onSkip={handleSkipGame} 
        />
      );
    }
    
    if (currentStep === 'checkout') {
      return (
        <CheckoutPage 
          selectedPlan={selectedPlan} 
          discount={appliedDiscount} 
        />
      );
    }

    // Default 'plans' step
    return (
      <div className="bg-gray-900 text-white min-h-full">
        {/* Discount Banner */}
        <div className="p-4 bg-gradient-to-r from-green-400 to-teal-500 text-center">
          <h3 className="font-bold text-lg text-gray-900">Hooray, upto 45% discount has been applied!</h3>
        </div>

        {/* Validity Tabs */}
        <div className="p-4">
          <div className="flex bg-gray-800 rounded-full p-1">
            <button 
              onClick={() => setValidity('45')}
              className={`w-1/2 py-2 rounded-full font-semibold ${validity === '45' ? 'bg-indigo-600 text-white' : 'text-gray-400'}`}
            >
              45 days validity
            </button>
            <button 
              onClick={() => setValidity('90')}
              className={`w-1/2 py-2 rounded-full font-semibold ${validity === '90' ? 'bg-indigo-600 text-white' : 'text-gray-400'}`}
            >
              90 days validity
            </button>
          </div>
        </div>

        {/* Plans */}
        <div className="p-4 space-y-3">
          {premiumPlansData.map(plan => {
            const isSelected = plan.id === selectedPlanId;
            return (
              <div
                key={plan.id}
                onClick={() => setSelectedPlanId(plan.id)}
                className={`p-4 rounded-xl border-2 transition-all ${isSelected ? 'border-indigo-500 bg-gray-800' : 'border-gray-700 bg-gray-800/50'}`}
              >
                <div className="flex items-center">
                  <div className={`w-5 h-5 rounded-full border-2 mr-4 flex items-center justify-center ${isSelected ? 'border-indigo-500 bg-indigo-600' : 'border-gray-500'}`}>
                    {isSelected && <Check size={12} className="text-white" />}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold">
                      {plan.title}
                      {plan.trial && <span className="ml-2 text-xs font-semibold bg-yellow-400 text-black px-2 py-0.5 rounded-full">{plan.trial}</span>}
                      {plan.isPopular && <span className="ml-2 text-xs font-semibold bg-pink-600 text-white px-2 py-0.5 rounded-full">Popular</span>}
                    </h3>
                    <p className="text-sm text-gray-400">{plan.contacts} owner contacts</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold">₹{plan.price.toLocaleString('en-IN')}</p>
                    <p className="text-sm text-gray-500 line-through">₹{plan.originalPrice.toLocaleString('en-IN')}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Benefits */}
        <div className="p-4">
          <h3 className="font-bold text-lg mb-3">Benefits You'll Access</h3>
          <ul className="space-y-2">
            {selectedPlan.features.map(feature => (
              <li key={feature} className="flex items-center">
                <Check size={16} className="text-green-500 mr-2 flex-shrink-0" />
                <span className="text-gray-300">{feature}</span>
              </li>
            ))}
            {!selectedPlan.features.find(f => f.includes('Dedicated')) && (
               <li className="flex items-center">
                <X size={16} className="text-gray-500 mr-2 flex-shrink-0" />
                <span className="text-gray-500">Dedicated relationship manager</span>
                <Info size={14} className="text-gray-500 ml-1" />
              </li>
            )}
          </ul>
        </div>

        {/* Helpful Add-Ons */}
        <div className="p-4 space-y-3">
          <h3 className="font-bold text-lg mb-2">Helpful Add-Ons</h3>
          <div className="p-4 bg-gray-800 rounded-lg flex justify-between items-center">
            <div>
              <p className="font-semibold text-white">AI-recommended properties</p>
              <p className="text-sm text-gray-400">@ just ₹199/- <a href="#" className="text-indigo-400">Know more {'>'}</a></p>
            </div>
            <button className="px-4 py-1.5 rounded-full border border-gray-500 text-white font-semibold text-sm">Remove</button>
          </div>
          <button className="w-full flex justify-between items-center p-4 bg-gray-800 rounded-lg">
            <span className="font-semibold"><Zap size={16} className="inline mr-2 text-yellow-400" />Apply Coupon</span>
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
          </button>
        </div>

        {/* Testimonials */}
        <div className="p-4">
          <div className="flex mb-4">
            <button className="w-1/2 py-2 border-b-2 border-pink-500 font-semibold">Testimonials</button>
            <button className="w-1/2 py-2 text-gray-500">Featured In</button>
          </div>
          <div className="flex overflow-x-auto gap-4 pb-4">
            <div className="min-w-[280px] p-4 bg-gray-800 rounded-xl">
              <p className="text-sm text-gray-400 mb-2">July 12, 2025</p>
              <div className="flex text-yellow-400 mb-2">
                {[...Array(5)].map((_, i) => <Star key={i} size={20} fill="currentColor" />)}
              </div>
              <p className="text-white mb-3">"Sahibha, my Relationship Manager, has been very helpful in my flat search..."</p>
              <p className="font-semibold">Arjit</p>
            </div>
            <div className="min-w-[280px] p-4 bg-gray-800 rounded-xl">
              <p className="text-sm text-gray-400 mb-2">July 26, 2025</p>
              <div className="flex text-yellow-400 mb-2">
                {[...Array(5)].map((_, i) => <Star key={i} size={20} fill="currentColor" />)}
              </div>
              <p className="text-white mb-3">"Amol helped me find a suitable flat..."</p>
              <p className="font-semibold">Jatin</p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-gray-900 text-white">
      {/* Main Header */}
      <header className="flex items-center p-4 border-b border-gray-700 flex-shrink-0">
        <button 
          // 4. Use navigate
          onClick={() => currentStep === 'plans' ? navigate(-1) : handleGoBack()} 
          className="p-2 rounded-full hover:bg-gray-700"
        >
          <ArrowLeft size={20} />
        </button>
        <div className="flex-1 text-center">
          <h2 className="font-bold text-lg">
            {currentStep === 'plans' && 'Housing Premium'}
            {currentStep === 'game' && 'Claim Your Reward'}
            {currentStep === 'checkout' && 'Complete Payment'}
          </h2>
        </div>
        <div className="w-8">
          {currentStep === 'plans' && (
            <button 
              onClick={() => navigate(-1)} // 5. Use navigate
              className="p-2 rounded-full hover:bg-gray-700"
            >
              <X size={20} />
            </button>
          )}
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        {renderStep()}
      </div>

      {/* Main Footer (Buy Button) */}
      {currentStep === 'plans' && (
        <footer className="p-4 bg-gray-900 border-t border-gray-700 flex-shrink-0">
          <div className="flex justify-between items-center text-sm mb-2">
            <a href="#" className="text-gray-400 hover:text-white">Terms & Conditions</a>
            <span className="text-gray-400">
              +18% GST applicable
              <Info size={14} className="inline-block ml-1" />
            </span>
          </div>
          <button
            onClick={handleProceedToPay}
            disabled={offerExpired}
            className="w-full bg-pink-600 text-white font-bold py-3 rounded-lg text-lg text-center disabled:bg-gray-500"
          >
            Buy {selectedPlan.title} at ₹{selectedPlan.price.toLocaleString('en-IN')}
            <div className="text-xs font-normal">
              Hurry! Offer is expiring <OfferTimer onExpire={() => setOfferExpired(true)} />
            </div>
          </button>
        </footer>
      )}
    </div>
  );
}