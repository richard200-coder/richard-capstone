import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { authAPI } from '../services/api';
import './ProfileModal.css';

const ProfileModal = ({ onClose }) => {
  const { user, checkAuthStatus } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [avatarUrl, setAvatarUrl] = useState(user?.avatarUrl || '');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  const handleSave = async () => {
    try {
      setSaving(true);
      setMessage('');
      const response = await authAPI.updateMe({ name, avatarUrl });
      const data = await response.json();
      if (response.ok) {
        setMessage('Profile updated!');
        await checkAuthStatus();
        setTimeout(onClose, 800);
      } else {
        setMessage(data.message || 'Failed to update');
      }
    } catch (e) {
      setMessage('Failed to update');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="profile-overlay" onClick={onClose}>
      <motion.div
        className="profile-modal"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="profile-header">
          <h3>Edit Profile</h3>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <div className="profile-body">
          <div className="preview">
            <div className="avatar large">
              {avatarUrl ? <img src={avatarUrl} alt={name} /> : <span>{name?.charAt(0).toUpperCase()}</span>}
            </div>
          </div>

          <div className="form-group">
            <label>Name</label>
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" />
          </div>

          <div className="form-group">
            <label>Avatar URL</label>
            <input value={avatarUrl} onChange={(e) => setAvatarUrl(e.target.value)} placeholder="https://..." />
            <small>Paste a link to an image (PNG/JPG). You can use an uploaded image URL.</small>
          </div>

          {message && <div className="message">{message}</div>}
        </div>

        <div className="profile-actions">
          <button className="btn-secondary" onClick={onClose} disabled={saving}>Cancel</button>
          <button className="btn-primary" onClick={handleSave} disabled={saving}>{saving ? 'Saving...' : 'Save'}</button>
        </div>
      </motion.div>
    </div>
  );
};

export default ProfileModal;
