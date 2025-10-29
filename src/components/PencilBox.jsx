import { useState } from 'react';
import {
  DndContext,
  closestCenter,
  pointerWithin,
  rectIntersection,
  KeyboardSensor,
  PointerSensor,
  TouchSensor,
  MouseSensor,
  useSensor,
  useSensors,
  DragOverlay,
  useDroppable,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import Pencil from './Pencil';
import DragOverlayPencil from './DragOverlayPencil';
import './PencilBox.css';

function BeforeLastDropZone({ isOver }) {
  const { setNodeRef } = useDroppable({
    id: 'before-last-drop-zone',
  });

  return (
    <div 
      ref={setNodeRef}
      className={`before-last-drop-zone ${isOver ? 'is-over' : ''}`}
      style={{ position: 'relative', width: '100%' }}
    />
  );
}

export default function PencilBox({ pencils, onPencilsReorder, disabled = false }) {
  const [activeId, setActiveId] = useState(null);
  const [overId, setOverId] = useState(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 200, // Reduced from 250ms - hold for 200ms
        tolerance: 5, // Small movement allowed during hold
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  function handleDragStart(event) {
    if (disabled) return;
    const draggedIndex = pencils.findIndex(p => p.id === event.active.id);
    
    // Don't allow dragging the last pencil (darkest, always at bottom)
    if (draggedIndex === pencils.length - 1) {
      return;
    }
    setActiveId(event.active.id);
  }

  function handleDragOver(event) {
    const { over } = event;
    setOverId(over?.id || null);
  }

  function handleDragEnd(event) {
    const { active, over } = event;
    
    if (over) {
      // Handle dropping before the last pencil
      if (over.id === 'before-last-drop-zone') {
        const oldIndex = pencils.findIndex(p => p.id === active.id);
        const newIndex = pencils.length - 2; // Second to last position
        
        if (oldIndex !== newIndex) {
          const newOrder = arrayMove(pencils, oldIndex, newIndex);
          // Immediate update for smooth drop
          onPencilsReorder(newOrder);
        }
      } else {
        const overIndex = pencils.findIndex(p => p.id === over.id);
        
        // Don't allow dropping on the last position (darkest pencil)
        if (overIndex === pencils.length - 1) {
          setActiveId(null);
          setOverId(null);
          return;
        }

        if (active.id !== over.id) {
          const oldIndex = pencils.findIndex(p => p.id === active.id);
          let newIndex = pencils.findIndex(p => p.id === over.id);

          const newOrder = arrayMove(pencils, oldIndex, newIndex);
          // Immediate update for smooth drop
          onPencilsReorder(newOrder);
        }
      }
    }

    setActiveId(null);
    setOverId(null);
  }

  function handleDragCancel() {
    setActiveId(null);
    setOverId(null);
  }

  const activePencil = pencils.find(p => p.id === activeId);

  return (
    <div className="pencil-box-container">
      {!disabled && (
        <div className={`game-hint ${activeId ? 'hint-dragging' : ''}`}>
          <div className="hint-icon">💡</div>
          <div className="hint-content">
            <p className="hint-main">Drag and arrange the pencils by color spectrum</p>
            <p className="hint-sub">Darkest pencil is locked • Look for subtle color differences</p>
          </div>
        </div>
      )}

      <DndContext
        sensors={sensors}
        collisionDetection={pointerWithin}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
        onDragCancel={handleDragCancel}
        modifiers={[]}
      >
        <div className={`pencil-box ${disabled ? 'disabled' : ''}`}>
          {activeId && (
            <div className="drag-indicator">
              <span className="drag-pulse"></span>
              Dragging...
            </div>
          )}
          
          <SortableContext
            items={pencils.map(p => p.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className={`pencils-container ${activeId ? 'is-dragging' : ''}`}>
              {pencils.map((pencil, index) => {
                const isBeingDragged = pencil.id === activeId;
                const isOverThis = pencil.id === overId;
                const isLastPencil = index === pencils.length - 1; // Last pencil is always darkest and pinned
                
                // Don't render the pencil being dragged - remove it from the list
                if (isBeingDragged) {
                  return null;
                }
                
                return (
                  <div key={pencil.id} style={{ position: 'relative', width: '100%' }}>
                    {/* Drop zone BEFORE (above) the last pencil */}
                    {isLastPencil && activeId && (
                      <BeforeLastDropZone isOver={overId === 'before-last-drop-zone'} />
                    )}
                    
                    {/* Show placeholder space when hovering over this pencil (but not over the last pencil) */}
                    {activeId && isOverThis && !isLastPencil && (
                      <div className="drop-placeholder" />
                    )}
                    <Pencil
                      id={pencil.id}
                      color={pencil.color}
                      isDragging={false}
                      isFixed={isLastPencil}
                    />
                  </div>
                );
              })}
            </div>
          </SortableContext>
        </div>

        <DragOverlay 
          dropAnimation={null}
          style={{ 
            cursor: 'grabbing',
          }}
        >
          {activeId && activePencil ? (
            <DragOverlayPencil color={activePencil.color} />
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
}

