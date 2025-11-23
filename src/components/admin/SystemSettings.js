import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import './SystemSettings.css';

const SystemSettings = () => {
  const [settings, setSettings] = useState({
    siteName: 'LearnPlay',
    siteDescription: 'Interactive E-Learning Platform for Lambajon Elementary School',
    maintenanceMode: false,
    allowRegistration: true,
    maxUsers: 1000,
    sessionTimeout: 30,
    emailNotifications: true,
    gameDifficulty: 'medium',
    quizTimeLimit: 15,
    theme: 'default',
    language: 'en',
    // Security settings
    passwordRequirements: 'medium',
    loginAttemptsLimit: 5,
    lockoutDuration: 15,
    twoFactorAuth: true,
    logActivities: true,
    // Appearance settings
    primaryColor: '#667eea',
    secondaryColor: '#764ba2',
    // Notification settings
    notifyNewUsers: true,
    notifyErrors: true,
    weeklyReports: false,
    smtpServer: 'smtp.gmail.com',
    adminEmail: 'admin@learnplay.com',
    // Game settings
    maxQuestionsPerQuiz: 20,
    passingScore: 70,
    allowRetakes: true,
    showCorrectAnswers: true
  });

  const [activeTab, setActiveTab] = useState('general');
  const [hasChanges, setHasChanges] = useState(false);
  const [saving, setSaving] = useState(false);

  // Load settings from localStorage on component mount
  useEffect(() => {
    const savedSettings = localStorage.getItem('learnplay-settings');
    if (savedSettings) {
      try {
        const parsedSettings = JSON.parse(savedSettings);
        setSettings(prev => ({ ...prev, ...parsedSettings }));
      } catch (error) {
        console.error('Error loading settings:', error);
      }
    }
  }, []);

  const handleSettingChange = (key, value) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
    setHasChanges(true);
  };

  const handleSaveSettings = async () => {
    setSaving(true);
    try {
      // Save to localStorage (in a real app, this would be sent to backend)
      localStorage.setItem('learnplay-settings', JSON.stringify(settings));
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setHasChanges(false);
      alert('Settings saved successfully!');
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('Error saving settings. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleResetSettings = () => {
    if (window.confirm('Are you sure you want to reset all settings to default values?')) {
      const defaultSettings = {
        siteName: 'LearnPlay',
        siteDescription: 'Interactive E-Learning Platform for Lambajon Elementary School',
        maintenanceMode: false,
        allowRegistration: true,
        maxUsers: 1000,
        sessionTimeout: 30,
        emailNotifications: true,
        gameDifficulty: 'medium',
        quizTimeLimit: 15,
        theme: 'default',
        language: 'en',
        passwordRequirements: 'medium',
        loginAttemptsLimit: 5,
        lockoutDuration: 15,
        twoFactorAuth: true,
        logActivities: true,
        primaryColor: '#667eea',
        secondaryColor: '#764ba2',
        notifyNewUsers: true,
        notifyErrors: true,
        weeklyReports: false,
        smtpServer: 'smtp.gmail.com',
        adminEmail: 'admin@learnplay.com',
        maxQuestionsPerQuiz: 20,
        passingScore: 70,
        allowRetakes: true,
        showCorrectAnswers: true
      };
      setSettings(defaultSettings);
      setHasChanges(true);
    }
  };

  const tabs = [
    { id: 'general', label: 'General', icon: '⚙️' },
    { id: 'security', label: 'Security', icon: '🔒' },
    { id: 'appearance', label: 'Appearance', icon: '🎨' },
    { id: 'notifications', label: 'Notifications', icon: '🔔' },
    { id: 'games', label: 'Games & Quizzes', icon: '🎮' }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'general':
        return <GeneralSettings settings={settings} onChange={handleSettingChange} />;
      case 'security':
        return <SecuritySettings settings={settings} onChange={handleSettingChange} />;
      case 'appearance':
        return <AppearanceSettings settings={settings} onChange={handleSettingChange} />;
      case 'notifications':
        return <NotificationSettings settings={settings} onChange={handleSettingChange} />;
      case 'games':
        return <GameSettings settings={settings} onChange={handleSettingChange} />;
      default:
        return <GeneralSettings settings={settings} onChange={handleSettingChange} />;
    }
  };

  return (
    <div className="system-settings">
      <div className="settings-header">
        <h2>System Settings</h2>
        <div className="header-actions">
          <button 
            className="reset-btn" 
            onClick={handleResetSettings}
            disabled={saving}
          >
            🔄 Reset
          </button>
          <button 
            className={`save-btn ${hasChanges ? 'has-changes' : ''}`} 
            onClick={handleSaveSettings}
            disabled={saving || !hasChanges}
          >
            {saving ? '💾 Saving...' : '💾 Save Settings'}
          </button>
        </div>
      </div>

      <div className="settings-layout">
        <nav className="settings-nav">
          <ul>
            {tabs.map(tab => (
              <li key={tab.id}>
                <button
                  className={`nav-tab ${activeTab === tab.id ? 'active' : ''}`}
                  onClick={() => setActiveTab(tab.id)}
                >
                  <span className="tab-icon">{tab.icon}</span>
                  <span className="tab-label">{tab.label}</span>
                </button>
              </li>
            ))}
          </ul>
        </nav>

        <main className="settings-content">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            {renderTabContent()}
          </motion.div>
        </main>
      </div>
    </div>
  );
};

const GeneralSettings = ({ settings, onChange }) => (
  <div className="settings-section">
    <h3>General Settings</h3>
    <div className="settings-grid">
      <div className="setting-item">
        <label>Site Name</label>
        <input
          type="text"
          value={settings.siteName}
          onChange={(e) => onChange('siteName', e.target.value)}
          placeholder="Enter site name"
        />
      </div>
      
      <div className="setting-item">
        <label>Site Description</label>
        <textarea
          value={settings.siteDescription}
          onChange={(e) => onChange('siteDescription', e.target.value)}
          placeholder="Enter site description"
          rows="3"
        />
      </div>
      
      <div className="setting-item">
        <label>Maximum Users</label>
        <input
          type="number"
          value={settings.maxUsers}
          onChange={(e) => onChange('maxUsers', parseInt(e.target.value))}
          min="1"
          max="10000"
        />
      </div>
      
      <div className="setting-item">
        <label>Session Timeout (minutes)</label>
        <input
          type="number"
          value={settings.sessionTimeout}
          onChange={(e) => onChange('sessionTimeout', parseInt(e.target.value))}
          min="5"
          max="120"
        />
      </div>
      
      <div className="setting-item checkbox-item">
        <label className="checkbox-label">
          <input
            type="checkbox"
            checked={settings.allowRegistration}
            onChange={(e) => onChange('allowRegistration', e.target.checked)}
          />
          <span className="checkmark"></span>
          Allow new user registration
        </label>
      </div>
      
      <div className="setting-item checkbox-item">
        <label className="checkbox-label">
          <input
            type="checkbox"
            checked={settings.maintenanceMode}
            onChange={(e) => onChange('maintenanceMode', e.target.checked)}
          />
          <span className="checkmark"></span>
          Maintenance mode
        </label>
      </div>
    </div>
  </div>
);

const SecuritySettings = ({ settings, onChange }) => (
  <div className="settings-section">
    <h3>Security Settings</h3>
    <div className="settings-grid">
      <div className="setting-item">
        <label>Password Requirements</label>
        <select
          value={settings.passwordRequirements}
          onChange={(e) => onChange('passwordRequirements', e.target.value)}
        >
          <option value="easy">Minimum 6 characters</option>
          <option value="medium">Minimum 8 characters</option>
          <option value="strong">Strong password (8+ chars, numbers, symbols)</option>
        </select>
      </div>
      
      <div className="setting-item">
        <label>Login Attempts Limit</label>
        <input
          type="number"
          value={settings.loginAttemptsLimit}
          onChange={(e) => onChange('loginAttemptsLimit', parseInt(e.target.value))}
          min="3"
          max="10"
        />
      </div>
      
      <div className="setting-item">
        <label>Account Lockout Duration (minutes)</label>
        <input
          type="number"
          value={settings.lockoutDuration}
          onChange={(e) => onChange('lockoutDuration', parseInt(e.target.value))}
          min="5"
          max="60"
        />
      </div>
      
      <div className="setting-item checkbox-item">
        <label className="checkbox-label">
          <input 
            type="checkbox" 
            checked={settings.twoFactorAuth}
            onChange={(e) => onChange('twoFactorAuth', e.target.checked)}
          />
          <span className="checkmark"></span>
          Enable two-factor authentication
        </label>
      </div>
      
      <div className="setting-item checkbox-item">
        <label className="checkbox-label">
          <input 
            type="checkbox" 
            checked={settings.logActivities}
            onChange={(e) => onChange('logActivities', e.target.checked)}
          />
          <span className="checkmark"></span>
          Log all user activities
        </label>
      </div>
    </div>
  </div>
);

const AppearanceSettings = ({ settings, onChange }) => (
  <div className="settings-section">
    <h3>Appearance Settings</h3>
    <div className="settings-grid">
      <div className="setting-item">
        <label>Theme</label>
        <select
          value={settings.theme}
          onChange={(e) => onChange('theme', e.target.value)}
        >
          <option value="default">Default</option>
          <option value="dark">Dark Mode</option>
          <option value="colorful">Colorful</option>
          <option value="minimal">Minimal</option>
        </select>
      </div>
      
      <div className="setting-item">
        <label>Primary Color</label>
        <input
          type="color"
          value={settings.primaryColor}
          onChange={(e) => onChange('primaryColor', e.target.value)}
        />
      </div>
      
      <div className="setting-item">
        <label>Secondary Color</label>
        <input
          type="color"
          value={settings.secondaryColor}
          onChange={(e) => onChange('secondaryColor', e.target.value)}
        />
      </div>
      
      <div className="setting-item">
        <label>Language</label>
        <select
          value={settings.language}
          onChange={(e) => onChange('language', e.target.value)}
        >
          <option value="en">English</option>
          <option value="fil">Filipino</option>
          <option value="es">Spanish</option>
        </select>
      </div>
      
      <div className="setting-item">
        <label>Logo Upload</label>
        <input
          type="file"
          accept="image/*"
        />
      </div>
    </div>
  </div>
);

const NotificationSettings = ({ settings, onChange }) => (
  <div className="settings-section">
    <h3>Notification Settings</h3>
    <div className="settings-grid">
      <div className="setting-item checkbox-item">
        <label className="checkbox-label">
          <input
            type="checkbox"
            checked={settings.emailNotifications}
            onChange={(e) => onChange('emailNotifications', e.target.checked)}
          />
          <span className="checkmark"></span>
          Enable email notifications
        </label>
      </div>
      
      <div className="setting-item checkbox-item">
        <label className="checkbox-label">
          <input 
            type="checkbox" 
            checked={settings.notifyNewUsers}
            onChange={(e) => onChange('notifyNewUsers', e.target.checked)}
          />
          <span className="checkmark"></span>
          Notify on new user registration
        </label>
      </div>
      
      <div className="setting-item checkbox-item">
        <label className="checkbox-label">
          <input 
            type="checkbox" 
            checked={settings.notifyErrors}
            onChange={(e) => onChange('notifyErrors', e.target.checked)}
          />
          <span className="checkmark"></span>
          Notify on system errors
        </label>
      </div>
      
      <div className="setting-item checkbox-item">
        <label className="checkbox-label">
          <input 
            type="checkbox" 
            checked={settings.weeklyReports}
            onChange={(e) => onChange('weeklyReports', e.target.checked)}
          />
          <span className="checkmark"></span>
          Weekly usage reports
        </label>
      </div>
      
      <div className="setting-item">
        <label>SMTP Server</label>
        <input
          type="text"
          value={settings.smtpServer}
          onChange={(e) => onChange('smtpServer', e.target.value)}
          placeholder="smtp.gmail.com"
        />
      </div>
      
      <div className="setting-item">
        <label>Email Address</label>
        <input
          type="email"
          value={settings.adminEmail}
          onChange={(e) => onChange('adminEmail', e.target.value)}
          placeholder="admin@learnplay.com"
        />
      </div>
    </div>
  </div>
);

const GameSettings = ({ settings, onChange }) => (
  <div className="settings-section">
    <h3>Games & Quizzes Settings</h3>
    <div className="settings-grid">
      <div className="setting-item">
        <label>Default Game Difficulty</label>
        <select
          value={settings.gameDifficulty}
          onChange={(e) => onChange('gameDifficulty', e.target.value)}
        >
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
        </select>
      </div>
      
      <div className="setting-item">
        <label>Quiz Time Limit (minutes)</label>
        <input
          type="number"
          value={settings.quizTimeLimit}
          onChange={(e) => onChange('quizTimeLimit', parseInt(e.target.value))}
          min="5"
          max="60"
        />
      </div>
      
      <div className="setting-item">
        <label>Maximum Questions per Quiz</label>
        <input
          type="number"
          value={settings.maxQuestionsPerQuiz}
          onChange={(e) => onChange('maxQuestionsPerQuiz', parseInt(e.target.value))}
          min="5"
          max="50"
        />
      </div>
      
      <div className="setting-item">
        <label>Passing Score (%)</label>
        <input
          type="number"
          value={settings.passingScore}
          onChange={(e) => onChange('passingScore', parseInt(e.target.value))}
          min="50"
          max="100"
        />
      </div>
      
      <div className="setting-item checkbox-item">
        <label className="checkbox-label">
          <input 
            type="checkbox" 
            checked={settings.allowRetakes}
            onChange={(e) => onChange('allowRetakes', e.target.checked)}
          />
          <span className="checkmark"></span>
          Allow quiz retakes
        </label>
      </div>
      
      <div className="setting-item checkbox-item">
        <label className="checkbox-label">
          <input 
            type="checkbox" 
            checked={settings.showCorrectAnswers}
            onChange={(e) => onChange('showCorrectAnswers', e.target.checked)}
          />
          <span className="checkmark"></span>
          Show correct answers after quiz
        </label>
      </div>
    </div>
  </div>
);

export default SystemSettings;
