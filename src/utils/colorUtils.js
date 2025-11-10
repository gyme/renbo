// Utility functions for color generation and sorting

/**
 * Predefined color palette - intuitive progression from light to dark
 * Uses consistent hue (same color family) with decreasing lightness for easier solving
 * Players just need to arrange from lightest to darkest within the same color spectrum
 */
const COLOR_PALETTE = [
  // Very light (90-80% lightness) - clearly the lightest
  { h: 30, s: 90, l: 92 },    // 1. Very pale peach
  { h: 30, s: 90, l: 88 },    // 2. Pale peach
  { h: 30, s: 90, l: 84 },    // 3. Light peach
  { h: 30, s: 90, l: 80 },    // 4. Soft peach
  { h: 30, s: 90, l: 76 },    // 5. Light orange-pink
  
  // Light (75-60% lightness)
  { h: 30, s: 90, l: 72 },    // 6. Medium light orange
  { h: 30, s: 95, l: 68 },    // 7. Light orange
  { h: 30, s: 95, l: 64 },    // 8. Soft orange
  { h: 30, s: 95, l: 60 },    // 9. Medium orange
  { h: 30, s: 95, l: 56 },    // 10. Orange
  
  // Medium (55-40% lightness)
  { h: 30, s: 98, l: 52 },    // 11. Bright orange
  { h: 30, s: 98, l: 48 },    // 12. Deep orange
  { h: 30, s: 98, l: 44 },    // 13. Rich orange
  { h: 30, s: 98, l: 40 },    // 14. Dark orange
  { h: 30, s: 100, l: 36 },   // 15. Deep orange-brown
  
  // Medium-dark (35-25% lightness)
  { h: 30, s: 100, l: 32 },   // 16. Brown-orange
  { h: 30, s: 100, l: 28 },   // 17. Dark brown-orange
  { h: 25, s: 100, l: 25 },   // 18. Reddish brown
  { h: 25, s: 100, l: 22 },   // 19. Dark reddish brown
  { h: 20, s: 100, l: 20 },   // 20. Deep brown
  
  // Dark (20-12% lightness)
  { h: 20, s: 100, l: 18 },   // 21. Very dark brown
  { h: 15, s: 100, l: 16 },   // 22. Darker brown
  { h: 15, s: 100, l: 14 },   // 23. Deep dark brown
  { h: 10, s: 100, l: 12 },   // 24. Nearly black brown
  { h: 10, s: 100, l: 10 },   // 25. Very dark brown
  
  // Very dark (10-5% lightness)
  { h: 5, s: 100, l: 9 },     // 26. Almost black brown
  { h: 5, s: 90, l: 8 },      // 27. Near black
  { h: 0, s: 80, l: 7 },      // 28. Very near black
  { h: 0, s: 60, l: 6 },      // 29. Extremely dark
  { h: 0, s: 40, l: 5 },      // 30. Nearly black
  
  // Extra levels - slightly different hue progression
  { h: 35, s: 95, l: 90 },    // 31. Light coral
  { h: 35, s: 95, l: 82 },    // 32. Soft coral
  { h: 35, s: 95, l: 74 },    // 33. Medium coral
  { h: 35, s: 98, l: 66 },    // 34. Coral
  { h: 35, s: 98, l: 58 },    // 35. Deep coral
  { h: 35, s: 100, l: 50 },   // 36. Rich coral
  { h: 35, s: 100, l: 42 },   // 37. Dark coral
  { h: 35, s: 100, l: 34 },   // 38. Deep brown-coral
  { h: 32, s: 100, l: 26 },   // 39. Very dark coral
  { h: 30, s: 100, l: 18 },   // 40. Nearly black coral
  
  // Extra levels continue
  { h: 40, s: 95, l: 88 },    // 41. Light amber
  { h: 40, s: 95, l: 78 },    // 42. Soft amber
  { h: 40, s: 98, l: 68 },    // 43. Medium amber
  { h: 40, s: 98, l: 58 },    // 44. Amber
  { h: 40, s: 100, l: 48 },   // 45. Deep amber
  { h: 40, s: 100, l: 38 },   // 46. Dark amber
  { h: 38, s: 100, l: 28 },   // 47. Very dark amber
  { h: 35, s: 100, l: 20 },   // 48. Nearly black amber
  { h: 30, s: 100, l: 15 },   // 49. Extremely dark
  { h: 25, s: 100, l: 12 },   // 50. Almost black
];

/**
 * Generate a dynamic color for levels beyond the base palette
 * Maintains consistent progression with slight hue variations
 * @param {number} index - Color index (0-based)
 * @returns {Object} HSL color object
 */
function generateDynamicColor(index) {
  // For very high levels, we continue the pattern with slight hue shifts
  const baseHue = 30; // Orange base
  const cycleLength = 10;
  const cycle = Math.floor(index / cycleLength);
  const positionInCycle = index % cycleLength;
  
  // Shift hue slightly for each cycle to add variety while keeping it logical
  // Stay in warm colors (orange/red/brown spectrum)
  const hue = baseHue + (cycle * 10) % 40; // Oscillates between 30-70 (orange to yellow-orange)
  
  // Create clear progression from light (92%) to dark (10%) within each cycle
  const lightness = Math.max(10, 92 - (positionInCycle * 8.2));
  
  // Keep high saturation for vibrant colors
  const saturation = Math.min(100, 85 + positionInCycle);
  
  return { h: hue, s: saturation, l: lightness };
}

/**
 * Generate colored pencils with consistent progression
 * Uses predefined palette for early levels, generates dynamic colors for higher levels
 * @param {number} count - Number of pencils (level + 4)
 * @param {number} difficulty - Level number (not used, kept for compatibility)
 * @returns {Array} Array of pencil objects with unique IDs and colors
 */
export function generatePencils(count, difficulty = 1) {
  const pencils = [];
  
  // Generate colors for the requested count
  for (let i = 0; i < count; i++) {
    let colorData;
    
    if (i < COLOR_PALETTE.length) {
      // Use predefined palette for early levels
      colorData = COLOR_PALETTE[i];
    } else {
      // Generate dynamic colors for higher levels
      colorData = generateDynamicColor(i);
    }
    
    pencils.push({
      id: `pencil-${Date.now()}-${i}`,
      hsl: { ...colorData },
      color: hslToString(colorData)
    });
  }
  
  return pencils;
}

/**
 * Convert HSL object to CSS string
 */
export function hslToString({ h, s, l }) {
  return `hsl(${h}, ${s}%, ${l}%)`;
}

/**
 * Sort pencils by lightness (light to dark: white on top, dark on bottom)
 * This is the "ideal" order that determines the score
 */
export function sortPencils(pencils) {
  return [...pencils].sort((a, b) => {
    // Sort by lightness: highest (lightest/white) first, lowest (darkest) last
    return b.hsl.l - a.hsl.l;
  });
}

/**
 * Calculate color distance between two HSL colors
 */
export function colorDistance(hsl1, hsl2) {
  // Normalize hue difference (circular)
  let hueDiff = Math.abs(hsl1.h - hsl2.h);
  if (hueDiff > 180) hueDiff = 360 - hueDiff;
  
  const satDiff = Math.abs(hsl1.s - hsl2.s);
  const lightDiff = Math.abs(hsl1.l - hsl2.l);
  
  // Weighted distance (hue is most important)
  return Math.sqrt(
    (hueDiff / 180) ** 2 * 0.6 +
    (satDiff / 100) ** 2 * 0.25 +
    (lightDiff / 100) ** 2 * 0.15
  );
}

