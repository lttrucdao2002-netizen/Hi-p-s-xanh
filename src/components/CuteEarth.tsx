import React from 'react';
import { motion } from 'motion/react';

interface CuteEarthProps {
  mood?: 'happy' | 'dirty' | 'victory';
  speakingText?: string;
}

export const CuteEarth: React.FC<CuteEarthProps> = ({
  mood = 'happy',
  speakingText,
}) => {
  return (
    <div className="relative flex flex-col items-center justify-center select-none z-10">
      {/* Speech Bubble */}
      {speakingText && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative mb-2 bg-emerald-100 border-4 border-emerald-500 rounded-2xl p-3 shadow-lg max-w-xs text-center"
        >
          <p className="text-emerald-900 font-extrabold text-lg">{speakingText}</p>
          <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-t-[10px] border-t-emerald-500" />
        </motion.div>
      )}

      <motion.div
        animate={
          mood === 'victory'
            ? { scale: [1, 1.15, 1], rotate: [0, 5, -5, 0] }
            : { y: [0, -8, 0], rotate: [0, 2, -2, 0] }
        }
        transition={{
          duration: mood === 'victory' ? 1.2 : 4,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="relative w-32 h-32 md:w-44 md:h-44 flex items-center justify-center filter drop-shadow-xl"
      >
        {/* Rainbow Ring on Victory */}
        {mood === 'victory' && (
          <div className="absolute inset-0 -m-4 rounded-full bg-gradient-to-r from-red-400 via-yellow-300 via-green-400 to-blue-500 opacity-60 blur-md animate-pulse" />
        )}

        <svg viewBox="0 0 200 200" className="w-full h-full relative z-10">
          <defs>
            <radialGradient id="oceanGrad" cx="30%" cy="30%" r="70%">
              <stop offset="0%" stopColor="#38bdf8" />
              <stop offset="100%" stopColor="#0284c7" />
            </radialGradient>

            <linearGradient id="landGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#4ade80" />
              <stop offset="100%" stopColor="#16a34a" />
            </linearGradient>
          </defs>

          {/* Ocean Sphere */}
          <circle cx="100" cy="100" r="85" fill="url(#oceanGrad)" stroke="#0369a1" strokeWidth="4" />

          {/* Continents */}
          <g fill="url(#landGrad)">
            {/* Asia/Europe */}
            <path d="M 60 40 C 90 30, 130 20, 150 50 C 160 80, 120 90, 100 80 C 80 80, 50 60, 60 40 Z" />
            {/* Americas */}
            <path d="M 30 90 C 50 80, 70 110, 60 140 C 40 160, 20 130, 30 90 Z" />
            {/* Australia */}
            <path d="M 130 120 C 160 110, 170 140, 140 150 C 120 150, 120 130, 130 120 Z" />
          </g>

          {/* Crown of Leaves & Flowers on Victory */}
          {mood === 'victory' && (
            <g>
              <path d="M 30 35 Q 100 -5 170 35" fill="none" stroke="#22c55e" strokeWidth="8" strokeLinecap="round" />
              <circle cx="60" cy="20" r="8" fill="#f43f5e" />
              <circle cx="100" cy="12" r="10" fill="#facc15" />
              <circle cx="140" cy="20" r="8" fill="#a855f7" />
            </g>
          )}

          {/* Cute Face */}
          <g>
            {/* Left Eye */}
            <circle cx="75" cy="95" r="9" fill="#0f172a" />
            <circle cx="72" cy="92" r="3.5" fill="#ffffff" />

            {/* Right Eye */}
            <circle cx="125" cy="95" r="9" fill="#0f172a" />
            <circle cx="122" cy="92" r="3.5" fill="#ffffff" />

            {/* Rosy Cheeks */}
            <ellipse cx="62" cy="105" rx="8" ry="5" fill="#fb7185" opacity="0.6" />
            <ellipse cx="138" cy="105" rx="8" ry="5" fill="#fb7185" opacity="0.6" />

            {/* Mouth */}
            {mood === 'dirty' ? (
              <path d="M 88 118 Q 100 110 112 118" fill="none" stroke="#0f172a" strokeWidth="4" strokeLinecap="round" />
            ) : (
              <path d="M 85 108 Q 100 125 115 108 Z" fill="#e11d48" />
            )}
          </g>
        </svg>

        {/* Floating Clouds around Earth */}
        <motion.div
          animate={{ x: [-10, 10, -10] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -top-2 left-2 text-2xl opacity-90"
        >
          ☁️
        </motion.div>
        <motion.div
          animate={{ x: [10, -10, 10] }}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -bottom-1 right-2 text-2xl opacity-90"
        >
          ☁️
        </motion.div>
      </motion.div>
    </div>
  );
};
