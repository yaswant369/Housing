 import React, { useContext, useState, useEffect } from 'react';
import { AppContext } from '../context/context';
import { useNavigate } from 'react-router-dom';
import { 
  User, LogOut, Edit, Bell, Shield, FileText, 
  MessageCircle, Info, Settings, ChevronRight, Crown
} from 'lucide-react';

export default function ProfilePage() {
  const { currentUser, logout, handleOpenEditProfile } = useContext(AppContext);
  const navigate = useNavigate();
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        // Scrolling down & past threshold
        setIsHeaderVisible(false);
      } else {
        // Scrolling up
        setIsHeaderVisible(true);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [lastScrollY]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (!currentUser) {
    navigate('/login');
    return null;
  }

  const menuSections = [
    {
      title: 'Account',
      items: [
        { icon: Edit, label: 'Edit Profile', action: handleOpenEditProfile },
        { icon: Crown, label: 'Premium Plans', path: '/premium' },
        { icon: Bell, label: 'Notifications', path: '/notifications' },
      ]
    },
    {
      title: 'Tools & Support',
      items: [
        { icon: Settings, label: 'Calculator Tools', path: '/tools' },
        { icon: MessageCircle, label: 'Chat Support', path: '/chat' },
      ]
    },
    {
      title: 'Security & Legal',
      items: [
        { icon: Shield, label: 'Security Settings', path: '/security' },
        { icon: FileText, label: 'Privacy Policy', path: '/privacy-policy' },
        { icon: FileText, label: 'Terms & Conditions', path: '/terms' },
        { icon: Info, label: 'About Us', path: '/about' },
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-16">
      {/* Profile Header - Sticky with Hide on Scroll */}
      <div 
        className={`sticky top-0 z-30 bg-gradient-to-r from-blue-600 to-purple-600 transition-transform duration-300 ${
          isHeaderVisible ? 'translate-y-0' : '-translate-y-full'
        }`}
      >
        <div className="max-w-4xl mx-auto px-4 pt-8 pb-6">
          <div className="flex items-center space-x-4">
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-lg">
              <User size={40} className="text-blue-600" />
            </div>
            <div className="text-white">
              <h1 className="text-2xl font-bold">{currentUser.name}</h1>
              <p className="text-blue-100">{currentUser.email}</p>
              <p className="text-blue-100">{currentUser.phone}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Menu Sections */}
      <div className="max-w-4xl mx-auto px-4 pt-6">
        {menuSections.map((section, idx) => (
          <div key={idx} className="mb-6">
            <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-3 px-2">
              {section.title}
            </h3>
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
              {section.items.map((item, itemIdx) => (
                <button
                  key={itemIdx}
                  onClick={() => item.action ? item.action() : navigate(item.path)}
                  className="w-full flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors border-b border-gray-100 dark:border-gray-700 last:border-b-0"
                >
                  <div className="flex items-center space-x-3">
                    <item.icon size={20} className="text-gray-600 dark:text-gray-400" />
                    <span className="font-medium text-gray-800 dark:text-gray-200">{item.label}</span>
                  </div>
                  <ChevronRight size={20} className="text-gray-400" />
                </button>
              ))}
            </div>
          </div>
        ))}

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center space-x-2 py-4 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30 text-red-600 dark:text-red-400 rounded-xl font-semibold transition-colors"
        >
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
}