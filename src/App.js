import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { motion } from 'framer-motion';
import './App.css';

// Context
import { AuthProvider, useAuth } from './contexts/AuthContext';

// Components
import Header from './components/Header';
import Home from './components/Home';
import Subjects from './components/Subjects';
import MathGame from './components/games/MathGame';
import FilipinoGame from './components/games/FilipinoGame';
import EnglishGame from './components/games/EnglishGame';
import Quiz from './components/Quiz';
import Progress from './components/Progress';
import Footer from './components/Footer';
import AuthModal from './components/auth/AuthModal';
import AdminDashboard from './components/admin/AdminDashboard';
import ProtectedRoute from './components/ProtectedRoute';
import PWAInstaller from './components/PWAInstaller';

// PWA Utils
import pwaManager from './utils/pwa';

const AppContent = () => {
  const { user, loading, showAuthModal, setShowAuthModal } = useAuth();

  // Initialize PWA features
  useEffect(() => {
    // PWA manager is already initialized in the utils file
    console.log('PWA Manager initialized');
  }, []);

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading LearnPlay...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="App">
      <AuthModal 
        isOpen={showAuthModal && !user} 
        onClose={() => {}} // Prevent closing - user must authenticate
      />
      
      {/* PWA Installer */}
      <PWAInstaller />
      
      {user && (
        <>
          <Header />
          <motion.main
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/subjects" element={<Subjects />} />
              <Route path="/math-game" element={<MathGame />} />
              <Route path="/filipino-game" element={<FilipinoGame />} />
              <Route path="/english-game" element={<EnglishGame />} />
              <Route path="/quiz" element={<Quiz />} />
              <Route path="/progress" element={<Progress />} />
              <Route 
                path="/admin" 
                element={
                  <ProtectedRoute requiredRole="admin">
                    <AdminDashboard />
                  </ProtectedRoute>
                } 
              />
            </Routes>
          </motion.main>
          <Footer />
        </>
      )}
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

export default App;
