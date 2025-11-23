import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import { quizAPI } from '../../services/api';
import UserManagement from './UserManagement';
import Analytics from './Analytics';
import SystemSettings from './SystemSettings';
import ContentManagement from './ContentManagement';
import SMSSettings from './SMSSettings';
import './AdminDashboard.css';

const SUBJECT_META = {
  Mathematics: { icon: '🔢', color: '#FF6B6B' },
  English: { icon: '🇺🇸', color: '#45B7D1' },
  Filipino: { icon: '🇵🇭', color: '#4ECDC4' },
  default: { icon: '🧠', color: '#9b59b6' }
};

const getSubjectMeta = (subject) => SUBJECT_META[subject] || SUBJECT_META.default;

const AdminDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');

  const adminTabs = [
    { id: 'dashboard', label: 'Quizzes Customization', icon: '🛠️' },
    { id: 'users', label: 'User Management', icon: '👥' },
    { id: 'analytics', label: 'Analytics', icon: '📈' },
    { id: 'content', label: 'Content Management', icon: '📚' },
    { id: 'sms', label: 'SMS Settings', icon: '📱' },
    { id: 'settings', label: 'System Settings', icon: '⚙️' }
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <QuizCustomization />;
      case 'users':
        return <UserManagement />;
      case 'analytics':
        return <Analytics />;
      case 'content':
        return <ContentManagement />;
      case 'sms':
        return <SMSSettings />;
      case 'settings':
        return <SystemSettings />;
      default:
        return <QuizCustomization />;
    }
  };

  return (
    <div className="admin-dashboard">
      <div className="admin-header">
        <h1>Teacher Panel</h1>
        <div className="admin-user-info">
          <span>Welcome, {user?.name}</span>
          <span className="admin-badge">Teacher</span>
        </div>
      </div>

      <div className="admin-layout">
        <nav className="admin-sidebar">
          <ul className="admin-nav">
            {adminTabs.map((tab) => (
              <li key={tab.id}>
                <button
                  className={`admin-nav-btn ${activeTab === tab.id ? 'active' : ''}`}
                  onClick={() => setActiveTab(tab.id)}
                >
                  <span className="nav-icon">{tab.icon}</span>
                  <span className="nav-label">{tab.label}</span>
                </button>
              </li>
            ))}
          </ul>
        </nav>

        <main className="admin-content">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            {renderContent()}
          </motion.div>
        </main>
      </div>
    </div>
  );
};

const QuizCustomization = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState('all');
  const [activeQuiz, setActiveQuiz] = useState(null);
  const [quizForm, setQuizForm] = useState({
    title: '',
    subject: 'Mathematics',
    difficulty: 'Easy',
    description: ''
  });
  const [questionForm, setQuestionForm] = useState({
    text: '',
    type: 'multiple-choice',
    options: ['', '', '', ''],
    answer: ''
  });
  const [showQuestionEditor, setShowQuestionEditor] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!activeQuiz) return;
    setActiveQuiz((current) => {
      if (!current) return null;
      const fresh = quizzes.find((quiz) => quiz.id === current.id);
      return fresh || null;
    });
  }, [quizzes]);

  const loadQuizzes = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await quizAPI.getQuizzes();
      const data = await response.json();
      if (response.ok) {
        setQuizzes(Array.isArray(data.quizzes) ? data.quizzes : []);
      } else {
        setQuizzes([]);
        setError(data.message || 'Unable to load quizzes');
      }
    } catch (err) {
      console.error(err);
      setError('Unable to load quizzes');
      setQuizzes([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadQuizzes();
  }, []);

  const filteredQuizzes = quizzes.filter((quiz) => {
    const matchesSearch =
      quiz.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      quiz.subject.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDifficulty =
      difficultyFilter === 'all' || quiz.difficulty.toLowerCase() === difficultyFilter;
    return matchesSearch && matchesDifficulty;
  });

  const handleAddQuiz = async (e) => {
    e.preventDefault();
    if (!quizForm.title.trim()) return;

    const meta = getSubjectMeta(quizForm.subject);
    const payload = {
      title: quizForm.title,
      subject: quizForm.subject,
      difficulty: quizForm.difficulty,
      description: quizForm.description,
      icon: meta.icon,
      color: meta.color,
      questions: []
    };

    setSaving(true);
    setError('');
    try {
      const response = await quizAPI.createQuiz(payload);
      const data = await response.json();
      if (response.ok) {
        setQuizzes((prev) => [data.quiz, ...prev]);
        setQuizForm({ title: '', subject: 'Mathematics', difficulty: 'Easy', description: '' });
      } else {
        setError(data.message || 'Unable to create quiz');
      }
    } catch (err) {
      console.error(err);
      setError('Unable to create quiz');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteQuiz = async (quizId) => {
    if (window.confirm('Delete this quiz?')) {
      setSaving(true);
      setError('');
      try {
        const response = await quizAPI.deleteQuiz(quizId);
        if (response.ok) {
          setQuizzes((prev) => prev.filter((quiz) => quiz.id !== quizId));
          setActiveQuiz((current) => (current?.id === quizId ? null : current));
          setShowQuestionEditor(false);
        } else {
          const data = await response.json();
          setError(data.message || 'Unable to delete quiz');
        }
      } catch (err) {
        console.error(err);
        setError('Unable to delete quiz');
      } finally {
        setSaving(false);
      }
    }
  };

  const openQuestionEditor = (quiz) => {
    const fromState = quizzes.find((q) => q.id === quiz.id);
    setActiveQuiz(fromState || quiz);
    setQuestionForm({ text: '', type: 'multiple-choice', options: ['', '', '', ''], answer: '' });
    setShowQuestionEditor(true);
  };

  const persistQuiz = async (quiz) => {
    setSaving(true);
    setError('');
    const { id, questions, ...rest } = quiz;
    const payload = {
      ...rest,
      questions: questions.map(({ text, type, options = [], answer }) => ({
        text,
        type,
        options,
        answer,
      })),
    };

    try {
      const response = await quizAPI.updateQuiz(id, payload);
      const data = await response.json();
      if (response.ok) {
        setQuizzes((prev) => prev.map((q) => (q.id === data.quiz.id ? data.quiz : q)));
        setActiveQuiz((current) => (current?.id === data.quiz.id ? data.quiz : current));
        return true;
      }
      setError(data.message || 'Unable to update quiz');
      return false;
    } catch (err) {
      console.error(err);
      setError('Unable to update quiz');
      return false;
    } finally {
      setSaving(false);
    }
  };

  const handleAddQuestion = async (e) => {
    e.preventDefault();
    if (!activeQuiz) return;
    if (!questionForm.text.trim()) return;

    const rawOptions = questionForm.options;
    const optionValues = rawOptions.map((opt) => opt.trim());
    const filledOptions = optionValues.filter(Boolean);

    if (questionForm.type === 'multiple-choice' && filledOptions.length < 2) {
      alert('Multiple choice questions need at least two options.');
      return;
    }

    let answerValue =
      questionForm.type === 'true-false'
        ? questionForm.answer || 'True'
        : questionForm.answer.trim();

    if (questionForm.type === 'multiple-choice') {
      if (!filledOptions.includes(answerValue)) {
        answerValue = filledOptions[0] || '';
      }
    }

    const preparedQuestion = {
      id: `${activeQuiz.id}-q${activeQuiz.questions.length + 1}`,
      text: questionForm.text,
      type: questionForm.type,
      options: questionForm.type === 'multiple-choice' ? rawOptions : [],
      answer: answerValue
    };

    const updatedQuiz = {
      ...activeQuiz,
      questions: [...activeQuiz.questions, preparedQuestion],
    };

    const success = await persistQuiz(updatedQuiz);
    if (success) {
      setQuestionForm({ text: '', type: 'multiple-choice', options: ['', '', '', ''], answer: '' });
    }
  };

  const handleDeleteQuestion = async (questionId) => {
    if (!activeQuiz) return;
    const updatedQuiz = {
      ...activeQuiz,
      questions: activeQuiz.questions.filter((q) => q.id !== questionId),
    };
    await persistQuiz(updatedQuiz);
  };

  const handleQuestionUpdate = async (questionId, field, value) => {
    if (!activeQuiz) return;
    const updatedQuiz = {
      ...activeQuiz,
      questions: activeQuiz.questions.map((q) => {
        if (q.id !== questionId) return q;
        if (field === 'type') {
          return {
            ...q,
            type: value,
            options: value === 'multiple-choice' ? (q.options || ['', '', '', '']) : [],
            answer: value === 'true-false'
              ? (q.answer === 'False' ? 'False' : 'True')
              : ''
          };
        }
        return { ...q, [field]: value };
      })
    };

    await persistQuiz(updatedQuiz);
  };

  return (
    <div className="quiz-customization">
      {error && <div className="error-banner">{error}</div>}

      <div className="quiz-header">
        <div>
          <h2>Quizzes Customization</h2>
          <p>Manage all quizzes, update questions, and tailor assessments for your students.</p>
        </div>
        <div className="quiz-search-controls">
          <div className="search-box">
            <input
              type="text"
              placeholder="Search by title or subject..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <span className="search-icon">🔍</span>
          </div>
          <select
            value={difficultyFilter}
            onChange={(e) => setDifficultyFilter(e.target.value)}
            className="difficulty-filter"
          >
            <option value="all">All Difficulties</option>
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </div>
      </div>

      {saving && <div className="saving-indicator">Saving changes...</div>}

      <div className="quiz-layout">
        <motion.div
          className="quiz-form-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h3>Create New Quiz</h3>
          <form onSubmit={handleAddQuiz}>
            <div className="form-group">
              <label>Quiz Title</label>
              <input
                type="text"
                value={quizForm.title}
                onChange={(e) => setQuizForm({ ...quizForm, title: e.target.value })}
                placeholder="e.g., Fractions Challenge"
                required
                disabled={saving}
              />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Subject</label>
                <select
                  value={quizForm.subject}
                  onChange={(e) => setQuizForm({ ...quizForm, subject: e.target.value })}
                disabled={saving}
                >
                  <option>Mathematics</option>
                  <option>English</option>
                  <option>Filipino</option>
                </select>
              </div>
              <div className="form-group">
                <label>Difficulty</label>
                <select
                  value={quizForm.difficulty}
                  onChange={(e) => setQuizForm({ ...quizForm, difficulty: e.target.value })}
                  disabled={saving}
                >
                  <option>Easy</option>
                  <option>Medium</option>
                  <option>Hard</option>
                </select>
              </div>
            </div>
            <div className="form-group">
              <label>Description</label>
              <textarea
                rows="3"
                value={quizForm.description}
                onChange={(e) => setQuizForm({ ...quizForm, description: e.target.value })}
                placeholder="Describe the focus or objectives of this quiz"
                disabled={saving}
              />
            </div>
            <button type="submit" className="btn-primary" disabled={saving}>Add Quiz</button>
          </form>
        </motion.div>

        <div className="quiz-list">
          {loading ? (
            <div className="empty-state">
              <p>Loading quizzes...</p>
            </div>
          ) : filteredQuizzes.length === 0 ? (
            <div className="empty-state">
              <p>No quizzes found. Try adjusting your filters or create a new quiz.</p>
            </div>
          ) : (
            filteredQuizzes.map((quiz) => (
          <motion.div
                key={quiz.id}
                className="quiz-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
                style={{ '--quiz-color': quiz.color || getSubjectMeta(quiz.subject).color }}
              >
          <div className="quiz-card-header">
            <div className="quiz-title-row">
              <span className="quiz-icon-display">{quiz.icon || getSubjectMeta(quiz.subject).icon}</span>
              <h3>{quiz.title}</h3>
            </div>
                  <div className="quiz-tags">
                    <span className="quiz-tag subject">{quiz.subject}</span>
                    <span className={`quiz-tag difficulty ${quiz.difficulty.toLowerCase()}`}>
                      {quiz.difficulty}
                    </span>
                    <span className="quiz-tag questions">{quiz.questions.length} questions</span>
                  </div>
            </div>
                <p className="quiz-description">{quiz.description || 'No description provided yet.'}</p>
                <div className="quiz-actions">
                  <button className="btn-manage" onClick={() => openQuestionEditor(quiz)} disabled={saving}>Manage Questions</button>
                  <button className="btn-delete" onClick={() => handleDeleteQuiz(quiz.id)} disabled={saving}>Delete Quiz</button>
            </div>
          </motion.div>
            ))
          )}
        </div>
      </div>

      {showQuestionEditor && activeQuiz && (
        <div className="question-editor-overlay" onClick={() => setShowQuestionEditor(false)}>
          <div className="question-editor" onClick={(e) => e.stopPropagation()}>
            <div className="editor-header">
              <h3>{activeQuiz.title} — Questions</h3>
              <button className="close-btn" onClick={() => setShowQuestionEditor(false)}>×</button>
            </div>

            <div className="questions-list">
              {activeQuiz.questions.length === 0 ? (
                <p className="empty-state">No questions yet. Add your first question below.</p>
              ) : (
                activeQuiz.questions.map((question) => (
                  <div key={question.id} className="question-item">
                    <textarea
                      value={question.text}
                      onChange={(e) => handleQuestionUpdate(question.id, 'text', e.target.value)}
                    />
                    <select
                      value={question.type || 'multiple-choice'}
                      onChange={(e) => handleQuestionUpdate(question.id, 'type', e.target.value)}
                    >
                      <option value="multiple-choice">Multiple Choice</option>
                      <option value="true-false">True / False</option>
                      <option value="short-answer">Short Answer</option>
                    </select>
                    {(question.type === 'multiple-choice' || !question.type) && (
                      <div className="options-grid">
                        {(question.options || ['', '', '', '']).map((opt, idx) => (
                          <input
                            key={idx}
                            type="text"
                            value={opt}
                            placeholder={`Option ${idx + 1}`}
                            onChange={(e) => {
                              const updatedOptions = [...(question.options || ['', '', '', ''])];
                              updatedOptions[idx] = e.target.value;
                              handleQuestionUpdate(question.id, 'options', updatedOptions);
                            }}
                          />
        ))}
      </div>
                    )}
                    {question.type === 'true-false' && (
                      <div className="tf-options">
                        <label>
                          <input
                            type="radio"
                            name={`${question.id}-answer`}
                            value="True"
                            checked={question.answer === 'True'}
                            onChange={(e) => handleQuestionUpdate(question.id, 'answer', e.target.value)}
                          />
                          True
                        </label>
                        <label>
                          <input
                            type="radio"
                            name={`${question.id}-answer`}
                            value="False"
                            checked={question.answer === 'False'}
                            onChange={(e) => handleQuestionUpdate(question.id, 'answer', e.target.value)}
                          />
                          False
                        </label>
            </div>
                    )}
                    <input
                      type="text"
                      value={question.answer}
                      onChange={(e) => handleQuestionUpdate(question.id, 'answer', e.target.value)}
                      placeholder={
                        question.type === 'true-false'
                          ? 'True or False'
                          : question.type === 'multiple-choice'
                            ? 'Match one of the options'
                            : 'Correct answer'
                      }
                      readOnly={question.type === 'true-false'}
                    />
                    <button
                      className="btn-delete"
                      onClick={() => handleDeleteQuestion(question.id)}
                      disabled={saving}
                    >
                      Remove
                    </button>
                    
            </div>
                ))
              )}
          </div>

            <form onSubmit={handleAddQuestion} className="question-form">
              <h4>Add Question</h4>
              <textarea
                rows="2"
                value={questionForm.text}
                onChange={(e) => setQuestionForm({ ...questionForm, text: e.target.value })}
                placeholder="Enter question text"
                required
              />
              <select
                value={questionForm.type}
                onChange={(e) => {
                  const type = e.target.value;
                  setQuestionForm({
                    ...questionForm,
                    type,
                    options: type === 'multiple-choice' ? questionForm.options : ['', '', '', ''],
                    answer: type === 'true-false' ? 'True' : ''
                  });
                }}
              >
                <option value="multiple-choice">Multiple Choice</option>
                <option value="true-false">True / False</option>
                <option value="short-answer">Short Answer</option>
              </select>
              {questionForm.type === 'multiple-choice' && (
                <div className="options-grid">
                  {questionForm.options.map((option, idx) => (
                    <input
                      key={idx}
                      type="text"
                      value={option}
                      placeholder={`Option ${idx + 1}`}
                      onChange={(e) => {
                        const updated = [...questionForm.options];
                        updated[idx] = e.target.value;
                        setQuestionForm({ ...questionForm, options: updated });
                      }}
                      required={idx < 2}
                    />
                  ))}
            </div>
              )}
              {questionForm.type === 'true-false' && (
                <div className="tf-options">
                  <label>
                    <input
                      type="radio"
                      name="new-question-ans"
                      value="True"
                      checked={questionForm.answer === 'True'}
                      onChange={(e) => setQuestionForm({ ...questionForm, answer: e.target.value })}
                    />
                    True
                  </label>
                  <label>
                    <input
                      type="radio"
                      name="new-question-ans"
                      value="False"
                      checked={questionForm.answer === 'False'}
                      onChange={(e) => setQuestionForm({ ...questionForm, answer: e.target.value })}
                    />
                    False
                  </label>
          </div>
              )}
              <input
                type="text"
                value={questionForm.answer}
                onChange={(e) => setQuestionForm({ ...questionForm, answer: e.target.value })}
                placeholder="Correct answer"
                required={questionForm.type !== 'true-false'}
                readOnly={questionForm.type === 'true-false'}
              />
              {questionForm.type === 'multiple-choice' && (
                <small className="helper-text">Set the correct answer by matching it with one of the options above.</small>
              )}
              <div className="question-actions">
                <button type="submit" className="btn-primary" disabled={saving}>Add Question</button>
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => setQuestionForm({ text: '', type: 'multiple-choice', options: ['', '', '', ''], answer: '' })}
                  disabled={saving}
                >
                  Clear
                </button>
            </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
