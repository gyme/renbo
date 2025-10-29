import { motion, AnimatePresence } from 'framer-motion';
import './InstructionsModal.css';

export default function InstructionsModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="modal-overlay" onClick={onClose}>
        <motion.div
          className="instructions-modal"
          onClick={(e) => e.stopPropagation()}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
        >
          <div className="modal-header">
            <h2>🎨 How to Play</h2>
            <button className="close-btn" onClick={onClose}>×</button>
          </div>

          <div className="instructions-content">
            <section>
              <h3>🎯 Goal</h3>
              <p>Arrange the colored pencils in the most ideal order, just like an AI would sort them!</p>
            </section>

            <section>
              <h3>🎮 Controls</h3>
              <ul>
                <li><strong>Drag & Drop:</strong> Click and drag pencils to rearrange them</li>
                <li><strong>Zoom:</strong> Click on a pencil to zoom in and inspect subtle color differences</li>
                <li><strong>Submit:</strong> Click "Done!" when you think your arrangement is perfect</li>
              </ul>
            </section>

            <section>
              <h3>📊 Scoring</h3>
              <p>Your arrangement is compared to the ideal AI-sorted version using:</p>
              <ul>
                <li><strong>Position Accuracy:</strong> How close each pencil is to its ideal position</li>
                <li><strong>Order Accuracy:</strong> How well you maintained the relative ordering</li>
                <li><strong>Color Flow:</strong> How smoothly colors transition from one to the next</li>
              </ul>
            </section>

            <section>
              <h3>🎯 Strategy Tips</h3>
              <ul>
                <li>Sort by hue only (red → orange → yellow → green → blue → purple)</li>
                <li>Follow the color wheel order</li>
                <li>Look carefully at the subtle color differences!</li>
                <li>The first pencil is locked as a reference point</li>
              </ul>
            </section>

            <section>
              <h3>⭐ Levels</h3>
              <p>Infinite levels with increasing difficulty:</p>
              <ul>
                <li>Each level adds one more pencil (Level 1 = 5 pencils, Level 2 = 6 pencils, etc.)</li>
                <li>Subtler color differences as you progress</li>
                <li>Try to complete levels with fewer moves!</li>
                <li>No level cap - see how far you can go!</li>
              </ul>
            </section>
          </div>

          <div className="modal-actions">
            <button className="btn btn-primary" onClick={onClose}>
              Got it! Let's Play
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

