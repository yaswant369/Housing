import React, { useState } from 'react';
import { Home } from 'lucide-react';

export default function AffordabilityCalculator() {
  const [monthlyIncome, setMonthlyIncome] = useState(100000);
  const [monthlyExpenses, setMonthlyExpenses] = useState(40000);
  const [existingEMI, setExistingEMI] = useState(0);
  const [downPayment, setDownPayment] = useState(1000000);
  const [interestRate, setInterestRate] = useState(8.5);
  const [loanTenure, setLoanTenure] = useState(20);

  const calculateAffordability = () => {
    const disposableIncome = monthlyIncome - monthlyExpenses - existingEMI;
    const maxEMI = disposableIncome * 0.5;

    const rate = interestRate / 12 / 100;
    const tenure = loanTenure * 12;
    const maxLoan = (maxEMI * (Math.pow(1 + rate, tenure) - 1)) / (rate * Math.pow(1 + rate, tenure));

    const maxPropertyValue = maxLoan + downPayment;

    return {
      maxEMI: Math.round(maxEMI),
      maxLoan: Math.round(maxLoan),
      maxPropertyValue: Math.round(maxPropertyValue),
      disposableIncome: Math.round(disposableIncome)
    };
  };

  const result = calculateAffordability();

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
      <div className="flex items-center mb-6">
        <Home className="text-green-600 mr-3" size={28} />
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Home Affordability Calculator</h2>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Monthly Income (₹)
          </label>
          <input
            type="number"
            value={monthlyIncome}
            onChange={(e) => setMonthlyIncome(Number(e.target.value))}
            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Monthly Expenses (₹)
          </label>
          <input
            type="number"
            value={monthlyExpenses}
            onChange={(e) => setMonthlyExpenses(Number(e.target.value))}
            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Existing EMI (₹)
          </label>
          <input
            type="number"
            value={existingEMI}
            onChange={(e) => setExistingEMI(Number(e.target.value))}
            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Down Payment (₹)
          </label>
          <input
            type="number"
            value={downPayment}
            onChange={(e) => setDownPayment(Number(e.target.value))}
            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Interest Rate (%)
            </label>
            <input
              type="number"
              step="0.1"
              value={interestRate}
              onChange={(e) => setInterestRate(Number(e.target.value))}
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Tenure (Years)
            </label>
            <input
              type="number"
              value={loanTenure}
              onChange={(e) => setLoanTenure(Number(e.target.value))}
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>
        </div>
      </div>

      <div className="mt-8 space-y-4">
        <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl p-6">
          <p className="text-sm opacity-90">You Can Afford</p>
          <p className="text-4xl font-bold">₹{(result.maxPropertyValue / 10000000).toFixed(2)} Cr</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4">
            <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Max Loan Amount</p>
            <p className="text-xl font-bold text-gray-900 dark:text-white">
              ₹{(result.maxLoan / 100000).toFixed(1)}L
            </p>
          </div>
          <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4">
            <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Max EMI</p>
            <p className="text-xl font-bold text-gray-900 dark:text-white">
              ₹{result.maxEMI.toLocaleString('en-IN')}
            </p>
          </div>
        </div>

        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <p className="text-sm text-blue-800 dark:text-blue-300">
            💡 <strong>Tip:</strong> Your EMI should not exceed 50% of your disposable income. 
            Current disposable income: ₹{result.disposableIncome.toLocaleString('en-IN')}
          </p>
        </div>
      </div>
    </div>
  );
}