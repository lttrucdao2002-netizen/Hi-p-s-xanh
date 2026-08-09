import React from 'react';
import { motion } from 'motion/react';

interface GreenKnightProps {
  mood?: 'idle' | 'celebrate' | 'retry' | 'victory';
  speakingText?: string;
}

export const GreenKnight: React.FC<GreenKnightProps> = ({
  mood = 'idle',
  speakingText,
}) => {
  return (
    <div className="relative flex flex-col items-center justify-center select-none z-20">
      {/* Speech Bubble */}
      {speakingText && (
        <motion.div
          initial={{ opacity: 0, y: 10, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          className="relative mb-2 max-w-xs md:max-w-md bg-white/95 backdrop-blur border-4 border-emerald-500 rounded-2xl p-3 md:p-4 shadow-xl text-center"
        >
          <p className="text-emerald-900 font-bold text-lg md:text-xl leading-snug">
            {speakingText}
          </p>
          {/* Arrow pointing to Knight */}
          <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[12px] border-l-transparent border-r-[12px] border-r-transparent border-t-[12px] border-t-emerald-500" />
        </motion.div>
      )}

      {/* Hero Character Frame */}
      <motion.div
        animate={
          mood === 'celebrate'
            ? { y: [0, -25, 0, -20, 0], rotate: [0, -6, 6, -3, 0] }
            : mood === 'victory'
            ? { y: [0, -30, 0], scale: [1, 1.12, 1], rotate: [0, 8, -8, 0] }
            : mood === 'retry'
            ? { rotate: [0, -4, 4, -2, 0] }
            : { y: [0, -6, 0] }
        }
        transition={{
          duration: mood === 'victory' || mood === 'celebrate' ? 0.7 : 2.5,
          repeat: mood === 'idle' ? Infinity : 0,
          ease: 'easeInOut',
        }}
        className="relative w-36 h-44 md:w-48 md:h-56 flex items-center justify-center filter drop-shadow-2xl cursor-pointer"
      >
        <svg viewBox="0 0 200 240" className="w-full h-full">
          <defs>
            <linearGradient id="armorGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#4ade80" />
              <stop offset="50%" stopColor="#16a34a" />
              <stop offset="100%" stopColor="#15803d" />
            </linearGradient>

            <linearGradient id="capeGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#38bdf8" />
              <stop offset="100%" stopColor="#0369a1" />
            </linearGradient>

            <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fef08a" />
              <stop offset="100%" stopColor="#eab308" />
            </linearGradient>

            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Flowing Cape */}
          <path
            d="M 60 90 Q 20 120 30 200 Q 100 220 170 200 Q 180 120 140 90 Z"
            fill="url(#capeGrad)"
            className="animate-pulse"
          />

          {/* Legs & Boots */}
          <rect x="72" y="180" width="22" height="38" rx="8" fill="#0f766e" />
          <rect x="106" y="180" width="22" height="38" rx="8" fill="#0f766e" />
          <ellipse cx="83" cy="218" rx="15" ry="10" fill="#134e4a" />
          <ellipse cx="117" cy="218" rx="15" ry="10" fill="#134e4a" />

          {/* Torso Armor */}
          <path
            d="M 65 95 C 65 80, 135 80, 135 95 L 140 170 C 140 185, 60 185, 60 170 Z"
            fill="url(#armorGrad)"
            stroke="#065f46"
            strokeWidth="4"
          />

          {/* Gold Belt & Leaf Crest */}
          <rect x="62" y="145" width="76" height="14" rx="4" fill="url(#goldGrad)" />
          <path d="M 100 138 C 90 152, 110 152, 100 138 Z" fill="#22c55e" stroke="#15803d" strokeWidth="2" />

          {/* Shield */}
          <g transform="translate(30, 105)">
            <path
              d="M 0 0 Q 30 -10 60 0 C 60 40 30 70 30 70 C 30 70 0 40 0 0 Z"
              fill="url(#goldGrad)"
              stroke="#ca8a04"
              strokeWidth="3"
            />
            {/* Leaf Emblem on Shield */}
            <path d="M 30 15 C 15 30 45 40 30 55 C 20 40 40 25 30 15 Z" fill="#16a34a" />
          </g>

          {/* Knight Chibi Head & Helmet */}
          <circle cx="100" cy="65" r="42" fill="#ffedd5" /> {/* Face */}

          {/* Helmet Dome */}
          <path
            d="M 58 60 C 58 20, 142 20, 142 60 C 142 70, 58 70, 58 60 Z"
            fill="url(#armorGrad)"
            stroke="#065f46"
            strokeWidth="3"
          />

          {/* Helmet Gold Leaf Crest */}
          <path
            d="M 100 10 Q 80 -15 100 -25 Q 120 -15 100 10 Z"
            fill="url(#goldGrad)"
            filter="url(#glow)"
          />

          {/* Eyes (Cute anime gloss) */}
          <g>
            {/* Left Eye */}
            <circle cx="83" cy="65" r="9" fill="#1e293b" />
            <circle cx="80" cy="62" r="3.5" fill="#ffffff" />
            <circle cx="85" cy="67" r="1.5" fill="#ffffff" />

            {/* Right Eye */}
            <circle cx="117" cy="65" r="9" fill="#1e293b" />
            <circle cx="114" cy="62" r="3.5" fill="#ffffff" />
            <circle cx="119" cy="67" r="1.5" fill="#ffffff" />

            {/* Blushing cheeks */}
            <ellipse cx="73" cy="73" rx="6" ry="4" fill="#f43f5e" opacity="0.4" />
            <ellipse cx="127" cy="73" rx="6" ry="4" fill="#f43f5e" opacity="0.4" />
          </g>

          {/* Expression Mouth */}
          {mood === 'celebrate' || mood === 'victory' ? (
            <path d="M 90 75 Q 100 90 110 75 Z" fill="#e11d48" />
          ) : mood === 'retry' ? (
            <path d="M 92 78 Q 100 83 108 78" fill="none" stroke="#1e293b" strokeWidth="3" strokeLinecap="round" />
          ) : (
            <path d="M 90 76 Q 100 86 110 76" fill="none" stroke="#1e293b" strokeWidth="3" strokeLinecap="round" />
          )}

          {/* Waving Arm / Sword */}
          <g transform="translate(140, 100)">
            <motion.path
              animate={
                mood === 'celebrate' || mood === 'victory'
                  ? { rotate: [0, -30, 20, -30, 0] }
                  : { rotate: [0, 15, 0] }
              }
              transition={{ repeat: Infinity, duration: 1.5 }}
              d="M 0 0 Q 25 -20 30 -5"
              stroke="#16a34a"
              strokeWidth="12"
              strokeLinecap="round"
            />
          </g>
        </svg>

        {/* Sparkling Stars around Knight during celebrate */}
        {(mood === 'celebrate' || mood === 'victory') && (
          <>
            <motion.span
              animate={{ scale: [0, 1.2, 0], opacity: [0, 1, 0] }}
              transition={{ repeat: Infinity, duration: 0.8 }}
              className="absolute -top-4 -left-2 text-2xl"
            >
              ✨
            </motion.span>
            <motion.span
              animate={{ scale: [0, 1.2, 0], opacity: [0, 1, 0] }}
              transition={{ repeat: Infinity, duration: 0.9, delay: 0.2 }}
              className="absolute -top-6 right-0 text-3xl"
            >
              ⭐
            </motion.span>
          </>
        )}
      </motion.div>
    </div>
  );
};
