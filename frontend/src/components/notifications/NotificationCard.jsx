import React, { useState, useEffect } from 'react';
import { 
  Bell, 
  BellOff, 
  Building, 
  Heart, 
  DollarSign, 
  Star, 
  Shield, 
  Settings,
  Mail,
  MessageCircle,
  Clock,
  MoreVertical,
  Check,
  X,
  ExternalLink,
  AlertTriangle,
  Info,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { useNotifications } from '../../context/NotificationContext';
import { API_URL } from '../../context/constants';

const notificationTypeIcons = {
  property_alert: Building,
  price_change: DollarSign,
  saved_property_update: Heart,
  new_match: Star,
  premium_feature: Star,
  welcome: Bell,
  system_update: Settings,
  security_alert: Shield,
  new_inquiry: MessageCircle,
  booking_confirmation: CheckCircle,
  chat_message: MessageCircle,
  general: Bell
};

const priorityColors = {
  low: 'text-gray-500 border-gray-200 bg-gray-50',
  medium: 'text-blue-600 border-blue-200 bg-blue-50',
  high: 'text-orange-600 border-orange-200 bg-orange-50',
  urgent: 'text-red-600 border-red-200 bg-red-50'
};

const priorityIcons = {
  low: Info,
  medium: Info,
  high: AlertTriangle,
  urgent: AlertTriangle
};

const categoryColors = {
  property: 'bg-blue-100 text-blue-800',
  account: 'bg-green-100 text-green-800',
  system: 'bg-gray-100 text-gray-800',
  premium: 'bg-yellow-100 text-yellow-800',
  marketing: 'bg-purple-100 text-purple-800',
  security: 'bg-red-100 text-red-800'
};

export default function NotificationCard({ notification, onAction }) {
  const { markAsRead, markAsUnread, deleteNotification } = useNotifications();
  const [showActions, setShowActions] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [propertyExists, setPropertyExists] = useState(null); // null = checking, true/false = result

  const IconComponent = notificationTypeIcons[notification.type] || Bell;
  const PriorityIcon = priorityIcons[notification.priority] || Info;

  // Check if property exists for property-related notifications
  useEffect(() => {
    const checkPropertyExists = async () => {
      // Only check for property-related notifications with action URLs
      if (!notification.actionUrl || !notification.actionUrl.includes('/property/')) {
        setPropertyExists(true); // Non-property notifications can always show action
        return;
      }

      try {
        const propertyId = notification.actionUrl.split('/property/')[1];
        const response = await fetch(`${API_URL}/properties/${propertyId}`);
        setPropertyExists(response.ok);
      } catch (error) {
        console.error('Error checking property existence:', error);
        setPropertyExists(false);
      }
    };

    checkPropertyExists();
  }, [notification.actionUrl, notification.type]);

  const formatTimeAgo = (dateString) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInSeconds = Math.floor((now - date) / 1000);

    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
    
    return date.toLocaleDateString();
  };

  const handleClick = async () => {
    if (actionLoading) return;
    
    // Don't navigate if property doesn't exist
    if (notification.actionUrl?.includes('/property/') && propertyExists === false) {
      return;
    }
    
    setActionLoading(true);
    try {
      await markAsRead(notification.id);
      onAction?.(notification);
    } finally {
      setActionLoading(false);
    }
  };

  const handleToggleRead = async (e) => {
    e.stopPropagation();
    if (actionLoading) return;

    setActionLoading(true);
    try {
      if (notification.isRead) {
        await markAsUnread(notification.id);
      } else {
        await markAsRead(notification.id);
      }
      setShowActions(false);
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async (e) => {
    e.stopPropagation();
    if (actionLoading) return;

    setActionLoading(true);
    try {
      await deleteNotification(notification.id);
      setShowActions(false);
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div 
      className={`
        relative p-4 border rounded-lg transition-all duration-200 group
        ${notification.isRead 
          ? 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 opacity-75' 
          : 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 shadow-sm'
        }
        ${(notification.actionUrl?.includes('/property/') && propertyExists === false) 
          ? 'cursor-not-allowed opacity-60' 
          : 'cursor-pointer hover:shadow-md hover:border-gray-300 dark:hover:border-gray-600'
        }
        ${actionLoading ? 'pointer-events-none opacity-50' : ''}
      `}
      onClick={handleClick}
    >
      {/* Priority Indicator */}
      <div className={`absolute top-2 right-2 p-1 rounded-full ${priorityColors[notification.priority]}`}>
        <PriorityIcon size={12} />
      </div>

      <div className="flex items-start space-x-3">
        {/* Icon */}
        <div className={`
          flex-shrink-0 p-2 rounded-full
          ${notification.isRead 
            ? 'bg-gray-100 dark:bg-gray-700' 
            : 'bg-blue-100 dark:bg-blue-800'
          }
        `}>
          <IconComponent size={20} className={`
            ${notification.isRead 
              ? 'text-gray-500 dark:text-gray-400' 
              : 'text-blue-600 dark:text-blue-300'
            }
          `} />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              {/* Title */}
              <h3 className={`
                font-semibold text-sm leading-5 mb-1
                ${notification.isRead 
                  ? 'text-gray-700 dark:text-gray-300' 
                  : 'text-gray-900 dark:text-gray-100'
                }
              `}>
                {notification.title}
              </h3>

              {/* Message */}
              <p className={`
                text-sm leading-relaxed mb-2
                ${notification.isRead 
                  ? 'text-gray-600 dark:text-gray-400' 
                  : 'text-gray-700 dark:text-gray-300'
                }
              `}>
                {notification.message}
              </p>

              {/* Category Badge */}
              <div className="flex items-center justify-between">
                <span className={`
                  inline-flex items-center px-2 py-1 rounded-full text-xs font-medium
                  ${categoryColors[notification.category] || 'bg-gray-100 text-gray-800'}
                `}>
                  {notification.category}
                </span>

                {/* Time */}
                <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                  <Clock size={12} className="mr-1" />
                  {formatTimeAgo(notification.createdAt)}
                </div>
              </div>

              {/* Action URL - only show if property exists or it's not a property notification */}
              {notification.actionUrl && propertyExists !== false && (
                <div className="mt-2">
                  <span className="inline-flex items-center text-xs text-blue-600 dark:text-blue-400 hover:underline">
                    View details
                    <ExternalLink size={12} className="ml-1" />
                  </span>
                </div>
              )}
              
              {/* Show message if property no longer exists */}
              {notification.actionUrl && notification.actionUrl.includes('/property/') && propertyExists === false && (
                <div className="mt-2">
                  <span className="inline-flex items-center text-xs text-gray-500 dark:text-gray-400">
                    Property no longer available
                    <AlertTriangle size={12} className="ml-1" />
                  </span>
                </div>
              )}
            </div>

            {/* Actions Menu */}
            <div className="relative">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowActions(!showActions);
                }}
                className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 opacity-0 group-hover:opacity-100 transition-opacity"
                disabled={actionLoading}
              >
                <MoreVertical size={16} className="text-gray-500" />
              </button>

              {showActions && (
                <div className="absolute right-0 top-8 z-10 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg py-1 min-w-[120px]">
                  <button
                    onClick={handleToggleRead}
                    className="flex items-center w-full px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    disabled={actionLoading}
                  >
                    {notification.isRead ? (
                      <>
                        <Bell size={14} className="mr-2" />
                        Mark as unread
                      </>
                    ) : (
                      <>
                        <Check size={14} className="mr-2" />
                        Mark as read
                      </>
                    )}
                  </button>
                  
                  <button
                    onClick={handleDelete}
                    className="flex items-center w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                    disabled={actionLoading}
                  >
                    <X size={14} className="mr-2" />
                    Delete
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Click outside to close actions */}
      {showActions && (
        <div 
          className="fixed inset-0 z-0" 
          onClick={() => setShowActions(false)}
        />
      )}
    </div>
  );
}