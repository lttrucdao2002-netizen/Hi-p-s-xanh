import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import { TrashItemData, TrashCategory } from '../types';
import { soundEngine } from '../utils/audio';

interface TrashItemProps {
  item: TrashItemData;
  onDrop: (item: TrashItemData, dropX: number, dropY: number) => void;
  onDragMove?: (x: number, y: number) => void;
  onDragEnd?: () => void;
  disabled?: boolean;
}

export const TrashItem: React.FC<TrashItemProps> = ({
  item,
  onDrop,
  onDragMove,
  onDragEnd,
  disabled = false,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [position, setPosition] = useState({ x: 0, y: 0 }); // Drag offset delta
  const cardRef = useRef<HTMLDivElement>(null);

  // Reset position if item changes or drag ends
  useEffect(() => {
    setPosition({ x: 0, y: 0 });
    setIsDragging(false);
  }, [item.id]);

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (disabled) return;
    e.preventDefault();
    e.stopPropagation();

    // Capture pointer
    e.currentTarget.setPointerCapture(e.pointerId);

    soundEngine.playPop();
    setIsDragging(true);

    const rect = cardRef.current?.getBoundingClientRect();
    if (rect) {
      setOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    }
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging || disabled) return;
    e.preventDefault();

    // Update drag offset delta relative to original spot
    const newX = position.x + e.movementX;
    const newY = position.y + e.movementY;
    setPosition({ x: newX, y: newY });

    if (onDragMove) {
      onDragMove(e.clientX, e.clientY);
    }
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    e.preventDefault();

    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {
      // Ignore if capture was lost
    }

    setIsDragging(false);

    if (onDragEnd) {
      onDragEnd();
    }

    // Call drop callback with pointer drop coordinates
    onDrop(item, e.clientX, e.clientY);

    // Reset position animation handles return if invalid
    setPosition({ x: 0, y: 0 });
  };

  return (
    <motion.div
      ref={cardRef}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      animate={
        isDragging
          ? { x: position.x, y: position.y, scale: 1.18, zIndex: 50 }
          : { x: 0, y: 0, scale: 1, zIndex: 10 }
      }
      transition={
        isDragging
          ? { duration: 0 }
          : { type: 'spring', stiffness: 350, damping: 25 }
      }
      className={`relative touch-none select-none cursor-grab active:cursor-grabbing w-32 h-36 md:w-44 md:h-48 rounded-3xl p-3 bg-gradient-to-b ${item.bgGradient} border-4 border-white shadow-2xl flex flex-col items-center justify-between filter drop-shadow-xl ${
        isDragging ? 'ring-8 ring-yellow-300 shadow-amber-500/50 scale-110' : 'hover:scale-105'
      }`}
      style={{
        touchAction: 'none',
      }}
    >
      {/* Top Drag Indicator Chip */}
      <div className="bg-white/95 px-3 py-0.5 rounded-full text-[10px] md:text-xs font-black text-gray-800 shadow-sm flex items-center gap-1">
        <span>👆 CHẠM KÉO</span>
      </div>

      {/* Large Trash Icon */}
      <div className="text-5xl md:text-7xl filter drop-shadow-md my-auto transform hover:rotate-6 transition-transform">
        {item.icon}
      </div>

      {/* Item Name Label */}
      <div className="w-full bg-white/95 backdrop-blur rounded-2xl py-1 px-2 text-center shadow-md border border-white">
        <p className="font-extrabold text-sm md:text-lg text-gray-900 leading-tight">
          {item.name}
        </p>
      </div>
    </motion.div>
  );
};
