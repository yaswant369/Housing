# 🎯 PRODUCTION-READY COMPONENT CODE

## Copy-Paste Ready: PropertyQuickActions Component

```typescript
// File: frontend/src/components/property-edit/PropertyQuickActions.tsx

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
  Play
} from 'lucide-react';

interface PropertyQuickActionsProps {
  property: any;
  onEditPhotos: () => void;
  onDuplicate: () => void;
  onShare: () => void;
  onAnalytics: () => void;
  onPreviewListing: () => void;
  onSaveDraft: () => void;
  onRefreshData: () => void;
  onChangeStatus: (status: string) => void;
  onDeleteProperty: () => void;
  isSaving?: boolean;
  hasUnsavedChanges?: boolean;
  currentStatus?: string;
}

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
}: PropertyQuickActionsProps) {
  
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

  const renderActionCard = (action: any, size: 'small' | 'medium' = 'medium') => {
    const IconComponent = action.icon;
    const cardClasses = `
      relative group flex flex-col items-center justify-center p-4 rounded-xl border-2 
      transition-all duration-200 hover:shadow-md hover:-translate-y-0.5
      ${action.color}
      ${action.disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
      ${size === 'small' ? 'h-20' : 'h-24'}
    `;

    return (
      <button
        key={action.id}
        onClick={action.disabled ? undefined : action.onClick}
        className={cardClasses}
        disabled={action.disabled}
      >
        {/* Icon */}
        <div className="flex items-center justify-center mb-2">
          <IconComponent 
            size={size === 'small' ? 18 : 20} 
            className={`${action.iconColor} transition-transform group-hover:scale-110`}
          />
        </div>
        
        {/* Label */}
        <span className="text-sm font-semibold text-center leading-tight">
          {action.label}
        </span>
        
        {/* Description (shown on hover for larger cards) */}
        {action.description && size === 'medium' && (
          <div className="absolute inset-x-0 bottom-0 p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <p className="text-xs text-center opacity-75">
              {action.description}
            </p>
          </div>
        )}
      </button>
    );
  };

  const renderActionGroup = (title: string, actions: any[], description?: string) => (
    <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            {title}
          </h3>
          {description && (
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              {description}
            </p>
          )}
        </div>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {actions.map(action => renderActionCard(action))}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header with save status */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
          <Settings className="text-blue-600" size={24} />
          Quick Actions
        </h2>
        
        <div className="flex items-center gap-3">
          {/* Save status indicator */}
          {hasUnsavedChanges && (
            <div className="flex items-center gap-2 px-3 py-1.5 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 rounded-lg">
              <AlertCircle size={16} className="text-amber-600" />
              <span className="text-sm font-medium text-amber-700 dark:text-amber-300">
                Unsaved changes
              </span>
            </div>
          )}
          
          {isSaving && (
            <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg">
              <RefreshCw size={16} className="text-blue-600 animate-spin" />
              <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
                Saving...
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
      {renderActionGroup(
        'Content Management',
        contentActions,
        'Manage listing content and media'
      )}

      {/* Quick Management */}
      {renderActionGroup(
        'Quick Tools',
        managementActions,
        'Essential management tools'
      )}

      {/* Danger Zone */}
      <div className="bg-red-50 dark:bg-red-900/20 rounded-xl border border-red-200 dark:border-red-700 p-6">
        <h3 className="text-lg font-semibold text-red-900 dark:text-red-100 mb-4">
          Danger Zone
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <button
            onClick={onDeleteProperty}
            className="flex items-center justify-center gap-2 p-4 rounded-xl border-2 border-red-200 bg-red-50 hover:bg-red-100 text-red-700 transition-all duration-200 hover:shadow-md hover:-translate-y-0.5"
          >
            <Settings size={20} className="text-red-600" />
            <span className="font-semibold">Delete Property</span>
          </button>
        </div>
        <p className="text-sm text-red-600 dark:text-red-400 mt-3">
          This action cannot be undone. Please be certain.
        </p>
      </div>
    </div>
  );
}
```

## 📋 Usage Example

```jsx
// Example integration in your component
import React from 'react';
import PropertyQuickActions from './components/property-edit/PropertyQuickActions';

function MyPropertyEditor({ property }) {
  const [isSaving, setIsSaving] = React.useState(false);
  const [hasChanges, setHasChanges] = React.useState(false);
  const [currentStatus, setCurrentStatus] = React.useState('draft');

  const handleEditPhotos = () => {
    console.log('Opening photo editor...');
  };

  const handleDuplicate = () => {
    console.log('Duplicating property...');
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: property.title,
        text: 'Check out this property',
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard');
    }
  };

  const handleAnalytics = () => {
    console.log('Opening analytics...');
  };

  const handlePreview = () => {
    console.log('Opening preview...');
  };

  const handleSaveDraft = () => {
    console.log('Saving draft...');
  };

  const handleRefresh = () => {
    console.log('Refreshing data...');
  };

  const handleStatusChange = (newStatus) => {
    setCurrentStatus(newStatus);
    console.log(`Status changed to: ${newStatus}`);
  };

  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this property?')) {
      console.log('Deleting property...');
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <PropertyQuickActions
        property={property}
        onEditPhotos={handleEditPhotos}
        onDuplicate={handleDuplicate}
        onShare={handleShare}
        onAnalytics={handleAnalytics}
        onPreviewListing={handlePreview}
        onSaveDraft={handleSaveDraft}
        onRefreshData={handleRefresh}
        onChangeStatus={handleStatusChange}
        onDeleteProperty={handleDelete}
        isSaving={isSaving}
        hasUnsavedChanges={hasChanges}
        currentStatus={currentStatus}
      />
    </div>
  );
}
```

## 🎨 Quick Customization Options

### **Change Card Colors**
```typescript
// Status Actions
statusActions: [
  {
    // ... other properties
    color: 'bg-blue-50 hover:bg-blue-100 text-blue-700 border-blue-200',
    iconColor: 'text-blue-600'
  }
]
```

### **Adjust Card Size**
```typescript
// For smaller cards
renderActionCard(action, 'small')  // instead of 'medium'

// CSS classes for different sizes
.card-base: h-24    // 96px height
.card-small: h-20   // 80px height
```

### **Modify Grid Layout**
```typescript
// Change number of columns
<div className="grid grid-cols-3 md:grid-cols-5 gap-3">
  // 3 columns on mobile, 5 on desktop
</div>
```

### **Add Custom Icons**
```typescript
import { YourCustomIcon } from 'lucide-react';

// Add to action definitions
{
  id: 'custom',
  label: 'Custom Action',
  icon: YourCustomIcon,
  color: 'bg-pink-50 hover:bg-pink-100 text-pink-700 border-pink-200',
  iconColor: 'text-pink-600',
  onClick: () => {}
}
```

## ✅ Required Dependencies

Make sure you have these installed:

```bash
npm install lucide-react react-hot-toast
# or
yarn add lucide-react react-hot-toast
```

## 🎯 Tailwind CSS Classes Used

The component uses these Tailwind classes. Make sure you have Tailwind configured:

- `grid`, `grid-cols-2`, `md:grid-cols-4`
- `bg-{color}-50`, `hover:bg-{color}-100`
- `text-{color}-700`, `border-{color}-200`
- `rounded-xl`, `p-4`, `p-6`, `gap-3`, `space-y-6`
- `hover:shadow-md`, `hover:-translate-y-0.5`
- `transition-all`, `duration-200`

## 🔧 Installation Steps

1. **Copy the component file** to your project
2. **Update your existing component** to use PropertyQuickActions
3. **Install dependencies** if not already installed
4. **Test the integration** in your development environment

The component is production-ready and follows React best practices!