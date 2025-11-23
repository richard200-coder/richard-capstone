import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import './Subjects.css';

const Subjects = () => {
  const subjects = [
    {
      id: 'math',
      name: 'Mathematics',
      icon: '🔢',
      color: '#FF6B6B',
      description: 'Master numbers, shapes, and problem-solving skills through interactive games and challenges.',
      topics: ['Addition & Subtraction', 'Multiplication & Division', 'Shapes & Geometry', 'Problem Solving'],
      difficulty: 'Beginner to Advanced',
      games: [
        { name: 'Number Ninja', description: 'Practice basic arithmetic operations', icon: '⚔️' },
        { name: 'Shape Explorer', description: 'Learn about geometric shapes', icon: '🔷' },
        { name: 'Math Puzzle', description: 'Solve challenging math problems', icon: '🧩' }
      ]
    },
    {
      id: 'filipino',
      name: 'Filipino',
      icon: '🇵🇭',
      color: '#4ECDC4',
      description: 'Explore the beautiful Filipino language and culture through engaging activities and games.',
      topics: ['Vocabulary Building', 'Grammar Rules', 'Reading Comprehension', 'Cultural Stories'],
      difficulty: 'Beginner to Intermediate',
      games: [
        { name: 'Salita Master', description: 'Learn Filipino vocabulary', icon: '📝' },
        { name: 'Kuwento Time', description: 'Read and understand Filipino stories', icon: '📖' },
        { name: 'Balarila Game', description: 'Practice Filipino grammar', icon: '📚' }
      ]
    },
    {
      id: 'english',
      name: 'English',
      icon: '🇺🇸',
      color: '#45B7D1',
      description: 'Improve your English skills with vocabulary, grammar, and reading comprehension games.',
      topics: ['Vocabulary', 'Grammar', 'Reading', 'Writing Skills'],
      difficulty: 'Beginner to Intermediate',
      games: [
        { name: 'Word Wizard', description: 'Expand your English vocabulary', icon: '✨' },
        { name: 'Grammar Guru', description: 'Master English grammar rules', icon: '🎓' },
        { name: 'Reading Champion', description: 'Improve reading comprehension', icon: '📚' }
      ]
    }
  ];

  return (
    <div className="subjects-page">
      <div className="container">
        {/* Header */}
        <motion.div 
          className="page-header"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="page-title">Learning Subjects</h1>
          <p className="page-subtitle">
            Choose a subject to start your learning adventure! Each subject offers multiple games and activities designed to make learning fun and engaging.
          </p>
        </motion.div>

        {/* Subjects Grid */}
        <div className="subjects-container">
          {subjects.map((subject, index) => (
            <motion.div
              key={subject.id}
              className="subject-detail-card"
              style={{ '--card-color': subject.color }}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -10, scale: 1.02 }}
            >
              <div className="subject-header">
                <div className="subject-icon-large">{subject.icon}</div>
                <div className="subject-info">
                  <h2 className="subject-title">{subject.name}</h2>
                  <p className="subject-description">{subject.description}</p>
                </div>
              </div>

              <div className="subject-content">
                <div className="topics-section">
                  <h3>What You'll Learn</h3>
                  <ul className="topics-list">
                    {subject.topics.map((topic, topicIndex) => (
                      <li key={topicIndex}>{topic}</li>
                    ))}
                  </ul>
                </div>

                <div className="difficulty-section">
                  <h3>Difficulty Level</h3>
                  <span className="difficulty-badge">{subject.difficulty}</span>
                </div>

                <div className="games-section">
                  <h3>Available Games</h3>
                  <div className="games-grid">
                    {subject.games.map((game, gameIndex) => (
                      <div key={gameIndex} className="game-item">
                        <span className="game-icon">{game.icon}</span>
                        <div className="game-info">
                          <h4>{game.name}</h4>
                          <p>{game.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="subject-actions">
                  <Link 
                    to={`/${subject.id}-game`} 
                    className="start-learning-btn"
                    style={{ backgroundColor: subject.color }}
                  >
                    Start Learning {subject.name}
                  </Link>
                  <Link 
                    to="/quiz" 
                    className="take-quiz-btn"
                  >
                    Take a Quiz
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Quick Start Section */}
        <motion.div 
          className="quick-start-section"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <h2>Quick Start Guide</h2>
          <div className="quick-start-steps">
            <div className="step">
              <div className="step-number">1</div>
              <h3>Choose a Subject</h3>
              <p>Pick Mathematics, Filipino, or English based on what you want to learn</p>
            </div>
            <div className="step">
              <div className="step-number">2</div>
              <h3>Select a Game</h3>
              <p>Choose from various games and activities within your selected subject</p>
            </div>
            <div className="step">
              <div className="step-number">3</div>
              <h3>Start Playing</h3>
              <p>Begin your learning journey with fun and interactive gameplay</p>
            </div>
            <div className="step">
              <div className="step-number">4</div>
              <h3>Track Progress</h3>
              <p>Monitor your learning progress and earn rewards</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Subjects;
