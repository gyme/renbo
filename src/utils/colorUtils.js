// Utility functions for color generation and sorting

/**
 * Predefined color palette - consistent across all games
 * Progresses from light to dark with increased contrast for better distinction
 * Each color has significantly more difference from adjacent colors
 */
const COLOR_PALETTE = [
  // Light colors with larger lightness gaps
  { h: 0, s: 0, l: 98 },      // 1. Very light white (almost white)
  { h: 0, s: 0, l: 92 },      // 2. White-gray
  { h: 50, s: 20, l: 85 },    // 3. Very light cream
  { h: 50, s: 40, l: 78 },    // 4. Light cream
  { h: 48, s: 60, l: 70 },    // 5. Cream-yellow
  { h: 45, s: 80, l: 62 },    // 6. Light yellow
  { h: 42, s: 95, l: 55 },    // 7. Yellow
  { h: 40, s: 100, l: 48 },   // 8. Golden yellow
  { h: 38, s: 95, l: 42 },    // 9. Orange-yellow
  { h: 35, s: 90, l: 36 },    // 10. Light orange
  { h: 32, s: 85, l: 30 },    // 11. Orange
  { h: 28, s: 80, l: 25 },    // 12. Dark orange
  { h: 25, s: 75, l: 20 },    // 13. Brown-orange
  { h: 22, s: 70, l: 16 },    // 14. Medium brown
  { h: 18, s: 65, l: 13 },    // 15. Dark brown
  
  // Mid-range colors with more variety and better distinction
  { h: 20, s: 60, l: 11 },    // 16. Medium-dark brown
  { h: 15, s: 65, l: 10 },    // 17. Red-brown
  { h: 10, s: 70, l: 9 },     // 18. Rust brown
  { h: 5, s: 75, l: 8 },      // 19. Brown-red
  { h: 0, s: 70, l: 7 },      // 20. Reddish-brown
  { h: 355, s: 75, l: 6.5 },  // 21. Dark red-orange
  { h: 350, s: 80, l: 6 },    // 22. Dark red
  { h: 345, s: 75, l: 5.5 },  // 23. Deep red
  { h: 340, s: 80, l: 5 },    // 24. Rose-red
  { h: 335, s: 75, l: 4.5 },  // 25. Dark rose
  { h: 330, s: 85, l: 4 },    // 26. Pink-red
  { h: 325, s: 80, l: 3.5 },  // 27. Deep pink
  { h: 320, s: 90, l: 3 },    // 28. Magenta-red
  { h: 315, s: 85, l: 2.5 },  // 29. Dark magenta-pink
  { h: 310, s: 95, l: 2 },    // 30. Dark magenta
  { h: 305, s: 90, l: 1.8 },  // 31. Deep magenta
  { h: 300, s: 100, l: 1.5 }, // 32. Purple-magenta
  { h: 295, s: 95, l: 1.3 },  // 33. Dark purple-magenta
  { h: 290, s: 100, l: 1.1 }, // 34. Dark purple
  { h: 285, s: 95, l: 0.9 },  // 35. Deep purple
  { h: 280, s: 100, l: 0.7 }, // 36. Deep purple
  { h: 275, s: 95, l: 0.6 },  // 37. Violet-purple
  { h: 270, s: 100, l: 0.5 }, // 38. Violet
  { h: 265, s: 95, l: 0.45 }, // 39. Blue-violet
  { h: 260, s: 100, l: 0.4 }, // 40. Blue-violet
  { h: 255, s: 95, l: 0.35 }, // 41. Deep blue-violet
  { h: 250, s: 100, l: 0.3 }, // 42. Deep blue
  { h: 245, s: 95, l: 0.25 }, // 43. Dark blue
  { h: 240, s: 100, l: 0.2 }, // 44. Dark blue
  { h: 235, s: 95, l: 0.18 }, // 45. Navy blue
  { h: 230, s: 100, l: 0.15 },// 46. Navy blue
  { h: 225, s: 95, l: 0.12 }, // 47. Very dark blue
  { h: 220, s: 100, l: 0.1 }, // 48. Very dark blue
  { h: 215, s: 95, l: 0.09 }, // 49. Almost black blue
  { h: 210, s: 100, l: 0.08 },// 50. Almost black blue
  { h: 205, s: 95, l: 0.07 }, // 51. Very dark cyan-blue
  { h: 200, s: 100, l: 0.06 },// 52. Very dark cyan
  { h: 195, s: 95, l: 0.055 },// 53. Very dark teal-cyan
  { h: 190, s: 100, l: 0.05 },// 54. Very dark teal
  { h: 185, s: 95, l: 0.045 },// 55. Very dark green-teal
  { h: 180, s: 100, l: 0.04 },// 56. Very dark green-cyan
  { h: 175, s: 95, l: 0.035 },// 57. Very dark green
  { h: 170, s: 100, l: 0.03 },// 58. Very dark green
  { h: 165, s: 95, l: 0.025 },// 59. Dark forest green
  { h: 160, s: 100, l: 0.02 },// 60. Dark forest green
  { h: 155, s: 95, l: 0.015 },// 61. Very dark green
  { h: 150, s: 100, l: 0.01 },// 62. Very dark green
  
  // Final progression to black with larger steps (must be darker than previous)
  { h: 0, s: 0, l: 0 },       // 63. Black (pure black)
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
  // Use larger steps to ensure better distinction (increased from 5.5 to 7)
  const lightness = Math.max(2, 95 - (positionInCycle * 7));
  const hue = (cycle * 60 + positionInCycle * 20) % 360; // Rotate through hue spectrum with larger steps (18->20)
  const saturation = Math.min(100, 40 + positionInCycle * 4); // Increase saturation more (30->40, 3.5->4)
  
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

