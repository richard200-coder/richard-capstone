import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import ProfileModal from './ProfileModal';
import './Header.css';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isGamesOpen, setIsGamesOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const location = useLocation();
  const { user, logout } = useAuth();
  const [showProfile, setShowProfile] = useState(false);
  const profileMenuRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
      if (!event.target.closest('.games-menu')) {
        setIsGamesOpen(false);
      }
    };

    if (isProfileOpen || isGamesOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [isProfileOpen, isGamesOpen]);

  const navItems = [
    { path: '/', label: 'Home', icon: '🏠' },
    { path: '/subjects', label: 'Subjects', icon: '📚' },
    { path: '/quiz', label: 'Quiz', icon: '❓' },
    { path: '/progress', label: 'Progress', icon: '📊' },
  ];

  const gameLinks = [
    { path: '/english-game', label: 'English Game', icon: '📝' },
    { path: '/filipino-game', label: 'Filipino Game', icon: '📖' },
    { path: '/math-game', label: 'Mathematics Game', icon: '🔢' }
  ];

  // Add admin link if user is admin
  if (user?.role === 'admin') {
    navItems.push({ path: '/admin', label: 'Teacher', icon: '⚙️' });
  }

  return (
    <motion.header 
      className="header"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="header-container">
        <Link to="/" className="logo">
          <motion.div 
            className="logo-icon"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            🎮
          </motion.div>
          <div className="logo-text">
            <h1>LearnPlay</h1>
            <p>Lambajon Elementary School</p>
          </div>
        </Link>

        <nav className={`nav ${isMenuOpen ? 'nav-open' : ''}`}>
          <ul className="nav-list">
            {navItems.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`nav-link ${location.pathname === item.path ? 'active' : ''}`}
                  onClick={() => {
                    setIsMenuOpen(false);
                    setIsGamesOpen(false);
                    setIsProfileOpen(false);
                  }}
                >
                  <span className="nav-icon">{item.icon}</span>
                  <span className="nav-label">{item.label}</span>
                </Link>
              </li>
            ))}
            <li className="games-menu">
              <button
                className={`nav-link games-toggle ${isGamesOpen ? 'active' : ''}`}
                onClick={() => {
                  setIsGamesOpen((prev) => !prev);
                  setIsProfileOpen(false);
                }}
                aria-expanded={isGamesOpen}
              >
                <span className="nav-icon">🎯</span>
                <span className="nav-label">Games</span>
                <span className="caret">{isGamesOpen ? '▲' : '▼'}</span>
              </button>
              <div className={`games-dropdown ${isGamesOpen ? 'open' : ''}`}>
                {gameLinks.map((game) => (
                  <Link
                    key={game.path}
                    to={game.path}
                    className={`game-link ${location.pathname === game.path ? 'active' : ''}`}
                    onClick={() => {
                      setIsGamesOpen(false);
                      setIsMenuOpen(false);
                    }}
                  >
                    <span className="game-icon">{game.icon}</span>
                    <div className="game-info">
                      <span className="game-label">{game.label}</span>
                      <span className="game-meta">Play & learn</span>
                    </div>
                  </Link>
                ))}
              </div>
            </li>
            {user && (
              <li className="user-menu" ref={profileMenuRef}>
                <button
                  className="profile-avatar-btn"
                  onClick={() => {
                    setIsProfileOpen((prev) => !prev);
                    setIsGamesOpen(false);
                  }}
                  aria-expanded={isProfileOpen}
                  title={user.name}
                >
                  <div className="avatar">
                    {user.avatarUrl ? (
                      <img src={user.avatarUrl} alt={user.name} />
                    ) : (
                      <span>{user.name?.charAt(0).toUpperCase()}</span>
                    )}
                  </div>
                </button>
                <div className={`profile-dropdown ${isProfileOpen ? 'open' : ''}`}>
                  <div className="profile-dropdown-header">
                    <div className="profile-dropdown-avatar">
                      {user.avatarUrl ? (
                        <img src={user.avatarUrl} alt={user.name} />
                      ) : (
                        <span>{user.name?.charAt(0).toUpperCase()}</span>
                      )}
                    </div>
                    <div className="profile-dropdown-info">
                      <div className="profile-dropdown-name">{user.name}</div>
                      <div className="profile-dropdown-role">{user.role === 'admin' ? 'Teacher' : user.role}</div>
                    </div>
                  </div>
                  <div className="profile-dropdown-divider"></div>
                  <button 
                    className="profile-dropdown-item"
                    onClick={() => {
                      setShowProfile(true);
                      setIsProfileOpen(false);
                    }}
                  >
                    <span className="profile-item-icon">✏️</span>
                    <span className="profile-item-label">Edit Profile</span>
                  </button>
                  <div className="profile-dropdown-divider"></div>
                  <button 
                    className="profile-dropdown-item logout-item"
                    onClick={() => {
                      setIsProfileOpen(false);
                      logout();
                    }}
                  >
                    <span className="profile-item-icon">🚪</span>
                    <span className="profile-item-label">Sign Out</span>
                  </button>
                </div>
              </li>
            )}
          </ul>
        </nav>

        <button
          className={`hamburger ${isMenuOpen ? 'open' : ''}`}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
      {showProfile && <ProfileModal onClose={() => setShowProfile(false)} />}
    </motion.header>
  );
};

export default Header;
