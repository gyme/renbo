// Utility functions for color generation and sorting

/**
 * Predefined color palette - consistent across all games
 * Progresses from light to dark, based on yellow/orange/brown spectrum
 * Extended with additional color families for unlimited levels
 */
const COLOR_PALETTE = [
  // Original yellow/orange/brown spectrum with increased contrast
  { h: 0, s: 0, l: 95 },      // 1. White
  { h: 45, s: 15, l: 88 },    // 2. Very light cream/beige
  { h: 50, s: 30, l: 80 },    // 3. Light beige
  { h: 48, s: 100, l: 70 },   // 4. Light yellow
  { h: 45, s: 100, l: 60 },   // 5. Yellow
  { h: 40, s: 95, l: 50 },    // 6. Golden yellow
  { h: 35, s: 90, l: 42 },    // 7. Orange-yellow/Golden
  { h: 30, s: 85, l: 35 },    // 8. Orange
  { h: 25, s: 80, l: 28 },    // 9. Darker orange
  { h: 20, s: 75, l: 22 },    // 10. Brown-orange
  { h: 18, s: 70, l: 18 },    // 11. Brown
  { h: 15, s: 65, l: 14 },    // 12. Dark brown
  { h: 10, s: 60, l: 10 },    // 13. Darker brown
  { h: 0, s: 0, l: 6 },       // 14. Very dark gray/brown
  
  // Extended palette - red/pink spectrum with increased contrast
  { h: 0, s: 0, l: 3 },       // 15. Very dark gray
  { h: 0, s: 0, l: 1 },       // 16. Almost black
  { h: 0, s: 0, l: 0 },       // 17. Near black
  { h: 0, s: 0, l: 0 },       // 18. Black
  { h: 350, s: 20, l: 90 },   // 19. Very light pink
  { h: 340, s: 30, l: 80 },   // 20. Light pink
  { h: 330, s: 40, l: 70 },   // 21. Pink
  { h: 320, s: 50, l: 60 },   // 22. Light rose
  { h: 310, s: 60, l: 50 },   // 23. Rose
  { h: 300, s: 70, l: 40 },   // 24. Light magenta
  { h: 290, s: 80, l: 30 },   // 25. Magenta
  { h: 280, s: 90, l: 20 },   // 26. Purple
  { h: 270, s: 100, l: 15 },  // 27. Violet
  { h: 260, s: 100, l: 12 },  // 28. Blue-violet
  { h: 250, s: 100, l: 10 },  // 29. Blue
  { h: 240, s: 100, l: 8 },   // 30. Dark blue
  { h: 230, s: 100, l: 6 },   // 31. Navy blue
  { h: 220, s: 100, l: 4 },   // 32. Very dark blue
  { h: 210, s: 100, l: 2 },   // 33. Almost black blue
  { h: 200, s: 100, l: 1 },   // 34. Black blue
  { h: 190, s: 100, l: 0 },   // 35. Black cyan
  { h: 180, s: 100, l: 0 },   // 36. Black teal
  { h: 170, s: 100, l: 2 },   // 37. Very dark teal
  { h: 160, s: 100, l: 4 },   // 38. Dark teal
  { h: 150, s: 100, l: 6 },   // 39. Dark green
  { h: 140, s: 100, l: 8 },   // 40. Forest green
  { h: 130, s: 100, l: 10 },  // 41. Dark green
  { h: 120, s: 100, l: 12 },  // 42. Green
  { h: 110, s: 100, l: 15 },  // 43. Yellow-green
  { h: 100, s: 100, l: 18 },  // 44. Lime green
  { h: 90, s: 100, l: 22 },   // 45. Bright green
  { h: 80, s: 100, l: 26 },   // 46. Light green
  { h: 70, s: 100, l: 30 },   // 47. Yellow-green
  { h: 60, s: 100, l: 35 },   // 48. Yellow
  { h: 50, s: 100, l: 40 },   // 49. Golden yellow
  { h: 40, s: 100, l: 45 },   // 50. Light orange
];

/**
 * Generate a dynamic color for levels beyond the base palette
 * Creates colors that maintain the light-to-dark progression
 * @param {number} index - Color index (0-based)
 * @returns {Object} HSL color object
 */
function generateDynamicColor(index) {
  // For very high levels, generate colors in cycles
  const cycleLength = 20;
  const cycle = Math.floor(index / cycleLength);
  const positionInCycle = index % cycleLength;
  
  // Create a more contrasted progression from light to dark
  // Use larger steps to ensure better distinction
  const lightness = Math.max(2, 95 - (positionInCycle * 5.5));
  const hue = (cycle * 60 + positionInCycle * 18) % 360; // Rotate through hue spectrum
  const saturation = Math.min(100, 30 + positionInCycle * 3.5); // Increase saturation
  
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

