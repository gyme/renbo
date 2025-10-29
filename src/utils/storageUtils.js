// Local storage utilities for leaderboard persistence

const LEADERBOARD_KEY = 'pencil_game_leaderboard';
const MAX_LEADERBOARD_ENTRIES = 100;

/**
 * Save a score to the leaderboard
 * @param {Object} entry - Score entry { score, level, date, pencilCount }
 */
export function saveScore(entry) {
  const leaderboard = getLeaderboard(entry.level);
  
  leaderboard.push({
    ...entry,
    id: Date.now(),
    date: new Date().toISOString()
  });
  
  // Sort by score descending
  leaderboard.sort((a, b) => b.score - a.score);
  
  // Keep only top entries
  const trimmed = leaderboard.slice(0, MAX_LEADERBOARD_ENTRIES);
  
  // Save back to localStorage
  const allData = getAllLeaderboardData();
  allData[`level_${entry.level}`] = trimmed;
  localStorage.setItem(LEADERBOARD_KEY, JSON.stringify(allData));
  
  return trimmed;
}

/**
 * Get leaderboard for a specific level
 * @param {number} level - Game level
 * @returns {Array} Sorted leaderboard entries
 */
export function getLeaderboard(level) {
  const allData = getAllLeaderboardData();
  return allData[`level_${level}`] || [];
}

/**
 * Get all leaderboard data
 * @returns {Object} All leaderboard data organized by level
 */
function getAllLeaderboardData() {
  try {
    const data = localStorage.getItem(LEADERBOARD_KEY);
    return data ? JSON.parse(data) : {};
  } catch (error) {
    console.error('Error reading leaderboard:', error);
    return {};
  }
}

/**
 * Get player's rank on the leaderboard
 * @param {number} score - Player's score
 * @param {number} level - Game level
 * @returns {number} Rank (1-based)
 */
export function getPlayerRank(score, level) {
  const leaderboard = getLeaderboard(level);
  const rank = leaderboard.filter(entry => entry.score > score).length + 1;
  return rank;
}

/**
 * Get top N players from leaderboard
 * @param {number} level - Game level
 * @param {number} count - Number of top players to return
 * @returns {Array} Top players
 */
export function getTopPlayers(level, count = 10) {
  return getLeaderboard(level).slice(0, count);
}

/**
 * Clear all leaderboard data (for testing/reset)
 */
export function clearLeaderboard() {
  localStorage.removeItem(LEADERBOARD_KEY);
}


