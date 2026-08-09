import React, { forwardRef } from 'react';
import { motion } from 'motion/react';
import { TrashCategory } from '../types';

interface TrashBinProps {
  category: TrashCategory;
  isHovered?: boolean;
  isBouncing?: boolean;
  itemCount?: number;
}

export const TrashBin = forwardRef<HTMLDivElement, TrashBinProps>(
  ({ category, isHovered = false, isBouncing = false, itemCount = 0 }, ref) => {
    const isRecyclable = category === 'RECYCLABLE';

    // Bin Colors & Themes
    const config = isRecyclable
      ? {
          title: 'THÙNG XANH DƯƠNG',
          subtitle: 'RÁC TÁI CHẾ',
          examples: 'Chai nhựa • Hộp sữa • Giấy',
          mainColor: '#0284c7', // Sky blue
          darkColor: '#0369a1',
          lightColor: '#38bdf8',
          accentColor: '#60a5fa',
          badgeBg: 'bg-blue-600',
          borderColor: 'border-blue-400',
          shadowColor: 'shadow-blue-500/40',
          glowColor: 'ring-blue-400',
          icon: '🟦',
          recycleSymbol: '♻️',
        }
      : {
          title: 'THÙNG XANH LÁ',
          subtitle: 'RÁC KHÔNG TÁI CHẾ',
          examples: 'Vỏ kẹo • Thức ăn • Lá cây',
          mainColor: '#16a34a', // Emerald green
          darkColor: '#15803d',
          lightColor: '#4ade80',
          accentColor: '#86efac',
          badgeBg: 'bg-green-600',
          borderColor: 'border-green-400',
          shadowColor: 'shadow-green-500/40',
          glowColor: 'ring-green-400',
          icon: '🟩',
          recycleSymbol: '🍂',
        };

    return (
      <motion.div
        ref={ref}
        animate={
          isBouncing
            ? { scale: [1, 1.15, 0.95, 1.05, 1], y: [0, -15, 0] }
            : isHovered
            ? { scale: 1.06, y: -8 }
            : { scale: 1, y: 0 }
        }
        transition={{ duration: 0.3 }}
        className={`relative flex flex-col items-center justify-end w-44 md:w-60 h-56 md:h-72 p-2 md:p-3 rounded-3xl bg-gradient-to-b from-white/90 via-white/80 to-white/95 backdrop-blur-md border-4 ${
          isHovered ? `ring-8 ${config.glowColor} border-yellow-300 shadow-2xl scale-105` : `${config.borderColor} shadow-xl`
        } ${config.shadowColor} select-none transition-all duration-200`}
      >
        {/* Item Counter Badge */}
        {itemCount > 0 && (
          <div className="absolute -top-3 -right-2 bg-yellow-400 text-yellow-950 font-black text-sm md:text-lg px-3 py-1 rounded-full border-2 border-yellow-100 shadow-md flex items-center gap-1 z-30 animate-bounce">
            ⭐ {itemCount}
          </div>
        )}

        {/* Top Header Label */}
        <div className={`w-full py-1.5 px-2 rounded-2xl ${config.badgeBg} text-white text-center shadow-md mb-1`}>
          <h3 className="font-extrabold text-base md:text-xl tracking-wide flex items-center justify-center gap-1">
            <span>{config.icon}</span>
            <span>{config.title}</span>
          </h3>
          <p className="text-xs md:text-sm font-bold text-yellow-200 uppercase tracking-wider">
            {config.subtitle}
          </p>
        </div>

        {/* 3D Cartoon Trash Bin SVG */}
        <div className="relative w-32 md:w-44 h-36 md:h-48 my-1 flex items-end justify-center">
          <svg viewBox="0 0 160 200" className="w-full h-full filter drop-shadow-md">
            <defs>
              <linearGradient id={`binGrad_${category}`} x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor={config.lightColor} />
                <stop offset="60%" stopColor={config.mainColor} />
                <stop offset="100%" stopColor={config.darkColor} />
              </linearGradient>

              <filter id="binGlow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="4" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            {/* Lid (Opens when hovered or bouncing) */}
            <g
              transform={
                isHovered || isBouncing
                  ? 'translate(0, -25) rotate(-15, 80, 40)'
                  : 'translate(0, 0)'
              }
              className="transition-transform duration-200"
            >
              {/* Lid Top Handle */}
              <rect x="65" y="12" width="30" height="12" rx="6" fill="#f8fafc" stroke={config.darkColor} strokeWidth="3" />
              {/* Lid Rim */}
              <path
                d="M 20 28 L 140 28 C 145 28, 145 42, 140 42 L 20 42 C 15 42, 15 28, 20 28 Z"
                fill="#f8fafc"
                stroke={config.darkColor}
                strokeWidth="3"
              />
            </g>

            {/* Bin Main Body */}
            <path
              d="M 25 42 L 35 185 C 36 193, 124 193, 125 185 L 135 42 Z"
              fill={`url(#binGrad_${category})`}
              stroke={config.darkColor}
              strokeWidth="4"
            />

            {/* Vertical Rib Lines for 3D texture */}
            <line x1="55" y1="52" x2="60" y2="175" stroke="rgba(255,255,255,0.3)" strokeWidth="4" strokeLinecap="round" />
            <line x1="80" y1="52" x2="80" y2="178" stroke="rgba(255,255,255,0.4)" strokeWidth="4" strokeLinecap="round" />
            <line x1="105" y1="52" x2="100" y2="175" stroke="rgba(255,255,255,0.3)" strokeWidth="4" strokeLinecap="round" />

            {/* Cute Face on Bin Front */}
            <g transform="translate(0, 20)">
              {/* Eyes */}
              <circle cx="68" cy="85" r="7" fill="#0f172a" />
              <circle cx="66" cy="83" r="2.5" fill="#ffffff" />

              <circle cx="92" cy="85" r="7" fill="#0f172a" />
              <circle cx="90" cy="83" r="2.5" fill="#ffffff" />

              {/* Cute Cheek Blush */}
              <ellipse cx="58" cy="92" rx="5" ry="3" fill="#f43f5e" opacity="0.5" />
              <ellipse cx="102" cy="92" rx="5" ry="3" fill="#f43f5e" opacity="0.5" />

              {/* Smile */}
              {isHovered || isBouncing ? (
                <path d="M 72 95 Q 80 110 88 95 Z" fill="#ffffff" />
              ) : (
                <path d="M 73 95 Q 80 103 87 95" fill="none" stroke="#0f172a" strokeWidth="3" strokeLinecap="round" />
              )}
            </g>

            {/* Category Icon Badge in Center */}
            <g transform="translate(80, 148) scale(1.3)">
              <text textAnchor="middle" dominantBaseline="middle" fontSize="24">
                {config.recycleSymbol}
              </text>
            </g>
          </svg>
        </div>

        {/* Examples Footer Note */}
        <div className="w-full text-center bg-gray-100/90 rounded-xl py-1 px-1 mt-1 border border-gray-200">
          <p className="text-[11px] md:text-xs font-bold text-gray-700 leading-tight">
            {config.examples}
          </p>
        </div>
      </motion.div>
    );
  }
);

TrashBin.displayName = 'TrashBin';
