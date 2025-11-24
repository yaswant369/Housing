import React, { useState, useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, CreditCard, Smartphone, Building2, Wallet, Shield, Check } from 'lucide-react';
import { AppContext } from '../context/AppContext';

export default function CheckoutPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { API_URL, token, currentUser } = useContext(AppContext);
  const { selectedPlan } = location.state || {};
  
  const [paymentMethod, setPaymentMethod] = useState('upi');
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState(null);

  if (!selectedPlan) {
    navigate('/premium');
    return null;
  }

  const paymentMethods = [
    { id: 'upi', name: 'UPI', icon: Smartphone, desc: 'Google Pay, PhonePe, Paytm' },
    { id: 'card', name: 'Credit/Debit Card', icon: CreditCard, desc: 'Visa, Mastercard, RuPay' },
    { id: 'netbanking', name: 'Net Banking', icon: Building2, desc: 'All Major Banks' },
    { id: 'wallet', name: 'Wallet', icon: Wallet, desc: 'Paytm, PhonePe' },
  ];

  const handlePayment = async () => {
    if (!currentUser) {
      navigate('/login');
      return;
    }

    setProcessing(true);
    setError(null);

    try {
      // Step 1: Initiate payment
      const initiateResponse = await fetch(`${API_URL}/subscription/initiate-payment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          planType: selectedPlan.planType,
          paymentMethod,
          discount: 0
        })
      });

      const initiateData = await initiateResponse.json();
      
      if (!initiateResponse.ok) {
        throw new Error(initiateData.message || 'Payment initiation failed');
      }

      // Step 2: In production, open Razorpay/Stripe modal here
      // For demo, simulate payment success after 2 seconds
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Step 3: Complete payment
      const completeResponse = await fetch(`${API_URL}/subscription/complete-payment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          transactionId: initiateData.transactionId,
          gatewayTransactionId: `GATEWAY_${Date.now()}`,
          gatewayResponse: { status: 'success' }
        })
      });

      const completeData = await completeResponse.json();

      if (!completeResponse.ok) {
        throw new Error(completeData.message || 'Payment failed');
      }

      // Success! Navigate to success page
      navigate('/payment-success', { 
        state: { 
          subscription: completeData.subscription 
        } 
      });

    } catch (err) {
      console.error('Payment error:', err);
      setError(err.message);
      setProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900 text-white">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-gray-900/80 backdrop-blur-lg border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <button onClick={() => navigate('/premium')} className="p-2 hover:bg-gray-800 rounded-lg">
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-xl font-bold">Complete Payment</h1>
          <div className="w-10"></div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Plan Summary */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 mb-8 border border-gray-700">
          <h2 className="text-2xl font-bold mb-4">Order Summary</h2>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-400">Plan</span>
              <span className="font-bold">{selectedPlan.planName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Contacts</span>
              <span>{selectedPlan.contactsAllowed === 999999 ? 'Unlimited' : selectedPlan.contactsAllowed}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Validity</span>
              <span>{selectedPlan.validityDays} days</span>
            </div>
            <div className="border-t border-gray-700 pt-3 mt-3">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-400">Plan Amount</span>
                <span>₹{selectedPlan.amount}</span>
              </div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-400">GST (18%)</span>
                <span>₹{selectedPlan.gst}</span>
              </div>
              <div className="flex justify-between text-2xl font-bold">
                <span>Total Amount</span>
                <span className="text-green-400">₹{selectedPlan.totalAmount}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 mb-8 border border-gray-700">
          <h2 className="text-2xl font-bold mb-6">Payment Method</h2>
          <div className="space-y-3">
            {paymentMethods.map((method) => (
              <button
                key={method.id}
                onClick={() => setPaymentMethod(method.id)}
                className={`w-full flex items-center p-4 rounded-xl border-2 transition-all ${
                  paymentMethod === method.id
                    ? 'border-purple-500 bg-purple-500/20'
                    : 'border-gray-700 hover:border-gray-600'
                }`}
              >
                <div className="w-12 h-12 bg-gray-700 rounded-lg flex items-center justify-center mr-4">
                  <method.icon size={24} />
                </div>
                <div className="flex-1 text-left">
                  <h3 className="font-bold">{method.name}</h3>
                  <p className="text-sm text-gray-400">{method.desc}</p>
                </div>
                {paymentMethod === method.id && (
                  <Check size={24} className="text-purple-500" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-500/20 border border-red-500 rounded-xl p-4 mb-8">
            <p className="text-red-300">{error}</p>
          </div>
        )}

        {/* Pay Button */}
        <button
          onClick={handlePayment}
          disabled={processing}
          className="w-full bg-gradient-to-r from-purple-600 to-blue-600 py-4 rounded-xl font-bold text-lg hover:from-purple-700 hover:to-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {processing ? (
            <span className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-white mr-3"></div>
              Processing...
            </span>
          ) : (
            `Pay ₹${selectedPlan.totalAmount}`
          )}
        </button>

        {/* Security Note */}
        <div className="mt-6 flex items-center justify-center text-sm text-gray-400">
          <Shield size={16} className="mr-2" />
          <span>100% secure payments powered by Razorpay</span>
        </div>
      </div>
    </div>
  );
}
