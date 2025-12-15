import React from 'react';
import {
  Camera,
  Star,
  Copy,
  Share2,
  Download,
  BarChart3,
  Users,
  Phone,
  Mail,
  Settings,
  RefreshCw,
  Save,
  AlertCircle
} from 'lucide-react';

export default function PropertyActionsBar({
  property,
  onEditPhotos,
  onDuplicate,
  onShare,
  onAnalytics,
  onRefreshData,
  onSaveDraft,
  isSaving = false,
  hasUnsavedChanges = false
}) {
  const quickActions = [
    {
      id: 'edit-photos',
      label: 'Edit Photos & Media',
      icon: Camera,
      color: 'text-blue-600 bg-blue-50 border-blue-200 hover:bg-blue-100',
      onClick: onEditPhotos,
      description: 'Upload, reorder, or remove photos'
    },
    {
      id: 'duplicate',
      label: 'Duplicate Listing',
      icon: Star,
      color: 'text-yellow-600 bg-yellow-50 border-yellow-200 hover:bg-yellow-100',
      onClick: onDuplicate,
      description: 'Create copy with same details'
    },
    {
      id: 'share',
      label: 'Share Listing',
      icon: Share2,
      color: 'text-green-600 bg-green-50 border-green-200 hover:bg-green-100',
      onClick: onShare,
      description: 'Share via social media or link'
    },
    {
      id: 'analytics',
      label: 'View Analytics',
      icon: BarChart3,
      color: 'text-purple-600 bg-purple-50 border-purple-200 hover:bg-purple-100',
      onClick: onAnalytics,
      description: 'Views, leads, and performance'
    }
  ];

  const secondaryActions = [
    {
      id: 'refresh',
      label: 'Refresh Data',
      icon: RefreshCw,
      color: 'text-gray-600 bg-gray-50 border-gray-200 hover:bg-gray-100',
      onClick: onRefreshData,
      description: 'Sync latest data from server'
    },
    {
      id: 'save-draft',
      label: 'Save Draft',
      icon: Save,
      color: 'text-indigo-600 bg-indigo-50 border-indigo-200 hover:bg-indigo-100',
      onClick: onSaveDraft,
      description: 'Save changes without publishing'
    }
  ];

  return (
    <div className="bg-white  border border-gray-200  rounded-lg p-4 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900  flex items-center gap-2">
          <Settings size={20} className="text-gray-600" />
          Quick Actions
        </h3>
        
        {/* Save Status Indicator */}
        <div className="flex items-center gap-2">
          {hasUnsavedChanges && (
            <div className="flex items-center gap-1 text-amber-600 
              <AlertCircle size={16} />
              <span className="text-sm font-medium">Unsaved changes</span>
            </div>
          )}
          {isSaving && (
            <div className="flex items-center gap-1 text-blue-600 
              <RefreshCw size={16} className="animate-spin" />
              <span className="text-sm font-medium">Saving...</span>
            </div>
          )}
        </div>
      </div>

      {/* Primary Actions Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
        {quickActions.map((action) => {
          const IconComponent = action.icon;
          return (
            <button
              key={action.id}
              onClick={action.onClick}
              className={`p-4 rounded-lg border-2 transition-all duration-200 hover:scale-105 hover:shadow-md ${action.color} group`}
            >
              <div className="text-center">
                <div className="flex justify-center mb-2">
                  <IconComponent size={24} className="group-hover:scale-110 transition-transform" />
                </div>
                <h4 className="font-semibold text-sm text-gray-900  mb-1">
                  {action.label}
                </h4>
                <p className="text-xs text-gray-600  opacity-0 group-hover:opacity-100 transition-opacity">
                  {action.description}
                </p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Secondary Actions */}
      <div className="flex flex-wrap gap-3 pt-3 border-t border-gray-200 
        {secondaryActions.map((action) => {
          const IconComponent = action.icon;
          return (
            <button
              key={action.id}
              onClick={action.onClick}
              disabled={isSaving}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg border-2 transition-all ${action.color} disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              <IconComponent size={16} />
              <span className="text-sm font-medium">{action.label}</span>
            </button>
          );
        })}
      </div>

      {/* Performance Metrics Summary */}
      {property && (
        <div className="mt-4 pt-4 border-t border-gray-200 
          <h4 className="text-sm font-semibold text-gray-900  mb-3">
            Performance Summary
          </h4>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="flex items-center justify-center mb-1">
                <BarChart3 size={16} className="text-blue-600" />
              </div>
              <p className="text-2xl font-bold text-gray-900 
                {property.viewsLast7Days || 0}
              </p>
              <p className="text-xs text-gray-600  (7 days)</p>
            </div>
            
            <div className="text-center">
              <div className="flex items-center justify-center mb-1">
                <Users size={16} className="text-green-600" />
              </div>
              <p className="text-2xl font-bold text-gray-900 
                {property.leadsLast7Days || 0}
              </p>
              <p className="text-xs text-gray-600  (7 days)</p>
            </div>
            
            <div className="text-center">
              <div className="flex items-center justify-center mb-1">
                <Star size={16} className="text-yellow-600" />
              </div>
              <p className="text-2xl font-bold text-gray-900 
                {property.shortlistsCount || 0}
              </p>
              <p className="text-xs text-gray-600 
            </div>
          </div>
        </div>
      )}

      {/* Contact Summary */}
      {property && (
        <div className="mt-4 pt-4 border-t border-gray-200 
          <h4 className="text-sm font-semibold text-gray-900  mb-3">
            Contact Management
          </h4>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1 text-sm text-gray-600 
                <Phone size={14} />
                <span>{property.phoneNumber || 'Not set'}</span>
              </div>
              <div className="flex items-center gap-1 text-sm text-gray-600 
                <Mail size={14} />
                <span>Contact requests managed</span>
              </div>
            </div>
            <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
              View All Contacts
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
