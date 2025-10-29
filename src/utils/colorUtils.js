// Utility functions for color generation and sorting

/**
 * Predefined color palette - consistent across all games
 * Progresses from light to dark, based on yellow/orange/brown spectrum
 */
const COLOR_PALETTE = [
  { h: 0, s: 0, l: 92 },      // 1. White
  { h: 45, s: 15, l: 88 },    // 2. Very light cream/beige
  { h: 50, s: 30, l: 82 },    // 3. Light beige
  { h: 48, s: 100, l: 70 },   // 4. Light yellow
  { h: 45, s: 100, l: 60 },   // 5. Yellow
  { h: 40, s: 95, l: 55 },    // 6. Golden yellow
  { h: 35, s: 90, l: 52 },    // 7. Orange-yellow/Golden
  { h: 30, s: 85, l: 50 },    // 8. Orange
  { h: 25, s: 80, l: 48 },    // 9. Darker orange
  { h: 20, s: 75, l: 45 },    // 10. Brown-orange
  { h: 18, s: 70, l: 40 },    // 11. Brown
  { h: 15, s: 65, l: 35 },    // 12. Dark brown
  { h: 10, s: 60, l: 30 },    // 13. Darker brown
  { h: 0, s: 0, l: 25 },      // 14. Very dark gray/brown
];

/**
 * Generate colored pencils with consistent progression
 * Always uses the same colors from the palette
 * @param {number} count - Number of pencils (level + 4)
 * @param {number} difficulty - Level number (not used, kept for compatibility)
 * @returns {Array} Array of pencil objects with unique IDs and colors
 */
export function generatePencils(count, difficulty = 1) {
  const pencils = [];
  
  // Use the first 'count' colors from the palette
  for (let i = 0; i < count && i < COLOR_PALETTE.length; i++) {
    const colorData = COLOR_PALETTE[i];
    
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

