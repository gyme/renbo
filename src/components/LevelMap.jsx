import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import './LevelMap.css';

function LevelMap({ currentLevel, onSelectLevel, onClose }) {
  const [maxUnlockedLevel, setMaxUnlockedLevel] = useState(1);
  const [completedLevels, setCompletedLevels] = useState(new Set());

  useEffect(() => {
    // Load progress from localStorage
    const savedMaxLevel = localStorage.getItem('maxUnlockedLevel');
    if (savedMaxLevel) {
      setMaxUnlockedLevel(parseInt(savedMaxLevel, 10));
    } else {
      setMaxUnlockedLevel(currentLevel);
    }

    // Load completed levels
    const leaderboard = JSON.parse(localStorage.getItem('leaderboard') || '{}');
    const completed = new Set();
    Object.keys(leaderboard).forEach(level => {
      if (leaderboard[level] && leaderboard[level].length > 0) {
        completed.add(parseInt(level, 10));
      }
    });
    setCompletedLevels(completed);
  }, [currentLevel]);

  const handleLevelClick = (level) => {
    if (level <= maxUnlockedLevel) {
      onSelectLevel(level);
      onClose();
    }
  };

  const getLevelStatus = (level) => {
    if (level === currentLevel) return 'current';
    if (completedLevels.has(level)) return 'completed';
    if (level <= maxUnlockedLevel) return 'unlocked';
    return 'locked';
  };

  const renderLevelIcon = (status) => {
    if (status === 'locked') {
      return (
        <svg viewBox="0 0 24 24" fill="none" className="level-icon">
          <path d="M19 11H5C3.89543 11 3 11.8954 3 13V20C3 21.1046 3.89543 22 5 22H19C20.1046 22 21 21.1046 21 20V13C21 11.8954 20.1046 11 19 11Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M7 11V7C7 5.67392 7.52678 4.40215 8.46447 3.46447C9.40215 2.52678 10.6739 2 12 2C13.3261 2 14.5979 2.52678 15.5355 3.46447C16.4732 4.40215 17 5.67392 17 7V11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      );
    }
    if (status === 'completed') {
      return (
        <svg viewBox="0 0 24 24" fill="none" className="level-icon level-icon-check">
          <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      );
    }
    if (status === 'current') {
      return (
        <svg viewBox="0 0 24 24" fill="none" className="level-icon level-icon-star">
          <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      );
    }
    // unlocked
    return (
      <svg viewBox="0 0 24 24" fill="none" className="level-icon">
        <path d="M11 5H6C4.89543 5 4 5.89543 4 7V19C4 20.1046 4.89543 21 6 21H18C19.1046 21 20 20.1046 20 19V7C20 5.89543 19.1046 5 18 5H13M11 5C11 3.89543 11.8954 3 13 3H15C16.1046 3 17 3.89543 17 5M11 5V7M17 5V7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    );
  };

  // Generate levels to display (show up to max unlocked + 2)
  const levelsToShow = Math.max(15, maxUnlockedLevel + 2);
  const levels = Array.from({ length: levelsToShow }, (_, i) => i + 1);

  return (
    <div 
      className="level-map-overlay" 
      onClick={onClose}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 100001
      }}
    >
      <motion.div 
        className="level-map-container"
        onClick={(e) => e.stopPropagation()}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        style={{
          position: 'relative',
          zIndex: 100002
        }}
      >
        <div className="level-map-header">
          <h2>Level Map</h2>
          <button className="close-button" onClick={onClose}>
            <svg viewBox="0 0 24 24" fill="none">
              <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>

        <div className="level-map-scroll">
          <div className="level-map-path">
            {levels.map((level, index) => {
              const status = getLevelStatus(level);
              const isClickable = status !== 'locked';
              const position = index % 2 === 0 ? 'left' : 'right';
              
              return (
                <div key={level} className="level-path-item">
                  {index > 0 && (
                    <svg className={`level-connector connector-${position}`} viewBox="0 0 100 80" preserveAspectRatio="none">
                      <path
                        d={position === 'left' ? "M 80 0 Q 50 40, 20 80" : "M 20 0 Q 50 40, 80 80"}
                        stroke="#D0C8B8"
                        strokeWidth="3"
                        fill="none"
                        strokeDasharray="8,6"
                      />
                    </svg>
                  )}
                  
                  <motion.div
                    className={`level-node level-node-${status} level-node-${position}`}
                    onClick={() => handleLevelClick(level)}
                    whileHover={isClickable ? { scale: 1.05 } : {}}
                    whileTap={isClickable ? { scale: 0.95 } : {}}
                    style={{ cursor: isClickable ? 'pointer' : 'default' }}
                  >
                    <div className="level-node-inner">
                      <div className="level-icon-container">
                        {renderLevelIcon(status)}
                      </div>
                      <div className="level-number">{level}</div>
                    </div>
                    
                    {status === 'completed' && (
                      <div className="level-badge level-badge-completed">
                        <svg viewBox="0 0 24 24" fill="none">
                          <path d="M20 6L9 17L4 12" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>
                    )}
                  </motion.div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="level-map-footer">
          <motion.button
            className="continue-button"
            onClick={() => handleLevelClick(currentLevel)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Continue Playing
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}

export default LevelMap;

