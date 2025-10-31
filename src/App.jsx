import { useState, useEffect } from 'react';
import PencilBoxCanvas from './components/PencilBoxCanvas';
import ScoreModal from './components/ScoreModal';
import Leaderboard from './components/Leaderboard';
import GameControls from './components/GameControls';
import InstructionsModal from './components/InstructionsModal';
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
  const [currentScore, setCurrentScore] = useState(null);
  const [leaderboard, setLeaderboard] = useState([]);
  const [moveCount, setMoveCount] = useState(0);

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
  }, [level]);

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
    
    setShowScoreModal(false);
    setCurrentScore(null);
    setMoveCount(0);
  }

  function handlePencilsReorder(newOrder) {
    console.log('handlePencilsReorder called');
    console.log('Current pencils:', pencils.map(p => p.id));
    console.log('New order:', newOrder.map(p => p.id));
    
    // Ensure the darkest pencil (last one) stays at the bottom
    const darkestPencil = newOrder[newOrder.length - 1];
    const otherPencils = newOrder.slice(0, -1);
    
    // Reconstruct with darkest always last
    const finalOrder = [...otherPencils, darkestPencil];
    
    console.log('Final order:', finalOrder.map(p => p.id));
    
    // Check if the order actually changed by comparing pencil IDs
    const hasChanged = pencils.length !== finalOrder.length || 
      pencils.some((pencil, index) => pencil.id !== finalOrder[index].id);
    
    console.log('Has changed:', hasChanged);
    console.log('Current move count:', moveCount);
    
    // Only update state and increment move count if there was an actual change
    if (hasChanged) {
      setPencils(finalOrder);
      setMoveCount(prevCount => {
        console.log('Incrementing move count from', prevCount, 'to', prevCount + 1);
        return prevCount + 1;
      });
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
    setLevel(level + 1);
    setShowScoreModal(false);
  }

  function handleRetry() {
    setShowScoreModal(false);
    initializeLevel(level);
  }

  return (
    <div className="app">
      <header className="app-header">
        <div className="logo-section">
          <img src="/renbo-logo.png" alt="Renbo" className="app-logo" 
               onError={(e) => {e.target.style.display = 'none'; e.target.parentElement.innerHTML += '<div style="font-size:56px;font-weight:800;background:linear-gradient(90deg,#FF5722 0%,#FFD600 25%,#FFD600 50%,#4CAF50 75%,#2196F3 100%);-webkit-background-clip:text;-webkit-text-fill-color:transparent;text-shadow:3px 3px 6px rgba(0,0,0,0.3)">Renbo</div>';}} />
        </div>
        
        <GameControls
          level={level}
          moveCount={moveCount}
          onSubmit={handleSubmit}
          onReset={handleReset}
          onShowInstructions={() => setShowInstructions(true)}
        />
      </header>

      <main className="app-main">
        <div className="game-section">
          <PencilBoxCanvas
            pencils={pencils}
            onPencilsReorder={handlePencilsReorder}
            disabled={showScoreModal}
          />
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

    </div>
  );
}

export default App;
