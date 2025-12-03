import React, { useState, useEffect } from 'react';
import { Bell, BellOff } from 'lucide-react';
import { useNotifications } from '../../context/NotificationContext';
import { useNavigate } from 'react-router-dom';

export default function NotificationBell({ currentUser, className = '' }) {
  const { unreadCount, fetchUnreadCount } = useNotifications();
  const navigate = useNavigate();
  const [isAnimating, setIsAnimating] = useState(false);
  const [previousCount, setPreviousCount] = useState(0);

  // Handle new notification animation
  useEffect(() => {
    if (unreadCount > previousCount && previousCount > 0) {
      setIsAnimating(true);
      const timer = setTimeout(() => setIsAnimating(false), 1000);
      return () => clearTimeout(timer);
    }
    setPreviousCount(unreadCount);
  }, [unreadCount, previousCount]);

  // Refresh count when user changes
  useEffect(() => {
    if (currentUser) {
      fetchUnreadCount();
    }
  }, [currentUser, fetchUnreadCount]);

  const handleClick = () => {
    if (currentUser) {
      navigate('/notifications');
    }
  };

  if (!currentUser) {
    return null;
  }

  return (
    <button
      onClick={handleClick}
      className={`
        relative p-2 rounded-full transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-800
        ${isAnimating ? 'animate-pulse' : ''}
        ${className}
      `}
      title={`Notifications (${unreadCount} unread)`}
    >
      <Bell 
        size={20} 
        className={`
          transition-colors duration-200
          ${unreadCount > 0 
            ? 'text-blue-600 dark:text-blue-400' 
            : 'text-gray-600 dark:text-gray-400'
          }
          ${isAnimating ? 'text-blue-700 dark:text-blue-300' : ''}
        `}
      />
      
      {/* Badge for unread count */}
      {unreadCount > 0 && (
        <span className={`
          absolute -top-1 -right-1 min-w-[18px] h-[18px] bg-red-500 text-white text-xs 
          font-bold rounded-full flex items-center justify-center transform transition-all duration-200
          ${isAnimating ? 'scale-125 animate-bounce' : ''}
          ${unreadCount > 99 ? 'text-[10px] px-1' : ''}
        `}>
          {unreadCount > 99 ? '99+' : unreadCount}
        </span>
      )}

      {/* Pulse effect for new notifications */}
      {isAnimating && (
        <div className="absolute inset-0 rounded-full bg-blue-400 opacity-75 animate-ping" />
      )}
    </button>
  );
}