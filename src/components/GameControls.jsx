import { motion } from 'framer-motion';
import './GameControls.css';

export default function GameControls({ 
  level,
  movesLeft, 
  onSubmit, 
  onReset,
  onShowInstructions
}) {
  return (
    <div className="game-controls">
      <div className="moves-indicator">
        <span className="moves-label">Moves left</span>
        <span className="moves-value">{movesLeft ?? 0}</span>
      </div>
      
      <motion.button
        className="btn-done"
        onClick={onSubmit}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        Done
      </motion.button>
    </div>
  );
}
