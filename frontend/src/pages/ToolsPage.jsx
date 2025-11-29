import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Calculator, Home, Receipt, TrendingUp, Percent, FileText, PiggyBank } from 'lucide-react';
import EMICalculator from '../components/calculators/EMICalculator';
import AffordabilityCalculator from '../components/calculators/AffordabilityCalculator';
import StampDutyCalculator from '../components/calculators/StampDutyCalculator';

export default function ToolsPage() {
  const navigate = useNavigate();
  const [activeCalculator, setActiveCalculator] = React.useState('emi');

  const calculators = [
    { id: 'emi', name: 'EMI Calculator', icon: Calculator, color: 'blue' },
    { id: 'affordability', name: 'Home Affordability', icon: Home, color: 'green' },
    { id: 'stamp-duty', name: 'Stamp Duty', icon: Receipt, color: 'purple' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center">
          <button 
            onClick={() => navigate('/')}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg mr-4"
          >
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Property Calculators & Tools</h1>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Calculator Tabs */}
        <div className="mb-8 overflow-x-auto">
          <div className="flex gap-3 min-w-max">
            {calculators.map((calc) => {
              const Icon = calc.icon;
              const isActive = activeCalculator === calc.id;
              return (
                <button
                  key={calc.id}
                  onClick={() => setActiveCalculator(calc.id)}
                  className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all ${
                    isActive
                      ? `bg-${calc.color}-600 text-white shadow-lg`
                      : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:shadow-md'
                  }`}
                >
                  <Icon size={20} />
                  {calc.name}
                </button>
              );
            })}
          </div>
        </div>

        {/* Calculator Content */}
        <div className="max-w-3xl mx-auto">
          {activeCalculator === 'emi' && <EMICalculator />}
          {activeCalculator === 'affordability' && <AffordabilityCalculator />}
          {activeCalculator === 'stamp-duty' && <StampDutyCalculator />}
        </div>

        {/* Additional Tools Section */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">More Tools Coming Soon</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { name: 'Property Tax Calculator', icon: FileText, desc: 'Calculate annual property tax' },
              { name: 'ROI Calculator', icon: TrendingUp, desc: 'Calculate return on investment' },
              { name: 'Rental Yield Calculator', icon: Percent, desc: 'Calculate rental returns' },
              { name: 'GST Calculator', icon: Receipt, desc: 'Calculate GST on property' },
              { name: 'Savings Calculator', icon: PiggyBank, desc: 'Plan your savings for down payment' },
            ].map((tool, idx) => {
              const Icon = tool.icon;
              return (
                <div key={idx} className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 opacity-60">
                  <Icon className="text-gray-400 mb-3" size={32} />
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{tool.name}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{tool.desc}</p>
                  <p className="text-xs text-blue-600 dark:text-blue-400 mt-3">Coming Soon</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
