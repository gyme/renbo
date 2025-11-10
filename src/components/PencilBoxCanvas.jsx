import { useRef, useEffect, useState, useCallback } from 'react';
import './PencilBoxCanvas.css';

export default function PencilBoxCanvas({ pencils, onPencilsReorder, disabled = false }) {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const [dimensions, setDimensions] = useState({ width: 400, height: 600 });
  const [canScrollUp, setCanScrollUp] = useState(false);
  const [canScrollDown, setCanScrollDown] = useState(false);
  const dragStateRef = useRef({
    isDragging: false,
    draggedIndex: -1,
    startY: 0,
    currentY: 0,
    offsetY: 0,
    pencilPositions: [],
    targetPositions: [],
    animatingPositions: [],
    hoverIndex: -1, // Track which pencil is being hovered over
    originalPositions: [], // Store original positions when drag starts
    lastScrollY: 0, // Track last touch Y position for scroll calculation
    containerRef: null, // Reference to scrollable container
  });

  const PENCIL_HEIGHT = 40;
  const PENCIL_WIDTH = 238; // tip (18) + body (200) + metal (4) + eraser (16)
  const PENCIL_SPACING = 0;
  const LOCK_ICON_SIZE = 32;

  // Calculate pencil positions
  const calculatePositions = useCallback(() => {
    const containerWidth = dimensions.width;
    // Adjust startX slightly to the left for better visual centering
    const startX = (containerWidth - PENCIL_WIDTH) / 2 - 5;
    const startY = 20; // Top padding for buffer

    return pencils.map((_, index) => ({
      x: startX,
      y: startY + index * (PENCIL_HEIGHT + PENCIL_SPACING),
      targetY: startY + index * (PENCIL_HEIGHT + PENCIL_SPACING),
    }));
  }, [pencils, dimensions]);

  // Initialize positions
  useEffect(() => {
    const positions = calculatePositions();
    dragStateRef.current.pencilPositions = positions;
    dragStateRef.current.targetPositions = positions;
    dragStateRef.current.animatingPositions = positions.map(p => ({ ...p }));
  }, [calculatePositions]);

  // Draw a pencil on canvas
  const drawPencil = useCallback((ctx, x, y, color, isFixed = false, isDragging = false, opacity = 1) => {
    ctx.save();
    
    // Apply opacity
    ctx.globalAlpha = opacity;
    
    // Shadow for depth
    if (isDragging) {
      ctx.shadowColor = 'rgba(0, 0, 0, 0.4)';
      ctx.shadowBlur = 25;
      ctx.shadowOffsetY = 15;
    } else {
      ctx.shadowColor = 'rgba(0, 0, 0, 0.25)';
      ctx.shadowBlur = 10;
      ctx.shadowOffsetY = 4;
    }

    const adjustColor = (hslColor, lightness = 0) => {
      const match = hslColor.match(/hsl\((\d+(?:\.\d+)?),\s*(\d+(?:\.\d+)?)%,\s*(\d+(?:\.\d+)?)%\)/);
      if (!match) return hslColor;
      let h = parseFloat(match[1]);
      let s = parseFloat(match[2]);
      let l = parseFloat(match[3]);
      l = Math.max(5, Math.min(95, l + lightness));
      return `hsl(${h}, ${s}%, ${l}%)`;
    };

    // Scale for drawing
    const scale = isDragging ? 1.05 : 1;
    ctx.translate(x + PENCIL_WIDTH / 2, y + PENCIL_HEIGHT / 2);
    ctx.scale(scale, scale);
    ctx.translate(-PENCIL_WIDTH / 2, -PENCIL_HEIGHT / 2);

    // Pencil dimensions matching the original design exactly
    const bodyWidth = 200;
    const bodyHeight = 16;
    const bodyX = 18; // Tip starts earlier
    const bodyY = (PENCIL_HEIGHT - bodyHeight) / 2;
    const tipLength = 18; // Longer tip
    const eraserLength = 16; // Slightly shorter eraser
    const metalBandWidth = 4; // Thin light gray band
    const eraserHeight = bodyHeight - 3; // Slightly shorter than body

    // Calculate positions
    const metalBandX = bodyX + bodyWidth;
    const eraserX = metalBandX + metalBandWidth;
    const eraserY = bodyY + 1.5; // Center vertically since it's shorter

    // Draw sharpened wooden tip (left side) - tan/beige triangle
    const woodTipGradient = ctx.createLinearGradient(0, bodyY, bodyX, bodyY);
    woodTipGradient.addColorStop(0, '#C4A77D');
    woodTipGradient.addColorStop(0.5, '#D9B991');
    woodTipGradient.addColorStop(1, '#E8CBA8');
    ctx.fillStyle = woodTipGradient;
    ctx.beginPath();
    ctx.moveTo(0, PENCIL_HEIGHT / 2); // Sharp point at center, starting from left edge
    ctx.lineTo(bodyX, bodyY); // Top of body
    ctx.lineTo(bodyX, bodyY + bodyHeight); // Bottom of body
    ctx.closePath();
    ctx.fill();
    
    // Add wood grain lines on tip
    ctx.strokeStyle = 'rgba(139, 111, 71, 0.3)';
    ctx.lineWidth = 0.5;
    ctx.beginPath();
    ctx.moveTo(6, PENCIL_HEIGHT / 2 - 2);
    ctx.lineTo(bodyX - 2, bodyY + 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(8, PENCIL_HEIGHT / 2);
    ctx.lineTo(bodyX - 1, bodyY + bodyHeight / 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(6, PENCIL_HEIGHT / 2 + 2);
    ctx.lineTo(bodyX - 2, bodyY + bodyHeight - 2);
    ctx.stroke();

    // Main colored body - simple rectangle
    ctx.fillStyle = color;
    ctx.fillRect(bodyX, bodyY, bodyWidth, bodyHeight);

    // Thin light gray metal band (ferrule) - simple rectangle
    ctx.fillStyle = '#C8D0D8'; // Light gray/silver
    ctx.fillRect(metalBandX, bodyY, metalBandWidth, bodyHeight);

    // Pink/red eraser - simple rectangle, slightly shorter than body
    const eraserGradient = ctx.createLinearGradient(eraserX, eraserY, eraserX + eraserLength, eraserY);
    eraserGradient.addColorStop(0, '#E76F7C');
    eraserGradient.addColorStop(0.5, '#D95B6B');
    eraserGradient.addColorStop(1, '#C74A5A');
    ctx.fillStyle = eraserGradient;
    ctx.fillRect(eraserX, eraserY, eraserLength, eraserHeight);

    // Continuous black outline around entire pencil
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 1;
    ctx.beginPath();
    // Start from tip
    ctx.moveTo(0, PENCIL_HEIGHT / 2);
    // Tip to body top
    ctx.lineTo(bodyX, bodyY);
    // Body top edge
    ctx.lineTo(metalBandX, bodyY);
    // Metal band top edge
    ctx.lineTo(eraserX, eraserY);
    // Eraser top edge
    ctx.lineTo(eraserX + eraserLength, eraserY);
    // Eraser right edge
    ctx.lineTo(eraserX + eraserLength, eraserY + eraserHeight);
    // Eraser bottom edge
    ctx.lineTo(eraserX, eraserY + eraserHeight);
    // Metal band bottom edge
    ctx.lineTo(metalBandX, bodyY + bodyHeight);
    // Body bottom edge
    ctx.lineTo(bodyX, bodyY + bodyHeight);
    // Body to tip
    ctx.lineTo(0, PENCIL_HEIGHT / 2);
    ctx.closePath();
    ctx.stroke();

    // Lock symbol for fixed pencil - white circle with black outline padlock (centered on body)
    if (isFixed) {
      // Reset shadow for lock
      ctx.shadowBlur = 0;
      ctx.shadowOffsetY = 0;
      ctx.shadowColor = 'transparent';
      
      // Lock position - centered on pencil body (absolute positioning)
      const lockCenterX = bodyX + bodyWidth / 2;
      const lockCenterY = PENCIL_HEIGHT / 2;
      const circleRadius = 14;
      const lockWidth = 10;
      const lockHeight = 10;
      
      // White circle background with black outline
      ctx.fillStyle = '#FFFFFF';
      ctx.beginPath();
      ctx.arc(lockCenterX, lockCenterY, circleRadius, 0, Math.PI * 2);
      ctx.fill();
      
      ctx.strokeStyle = '#000000';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(lockCenterX, lockCenterY, circleRadius, 0, Math.PI * 2);
      ctx.stroke();
      
      // Lock icon - black filled padlock
      ctx.fillStyle = '#000000';
      ctx.strokeStyle = '#000000';
      ctx.lineWidth = 2;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      
      // Lock body (rectangle)
      const lockBodyX = lockCenterX - lockWidth / 2;
      const lockBodyY = lockCenterY - lockHeight / 2 + 2;
      const lockBodyWidth = lockWidth;
      const lockBodyHeight = lockHeight - 3;
      
      // Draw lock body with rounded corners
      const cornerRadius = 1.5;
      ctx.beginPath();
      ctx.moveTo(lockBodyX + cornerRadius, lockBodyY);
      ctx.lineTo(lockBodyX + lockBodyWidth - cornerRadius, lockBodyY);
      ctx.arcTo(lockBodyX + lockBodyWidth, lockBodyY, lockBodyX + lockBodyWidth, lockBodyY + cornerRadius, cornerRadius);
      ctx.lineTo(lockBodyX + lockBodyWidth, lockBodyY + lockBodyHeight - cornerRadius);
      ctx.arcTo(lockBodyX + lockBodyWidth, lockBodyY + lockBodyHeight, lockBodyX + lockBodyWidth - cornerRadius, lockBodyY + lockBodyHeight, cornerRadius);
      ctx.lineTo(lockBodyX + cornerRadius, lockBodyY + lockBodyHeight);
      ctx.arcTo(lockBodyX, lockBodyY + lockBodyHeight, lockBodyX, lockBodyY + lockBodyHeight - cornerRadius, cornerRadius);
      ctx.lineTo(lockBodyX, lockBodyY + cornerRadius);
      ctx.arcTo(lockBodyX, lockBodyY, lockBodyX + cornerRadius, lockBodyY, cornerRadius);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      
      // Lock shackle (U-shape on top)
      const shackleWidth = 6;
      const shackleHeight = 4;
      const shackleX = lockCenterX - shackleWidth / 2;
      const shackleY = lockBodyY - shackleHeight;
      
      ctx.strokeStyle = '#000000';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(shackleX, lockBodyY);
      ctx.lineTo(shackleX, shackleY + 1);
      ctx.arcTo(shackleX, shackleY - 1, shackleX + shackleWidth / 2, shackleY - 1, 2);
      ctx.arcTo(shackleX + shackleWidth, shackleY - 1, shackleX + shackleWidth, shackleY + 1, 2);
      ctx.lineTo(shackleX + shackleWidth, lockBodyY);
      ctx.stroke();
    }

    ctx.restore();
  }, []);

  // Animation loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animationFrameId;

    const render = () => {
      const state = dragStateRef.current;
      
      // Clear canvas
      ctx.clearRect(0, 0, dimensions.width, dimensions.height);

      let needsAnimation = false;

      // Animate positions towards targets
      for (let i = 0; i < state.animatingPositions.length; i++) {
        if (i === state.draggedIndex) continue; // Skip dragged pencil
        
        const current = state.animatingPositions[i];
        const target = state.targetPositions[i];
        
        // Smooth lerp animation
        const diff = target.y - current.y;
        const speed = 0.2;
        current.y += diff * speed;
        
        // Snap when close enough
        if (Math.abs(diff) < 0.5) {
          current.y = target.y;
        } else {
          needsAnimation = true;
        }
      }

      // Draw all pencils
      pencils.forEach((pencil, index) => {
        const isFixed = index === pencils.length - 1; // Last pencil is always fixed/locked
        const isDragging = index === state.draggedIndex;
        
        let drawX, drawY, opacity;
        
        if (isDragging) {
          // Draw dragged pencil at cursor position
          drawX = state.animatingPositions[index].x;
          drawY = state.currentY - state.offsetY;
          opacity = 0.95;
        } else {
          // Draw at animated position
          drawX = state.animatingPositions[index].x;
          drawY = state.animatingPositions[index].y;
          opacity = 1;
        }
        
        // Always draw the pencil, including the lock if it's fixed
        drawPencil(ctx, drawX, drawY, pencil.color, isFixed, isDragging, opacity);
      });

      // Always continue animation for smooth rendering
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [pencils, disabled, dimensions, drawPencil]);

  // Handle mouse/touch events
  const handlePointerDown = useCallback((e) => {
    if (disabled) return;

    const isTouch = e.touches !== undefined;
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const clientY = isTouch ? e.touches[0].clientY : e.clientY;
    const y = clientY - rect.top;

    const state = dragStateRef.current;

    // Find which pencil was clicked
    for (let i = 0; i < pencils.length - 1; i++) { // Exclude last (fixed) pencil
      const pos = state.animatingPositions[i];
      if (y >= pos.y && y <= pos.y + PENCIL_HEIGHT) {
        // For mouse, prevent default to enable drag
        // For touch, we'll handle it in move to allow scroll
        if (!isTouch) {
          e.preventDefault();
        }
        
        state.isDragging = true;
        state.draggedIndex = i;
        state.startY = y;
        state.currentY = y;
        state.offsetY = y - pos.y;
        state.hoverIndex = -1; // Reset hover state
        
        // Initialize scroll tracking for touch devices
        if (isTouch) {
          state.lastScrollY = clientY;
        } else {
          state.lastScrollY = 0;
        }
        
        // Store original positions (actual current positions, not ideal positions)
        state.originalPositions = state.animatingPositions.map(p => ({ ...p }));
        break;
      }
    }
  }, [disabled, pencils, calculatePositions]);

  const handlePointerMove = useCallback((e) => {
    const state = dragStateRef.current;
    if (!state.isDragging) return;

    const isTouch = e.touches !== undefined;
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const clientY = isTouch ? e.touches[0].clientY : e.clientY;
    const y = clientY - rect.top;

    // Handle scrolling on mobile (touch devices) - scroll the canvas container
    // When dragging down (clientY increases), scroll container down
    // When dragging up (clientY decreases), scroll container up
    if (isTouch && state.lastScrollY !== 0) {
      const scrollDelta = clientY - state.lastScrollY;
      
      const container = containerRef.current;
      if (container) {
        // Force a reflow to ensure accurate measurements
        void container.offsetHeight;
        
        // Get accurate scroll measurements
        const currentScrollTop = container.scrollTop || 0;
        const scrollHeight = container.scrollHeight;
        const clientHeight = container.clientHeight;
        
        // Calculate the actual scrollable distance
        let maxScrollTop = scrollHeight - clientHeight;
        maxScrollTop = Math.max(0, maxScrollTop);
        
        // Check if pencil is near viewport edges to enable proactive scrolling
        const canvas = canvasRef.current;
        const canvasRect = canvas.getBoundingClientRect();
        const containerRect = container.getBoundingClientRect();
        
        // Calculate pencil position relative to viewport (not canvas)
        const pencilViewportY = clientY; // clientY is already relative to viewport
        const viewportTop = containerRect.top;
        const viewportBottom = containerRect.bottom;
        const edgeThreshold = 100; // Start scrolling when pencil is within 100px of viewport edge
        
        // Determine if we should scroll based on pencil position near viewport edges
        const nearTopEdge = (pencilViewportY - viewportTop) < edgeThreshold && currentScrollTop > 0;
        const nearBottomEdge = (viewportBottom - pencilViewportY) < edgeThreshold && currentScrollTop < maxScrollTop;
        
        // Make scrolling more responsive - increase sensitivity for smoother scrolling
        let gentleScrollDelta = scrollDelta * 0.6; // Increased from 0.5 to 0.6 for better responsiveness
        
        // If scrolling up (negative delta), be more aggressive when far from top
        // This ensures we can reach the top even when starting from the bottom
        if (gentleScrollDelta < 0) {
          if (currentScrollTop > 100) {
            // Very far from top - use very aggressive scroll
            gentleScrollDelta = scrollDelta * 0.9;
          } else if (currentScrollTop > 50) {
            // Far from top - increase scroll speed
            gentleScrollDelta = scrollDelta * 0.85;
          } else if (currentScrollTop <= 20) {
            // Very close to top - use almost full scroll delta
            gentleScrollDelta = scrollDelta * 0.95;
            // Ensure we don't overshoot
            gentleScrollDelta = Math.min(gentleScrollDelta, -currentScrollTop);
          } else {
            // Moderately close - still aggressive
            gentleScrollDelta = scrollDelta * 0.9;
            // Ensure we don't overshoot
            gentleScrollDelta = Math.min(gentleScrollDelta, -currentScrollTop);
          }
        }
        
        // Proactive scrolling: if pencil is near top edge and moving up, scroll more aggressively
        if (nearTopEdge && gentleScrollDelta < 0) {
          gentleScrollDelta = scrollDelta * 0.95; // Very responsive when near top edge
          // Ensure we don't overshoot
          gentleScrollDelta = Math.min(gentleScrollDelta, -currentScrollTop);
        }
        
        // If scrolling down (positive delta), be more aggressive when far from bottom
        // This ensures we can reach the bottom even when starting from the top
        if (gentleScrollDelta > 0 && maxScrollTop > 0) {
          const distanceFromBottom = maxScrollTop - currentScrollTop;
          if (distanceFromBottom > 100) {
            // Very far from bottom - use very aggressive scroll
            gentleScrollDelta = scrollDelta * 0.9;
          } else if (distanceFromBottom > 50) {
            // Far from bottom - increase scroll speed
            gentleScrollDelta = scrollDelta * 0.85;
          } else if (distanceFromBottom <= 20) {
            // Very close to bottom - use almost full scroll delta
            gentleScrollDelta = scrollDelta * 0.95;
            // Ensure we don't overshoot
            gentleScrollDelta = Math.min(gentleScrollDelta, distanceFromBottom);
          } else {
            // Moderately close - still aggressive
            gentleScrollDelta = scrollDelta * 0.9;
            // Ensure we don't overshoot
            gentleScrollDelta = Math.min(gentleScrollDelta, distanceFromBottom);
          }
        }
        
        // Proactive scrolling: if pencil is near bottom edge and moving down, scroll more aggressively
        if (nearBottomEdge && gentleScrollDelta > 0 && maxScrollTop > 0) {
          gentleScrollDelta = scrollDelta * 0.95; // Very responsive when near bottom edge
          const remainingScroll = maxScrollTop - currentScrollTop;
          gentleScrollDelta = Math.min(gentleScrollDelta, remainingScroll);
        }
        
        // Scroll in the same direction as drag movement
        // Positive scrollDelta (dragging down) → scroll container down
        // Negative scrollDelta (dragging up) → scroll container up
        if (Math.abs(gentleScrollDelta) > 0.1) {
          // Calculate new scroll position
          let newScrollTop = currentScrollTop + gentleScrollDelta;
          
          // Clamp to valid range - allow scrolling to exactly 0 (top) and maxScrollTop (bottom)
          if (newScrollTop < 0) {
            newScrollTop = 0;
          }
          // Only clamp to maxScrollTop if there's actually scrollable content
          else if (maxScrollTop > 0 && newScrollTop > maxScrollTop) {
            newScrollTop = maxScrollTop;
          }
          // If content fits in viewport, don't scroll
          else if (maxScrollTop <= 0) {
            newScrollTop = 0;
          }
          
          // Use Math.round to avoid floating point precision issues, but only after clamping
          newScrollTop = Math.round(newScrollTop);
          
          // Ensure we can still reach exactly 0 after rounding
          if (newScrollTop < 0) {
            newScrollTop = 0;
          }
          
          // If we're very close to top (within 5px) and scrolling up, force to exactly 0
          if (newScrollTop > 0 && newScrollTop <= 5 && gentleScrollDelta < 0) {
            newScrollTop = 0;
          }
          
          // If we're scrolling up and current scroll is very small, force to 0
          if (gentleScrollDelta < 0 && currentScrollTop <= 5) {
            newScrollTop = 0;
          }
          
          // If we're very close to bottom (within 5px) and scrolling down, force to exactly maxScrollTop
          if (maxScrollTop > 0 && newScrollTop < maxScrollTop && newScrollTop >= (maxScrollTop - 5) && gentleScrollDelta > 0) {
            newScrollTop = maxScrollTop;
          }
          
          // If we're scrolling down and current scroll is very close to bottom, force to maxScrollTop
          if (gentleScrollDelta > 0 && maxScrollTop > 0 && (maxScrollTop - currentScrollTop) <= 5) {
            newScrollTop = maxScrollTop;
          }
          
          // Scroll the container immediately
          container.scrollTop = newScrollTop;
          
          // Force scroll to correct position if we're at the edges (handles any browser rounding issues)
          // Use requestAnimationFrame to ensure this happens after the browser processes the scroll
          requestAnimationFrame(() => {
            // Force to 0 if we're at the top (with a small tolerance)
            if (newScrollTop === 0 || container.scrollTop <= 5) {
              container.scrollTop = 0;
            } 
            // Force to maxScrollTop if we're at the bottom (with a small tolerance)
            else if (maxScrollTop > 0 && (newScrollTop === maxScrollTop || container.scrollTop >= (maxScrollTop - 5))) {
              container.scrollTop = maxScrollTop;
            }
            // Double-check after a short delay to ensure we reached the edges
            if (newScrollTop === 0 && container.scrollTop > 0) {
              setTimeout(() => {
                if (container.scrollTop > 0 && container.scrollTop <= 5) {
                  container.scrollTop = 0;
                }
                checkScrollState();
              }, 50);
            } else if (maxScrollTop > 0 && newScrollTop === maxScrollTop && container.scrollTop < maxScrollTop) {
              setTimeout(() => {
                if (container.scrollTop < maxScrollTop && container.scrollTop >= (maxScrollTop - 5)) {
                  container.scrollTop = maxScrollTop;
                }
                checkScrollState();
              }, 50);
            } else {
              checkScrollState();
            }
          });
        }
      }
      
      // Update last scroll position immediately for next calculation
      state.lastScrollY = clientY;
    }

    // Only prevent default for mouse (touch events are handled with non-passive listeners)
    if (!isTouch) {
      e.preventDefault();
    }

    state.currentY = y;

    // Only enable hover detection after minimum movement to prevent false triggers
    const movementThreshold = 10; // pixels
    const hasMovedEnough = Math.abs(y - state.startY) > movementThreshold;
    
    if (!hasMovedEnough) {
      // Reset hover state if not moved enough
      if (state.hoverIndex !== -1) {
        state.hoverIndex = -1;
        state.targetPositions = [...state.originalPositions];
      }
      return;
    }

    // Find which pencil we're hovering over
    const draggedY = y - state.offsetY + PENCIL_HEIGHT / 2;
    let hoverIndex = -1;

    for (let i = 0; i < pencils.length - 1; i++) { // Exclude last (fixed) pencil
      if (i === state.draggedIndex) continue; // Skip the dragged pencil itself
      
      const pos = state.originalPositions[i];
      
      // Check if cursor is within the pencil bounds using original positions
      if (draggedY >= pos.y && draggedY <= pos.y + PENCIL_HEIGHT) {
        hoverIndex = i;
        break; // Take the first match
      }
    }

    // Update hover state - show visual shift of all pencils
    if (hoverIndex !== state.hoverIndex) {
      state.hoverIndex = hoverIndex;
      
      if (hoverIndex !== -1) {
        // Always use original positions as the base for consistent calculations
        const newTargetPositions = [...state.originalPositions];
        
        // Proper shifting logic: move pencils to create space at hovered position
        if (hoverIndex < state.draggedIndex) {
          // Hovering above dragged pencil - shift pencils down to create space above
          // All pencils from hoverIndex to draggedIndex-1 shift down by one position
          for (let i = hoverIndex; i < state.draggedIndex; i++) {
            // Calculate new position based on spacing formula
            const startY = 20;
            const newY = startY + (i + 1) * (PENCIL_HEIGHT + PENCIL_SPACING);
            newTargetPositions[i] = {
              ...newTargetPositions[i],
              y: newY
            };
          }
          
        } else if (hoverIndex > state.draggedIndex) {
          // Hovering below dragged pencil - shift pencils up to create space below
          // All pencils from draggedIndex+1 to hoverIndex shift up by one position
          for (let i = state.draggedIndex + 1; i <= hoverIndex; i++) {
            // Calculate new position based on spacing formula
            const startY = 20;
            const newY = startY + (i - 1) * (PENCIL_HEIGHT + PENCIL_SPACING);
            newTargetPositions[i] = {
              ...newTargetPositions[i],
              y: newY
            };
          }
        }
        
        // Pencils not involved in the shift keep their original positions
        for (let i = 0; i < pencils.length - 1; i++) {
          if (i === state.draggedIndex) continue; // Skip dragged pencil
          
          // If this pencil wasn't moved in the shift above, keep its original position
          let wasMoved = false;
          if (hoverIndex < state.draggedIndex) {
            wasMoved = (i >= hoverIndex && i < state.draggedIndex);
          } else if (hoverIndex > state.draggedIndex) {
            wasMoved = (i > state.draggedIndex && i <= hoverIndex);
          }
          
          if (!wasMoved) {
            // Keep the original position (already set in newTargetPositions)
            // No need to change anything since we started with originalPositions
          }
        }
                
        state.targetPositions = newTargetPositions;
      } else {
        // Reset all positions to original when not hovering
        state.targetPositions = [...state.originalPositions];
      }
    }
  }, [pencils, calculatePositions]);

  const handlePointerUp = useCallback(() => {
    const state = dragStateRef.current;
    if (!state.isDragging) return;

    state.isDragging = false;
    state.lastScrollY = 0; // Reset scroll tracking

    // Handle drop - replacement only happens here
    const draggedIndex = state.draggedIndex;
    
    if (draggedIndex >= 0) {
      if (state.hoverIndex !== -1 && state.hoverIndex !== draggedIndex) {
        // Drop on hovered pencil - perform the replacement
        const newOrder = [...pencils];
        
        // Remove the dragged pencil from its current position
        const [draggedPencil] = newOrder.splice(draggedIndex, 1);
        
        // Insert the dragged pencil at the hovered position
        newOrder.splice(state.hoverIndex, 0, draggedPencil);
        
        // Check if the order actually changed by comparing pencil IDs
        const hasChanged = pencils.length !== newOrder.length || 
          pencils.some((pencil, index) => pencil.id !== newOrder[index].id);
        
        // Only call onPencilsReorder if there was an actual change
        if (hasChanged) {
          onPencilsReorder(newOrder);
        }
        
        // Update animating positions to match the new order
        const newPositions = calculatePositions();
        state.animatingPositions = newPositions.map(p => ({ ...p }));
        state.targetPositions = newPositions.map(p => ({ ...p }));
      } else {
        // Drop in empty space - determine position based on cursor
        const draggedY = state.currentY - state.offsetY + PENCIL_HEIGHT / 2;
        let newIndex = draggedIndex;

        // Check if we're close to the original position (within tolerance)
        const originalPos = state.originalPositions[draggedIndex];
        const originalMidY = originalPos.y + PENCIL_HEIGHT / 2;
        const positionTolerance = 20; // pixels
        
        if (Math.abs(draggedY - originalMidY) < positionTolerance) {
          // Close to original position, keep it there
          newIndex = draggedIndex;
        } else {
          // Find insertion point
          for (let i = 0; i < pencils.length - 1; i++) {
            if (i === draggedIndex) continue;
            
            const pos = state.originalPositions[i];
            const midY = pos.y + PENCIL_HEIGHT / 2;
            
            if (draggedY < midY) {
              newIndex = i;
              break;
            } else if (i === pencils.length - 2) {
              newIndex = i;
            }
          }
        }

        // Only reorder if position changed
        if (newIndex !== draggedIndex) {
          const newOrder = [...pencils];
          const [dragged] = newOrder.splice(draggedIndex, 1);
          newOrder.splice(newIndex, 0, dragged);
          
          // Check if the order actually changed by comparing pencil IDs
          const hasChanged = pencils.length !== newOrder.length || 
            pencils.some((pencil, index) => pencil.id !== newOrder[index].id);
          
          // Only call onPencilsReorder if there was an actual change
          if (hasChanged) {
            onPencilsReorder(newOrder);
          }
          
          // Update animating positions to match the new order
          const newPositions = calculatePositions();
          state.animatingPositions = newPositions.map(p => ({ ...p }));
          state.targetPositions = newPositions.map(p => ({ ...p }));
        }
      }
    }

    // Reset state
    state.draggedIndex = -1;
    state.hoverIndex = -1;
  }, [pencils, onPencilsReorder]);

  const handleMouseMove = useCallback((e) => {
    const state = dragStateRef.current;
    
    // If dragging, handle drag movement
    if (state.isDragging) {
      handlePointerMove(e);
      return;
    }

    // Simple cursor update
    if (disabled) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const y = e.clientY - rect.top;

    // Simple hover detection
    let canDrag = false;
    let isOverLocked = false;
    
    // Check draggable pencils
    for (let i = 0; i < pencils.length - 1; i++) { // Exclude last (fixed) pencil
      const pos = state.animatingPositions[i];
      if (y >= pos.y && y <= pos.y + PENCIL_HEIGHT) {
        canDrag = true;
        break;
      }
    }
    
    // Check if hovering over locked pencil
    if (!canDrag && pencils.length > 0) {
      const lastPencilIndex = pencils.length - 1;
      const pos = state.animatingPositions[lastPencilIndex];
      if (y >= pos.y && y <= pos.y + PENCIL_HEIGHT) {
        isOverLocked = true;
      }
    }

    // Update cursor
    if (canDrag) {
      canvas.style.cursor = 'grab';
    } else if (isOverLocked) {
      canvas.style.cursor = 'not-allowed';
    } else {
      canvas.style.cursor = 'default';
    }
  }, [disabled, pencils, handlePointerMove]);

  // Set up canvas size
  useEffect(() => {
    const updateSize = () => {
      const container = canvasRef.current?.parentElement;
      if (container) {
        // Width is constrained by container or max 400px
        const width = Math.min(container.clientWidth - 20, 400); // Account for padding
        
        // Dynamic height based on number of pencils - always full size
        // This ensures pencils are never compressed, container will scroll
        const totalPencilHeight = pencils.length * PENCIL_HEIGHT;
        const totalSpacing = Math.max(0, (pencils.length - 1) * PENCIL_SPACING);
        const topPadding = 40; // Top padding for buffer (prevents cropping at top)
        
        // Calculate bottom padding - account for mobile navigation bar on mobile devices
        // Container has padding-bottom: calc(10px + env(safe-area-inset-bottom, 0px) + 56px) on mobile
        // We need extra padding in canvas height so last pencil can scroll above navigation bar
        const isMobile = window.innerWidth <= 768;
        const mobileNavBarHeight = isMobile ? 80 : 0; // Account for mobile nav bar + safe area
        const bottomPadding = 30 + mobileNavBarHeight; // Base buffer + mobile navigation bar
        
        const height = Math.max(200, totalPencilHeight + totalSpacing + topPadding + bottomPadding);
        
        setDimensions({ width, height });
      }
    };

    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, [pencils]);

  // Set up canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Set display size
    canvas.style.width = `${dimensions.width}px`;
    canvas.style.height = `${dimensions.height}px`;

    // Set actual canvas size (for retina displays)
    const dpr = window.devicePixelRatio || 1;
    canvas.width = dimensions.width * dpr;
    canvas.height = dimensions.height * dpr;

    const ctx = canvas.getContext('2d');
    ctx.scale(dpr, dpr);
  }, [dimensions]);

  // Check scroll state and update scroll buttons visibility
  const checkScrollState = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;
    
    const scrollTop = container.scrollTop || 0;
    const scrollHeight = container.scrollHeight;
    const clientHeight = container.clientHeight;
    const maxScroll = Math.max(0, scrollHeight - clientHeight);
    
    // Use a threshold to avoid showing buttons when at the edges
    // Show up button only if we can actually scroll up meaningfully
    // Use a smaller threshold (5px) to ensure button disappears when truly at top
    setCanScrollUp(scrollTop > 5);
    // Show down button only if we can actually scroll down meaningfully
    setCanScrollDown(maxScroll > 0 && scrollTop < maxScroll - 5);
  }, []);

  // Store container reference for scrolling and ensure scroll boundaries are correct
  useEffect(() => {
    dragStateRef.current.containerRef = containerRef.current;
    
    // Ensure container can scroll to top and bottom when dimensions change
    const container = containerRef.current;
    if (container) {
      // Small delay to ensure layout is complete
      const timeoutId = setTimeout(() => {
        const scrollHeight = container.scrollHeight;
        const clientHeight = container.clientHeight;
        const maxScroll = scrollHeight - clientHeight;
        
        // If we're scrolled beyond bounds, fix it
        if (container.scrollTop < 0) {
          container.scrollTop = 0;
        } else if (maxScroll > 0 && container.scrollTop > maxScroll) {
          container.scrollTop = maxScroll;
        }
        
        // Check scroll state for buttons
        checkScrollState();
      }, 100);
      
      // Listen for scroll events to update button visibility
      const handleScroll = () => {
        checkScrollState();
      };
      
      // Use passive listener for better performance
      container.addEventListener('scroll', handleScroll, { passive: true });
      
      // Also check on resize
      const handleResize = () => {
        setTimeout(() => {
          checkScrollState();
        }, 50);
      };
      
      window.addEventListener('resize', handleResize);
      
      return () => {
        clearTimeout(timeoutId);
        container.removeEventListener('scroll', handleScroll);
        window.removeEventListener('resize', handleResize);
      };
    }
  }, [dimensions, checkScrollState]);

  // Scroll handlers
  const handleScrollUp = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;
    
    const scrollAmount = container.clientHeight * 0.8; // Scroll 80% of viewport
    const newScrollTop = Math.max(0, container.scrollTop - scrollAmount);
    container.scrollTo({ top: newScrollTop, behavior: 'smooth' });
    
    // Update scroll state after scrolling
    setTimeout(() => {
      checkScrollState();
    }, 100);
  }, [checkScrollState]);

  const handleScrollDown = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;
    
    const scrollHeight = container.scrollHeight;
    const clientHeight = container.clientHeight;
    const maxScroll = Math.max(0, scrollHeight - clientHeight);
    const scrollAmount = container.clientHeight * 0.8; // Scroll 80% of viewport
    const newScrollTop = Math.min(maxScroll, container.scrollTop + scrollAmount);
    container.scrollTo({ top: newScrollTop, behavior: 'smooth' });
    
    // Update scroll state after scrolling
    setTimeout(() => {
      checkScrollState();
    }, 100);
  }, [checkScrollState]);

  // Set up non-passive touch event listeners to avoid preventDefault errors
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Use non-passive listeners for touch events to allow preventDefault
    const touchStartHandler = (e) => {
      handlePointerDown(e);
      // Prevent default if we started dragging a pencil
      if (dragStateRef.current.isDragging) {
        e.preventDefault();
      }
    };

    const touchMoveHandler = (e) => {
      // Check if we're dragging before calling handler
      const wasDragging = dragStateRef.current.isDragging;
      handlePointerMove(e);
      // Prevent default during drag to control scrolling manually
      if (dragStateRef.current.isDragging || wasDragging) {
        e.preventDefault();
      }
    };

    const touchEndHandler = (e) => {
      const wasDragging = dragStateRef.current.isDragging;
      handlePointerUp(e);
      if (wasDragging) {
        e.preventDefault();
      }
    };

    // Add non-passive listeners
    canvas.addEventListener('touchstart', touchStartHandler, { passive: false });
    canvas.addEventListener('touchmove', touchMoveHandler, { passive: false });
    canvas.addEventListener('touchend', touchEndHandler, { passive: false });
    canvas.addEventListener('touchcancel', touchEndHandler, { passive: false });

    return () => {
      canvas.removeEventListener('touchstart', touchStartHandler);
      canvas.removeEventListener('touchmove', touchMoveHandler);
      canvas.removeEventListener('touchend', touchEndHandler);
      canvas.removeEventListener('touchcancel', touchEndHandler);
    };
  }, [handlePointerDown, handlePointerMove, handlePointerUp]);

  return (
    <div className="pencil-box-canvas-wrapper">
      <div 
        ref={containerRef}
        className="pencil-box-canvas-container"
      >
        <canvas
          ref={canvasRef}
          className="pencil-canvas"
          onMouseDown={handlePointerDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handlePointerUp}
          onMouseLeave={handlePointerUp}
          style={{ touchAction: 'pan-y' }}
        />
      </div>
      
      {/* Scroll buttons - outside scrolling container */}
      {canScrollUp && (
        <button
          className="scroll-button scroll-button-up"
          onClick={handleScrollUp}
          aria-label="Scroll up"
        >
          ↑
        </button>
      )}
      {canScrollDown && (
        <button
          className="scroll-button scroll-button-down"
          onClick={handleScrollDown}
          aria-label="Scroll down"
        >
          ↓
        </button>
      )}
    </div>
  );
}

