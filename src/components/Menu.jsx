import { motion, AnimatePresence } from 'framer-motion';
import './Menu.css';

function Menu({ isOpen, onClose, onOpenLevelMap, currentLevel }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="menu-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ 
              duration: 0.3,
              ease: [0.4, 0, 0.2, 1]
            }}
            onClick={onClose}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              width: '100vw',
              height: '100vh',
              zIndex: 99998
            }}
          />
          
          {/* Menu Panel */}
          <motion.div
            className="menu-panel"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ 
              duration: 0.4,
              ease: [0.4, 0, 0.2, 1],
              opacity: { duration: 0.3 }
            }}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              width: '100vw',
              height: '100vh',
              zIndex: 99999
            }}
          >
            <div className="menu-header">
              <div className="menu-header-content">
                <h2>Menu</h2>
                <div className="menu-current-level">Level {currentLevel}</div>
              </div>
              <button className="menu-close-button" onClick={onClose}>
                <svg viewBox="0 0 24 24" fill="none">
                  <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>

            <div className="menu-content">
              <motion.button
                className="menu-item"
                onClick={onOpenLevelMap}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                whileHover={{ scale: 1.02, x: 5 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="menu-item-icon">
                  <svg viewBox="0 0 24 24" fill="none">
                    <path d="M9 20L3 17V4L9 7M9 20L15 17M9 20V7M15 17L21 20V7L15 4M15 17V4M9 7L15 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div className="menu-item-content">
                  <div className="menu-item-title">Level Map</div>
                  <div className="menu-item-subtitle">View all levels and progress</div>
                </div>
                <div className="menu-item-badge">{currentLevel}</div>
              </motion.button>

              <motion.button
                className="menu-item"
                onClick={() => {
                  // Instructions functionality can be added here
                  onClose();
                }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15, duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                whileHover={{ scale: 1.02, x: 5 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="menu-item-icon">
                  <svg viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                    <path d="M12 16V12M12 8H12.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                </div>
                <div className="menu-item-content">
                  <div className="menu-item-title">How to Play</div>
                  <div className="menu-item-subtitle">Learn the game rules</div>
                </div>
              </motion.button>

              <motion.button
                className="menu-item"
                onClick={() => {
                  // Statistics functionality can be added here
                  onClose();
                }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                whileHover={{ scale: 1.02, x: 5 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="menu-item-icon">
                  <svg viewBox="0 0 24 24" fill="none">
                    <path d="M18 20V10M12 20V4M6 20V14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div className="menu-item-content">
                  <div className="menu-item-title">Statistics</div>
                  <div className="menu-item-subtitle">View your progress</div>
                </div>
              </motion.button>

              <motion.button
                className="menu-item"
                onClick={() => {
                  // Settings functionality can be added here
                  onClose();
                }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25, duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                whileHover={{ scale: 1.02, x: 5 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="menu-item-icon">
                  <svg viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2"/>
                    <path d="M12 1V3M12 21V23M4.22 4.22L5.64 5.64M18.36 18.36L19.78 19.78M1 12H3M21 12H23M4.22 19.78L5.64 18.36M18.36 5.64L19.78 4.22" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                </div>
                <div className="menu-item-content">
                  <div className="menu-item-title">Settings</div>
                  <div className="menu-item-subtitle">Game preferences</div>
                </div>
              </motion.button>
            </div>

            <div className="menu-footer">
              <div className="menu-version">Version 1.0.0</div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

export default Menu;

