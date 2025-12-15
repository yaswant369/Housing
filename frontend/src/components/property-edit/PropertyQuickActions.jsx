import React from 'react';
import {
  Camera,
  Copy,
  Share2,
  BarChart3,
  Eye,
  Save,
  RefreshCw,
  Settings,
  Power,
  PauseCircle,
  CheckCircle,
  FileText,
  DollarSign,
  AlertCircle,
  Play,
  Lock
} from 'lucide-react';

export default function PropertyQuickActions({
  property,
  onEditPhotos,
  onDuplicate,
  onShare,
  onAnalytics,
  onPreviewListing,
  onSaveDraft,
  onRefreshData,
  onChangeStatus,
  onDeleteProperty,
  isSaving = false,
  hasUnsavedChanges = false,
  currentStatus = 'draft'
}) {
  
  // Status actions with semantic colors
  const statusActions = [
    {
      id: 'make-online',
      label: 'Go Online',
      icon: Power,
      color: 'bg-green-50 hover:bg-green-100 text-green-700 border-green-200',
      iconColor: 'text-green-600',
      onClick: () => onChangeStatus('active'),
      hidden: currentStatus === 'active'
    },
    {
      id: 'make-offline',
      label: 'Pause Listing',
      icon: PauseCircle,
      color: 'bg-yellow-50 hover:bg-yellow-100 text-yellow-700 border-yellow-200',
      iconColor: 'text-yellow-600',
      onClick: () => onChangeStatus('paused'),
      hidden: currentStatus === 'paused' || currentStatus === 'draft'
    },
    {
      id: 'mark-sold',
      label: 'Mark Sold/Rented',
      icon: DollarSign,
      color: 'bg-purple-50 hover:bg-purple-100 text-purple-700 border-purple-200',
      iconColor: 'text-purple-600',
      onClick: () => onChangeStatus('sold'),
      hidden: currentStatus === 'sold'
    },
    {
      id: 'save-draft',
      label: 'Save Draft',
      icon: FileText,
      color: 'bg-gray-50 hover:bg-gray-100 text-gray-700 border-gray-200',
      iconColor: 'text-gray-600',
      onClick: () => onChangeStatus('draft'),
      hidden: currentStatus === 'draft'
    }
  ].filter(action => !action.hidden);

  // Content management actions
  const contentActions = [
    {
      id: 'edit-photos',
      label: 'Edit Photos',
      icon: Camera,
      color: 'bg-blue-50 hover:bg-blue-100 text-blue-700 border-blue-200',
      iconColor: 'text-blue-600',
      onClick: onEditPhotos,
      description: 'Upload & manage media'
    },
    {
      id: 'duplicate',
      label: 'Duplicate',
      icon: Copy,
      color: 'bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border-indigo-200',
      iconColor: 'text-indigo-600',
      onClick: onDuplicate,
      description: 'Create similar listing'
    },
    {
      id: 'share',
      label: 'Share',
      icon: Share2,
      color: 'bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border-emerald-200',
      iconColor: 'text-emerald-600',
      onClick: onShare,
      description: 'Share listing link'
    },
    {
      id: 'analytics',
      label: 'Analytics',
      icon: BarChart3,
      color: 'bg-orange-50 hover:bg-orange-100 text-orange-700 border-orange-200',
      iconColor: 'text-orange-600',
      onClick: onAnalytics,
      description: 'View performance'
    }
  ];

  // Management actions
  const managementActions = [
    {
      id: 'preview',
      label: 'Preview',
      icon: Eye,
      color: 'bg-sky-50 hover:bg-sky-100 text-sky-700 border-sky-200',
      iconColor: 'text-sky-600',
      onClick: onPreviewListing,
      description: 'View public listing'
    },
    {
      id: 'save',
      label: 'Save',
      icon: Save,
      color: 'bg-teal-50 hover:bg-teal-100 text-teal-700 border-teal-200',
      iconColor: 'text-teal-600',
      onClick: onSaveDraft,
      disabled: isSaving,
      description: 'Save changes'
    },
    {
      id: 'refresh',
      label: 'Refresh',
      icon: RefreshCw,
      color: 'bg-rose-50 hover:bg-rose-100 text-rose-700 border-rose-200',
      iconColor: 'text-rose-600',
      onClick: onRefreshData,
      disabled: isSaving,
      description: 'Sync latest data'
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: Settings,
      color: 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200',
      iconColor: 'text-slate-600',
      onClick: () => {},
      description: 'Property settings'
    }
  ];

  const renderActionCard = (action, size = 'medium') => {
    const IconComponent = action.icon;
    const cardClasses = `
      group flex flex-col items-center justify-center p-3 rounded-lg border-2 
      transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 min-h-[88px]
      ${action.color}
      ${action.disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
      ${size === 'small' ? 'min-h-[72px]' : 'min-h-[88px]'}
    `;

    const handleClick = (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (!action.disabled && action.onClick) {
        console.log(`Button clicked: ${action.id}`, action.onClick);
        action.onClick();
      }
    };

    return (
      <button
        key={action.id}
        onClick={handleClick}
        disabled={action.disabled}
        type="button"
        className={cardClasses}
        style={{ touchAction: 'manipulation' }}
      >
        {/* Icon */}
        <div className="flex items-center justify-center mb-2 flex-shrink-0">
          <IconComponent 
            size={size === 'small' ? 16 : 18} 
            className={`${action.iconColor} transition-transform group-hover:scale-110`}
          />
        </div>
        
        {/* Label */}
        <span className="text-xs font-semibold text-center leading-tight break-words max-w-full px-1">
          {action.label}
        </span>
        
        {/* Description (shown on hover for larger cards) */}
        {action.description && size === 'medium' && (
          <div className="absolute bottom-1 left-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
            <p className="text-xs text-center opacity-75 break-words">
              {action.description}
            </p>
          </div>
        )}
      </button>
    );
  };

  const renderActionGroup = (title, actions, description) => (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <div className="mb-3">
        <h3 className="text-base font-semibold text-gray-900">
          {title}
        </h3>
        {description && (
          <p className="text-xs text-gray-600 mt-1">
            {description}
          </p>
        )}
      </div>
      
      <div className="grid grid-cols-2 gap-2 sm:gap-3">
        {actions.map(action => renderActionCard(action))}
      </div>
    </div>
  );

  const renderLockedSection = (title, description) => (
    <div className="bg-gray-50 rounded-lg border border-gray-200 p-4 opacity-75">
      <div className="mb-3">
        <h3 className="text-base font-semibold text-gray-700 flex items-center gap-2">
          <Lock size={16} className="text-gray-500" />
          {title}
        </h3>
        {description && (
          <p className="text-xs text-gray-600 mt-1">
            {description}
          </p>
        )}
      </div>
      
      <div className="grid grid-cols-2 gap-2 sm:gap-3">
        <div className="col-span-2 flex items-center justify-center p-4 rounded-lg border-2 border-dashed border-gray-300 bg-gray-100">
          <div className="text-center">
            <Lock size={24} className="text-gray-400 mx-auto mb-2" />
            <p className="text-xs font-medium text-gray-500">
              Coming Soon
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-4">
      {/* Header with save status */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
          <Settings className="text-blue-600" size={20} />
          Quick Actions
        </h2>
        
        <div className="flex items-center gap-2">
          {/* Save status indicator */}
          {hasUnsavedChanges && (
            <div className="flex items-center gap-1 px-2 py-1 bg-amber-50 border border-amber-200 rounded-md">
              <AlertCircle size={14} className="text-amber-600" />
              <span className="text-xs font-medium text-amber-700">
                Unsaved
              </span>
            </div>
          )}
          
          {isSaving && (
            <div className="flex items-center gap-1 px-2 py-1 bg-blue-50 border border-blue-200 rounded-md">
              <RefreshCw size={14} className="text-blue-600 animate-spin" />
              <span className="text-xs font-medium text-blue-700">
                Saving
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Status Management */}
      {statusActions.length > 0 && renderActionGroup(
        'Status Management',
        statusActions,
        'Control your property listing visibility'
      )}

      {/* Content Management */}
      {renderLockedSection(
        'Content Management',
        'Manage listing content and media'
      )}

      {/* Quick Management */}
      {renderLockedSection(
        'Quick Tools',
        'Essential management tools'
      )}

      {/* Danger Zone */}
      <div className="bg-red-50 rounded-lg border border-red-200 p-4">
        <h3 className="text-base font-semibold text-red-900 mb-3">
          Danger Zone
        </h3>
        <div className="grid grid-cols-1 gap-2">
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              if (onDeleteProperty) onDeleteProperty();
            }}
            className="flex items-center justify-center gap-2 p-3 rounded-lg border-2 border-red-200 bg-red-50 hover:bg-red-100 text-red-700 transition-all duration-200 min-h-[44px]"
            type="button"
          >
            <Settings size={16} className="text-red-600" />
            <span className="font-semibold text-sm">Delete Property</span>
          </button>
        </div>
        <p className="text-xs text-red-600 mt-2">
          This action cannot be undone. Please be certain.
        </p>
      </div>
    </div>
  );
}
