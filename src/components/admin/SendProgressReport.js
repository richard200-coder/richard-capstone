import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { smsAPI } from '../../services/api';
import './SendProgressReport.css';

const SendProgressReport = ({ student, onClose, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [progressData, setProgressData] = useState({
    subject: 'Mathematics',
    quizScore: 85,
    totalQuestions: 10,
    correctAnswers: 8,
    timeSpent: 300, // 5 minutes in seconds
    difficulty: 'Medium',
    gameType: 'Quiz'
  });

  const handleSendReport = async () => {
    if (!student) {
      setMessage('No student selected');
      return;
    }

    try {
      setLoading(true);
      setMessage('');

      const response = await smsAPI.sendProgressReport(student.id, progressData);
      const data = await response.json();

      if (response.ok) {
        setMessage('Progress report sent successfully!');
        if (onSuccess) {
          onSuccess();
        }
        setTimeout(() => {
          onClose();
        }, 2000);
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
    setProgressData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const subjects = ['Mathematics', 'English', 'Filipino'];
  const difficulties = ['Easy', 'Medium', 'Hard'];
  const gameTypes = ['Quiz', 'Game', 'Practice'];

  return (
    <div className="send-progress-overlay">
      <motion.div
        className="send-progress-modal"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
      >
        <div className="modal-header">
          <h3>Send Progress Report via SMS</h3>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <div className="modal-content">
          {student && (
            <div className="student-info">
              <h4>Student: {student.name}</h4>
              <p>Email: {student.email}</p>
            </div>
          )}

          {message && (
            <motion.div
              className={`message ${message.includes('Error') ? 'error' : 'success'}`}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {message}
            </motion.div>
          )}

          <div className="progress-form">
            <div className="form-row">
              <div className="form-group">
                <label>Subject:</label>
                <select
                  value={progressData.subject}
                  onChange={(e) => handleInputChange('subject', e.target.value)}
                >
                  {subjects.map(subject => (
                    <option key={subject} value={subject}>{subject}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Quiz Score (%):</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={progressData.quizScore}
                  onChange={(e) => handleInputChange('quizScore', parseInt(e.target.value))}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Total Questions:</label>
                <input
                  type="number"
                  min="1"
                  value={progressData.totalQuestions}
                  onChange={(e) => handleInputChange('totalQuestions', parseInt(e.target.value))}
                />
              </div>

              <div className="form-group">
                <label>Correct Answers:</label>
                <input
                  type="number"
                  min="0"
                  max={progressData.totalQuestions}
                  value={progressData.correctAnswers}
                  onChange={(e) => handleInputChange('correctAnswers', parseInt(e.target.value))}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Time Spent (seconds):</label>
                <input
                  type="number"
                  min="0"
                  value={progressData.timeSpent}
                  onChange={(e) => handleInputChange('timeSpent', parseInt(e.target.value))}
                />
              </div>

              <div className="form-group">
                <label>Difficulty:</label>
                <select
                  value={progressData.difficulty}
                  onChange={(e) => handleInputChange('difficulty', e.target.value)}
                >
                  {difficulties.map(difficulty => (
                    <option key={difficulty} value={difficulty}>{difficulty}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-group">
              <label>Game Type:</label>
              <select
                value={progressData.gameType}
                onChange={(e) => handleInputChange('gameType', e.target.value)}
              >
                {gameTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="modal-actions">
            <button
              className="cancel-btn"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              className="send-btn"
              onClick={handleSendReport}
              disabled={loading}
            >
              {loading ? 'Sending...' : 'Send SMS Report'}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default SendProgressReport;
