// src/NotificationsPage.jsx
import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  Bell, 
  Filter, 
  Search, 
  CheckCircle, 
  Trash2,
  Settings,
  RefreshCw,
  MoreHorizontal,
  CheckCheck
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useNotifications } from '../context/NotificationContext';
import NotificationCard from '../components/notifications/NotificationCard';

export default function NotificationsPage() {
  const navigate = useNavigate();
  const {
    notifications,
    unreadCount,
    loading,
    error,
    fetchNotifications,
    markAllAsRead,
    deleteNotification
  } = useNotifications();

  const [filters, setFilters] = useState({
    category: '',
    type: '',
    isRead: '',
    searchTerm: ''
  });
  const [showFilters, setShowFilters] = useState(false);
  const [selectedNotifications, setSelectedNotifications] = useState(new Set());

  // Load notifications on mount and when filters change
  useEffect(() => {
    loadNotifications();
  }, [filters]);

  const loadNotifications = async () => {
    const params = {
      page: 1,
      limit: 50,
      ...(filters.category && { category: filters.category }),
      ...(filters.type && { type: filters.type }),
      ...(filters.isRead !== '' && { isRead: filters.isRead === 'true' })
    };

    await fetchNotifications(params);
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSelectNotification = (notificationId) => {
    setSelectedNotifications(prev => {
      const newSet = new Set(prev);
      if (newSet.has(notificationId)) {
        newSet.delete(notificationId);
      } else {
        newSet.add(notificationId);
      }
      return newSet;
    });
  };

  const handleSelectAll = () => {
    if (selectedNotifications.size === notifications.length) {
      setSelectedNotifications(new Set());
    } else {
      setSelectedNotifications(new Set(notifications.map(n => n.id)));
    }
  };

  const handleBulkDelete = async () => {
    if (selectedNotifications.size === 0) return;
    
    // Delete each selected notification
    for (const notificationId of selectedNotifications) {
      await deleteNotification(notificationId);
    }
    setSelectedNotifications(new Set());
  };

  const handleMarkAllAsRead = async () => {
    await markAllAsRead();
    setSelectedNotifications(new Set());
  };

  const handleRefresh = () => {
    loadNotifications();
  };

  // Filter notifications based on search term
  const filteredNotifications = notifications.filter(notif => {
    if (!filters.searchTerm) return true;
    return (
      notif.title.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
      notif.message.toLowerCase().includes(filters.searchTerm.toLowerCase())
    );
  });

  const categories = ['property', 'account', 'system', 'premium', 'marketing', 'security'];
  const types = ['property_alert', 'price_change', 'saved_property_update', 'new_match', 'welcome', 'system_update'];

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 flex-shrink-0">
        <div className="flex items-center">
          <button 
            onClick={() => navigate(-1)}
            className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 mr-2"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h2 className="font-bold text-lg">Notifications</h2>
            {unreadCount > 0 && (
              <p className="text-sm text-blue-600 dark:text-blue-400">
                {unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {/* Actions */}
          {notifications.length > 0 && (
            <>
              <button
                onClick={handleRefresh}
                className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
                disabled={loading}
              >
                <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
              </button>
              
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
              >
                <Filter size={18} />
              </button>

              <button
                onClick={() => navigate('/notification-settings')}
                className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
              >
                <Settings size={18} />
              </button>
            </>
          )}
        </div>
      </header>

      {/* Filters */}
      {showFilters && (
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
          <div className="space-y-4">
            {/* Search */}
            <div className="relative">
              <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                id="notification-search"
                name="searchTerm"
                placeholder="Search notifications..."
                value={filters.searchTerm}
                onChange={(e) => handleFilterChange('searchTerm', e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              />
            </div>

            {/* Filter Rows */}
            <div className="grid grid-cols-2 gap-4">
              {/* Category Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Category
                </label>
                <select
                  id="notification-category"
                  name="category"
                  value={filters.category}
                  onChange={(e) => handleFilterChange('category', e.target.value)}
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                >
                  <option value="">All Categories</option>
                  {categories.map(category => (
                    <option key={category} value={category}>
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              {/* Status Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Status
                </label>
                <select
                  id="notification-status"
                  name="isRead"
                  value={filters.isRead}
                  onChange={(e) => handleFilterChange('isRead', e.target.value)}
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                >
                  <option value="">All</option>
                  <option value="false">Unread</option>
                  <option value="true">Read</option>
                </select>
              </div>
            </div>

            {/* Clear Filters */}
            <button
              onClick={() => setFilters({ category: '', type: '', isRead: '', searchTerm: '' })}
              className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
            >
              Clear all filters
            </button>
          </div>
        </div>
      )}

      {/* Bulk Actions */}
      {selectedNotifications.size > 0 && (
        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <span className="text-sm text-blue-800 dark:text-blue-200">
              {selectedNotifications.size} notification{selectedNotifications.size !== 1 ? 's' : ''} selected
            </span>
            <div className="flex items-center space-x-2">
              <button
                onClick={handleMarkAllAsRead}
                className="flex items-center space-x-1 px-3 py-1 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <CheckCheck size={14} />
                <span>Mark as read</span>
              </button>
              <button
                onClick={handleBulkDelete}
                className="flex items-center space-x-1 px-3 py-1 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                <Trash2 size={14} />
                <span>Delete</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <RefreshCw size={32} className="animate-spin text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 dark:text-gray-400">Loading notifications...</p>
            </div>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <Bell size={48} className="text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 dark:text-gray-400 mb-4">Failed to load notifications</p>
              <button
                onClick={handleRefresh}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Try Again
              </button>
            </div>
          </div>
        ) : filteredNotifications.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <Bell size={64} className="text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-700 dark:text-gray-300 mb-2">
                {notifications.length === 0 ? 'No Notifications Yet' : 'No Matching Notifications'}
              </h3>
              <p className="text-gray-500 dark:text-gray-400 max-w-sm">
                {notifications.length === 0 
                  ? "We'll let you know when there's something new for you."
                  : "Try adjusting your filters to see more notifications."
                }
              </p>
              {notifications.length === 0 && unreadCount > 0 && (
                <button
                  onClick={loadNotifications}
                  className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Refresh
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="p-4">
            {/* Select All */}
            <div className="flex items-center justify-between mb-4">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="select-all-notifications"
                  name="selectAll"
                  checked={selectedNotifications.size === filteredNotifications.length && filteredNotifications.length > 0}
                  onChange={handleSelectAll}
                  className="rounded border-gray-300"
                />
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Select all ({filteredNotifications.length})
                </span>
              </label>
              
              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAllAsRead}
                  className="flex items-center space-x-1 text-sm text-blue-600 dark:text-blue-400 hover:underline"
                >
                  <CheckCheck size={14} />
                  <span>Mark all as read</span>
                </button>
              )}
            </div>

            {/* Notifications List */}
            <div className="space-y-3">
              {filteredNotifications.map((notification) => (
                <div key={notification.id} className="relative">
                  <label className="absolute top-4 left-4 z-10">
                    <input
                      type="checkbox"
                      id={`notification-select-${notification.id}`}
                      name={`notification-${notification.id}`}
                      checked={selectedNotifications.has(notification.id)}
                      onChange={() => handleSelectNotification(notification.id)}
                      className="rounded border-gray-300"
                    />
                  </label>
                  <div className="pl-10">
                    <NotificationCard
                      notification={notification}
                      onAction={(notif) => {
                        // Navigate to action URL if available
                        if (notif.actionUrl) {
                          navigate(notif.actionUrl);
                        }
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}