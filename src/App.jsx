import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import PencilBoxCanvas from './components/PencilBoxCanvas';
import ScoreModal from './components/ScoreModal';
import Leaderboard from './components/Leaderboard';
import GameControls from './components/GameControls';
import InstructionsModal from './components/InstructionsModal';
import LevelMap from './components/LevelMap.jsx';
import Menu from './components/Menu.jsx';
import { generatePencils, sortPencils } from './utils/colorUtils';
import { calculateScore, calculatePercentile } from './utils/scoreUtils';
import { saveScore, getLeaderboard, saveCurrentLevel, getCurrentLevel } from './utils/storageUtils';
import './App.css';

function App() {
  const [level, setLevel] = useState(() => getCurrentLevel());
  const [pencils, setPencils] = useState([]);
  const [idealOrder, setIdealOrder] = useState([]);
  const [showScoreModal, setShowScoreModal] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);
  const [showLevelMap, setShowLevelMap] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [currentScore, setCurrentScore] = useState(null);
  const [leaderboard, setLeaderboard] = useState([]);
  const [movesLeft, setMovesLeft] = useState(null);
  const prevMovesLeftRef = useRef(null);

  // Initialize max unlocked level on first load
  useEffect(() => {
    const maxUnlocked = localStorage.getItem('maxUnlockedLevel');
    if (!maxUnlocked) {
      localStorage.setItem('maxUnlockedLevel', level.toString());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Run only once on mount

  // Initialize game
  useEffect(() => {
    initializeLevel(level);
  }, [level]);

  // Load leaderboard
  useEffect(() => {
    setLeaderboard(getLeaderboard(level));
  }, [level]);

  // Save level to localStorage whenever it changes
  useEffect(() => {
    saveCurrentLevel(level);
    
    // Update max unlocked level
    const currentMax = parseInt(localStorage.getItem('maxUnlockedLevel') || '1', 10);
    if (level > currentMax) {
      localStorage.setItem('maxUnlockedLevel', level.toString());
    }
  }, [level]);

  // Auto-submit when moves reach 0 (only if it went from > 0 to 0, not initial load)
  useEffect(() => {
    if (movesLeft === 0 && 
        prevMovesLeftRef.current !== null && 
        prevMovesLeftRef.current > 0 && 
        pencils.length > 0 && 
        !showScoreModal && 
        idealOrder.length > 0) {
      handleSubmit();
    }
    prevMovesLeftRef.current = movesLeft;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [movesLeft]);

  function initializeLevel(lvl) {
    // Level 1 = 5 pencils, Level 2 = 6 pencils, etc.
    const pencilCount = 4 + lvl;
    
    // Generate random pencils
    const newPencils = generatePencils(pencilCount, lvl);
    
    // Store ideal order
    const ideal = sortPencils(newPencils);
    setIdealOrder(ideal);
    
    // Find the darkest pencil (lowest lightness)
    const darkestPencil = newPencils.reduce((darkest, current) => 
      current.hsl.l < darkest.hsl.l ? current : darkest
    , newPencils[0]);
    
    // Shuffle all pencils except the darkest
    const otherPencils = newPencils.filter(p => p.id !== darkestPencil.id);
    const shuffledOthers = [...otherPencils].sort(() => Math.random() - 0.5);
    
    // Place darkest pencil at the bottom (last position)
    const shuffled = [...shuffledOthers, darkestPencil];
    setPencils(shuffled);
    
    // Calculate average moves needed for this level
    // Average moves ≈ pencilCount * 1.5 (accounts for sorting complexity)
    const averageMoves = Math.max(3, Math.ceil(pencilCount * 1.5));
    setMovesLeft(averageMoves);
    prevMovesLeftRef.current = averageMoves;
    
    setShowScoreModal(false);
    setCurrentScore(null);
  }

  function handlePencilsReorder(newOrder) {
    // Ensure the darkest pencil (last one) stays at the bottom
    const darkestPencil = newOrder[newOrder.length - 1];
    const otherPencils = newOrder.slice(0, -1);
    
    // Reconstruct with darkest always last
    const finalOrder = [...otherPencils, darkestPencil];
    
    // Check if the order actually changed by comparing pencil IDs
    const hasChanged = pencils.length !== finalOrder.length || 
      pencils.some((pencil, index) => pencil.id !== finalOrder[index].id);
    
    // Only update state and decrement moves left if there was an actual change
    if (hasChanged) {
      setPencils(finalOrder);
      setMovesLeft(prevMoves => Math.max(0, prevMoves - 1));
    }
  }

  function handleSubmit() {
    // Calculate score
    const score = calculateScore(pencils, idealOrder);
    
    // Calculate percentile
    const percentile = calculatePercentile(score.total, leaderboard);
    
    // Save to leaderboard
    const entry = {
      score: score.total,
      level,
      pencilCount: pencils.length,
    };
    const updatedLeaderboard = saveScore(entry);
    setLeaderboard(updatedLeaderboard);
    
    // Show results
    setCurrentScore({
      ...score,
      percentile,
    });
    setShowScoreModal(true);
  }

  function handleReset() {
    initializeLevel(level);
  }

  function handleNextLevel() {
    // Infinite levels!
    const nextLevel = level + 1;
    setLevel(nextLevel);
    
    // Update max unlocked level
    const currentMax = parseInt(localStorage.getItem('maxUnlockedLevel') || '1', 10);
    if (nextLevel > currentMax) {
      localStorage.setItem('maxUnlockedLevel', nextLevel.toString());
    }
    
    setShowScoreModal(false);
  }

  function handleRetry() {
    setShowScoreModal(false);
    initializeLevel(level);
  }

  function handleSelectLevel(selectedLevel) {
    setLevel(selectedLevel);
    setShowLevelMap(false);
  }

  function handleOpenLevelMap() {
    setShowLevelMap(true);
    setShowMenu(false);
  }

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-spacer"></div>
        
        <div className="logo-section">
          <img src="/renbo-logo.svg" alt="Renbo" className="renbo-logo-img" />
        </div>
        
        <motion.button 
          className="hamburger-button"
          onClick={() => setShowMenu(true)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <svg viewBox="0 0 24 24" fill="none">
            <path d="M3 12H21M3 6H21M3 18H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </motion.button>
      </header>

      <main className="app-main">
        <div className="moves-section">
          <div className="moves-indicator">
            <span className="moves-label">Moves left</span>
            <span className="moves-value">{movesLeft ?? 0}</span>
          </div>
        </div>
        
        <div className="game-section">
          <PencilBoxCanvas
            pencils={pencils}
            onPencilsReorder={handlePencilsReorder}
            disabled={showScoreModal}
          />
        </div>

        <div className="done-button-section">
          <motion.button
            className="btn-done"
            onClick={handleSubmit}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Done
          </motion.button>
        </div>
      </main>

      {showScoreModal && currentScore && (
        <ScoreModal
          isOpen={showScoreModal}
          score={{ total: currentScore.total }}
          percentile={currentScore.percentile}
          breakdown={currentScore.breakdown}
          level={level}
          onClose={() => setShowScoreModal(false)}
          onNextLevel={handleNextLevel}
          onRetry={handleRetry}
        />
      )}

      <InstructionsModal
        isOpen={showInstructions}
        onClose={() => setShowInstructions(false)}
      />

      <AnimatePresence>
        {showLevelMap && (
          <LevelMap
            currentLevel={level}
            onSelectLevel={handleSelectLevel}
            onClose={() => setShowLevelMap(false)}
          />
        )}
      </AnimatePresence>

      <Menu
        isOpen={showMenu}
        onClose={() => setShowMenu(false)}
        onOpenLevelMap={handleOpenLevelMap}
        currentLevel={level}
      />

    </div>
  );
}

export default App;
