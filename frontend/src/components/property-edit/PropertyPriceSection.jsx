import React, { useState, useEffect } from 'react';
import {
  DollarSign,
  Calendar,
  TrendingUp,
  Shield,
  Users,
  Clock,
  Calculator,
  Percent,
  Info
} from 'lucide-react';

const maintenanceFrequencies = [
  { value: 'monthly', label: 'Monthly' },
  { value: 'yearly', label: 'Yearly' },
  { value: 'one-time', label: 'One-time' }
];

const preferredTenants = [
  { value: 'family', label: 'Family', icon: Users },
  { value: 'bachelor', label: 'Bachelor', icon: Users },
  { value: 'company', label: 'Company', icon: Users },
  { value: 'anyone', label: 'Anyone', icon: Users },
  { value: 'married', label: 'Married Couple', icon: Users },
  { value: 'students', label: 'Students', icon: Users }
];

// Helper function to safely parse numeric values from strings or numbers
const parseNumericValue = (value) => {
  if (typeof value === 'number') {
    return value;
  }
  if (typeof value === 'string') {
    const parsed = parseFloat(value.replace(/[^\d.]/g, ''));
    return isNaN(parsed) ? 0 : parsed;
  }
  return 0;
};

export default function PropertyPriceSection({
  property,
  formData,
  onInputChange
}) {
  const [pricePerSqFt, setPricePerSqFt] = useState(0);

  // Calculate price per sq ft when price or area changes
  useEffect(() => {
    const areaValue = parseNumericValue(formData.area);
    const priceValue = parseNumericValue(formData.price);
    
    if (areaValue > 0 && priceValue > 0) {
      const calculatedPricePerSqFt = Math.round(priceValue / areaValue);
      setPricePerSqFt(calculatedPricePerSqFt);
    } else {
      setPricePerSqFt(0);
    }
  }, [formData.price, formData.area]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatNumber = (value) => {
    const num = parseFloat(value.replace(/[^\d.]/g, ''));
    if (isNaN(num)) return '';
    return num.toLocaleString('en-IN');
  };

  const handlePriceChange = (field, value) => {
    const numericValue = value.replace(/[^\d.]/g, '');
    onInputChange(field, numericValue);
  };

  const getTotalPrice = () => {
    const basePrice = parseNumericValue(formData.price);
    const maintenance = parseNumericValue(formData.maintenanceAmount);
    return basePrice + maintenance;
  };

  const getMonthlyBreakdown = () => {
    const rent = parseNumericValue(formData.price);
    const maintenance = parseNumericValue(formData.maintenanceAmount);
    const deposit = parseNumericValue(formData.securityDeposit);

    return {
      baseRent: rent,
      maintenance: maintenance,
      totalMonthly: rent + maintenance,
      securityDeposit: deposit
    };
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
          <DollarSign className="text-blue-600" size={24} />
          Price & Availability
        </h2>
        <div className="text-sm text-gray-500">
          Section 4 of 5
        </div>
      </div>

      {/* Price Input based on listing type */}
      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          {formData.listingType === 'rent' ? 'Rental Price' : 
           formData.listingType === 'sell' ? 'Sale Price' : 
           'Price Details'}
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Main Price */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {formData.listingType === 'rent' ? 'Monthly Rent' :
               formData.listingType === 'sell' ? 'Total Price' :
               'Price'} *
            </label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                value={formData.price || ''}
                onChange={(e) => handlePriceChange('price', e.target.value)}
                placeholder={formData.listingType === 'rent' ? '₹25,000' : '₹25,00,000'}
                className="w-full pl-10 pr-4 py-3 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white text-lg font-semibold"
              />
            </div>
            {formData.price && (
              <p className="text-sm text-blue-600 mt-1">
                {formatCurrency(parseNumericValue(formData.price))}
              </p>
            )}
          </div>

          {/* Price per sq ft (auto-calculated) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Price per sq.ft
              <span className="text-xs text-gray-500 ml-1">(Auto-calculated)</span>
            </label>
            <div className="relative">
              <Calculator className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                value={pricePerSqFt > 0 ? formatCurrency(pricePerSqFt) : ''}
                placeholder="₹8,500"
                readOnly
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-700"
              />
            </div>
            {formData.area && formData.price && (
              <p className="text-xs text-gray-500 mt-1">
                Based on {formData.area} sq.ft area
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Maintenance Charges */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Maintenance Charges
          </label>
          <div className="relative">
            <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              value={formData.maintenanceAmount || ''}
              onChange={(e) => handlePriceChange('maintenanceAmount', e.target.value)}
              placeholder="₹2,000"
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white"
            />
          </div>
          {formData.maintenanceAmount && (
            <p className="text-sm text-green-600 mt-1">
              {formatCurrency(parseNumericValue(formData.maintenanceAmount))}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Maintenance Frequency
          </label>
          <select
            value={formData.maintenancePeriod || 'monthly'}
            onChange={(e) => onInputChange('maintenancePeriod', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white text-gray-900"
          >
            {maintenanceFrequencies.map((freq) => (
              <option key={freq.value} value={freq.value}>
                {freq.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Negotiable and Availability */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Negotiable */}
        <div>
          <label className="flex items-center gap-3 p-4 border border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 transition-colors">
            <input
              type="checkbox"
              checked={!!formData.negotiable}
              onChange={(e) => onInputChange('negotiable', e.target.checked)}
              className="w-5 h-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
            />
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <Percent className="text-blue-600" size={20} />
                <span className="font-medium text-gray-900">Negotiable</span>
              </div>
              <p className="text-sm text-gray-600">Open to negotiation</p>
            </div>
          </label>
        </div>

        {/* Available From Date */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Available From
          </label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="date"
              value={formData.availability || ''}
              onChange={(e) => onInputChange('availability', e.target.value)}
              min={new Date().toISOString().split('T')[0]}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white"
            />
          </div>
          {formData.availability && (
            <p className="text-sm text-green-600 mt-1">
              Available from {new Date(formData.availability).toLocaleDateString()}
            </p>
          )}
        </div>
      </div>

      {/* Security Deposit (for rent only) */}
      {formData.listingType === 'rent' && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Security Deposit
          </label>
          <div className="relative">
            <Shield className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              value={formData.securityDeposit || ''}
              onChange={(e) => handlePriceChange('securityDeposit', e.target.value)}
              placeholder="₹50,000"
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white"
            />
          </div>
          {formData.securityDeposit && (
            <p className="text-sm text-green-600 mt-1">
              {formatCurrency(parseNumericValue(formData.securityDeposit))}
            </p>
          )}
        </div>
      )}

      {/* Preferred Tenants (for rent only) */}
      {formData.listingType === 'rent' && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Preferred Tenants
          </label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {preferredTenants.map((tenant) => {
              const IconComponent = tenant.icon;
              return (
                <button
                  key={tenant.value}
                  type="button"
                  onClick={() => {
                    const current = formData.preferredTenants || [];
                    const newTenants = current.includes(tenant.value)
                      ? current.filter((t) => t !== tenant.value)
                      : [...current, tenant.value];
                    onInputChange('preferredTenants', newTenants);
                  }}
                  className={`p-3 rounded-lg border-2 transition-all ${
                    formData.preferredTenants?.includes(tenant.value)
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="text-center">
                    <IconComponent 
                      size={20} 
                      className={`mx-auto mb-1 ${
                        formData.preferredTenants?.includes(tenant.value)
                          ? 'text-blue-600'
                          : 'text-gray-600'
                      }`} 
                    />
                    <span className={`text-sm font-medium ${
                      formData.preferredTenants?.includes(tenant.value)
                        ? 'text-blue-600'
                        : 'text-gray-900'
                    }`}>
                      {tenant.label}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Price Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Total Price */}
        <div className="bg-green-50 p-4 rounded-lg border border-green-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <TrendingUp className="text-green-600" size={20} />
            </div>
            <div>
              <p className="text-sm text-green-600 font-medium">Total Price</p>
              <p className="font-bold text-green-900 text-lg">
                {formatCurrency(getTotalPrice())}
              </p>
            </div>
          </div>
        </div>

        {/* Monthly Breakdown (for rent) */}
        {formData.listingType === 'rent' && (
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Calendar className="text-blue-600" size={20} />
              </div>
              <div>
                <p className="text-sm text-blue-600 font-medium">Monthly Total</p>
                <p className="font-bold text-blue-900 text-lg">
                  {formatCurrency(getMonthlyBreakdown().totalMonthly)}
                </p>
                <p className="text-xs text-gray-600">
                  + Deposit: {formatCurrency(getMonthlyBreakdown().securityDeposit)}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Price per sq.ft */}
        <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-100 rounded-lg">
              <Calculator className="text-orange-600" size={20} />
            </div>
            <div>
              <p className="text-sm text-orange-600 font-medium">Per sq.ft</p>
              <p className="font-bold text-orange-900 text-lg">
                {pricePerSqFt > 0 ? formatCurrency(pricePerSqFt) : 'N/A'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Market Comparison Info */}
      <div className="bg-gray-50 p-4 rounded-lg border">
        <div className="flex items-start gap-3">
          <div className="p-1 bg-gray-200 rounded">
            <Info className="text-gray-600" size={16} />
          </div>
          <div className="flex-1">
            <h4 className="font-semibold text-gray-900 mb-2">
              Market Insights
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-600">
                  • Price per sq.ft helps compare with similar properties
                </p>
                <p className="text-gray-600">
                  • Maintenance charges are typically 1-3% of rent annually
                </p>
              </div>
              <div>
                <p className="text-gray-600">
                  • Security deposit is usually 1-3 months rent
                </p>
                <p className="text-gray-600">
                  • Negotiable properties get 15% more inquiries
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Validation Messages */}
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <div className="p-1 bg-amber-100 rounded">
            <Clock className="text-amber-600" size={16} />
          </div>
          <div>
            <h4 className="font-semibold text-amber-800 mb-1">
              Pricing Tips
            </h4>
            <ul className="text-sm text-amber-700 space-y-1">
              <li>• Research similar properties in your area for competitive pricing</li>
              <li>• Set realistic availability dates to attract serious tenants/buyers</li>
              <li>• Competitive pricing leads to faster conversions</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
