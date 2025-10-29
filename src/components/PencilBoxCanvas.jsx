import { useRef, useEffect, useState, useCallback } from 'react';
import './PencilBoxCanvas.css';

export default function PencilBoxCanvas({ pencils, onPencilsReorder, disabled = false }) {
  const canvasRef = useRef(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });
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
  });

  const PENCIL_HEIGHT = 40;
  const PENCIL_WIDTH = 300;
  const PENCIL_SPACING = 0;
  const LOCK_ICON_SIZE = 32;

  // Calculate pencil positions
  const calculatePositions = useCallback(() => {
    const containerWidth = dimensions.width;
    const startX = (containerWidth - PENCIL_WIDTH) / 2;
    const startY = 20; // Start closer to top

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
    const scale = isDragging ? 1.05 : (isFixed ? 0.95 : 1);
    ctx.translate(x + PENCIL_WIDTH / 2, y + PENCIL_HEIGHT / 2);
    ctx.scale(scale, scale);
    ctx.translate(-PENCIL_WIDTH / 2, -PENCIL_HEIGHT / 2);

    // Pencil body - simplified hexagonal shape
    const bodyWidth = 270;
    const bodyHeight = 24;
    const bodyX = 30;
    const bodyY = (PENCIL_HEIGHT - bodyHeight) / 2;

    // Draw tip
    ctx.beginPath();
    ctx.moveTo(10, PENCIL_HEIGHT / 2);
    ctx.lineTo(bodyX, bodyY + 2);
    ctx.lineTo(bodyX, bodyY + bodyHeight - 2);
    ctx.closePath();
    ctx.fillStyle = '#8B6F47';
    ctx.fill();

    // Core tip
    ctx.beginPath();
    ctx.moveTo(10, PENCIL_HEIGHT / 2);
    ctx.lineTo(20, bodyY + 7);
    ctx.lineTo(20, bodyY + bodyHeight - 7);
    ctx.closePath();
    ctx.fillStyle = adjustColor(color, 10);
    ctx.fill();

    // Main body - top facet (lightest)
    ctx.fillStyle = adjustColor(color, 40);
    ctx.fillRect(bodyX, bodyY, bodyWidth, 6);

    // White highlight
    ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.fillRect(bodyX, bodyY, bodyWidth, 2);

    // Middle facets
    ctx.fillStyle = adjustColor(color, 20);
    ctx.fillRect(bodyX, bodyY + 6, bodyWidth, 6);

    ctx.fillStyle = color;
    ctx.fillRect(bodyX, bodyY + 12, bodyWidth, 6);

    // Bottom facet (darkest)
    ctx.fillStyle = adjustColor(color, -30);
    ctx.fillRect(bodyX, bodyY + 18, bodyWidth, 6);

    // End cap
    const capX = bodyX + bodyWidth;
    ctx.fillStyle = adjustColor(color, -40);
    ctx.beginPath();
    ctx.moveTo(capX, bodyY + 2);
    ctx.lineTo(capX + 6, bodyY + 6);
    ctx.lineTo(capX + 6, bodyY + bodyHeight - 6);
    ctx.lineTo(capX, bodyY + bodyHeight - 2);
    ctx.closePath();
    ctx.fill();

    // Inner shadow on cap
    ctx.fillStyle = adjustColor(color, -50);
    ctx.globalAlpha = opacity * 0.6;
    ctx.beginPath();
    ctx.ellipse(capX + 3, PENCIL_HEIGHT / 2, 2, 5, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.globalAlpha = opacity;

    // Lock indicator for fixed pencil
    if (isFixed) {
      ctx.shadowBlur = 0;
      ctx.shadowOffsetY = 0;
      
      const lockX = capX - 40;
      const lockY = PENCIL_HEIGHT / 2;
      
      // Lock background circle
      ctx.beginPath();
      ctx.arc(lockX, lockY, LOCK_ICON_SIZE / 2, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
      ctx.fill();
      
      // Lock icon (simplified)
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.9)';
      ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
      ctx.lineWidth = 2;
      
      // Lock shackle
      ctx.beginPath();
      ctx.arc(lockX, lockY - 2, 5, Math.PI, 0, false);
      ctx.stroke();
      
      // Lock body
      ctx.fillRect(lockX - 6, lockY - 2, 12, 8);
      
      // Keyhole
      ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
      ctx.beginPath();
      ctx.arc(lockX, lockY + 1, 2, 0, Math.PI * 2);
      ctx.fill();
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
        const isFixed = index === pencils.length - 1;
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
          opacity = isFixed ? 0.85 : 1;
        }
        
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

    e.preventDefault();

    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    const y = clientY - rect.top;

    const state = dragStateRef.current;

    // Find which pencil was clicked
    for (let i = 0; i < pencils.length - 1; i++) { // Exclude last (fixed) pencil
      const pos = state.animatingPositions[i];
      if (y >= pos.y && y <= pos.y + PENCIL_HEIGHT) {
        state.isDragging = true;
        state.draggedIndex = i;
        state.startY = y;
        state.currentY = y;
        state.offsetY = y - pos.y;
        state.hoverIndex = -1; // Reset hover state
        
        // Store original positions
        state.originalPositions = calculatePositions();
        break;
      }
    }
  }, [disabled, pencils, calculatePositions]);

  const handlePointerMove = useCallback((e) => {
    const state = dragStateRef.current;
    if (!state.isDragging) return;

    e.preventDefault();

    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    const y = clientY - rect.top;

    state.currentY = y;

    // Find which pencil we're hovering over
    const draggedY = y - state.offsetY + PENCIL_HEIGHT / 2;
    let hoverIndex = -1;

    console.log('Checking hover at draggedY:', draggedY);
    console.log('Original positions for hover check:', state.originalPositions.map((pos, i) => `Pencil ${i}: y=${pos.y} to y=${pos.y + PENCIL_HEIGHT}`));

    for (let i = 0; i < pencils.length - 1; i++) { // Exclude last (fixed) pencil
      if (i === state.draggedIndex) continue; // Skip the dragged pencil itself
      
      const pos = state.originalPositions[i];
      
      // Check if cursor is within the pencil bounds using original positions
      if (draggedY >= pos.y && draggedY <= pos.y + PENCIL_HEIGHT) {
        hoverIndex = i;
        console.log(`Found hover match at pencil ${i}`);
        break; // Take the first match
      }
    }
    
    console.log('Final hoverIndex:', hoverIndex);

    // Update hover state - show visual shift of all pencils
    console.log('Current hoverIndex:', state.hoverIndex, 'New hoverIndex:', hoverIndex);
    if (hoverIndex !== state.hoverIndex) {
      console.log('Hover state changed! Updating...');
      state.hoverIndex = hoverIndex;
      
      if (hoverIndex !== -1) {
        // Always use original positions as the base for consistent calculations
        const newTargetPositions = [...state.originalPositions];
        
        console.log('Hover detected:', hoverIndex, 'draggedIndex:', state.draggedIndex);
        console.log('Current positions:', state.animatingPositions.map((pos, i) => `Pencil ${i}: y=${pos.y}`));
        console.log('Original positions:', state.originalPositions.map((pos, i) => `Pencil ${i}: y=${pos.y}`));
        
        // Proper shifting logic: move pencils to create space at hovered position
        console.log('Creating space at hovered position', hoverIndex);
        
        if (hoverIndex < state.draggedIndex) {
          // Hovering above dragged pencil - shift pencils down to create space above
          console.log('Hovering ABOVE - shifting pencils down');
          
          // All pencils from hoverIndex to draggedIndex-1 shift down by one position
          for (let i = hoverIndex; i < state.draggedIndex; i++) {
            // Calculate new position based on spacing formula
            const startY = 20;
            const newY = startY + (i + 1) * (PENCIL_HEIGHT + PENCIL_SPACING);
            newTargetPositions[i] = {
              ...newTargetPositions[i],
              y: newY
            };
            console.log(`Pencil ${i} shifts down to y=${newY}`);
          }
          
        } else if (hoverIndex > state.draggedIndex) {
          // Hovering below dragged pencil - shift pencils up to create space below
          console.log('Hovering BELOW - shifting pencils up');
          
          // All pencils from draggedIndex+1 to hoverIndex shift up by one position
          for (let i = state.draggedIndex + 1; i <= hoverIndex; i++) {
            // Calculate new position based on spacing formula
            const startY = 20;
            const newY = startY + (i - 1) * (PENCIL_HEIGHT + PENCIL_SPACING);
            newTargetPositions[i] = {
              ...newTargetPositions[i],
              y: newY
            };
            console.log(`Pencil ${i} shifts up to y=${newY}`);
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
        
        console.log('Final target positions:', newTargetPositions.map((pos, i) => `Pencil ${i}: y=${pos.y}`));
                
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
        
        onPencilsReorder(newOrder);
        
        // Update animating positions to match the new order
        const newPositions = calculatePositions();
        state.animatingPositions = newPositions.map(p => ({ ...p }));
        state.targetPositions = newPositions.map(p => ({ ...p }));
      } else {
        // Drop in empty space - determine position based on cursor
        const draggedY = state.currentY - state.offsetY + PENCIL_HEIGHT / 2;
        let newIndex = draggedIndex;

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

        // Only reorder if position changed
        if (newIndex !== draggedIndex) {
          const newOrder = [...pencils];
          const [dragged] = newOrder.splice(draggedIndex, 1);
          newOrder.splice(newIndex, 0, dragged);
          onPencilsReorder(newOrder);
          
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
    for (let i = 0; i < pencils.length - 1; i++) { // Exclude last (fixed) pencil
      const pos = state.animatingPositions[i];
      if (y >= pos.y && y <= pos.y + PENCIL_HEIGHT) {
        canDrag = true;
        break;
      }
    }

    // Update cursor
    canvas.style.cursor = canDrag ? 'grab' : 'default';
  }, [disabled, pencils, handlePointerMove]);

  // Set up canvas size
  useEffect(() => {
    const updateSize = () => {
      const container = canvasRef.current?.parentElement;
      if (container) {
        const width = Math.min(container.clientWidth, 800);
        // Dynamic height based on number of pencils
        const totalPencilHeight = pencils.length * PENCIL_HEIGHT;
        const totalSpacing = Math.max(0, (pencils.length - 1) * PENCIL_SPACING);
        const padding = 40; // Top and bottom padding
        const height = Math.max(200, totalPencilHeight + totalSpacing + padding);
        
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

  return (
    <div className="pencil-box-canvas-container">
      <canvas
        ref={canvasRef}
        className="pencil-canvas"
        onMouseDown={handlePointerDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handlePointerUp}
        onMouseLeave={handlePointerUp}
        onTouchStart={handlePointerDown}
        onTouchMove={handlePointerMove}
        onTouchEnd={handlePointerUp}
        onTouchCancel={handlePointerUp}
        style={{ touchAction: 'none' }}
      />
    </div>
  );
}

