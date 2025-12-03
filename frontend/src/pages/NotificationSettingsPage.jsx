// src/pages/NotificationSettingsPage.jsx
import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  Bell, 
  BellOff, 
  Mail, 
  Smartphone, 
  Clock,
  Save,
  RefreshCw,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useNotifications } from '../context/NotificationContext';
import toast from 'react-hot-toast';

export default function NotificationSettingsPage() {
  const navigate = useNavigate();
  const { getNotificationSettings, updateNotificationSettings } = useNotifications();
  
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  // Load notification settings
  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setLoading(true);
      const data = await getNotificationSettings();
      if (data) {
        setSettings(data);
      }
    } catch (error) {
      console.error('Error loading settings:', error);
      toast.error('Failed to load notification settings');
    } finally {
      setLoading(false);
    }
  };

  const handleSettingChange = (path, value) => {
    setSettings(prev => {
      const newSettings = { ...prev };
      const keys = path.split('.');
      let current = newSettings;
      
      for (let i = 0; i < keys.length - 1; i++) {
        if (!current[keys[i]]) {
          current[keys[i]] = {};
        }
        current = current[keys[i]];
      }
      
      current[keys[keys.length - 1]] = value;
      return newSettings;
    });
    setHasChanges(true);
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      await updateNotificationSettings(settings);
      setHasChanges(false);
      toast.success('Notification settings saved');
    } catch (error) {
      console.error('Error saving settings:', error);
      toast.error('Failed to save notification settings');
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    loadSettings();
    setHasChanges(false);
  };

  if (loading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <RefreshCw size={32} className="animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Loading notification settings...</p>
        </div>
      </div>
    );
  }

  if (!settings) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <AlertCircle size={48} className="text-red-500 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400 mb-4">Failed to load settings</p>
          <button
            onClick={loadSettings}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

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
            <h2 className="font-bold text-lg">Notification Settings</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Manage how you receive notifications
            </p>
          </div>
        </div>

        {hasChanges && (
          <div className="flex items-center space-x-2">
            <button
              onClick={handleReset}
              className="px-3 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
              disabled={saving}
            >
              Reset
            </button>
            <button
              onClick={handleSave}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              disabled={saving}
            >
              {saving ? (
                <RefreshCw size={16} className="animate-spin" />
              ) : (
                <Save size={16} />
              )}
              <span>Save</span>
            </button>
          </div>
        )}
      </header>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 pb-24 space-y-6">
        {/* Global Settings */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="font-semibold text-lg mb-4 flex items-center">
            <Bell className="mr-2" size={20} />
            Global Settings
          </h3>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Enable Notifications</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Receive notifications from our platform
                </p>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={settings.enabled}
                onClick={() => handleSettingChange('enabled', !settings.enabled)}
                className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                  settings.enabled ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    settings.enabled ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Category Settings */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="font-semibold text-lg mb-4">Category Preferences</h3>
          
          <div className="space-y-6">
            {Object.entries(settings.categories || {}).map(([category, categorySettings]) => (
              <div key={category} className="border-b border-gray-200 dark:border-gray-700 last:border-b-0 pb-6 last:pb-0">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h4 className="font-medium capitalize">{category}</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Manage {category} related notifications
                    </p>
                  </div>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={categorySettings.enabled}
                    onClick={() => handleSettingChange(`categories.${category}.enabled`, !categorySettings.enabled)}
                    className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                      categorySettings.enabled ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'
                    }`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                        categorySettings.enabled ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>

                {categorySettings.enabled && (
                  <div className="ml-6 space-y-4">
                    {/* Frequency */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Frequency
                      </label>
                      <select
                        id={`frequency-${category}`}
                        name={`frequency-${category}`}
                        value={categorySettings.frequency}
                        onChange={(e) => handleSettingChange(`categories.${category}.frequency`, e.target.value)}
                        className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                      >
                        <option value="immediate">Immediate</option>
                        <option value="daily">Daily Digest</option>
                        <option value="weekly">Weekly Summary</option>
                        <option value="never">Never</option>
                      </select>
                    </div>

                    {/* Channels */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Channels
                      </label>
                      <div className="space-y-2">
                        <label className="flex items-center">
                          <input
                            id={`inApp-${category}`}
                            name={`inApp-${category}`}
                            type="checkbox"
                            checked={categorySettings.channels?.inApp || false}
                            onChange={(e) => handleSettingChange(`categories.${category}.channels.inApp`, e.target.checked)}
                            className="mr-2 rounded border-gray-300"
                          />
                          <Bell size={16} className="mr-2 text-gray-500" />
                          <span className="text-sm">In-app</span>
                        </label>
                        <label className="flex items-center">
                          <input
                            id={`email-${category}`}
                            name={`email-${category}`}
                            type="checkbox"
                            checked={categorySettings.channels?.email || false}
                            onChange={(e) => handleSettingChange(`categories.${category}.channels.email`, e.target.checked)}
                            className="mr-2 rounded border-gray-300"
                          />
                          <Mail size={16} className="mr-2 text-gray-500" />
                          <span className="text-sm">Email</span>
                        </label>
                        <label className="flex items-center">
                          <input
                            id={`push-${category}`}
                            name={`push-${category}`}
                            type="checkbox"
                            checked={categorySettings.channels?.push || false}
                            onChange={(e) => handleSettingChange(`categories.${category}.channels.push`, e.target.checked)}
                            className="mr-2 rounded border-gray-300"
                          />
                          <Smartphone size={16} className="mr-2 text-gray-500" />
                          <span className="text-sm">Push</span>
                        </label>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Do Not Disturb */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="font-semibold text-lg mb-4 flex items-center">
            <Clock className="mr-2" size={20} />
            Do Not Disturb
          </h3>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Enable Do Not Disturb</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Pause notifications during quiet hours
                </p>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={settings.doNotDisturb?.enabled || false}
                onClick={() => handleSettingChange('doNotDisturb.enabled', !(settings.doNotDisturb?.enabled || false))}
                className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                  settings.doNotDisturb?.enabled ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    settings.doNotDisturb?.enabled ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {settings.doNotDisturb?.enabled && (
              <div className="ml-6 grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Start Time
                  </label>
                  <input
                    id="doNotDisturb-startTime"
                    name="doNotDisturb-startTime"
                    type="time"
                    value={settings.doNotDisturb.startTime || '22:00'}
                    onChange={(e) => handleSettingChange('doNotDisturb.startTime', e.target.value)}
                    className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    End Time
                  </label>
                  <input
                    id="doNotDisturb-endTime"
                    name="doNotDisturb-endTime"
                    type="time"
                    value={settings.doNotDisturb.endTime || '07:00'}
                    onChange={(e) => handleSettingChange('doNotDisturb.endTime', e.target.value)}
                    className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Summary */}
        {hasChanges && (
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <div className="flex items-center">
              <AlertCircle size={20} className="text-blue-600 dark:text-blue-400 mr-2" />
              <div>
                <h4 className="font-medium text-blue-800 dark:text-blue-200">Unsaved Changes</h4>
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  You have unsaved changes to your notification settings.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}