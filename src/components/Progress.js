import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import './Progress.css';

const Progress = () => {
  const [selectedSubject, setSelectedSubject] = useState('all');

  // Mock data - in a real app, this would come from a database
  const progressData = {
    math: {
      totalGames: 15,
      completedGames: 12,
      totalScore: 850,
      averageScore: 85,
      achievements: ['Math Master', 'Number Ninja', 'Shape Explorer'],
      recentActivity: [
        { game: 'Addition Adventure', score: 95, date: '2024-01-15' },
        { game: 'Subtraction Safari', score: 88, date: '2024-01-14' },
        { game: 'Shape Explorer', score: 92, date: '2024-01-13' }
      ]
    },
    filipino: {
      totalGames: 12,
      completedGames: 8,
      totalScore: 620,
      averageScore: 78,
      achievements: ['Filipino Learner', 'Salita Master'],
      recentActivity: [
        { game: 'Salita Master', score: 85, date: '2024-01-15' },
        { game: 'Kuwento Time', score: 78, date: '2024-01-14' },
        { game: 'Balarila Game', score: 82, date: '2024-01-12' }
      ]
    },
    english: {
      totalGames: 10,
      completedGames: 7,
      totalScore: 580,
      averageScore: 83,
      achievements: ['English Explorer', 'Word Wizard'],
      recentActivity: [
        { game: 'Word Wizard', score: 90, date: '2024-01-15' },
        { game: 'Grammar Guru', score: 76, date: '2024-01-14' },
        { game: 'Reading Champion', score: 88, date: '2024-01-13' }
      ]
    }
  };

  const overallStats = {
    totalGames: progressData.math.totalGames + progressData.filipino.totalGames + progressData.english.totalGames,
    completedGames: progressData.math.completedGames + progressData.filipino.completedGames + progressData.english.completedGames,
    totalScore: progressData.math.totalScore + progressData.filipino.totalScore + progressData.english.totalScore,
    averageScore: Math.round((progressData.math.averageScore + progressData.filipino.averageScore + progressData.english.averageScore) / 3)
  };

  const getProgressPercentage = (completed, total) => {
    return Math.round((completed / total) * 100);
  };

  const getProgressColor = (percentage) => {
    if (percentage >= 80) return '#28a745';
    if (percentage >= 60) return '#ffc107';
    if (percentage >= 40) return '#fd7e14';
    return '#dc3545';
  };

  const getLevel = (score) => {
    if (score >= 1000) return { level: 'Master', icon: '👑', color: '#FFD700' };
    if (score >= 750) return { level: 'Expert', icon: '⭐', color: '#FF6B6B' };
    if (score >= 500) return { level: 'Advanced', icon: '🚀', color: '#4ECDC4' };
    if (score >= 250) return { level: 'Intermediate', icon: '🌟', color: '#45B7D1' };
    return { level: 'Beginner', icon: '🌱', color: '#6c757d' };
  };

  const subjects = [
    { id: 'all', name: 'Overall Progress', icon: '📊', color: '#667eea' },
    { id: 'math', name: 'Mathematics', icon: '🔢', color: '#FF6B6B' },
    { id: 'filipino', name: 'Filipino', icon: '🇵🇭', color: '#4ECDC4' },
    { id: 'english', name: 'English', icon: '🇺🇸', color: '#45B7D1' }
  ];

  const getCurrentData = () => {
    if (selectedSubject === 'all') {
      return overallStats;
    }
    return progressData[selectedSubject];
  };

  const currentData = getCurrentData();
  const currentLevel = getLevel(currentData.totalScore || overallStats.totalScore);

  return (
    <div className="progress-page">
      <div className="container">
        {/* Header */}
        <motion.div 
          className="progress-header"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Link to="/" className="back-btn">
            ← Back to Home
          </Link>
          <h1 className="progress-title">Learning Progress</h1>
          <p className="progress-subtitle">
            Track your learning journey and celebrate your achievements!
          </p>
        </motion.div>

        {/* Subject Selector */}
        <motion.div 
          className="subject-selector"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="subjects-tabs">
            {subjects.map((subject) => (
              <button
                key={subject.id}
                className={`subject-tab ${selectedSubject === subject.id ? 'active' : ''}`}
                onClick={() => setSelectedSubject(subject.id)}
                style={{ 
                  '--tab-color': subject.color,
                  borderColor: selectedSubject === subject.id ? subject.color : 'transparent'
                }}
              >
                <span className="tab-icon">{subject.icon}</span>
                <span className="tab-name">{subject.name}</span>
              </button>
            ))}
          </div>
        </motion.div>

        {/* Progress Overview */}
        <motion.div 
          className="progress-overview"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <div className="overview-card">
            <div className="level-info">
              <div className="level-icon" style={{ color: currentLevel.color }}>
                {currentLevel.icon}
              </div>
              <div className="level-details">
                <h2 className="level-title">{currentLevel.level}</h2>
                <p className="level-description">Current Learning Level</p>
              </div>
            </div>
            
            <div className="stats-grid">
              <div className="stat-item">
                <div className="stat-value">
                  {selectedSubject === 'all' ? overallStats.totalScore : currentData.totalScore}
                </div>
                <div className="stat-label">Total Score</div>
              </div>
              <div className="stat-item">
                <div className="stat-value">
                  {selectedSubject === 'all' ? overallStats.averageScore : currentData.averageScore}%
                </div>
                <div className="stat-label">Average Score</div>
              </div>
              <div className="stat-item">
                <div className="stat-value">
                  {selectedSubject === 'all' ? overallStats.completedGames : currentData.completedGames}
                </div>
                <div className="stat-label">Games Completed</div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Progress Details */}
        <div className="progress-details">
          {/* Completion Progress */}
          <motion.div 
            className="progress-section"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <h3>Completion Progress</h3>
            <div className="progress-bars">
              {selectedSubject === 'all' ? (
                <>
                  <div className="progress-item">
                    <div className="progress-label">
                      <span>Mathematics</span>
                      <span>{progressData.math.completedGames}/{progressData.math.totalGames}</span>
                    </div>
                    <div className="progress-bar">
                      <div 
                        className="progress-fill"
                        style={{ 
                          width: `${getProgressPercentage(progressData.math.completedGames, progressData.math.totalGames)}%`,
                          backgroundColor: getProgressColor(getProgressPercentage(progressData.math.completedGames, progressData.math.totalGames))
                        }}
                      ></div>
                    </div>
                  </div>
                  <div className="progress-item">
                    <div className="progress-label">
                      <span>Filipino</span>
                      <span>{progressData.filipino.completedGames}/{progressData.filipino.totalGames}</span>
                    </div>
                    <div className="progress-bar">
                      <div 
                        className="progress-fill"
                        style={{ 
                          width: `${getProgressPercentage(progressData.filipino.completedGames, progressData.filipino.totalGames)}%`,
                          backgroundColor: getProgressColor(getProgressPercentage(progressData.filipino.completedGames, progressData.filipino.totalGames))
                        }}
                      ></div>
                    </div>
                  </div>
                  <div className="progress-item">
                    <div className="progress-label">
                      <span>English</span>
                      <span>{progressData.english.completedGames}/{progressData.english.totalGames}</span>
                    </div>
                    <div className="progress-bar">
                      <div 
                        className="progress-fill"
                        style={{ 
                          width: `${getProgressPercentage(progressData.filipino.completedGames, progressData.filipino.totalGames)}%`,
                          backgroundColor: getProgressColor(getProgressPercentage(progressData.english.completedGames, progressData.english.totalGames))
                        }}
                      ></div>
                    </div>
                  </div>
                </>
              ) : (
                <div className="progress-item">
                  <div className="progress-label">
                    <span>Games Completed</span>
                    <span>{currentData.completedGames}/{currentData.totalGames}</span>
                  </div>
                  <div className="progress-bar">
                    <div 
                      className="progress-fill"
                      style={{ 
                        width: `${getProgressPercentage(currentData.completedGames, currentData.totalGames)}%`,
                        backgroundColor: getProgressColor(getProgressPercentage(currentData.completedGames, currentData.totalGames))
                      }}
                    ></div>
                  </div>
                </div>
              )}
            </div>
          </motion.div>

          {/* Achievements */}
          <motion.div 
            className="progress-section"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            <h3>Achievements Earned</h3>
            <div className="achievements-grid">
              {selectedSubject === 'all' ? (
                [...progressData.math.achievements, ...progressData.filipino.achievements, ...progressData.english.achievements].map((achievement, index) => (
                  <div key={index} className="achievement-card">
                    <div className="achievement-icon">🏆</div>
                    <div className="achievement-name">{achievement}</div>
                  </div>
                ))
              ) : (
                currentData.achievements.map((achievement, index) => (
                  <div key={index} className="achievement-card">
                    <div className="achievement-icon">🏆</div>
                    <div className="achievement-name">{achievement}</div>
                  </div>
                ))
              )}
            </div>
          </motion.div>

          {/* Recent Activity */}
          <motion.div 
            className="progress-section"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.0 }}
          >
            <h3>Recent Activity</h3>
            <div className="activity-list">
              {selectedSubject === 'all' ? (
                [...progressData.math.recentActivity, ...progressData.filipino.recentActivity, ...progressData.english.recentActivity]
                  .sort((a, b) => new Date(b.date) - new Date(a.date))
                  .slice(0, 5)
                  .map((activity, index) => (
                    <div key={index} className="activity-item">
                      <div className="activity-icon">🎮</div>
                      <div className="activity-details">
                        <div className="activity-game">{activity.game}</div>
                        <div className="activity-score">Score: {activity.score}</div>
                      </div>
                      <div className="activity-date">{new Date(activity.date).toLocaleDateString()}</div>
                    </div>
                  ))
              ) : (
                currentData.recentActivity.map((activity, index) => (
                  <div key={index} className="activity-item">
                    <div className="activity-icon">🎮</div>
                    <div className="activity-details">
                      <div className="activity-game">{activity.game}</div>
                      <div className="activity-score">Score: {activity.score}</div>
                    </div>
                    <div className="activity-date">{new Date(activity.date).toLocaleDateString()}</div>
                  </div>
                ))
              )}
            </div>
          </motion.div>
        </div>

        {/* Call to Action */}
        <motion.div 
          className="progress-cta"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.2 }}
        >
          <h3>Keep Learning!</h3>
          <p>Continue your educational journey with more games and activities</p>
          <div className="cta-buttons">
            <Link to="/subjects" className="cta-btn primary">
              Play More Games
            </Link>
            <Link to="/quiz" className="cta-btn secondary">
              Take a Quiz
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Progress;
