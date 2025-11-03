import { motion, AnimatePresence } from 'framer-motion';
import { getRating } from '../utils/scoreUtils';
import './ScoreModal.css';

export default function ScoreModal({ 
  isOpen, 
  score, 
  percentile, 
  level,
  onClose, 
  onNextLevel,
  onRetry 
}) {
  if (!isOpen) return null;

  const rating = getRating(score.total);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="modal-overlay" onClick={onClose}>
        <motion.div
          className="score-modal-simple"
          onClick={(e) => e.stopPropagation()}
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ type: "spring", duration: 0.4, bounce: 0.3 }}
        >
          {/* Score circle */}
          <motion.div
            className="score-circle"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200, damping: 15 }}
          >
            <svg className="circle-progress" viewBox="0 0 120 120">
              <circle
                className="circle-bg"
                cx="60"
                cy="60"
                r="54"
                fill="none"
                stroke="#e0e0e0"
                strokeWidth="8"
              />
              <motion.circle
                className="circle-fill"
                cx="60"
                cy="60"
                r="54"
                fill="none"
                stroke="#4a4a4a"
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={`${2 * Math.PI * 54}`}
                initial={{ strokeDashoffset: 2 * Math.PI * 54 }}
                animate={{ strokeDashoffset: 2 * Math.PI * 54 * (1 - score.total / 100) }}
                transition={{ delay: 0.4, duration: 1.2, ease: "easeOut" }}
              />
            </svg>
            <div className="score-text">
              <motion.div
                className="score-percentage"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                {score.total}%
              </motion.div>
            </div>
          </motion.div>

          {/* Rating text */}
          <motion.div
            className="rating-simple"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            {rating.text}
          </motion.div>

          {/* Percentile */}
          <motion.div
            className="percentile-text"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
          >
            You scored better than {percentile}% of players
          </motion.div>

          {/* Stats boxes */}
          <motion.div
            className="stats-boxes"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2 }}
          >
            <div className="stat-box">
              <div className="stat-icon">🎯</div>
              <div className="stat-value-simple">{score.total}%</div>
              <div className="stat-label-simple">Accuracy</div>
            </div>
            <div className="stat-box">
              <div className="stat-icon">⏱</div>
              <div className="stat-value-simple">{level}</div>
              <div className="stat-label-simple">Level</div>
            </div>
          </motion.div>

          {/* Action button - Show Next Level for 90% or higher, otherwise Retry */}
          {score.total >= 90 ? (
            <motion.button
              className="btn-next-simple"
              onClick={onNextLevel}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.4 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              ✨ Next Level →
            </motion.button>
          ) : (
            <motion.button
              className="btn-retry-simple"
              onClick={onRetry}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.4 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              🔄 Retry Level
            </motion.button>
          )}
        </motion.div>
      </div>
      )}
    </AnimatePresence>
  );
}
