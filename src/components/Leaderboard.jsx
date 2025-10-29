import { motion } from 'framer-motion';
import './Leaderboard.css';

export default function Leaderboard({ entries, currentScore, level }) {
  if (entries.length === 0) {
    return (
      <div className="leaderboard">
        <h3>Leaderboard - Level {level}</h3>
        <p className="no-scores">No scores yet. Be the first!</p>
      </div>
    );
  }

  return (
    <div className="leaderboard">
      <h3>🏆 Top Players - Level {level}</h3>
      <div className="leaderboard-list">
        {entries.slice(0, 10).map((entry, index) => (
          <motion.div
            key={entry.id}
            className={`leaderboard-entry ${entry.score === currentScore ? 'current' : ''}`}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <span className="rank">
              {index === 0 && '🥇'}
              {index === 1 && '🥈'}
              {index === 2 && '🥉'}
              {index > 2 && `#${index + 1}`}
            </span>
            <span className="score">{entry.score}%</span>
            <span className="date">{formatDate(entry.date)}</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function formatDate(dateString) {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  
  return date.toLocaleDateString();
}


