import React, { useState } from 'react';
import {
  X,
  Calendar,
  DollarSign,
  AlertCircle,
  CheckCircle,
  Clock,
  TrendingUp
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function StatusChangeDialog({
  isOpen,
  onClose,
  onConfirm,
  property,
  action,
  currentStatus
}) {
  const [formData, setFormData] = useState({
    soldDate: new Date().toISOString().split('T')[0],
    soldPrice: '',
    notes: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen || !property || !action) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (action === 'mark-sold') {
        await onConfirm({
          status: 'sold',
          soldDate: formData.soldDate,
          soldPrice: formData.soldPrice,
          notes: formData.notes
        });
        toast.success('Property marked as sold successfully');
      } else if (action === 'renew') {
        await onConfirm({
          status: 'active',
          action: 'renew',
          notes: formData.notes
        });
        toast.success('Property renewed successfully');
      } else {
        await onConfirm({
          status: currentStatus === 'active' ? 'paused' : 'active'
        });
        toast.success(`Property ${currentStatus === 'active' ? 'paused' : 'activated'} successfully`);
      }
      onClose();
    } catch (error) {
      toast.error('Failed to update status: ' + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getActionConfig = () => {
    switch (action) {
      case 'mark-sold':
        return {
          title: 'Mark Property as Sold/Rented',
          description: 'This will mark your property as sold and it will no longer be visible to buyers.',
          icon: CheckCircle,
          color: 'text-green-600',
          bgColor: 'bg-green-50 dark:bg-green-900/20',
          requiresForm: true,
          formFields: [
            {
              label: 'Sold/Rented Date',
              type: 'date',
              name: 'soldDate',
              value: formData.soldDate,
              required: true
            },
            {
              label: 'Sale/Rental Price (Optional)',
              type: 'text',
              name: 'soldPrice',
              value: formData.soldPrice,
              placeholder: 'e.g., ₹25,00,000'
            }
          ]
        };
      
      case 'renew':
        return {
          title: 'Renew Property Listing',
          description: 'Renew your property listing to keep it visible for another 30 days.',
          icon: Clock,
          color: 'text-blue-600',
          bgColor: 'bg-blue-50 dark:bg-blue-900/20',
          requiresForm: true,
          formFields: [
            {
              label: 'Renewal Notes (Optional)',
              type: 'textarea',
              name: 'notes',
              value: formData.notes,
              placeholder: 'Any additional notes about the renewal...'
            }
          ]
        };
      
      case 'toggle-status':
        if (currentStatus === 'active') {
          return {
            title: 'Make Property Offline',
            description: 'This will pause your listing and it will no longer be visible to buyers. You can reactivate it anytime.',
            icon: Clock,
            color: 'text-yellow-600',
            bgColor: 'bg-yellow-50 dark:bg-yellow-900/20',
            requiresForm: false
          };
        } else {
          return {
            title: 'Make Property Online',
            description: 'This will activate your listing and make it visible to buyers again.',
            icon: TrendingUp,
            color: 'text-green-600',
            bgColor: 'bg-green-50 dark:bg-green-900/20',
            requiresForm: false
          };
        }
      
      default:
        return {
          title: 'Update Property Status',
          description: 'Are you sure you want to change the status of this property?',
          icon: AlertCircle,
          color: 'text-gray-600',
          bgColor: 'bg-gray-50 dark:bg-gray-900/20',
          requiresForm: false
        };
    }
  };

  const config = getActionConfig();
  const IconComponent = config.icon;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
      <div className="bg-white dark:bg-gray-900 w-full max-w-md rounded-2xl shadow-xl">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${config.bgColor}`}>
              <IconComponent className={`h-5 w-5 ${config.color}`} />
            </div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              {config.title}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <X size={16} />
          </button>
        </div>

        {/* Property Info */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center">
              <span className="text-xs font-semibold text-gray-600 dark:text-gray-400">
                {property.bhk}BHK
              </span>
            </div>
            <div>
              <h3 className="font-medium text-gray-900 dark:text-gray-100">
                {property.type}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {property.location} • ₹{property.price}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-500">
                Property ID: #{property.id}
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            {config.description}
          </p>

          {config.requiresForm && (
            <form onSubmit={handleSubmit} className="space-y-4">
              {config.formFields.map((field, index) => (
                <div key={index}>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {field.label}
                    {field.required && <span className="text-red-500 ml-1">*</span>}
                  </label>
                  
                  {field.type === 'textarea' ? (
                    <textarea
                      value={field.value}
                      onChange={(e) => setFormData(prev => ({ ...prev, [field.name]: e.target.value }))}
                      placeholder={field.placeholder}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800"
                    />
                  ) : (
                    <input
                      type={field.type}
                      value={field.value}
                      onChange={(e) => setFormData(prev => ({ ...prev, [field.name]: e.target.value }))}
                      placeholder={field.placeholder}
                      required={field.required}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800"
                    />
                  )}
                </div>
              ))}

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={isSubmitting}
                  className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`px-6 py-2 rounded-lg font-medium transition-colors disabled:opacity-50 flex items-center gap-2 ${
                    action === 'mark-sold'
                      ? 'bg-green-600 text-white hover:bg-green-700'
                      : action === 'renew'
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : currentStatus === 'active'
                      ? 'bg-yellow-600 text-white hover:bg-yellow-700'
                      : 'bg-green-600 text-white hover:bg-green-700'
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Updating...
                    </>
                  ) : (
                    <>
                      {action === 'mark-sold' && <CheckCircle size={16} />}
                      {action === 'renew' && <Clock size={16} />}
                      {(action === 'toggle-status') && (
                        currentStatus === 'active' ? <Clock size={16} /> : <TrendingUp size={16} />
                      )}
                      {action === 'mark-sold' && 'Mark as Sold'}
                      {action === 'renew' && 'Renew Listing'}
                      {action === 'toggle-status' && (
                        currentStatus === 'active' ? 'Make Offline' : 'Make Online'
                      )}
                    </>
                  )}
                </button>
              </div>
            </form>
          )}

          {!config.requiresForm && (
            <div className="flex justify-end gap-3">
              <button
                onClick={onClose}
                disabled={isSubmitting}
                className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className={`px-6 py-2 rounded-lg font-medium transition-colors disabled:opacity-50 flex items-center gap-2 ${
                  currentStatus === 'active'
                    ? 'bg-yellow-600 text-white hover:bg-yellow-700'
                    : 'bg-green-600 text-white hover:bg-green-700'
                }`}
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Updating...
                  </>
                ) : (
                  <>
                    {currentStatus === 'active' ? <Clock size={16} /> : <TrendingUp size={16} />}
                    {currentStatus === 'active' ? 'Make Offline' : 'Make Online'}
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}