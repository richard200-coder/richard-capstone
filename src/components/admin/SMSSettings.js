import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { smsAPI } from '../../services/api';
import './SMSSettings.css';

const SMSSettings = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [smsSettings, setSmsSettings] = useState({
    parentPhone: '',
    parentName: '',
    smsEnabled: false
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [testPhone, setTestPhone] = useState('');
  const [testMessage, setTestMessage] = useState('Test message from LearnPlay SMS service');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/auth/users', {
        credentials: 'include'
      });
      const data = await response.json();
      
      if (response.ok) {
        setUsers(data.users || []);
      } else {
        console.error('Failed to fetch users:', data.message);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUserSelect = async (userId) => {
    try {
      setLoading(true);
      const response = await smsAPI.getSMSSettings(userId);
      const data = await response.json();
      
      if (response.ok) {
        setSelectedUser(userId);
        setSmsSettings(data.smsSettings);
      } else {
        setMessage(`Error: ${data.message}`);
      }
    } catch (error) {
      setMessage(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveSettings = async () => {
    if (!selectedUser) {
      setMessage('Please select a user first');
      return;
    }

    try {
      setLoading(true);
      const response = await smsAPI.updateSMSSettings(selectedUser, smsSettings);
      const data = await response.json();
      
      if (response.ok) {
        setMessage('SMS settings updated successfully!');
        // Refresh users list to show updated data
        fetchUsers();
      } else {
        setMessage(`Error: ${data.message}`);
      }
    } catch (error) {
      setMessage(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleSendTestSMS = async () => {
    if (!testPhone.trim()) {
      setMessage('Please enter a phone number');
      return;
    }

    try {
      setLoading(true);
      const response = await smsAPI.sendTestSMS(testPhone, testMessage);
      const data = await response.json();
      
      if (response.ok) {
        setMessage('Test SMS sent successfully!');
      } else {
        setMessage(`Error: ${data.message}`);
      }
    } catch (error) {
      setMessage(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setSmsSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="sms-settings">
      <div className="sms-header">
        <h2>SMS Settings</h2>
        <p>Configure SMS notifications for student progress reports</p>
      </div>

      {message && (
        <motion.div
          className={`message ${message.includes('Error') ? 'error' : 'success'}`}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {message}
        </motion.div>
      )}

      <div className="sms-content">
        {/* Test SMS Section */}
        <motion.div
          className="sms-card test-sms"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <h3>Test SMS Service</h3>
          <div className="test-form">
            <div className="form-group">
              <label>Phone Number:</label>
              <input
                type="tel"
                value={testPhone}
                onChange={(e) => setTestPhone(e.target.value)}
                placeholder="e.g., 09123456789 or +639123456789"
                className="phone-input"
              />
            </div>
            <div className="form-group">
              <label>Test Message:</label>
              <textarea
                value={testMessage}
                onChange={(e) => setTestMessage(e.target.value)}
                rows="3"
                className="message-input"
              />
            </div>
            <button
              onClick={handleSendTestSMS}
              disabled={loading || !testPhone.trim()}
              className="test-btn"
            >
              {loading ? 'Sending...' : 'Send Test SMS'}
            </button>
          </div>
        </motion.div>

        {/* User SMS Settings */}
        <motion.div
          className="sms-card user-settings"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h3>User SMS Settings</h3>
          
          <div className="user-selector">
            <label>Select Student:</label>
            <select
              value={selectedUser || ''}
              onChange={(e) => handleUserSelect(e.target.value)}
              className="user-select"
            >
              <option value="">Choose a student...</option>
              {users
                .filter(user => user.role === 'student')
                .map(user => (
                  <option key={user._id} value={user._id}>
                    {user.name} ({user.email})
                  </option>
                ))}
            </select>
          </div>

          {selectedUser && (
            <div className="settings-form">
              <div className="form-group">
                <label>Parent Name:</label>
                <input
                  type="text"
                  value={smsSettings.parentName}
                  onChange={(e) => handleInputChange('parentName', e.target.value)}
                  placeholder="Enter parent's name"
                  className="text-input"
                />
              </div>

              <div className="form-group">
                <label>Parent Phone Number:</label>
                <input
                  type="tel"
                  value={smsSettings.parentPhone}
                  onChange={(e) => handleInputChange('parentPhone', e.target.value)}
                  placeholder="e.g., 09123456789"
                  className="phone-input"
                />
                <small>Include country code (e.g., +63 for Philippines)</small>
              </div>

              <div className="form-group checkbox-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={smsSettings.smsEnabled}
                    onChange={(e) => handleInputChange('smsEnabled', e.target.checked)}
                    className="checkbox-input"
                  />
                  <span className="checkbox-text">Enable SMS notifications</span>
                </label>
                <small>When enabled, parents will receive SMS notifications about their child's progress</small>
              </div>

              <button
                onClick={handleSaveSettings}
                disabled={loading}
                className="save-btn"
              >
                {loading ? 'Saving...' : 'Save Settings'}
              </button>
            </div>
          )}
        </motion.div>

        {/* SMS Information */}
        <motion.div
          className="sms-card info-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h3>📱 SMS Service Information</h3>
          <div className="info-content">
            <div className="info-item">
              <strong>Service Provider:</strong> Twilio
            </div>
            <div className="info-item">
              <strong>Supported Countries:</strong> Global (with proper country codes)
            </div>
            <div className="info-item">
              <strong>Message Types:</strong>
              <ul>
                <li>Individual progress reports after quiz completion</li>
                <li>Weekly progress summaries</li>
                <li>Custom test messages</li>
              </ul>
            </div>
            <div className="info-item">
              <strong>Phone Number Format:</strong>
              <ul>
                <li>Philippines: +639123456789 or 09123456789</li>
                <li>Other countries: Include country code (e.g., +1234567890)</li>
              </ul>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default SMSSettings;
