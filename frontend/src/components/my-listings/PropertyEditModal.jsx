import React, { useState, useEffect } from 'react';
import {
  X,
  ArrowLeft,
  Save,
  Eye,
  Upload,
  Settings,
  MapPin,
  DollarSign,
  Home,
  Camera,
  Star,
  Check,
  AlertCircle,
  Loader2
} from 'lucide-react';
import toast from 'react-hot-toast';

const statusOptions = [
  { value: 'active', label: 'Online / Active', color: 'text-green-600' },
  { value: 'paused', label: 'Offline / Paused', color: 'text-yellow-600' },
  { value: 'pending', label: 'Under Review', color: 'text-blue-600' },
  { value: 'draft', label: 'Draft', color: 'text-gray-600' },
  { value: 'expired', label: 'Expired', color: 'text-gray-500' },
  { value: 'sold', label: 'Sold / Rented', color: 'text-purple-600' }
];

const planOptions = [
  { value: 'free', label: 'Free Plan', features: ['Basic listing', 'Standard visibility'] },
  { value: 'featured', label: 'Featured Plan', features: ['Priority placement', 'Enhanced visibility', 'Contact leads'] },
  { value: 'premium', label: 'Premium Plan', features: ['Top placement', 'Maximum visibility', 'Analytics dashboard', 'Priority support'] }
];

export default function PropertyEditModal({
  property,
  isOpen,
  onClose,
  onSave,
  onChangeStatus,
  onEditPhotos,
  onDuplicate,
  API_BASE_URL
}) {
  const [activeTab, setActiveTab] = useState('details');
  const [formData, setFormData] = useState({});
  const [isSaving, setIsSaving] = useState(false);
  const [changes, setChanges] = useState({});

  useEffect(() => {
    if (property) {
      // Initialize form data with existing property values
      setFormData({
        title: property.type || '',
        location: property.location || '',
        price: property.price || '',
        bhk: property.bhk || 1,
        bathrooms: property.bathrooms || 1,
        area: property.area || '',
        furnishing: property.furnishing || 'Unfurnished',
        description: property.description || '',
        status: property.status || 'draft',
        planType: property.planType || 'free'
      });
      setChanges({});
    }
  }, [property]);

  if (!isOpen || !property) return null;

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setChanges(prev => ({ ...prev, [field]: true }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onSave(property.id, formData);
      toast.success('Property updated successfully');
      onClose();
    } catch (error) {
      toast.error('Failed to update property: ' + error.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleStatusChange = (newStatus) => {
    handleInputChange('status', newStatus);
    onChangeStatus?.(property, newStatus);
  };

  const getStatusColor = (status) => {
    const statusInfo = statusOptions.find(s => s.value === status);
    return statusInfo?.color || 'text-gray-600';
  };

  const getChangeCount = () => {
    return Object.keys(changes).length;
  };

  const hasChanges = getChangeCount() > 0;

  const calculateCompleteness = () => {
    const fields = ['title', 'location', 'price', 'description'];
    const filledFields = fields.filter(field => formData[field] && formData[field].trim() !== '').length;
    return Math.round((filledFields / fields.length) * 100);
  };

  const renderDetailsTab = () => (
    <div className="space-y-6">
      {/* Property Title */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Property Title
        </label>
        <input
          type="text"
          value={formData.title}
          onChange={(e) => handleInputChange('title', e.target.value)}
          placeholder="e.g., 2 BHK Apartment in Andheri East"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white"
        />
      </div>

      {/* Location */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Location
        </label>
        <div className="relative">
          <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            value={formData.location}
            onChange={(e) => handleInputChange('location', e.target.value)}
            placeholder="City, area, landmark"
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white"
          />
        </div>
      </div>

      {/* Price and Basic Info */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Price
          </label>
          <div className="relative">
            <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              value={formData.price}
              onChange={(e) => handleInputChange('price', e.target.value)}
              placeholder="₹25,00,000"
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            BHK
          </label>
          <select
            value={formData.bhk}
            onChange={(e) => handleInputChange('bhk', parseInt(e.target.value))}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white"
          >
            {[1, 2, 3, 4, 5].map(num => (
              <option key={num} value={num}>{num} BHK</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Bathrooms
          </label>
          <select
            value={formData.bathrooms}
            onChange={(e) => handleInputChange('bathrooms', parseInt(e.target.value))}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white"
          >
            {[1, 2, 3, 4, 5].map(num => (
              <option key={num} value={num}>{num}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Area and Furnishing */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Built-up Area
          </label>
          <div className="relative">
            <Home className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              value={formData.area}
              onChange={(e) => handleInputChange('area', e.target.value)}
              placeholder="950 sq.ft"
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Furnishing
          </label>
          <select
            value={formData.furnishing}
            onChange={(e) => handleInputChange('furnishing', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white"
          >
            <option value="Unfurnished">Unfurnished</option>
            <option value="Semi-Furnished">Semi-Furnished</option>
            <option value="Furnished">Furnished</option>
          </select>
        </div>
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Description
        </label>
        <textarea
          value={formData.description}
          onChange={(e) => handleInputChange('description', e.target.value)}
          placeholder="Describe your property highlighting key features..."
          rows={4}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white"
        />
        <div className="text-right text-sm text-gray-500 mt-1">
          {formData.description?.length || 0}/2000 characters
        </div>
      </div>
    </div>
  );

  const renderStatusTab = () => (
    <div className="space-y-6">
      {/* Current Status */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Current Status</h3>
        <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
          <div className={`w-3 h-3 rounded-full ${getStatusColor(formData.status).replace('text-', 'bg-')}`} />
          <span className="font-medium">{statusOptions.find(s => s.value === formData.status)?.label}</span>
          <span className="text-sm text-gray-500">
            Last updated: {new Date(property.updatedAt).toLocaleDateString()}
          </span>
        </div>
      </div>

      {/* Change Status */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Change Status</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {statusOptions.map(status => (
            <button
              key={status.value}
              onClick={() => handleStatusChange(status.value)}
              className={`p-4 text-left border rounded-lg transition-colors ${
                formData.status === status.value
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full ${status.color.replace('text-', 'bg-')}`} />
                <span className="font-medium">{status.label}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <button
            onClick={() => onEditPhotos?.(property)}
            className="flex items-center gap-3 p-4 border border-gray-300 rounded-lg hover:border-blue-500 transition-colors"
          >
            <Camera size={20} className="text-blue-600" />
            <span>Edit Photos & Media</span>
          </button>
          
          <button
            onClick={() => onDuplicate?.(property)}
            className="flex items-center gap-3 p-4 border border-gray-300 rounded-lg hover:border-blue-500 transition-colors"
          >
            <Star size={20} className="text-yellow-600" />
            <span>Duplicate Listing</span>
          </button>
          
          <button className="flex items-center gap-3 p-4 border border-gray-300 rounded-lg hover:border-blue-500 transition-colors">
            <Eye size={20} className="text-green-600" />
            <span>View Public Listing</span>
          </button>
          
          <button className="flex items-center gap-3 p-4 border border-gray-300 rounded-lg hover:border-blue-500 transition-colors">
            <Settings size={20} className="text-gray-600" />
            <span>Manage Settings</span>
          </button>
        </div>
      </div>
    </div>
  );

  const renderPlanTab = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Current Plan</h3>
        <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-xl font-bold text-blue-900">
                {planOptions.find(p => p.value === formData.planType)?.label}
              </h4>
              <p className="text-blue-700 text-sm">
                {planOptions.find(p => p.value === formData.planType)?.features.join(' • ')}
              </p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-blue-900">
                {formData.planType === 'free' ? '₹0' : 
                 formData.planType === 'featured' ? '₹299' : '₹599'}
              </div>
              <div className="text-sm text-blue-700">
                {formData.planType === 'free' ? 'forever' : '/month'}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Available Plans</h3>
        <div className="space-y-4">
          {planOptions.map(plan => (
            <div
              key={plan.value}
              className={`p-4 border rounded-lg cursor-pointer transition-all ${
                formData.planType === plan.value
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
              onClick={() => handleInputChange('planType', plan.value)}
            >
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold text-gray-900"></h4>
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold">
                    {plan.value === 'free' ? '₹0' : 
                     plan.value === 'featured' ? '₹299' : '₹599'}
                  </span>
                  <span className="text-sm text-gray-500">
                    {plan.value === 'free' ? 'forever' : '/month'}
                  </span>
                </div>
              </div>
              <div className="space-y-1">
                {plan.features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-2 text-sm text-gray-600">
                    <Check size={14} className="text-green-500" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const tabs = [
    { id: 'details', label: 'Property Details', icon: Home },
    { id: 'status', label: 'Status & Actions', icon: Settings },
    { id: 'plan', label: 'Plan & Pricing', icon: Star }
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
      <div className="bg-white w-full max-w-4xl h-full max-h-[90vh] rounded-2xl shadow-xl flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-4">
            <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100">
              <ArrowLeft size={20} />
            </button>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Property</h2>
              <p className="text-sm text-gray-600">ID: #{property.id}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            {/* Completeness Meter */}
            <div className="flex items-center gap-2">
              <div className="text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-green-500 transition-all duration-300"
                      style={{ width: `${calculateCompleteness()}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium text-gray-900">
                    {calculateCompleteness()}%
                  </span>
                </div>
              </div>
            </div>
            
            {hasChanges && (
              <span className="text-sm text-blue-600 font-medium">
                {getChangeCount()} change{getChangeCount() > 1 ? 's' : ''}
              </span>
            )}
            
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              {isSaving ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <Save size={16} />
              )}
              {isSaving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200">
          {tabs.map(tab => {
            const IconComponent = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-600 hover:text-gray-800'
                }`}
              >
                <IconComponent size={16} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 'details' && renderDetailsTab()}
          {activeTab === 'status' && renderStatusTab()}
          {activeTab === 'plan' && renderPlanTab()}
        </div>
      </div>
    </div>
  );
}
