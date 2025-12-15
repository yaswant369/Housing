import React, { useState, useEffect } from 'react';
import { MessageCircle, MessageSquare, Users, Settings, Bell, X } from 'lucide-react';
import { useChat } from '../../context/ChatContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

export default function ChatButton({ currentUser, className = '' }) {
  const { unreadChatsCount } = useChat();
  const navigate = useNavigate();
  const location = useLocation();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const handleClick = () => {
    if (currentUser) {
      navigate('/chat');
    }
  };

  const handleDropdownToggle = (e) => {
    e.stopPropagation();
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleCloseDropdown = () => {
    setIsDropdownOpen(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isDropdownOpen && !event.target.closest('.chat-dropdown-container')) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDropdownOpen]);

  // Only show chat button on chat-related pages
  const isChatPage = location.pathname.startsWith('/chat') ||
                    location.pathname === '/chat-support';

  if (!currentUser || !isChatPage) {
    return null;
  }

  // Quick actions for the dropdown
  const quickActions = [
    {
      icon: MessageSquare,
      label: 'My Chats',
      action: () => {
        navigate('/chat');
        handleCloseDropdown();
      },
      color: 'text-blue-500',
      bgColor: 'bg-blue-50'
    },
    {
      icon: Users,
      label: 'Support Team',
      action: () => {
        navigate('/chat-support');
        handleCloseDropdown();
      },
      color: 'text-green-500',
      bgColor: 'bg-green-50'
    },
    {
      icon: Settings,
      label: 'Chat Settings',
      action: () => {
        // Placeholder for chat settings
        handleCloseDropdown();
      },
      color: 'text-purple-500',
      bgColor: 'bg-purple-50'
    }
  ];

  return (
    <div className={`chat-dropdown-container relative ${className}`}>
      {/* Main Chat Button with enhanced UI */}
      <button
        onClick={handleDropdownToggle}
        className={`
          relative p-2 rounded-full transition-all duration-200
          hover:bg-gradient-to-br hover:from-blue-50 hover:to-purple-50
            
          group
          ${isAnimating ? 'animate-pulse' : ''}
        `}
        title={`Chat (${unreadChatsCount} unread messages)`}
        onMouseEnter={() => setIsAnimating(true)}
        onMouseLeave={() => setIsAnimating(false)}
      >
        {/* Animated Message Icon */}
        <div className="relative">
          <MessageCircle
            size={20}
            className={`
              transition-all duration-300
              ${unreadChatsCount > 0
                ? 'text-blue-600  group-hover:scale-110'
                : 'text-gray-600  group-hover:text-blue-600'
              }
            `}
          />

          {/* Enhanced Notification Badge with animation */}
          {unreadChatsCount > 0 && (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              className={`
                absolute -top-1 -right-1 min-w-[20px] h-[20px]
                bg-gradient-to-r from-red-500 to-orange-500
                text-white text-xs font-bold rounded-full
                flex items-center justify-center transform
                shadow-lg shadow-red-500/30
                ring-2 ring-white 
              `}
            >
              {unreadChatsCount > 99 ? '99+' : unreadChatsCount}
            </motion.div>
          )}
        </div>
      </button>

      {/* Advanced Dropdown Menu */}
      <AnimatePresence>
        {isDropdownOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -5, scale: 0.98 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="absolute right-0 mt-2 w-64 origin-top-right z-50"
          >
            <div className="bg-white  rounded-xl shadow-2xl border border-gray-100  overflow-hidden">
              {/* Dropdown Header */}
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <MessageCircle className="text-white" size={18} />
                    <span className="text-white font-semibold text-sm">Messages Center</span>
                  </div>
                  <button
                    onClick={handleCloseDropdown}
                    className="text-white hover:bg-white/20 p-1 rounded-full transition-colors"
                  >
                    <X size={16} />
                  </button>
                </div>
                <p className="text-blue-100 text-xs mt-1">
                  {unreadChatsCount > 0
                    ? `${unreadChatsCount} new messages waiting`
                    : 'All caught up!'}
                </p>
              </div>

              {/* Quick Actions */}
              <div className="p-2">
                <div className="grid grid-cols-3 gap-1">
                  {quickActions.map((action, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        action.action();
                        setIsAnimating(true);
                        setTimeout(() => setIsAnimating(false), 500);
                      }}
                      className={`
                        flex flex-col items-center justify-center
                        p-3 rounded-lg transition-all duration-200
                        hover:bg-gray-50 
                        ${action.bgColor}
                      `}
                    >
                      <action.icon
                        size={20}
                        className={`${action.color} mb-1`}
                      />
                      <span className="text-xs font-medium text-gray-700 
                        {action.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Divider */}
              <div className="border-t border-gray-100  my-2" />

              {/* Action Buttons */}
              <div className="p-2 space-y-1">
                <button
                  onClick={() => {
                    navigate('/chat');
                    handleCloseDropdown();
                  }}
                  className="w-full flex items-center justify-center space-x-2 py-2 px-3
                    bg-blue-600 text-white text-sm font-medium
                    rounded-lg hover:bg-blue-700 transition-colors
                    shadow-sm hover:shadow-md"
                >
                  <MessageSquare size={16} />
                  <span>Go to Messages</span>
                </button>

                <button
                  onClick={() => {
                    navigate('/chat-support');
                    handleCloseDropdown();
                  }}
                  className="w-full flex items-center justify-center space-x-2 py-2 px-3
                    bg-green-600 text-white text-sm font-medium
                    rounded-lg hover:bg-green-700 transition-colors
                    shadow-sm hover:shadow-md"
                >
                  <Users size={16} />
                  <span>Contact Support</span>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
