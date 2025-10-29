import { motion } from 'framer-motion';
import './Pencil.css';

// Helper to adjust HSL colors
function adjustColor(color, lightness = 0, saturation = 0) {
  const match = color.match(/hsl\((\d+(?:\.\d+)?),\s*(\d+(?:\.\d+)?)%,\s*(\d+(?:\.\d+)?)%\)/);
  if (!match) return color;

  let h = parseFloat(match[1]);
  let s = parseFloat(match[2]);
  let l = parseFloat(match[3]);

  s = Math.max(0, Math.min(100, s + saturation));
  l = Math.max(5, Math.min(95, l + lightness));

  return `hsl(${h}, ${s}%, ${l}%)`;
}

export default function DragOverlayPencil({ color }) {
  // Generate a unique ID for gradients within this SVG
  const id = `drag-pencil-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <motion.div
      className="pencil-overlay"
      initial={{ scale: 1, rotate: 0 }}
      animate={{ scale: 1.05, rotate: 1 }}
      transition={{ 
        duration: 0.15,
        ease: "easeOut"
      }}
    >
      <svg className="pencil-svg" viewBox="0 0 300 80" xmlns="http://www.w3.org/2000/svg">
        <defs>
          {/* Wood texture pattern with realistic grain */}
          <linearGradient id={`woodGradient-${id}`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#7A5C3E" />
            <stop offset="15%" stopColor="#9B7653" />
            <stop offset="30%" stopColor="#C4956B" />
            <stop offset="50%" stopColor="#D9A574" />
            <stop offset="70%" stopColor="#C4956B" />
            <stop offset="85%" stopColor="#9B7653" />
            <stop offset="100%" stopColor="#7A5C3E" />
          </linearGradient>

          <pattern id={`woodTexture-${id}`} x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
            <rect width="40" height="40" fill={`url(#woodGradient-${id})`} />
            <path d="M0,10 Q10,8 20,10 T40,10" stroke="#8B6F47" strokeWidth="0.5" opacity="0.3" fill="none" />
            <path d="M0,20 Q10,18 20,20 T40,20" stroke="#6B5435" strokeWidth="0.4" opacity="0.4" fill="none" />
            <path d="M0,30 Q10,32 20,30 T40,30" stroke="#8B6F47" strokeWidth="0.5" opacity="0.3" fill="none" />
          </pattern>

          {/* Core color gradient - radial for depth */}
          <radialGradient id={`graphiteCore-${id}`} cx="50%" cy="50%">
            <stop offset="0%" stopColor={adjustColor(color, 50, 0)} />
            <stop offset="30%" stopColor={adjustColor(color, 20, 0)} />
            <stop offset="60%" stopColor={color} />
            <stop offset="100%" stopColor={adjustColor(color, -40, 0)} />
          </radialGradient>

          {/* Shadow filter */}
          <filter id={`shadow-${id}`} x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceAlpha" stdDeviation="2.5" />
            <feOffset dx="0" dy="4" result="offsetblur" />
            <feComponentTransfer>
              <feFuncA type="linear" slope="0.25" />
            </feComponentTransfer>
            <feMerge>
              <feMergeNode />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <g filter={`url(#shadow-${id})`}>
          {/* Sharpened wood tip - conical taper */}
          <polygon points="10,40 30,28 40,28 40,52 30,52" fill={`url(#woodTexture-${id})`} stroke="#6B5435" strokeWidth="0.5" />

          {/* Wood grain lines on taper */}
          <line x1="14" y1="37" x2="30" y2="30" stroke="#6B5435" strokeWidth="0.4" opacity="0.7" />
          <line x1="16" y1="38" x2="34" y2="32" stroke="#8B6F47" strokeWidth="0.3" opacity="0.5" />
          <line x1="18" y1="39" x2="36" y2="34" stroke="#6B5435" strokeWidth="0.4" opacity="0.6" />
          <line x1="20" y1="40" x2="38" y2="38" stroke="#8B6F47" strokeWidth="0.3" opacity="0.4" />
          <line x1="18" y1="41" x2="36" y2="44" stroke="#6B5435" strokeWidth="0.4" opacity="0.6" />
          <line x1="16" y1="42" x2="34" y2="48" stroke="#8B6F47" strokeWidth="0.3" opacity="0.5" />
          <line x1="14" y1="43" x2="30" y2="50" stroke="#6B5435" strokeWidth="0.4" opacity="0.7" />

          {/* Colored core at tip - burnished solid color */}
          <polygon points="10,40 20,35 20,45" fill={`url(#graphiteCore-${id})`} />
          <polygon points="10,40 20,35 20,45" fill={adjustColor(color, -20, 0)} opacity="0.2" />

          {/* Hexagonal Body with layered shading */}
          
          {/* Top facet - lightest with white highlight */}
          <polygon points="40,28 280,28 280,34 40,34" fill={adjustColor(color, 40, 0)} />
          <polygon points="40,28 280,28 280,29.5 40,29.5" fill="white" opacity="0.4" />

          {/* Upper right facet - light */}
          <polygon points="280,28 286,32 286,40 280,34" fill={adjustColor(color, 20, 0)} />

          {/* Lower right facet - medium */}
          <polygon points="286,40 286,48 280,46 280,34" fill={color} />

          {/* Bottom facet - dark */}
          <polygon points="280,46 280,52 40,52 40,46" fill={adjustColor(color, -30, 0)} />

          {/* Lower left facet - darker */}
          <polygon points="40,46 40,52 34,48 34,40" fill={adjustColor(color, -50, 0)} />

          {/* Upper left facet - medium dark */}
          <polygon points="34,40 34,32 40,28 40,34" fill={adjustColor(color, -15, 0)} />

          {/* Main visible front facets */}
          <polygon points="40,34 280,34 286,40 34,40" fill={adjustColor(color, 20, 0)} />
          <polygon points="34,40 286,40 280,46 40,46" fill={color} />

          {/* Edge highlights for dimension */}
          <line x1="40" y1="28" x2="280" y2="28" stroke="white" strokeWidth="0.8" opacity="0.5" />
          <line x1="280" y1="28" x2="286" y2="32" stroke={adjustColor(color, 30, 0)} strokeWidth="0.5" opacity="0.4" />
          <line x1="34" y1="32" x2="40" y2="28" stroke={adjustColor(color, 10, 0)} strokeWidth="0.5" opacity="0.3" />

          {/* End cap - blunt edge (no eraser) */}
          <polygon
            points="280,28 286,32 286,48 280,52 280,46 280,34"
            fill={adjustColor(color, -40, 0)}
            stroke={adjustColor(color, -55, 0)}
            strokeWidth="0.6"
          />
          <ellipse cx="283" cy="40" rx="2.5" ry="6" fill={adjustColor(color, -50, 0)} opacity="0.6" />
          <line x1="280" y1="34" x2="286" y2="40" stroke={adjustColor(color, -60, 0)} strokeWidth="0.4" opacity="0.5" />
          <line x1="280" y1="46" x2="286" y2="40" stroke={adjustColor(color, -60, 0)} strokeWidth="0.4" opacity="0.5" />
        </g>
      </svg>
    </motion.div>
  );
}
