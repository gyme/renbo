// Local storage utilities for leaderboard persistence

const LEADERBOARD_KEY = 'pencil_game_leaderboard';
const CURRENT_LEVEL_KEY = 'pencil_game_current_level';
const USER_ID_KEY = 'pencil_game_user_id';
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

/**
 * Get or create a unique user ID for this browser session
 * @returns {string} Unique user ID
 */
export function getOrCreateUserId() {
  try {
    let userId = localStorage.getItem(USER_ID_KEY);
    if (!userId) {
      // Generate a unique ID using timestamp and random number
      userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem(USER_ID_KEY, userId);
    }
    return userId;
  } catch (error) {
    console.error('Error getting/creating user ID:', error);
    // Fallback to a session-based ID if localStorage fails
    return `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}

/**
 * Save the current level to localStorage for the current user
 * @param {number} level - Current level to save
 */
export function saveCurrentLevel(level) {
  try {
    const userId = getOrCreateUserId();
    const userLevelKey = `${CURRENT_LEVEL_KEY}_${userId}`;
    localStorage.setItem(userLevelKey, JSON.stringify(level));
  } catch (error) {
    console.error('Error saving current level:', error);
  }
}

/**
 * Get the saved current level from localStorage for the current user
 * @returns {number} Saved level, or 1 if not found
 */
export function getCurrentLevel() {
  try {
    const userId = getOrCreateUserId();
    const userLevelKey = `${CURRENT_LEVEL_KEY}_${userId}`;
    const saved = localStorage.getItem(userLevelKey);
    if (saved) {
      const level = JSON.parse(saved);
      // Ensure it's a valid positive number
      return typeof level === 'number' && level > 0 ? level : 1;
    }
    return 1;
  } catch (error) {
    console.error('Error reading current level:', error);
    return 1;
  }
}
