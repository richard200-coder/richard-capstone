import React, { useEffect, useMemo, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import './MathGame.css';

const SHAPE_LIBRARY = {
  circle: { label: 'Circle', color: '#FF6B6B', fact: 'A circle has one curved side and no corners.' },
  square: { label: 'Square', color: '#2ecc71', fact: 'A square has four equal sides and four right angles.' },
  triangle: { label: 'Triangle', color: '#f1c40f', fact: 'Triangles always have three sides and three corners.' },
  rectangle: { label: 'Rectangle', color: '#3498db', fact: 'Rectangles have two long sides and two short sides.' },
  star: { label: 'Star', color: '#ff9f43', fact: 'Stars have five points and look just like the night sky!' },
  hexagon: { label: 'Hexagon', color: '#9b59b6', fact: 'Hexagons have six equal sides, just like honeycomb cells.' },
  heart: { label: 'Heart', color: '#e91e63', fact: 'Hearts are a symbol of love and have two rounded curves at the top.' },
  moon: { label: 'Moon', color: '#ffd700', fact: 'The moon is a crescent shape that appears in the night sky.' },
  oval: { label: 'Oval', color: '#9c27b0', fact: 'Ovals are like stretched circles with two curved ends.' },
  diamond: { label: 'Diamond', color: '#00bcd4', fact: 'Diamonds have four equal sides arranged like a rotated square.' },
  pentagon: { label: 'Pentagon', color: '#ff5722', fact: 'Pentagons have five equal sides and five corners.' },
  octagon: { label: 'Octagon', color: '#4caf50', fact: 'Octagons have eight equal sides, like a stop sign.' }
};

const SHAPE_PUZZLES = [
  {
    id: 'circle',
    title: 'Perfect Circle',
    prompt: 'Drag the shape that matches the outline.',
    outline: 'circle',
    correctShape: 'circle',
    options: ['circle', 'triangle', 'square', 'rectangle', 'star', 'hexagon', 'heart'],
    successMessage: 'Spot on! Circles are round with no corners.'
  },
  {
    id: 'triangle',
    title: 'Triangle Target',
    prompt: 'Which shape fits the empty outline?',
    outline: 'triangle',
    correctShape: 'triangle',
    options: ['triangle', 'circle', 'rectangle', 'square', 'hexagon', 'star', 'moon'],
    successMessage: 'Great! Triangles always have three equal corners.'
  },
  {
    id: 'rectangle',
    title: 'Rectangle Builder',
    prompt: 'Find the shape with two long sides.',
    outline: 'rectangle',
    correctShape: 'rectangle',
    options: ['rectangle', 'hexagon', 'square', 'circle', 'triangle', 'star', 'oval'],
    successMessage: 'Yes! Rectangles have pairs of equal sides.'
  },
  {
    id: 'hexagon',
    title: 'Honeycomb Match',
    prompt: 'Drag the six-sided shape into place.',
    outline: 'hexagon',
    correctShape: 'hexagon',
    options: ['hexagon', 'star', 'circle', 'triangle', 'square', 'rectangle', 'diamond'],
    successMessage: 'Sweet! Bees love hexagons for building hives.'
  },
  {
    id: 'star',
    title: 'Super Star',
    prompt: 'Which shape shines like the outline?',
    outline: 'star',
    correctShape: 'star',
    options: ['star', 'triangle', 'square', 'hexagon', 'circle', 'rectangle', 'pentagon'],
    successMessage: 'You did it! Stars have five sparkling points.'
  }
];

const shuffleArray = (items) => {
  return [...items].sort(() => Math.random() - 0.5);
};

const MathGame = () => {
  const [currentPuzzleIndex, setCurrentPuzzleIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [completedCount, setCompletedCount] = useState(0);
  const [status, setStatus] = useState('waiting');
  const [message, setMessage] = useState('');
  const [isComplete, setIsComplete] = useState(false);
  const [optionOrder, setOptionOrder] = useState([]);
  const [shapePositions, setShapePositions] = useState({});
  const [answers, setAnswers] = useState([]); // Track all answers: [{ puzzleId, correctShape, selectedShape, isCorrect }]
  const [isMusicPlaying, setIsMusicPlaying] = useState(true);
  const audioRef = useRef(null);

  const currentPuzzle = SHAPE_PUZZLES[currentPuzzleIndex];

  // Generate wheel-like rotation for all shapes
  useEffect(() => {
    if (!currentPuzzle) return;
    setStatus('waiting');
    setMessage('');
    const shuffled = shuffleArray(currentPuzzle.options);
    setOptionOrder(shuffled);
    
    // All shapes rotate together like a wheel
    // Adjusted radius to fit within container with padding
    const wheelRadius = 80; // Adjusted radius to prevent clipping
    const rotationDuration = 5; // Speed of wheel rotation
    const rotationDirection = -1; // Counter-clockwise rotation
    
    // Position shapes evenly around the wheel
    const positions = {};
    shuffled.forEach((shapeId, index) => {
      // Distribute shapes evenly around the wheel (360 degrees / number of shapes)
      const angleStep = (2 * Math.PI) / shuffled.length;
      const startAngle = index * angleStep;
      
      positions[shapeId] = {
        radius: wheelRadius,
        startAngle,
        duration: rotationDuration,
        direction: rotationDirection,
        delay: 0 // All shapes rotate together
      };
    });
    setShapePositions(positions);
  }, [currentPuzzleIndex, currentPuzzle]);

  const progressPercentage = useMemo(() => {
    return Math.round((completedCount / SHAPE_PUZZLES.length) * 100);
  }, [completedCount]);

  // Handle background music
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = 0.3; // Set volume to 30%
      if (isMusicPlaying) {
        audioRef.current.play().catch(err => {
          console.log('Audio play failed:', err);
        });
      } else {
        audioRef.current.pause();
      }
    }
  }, [isMusicPlaying]);

  // Auto-play music when component mounts
  useEffect(() => {
    if (audioRef.current && isMusicPlaying) {
      audioRef.current.play().catch(err => {
        console.log('Auto-play prevented:', err);
      });
    }
  }, []);

  const toggleMusic = () => {
    setIsMusicPlaying(!isMusicPlaying);
  };

  const handleShapeClick = (shapeId) => {
    attemptPlacement(shapeId);
  };

  const attemptPlacement = (shapeId) => {
    if (!shapeId || !currentPuzzle) return;

    // Record the answer
    const isCorrect = shapeId === currentPuzzle.correctShape;
    const answerRecord = {
      puzzleId: currentPuzzle.id,
      puzzleTitle: currentPuzzle.title,
      correctShape: currentPuzzle.correctShape,
      selectedShape: shapeId,
      isCorrect: isCorrect
    };

    setAnswers((prev) => [...prev, answerRecord]);
    
    if (isCorrect) {
      setScore((prev) => prev + 20);
    }
    
    setCompletedCount((prev) => prev + 1);

    // Always proceed to next question
    if (currentPuzzleIndex === SHAPE_PUZZLES.length - 1) {
      setIsComplete(true);
    } else {
      setCurrentPuzzleIndex((prev) => prev + 1);
    }
  };


  const handlePlayAgain = () => {
    setCurrentPuzzleIndex(0);
    setScore(0);
    setCompletedCount(0);
    setStatus('waiting');
    setMessage('');
    setIsComplete(false);
    setAnswers([]);
  };

  return (
    <div className="math-game">
      <audio
        ref={audioRef}
        loop
        preload="auto"
      >
        <source src="/math-game-bg-music.mp3.mp3" type="audio/mpeg" />
        Your browser does not support the audio element.
      </audio>
      <div className="container">
        <motion.div
          className="game-header"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', marginBottom: '0.5rem' }}>
            <Link to="/subjects" className="back-btn">
              ← Back to Subjects
            </Link>
            <button 
              onClick={toggleMusic} 
              className="music-toggle-btn"
              aria-label={isMusicPlaying ? 'Mute music' : 'Play music'}
            >
              {isMusicPlaying ? '🔊' : '🔇'}
            </button>
          </div>
          <h1 className="game-title">Mathematics Shape Builder</h1>
          <div className="game-stats">
            <div className="stat">
              <span className="stat-label">Score</span>
              <span className="stat-value">{score}</span>
            </div>
            <div className="stat">
              <span className="stat-label">Shapes Completed</span>
              <span className="stat-value">
                {completedCount}/{SHAPE_PUZZLES.length}
              </span>
            </div>
            <div className="stat progress">
              <span className="stat-label">Progress</span>
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: `${progressPercentage}%` }}></div>
              </div>
            </div>
          </div>
        </motion.div>

        {isComplete ? (
          <motion.div
            className="shape-summary"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <h2>Game Complete! 🎉</h2>
            <p>You completed all puzzles and earned {score} points.</p>
            <div className="summary-stats">
              <div>
                <span>Total Score</span>
                <strong>{score}</strong>
              </div>
              <div>
                <span>Correct Answers</span>
                <strong>{answers.filter(a => a.isCorrect).length}/{answers.length}</strong>
              </div>
            </div>
            
            <div className="answers-review">
              <h3>Review Your Answers</h3>
              <div className="answers-list">
                {answers.map((answer, index) => (
                  <div key={index} className={`answer-item ${answer.isCorrect ? 'correct' : 'incorrect'}`}>
                    <div className="answer-header">
                      <span className="answer-number">Question {index + 1}: {answer.puzzleTitle}</span>
                      <span className={`answer-status ${answer.isCorrect ? 'correct' : 'incorrect'}`}>
                        {answer.isCorrect ? '✓ Correct' : '✗ Incorrect'}
                      </span>
                    </div>
                    <div className="answer-details">
                      <div className="answer-shape">
                        <span className="answer-label">Your Answer:</span>
                        <div className={`shape-preview ${answer.selectedShape}`} style={{ '--shape-color': SHAPE_LIBRARY[answer.selectedShape].color }}>
                          <div className="shape-visual-small"></div>
                          <span>{SHAPE_LIBRARY[answer.selectedShape].label}</span>
                        </div>
                      </div>
                      {!answer.isCorrect && (
                        <div className="answer-shape">
                          <span className="answer-label">Correct Answer:</span>
                          <div className={`shape-preview ${answer.correctShape}`} style={{ '--shape-color': SHAPE_LIBRARY[answer.correctShape].color }}>
                            <div className="shape-visual-small"></div>
                            <span>{SHAPE_LIBRARY[answer.correctShape].label}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <button className="play-again-btn" onClick={handlePlayAgain}>
              Play Again
            </button>
          </motion.div>
        ) : !currentPuzzle ? (
          <div className="shape-lab">
            <p>Loading puzzle...</p>
          </div>
        ) : (
          <motion.div
            className="shape-lab"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            key={currentPuzzle.id}
          >
            <div className="puzzle-header">
              <p className="puzzle-count">
                Puzzle {currentPuzzleIndex + 1} of {SHAPE_PUZZLES.length}
              </p>
              <h2 className="question-text">Find the {SHAPE_LIBRARY[currentPuzzle?.correctShape]?.label.toLowerCase() || 'shape'}</h2>
            </div>

            <div className="shape-playground">
              <div className="shape-tray">
                <div className="shape-options">
                  {optionOrder.map((shapeId) => {
                    const shape = SHAPE_LIBRARY[shapeId];
                    const motionParams = shapePositions[shapeId] || { 
                      radius: 20, 
                      startAngle: 0, 
                      duration: 3, 
                      direction: 1, 
                      delay: 0 
                    };
                    
                    // Create circular motion keyframes (smooth circle with 12 points)
                    const createCircularKeyframes = (radius, startAngle, direction) => {
                      const steps = 12;
                      const keyframes = [];
                      for (let i = 0; i <= steps; i++) {
                        const progress = i / steps;
                        const angle = startAngle + (direction * progress * Math.PI * 2);
                        keyframes.push({
                          x: Math.cos(angle) * radius,
                          y: Math.sin(angle) * radius
                        });
                      }
                      return keyframes;
                    };
                    
                    const circularPath = createCircularKeyframes(motionParams.radius, motionParams.startAngle, motionParams.direction);
                    
                    // Extract x and y arrays for framer-motion animation
                    const xKeyframes = circularPath.map(p => p.x);
                    const yKeyframes = circularPath.map(p => p.y);
                    
                    return (
                      <motion.div
                        key={shapeId}
                        className={`shape-token ${shapeId} moving clickable`}
                        onClick={() => handleShapeClick(shapeId)}
                        style={{ '--shape-color': shape.color }}
                        animate={{
                          x: xKeyframes,
                          y: yKeyframes,
                        }}
                        transition={{
                          duration: motionParams.duration,
                          repeat: Infinity,
                          ease: "linear",
                          delay: motionParams.delay,
                          times: circularPath.map((_, i) => i / (circularPath.length - 1))
                        }}
                      >
                        <div className="shape-visual"></div>
                      </motion.div>
                    );
                  })}
                </div>
                <div className="shape-fact">
                  {message || SHAPE_LIBRARY[currentPuzzle?.correctShape]?.fact || 'Keep playing!'}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default MathGame;
