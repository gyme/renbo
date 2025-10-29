import { motion } from 'framer-motion';
import './GameControls.css';

export default function GameControls({ 
  level,
  moveCount, 
  onSubmit, 
  onReset,
  onShowInstructions
}) {
  return (
    <div className="game-controls">
      <div className="controls-row">
        <div className="level-moves-container">
          <div className="level-badge">
            <span className="badge-label">Level</span>
            <span className="badge-value">{level}</span>
          </div>
          
          <div className="moves-badge">
            <span className="badge-label">Moves</span>
            <span className="badge-value">{moveCount}</span>
          </div>
        </div>

        <div className="action-buttons-inline">
          <motion.button
            className="btn-elegant btn-done"
            onClick={onSubmit}
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.98 }}
          >
            <span className="btn-icon-text">✓</span>
            <span className="btn-text">DONE</span>
          </motion.button>
        </div>
      </div>
    </div>
  );
}
