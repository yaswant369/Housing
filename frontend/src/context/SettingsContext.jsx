import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNotifications } from './NotificationContext';
import toast from 'react-hot-toast';
import api from '../utils/api';

const SettingsContext = createContext();

export function SettingsProvider({ children }) {
  const [settings, setSettings] = useState({
    chatNotifications: true,
    soundEffects: true,
    autoResponses: true
  });
  const [loading, setLoading] = useState(false);
  const [initialized, setInitialized] = useState(false);

  // Fetch settings on mount
  useEffect(() => {
    const fetchSettings = async () => {
      const token = localStorage.getItem('accessToken');
      if (!token) return;

      try {
        setLoading(true);
        const response = await api.get('/notifications/settings');
        const notificationSettings = response.data;
        
        // Map backend settings to our local settings
        const mappedSettings = {
          chatNotifications: notificationSettings.types?.chat_message?.channels?.push || true,
          soundEffects: notificationSettings.mobile?.sound || true,
          autoResponses: true // This is a local setting not in backend yet
        };
        
        setSettings(mappedSettings);
      } catch (error) {
        console.error('Error fetching settings:', error);
        // Use default settings if fetch fails
      } finally {
        setLoading(false);
        setInitialized(true);
      }
    };

    fetchSettings();
  }, []);

  // Update individual setting
  const updateSetting = (key, value) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  // Save settings to backend
  const saveSettings = async () => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      toast.error('Please log in to save settings');
      return false;
    }

    try {
      setLoading(true);
      
      // Prepare backend data structure
      const backendSettings = {
        types: {
          chat_message: {
            enabled: settings.chatNotifications,
            frequency: 'immediate',
            channels: {
              inApp: true,
              email: true,
              push: settings.chatNotifications
            }
          }
        },
        mobile: {
          sound: settings.soundEffects,
          vibration: true,
          badge: true,
          led: true
        }
      };

      await api.put('/notifications/settings', backendSettings);
      
      toast.success('Settings saved successfully');
      return true;
    } catch (error) {
      console.error('Error saving settings:', error);
      toast.error('Failed to save settings');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Request desktop notification permission
  const requestNotificationPermission = async () => {
    if (!('Notification' in window)) {
      toast.error('This browser does not support notifications');
      return false;
    }

    if (Notification.permission === 'granted') {
      return true;
    }

    if (Notification.permission !== 'denied') {
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    }

    return false;
  };

  // Show desktop notification
  const showDesktopNotification = (title, options = {}) => {
    if (Notification.permission === 'granted' && settings.chatNotifications) {
      const notification = new Notification(title, {
        icon: '/favicon.ico',
        badge: '/favicon.ico',
        ...options
      });
      
      // Auto close after 5 seconds
      setTimeout(() => {
        notification.close();
      }, 5000);
      
      return notification;
    }
    return null;
  };

  // Play sound effect
  const playSound = (soundType = 'message') => {
    if (!settings.soundEffects) return;
    
    try {
      // Create audio context for modern browsers
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      // Different sounds for different types
      switch (soundType) {
        case 'message':
          oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
          oscillator.frequency.setValueAtTime(600, audioContext.currentTime + 0.1);
          gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
          gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
          oscillator.start(audioContext.currentTime);
          oscillator.stop(audioContext.currentTime + 0.3);
          break;
        case 'notification':
          oscillator.frequency.setValueAtTime(1000, audioContext.currentTime);
          gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
          gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
          oscillator.start(audioContext.currentTime);
          oscillator.stop(audioContext.currentTime + 0.2);
          break;
        default:
          break;
      }
    } catch (error) {
      console.warn('Could not play sound:', error);
    }
  };

  const value = {
    settings,
    loading,
    initialized,
    updateSetting,
    saveSettings,
    requestNotificationPermission,
    showDesktopNotification,
    playSound
  };

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
}
