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
  
  // Mid-dark colors with distinct hues and larger lightness steps (maintaining light-to-dark order)
  { h: 15, s: 70, l: 11 },    // 16. Red-brown (darker than previous)
  { h: 10, s: 75, l: 9 },     // 17. Rust brown
  { h: 5, s: 80, l: 8 },      // 18. Brown-red
  { h: 358, s: 70, l: 7 },    // 19. Reddish-brown
  { h: 350, s: 75, l: 6 },    // 20. Dark red
  { h: 340, s: 80, l: 5 },    // 21. Rose-red
  { h: 330, s: 85, l: 4 },    // 22. Pink-red
  { h: 320, s: 90, l: 3 },    // 23. Magenta-red
  { h: 310, s: 95, l: 2 },    // 24. Dark magenta
  { h: 300, s: 100, l: 1 },   // 25. Purple-magenta
  { h: 290, s: 100, l: 0.8 }, // 26. Dark purple
  { h: 280, s: 100, l: 0.6 }, // 27. Deep purple
  { h: 270, s: 100, l: 0.5 }, // 28. Violet
  { h: 260, s: 100, l: 0.4 }, // 29. Blue-violet
  { h: 250, s: 100, l: 0.3 }, // 30. Deep blue
  { h: 240, s: 100, l: 0.2 }, // 31. Dark blue
  { h: 230, s: 100, l: 0.15 },// 32. Navy blue
  { h: 220, s: 100, l: 0.1 }, // 33. Very dark blue
  { h: 210, s: 100, l: 0.08 },// 34. Almost black blue
  { h: 200, s: 100, l: 0.06 },// 35. Very dark cyan
  { h: 190, s: 100, l: 0.05 },// 36. Very dark teal
  { h: 180, s: 100, l: 0.04 },// 37. Very dark green-cyan
  { h: 170, s: 100, l: 0.03 },// 38. Very dark green
  { h: 160, s: 100, l: 0.02 },// 39. Dark forest green
  { h: 150, s: 100, l: 0.01 },// 40. Very dark green
  
  // Final progression to black with larger steps (must be darker than previous)
  { h: 0, s: 0, l: 0 },       // 41. Black (pure black)
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

