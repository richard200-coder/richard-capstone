import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import './FilipinoGame.css';

const FilipinoGame = () => {
  const [currentGame, setCurrentGame] = useState('menu');
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [gameData, setGameData] = useState(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [feedback, setFeedback] = useState('');
  const [isCorrect, setIsCorrect] = useState(null);
  const [streak, setStreak] = useState(0);

  const games = [
    {
      id: 'vocabulary',
      name: 'Salita Master',
      icon: '📝',
      description: 'Learn Filipino vocabulary words and their meanings',
      color: '#4ECDC4'
    },
    {
      id: 'grammar',
      name: 'Balarila Game',
      icon: '📚',
      description: 'Practice Filipino grammar rules and sentence structure',
      color: '#45B7D1'
    },
    {
      id: 'reading',
      name: 'Kuwento Time',
      icon: '📖',
      description: 'Read and understand Filipino stories and passages',
      color: '#FFA726'
    },
    {
      id: 'culture',
      name: 'Kultura Quest',
      icon: '🇵🇭',
      description: 'Learn about Filipino culture, traditions, and values',
      color: '#FF6B6B'
    }
  ];

  const generateFilipinoProblem = (gameType, currentLevel) => {
    let problem, answer, options;
    
    switch (gameType) {
      case 'vocabulary':
        const vocabWords = [
          { word: 'Bahay', meaning: 'House', options: ['House', 'Car', 'Tree', 'Book'] },
          { word: 'Aso', meaning: 'Dog', options: ['Cat', 'Dog', 'Bird', 'Fish'] },
          { word: 'Puno', meaning: 'Tree', options: ['Flower', 'Grass', 'Tree', 'Rock'] },
          { word: 'Libro', meaning: 'Book', options: ['Book', 'Pen', 'Paper', 'Bag'] },
          { word: 'Kotse', meaning: 'Car', options: ['Bike', 'Bus', 'Car', 'Train'] },
          { word: 'Ibon', meaning: 'Bird', options: ['Fish', 'Bird', 'Butterfly', 'Bee'] },
          { word: 'Bulaklak', meaning: 'Flower', options: ['Leaf', 'Flower', 'Stem', 'Root'] },
          { word: 'Tubig', meaning: 'Water', options: ['Fire', 'Water', 'Air', 'Earth'] }
        ];
        const vocabItem = vocabWords[Math.floor(Math.random() * vocabWords.length)];
        problem = `What does "${vocabItem.word}" mean in English?`;
        answer = vocabItem.meaning;
        options = vocabItem.options;
        break;
      
      case 'grammar':
        const grammarQuestions = [
          {
            question: 'Which is the correct Filipino greeting for "Good Morning"?',
            answer: 'Magandang umaga',
            options: ['Magandang umaga', 'Magandang hapon', 'Magandang gabi', 'Magandang tanghali']
          },
          {
            question: 'What is the Filipino word for "Thank you"?',
            answer: 'Salamat',
            options: ['Salamat', 'Walang anuman', 'Pakisuyo', 'Paki']
          },
          {
            question: 'How do you say "How are you?" in Filipino?',
            answer: 'Kumusta ka?',
            options: ['Ano ang pangalan mo?', 'Kumusta ka?', 'Saan ka pupunta?', 'Anong oras na?']
          },
          {
            question: 'What does "Mahal kita" mean?',
            answer: 'I love you',
            options: ['I like you', 'I love you', 'I miss you', 'I need you']
          }
        ];
        const grammarItem = grammarQuestions[Math.floor(Math.random() * grammarQuestions.length)];
        problem = grammarItem.question;
        answer = grammarItem.answer;
        options = grammarItem.options;
        break;
      
      case 'reading':
        const readingPassages = [
          {
            passage: 'Si Maria ay isang magandang batang babae. Mahilig siyang magbasa ng libro at magsulat ng kuwento. Tuwing umaga, naglalakad siya papunta sa paaralan kasama ang kanyang mga kaibigan.',
            question: 'Ano ang ginagawa ni Maria tuwing umaga?',
            answer: 'Naglalakad papunta sa paaralan',
            options: ['Naglalakad papunta sa paaralan', 'Nagtutulog', 'Kumakain', 'Naglalaro']
          },
          {
            passage: 'Ang Pilipinas ay isang magandang bansa sa Timog-Silangang Asya. Mayaman ito sa likas na yaman at may magagandang tanawin. Ang mga Pilipino ay kilala sa kanilang pagiging masayahin at mabait.',
            question: 'Saan matatagpuan ang Pilipinas?',
            answer: 'Timog-Silangang Asya',
            options: ['Hilagang Amerika', 'Europa', 'Timog-Silangang Asya', 'Aprika']
          }
        ];
        const readingItem = readingPassages[Math.floor(Math.random() * readingPassages.length)];
        problem = `${readingItem.passage}\n\nQuestion: ${readingItem.question}`;
        answer = readingItem.answer;
        options = readingItem.options;
        break;
      
      case 'culture':
        const cultureQuestions = [
          {
            question: 'What is the national flower of the Philippines?',
            answer: 'Sampaguita',
            options: ['Rose', 'Sampaguita', 'Orchid', 'Sunflower']
          },
          {
            question: 'What traditional Filipino dance involves balancing bamboo poles?',
            answer: 'Tinikling',
            options: ['Cariñosa', 'Tinikling', 'Pandanggo', 'Kuratsa']
          },
          {
            question: 'What is the national animal of the Philippines?',
            answer: 'Carabao',
            options: ['Eagle', 'Carabao', 'Tiger', 'Lion']
          },
          {
            question: 'What Filipino festival is known for its colorful costumes and street dancing?',
            answer: 'Sinulog',
            options: ['Pahiyas', 'Sinulog', 'Ati-Atihan', 'Dinagyang']
          }
        ];
        const cultureItem = cultureQuestions[Math.floor(Math.random() * cultureQuestions.length)];
        problem = cultureItem.question;
        answer = cultureItem.answer;
        options = cultureItem.options;
        break;
      
      default:
        return null;
    }

    return { problem, answer, options, type: gameType };
  };

  const startGame = (gameType) => {
    setCurrentGame(gameType);
    setScore(0);
    setLevel(1);
    setStreak(0);
    const newGameData = generateFilipinoProblem(gameType, 1);
    setGameData(newGameData);
    setUserAnswer('');
    setFeedback('');
    setIsCorrect(null);
  };

  const checkAnswer = () => {
    if (userAnswer === '') return;
    
    const isAnswerCorrect = userAnswer === gameData.answer;
    setIsCorrect(isAnswerCorrect);
    
    if (isAnswerCorrect) {
      const newScore = score + 10 + (streak * 2);
      const newStreak = streak + 1;
      setScore(newScore);
      setStreak(newStreak);
      setFeedback('Tama! Magaling! 🎉');
      
      setTimeout(() => {
        if (newStreak % 5 === 0) {
          setLevel(level + 1);
        }
        const nextProblem = generateFilipinoProblem(currentGame, level + 1);
        setGameData(nextProblem);
        setUserAnswer('');
        setFeedback('');
        setIsCorrect(null);
      }, 1500);
    } else {
      setStreak(0);
      setFeedback(`Mali. Ang tamang sagot ay "${gameData.answer}". Subukan ulit! 💪`);
      
      setTimeout(() => {
        setFeedback('');
        setIsCorrect(null);
      }, 2000);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      checkAnswer();
    }
  };

  const resetGame = () => {
    setCurrentGame('menu');
    setScore(0);
    setLevel(1);
    setStreak(0);
    setGameData(null);
    setUserAnswer('');
    setFeedback('');
    setIsCorrect(null);
  };

  return (
    <div className="filipino-game">
      <div className="container">
        {/* Header */}
        <motion.div 
          className="game-header"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Link to="/subjects" className="back-btn">
            ← Back to Subjects
          </Link>
          <h1 className="game-title">Filipino Language Games</h1>
          <div className="game-stats">
            <div className="stat">
              <span className="stat-label">Score:</span>
              <span className="stat-value">{score}</span>
            </div>
            <div className="stat">
              <span className="stat-label">Level:</span>
              <span className="stat-value">{level}</span>
            </div>
            <div className="stat">
              <span className="stat-label">Streak:</span>
              <span className="stat-value">{streak}</span>
            </div>
          </div>
        </motion.div>

        <AnimatePresence mode="wait">
          {currentGame === 'menu' ? (
            <motion.div
              key="menu"
              className="game-menu"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.5 }}
            >
              <h2>Piliin ang Iyong Filipino Adventure!</h2>
              <div className="games-grid">
                {games.map((game, index) => (
                  <motion.div
                    key={game.id}
                    className="game-card"
                    style={{ '--game-color': game.color }}
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    whileHover={{ y: -10, scale: 1.05 }}
                    onClick={() => startGame(game.id)}
                  >
                    <div className="game-icon">{game.icon}</div>
                    <h3>{game.name}</h3>
                    <p>{game.description}</p>
                    <button className="play-btn">Laruin Ngayon</button>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="gameplay"
              className="gameplay-area"
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.5 }}
            >
              <div className="game-info">
                <h2>{games.find(g => g.id === currentGame)?.name}</h2>
                <p>Level {level} - Score: {score}</p>
              </div>

              <div className="problem-container">
                <div className="problem">
                  {gameData?.type === 'reading' ? (
                    <div className="reading-problem">
                      <p className="reading-passage">{gameData.problem.split('\n\n')[0]}</p>
                      <h3 className="reading-question">{gameData.problem.split('\n\n')[1]}</h3>
                    </div>
                  ) : (
                    <h3 className="filipino-problem">{gameData?.problem}</h3>
                  )}
                </div>

                <div className="answer-section">
                  <label htmlFor="answer">Your Answer:</label>
                  <select
                    id="answer"
                    value={userAnswer}
                    onChange={(e) => setUserAnswer(e.target.value)}
                    className={`answer-select ${isCorrect === false ? 'incorrect' : ''}`}
                  >
                    <option value="">Select an answer</option>
                    {gameData?.options.map((option, index) => (
                      <option key={index} value={option}>{option}</option>
                    ))}
                  </select>
                  <button 
                    onClick={checkAnswer}
                    className="submit-btn"
                    disabled={userAnswer === ''}
                  >
                    Submit Answer
                  </button>
                </div>

                {feedback && (
                  <motion.div
                    className={`feedback ${isCorrect ? 'correct' : 'incorrect'}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    {feedback}
                  </motion.div>
                )}

                <div className="game-controls">
                  <button onClick={resetGame} className="reset-btn">
                    Back to Menu
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default FilipinoGame;
