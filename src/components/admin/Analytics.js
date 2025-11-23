import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { authAPI } from '../../services/api';
import StudentProgressModal from './StudentProgressModal';
import SendProgressReport from './SendProgressReport';
import './Analytics.css';

const Analytics = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('7d');
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showProgressModal, setShowProgressModal] = useState(false);
  const [showSMSModal, setShowSMSModal] = useState(false);

  // Fetch real users from API
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await authAPI.getAllUsers();
      const data = await response.json();
      
      if (response.ok) {
        setUsers(data.users);
      } else {
        console.error('Failed to fetch users:', data.message);
        setUsers([]);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  // Generate mock quiz data for demonstration (you can replace this with real quiz data later)
  const generateMockQuizData = (users) => {
    return users.map(user => ({
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      // Generate random but realistic quiz performance data
      avgScore: Math.floor(Math.random() * 30) + 70, // 70-100%
      quizzesCompleted: Math.floor(Math.random() * 25) + 5, // 5-30 quizzes
      gamesPlayed: Math.floor(Math.random() * 50) + 10, // 10-60 games
      lastActive: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000) // Last 7 days
    }));
  };

  // Get top performers based on quiz scores
  const getTopPerformers = () => {
    if (users.length === 0) return [];
    
    const usersWithQuizData = generateMockQuizData(users);
    
    // Filter out admin users and sort by average score
    return usersWithQuizData
      .filter(user => user.role !== 'admin')
      .sort((a, b) => b.avgScore - a.avgScore)
      .slice(0, 5); // Top 5 performers
  };

  const analyticsData = {
    quizStats: [
      { subject: 'Mathematics', quizzesTaken: 450, avgScore: 87, passRate: 94 },
      { subject: 'Filipino', quizzesTaken: 380, avgScore: 81, passRate: 89 },
      { subject: 'English', quizzesTaken: 420, avgScore: 84, passRate: 91 }
    ],
    topPerformers: getTopPerformers()
  };

  const periodOptions = [
    { value: '7d', label: 'Last 7 Days' },
    { value: '30d', label: 'Last 30 Days' },
    { value: '90d', label: 'Last 90 Days' },
    { value: '1y', label: 'Last Year' }
  ];

  const handleStudentClick = (student) => {
    setSelectedStudent(student);
    setShowProgressModal(true);
  };

  const handleCloseModal = () => {
    setShowProgressModal(false);
    setSelectedStudent(null);
  };

  const handleSendSMS = (student) => {
    setSelectedStudent(student);
    setShowSMSModal(true);
  };

  const handleCloseSMSModal = () => {
    setShowSMSModal(false);
    setSelectedStudent(null);
  };

  return (
    <div className="analytics">
      <div className="analytics-header">
        <h2>Analytics Dashboard</h2>
        <div className="period-selector">
          <label>Time Period:</label>
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
          >
            {periodOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="analytics-grid">
        {/* Quiz Statistics */}
        <motion.div
          className="chart-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <h3>Quiz Performance by Subject</h3>
          <div className="stats-table">
            <table>
              <thead>
                <tr>
                  <th>Subject</th>
                  <th>Quizzes Taken</th>
                  <th>Avg Score</th>
                  <th>Pass Rate</th>
                </tr>
              </thead>
              <tbody>
                {analyticsData.quizStats.map((stat) => (
                  <tr key={stat.subject}>
                    <td>
                      <div className="subject-info">
                        <span className="subject-icon">
                          {stat.subject === 'Mathematics' ? '🔢' : 
                           stat.subject === 'Filipino' ? '🇵🇭' : '🇺🇸'}
                        </span>
                        {stat.subject}
                      </div>
                    </td>
                    <td>{stat.quizzesTaken.toLocaleString()}</td>
                    <td>
                      <div className="score-bar">
                        <div
                          className="score-fill"
                          style={{ width: `${stat.avgScore}%` }}
                        ></div>
                        <span>{stat.avgScore}%</span>
                      </div>
                    </td>
                    <td>
                      <div className="pass-rate">
                        <span className={`rate-badge ${stat.passRate >= 90 ? 'high' : stat.passRate >= 80 ? 'medium' : 'low'}`}>
                          {stat.passRate}%
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Top Performers */}
        <motion.div
          className="chart-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h3>Top Performers</h3>
          <div className="top-performers">
            {loading ? (
              <div className="loading-message">Loading top performers...</div>
            ) : analyticsData.topPerformers.length === 0 ? (
              <div className="no-data-message">
                <div className="no-data-icon">📊</div>
                <p>No quiz data available yet</p>
                <small>Users need to complete quizzes to appear here</small>
              </div>
            ) : (
              analyticsData.topPerformers.map((performer, index) => (
                <div key={performer.id} className="performer-item">
                  <div className="performer-rank">
                    <span className={`rank-badge rank-${index + 1}`}>
                      #{index + 1}
                    </span>
                  </div>
                  <div className="performer-info">
                    <div 
                      className="performer-name clickable"
                      onClick={() => handleStudentClick(performer)}
                      title="Click to view detailed progress"
                    >
                      {performer.name}
                    </div>
                    <div className="performer-email">{performer.email}</div>
                    <div className="performer-stats">
                      <span>Score: {performer.avgScore}%</span>
                      <span>Games: {performer.gamesPlayed}</span>
                      <span>Quizzes: {performer.quizzesCompleted}</span>
                    </div>
                    <div className="performer-actions">
                      <button 
                        className="sms-btn"
                        onClick={() => handleSendSMS(performer)}
                        title="Send progress report via SMS"
                      >
                        📱 Send SMS
                      </button>
                    </div>
                  </div>
                  <div className="performer-score">
                    <div className="score-circle">
                      <span>{performer.avgScore}%</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </motion.div>

        {/* Engagement Metrics */}
        <motion.div
          className="chart-card metrics-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h3>Engagement Metrics</h3>
          <div className="metrics-grid">
            <div className="metric-item">
              <div className="metric-icon">⏱️</div>
              <div className="metric-content">
                <div className="metric-value">24.5 min</div>
                <div className="metric-label">Avg Session Time</div>
              </div>
            </div>
            <div className="metric-item">
              <div className="metric-icon">🔄</div>
              <div className="metric-content">
                <div className="metric-value">3.2</div>
                <div className="metric-label">Avg Games per Session</div>
              </div>
            </div>
            <div className="metric-item">
              <div className="metric-icon">📱</div>
              <div className="metric-content">
                <div className="metric-value">89%</div>
                <div className="metric-label">Mobile Usage</div>
              </div>
            </div>
            <div className="metric-item">
              <div className="metric-icon">⭐</div>
              <div className="metric-content">
                <div className="metric-value">4.8/5</div>
                <div className="metric-label">User Satisfaction</div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Student Progress Modal */}
      <StudentProgressModal
        isOpen={showProgressModal}
        onClose={handleCloseModal}
        student={selectedStudent}
      />

      {/* Send Progress Report Modal */}
      {showSMSModal && (
        <SendProgressReport
          student={selectedStudent}
          onClose={handleCloseSMSModal}
          onSuccess={() => {
            console.log('SMS sent successfully');
          }}
        />
      )}
    </div>
  );
};

export default Analytics;
