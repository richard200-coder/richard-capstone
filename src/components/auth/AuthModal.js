import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';
import './AuthModal.css';

const AuthModal = ({ isOpen, onClose }) => {
  const [isLogin, setIsLogin] = useState(true);

  const switchToRegister = () => {
    setIsLogin(false);
    // Clear any form data when switching
    setTimeout(() => {
      const forms = document.querySelectorAll('form');
      forms.forEach(form => form.reset());
    }, 100);
  };
  
  const switchToLogin = () => {
    setIsLogin(true);
    // Clear any form data when switching
    setTimeout(() => {
      const forms = document.querySelectorAll('form');
      forms.forEach(form => form.reset());
    }, 100);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="auth-modal-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="auth-modal-content"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
        >
          <button className="close-btn" onClick={onClose}>
            ×
          </button>
          
          <motion.div
            key={isLogin ? 'login' : 'register'}
            initial={{ x: isLogin ? -20 : 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: isLogin ? 20 : -20, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {isLogin ? (
              <LoginForm onSwitchToRegister={switchToRegister} />
            ) : (
              <RegisterForm onSwitchToLogin={switchToLogin} />
            )}
          </motion.div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default AuthModal;
