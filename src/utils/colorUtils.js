// Utility functions for color generation and sorting

/**
 * Predefined color palette - consistent across all games
 * Progresses from light to dark with increased contrast for better distinction
 * Each color has significantly more difference from adjacent colors
 */
const COLOR_PALETTE = [
  // Light colors with EXTREME gaps and completely different hues for maximum distinction
  { h: 0, s: 0, l: 100 },     // 1. Pure white
  { h: 0, s: 0, l: 75 },      // 2. Medium gray (25 point gap - very distinct)
  { h: 50, s: 60, l: 60 },    // 3. Light cream (15 point gap, yellow hue)
  { h: 45, s: 100, l: 48 },   // 4. Bright yellow (12 point gap, full saturation)
  { h: 40, s: 100, l: 38 },   // 5. Golden yellow (10 point gap, full saturation)
  { h: 35, s: 100, l: 30 },   // 6. Orange-yellow (8 point gap, full saturation)
  { h: 30, s: 100, l: 24 },   // 7. Light orange (6 point gap, full saturation)
  { h: 25, s: 100, l: 19 },   // 8. Orange (5 point gap, full saturation)
  { h: 20, s: 100, l: 15 },   // 9. Dark orange (4 point gap, full saturation)
  { h: 15, s: 100, l: 12 },   // 10. Brown-orange (3 point gap, full saturation)
  { h: 10, s: 95, l: 10 },    // 11. Red-brown (2 point gap, more red)
  { h: 5, s: 90, l: 8.5 },    // 12. Medium brown (1.5 point gap, redder)
  { h: 0, s: 85, l: 7.5 },    // 13. Dark brown (1 point gap, red-brown)
  { h: 355, s: 80, l: 6.5 },  // 14. Very dark brown (1 point gap, more red)
  { h: 350, s: 75, l: 6 },    // 15. Almost black brown (0.5 point gap, red-brown)
  
  // Mid-range colors with COMPLETELY different hues and much larger gaps
  { h: 340, s: 100, l: 5 },   // 16. Dark red (1 point gap, very red, full saturation)
  { h: 320, s: 100, l: 4 },   // 17. Deep pink-red (1 point gap, pink hue, full saturation)
  { h: 300, s: 100, l: 3.5 }, // 18. Magenta (0.5 point gap, magenta hue, full saturation)
  { h: 280, s: 100, l: 3 },   // 19. Purple (0.5 point gap, purple hue, full saturation)
  { h: 260, s: 100, l: 2.5 }, // 20. Blue-purple (0.5 point gap, blue-purple, full saturation)
  { h: 240, s: 100, l: 2.2 }, // 21. Blue (0.3 point gap, blue hue, full saturation)
  { h: 220, s: 100, l: 2 },   // 22. Cyan-blue (0.2 point gap, cyan-blue, full saturation)
  { h: 200, s: 100, l: 1.8 }, // 23. Cyan (0.2 point gap, cyan hue, full saturation)
  { h: 180, s: 100, l: 1.6 }, // 24. Teal (0.2 point gap, teal hue, full saturation)
  { h: 160, s: 100, l: 1.4 }, // 25. Green-teal (0.2 point gap, green-teal, full saturation)
  { h: 140, s: 100, l: 1.2 }, // 26. Green (0.2 point gap, green hue, full saturation)
  { h: 120, s: 100, l: 1.0 }, // 27. Yellow-green (0.2 point gap, yellow-green, full saturation)
  { h: 100, s: 100, l: 0.85 },// 28. Lime-green (0.15 point gap, lime, full saturation)
  { h: 80, s: 100, l: 0.7 },  // 29. Yellow-lime (0.15 point gap, yellow-lime, full saturation)
  { h: 60, s: 100, l: 0.6 },  // 30. Yellow (0.1 point gap, yellow, full saturation)
  { h: 40, s: 100, l: 0.5 },  // 31. Orange-yellow (0.1 point gap, orange-yellow, full saturation)
  { h: 20, s: 100, l: 0.42 }, // 32. Orange (0.08 point gap, orange, full saturation)
  { h: 0, s: 100, l: 0.35 },  // 33. Red (0.07 point gap, red, full saturation)
  { h: 340, s: 100, l: 0.3 }, // 34. Red-pink (0.05 point gap, red-pink, full saturation)
  { h: 320, s: 100, l: 0.25 },// 35. Pink-magenta (0.05 point gap, pink-magenta, full saturation)
  { h: 300, s: 100, l: 0.21 },// 36. Magenta (0.04 point gap, magenta, full saturation)
  { h: 280, s: 100, l: 0.18 },// 37. Purple (0.03 point gap, purple, full saturation)
  { h: 260, s: 100, l: 0.15 },// 38. Blue-purple (0.03 point gap, blue-purple, full saturation)
  { h: 240, s: 100, l: 0.12 },// 39. Blue (0.03 point gap, blue, full saturation)
  { h: 220, s: 100, l: 0.10 },// 40. Cyan-blue (0.02 point gap, cyan-blue, full saturation)
  { h: 200, s: 100, l: 0.08 },// 41. Cyan (0.02 point gap, cyan, full saturation)
  { h: 180, s: 100, l: 0.07 },// 42. Teal (0.01 point gap, teal, full saturation)
  { h: 160, s: 100, l: 0.06 },// 43. Green-teal (0.01 point gap, green-teal, full saturation)
  { h: 140, s: 100, l: 0.05 },// 44. Green (0.01 point gap, green, full saturation)
  { h: 120, s: 100, l: 0.04 },// 45. Yellow-green (0.01 point gap, yellow-green, full saturation)
  { h: 100, s: 100, l: 0.035 },// 46. Lime-green (0.005 point gap, lime, full saturation)
  { h: 80, s: 100, l: 0.03 }, // 47. Yellow-lime (0.005 point gap, yellow-lime, full saturation)
  { h: 60, s: 100, l: 0.025 },// 48. Yellow (0.005 point gap, yellow, full saturation)
  { h: 40, s: 100, l: 0.02 }, // 49. Orange-yellow (0.005 point gap, orange-yellow, full saturation)
  { h: 20, s: 100, l: 0.017 },// 50. Orange (0.003 point gap, orange, full saturation)
  { h: 0, s: 100, l: 0.014 }, // 51. Red (0.003 point gap, red, full saturation)
  { h: 340, s: 100, l: 0.012 },// 52. Red-pink (0.002 point gap, red-pink, full saturation)
  { h: 320, s: 100, l: 0.01 },// 53. Pink-magenta (0.002 point gap, pink-magenta, full saturation)
  { h: 300, s: 100, l: 0.008 },// 54. Magenta (0.002 point gap, magenta, full saturation)
  { h: 280, s: 100, l: 0.007 },// 55. Purple (0.001 point gap, purple, full saturation)
  { h: 260, s: 100, l: 0.006 },// 56. Blue-purple (0.001 point gap, blue-purple, full saturation)
  { h: 240, s: 100, l: 0.005 },// 57. Blue (0.001 point gap, blue, full saturation)
  { h: 220, s: 100, l: 0.004 },// 58. Cyan-blue (0.001 point gap, cyan-blue, full saturation)
  { h: 200, s: 100, l: 0.003 },// 59. Cyan (0.001 point gap, cyan, full saturation)
  { h: 180, s: 100, l: 0.0025 },// 60. Teal (0.0005 point gap, teal, full saturation)
  { h: 160, s: 100, l: 0.002 },// 61. Green-teal (0.0005 point gap, green-teal, full saturation)
  { h: 140, s: 100, l: 0.0015 },// 62. Green (0.0005 point gap, green, full saturation)
  
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

