import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Volume2, VolumeX, Mic, MicOff, RotateCcw, Maximize } from 'lucide-react';
import { soundEngine } from '../utils/audio';

interface HeaderBarProps {
  stars: number;
  maxStars?: number;
  stageTitle: string;
  onRestart: () => void;
}

export const HeaderBar: React.FC<HeaderBarProps> = ({
  stars,
  maxStars = 6,
  stageTitle,
  onRestart,
}) => {
  const [isMuted, setIsMuted] = useState(soundEngine.getMuted());
  const [isSpeechOn, setIsSpeechOn] = useState(soundEngine.getSpeechEnabled());
  const [volume, setVolume] = useState(soundEngine.getMusicVolume());

  const handleToggleMute = () => {
    const muted = soundEngine.toggleMute();
    setIsMuted(muted);
  };

  const handleToggleSpeech = () => {
    const speech = soundEngine.toggleSpeech();
    setIsSpeechOn(speech);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVol = parseFloat(e.target.value);
    setVolume(newVol);
    soundEngine.setMusicVolume(newVol);
  };

  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else if (document.exitFullscreen) {
      document.exitFullscreen().catch(() => {});
    }
  };

  return (
    <div className="w-full bg-white/90 backdrop-blur-md border-b-4 border-emerald-400 px-3 py-2 md:px-6 md:py-3 shadow-lg flex items-center justify-between z-30 select-none">
      {/* Star Counter */}
      <motion.div
        whileHover={{ scale: 1.05 }}
        className="flex items-center gap-2 bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-500 text-amber-950 font-black px-4 py-2 rounded-2xl shadow-md border-2 border-yellow-200"
      >
        <motion.span
          animate={{ scale: [1, 1.3, 1], rotate: [0, 15, -15, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="text-2xl md:text-3xl filter drop-shadow-sm"
        >
          ⭐
        </motion.span>
        <span className="text-xl md:text-2xl font-black tracking-wide">
          {stars} / {maxStars}
        </span>
      </motion.div>

      {/* Stage Title */}
      <div className="hidden sm:flex items-center gap-2 bg-emerald-100/90 text-emerald-900 font-extrabold px-4 py-2 rounded-2xl border-2 border-emerald-300 text-base md:text-xl shadow-inner">
        <span>🌳</span>
        <span>{stageTitle}</span>
      </div>

      {/* Control Action Buttons */}
      <div className="flex items-center gap-2 md:gap-3">
        {/* Voice Toggle */}
        <button
          onClick={handleToggleSpeech}
          title={isSpeechOn ? 'Tắt đọc tiếng' : 'Bật đọc tiếng'}
          className={`p-2 md:p-3 rounded-2xl border-2 font-bold shadow-md transition-all flex items-center justify-center text-lg ${
            isSpeechOn
              ? 'bg-purple-100 text-purple-800 border-purple-300 hover:bg-purple-200'
              : 'bg-gray-200 text-gray-500 border-gray-300'
          }`}
        >
          {isSpeechOn ? <Mic className="w-6 h-6" /> : <MicOff className="w-6 h-6" />}
        </button>

        {/* Music & Sound Toggle */}
        <button
          onClick={handleToggleMute}
          title={isMuted ? 'Bật âm thanh' : 'Tắt âm thanh'}
          className={`p-2 md:p-3 rounded-2xl border-2 font-bold shadow-md transition-all flex items-center justify-center text-lg ${
            !isMuted
              ? 'bg-emerald-100 text-emerald-800 border-emerald-300 hover:bg-emerald-200'
              : 'bg-rose-100 text-rose-700 border-rose-300'
          }`}
        >
          {!isMuted ? <Volume2 className="w-6 h-6" /> : <VolumeX className="w-6 h-6" />}
        </button>

        {/* Volume Slider (hidden on small screens, expanded on tablets) */}
        {!isMuted && (
          <div className="hidden md:flex items-center gap-1 bg-emerald-50 px-3 py-2 rounded-2xl border border-emerald-200">
            <span className="text-xs font-bold text-emerald-800">Nhạc</span>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={volume}
              onChange={handleVolumeChange}
              className="w-16 accent-emerald-600 cursor-pointer"
            />
          </div>
        )}

        {/* Fullscreen Button */}
        <button
          onClick={toggleFullScreen}
          title="Toàn màn hình"
          className="hidden sm:flex p-2 md:p-3 bg-sky-100 text-sky-800 border-2 border-sky-300 rounded-2xl font-bold shadow-md hover:bg-sky-200 transition-all"
        >
          <Maximize className="w-6 h-6" />
        </button>

        {/* Restart Button */}
        <button
          onClick={onRestart}
          title="Chơi lại từ đầu"
          className="p-2 md:p-3 bg-amber-100 text-amber-800 border-2 border-amber-300 rounded-2xl font-bold shadow-md hover:bg-amber-200 transition-all flex items-center justify-center"
        >
          <RotateCcw className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
};
