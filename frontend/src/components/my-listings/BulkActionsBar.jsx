import React, { useState } from 'react';
import {
  Check,
  X,
  MoreVertical,
  Settings,
  CheckCircle,
  XCircle,
  RefreshCw,
  Star,
  Trash2,
  Eye,
  MessageSquare,
  Play,
  Pause
} from 'lucide-react';
import toast from 'react-hot-toast';

const bulkActionItems = [
  {
    category: 'Status Changes',
    items: [
      { key: 'set-online', label: 'Set Online', icon: Play, color: 'text-green-600' },
      { key: 'set-offline', label: 'Set Offline', icon: Pause, color: 'text-yellow-600' },
      { key: 'mark-sold', label: 'Mark as Sold/Rented', icon: Check, color: 'text-purple-600' }
    ]
  },
  {
    category: 'Actions',
    items: [
      { key: 'renew', label: 'Renew Properties', icon: RefreshCw, color: 'text-blue-600' },
      { key: 'boost', label: 'Boost Selected', icon: Star, color: 'text-yellow-600' }
    ]
  },
  {
    category: 'Data',
    items: [
      { key: 'export', label: 'Export Data', icon: Eye, color: 'text-gray-600' },
      { key: 'analytics', label: 'View Analytics', icon: MessageSquare, color: 'text-blue-600' }
    ]
  },
  {
    category: 'Danger Zone',
    items: [
      { key: 'delete', label: 'Delete Properties', icon: Trash2, color: 'text-red-600', danger: true }
    ]
  }
];

export default function BulkActionsBar({
  selectedProperties,
  totalProperties,
  onSelectAll,
  onClearSelection,
  onBulkAction,
  isVisible = false
}) {
  const [showActionsMenu, setShowActionsMenu] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const selectedCount = selectedProperties.length;

  if (!isVisible || selectedCount === 0) {
    return null;
  }

  const handleBulkAction = async (actionKey) => {
    setIsProcessing(true);
    setShowActionsMenu(false);

    try {
      await onBulkAction(actionKey, selectedProperties);
      toast.success(`Successfully performed ${actionKey} on ${selectedCount} properties`);
    } catch (error) {
      toast.error(`Bulk action failed: ${error.message}`);
    } finally {
      setIsProcessing(false);
    }
  };

  const formatActionLabel = (actionKey) => {
    const item = bulkActionItems
      .flatMap(category => category.items)
      .find(item => item.key === actionKey);
    return item?.label || actionKey;
  };

  return (
    <div className="fixed bottom-20 left-1/2 transform -translate-x-1/2 z-[200]">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-4 min-w-80">
        <div className="flex items-center justify-between">
          {/* Selection Info */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <CheckCircle className="text-green-500" size={20} />
              <span className="font-medium text-gray-900 dark:text-gray-100">
                {selectedCount} selected
              </span>
            </div>
            <span className="text-gray-500 dark:text-gray-400 text-sm">
              of {totalProperties} properties
            </span>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            {/* Quick Actions */}
            <button
              onClick={() => handleBulkAction('set-online')}
              disabled={isProcessing}
              className="flex items-center gap-2 px-3 py-2 bg-green-100 text-green-700 hover:bg-green-200 disabled:opacity-50 rounded-lg transition-colors text-sm font-medium"
            >
              <Play size={16} />
              Set Online
            </button>

            <button
              onClick={() => handleBulkAction('set-offline')}
              disabled={isProcessing}
              className="flex items-center gap-2 px-3 py-2 bg-yellow-100 text-yellow-700 hover:bg-yellow-200 disabled:opacity-50 rounded-lg transition-colors text-sm font-medium"
            >
              <Pause size={16} />
              Set Offline
            </button>

            {/* More Actions Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowActionsMenu(!showActionsMenu)}
                disabled={isProcessing}
                className="flex items-center gap-2 px-3 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-50 rounded-lg transition-colors text-sm font-medium"
              >
                <MoreVertical size={16} />
                More
                {isProcessing && (
                  <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
                )}
              </button>

              {showActionsMenu && (
                <div className="absolute right-0 bottom-full mb-2 w-72 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 z-[210]">
                  <div className="p-2">
                    {bulkActionItems.map((category) => (
                      <div key={category.category} className="mb-4 last:mb-0">
                        <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider px-3 py-1">
                          {category.category}
                        </h4>
                        <div className="mt-1 space-y-1">
                          {category.items.map((item) => {
                            const IconComponent = item.icon;
                            return (
                              <button
                                key={item.key}
                                onClick={() => handleBulkAction(item.key)}
                                disabled={isProcessing}
                                className={`w-full flex items-center gap-3 px-3 py-2 text-left hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 rounded-md transition-colors ${
                                  item.danger 
                                    ? 'text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20' 
                                    : 'text-gray-700 dark:text-gray-300'
                                }`}
                              >
                                <IconComponent 
                                  size={16} 
                                  className={item.danger ? 'text-red-500' : item.color} 
                                />
                                <span className="text-sm">{item.label}</span>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Clear Selection */}
            <button
              onClick={onClearSelection}
              disabled={isProcessing}
              className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 disabled:opacity-50 rounded-lg transition-colors"
              title="Clear selection"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Progress Bar for Bulk Operations */}
        {isProcessing && (
          <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
              <span>Processing bulk action...</span>
              <span>{selectedCount} properties</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div className="bg-blue-600 h-2 rounded-full animate-pulse" style={{ width: '100%' }} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Select All Checkbox Component
export function SelectAllCheckbox({
  isAllSelected,
  isSomeSelected,
  onSelectAll,
  onClearSelection,
  totalCount,
  selectedCount
}) {
  return (
    <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
      <div className="flex items-center">
        <input
          type="checkbox"
          checked={isAllSelected}
          ref={(input) => {
            if (input) input.indeterminate = isSomeSelected && !isAllSelected;
          }}
          onChange={(e) => {
            if (e.target.checked) {
              onSelectAll();
            } else {
              onClearSelection();
            }
          }}
          className="w-4 h-4 text-blue-600 bg-white border-gray-300 rounded focus:ring-blue-500"
        />
        <label className="ml-3 text-sm font-medium text-gray-700 dark:text-gray-300">
          Select All ({totalCount} properties)
        </label>
      </div>

      {selectedCount > 0 && (
        <div className="flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400">
          <span>{selectedCount} selected</span>
          <button
            onClick={onClearSelection}
            className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 underline"
          >
            Clear
          </button>
        </div>
      )}
    </div>
  );
}