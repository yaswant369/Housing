import React, { useState } from 'react';
import { Calculator } from 'lucide-react';

export default function EMICalculator() {
  const [loanAmount, setLoanAmount] = useState(5000000);
  const [interestRate, setInterestRate] = useState(8.5);
  const [loanTenure, setLoanTenure] = useState(20);
  const [result, setResult] = useState(null);

  const calculateEMI = () => {
    const principal = parseFloat(loanAmount);
    const rate = parseFloat(interestRate) / 12 / 100;
    const tenure = parseFloat(loanTenure) * 12;

    const emi = (principal * rate * Math.pow(1 + rate, tenure)) / (Math.pow(1 + rate, tenure) - 1);
    const totalAmount = emi * tenure;
    const totalInterest = totalAmount - principal;

    setResult({
      emi: Math.round(emi),
      totalAmount: Math.round(totalAmount),
      totalInterest: Math.round(totalInterest),
      principal: Math.round(principal)
    });
  };

  React.useEffect(() => {
    calculateEMI();
  }, [loanAmount, interestRate, loanTenure]);

  return (
    <div className="bg-white rounded-xl p-6 shadow-lg">
      <div className="flex items-center mb-6">
        <Calculator className="text-blue-600 mr-3" size={28} />
        <h2 className="text-2xl font-bold text-gray-800">EMI Calculator</h2>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Loan Amount (₹)
          </label>
          <input
            type="number"
            value={loanAmount}
            onChange={(e) => setLoanAmount(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="range"
            min="100000"
            max="50000000"
            step="100000"
            value={loanAmount}
            onChange={(e) => setLoanAmount(e.target.value)}
            className="w-full mt-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Interest Rate (% per annum)
          </label>
          <input
            type="number"
            step="0.1"
            value={interestRate}
            onChange={(e) => setInterestRate(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="range"
            min="5"
            max="20"
            step="0.1"
            value={interestRate}
            onChange={(e) => setInterestRate(e.target.value)}
            className="w-full mt-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Loan Tenure (Years)
          </label>
          <input
            type="number"
            value={loanTenure}
            onChange={(e) => setLoanTenure(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="range"
            min="1"
            max="30"
            value={loanTenure}
            onChange={(e) => setLoanTenure(e.target.value)}
            className="w-full mt-2"
          />
        </div>
      </div>

      {result && (
        <div className="mt-8 space-y-4">
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl p-6">
            <p className="text-sm opacity-90">Monthly EMI</p>
            <p className="text-4xl font-bold">₹{result.emi.toLocaleString('en-IN')}</p>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="bg-gray-100 rounded-lg p-4 text-center">
              <p className="text-xs text-gray-600">Principal</p>
              <p className="text-lg font-bold text-gray-900">₹{(result.principal / 100000).toFixed(1)}L</p>
            </div>
            <div className="bg-gray-100 rounded-lg p-4 text-center">
              <p className="text-xs text-gray-600">Interest</p>
              <p className="text-lg font-bold text-gray-900">₹{(result.totalInterest / 100000).toFixed(1)}L</p>
            </div>
            <div className="bg-gray-100 rounded-lg p-4 text-center">
              <p className="text-xs text-gray-600">Total Amount</p>
              <p className="text-lg font-bold text-gray-900">₹{(result.totalAmount / 100000).toFixed(1)}L</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
