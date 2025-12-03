 import React, { useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Heart, Plus, User, Home, Tag } from 'lucide-react';
import { AppContext } from '../../context/AppContext';

export default function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation(); 
  const { handleOpenPostWizard, currentUser } = useContext(AppContext);

  const navItems = [
    { name: 'Home', icon: Home, path: '/' },
    { name: 'Price', icon: Tag, path: '/premium' },
    { name: 'Post', icon: Plus, action: handleOpenPostWizard }, 
    { name: 'Saved', icon: Heart, path: '/saved' },
    { name: 'Profile', icon: User, path: currentUser ? '/profile' : '/login' }, 
  ];
  
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 shadow-2xl rounded-t-xl px-2 sm:px-3 py-2 z-50 safe-area-pb">
      <div className="flex justify-around items-center max-w-lg mx-auto">
        {navItems.map((item) => {
          const isActive = (item.path === '/' && location.pathname === '/') || 
                           (item.path && item.path !== '/' && location.pathname.startsWith(item.path));
          
          return (
            <button
              key={item.name}
              onClick={() => {
                if (item.action) {
                  item.action(); 
                } else {
                  navigate(item.path); 
                }
              }}
              className={`flex flex-col items-center p-2 sm:p-2.5 rounded-lg transition-all min-w-0 touch-manipulation ${
                isActive ? 'text-blue-600 dark:text-blue-400' : 'text-gray-500 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-300'
              }`}
              aria-label={`Navigate to ${item.name}`}
            >
              <item.icon size={16} className="sm:w-[18px] sm:h-[18px] transition-all duration-300" />
              <span className={`text-[10px] sm:text-xs mt-1 leading-tight ${isActive ? 'font-bold' : 'font-medium'}`}>{item.name}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}