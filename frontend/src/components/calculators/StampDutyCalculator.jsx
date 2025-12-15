import React, { useState } from 'react';
import { Receipt } from 'lucide-react';

export default function StampDutyCalculator() {
  const [propertyValue, setPropertyValue] = useState(5000000);
  const [propertyType, setPropertyType] = useState('residential');
  const [buyerGender, setBuyerGender] = useState('male');
  const [state, setState] = useState('andhra_pradesh');

  const calculateStampDuty = () => {
    let stampDutyRate = 0;
    let registrationRate = 0;

    if (state === 'andhra_pradesh') {
      if (propertyType === 'residential') {
        stampDutyRate = buyerGender === 'female' ? 0.04 : 0.05;
        registrationRate = 0.01;
      } else {
        stampDutyRate = 0.075;
        registrationRate = 0.01;
      }
    }

    const stampDuty = propertyValue * stampDutyRate;
    const registration = propertyValue * registrationRate;
    const total = stampDuty + registration;

    return {
      stampDuty: Math.round(stampDuty),
      registration: Math.round(registration),
      total: Math.round(total)
    };
  };

  const result = calculateStampDuty();

  return (
    <div className="bg-white rounded-xl p-6 shadow-lg">
      <div className="flex items-center mb-6">
        <Receipt className="text-purple-600 mr-3" size={28} />
        <h2 className="text-2xl font-bold text-gray-800">Stamp Duty Calculator</h2>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Property Value (₹)
          </label>
          <input
            type="number"
            value={propertyValue}
            onChange={(e) => setPropertyValue(Number(e.target.value))}
            className="w-full p-3 border border-gray-300 rounded-lg bg-white text-gray-900"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            State
          </label>
          <select
            value={state}
            onChange={(e) => setState(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg bg-white text-gray-900"
          >
            <option value="andhra_pradesh">Andhra Pradesh</option>
            <option value="telangana">Telangana</option>
            <option value="karnataka">Karnataka</option>
            <option value="tamil_nadu">Tamil Nadu</option>
            <option value="maharashtra">Maharashtra</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Property Type
          </label>
          <div className="flex gap-4">
            <button
              onClick={() => setPropertyType('residential')}
              className={`flex-1 p-3 rounded-lg border-2 transition-colors ${
                propertyType === 'residential'
                  ? 'border-purple-600 bg-purple-50 text-purple-600'
                  : 'border-gray-300 text-gray-700'
              }`}
            >
              Residential
            </button>
            <button
              onClick={() => setPropertyType('commercial')}
              className={`flex-1 p-3 rounded-lg border-2 transition-colors ${
                propertyType === 'commercial'
                  ? 'border-purple-600 bg-purple-50 text-purple-600'
                  : 'border-gray-300 text-gray-700'
              }`}
            >
              Commercial
            </button>
          </div>
        </div>

        {propertyType === 'residential' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Buyer Gender
            </label>
            <div className="flex gap-4">
              <button
                onClick={() => setBuyerGender('male')}
                className={`flex-1 p-3 rounded-lg border-2 transition-colors ${
                  buyerGender === 'male'
                    ? 'border-purple-600 bg-purple-50 text-purple-600'
                    : 'border-gray-300 text-gray-700'
                }`}
              >
                Male
              </button>
              <button
                onClick={() => setBuyerGender('female')}
                className={`flex-1 p-3 rounded-lg border-2 transition-colors ${
                  buyerGender === 'female'
                    ? 'border-purple-600 bg-purple-50 text-purple-600'
                    : 'border-gray-300 text-gray-700'
                }`}
              >
                Female
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="mt-8 space-y-4">
        <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl p-6">
          <p className="text-sm opacity-90">Total Registration Cost</p>
          <p className="text-4xl font-bold">₹{result.total.toLocaleString('en-IN')}</p>
        </div>

        <div className="space-y-3">
          <div className="flex justify-between items-center p-4 bg-gray-100 rounded-lg">
            <span className="text-gray-700">Stamp Duty</span>
            <span className="font-bold text-gray-900">₹{result.stampDuty.toLocaleString('en-IN')}</span>
          </div>
          <div className="flex justify-between items-center p-4 bg-gray-100 rounded-lg">
            <span className="text-gray-700">Registration Charges</span>
            <span className="font-bold text-gray-900">₹{result.registration.toLocaleString('en-IN')}</span>
          </div>
        </div>

        {propertyType === 'residential' && buyerGender === 'female' && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <p className="text-sm text-green-800">
              🎉 <strong>Discount Applied!</strong> Women buyers get 1% discount on stamp duty in Andhra Pradesh.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
