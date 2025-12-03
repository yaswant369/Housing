import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../utils/api';

const NotificationContext = createContext();

// API base URL
const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

export function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Fetch notifications
  const fetchNotifications = async (params = {}) => {
    try {
      setLoading(true);
      setError(null);
      
      const queryParams = new URLSearchParams({
        page: params.page || 1,
        limit: params.limit || 20,
        ...(params.category && { category: params.category }),
        ...(params.type && { type: params.type }),
        ...(params.isRead !== undefined && { isRead: params.isRead }),
        sortBy: params.sortBy || 'createdAt',
        sortOrder: params.sortOrder || 'desc'
      });

      const response = await api.get(`/notifications?${queryParams}`);

      const data = response.data;
      setNotifications(data.notifications);
      setUnreadCount(data.unreadCount);
      
      return data;
    } catch (err) {
      console.error('Error fetching notifications:', err);
      setError(err.message);
      toast.error('Failed to load notifications');
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Fetch unread count
  const fetchUnreadCount = async () => {
    try {
      const response = await api.get('/notifications/unread');

      const data = response.data;
      setUnreadCount(data.unreadCount);
      return data.unreadCount;
    } catch (err) {
      console.error('Error fetching unread count:', err);
      return null;
    }
  };

  // Mark notification as read
  const markAsRead = async (notificationId) => {
    try {
      await api.put(`/notifications/${notificationId}/read`);

      // Update local state
      setNotifications(prev => 
        prev.map(notif => 
          notif.id === notificationId 
            ? { ...notif, isRead: true, readAt: new Date() }
            : notif
        )
      );

      // Update unread count
      setUnreadCount(prev => Math.max(0, prev - 1));
      
      return true;
    } catch (err) {
      console.error('Error marking notification as read:', err);
      toast.error('Failed to mark notification as read');
      return false;
    }
  };

  // Mark all notifications as read
  const markAllAsRead = async () => {
    try {
      await api.put('/notifications/mark-all-read');

      // Update local state
      setNotifications(prev => 
        prev.map(notif => ({ ...notif, isRead: true, readAt: new Date() }))
      );
      setUnreadCount(0);
      toast.success('All notifications marked as read');
      
      return true;
    } catch (err) {
      console.error('Error marking all as read:', err);
      toast.error('Failed to mark all notifications as read');
      return false;
    }
  };

  // Delete notification
  const deleteNotification = async (notificationId) => {
    try {
      await api.delete(`/notifications/${notificationId}`);

      // Update local state
      setNotifications(prev => prev.filter(notif => notif.id !== notificationId));
      
      // Update unread count if deleted notification was unread
      const deletedNotification = notifications.find(notif => notif.id === notificationId);
      if (deletedNotification && !deletedNotification.isRead) {
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
      
      toast.success('Notification deleted');
      return true;
    } catch (err) {
      console.error('Error deleting notification:', err);
      toast.error('Failed to delete notification');
      return false;
    }
  };

  // Mark notification as unread
  const markAsUnread = async (notificationId) => {
    try {
      await api.put(`/notifications/${notificationId}/unread`);

      // Update local state
      setNotifications(prev => 
        prev.map(notif => 
          notif.id === notificationId 
            ? { ...notif, isRead: false, readAt: null }
            : notif
        )
      );

      setUnreadCount(prev => prev + 1);
      return true;
    } catch (err) {
      console.error('Error marking as unread:', err);
      toast.error('Failed to mark notification as unread');
      return false;
    }
  };

  // Get notification settings
  const getNotificationSettings = async () => {
    try {
      const response = await api.get('/notifications/settings');

      return response.data;
    } catch (err) {
      console.error('Error fetching notification settings:', err);
      return null;
    }
  };

  // Update notification settings
  const updateNotificationSettings = async (settings) => {
    try {
      const response = await api.put('/notifications/settings', settings);

      toast.success('Notification settings updated');
      return response.data;
    } catch (err) {
      console.error('Error updating notification settings:', err);
      toast.error('Failed to update notification settings');
      return null;
    }
  };

  // Handle notification click
  const handleNotificationClick = async (notification) => {
    // Mark as read if not already
    if (!notification.isRead) {
      await markAsRead(notification.id);
    }

    // Navigate to action URL if available
    if (notification.actionUrl) {
      navigate(notification.actionUrl);
    }
  };

  // Load unread count on mount
  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      fetchUnreadCount();
    }
  }, []);

  // Set up periodic refresh with reduced frequency
  useEffect(() => {
    const interval = setInterval(() => {
      const token = localStorage.getItem('accessToken');
      if (token && !loading) {
        fetchUnreadCount();
      }
    }, 300000); // Refresh every 5 minutes instead of 30 seconds

    return () => clearInterval(interval);
  }, [loading]);

  // Add manual refresh function that user can trigger
  const refreshNotifications = async () => {
    const token = localStorage.getItem('accessToken');
    if (token && !loading) {
      await fetchUnreadCount();
    }
  };

  const value = {
    notifications,
    unreadCount,
    loading,
    error,
    fetchNotifications,
    fetchUnreadCount,
    markAsRead,
    markAllAsRead,
    markAsUnread,
    deleteNotification,
    getNotificationSettings,
    updateNotificationSettings,
    handleNotificationClick,
    refreshNotifications
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
}