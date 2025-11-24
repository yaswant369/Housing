import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CheckCircle, ArrowRight, Receipt } from 'lucide-react';

export default function PaymentSuccessPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { subscription } = location.state || {};

  if (!subscription) {
    navigate('/premium');
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900 text-white flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700 text-center">
          <div className="mb-6">
            <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
              <CheckCircle size={48} />
            </div>
            <h1 className="text-3xl font-bold mb-2">Payment Successful!</h1>
            <p className="text-gray-400">Your premium subscription is now active</p>
          </div>

          <div className="bg-gray-900/50 rounded-xl p-6 mb-6 text-left">
            <h2 className="font-bold mb-4 text-center">Subscription Details</h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-400">Plan</span>
                <span className="font-bold">{subscription.planName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Valid Until</span>
                <span className="font-bold">{new Date(subscription.endDate).toLocaleDateString('en-IN')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Subscription ID</span>
                <span className="font-mono text-sm">{subscription.subscriptionId}</span>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <button
              onClick={() => navigate('/')}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 py-3 rounded-xl font-bold hover:from-purple-700 hover:to-blue-700 transition-all flex items-center justify-center"
            >
              Start Exploring
              <ArrowRight size={20} className="ml-2" />
            </button>
            <button
              onClick={() => navigate('/transactions')}
              className="w-full bg-gray-700 py-3 rounded-xl font-bold hover:bg-gray-600 transition-all flex items-center justify-center"
            >
              <Receipt size={20} className="mr-2" />
              View Receipt
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
