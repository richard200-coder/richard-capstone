import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { quizAPI } from '../services/api';
import './Quiz.css';

const SUBJECT_META = {
  Mathematics: { icon: '🔢', color: '#FF6B6B' },
  English: { icon: '🇺🇸', color: '#45B7D1' },
  Filipino: { icon: '🇵🇭', color: '#4ECDC4' },
  default: { icon: '🧠', color: '#9b59b6' }
};

const SUBJECT_ALIAS_MAP = {
  US: { label: 'English', canonical: 'English' },
  PH: { label: 'Filipino', canonical: 'Filipino' },
  GHG: { label: 'Mathematics', canonical: 'Mathematics' }
};

const resolveSubject = (subject) => {
  if (!subject) {
    return { label: 'General', canonical: 'default', code: '' };
  }
  const trimmed = subject.trim();
  const code = trimmed.toUpperCase();
  const alias = SUBJECT_ALIAS_MAP[code];
  if (alias) {
    return { ...alias, code };
  }
  return { label: trimmed, canonical: trimmed, code };
};

const shouldUseLabelIcon = (iconCandidate = '') => {
  const trimmed = iconCandidate.trim();
  if (!trimmed) return true;
  if (SUBJECT_ALIAS_MAP[trimmed.toUpperCase()]) return true;
  const plainWord = /^[A-Za-z0-9\s]+$/.test(trimmed);
  return plainWord && trimmed.length <= 4;
};

const Quiz = () => {
  const [currentQuiz, setCurrentQuiz] = useState('menu');
  const [score, setScore] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [quizData, setQuizData] = useState(null);
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const getAccentColor = (quiz) => {
    if (!quiz) return '#667eea';
    const canonical = quiz.canonicalSubject || resolveSubject(quiz.subject).canonical;
    const meta = SUBJECT_META[canonical] || SUBJECT_META.default;
    return quiz.color || meta.color;
  };

  const accentColor = getAccentColor(quizData);

  useEffect(() => {
    const loadQuizzes = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await quizAPI.getQuizzes();
        const data = await response.json();
        if (response.ok) {
          const enriched = Array.isArray(data.quizzes)
            ? data.quizzes.map((quiz) => {
                const subjectInfo = resolveSubject(quiz.subject);
                const meta = SUBJECT_META[subjectInfo.canonical] || SUBJECT_META.default;
                const iconCandidate = quiz.icon || '';
                const isAliasSubject = Boolean(SUBJECT_ALIAS_MAP[subjectInfo.code]);
                const displayIcon =
                  isAliasSubject || shouldUseLabelIcon(iconCandidate)
                    ? subjectInfo.label
                    : iconCandidate;
                return {
                  ...quiz,
                  subjectLabel: subjectInfo.label,
                  canonicalSubject: subjectInfo.canonical,
                  displayIcon,
                  color: quiz.color || meta.color,
                  description: quiz.description || `Custom quiz for ${subjectInfo.label}`,
                  displayTitle: quiz.title || `${subjectInfo.label} Quiz`
                };
              })
            : [];
          setQuizzes(enriched);
        } else {
          setQuizzes([]);
          setError(data.message || 'Unable to load quizzes');
        }
      } catch (err) {
        console.error(err);
        setQuizzes([]);
        setError('Unable to load quizzes');
      } finally {
        setLoading(false);
      }
    };

    loadQuizzes();
  }, []);

  const buildQuestionForPlay = (question) => {
    const type = question.type || 'multiple-choice';
    if (type === 'true-false') {
      const options = ['True', 'False'];
      const answer = (question.answer || 'True').trim().toLowerCase() === 'false' ? 1 : 0;
      return {
        type: 'true-false',
        question: question.text,
        options,
        correctIndex: answer
      };
    }

    if (type === 'short-answer') {
      return {
        type: 'short-answer',
        question: question.text,
        answerText: (question.answer || '').trim()
      };
    }

    const rawOptions = (question.options || []).map((opt) => opt.trim());
    const filteredOptions = rawOptions.filter(Boolean);
    let answerText = (question.answer || '').trim();
    let correctIndex = filteredOptions.findIndex(
      (opt) => opt.toLowerCase() === answerText.toLowerCase()
    );
    if (filteredOptions.length === 0) {
      filteredOptions.push('Option 1');
    }
    if (correctIndex === -1) {
      if (answerText && filteredOptions.includes(answerText)) {
        correctIndex = filteredOptions.indexOf(answerText);
      } else if (answerText) {
        filteredOptions.push(answerText);
        correctIndex = filteredOptions.length - 1;
      } else {
        correctIndex = 0;
      }
    }
    return {
      type: 'multiple-choice',
      question: question.text,
      options: filteredOptions,
      correctIndex
    };
  };

  const startQuiz = (quizId) => {
    const quiz = quizzes.find(q => q.id === quizId);
    if (!quiz) return;
    if (!quiz.questions || quiz.questions.length === 0) {
      alert('This quiz has no questions yet. Please ask the teacher to add questions first.');
      return;
    }

    const formattedQuestions = quiz.questions.map(buildQuestionForPlay);
    const activeQuiz = {
      ...quiz,
      questions: formattedQuestions
    };

    setQuizData(activeQuiz);
    setCurrentQuiz(quizId);
    setScore(0);
    setCurrentQuestion(0);
    setUserAnswers({});
    setShowResults(false);
  };

  const handleAnswer = (answerIndex) => {
    setUserAnswers(prev => ({
      ...prev,
      [currentQuestion]: answerIndex
    }));
  };

  const handleShortAnswer = (value) => {
    setUserAnswers(prev => ({
      ...prev,
      [currentQuestion]: value
    }));
  };

  const nextQuestion = () => {
    if (currentQuestion < quizData.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      calculateScore();
      setShowResults(true);
    }
  };

  const previousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const calculateScore = () => {
    let correctAnswers = 0;
    quizData.questions.forEach((question, index) => {
      const provided = userAnswers[index];
      if (question.type === 'short-answer') {
        if (
          (provided || '').trim().toLowerCase() ===
          (question.answerText || '').trim().toLowerCase()
        ) {
          correctAnswers++;
        }
      } else if (provided !== undefined && provided === question.correctIndex) {
        correctAnswers++;
      }
    });
    setScore(correctAnswers);
  };

  const resetQuiz = () => {
    setCurrentQuiz('menu');
    setScore(0);
    setCurrentQuestion(0);
    setUserAnswers({});
    setShowResults(false);
    setQuizData(null);
  };

  const getScoreMessage = () => {
    if (!quizData || quizData.questions.length === 0) return '';
    const percentage = (score / quizData.questions.length) * 100;
    if (percentage >= 80) return 'Excellent! You are a master! 🏆';
    if (percentage >= 60) return 'Good job! Keep learning! 🌟';
    if (percentage >= 40) return 'Not bad! Practice more! 💪';
    return 'Keep trying! You can do better! 📚';
  };

  const getScoreColor = () => {
    if (!quizData || quizData.questions.length === 0) return '#28a745';
    const percentage = (score / quizData.questions.length) * 100;
    if (percentage >= 80) return '#28a745';
    if (percentage >= 60) return '#ffc107';
    if (percentage >= 40) return '#fd7e14';
    return '#dc3545';
  };

  return (
    <div className="quiz-page">
      <div className="container">
        {/* Header */}
        <motion.div 
          className="quiz-header"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Link to="/" className="back-btn">
            ← Back to Home
          </Link>
          <h1 className="quiz-title">Interactive Quizzes</h1>
          <p className="quiz-subtitle">
            Choose any quiz created by your teachers and start practicing!
          </p>
        </motion.div>

        <AnimatePresence mode="wait">
          {currentQuiz === 'menu' ? (
            <motion.div
              key="menu"
              className="quiz-menu"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.5 }}
            >
              <h2>Choose Your Quiz!</h2>
              {error && <div className="error-banner">{error}</div>}
              {loading ? (
                <div className="empty-state">
                  <p>Loading quizzes...</p>
                </div>
              ) : quizzes.length === 0 ? (
                <div className="empty-state">
                  <p>No quizzes available yet. Teachers can add quizzes from the Teacher Panel.</p>
                </div>
              ) : (
                <div className="quizzes-grid">
                  {quizzes.map((quiz, index) => {
                    const typeLabels = new Set(
                      (quiz.questions || []).map((q) => (q.type || 'Multiple Choice'))
                    );
                    const typeDisplay =
                      typeLabels.size === 0
                        ? 'No questions'
                        : Array.from(typeLabels)
                            .map((label) =>
                              label
                                .replace('multiple-choice', 'Multiple Choice')
                                .replace('true-false', 'True/False')
                                .replace('short-answer', 'Short Answer')
                            )
                            .join(' · ');

                    return (
                      <motion.div
                        key={quiz.id}
                        className="quiz-card"
                        style={{ '--quiz-color': quiz.color }}
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        whileHover={{ y: -10, scale: 1.05 }}
                        onClick={() => startQuiz(quiz.id)}
                      >
                        <div className="quiz-icon">{quiz.displayIcon || quiz.subjectLabel}</div>
                        <h3>{quiz.displayTitle || quiz.title}</h3>
                        <p>{quiz.description}</p>
                        <div className="quiz-info">
                          <span>{quiz.questions?.length || 0} Questions</span>
                          <span>{typeDisplay}</span>
                        </div>
                        <button className="start-quiz-btn">Start Quiz</button>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="quiz"
              className="quiz-area"
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.5 }}
            >
              {!showResults ? (
                <div className="quiz-content">
                  <div className="quiz-progress">
                    <div className="progress-bar">
                      <div 
                        className="progress-fill"
                        style={{ 
                          width: `${((currentQuestion + 1) / quizData.questions.length) * 100}%`,
                          backgroundColor: accentColor
                        }}
                      ></div>
                    </div>
                    <div className="progress-text">
                      Question {currentQuestion + 1} of {quizData.questions.length}
                    </div>
                  </div>

                  <div className="question-container">
                    <h2 className="question-text">
                      {quizData.questions[currentQuestion].question}
                    </h2>
                    {quizData.questions[currentQuestion].type === 'short-answer' ? (
                      <div className="short-answer-wrapper">
                        <textarea
                          className="short-answer-input"
                          rows="3"
                          placeholder="Type your answer here"
                          value={userAnswers[currentQuestion] || ''}
                          onChange={(e) => handleShortAnswer(e.target.value)}
                        />
                      </div>
                    ) : (
                      <div className="options-grid">
                        {quizData.questions[currentQuestion].options.map((option, index) => (
                          <motion.button
                            key={index}
                            className={`option-btn ${
                              userAnswers[currentQuestion] === index ? 'selected' : ''
                            }`}
                            onClick={() => handleAnswer(index)}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <span className="option-letter">
                              {String.fromCharCode(65 + index)}
                            </span>
                            <span className="option-text">{option}</span>
                          </motion.button>
                        ))}
                      </div>
                    )}

                    <div className="quiz-navigation">
                      {currentQuestion > 0 && (
                        <button onClick={previousQuestion} className="nav-btn prev-btn">
                          ← Previous
                        </button>
                      )}

                      {(() => {
                        const question = quizData.questions[currentQuestion];
                        const answer = userAnswers[currentQuestion];
                        const isAnswered = question.type === 'short-answer'
                          ? Boolean(answer && answer.trim())
                          : answer !== undefined;
                        return (
                      
                        <button 
                            onClick={nextQuestion}
                            className="nav-btn next-btn"
                            disabled={!isAnswered}
                            style={{ backgroundColor: accentColor }}
                          >
                            {currentQuestion === quizData.questions.length - 1 ? 'Finish Quiz' : 'Next →'}
                          </button>
                        );
                      })()}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="results-container">
                  <div className="results-header">
                    <h2>Quiz Results</h2>
                    <div className="score-display" style={{ color: getScoreColor() }}>
                      <span className="score-number">{score}</span>
                      <span className="score-total">/ {quizData.questions.length}</span>
                    </div>
                    <p className="score-percentage">
                      {Math.round((score / quizData.questions.length) * 100)}%
                    </p>
                    <p className="score-message">{getScoreMessage()}</p>
                  </div>

                  <div className="results-breakdown">
                    <h3>Question Review</h3>
                    {quizData.questions.map((question, index) => (
                      <div 
                        key={index} 
                        className={`question-review ${
                          (() => {
                            const provided = userAnswers[index];
                            if (question.type === 'short-answer') {
                              return (provided || '').trim().toLowerCase() === (question.answerText || '').trim().toLowerCase()
                                ? 'correct'
                                : 'incorrect';
                            }
                            return provided === question.correctIndex ? 'correct' : 'incorrect';
                          })()
                        }`}
                      >
                        <div className="question-header">
                          <span className="question-number">Q{index + 1}</span>
                          <span className="question-status">
                            {(() => {
                              const provided = userAnswers[index];
                              if (question.type === 'short-answer') {
                                return (provided || '').trim().toLowerCase() === (question.answerText || '').trim().toLowerCase()
                                  ? '✓'
                                  : '✗';
                              }
                              return provided === question.correctIndex ? '✓' : '✗';
                            })()}
                          </span>
                        </div>
                        <p className="question-text">{question.question}</p>
                        <div className="answer-info">
                          <span className="your-answer">
                            Your answer:{' '}
                            {(() => {
                              const provided = userAnswers[index];
                              if (question.type === 'short-answer') {
                                return provided ? provided : 'Not answered';
                              }
                              return provided !== undefined
                                ? question.options[provided]
                                : 'Not answered';
                            })()}
                          </span>
                          {(() => {
                            const provided = userAnswers[index];
                            if (question.type === 'short-answer') {
                              return (provided || '').trim().toLowerCase() !== (question.answerText || '').trim().toLowerCase() ? (
                                <span className="correct-answer">
                                  Correct answer: {question.answerText || '—'}
                                </span>
                              ) : null;
                            }
                            return provided !== question.correctIndex ? (
                            <span className="correct-answer">
                              Correct answer: {question.options[question.correctIndex]}
                            </span>
                            ) : null;
                          })()}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="results-actions">
                    <button onClick={resetQuiz} className="retake-btn">
                      Take Another Quiz
                    </button>
                    <Link to="/" className="home-btn">
                      Back to Home
                    </Link>
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Quiz;
