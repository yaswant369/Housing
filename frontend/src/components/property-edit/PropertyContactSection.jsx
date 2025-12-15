import React, { useState } from 'react';
import {
  User,
  Phone,
  Mail,
  MessageCircle,
  Shield,
  Eye,
  EyeOff,
  Clock,
  CheckCircle,
  AlertCircle,
  Building,
  UserCheck,
  Users,
  Award
} from 'lucide-react';

const PropertyContactSection = ({ property, formData, onInputChange }) => {
  const [showAlternatePhone, setShowAlternatePhone] = useState(!!formData.alternatePhone);
  const [verificationStatus, setVerificationStatus] = useState({
    phone: 'pending',
    email: 'pending'
  });

  const contactRoles = [
    { value: 'owner', label: 'Property Owner', icon: User, description: 'I am the actual owner of this property' },
    { value: 'agent', label: 'Real Estate Agent', icon: UserCheck, description: 'I am representing this property for rent/sale' },
    { value: 'builder', label: 'Builder/Developer', icon: Building, description: 'I am the builder or developer' },
    { value: 'tenant', label: 'Current Tenant', icon: Users, description: 'I am currently living here and sub-letting' }
  ];

  const handleInputChange = (field, value) => {
    onInputChange(field, value);
    
    // Validate phone number
    if (field === 'phoneNumber') {
      const phoneRegex = /^[6-9]\d{9}$/;
      if (value && phoneRegex.test(value)) {
        setVerificationStatus(prev => ({ ...prev, phone: 'verified' }));
      } else {
        setVerificationStatus(prev => ({ ...prev, phone: 'pending' }));
      }
    }
    
    // Validate email
    if (field === 'email') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (value && emailRegex.test(value)) {
        setVerificationStatus(prev => ({ ...prev, email: 'verified' }));
      } else {
        setVerificationStatus(prev => ({ ...prev, email: 'pending' }));
      }
    }
  };

  const getVerificationIcon = (field) => {
    const status = verificationStatus[field];
    switch (status) {
      case 'verified':
        return <CheckCircle size={16} className="text-green-600" />;
      case 'invalid':
        return <AlertCircle size={16} className="text-red-600" />;
      default:
        return <Clock size={16} className="text-gray-400" />;
    }
  };

  const getVerificationText = (field) => {
    const status = verificationStatus[field];
    switch (status) {
      case 'verified':
        return 'Verified';
      case 'invalid':
        return 'Invalid format';
      default:
        return 'Not verified';
    }
  };

  const getVerificationColor = (field) => {
    const status = verificationStatus[field];
    switch (status) {
      case 'verified':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'invalid':
        return 'text-red-600 bg-red-50 border-red-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const selectedRole = contactRoles.find(role => role.value === formData.contactRole);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
          <User className="text-blue-600" size={24} />
          Contact / Owner Details
        </h2>
        <div className="text-sm text-gray-500">
          Section 9 of 9
        </div>
      </div>

      {/* Contact Overview */}
      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">
          Contact Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-3 bg-white rounded-lg border">
            <Phone size={24} className="mx-auto mb-2 text-blue-600" />
            <p className="text-lg font-bold text-gray-900">
              {formData.phoneNumber ? '1' : '0'}
            </p>
            <p className="text-sm text-gray-600">Numbers</p>
          </div>
          <div className="text-center p-3 bg-white rounded-lg border">
            <Mail size={24} className="mx-auto mb-2 text-green-600" />
            <p className="text-lg font-bold text-gray-900">
              {formData.email ? '1' : '0'}
            </p>
            <p className="text-sm text-gray-600">Address</p>
          </div>
          <div className="text-center p-3 bg-white rounded-lg border">
            <Shield size={24} className="mx-auto mb-2 text-purple-600" />
            <p className="text-lg font-bold text-gray-900">
              {formData.contactOnlyLoggedIn ? 'Private' : 'Public'}
            </p>
            <p className="text-sm text-gray-600">Visibility</p>
          </div>
        </div>
      </div>

      {/* Contact Role */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Your Role *
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {contactRoles.map((role) => {
            const IconComponent = role.icon;
            const isSelected = formData.contactRole === role.value;
            
            return (
              <button
                key={role.value}
                type="button"
                onClick={() => handleInputChange('contactRole', role.value)}
                className={`p-4 rounded-lg border-2 text-left transition-all ${
                  isSelected
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-lg ${
                    isSelected 
                      ? 'bg-blue-100'
                      : 'bg-gray-100'
                  }`}>
                    <IconComponent 
                      size={20} 
                      className={isSelected ? 'text-blue-600' : 'text-gray-600'}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className={`font-medium ${
                      isSelected 
                        ? 'text-blue-900'
                        : 'text-gray-900'
                    }`}>
                      {role.label}
                    </h4>
                    <p className="text-sm text-gray-600 mt-1">
                      {role.description}
                    </p>
                    {isSelected && (
                      <div className="flex items-center gap-1 mt-2">
                        <CheckCircle size={12} className="text-blue-600" />
                        <span className="text-xs text-blue-600">Selected</span>
                      </div>
                    )}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Contact Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Full Name *
          </label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              value={formData.ownerName || ''}
              onChange={(e) => handleInputChange('ownerName', e.target.value)}
              placeholder="Enter your full name"
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white"
            />
          </div>
        </div>

        {/* Primary Phone */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Primary Phone Number *
          </label>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="tel"
              value={formData.phoneNumber || ''}
              onChange={(e) => handleInputChange('phoneNumber', e.target.value.replace(/\D/g, '').slice(0, 10))}
              placeholder="9876543210"
              maxLength={10}
              className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white"
            />
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              {getVerificationIcon('phone')}
            </div>
          </div>
          <div className="mt-1 flex items-center justify-between">
            <p className={`text-xs px-2 py-1 rounded ${getVerificationColor('phone')}`}>
              {getVerificationText('phone')}
            </p>
            {formData.whatsapp && (
              <div className="flex items-center gap-1 text-green-600">
                <MessageCircle size={14} />
                <span className="text-xs">WhatsApp enabled</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Alternate Phone */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-gray-700">
            Alternate Phone Number
          </label>
          <button
            type="button"
            onClick={() => setShowAlternatePhone(!showAlternatePhone)}
            className="text-sm text-blue-600 hover:text-blue-700"
          >
            {showAlternatePhone ? 'Remove' : 'Add Alternate Number'}
          </button>
        </div>

        {showAlternatePhone && (
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="tel"
              value={formData.alternatePhone || ''}
              onChange={(e) => handleInputChange('alternatePhone', e.target.value.replace(/\D/g, '').slice(0, 10))}
              placeholder="9876543210"
              maxLength={10}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white"
            />
          </div>
        )}
      </div>

      {/* Email */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Email Address
        </label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="email"
            value={formData.email || ''}
            onChange={(e) => handleInputChange('email', e.target.value)}
            placeholder="your.email@example.com"
            className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white"
          />
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            {getVerificationIcon('email')}
          </div>
        </div>
        <div className="mt-1">
          <p className={`text-xs px-2 py-1 rounded inline-block ${getVerificationColor('email')}`}>
            {getVerificationText('email')}
          </p>
        </div>
      </div>

      {/* WhatsApp and Privacy Settings */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">
          Communication Preferences
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* WhatsApp */}
          <label className="flex items-center gap-3 p-4 border border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 transition-colors">
            <input
              type="checkbox"
              checked={formData.whatsapp || false}
              onChange={(e) => handleInputChange('whatsapp', e.target.checked)}
              className="w-5 h-5 text-green-600 border-gray-300 rounded focus:ring-green-500"
            />
            <div className="flex items-center gap-2">
              <MessageCircle className="text-green-600" size={20} />
              <div>
                <span className="font-medium text-gray-900">Updates</span>
                <p className="text-sm text-gray-600">Property updates via WhatsApp</p>
              </div>
            </div>
          </label>

          {/* Contact Privacy */}
          <label className="flex items-center gap-3 p-4 border border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 transition-colors">
            <input
              type="checkbox"
              checked={formData.contactOnlyLoggedIn || false}
              onChange={(e) => handleInputChange('contactOnlyLoggedIn', e.target.checked)}
              className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <div className="flex items-center gap-2">
              {formData.contactOnlyLoggedIn ? (
                <EyeOff className="text-blue-600" size={20} />
              ) : (
                <Eye className="text-gray-600" size={20} />
              )}
              <div>
                <span className="font-medium text-gray-900">
                  {formData.contactOnlyLoggedIn ? 'Private Contact' : 'Public Contact'}
                </span>
                <p className="text-sm text-gray-600">
                  {formData.contactOnlyLoggedIn 
                    ? 'Only logged-in users can see contact' 
                    : 'Anyone can see contact information'
                  }
                </p>
              </div>
            </div>
          </label>
        </div>
      </div>

      {/* Contact Preview */}
      {formData.ownerName && (
        <div className="bg-gray-50 p-4 rounded-lg border">
          <h4 className="font-medium text-gray-900 mb-3">
            Contact Information Preview
          </h4>
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <User size={16} className="text-gray-600" />
              <span className="text-gray-900">
                {formData.ownerName}
              </span>
              {selectedRole && (
                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                  {selectedRole.label}
                </span>
              )}
            </div>
            {formData.phoneNumber && (
              <div className="flex items-center gap-3">
                <Phone size={16} className="text-green-600" />
                <span className="text-gray-900">
                  {formData.phoneNumber}
                </span>
                {formData.whatsapp && (
                  <MessageCircle size={14} className="text-green-500" />
                )}
              </div>
            )}
            {formData.email && (
              <div className="flex items-center gap-3">
                <Mail size={16} className="text-blue-600" />
                <span className="text-gray-900">
                  {formData.email}
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Contact Guidelines */}
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <div className="p-1 bg-amber-100 rounded">
            <Shield className="text-amber-600" size={16} />
          </div>
          <div>
            <h4 className="font-semibold text-amber-800 mb-1">
              Contact Information Guidelines
            </h4>
            <ul className="text-sm text-amber-700 space-y-1">
              <li>• Only share contact details you are authorized to use</li>
              <li>• Verify your phone number and email for faster response</li>
              <li>• Private contact mode reduces spam but may reduce inquiries</li>
              <li>• WhatsApp enables quick communication with interested tenants</li>
              <li>• Keep your contact information updated for better connectivity</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyContactSection;
