import { colorDistance } from './colorUtils';

/**
 * Calculate similarity score based ONLY on lightness ordering
 * Compares how well the user's arrangement matches the ideal lightness order (light to dark)
 * 
 * @param {Array} userOrder - User's pencil arrangement
 * @param {Array} idealOrder - Ideal sorted arrangement by lightness (lightest to darkest)
 * @returns {Object} Score object with percentage (0-100)
 */
export function calculateScore(userOrder, idealOrder) {
  if (userOrder.length === 0) return { total: 0, breakdown: {} };
  
  // Calculate score based ONLY on lightness ordering (pairwise comparison)
  const lightnessOrderScore = calculateLightnessOrderScore(userOrder, idealOrder);
  
  return {
    total: Math.round(lightnessOrderScore),
    breakdown: {
      position: Math.round(lightnessOrderScore),
      ordering: Math.round(lightnessOrderScore),
      smoothness: Math.round(lightnessOrderScore)
    }
  };
}

function calculatePositionScore(userOrder, idealOrder) {
  const n = userOrder.length;
  let totalDistance = 0;
  const maxDistance = n - 1;
  
  userOrder.forEach((pencil, userIndex) => {
    const idealIndex = idealOrder.findIndex(p => p.id === pencil.id);
    const distance = Math.abs(userIndex - idealIndex);
    totalDistance += distance;
  });
  
  // Perfect score when totalDistance is 0, worst when it's n*(n-1)/2
  const maxPossibleDistance = (n * maxDistance) / 2;
  return Math.max(0, 100 * (1 - totalDistance / maxPossibleDistance));
}

/**
 * Calculate lightness ordering score using pairwise comparison
 * Checks if each pair of pencils is in the correct relative order by lightness
 */
function calculateLightnessOrderScore(userOrder, idealOrder) {
  const n = userOrder.length;
  let correctPairs = 0;
  let totalPairs = 0;
  
  // Check all pairs
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      const userPencil1 = userOrder[i];
      const userPencil2 = userOrder[j];
      
      const idealIndex1 = idealOrder.findIndex(p => p.id === userPencil1.id);
      const idealIndex2 = idealOrder.findIndex(p => p.id === userPencil2.id);
      
      // Check if the relative order matches
      if ((idealIndex1 < idealIndex2)) {
        correctPairs++;
      }
      totalPairs++;
    }
  }
  
  const score = (correctPairs / totalPairs) * 100;
  
  return score;
}

function calculateSmoothnessScore(userOrder, idealOrder) {
  if (userOrder.length < 2) return 100;
  
  // Calculate average color distance between adjacent pencils
  let userTotalDistance = 0;
  let idealTotalDistance = 0;
  
  for (let i = 0; i < userOrder.length - 1; i++) {
    userTotalDistance += colorDistance(userOrder[i].hsl, userOrder[i + 1].hsl);
    idealTotalDistance += colorDistance(idealOrder[i].hsl, idealOrder[i + 1].hsl);
  }
  
  const userAvgDistance = userTotalDistance / (userOrder.length - 1);
  const idealAvgDistance = idealTotalDistance / (idealOrder.length - 1);
  
  // The closer to ideal average distance, the better
  const ratio = Math.min(userAvgDistance, idealAvgDistance) / 
                Math.max(userAvgDistance, idealAvgDistance);
  
  return ratio * 100;
}

/**
 * Calculate percentile ranking compared to other players
 * @param {number} score - Player's score
 * @param {Array} leaderboard - Array of previous scores
 * @returns {number} Percentile (0-100)
 */
export function calculatePercentile(score, leaderboard) {
  if (leaderboard.length === 0) return 100;
  
  const worseScores = leaderboard.filter(entry => entry.score < score).length;
  return Math.round((worseScores / leaderboard.length) * 100);
}

/**
 * Get a rating based on score
 */
export function getRating(score) {
  if (score >= 95) return { stars: 5, text: 'Perfect!', emoji: '🎨' };
  if (score >= 85) return { stars: 4, text: 'Excellent!', emoji: '⭐' };
  if (score >= 75) return { stars: 3, text: 'Great!', emoji: '👍' };
  if (score >= 60) return { stars: 2, text: 'Good!', emoji: '👌' };
  return { stars: 1, text: 'Keep trying!', emoji: '💪' };
}

