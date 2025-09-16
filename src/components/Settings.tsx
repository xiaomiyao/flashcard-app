import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface SettingsProps {
  onClose?: () => void;
}

interface SettingsData {
  theme: 'light' | 'dark' | 'auto';
  studyMode: {
    timerEnabled: boolean;
    timerDuration: number; // in minutes
    shuffleCards: boolean;
    showDifficultyButtons: boolean;
    autoAdvance: boolean;
  };
  notifications: {
    studyReminders: boolean;
    achievementAlerts: boolean;
    soundEnabled: boolean;
    vibrationEnabled: boolean;
  };
  data: {
    autoSave: boolean;
    exportFormat: 'json' | 'csv';
    backupFrequency: 'daily' | 'weekly' | 'monthly' | 'never';
  };
  accessibility: {
    fontSize: 'small' | 'medium' | 'large';
    highContrast: boolean;
    reducedMotion: boolean;
    screenReader: boolean;
  };
}

const Settings: React.FC<SettingsProps> = ({ onClose }) => {
  const [settings, setSettings] = useState<SettingsData>({
    theme: 'light',
    studyMode: {
      timerEnabled: false,
      timerDuration: 15,
      shuffleCards: false,
      showDifficultyButtons: true,
      autoAdvance: false
    },
    notifications: {
      studyReminders: true,
      achievementAlerts: true,
      soundEnabled: true,
      vibrationEnabled: false
    },
    data: {
      autoSave: true,
      exportFormat: 'json',
      backupFrequency: 'weekly'
    },
    accessibility: {
      fontSize: 'medium',
      highContrast: false,
      reducedMotion: false,
      screenReader: false
    }
  });

  const [activeTab, setActiveTab] = useState<'general' | 'study' | 'notifications' | 'data' | 'accessibility'>('general');
  const [isSaving, setIsSaving] = useState(false);

  // Load settings from localStorage on component mount
  useEffect(() => {
    const savedSettings = localStorage.getItem('flashcard-settings');
    if (savedSettings) {
      try {
        const parsedSettings = JSON.parse(savedSettings);
        setSettings(prev => ({ ...prev, ...parsedSettings }));
      } catch (error) {
        console.error('Error loading settings:', error);
      }
    }
  }, []);

  // Save settings to localStorage whenever settings change
  useEffect(() => {
    localStorage.setItem('flashcard-settings', JSON.stringify(settings));
  }, [settings]);

  const handleSettingChange = (section: keyof SettingsData, key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...(prev[section] as any),
        [key]: value
      }
    }));
  };

  const handleExportData = () => {
    try {
      const flashcards = JSON.parse(localStorage.getItem('flashcard-feedback') || '[]');
      const users = JSON.parse(localStorage.getItem('flashcard-users') || '[]');
      const feedback = JSON.parse(localStorage.getItem('flashcard-feedback') || '[]');
      
      const exportData = {
        flashcards,
        users,
        feedback,
        settings,
        exportDate: new Date().toISOString()
      };

      const dataStr = JSON.stringify(exportData, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `flashcard-backup-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error exporting data:', error);
    }
  };

  const handleImportData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string);
        
        if (data.flashcards) localStorage.setItem('flashcard-feedback', JSON.stringify(data.flashcards));
        if (data.users) localStorage.setItem('flashcard-users', JSON.stringify(data.users));
        if (data.feedback) localStorage.setItem('flashcard-feedback', JSON.stringify(data.feedback));
        if (data.settings) setSettings(prev => ({ ...prev, ...data.settings }));
        
        alert('Data imported successfully!');
      } catch (error) {
        alert('Error importing data. Please check the file format.');
      }
    };
    reader.readAsText(file);
  };

  const handleClearData = () => {
    if (window.confirm('Are you sure you want to clear all data? This action cannot be undone.')) {
      localStorage.removeItem('flashcard-feedback');
      localStorage.removeItem('flashcard-users');
      localStorage.removeItem('flashcard-current-user');
      alert('All data has been cleared.');
    }
  };

  const handleResetSettings = () => {
    if (window.confirm('Are you sure you want to reset all settings to default?')) {
      setSettings({
        theme: 'light',
        studyMode: {
          timerEnabled: false,
          timerDuration: 15,
          shuffleCards: false,
          showDifficultyButtons: true,
          autoAdvance: false
        },
        notifications: {
          studyReminders: true,
          achievementAlerts: true,
          soundEnabled: true,
          vibrationEnabled: false
        },
        data: {
          autoSave: true,
          exportFormat: 'json',
          backupFrequency: 'weekly'
        },
        accessibility: {
          fontSize: 'medium',
          highContrast: false,
          reducedMotion: false,
          screenReader: false
        }
      });
    }
  };

  const tabs = [
    { id: 'general', label: 'General', icon: '⚙️' },
    { id: 'study', label: 'Study', icon: '📚' },
    { id: 'notifications', label: 'Notifications', icon: '🔔' },
    { id: 'data', label: 'Data', icon: '💾' },
    { id: 'accessibility', label: 'Accessibility', icon: '♿' }
  ] as const;

  const renderGeneralSettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Appearance</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Theme</label>
            <select
              value={settings.theme}
              onChange={(e) => handleSettingChange('theme', 'theme', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="light">Light</option>
              <option value="dark">Dark</option>
              <option value="auto">Auto (System)</option>
            </select>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">App Information</h3>
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium text-gray-700">Version:</span>
              <span className="ml-2 text-gray-600">1.0.0</span>
            </div>
            <div>
              <span className="font-medium text-gray-700">Last Updated:</span>
              <span className="ml-2 text-gray-600">Today</span>
            </div>
            <div>
              <span className="font-medium text-gray-700">Storage Used:</span>
              <span className="ml-2 text-gray-600">2.3 MB</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderStudySettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Study Preferences</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-gray-700">Enable Timer</label>
              <p className="text-xs text-gray-500">Add time pressure to study sessions</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.studyMode.timerEnabled}
                onChange={(e) => handleSettingChange('studyMode', 'timerEnabled', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          {settings.studyMode.timerEnabled && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Timer Duration (minutes)</label>
              <input
                type="number"
                min="1"
                max="60"
                value={settings.studyMode.timerDuration}
                onChange={(e) => handleSettingChange('studyMode', 'timerDuration', parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          )}

          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-gray-700">Shuffle Cards</label>
              <p className="text-xs text-gray-500">Randomize card order each session</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.studyMode.shuffleCards}
                onChange={(e) => handleSettingChange('studyMode', 'shuffleCards', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-gray-700">Show Difficulty Buttons</label>
              <p className="text-xs text-gray-500">Display Easy/Medium/Hard rating buttons</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.studyMode.showDifficultyButtons}
                onChange={(e) => handleSettingChange('studyMode', 'showDifficultyButtons', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-gray-700">Auto Advance</label>
              <p className="text-xs text-gray-500">Automatically move to next card after rating</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.studyMode.autoAdvance}
                onChange={(e) => handleSettingChange('studyMode', 'autoAdvance', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </div>
      </div>
    </div>
  );

  const renderNotificationSettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Notifications</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-gray-700">Study Reminders</label>
              <p className="text-xs text-gray-500">Get reminded to study regularly</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.notifications.studyReminders}
                onChange={(e) => handleSettingChange('notifications', 'studyReminders', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-gray-700">Achievement Alerts</label>
              <p className="text-xs text-gray-500">Celebrate your learning milestones</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.notifications.achievementAlerts}
                onChange={(e) => handleSettingChange('notifications', 'achievementAlerts', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-gray-700">Sound Effects</label>
              <p className="text-xs text-gray-500">Play sounds for interactions</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.notifications.soundEnabled}
                onChange={(e) => handleSettingChange('notifications', 'soundEnabled', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </div>
      </div>
    </div>
  );

  const renderDataSettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Data Management</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-gray-700">Auto Save</label>
              <p className="text-xs text-gray-500">Automatically save progress</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.data.autoSave}
                onChange={(e) => handleSettingChange('data', 'autoSave', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Export Format</label>
            <select
              value={settings.data.exportFormat}
              onChange={(e) => handleSettingChange('data', 'exportFormat', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="json">JSON</option>
              <option value="csv">CSV</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Backup Frequency</label>
            <select
              value={settings.data.backupFrequency}
              onChange={(e) => handleSettingChange('data', 'backupFrequency', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
              <option value="never">Never</option>
            </select>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Data Actions</h3>
        <div className="space-y-3">
          <button
            onClick={handleExportData}
            className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Export All Data
          </button>
          
          <label className="w-full px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 cursor-pointer text-center block">
            Import Data
            <input
              type="file"
              accept=".json"
              onChange={handleImportData}
              className="hidden"
            />
          </label>
          
          <button
            onClick={handleClearData}
            className="w-full px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
          >
            Clear All Data
          </button>
        </div>
      </div>
    </div>
  );

  const renderAccessibilitySettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Accessibility</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Font Size</label>
            <select
              value={settings.accessibility.fontSize}
              onChange={(e) => handleSettingChange('accessibility', 'fontSize', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="small">Small</option>
              <option value="medium">Medium</option>
              <option value="large">Large</option>
            </select>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-gray-700">High Contrast</label>
              <p className="text-xs text-gray-500">Increase color contrast for better visibility</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.accessibility.highContrast}
                onChange={(e) => handleSettingChange('accessibility', 'highContrast', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-gray-700">Reduced Motion</label>
              <p className="text-xs text-gray-500">Minimize animations and transitions</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.accessibility.reducedMotion}
                onChange={(e) => handleSettingChange('accessibility', 'reducedMotion', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-gray-700">Screen Reader Support</label>
              <p className="text-xs text-gray-500">Optimize for screen readers</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.accessibility.screenReader}
                onChange={(e) => handleSettingChange('accessibility', 'screenReader', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </div>
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'general':
        return renderGeneralSettings();
      case 'study':
        return renderStudySettings();
      case 'notifications':
        return renderNotificationSettings();
      case 'data':
        return renderDataSettings();
      case 'accessibility':
        return renderAccessibilitySettings();
      default:
        return renderGeneralSettings();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-white rounded-2xl shadow-lg max-w-4xl mx-auto max-h-[90vh] overflow-hidden flex flex-col"
    >
      <div className="flex justify-between items-center p-6 border-b border-gray-200">
        <h2 className="text-2xl font-bold text-gray-900">Settings</h2>
        {onClose && (
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div className="w-64 bg-gray-50 border-r border-gray-200 p-4">
          <nav className="space-y-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                <span className="text-lg">{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="flex-1 p-6 overflow-y-auto">
          {renderTabContent()}
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-gray-200 p-6 bg-gray-50">
        <div className="flex justify-between items-center">
          <button
            onClick={handleResetSettings}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            Reset to Defaults
          </button>
          <div className="text-sm text-gray-500">
            Settings are automatically saved
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Settings;
