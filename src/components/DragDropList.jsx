import React, { useState } from 'react';
import { GripVertical, Edit2, Trash2, Eye, EyeOff } from 'lucide-react';

export default function DragDropList({ items, onReorder, onEdit, onDelete, onToggleActive }) {
  const [draggedIndex, setDraggedIndex] = useState(null);
  const [dragOverIndex, setDragOverIndex] = useState(null);

  const handleDragStart = (e, index) => {
    setDraggedIndex(index);
    // Required for Firefox
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', e.currentTarget);
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
    if (draggedIndex === index) return;
    setDragOverIndex(index);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const handleDrop = (e, index) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;

    const updatedItems = [...items];
    const draggedItem = updatedItems[draggedIndex];
    
    // Remove dragged item from its original position
    updatedItems.splice(draggedIndex, 1);
    // Insert dragged item at new position
    updatedItems.splice(index, 0, draggedItem);

    onReorder(updatedItems);
    handleDragEnd();
  };

  if (!items || items.length === 0) {
    return (
      <div className="empty-state">
        <p>Hali havolalar qo'shilmagan. Sahifangizda ko'rsatish uchun birinchi havolangizni qo'shing!</p>
      </div>
    );
  }

  return (
    <div className="drag-drop-list">
      {items.map((item, index) => {
        const isDragging = draggedIndex === index;
        const isDragOver = dragOverIndex === index;

        return (
          <div
            key={item.id}
            className={`dnd-item ${isDragging ? 'dragging' : ''} ${isDragOver ? 'drag-over' : ''} ${!item.active ? 'inactive' : ''}`}
            draggable
            onDragStart={(e) => handleDragStart(e, index)}
            onDragOver={(e) => handleDragOver(e, index)}
            onDragEnd={handleDragEnd}
            onDrop={(e) => handleDrop(e, index)}
          >
            <div className="dnd-drag-handle" title="Tartibni o'zgartirish uchun sudrang">
              <GripVertical size={20} />
            </div>

            <div className="dnd-content">
              <div className="dnd-info">
                <span className="dnd-title">{item.title}</span>
                <span className="dnd-url">{item.url}</span>
              </div>
              
              <div className="dnd-meta-badges">
                {item.icon && <span className="icon-badge">{item.icon}</span>}
                {!item.active && <span className="inactive-badge">Yashirin</span>}
              </div>
            </div>

            <div className="dnd-actions">
              <button 
                className="action-btn toggle-btn" 
                onClick={() => onToggleActive(item.id)}
                title={item.active ? "Havolani yashirish" : "Havolani ko'rsatish"}
              >
                {item.active ? <Eye size={18} /> : <EyeOff size={18} className="inactive-icon" />}
              </button>

              <button 
                className="action-btn edit-btn" 
                onClick={() => onEdit(item)}
                title="Tahrirlash"
              >
                <Edit2 size={18} />
              </button>

              <button 
                className="action-btn delete-btn" 
                onClick={() => onDelete(item.id)}
                title="O'chirish"
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        );
      })}
      <style>{`
        .drag-drop-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
          margin-top: 16px;
        }

        .dnd-item {
          display: flex;
          align-items: center;
          background-color: rgba(255, 255, 255, 0.03);
          border: 1px solid var(--glass-border);
          border-radius: var(--border-radius-md);
          padding: 12px 16px;
          transition: all 0.2s ease;
          user-select: none;
        }

        .theme-minimal-light .dnd-item {
          background-color: #ffffff;
        }

        .dnd-item.dragging {
          opacity: 0.4;
          border-style: dashed;
          background-color: rgba(99, 102, 241, 0.05);
        }

        .dnd-item.drag-over {
          border-color: var(--accent-color);
          transform: translateY(2px);
          background-color: rgba(99, 102, 241, 0.03);
        }

        .dnd-item.inactive {
          background-color: rgba(0, 0, 0, 0.15);
          border-color: rgba(255, 255, 255, 0.03);
        }

        .theme-minimal-light .dnd-item.inactive {
          background-color: #f1f5f9;
          border-color: rgba(0, 0, 0, 0.05);
        }

        .dnd-drag-handle {
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--text-secondary);
          cursor: grab;
          margin-right: 12px;
          padding: 4px;
          border-radius: 4px;
          transition: background 0.15s;
        }

        .dnd-drag-handle:hover {
          background-color: rgba(255, 255, 255, 0.05);
          color: var(--text-primary);
        }

        .dnd-drag-handle:active {
          cursor: grabbing;
        }

        .dnd-content {
          flex-grow: 1;
          display: flex;
          flex-direction: column;
          gap: 4px;
          min-width: 0; /* Ensures text-overflow ellipsis works inside flexbox */
          margin-right: 16px;
        }

        .dnd-info {
          display: flex;
          flex-direction: column;
        }

        .dnd-title {
          font-weight: 600;
          font-size: 0.975rem;
          color: var(--text-primary);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .dnd-url {
          font-size: 0.8rem;
          color: var(--text-secondary);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .dnd-meta-badges {
          display: flex;
          gap: 6px;
          margin-top: 4px;
        }

        .icon-badge {
          background-color: rgba(99, 102, 241, 0.15);
          color: #818cf8;
          font-size: 0.7rem;
          font-weight: 600;
          padding: 2px 6px;
          border-radius: 4px;
          border: 1px solid rgba(99, 102, 241, 0.2);
        }

        .inactive-badge {
          background-color: rgba(239, 68, 68, 0.15);
          color: #f87171;
          font-size: 0.7rem;
          font-weight: 600;
          padding: 2px 6px;
          border-radius: 4px;
          border: 1px solid rgba(239, 68, 68, 0.2);
        }

        .dnd-actions {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .action-btn {
          background: none;
          border: none;
          color: var(--text-secondary);
          cursor: pointer;
          width: 34px;
          height: 34px;
          border-radius: var(--border-radius-sm);
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.15s;
        }

        .action-btn:hover {
          background-color: rgba(255, 255, 255, 0.05);
          color: var(--text-primary);
        }

        .theme-minimal-light .action-btn:hover {
          background-color: #f1f5f9;
        }

        .toggle-btn:hover {
          color: var(--accent-color);
        }

        .edit-btn:hover {
          color: #60a5fa;
        }

        .delete-btn:hover {
          color: #f87171;
          background-color: rgba(239, 68, 68, 0.1);
        }

        .inactive-icon {
          color: #f87171;
          opacity: 0.7;
        }

        .empty-state {
          text-align: center;
          padding: 40px 20px;
          border: 2px dashed var(--glass-border);
          border-radius: var(--border-radius-lg);
          color: var(--text-secondary);
          font-size: 0.95rem;
        }

        @media (max-width: 480px) {
          .dnd-item {
            padding: 10px 12px;
          }
          .dnd-actions {
            gap: 4px;
          }
          .dnd-url {
            display: none; /* Hide URL on small screens for better space management */
          }
        }
      `}</style>
    </div>
  );
}
