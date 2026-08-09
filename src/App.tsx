import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { GameStage, TrashItemData, TrashCategory } from './types';
import { ALL_TRASH_ITEMS } from './data/trashData';
import { soundEngine } from './utils/audio';
import { GreenKnight } from './components/GreenKnight';
import { CuteEarth } from './components/CuteEarth';
import { TrashBin } from './components/TrashBin';
import { TrashItem } from './components/TrashItem';
import { HeaderBar } from './components/HeaderBar';
import { FireworksCanvas } from './components/FireworksCanvas';

export default function App() {
  const [stage, setStage] = useState<GameStage>('INTRO');
  const [stars, setStars] = useState<number>(0);
  const [maxStars, setMaxStars] = useState<number>(6);

  // Active round item management
  const [currentItems, setCurrentItems] = useState<TrashItemData[]>([]);
  const [activeItemIndex, setActiveItemIndex] = useState<number>(0);

  // Bins counts & drop targets
  const [blueBinCount, setBlueBinCount] = useState<number>(0);
  const [greenBinCount, setGreenBinCount] = useState<number>(0);

  // Drag and hover state
  const [hoveredBin, setHoveredBin] = useState<TrashCategory | null>(null);
  const [bouncingBin, setBouncingBin] = useState<TrashCategory | null>(null);

  // Feedback, character emotions and dialogue
  const [knightMood, setKnightMood] = useState<'idle' | 'celebrate' | 'retry' | 'victory'>('idle');
  const [knightText, setKnightText] = useState<string>('');
  const [earthText, setEarthText] = useState<string>('');
  const [feedbackBanner, setFeedbackBanner] = useState<{ type: 'success' | 'fail'; text: string } | null>(null);

  // Fireworks activation
  const [showFireworks, setShowFireworks] = useState<boolean>(false);
  const [fireworksIntensity, setFireworksIntensity] = useState<'medium' | 'high'>('medium');

  // Countdown state for final mission
  const [countdown, setCountdown] = useState<number | null>(null);

  // Bin DOM element references for collision checking
  const blueBinRef = useRef<HTMLDivElement>(null);
  const greenBinRef = useRef<HTMLDivElement>(null);

  // Speech Helper with voice triggering
  const speakText = useCallback((text: string) => {
    soundEngine.speakVietnamese(text);
  }, []);

  // Set Knight dialogue and optionally speak it out loud
  const updateKnightDialogue = useCallback((text: string, speak = true) => {
    setKnightText(text);
    if (speak) {
      speakText(text);
    }
  }, [speakText]);

  // Handle stage transition & round initialization
  const startStage = useCallback((newStage: GameStage) => {
    soundEngine.startBGM(); // Ensure BGM is running
    setStage(newStage);
    setHoveredBin(null);
    setFeedbackBanner(null);
    setKnightMood('idle');

    switch (newStage) {
      case 'INTRO': {
        setStars(0);
        setMaxStars(6);
        updateKnightDialogue('Xin chào các bạn nhỏ! Mình là Hiệp sĩ xanh!');
        break;
      }
      case 'TUTORIAL': {
        updateKnightDialogue('Khi một món rác xuất hiện, các bạn hãy quan sát thật kỹ và kéo vào đúng thùng nhé!');
        setCurrentItems([ALL_TRASH_ITEMS.vo_bim_bim]);
        setActiveItemIndex(0);
        break;
      }
      case 'ROUND_1': {
        setMaxStars(3);
        const round1Items = [
          ALL_TRASH_ITEMS.vo_bim_bim,
          ALL_TRASH_ITEMS.chai_nuoc,
          ALL_TRASH_ITEMS.hop_giay,
        ];
        setCurrentItems(round1Items);
        setActiveItemIndex(0);
        updateKnightDialogue('Món rác đầu tiên xuất hiện rồi! Bạn nào sẽ giúp mình đưa món rác về đúng nhà?');
        break;
      }
      case 'ROUND_2': {
        setMaxStars(7);
        const round2Items = [
          ALL_TRASH_ITEMS.chai_nuoc,
          ALL_TRASH_ITEMS.hop_qua,
          ALL_TRASH_ITEMS.vo_cam,
          ALL_TRASH_ITEMS.vo_keo,
        ];
        setCurrentItems(round2Items);
        setActiveItemIndex(0);
        updateKnightDialogue('Nhiệm vụ thứ hai khó hơn một chút! Bạn hãy nhìn thật kỹ và tìm đúng chiếc thùng nhé!');
        break;
      }
      case 'ROUND_3': {
        setMaxStars(10);
        const round3Items = [
          ALL_TRASH_ITEMS.hop_giay,
          ALL_TRASH_ITEMS.hop_ca_phe,
          ALL_TRASH_ITEMS.vo_chuoi,
        ];
        setCurrentItems(round3Items);
        setActiveItemIndex(0);
        updateKnightDialogue('Ồ! Một chiếc hộp giấy đang chờ được đưa về nhà! Ai sẽ giúp mình đây?');
        break;
      }
      case 'ROUND_4': {
        setMaxStars(16);
        const round4Items = [
          ALL_TRASH_ITEMS.vo_bim_bim,
          ALL_TRASH_ITEMS.vo_cam,
          ALL_TRASH_ITEMS.chai_nuoc,
          ALL_TRASH_ITEMS.chai_sua,
          ALL_TRASH_ITEMS.hop_giay,
          ALL_TRASH_ITEMS.vo_keo,
        ];
        setCurrentItems(round4Items);
        setActiveItemIndex(0); // In round 4, multiple items visible!
        updateKnightDialogue('Wow! Lần này có thật nhiều món rác đang cần giúp đỡ! Các bạn hãy bình tĩnh đưa từng món về đúng nhà nhé!');
        break;
      }
      case 'FINAL_MISSION': {
        setMaxStars(22);
        const finalItems = [
          ALL_TRASH_ITEMS.chai_nuoc,
          ALL_TRASH_ITEMS.vo_bim_bim,
          ALL_TRASH_ITEMS.hop_qua,
          ALL_TRASH_ITEMS.vo_chuoi,
          ALL_TRASH_ITEMS.chai_sua,
          ALL_TRASH_ITEMS.la_cay,
        ];
        setCurrentItems(finalItems);
        setActiveItemIndex(0);
        updateKnightDialogue('Các bạn ơi! Đây là nhiệm vụ cuối cùng! Hãy sẵn sàng giải cứu Trái Đất nào!');
        break;
      }
      case 'VICTORY': {
        setKnightMood('victory');
        updateKnightDialogue('Hoan hô! Các bạn đã hoàn thành xuất sắc nhiệm vụ! Rác đúng chỗ – Trái Đất thêm xanh!');
        setEarthText('Cảm ơn các bạn nhỏ! Các bạn đã giúp mình trở nên xanh và sạch hơn!');
        speakText('Hoan hô! Các bạn đã hoàn thành nhiệm vụ!');
        soundEngine.playVictoryFanfare();
        setFireworksIntensity('high');
        setShowFireworks(true);
        break;
      }
    }
  }, [updateKnightDialogue, speakText]);

  // Start countdown before final mission play
  const triggerFinalCountdown = () => {
    updateKnightDialogue('Chuẩn bị... 3... 2... 1... Bắt đầu!');
    setCountdown(3);
    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev === null || prev <= 1) {
          clearInterval(interval);
          setCountdown(null);
          return null;
        }
        return prev - 1;
      });
    }, 1000);
  };

  // Drag move hover detection
  const handleDragMove = (x: number, y: number) => {
    const blueRect = blueBinRef.current?.getBoundingClientRect();
    const greenRect = greenBinRef.current?.getBoundingClientRect();

    if (
      blueRect &&
      x >= blueRect.left &&
      x <= blueRect.right &&
      y >= blueRect.top &&
      y <= blueRect.bottom
    ) {
      setHoveredBin('RECYCLABLE');
    } else if (
      greenRect &&
      x >= greenRect.left &&
      x <= greenRect.right &&
      y >= greenRect.top &&
      y <= greenRect.bottom
    ) {
      setHoveredBin('NON_RECYCLABLE');
    } else {
      setHoveredBin(null);
    }
  };

  // Drop validation logic
  const handleDrop = (item: TrashItemData, dropX: number, dropY: number) => {
    setHoveredBin(null);

    const blueRect = blueBinRef.current?.getBoundingClientRect();
    const greenRect = greenBinRef.current?.getBoundingClientRect();

    let targetCategory: TrashCategory | null = null;

    if (
      blueRect &&
      dropX >= blueRect.left &&
      dropX <= blueRect.right &&
      dropY >= blueRect.top &&
      dropY <= blueRect.bottom
    ) {
      targetCategory = 'RECYCLABLE';
    } else if (
      greenRect &&
      dropX >= greenRect.left &&
      dropX <= greenRect.right &&
      dropY >= greenRect.top &&
      dropY <= greenRect.bottom
    ) {
      targetCategory = 'NON_RECYCLABLE';
    }

    if (!targetCategory) {
      // Dropped outside bins
      return;
    }

    // Check if category matches
    const isCorrect = targetCategory === item.category;

    if (isCorrect) {
      // SUCCESS!
      soundEngine.playTingTing();
      setStars((prev) => prev + 1);

      if (targetCategory === 'RECYCLABLE') {
        setBlueBinCount((prev) => prev + 1);
      } else {
        setGreenBinCount((prev) => prev + 1);
      }

      setBouncingBin(targetCategory);
      setTimeout(() => setBouncingBin(null), 600);

      // Trigger fireworks & cheerful knight jump
      setFireworksIntensity('medium');
      setShowFireworks(true);
      setTimeout(() => setShowFireworks(false), 2000);

      setKnightMood('celebrate');

      const successPhrases = [
        'Ting ting! Bạn thật xuất sắc!',
        'Quá giỏi! Đôi mắt của bạn thật tinh anh!',
        'Tuyệt vời! Bạn là một Hiệp sĩ xanh tài giỏi!',
        'Chính xác! Bạn làm rất tốt!',
      ];
      const phrase = successPhrases[Math.floor(Math.random() * successPhrases.length)];

      setFeedbackBanner({ type: 'success', text: phrase });
      updateKnightDialogue(phrase);

      // Handle item progression
      setTimeout(() => {
        setFeedbackBanner(null);
        setKnightMood('idle');

        if (stage === 'TUTORIAL') {
          startStage('ROUND_1');
        } else if (stage === 'ROUND_1' || stage === 'ROUND_2' || stage === 'ROUND_3') {
          if (activeItemIndex + 1 < currentItems.length) {
            setActiveItemIndex((prev) => prev + 1);
          } else {
            // Next round
            if (stage === 'ROUND_1') startStage('ROUND_2');
            else if (stage === 'ROUND_2') startStage('ROUND_3');
            else if (stage === 'ROUND_3') startStage('ROUND_4');
          }
        } else if (stage === 'ROUND_4' || stage === 'FINAL_MISSION') {
          // Multi-item rounds: remove sorted item from list
          const remaining = currentItems.filter((i) => i.id !== item.id);
          setCurrentItems(remaining);

          if (remaining.length === 0) {
            if (stage === 'ROUND_4') {
              startStage('FINAL_MISSION');
            } else {
              startStage('VICTORY');
            }
          }
        }
      }, 1500);
    } else {
      // WRONG! Gentle, encouraging retry
      soundEngine.playWrongBoing();
      setKnightMood('retry');

      const retryPhrases = [
        'Ồ ồ! Chưa đúng rồi! Bạn chọn lại nhé!',
        'Không sao! Hãy quan sát lại và thử một lần nữa nhé!',
        'Hãy suy nghĩ thêm một chút. Bạn làm được!',
      ];
      const phrase = retryPhrases[Math.floor(Math.random() * retryPhrases.length)];

      setFeedbackBanner({ type: 'fail', text: phrase });
      updateKnightDialogue(phrase);

      setTimeout(() => {
        setFeedbackBanner(null);
        setKnightMood('idle');
      }, 2000);
    }
  };

  // Stage title label helper
  const getStageTitle = () => {
    switch (stage) {
      case 'INTRO':
        return 'TRANG CHỦ';
      case 'TUTORIAL':
        return 'HƯỚNG DẪN CÁCH CHƠI';
      case 'ROUND_1':
        return 'VÒNG 1: KHỞI ĐỘNG';
      case 'ROUND_2':
        return 'VÒNG 2: ĐÔI MẮT TINH ANH';
      case 'ROUND_3':
        return 'VÒNG 3: THỬ THÁCH HỘP GIẤY';
      case 'ROUND_4':
        return 'VÒNG 4: THỬ THÁCH NHANH MẮT';
      case 'FINAL_MISSION':
        return 'NHIỆM VỤ CUỐI: GIẢI CỨU TRÁI ĐẤT';
      case 'VICTORY':
        return 'HOÀN THÀNH NHIỆM VỤ!';
      default:
        return 'HIỆP SĨ XANH';
    }
  };

  return (
    <div
      onClick={() => soundEngine.startBGM()}
      className="relative min-h-screen w-full bg-gradient-to-b from-sky-300 via-emerald-100 to-green-300 flex flex-col justify-between overflow-x-hidden font-sans select-none"
    >
      {/* Fireworks Canvas Effect */}
      <FireworksCanvas active={showFireworks} intensity={fireworksIntensity} />

      {/* Top Navigation & Status Header */}
      <HeaderBar
        stars={stars}
        maxStars={maxStars}
        stageTitle={getStageTitle()}
        onRestart={() => startStage('INTRO')}
      />

      {/* Background Animated Clouds, Sun & Park Flowers */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        {/* Sun */}
        <div className="absolute top-12 left-10 w-24 h-24 bg-yellow-300 rounded-full blur-sm opacity-80 animate-pulse" />
        {/* Floating Clouds */}
        <motion.div
          animate={{ x: [-100, window.innerWidth + 100] }}
          transition={{ duration: 35, repeat: Infinity, ease: 'linear' }}
          className="absolute top-16 text-6xl opacity-80"
        >
          ☁️
        </motion.div>
        <motion.div
          animate={{ x: [window.innerWidth + 100, -100] }}
          transition={{ duration: 42, repeat: Infinity, ease: 'linear' }}
          className="absolute top-28 text-5xl opacity-70"
        >
          ☁️
        </motion.div>

        {/* Park Trees & Flowers at Bottom Background */}
        <div className="absolute bottom-0 inset-x-0 h-40 bg-gradient-to-t from-green-600 via-green-500 to-transparent opacity-40" />
        <div className="absolute bottom-4 left-6 text-4xl">🌳</div>
        <div className="absolute bottom-6 left-24 text-3xl">🌸</div>
        <div className="absolute bottom-4 right-10 text-4xl">🌳</div>
        <div className="absolute bottom-6 right-28 text-3xl">🌸</div>
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-3xl">🦋</div>
      </div>

      {/* MAIN GAME CONTAINER */}
      <main className="relative z-10 flex-1 flex flex-col justify-between max-w-6xl mx-auto w-full p-3 md:p-6">
        {/* --- STAGE 1: INTRO SCREEN --- */}
        {stage === 'INTRO' && (
          <div className="flex-1 flex flex-col items-center justify-center my-auto space-y-6 text-center">
            {/* Title Banner */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white/95 backdrop-blur-md border-8 border-emerald-500 rounded-3xl p-4 md:p-6 shadow-2xl max-w-2xl"
            >
              <h1 className="text-3xl md:text-5xl font-black text-emerald-900 tracking-wide uppercase drop-shadow-sm flex items-center justify-center gap-2">
                <span>🦸</span> HIỆP SĨ XANH
              </h1>
              <h2 className="text-2xl md:text-4xl font-extrabold text-blue-600 mt-1">
                GIẢI CỨU TRÁI ĐẤT 🌍
              </h2>
            </motion.div>

            {/* Earth & Green Knight Center Scene */}
            <div className="flex items-center justify-center gap-6 md:gap-12 my-2">
              <CuteEarth mood="happy" />
              <GreenKnight mood={knightMood} speakingText={knightText} />
            </div>

            {/* Scrollable / Swipeable Bin Classification Instructions */}
            <div className="w-full max-w-2xl bg-white/90 backdrop-blur rounded-3xl p-4 md:p-6 shadow-xl border-4 border-emerald-300 max-h-56 overflow-y-auto">
              <h3 className="font-black text-lg md:text-2xl text-emerald-900 mb-3 flex items-center justify-center gap-2">
                <span>📖</span> HƯỚNG DẪN PHÂN LOẠI RÁC
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                {/* Blue Bin Info */}
                <div className="bg-blue-50 border-2 border-blue-300 rounded-2xl p-3">
                  <h4 className="font-extrabold text-blue-900 text-base md:text-lg flex items-center gap-2">
                    <span>🟦</span> THÙNG XANH DƯƠNG
                  </h4>
                  <p className="text-xs md:text-sm font-bold text-blue-700 mt-1">
                    Chứa Rác Tái Chế:
                  </p>
                  <p className="text-xs md:text-sm text-gray-700 font-medium">
                    • Chai nhựa, hộp sữa, hộp giấy, ly nhựa, carton.
                  </p>
                </div>

                {/* Green Bin Info */}
                <div className="bg-green-50 border-2 border-green-300 rounded-2xl p-3">
                  <h4 className="font-extrabold text-green-900 text-base md:text-lg flex items-center gap-2">
                    <span>🟩</span> THÙNG XANH LÁ
                  </h4>
                  <p className="text-xs md:text-sm font-bold text-green-700 mt-1">
                    Chứa Rác Không Tái Chế & Hữu Cơ:
                  </p>
                  <p className="text-xs md:text-sm text-gray-700 font-medium">
                    • Vỏ bim bim, vỏ bánh kẹo, thức ăn thừa, vỏ cam, vỏ chuối, lá cây.
                  </p>
                </div>
              </div>
            </div>

            {/* Big Start Button */}
            <motion.button
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => startStage('TUTORIAL')}
              className="bg-gradient-to-r from-emerald-500 via-green-500 to-teal-600 text-white font-black text-2xl md:text-4xl px-10 py-5 rounded-3xl border-4 border-white shadow-2xl flex items-center gap-3 cursor-pointer ring-8 ring-green-300/50"
            >
              <span>▶</span> BẮT ĐẦU
            </motion.button>
          </div>
        )}

        {/* --- STAGE 2: TUTORIAL SCREEN --- */}
        {stage === 'TUTORIAL' && (
          <div className="flex-1 flex flex-col items-center justify-between my-auto space-y-4">
            {/* Top Dialogue & Visual Steps */}
            <div className="w-full flex flex-col items-center text-center">
              <GreenKnight mood={knightMood} speakingText={knightText} />

              {/* Touch Drag Drop Visual Steps */}
              <div className="flex items-center justify-center gap-3 md:gap-6 my-3 bg-white/90 backdrop-blur px-6 py-3 rounded-2xl border-2 border-emerald-400 shadow-md">
                <div className="flex items-center gap-1 font-extrabold text-base md:text-2xl text-emerald-800">
                  <span>👆</span> CHẠM
                </div>
                <span className="text-xl font-black text-emerald-500">➔</span>
                <div className="flex items-center gap-1 font-extrabold text-base md:text-2xl text-blue-800">
                  <span>↔️</span> KÉO
                </div>
                <span className="text-xl font-black text-emerald-500">➔</span>
                <div className="flex items-center gap-1 font-extrabold text-base md:text-2xl text-purple-800">
                  <span>🗑️</span> THẢ
                </div>
              </div>
            </div>

            {/* Sample Item positioned BELOW the Knight dialogue as requested */}
            <div className="my-2 flex flex-col items-center">
              <p className="text-sm md:text-base font-extrabold text-emerald-900 mb-2 bg-yellow-200 px-4 py-1 rounded-full border border-yellow-400">
                👇 Thử kéo món rác mẫu bên dưới:
              </p>
              <TrashItem
                item={ALL_TRASH_ITEMS.vo_bim_bim}
                onDrop={handleDrop}
                onDragMove={handleDragMove}
              />
            </div>

            {/* Big "Chơi Ngay" button */}
            <motion.button
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => startStage('ROUND_1')}
              className="bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 text-amber-950 font-black text-2xl md:text-3xl px-10 py-4 rounded-3xl border-4 border-white shadow-2xl flex items-center gap-3 cursor-pointer ring-8 ring-amber-300/50"
            >
              <span>▶</span> CHƠI NGAY
            </motion.button>

            {/* Bottom Bins */}
            <div className="w-full flex items-center justify-around gap-4 pt-2">
              <TrashBin
                ref={blueBinRef}
                category="RECYCLABLE"
                isHovered={hoveredBin === 'RECYCLABLE'}
                isBouncing={bouncingBin === 'RECYCLABLE'}
                itemCount={blueBinCount}
              />
              <TrashBin
                ref={greenBinRef}
                category="NON_RECYCLABLE"
                isHovered={hoveredBin === 'NON_RECYCLABLE'}
                isBouncing={bouncingBin === 'NON_RECYCLABLE'}
                itemCount={greenBinCount}
              />
            </div>
          </div>
        )}

        {/* --- STAGES 3, 4, 5: SINGLE-ITEM SEQUENTIAL ROUNDS (ROUNDS 1, 2, 3) --- */}
        {(stage === 'ROUND_1' || stage === 'ROUND_2' || stage === 'ROUND_3') && (
          <div className="flex-1 flex flex-col items-center justify-between my-auto space-y-3">
            {/* Top Dialogue Header */}
            <div className="w-full flex flex-col items-center text-center">
              <GreenKnight mood={knightMood} speakingText={knightText} />
            </div>

            {/* Active Item Container (Rendered BELOW dialogue text) */}
            <div className="my-2 flex flex-col items-center justify-center min-h-[200px]">
              {feedbackBanner && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className={`mb-2 font-black text-lg md:text-2xl px-6 py-2 rounded-2xl border-4 shadow-lg ${
                    feedbackBanner.type === 'success'
                      ? 'bg-green-100 text-green-900 border-green-500'
                      : 'bg-rose-100 text-rose-900 border-rose-500'
                  }`}
                >
                  {feedbackBanner.text}
                </motion.div>
              )}

              {currentItems[activeItemIndex] && (
                <div className="flex flex-col items-center">
                  <p className="text-xs md:text-sm font-bold text-gray-700 mb-1 bg-white/80 px-3 py-0.5 rounded-full">
                    Món rác {activeItemIndex + 1} / {currentItems.length}
                  </p>
                  <TrashItem
                    key={currentItems[activeItemIndex].id}
                    item={currentItems[activeItemIndex]}
                    onDrop={handleDrop}
                    onDragMove={handleDragMove}
                  />
                </div>
              )}
            </div>

            {/* Bottom Bins Area */}
            <div className="w-full flex items-center justify-around gap-4 pt-2">
              <TrashBin
                ref={blueBinRef}
                category="RECYCLABLE"
                isHovered={hoveredBin === 'RECYCLABLE'}
                isBouncing={bouncingBin === 'RECYCLABLE'}
                itemCount={blueBinCount}
              />
              <TrashBin
                ref={greenBinRef}
                category="NON_RECYCLABLE"
                isHovered={hoveredBin === 'NON_RECYCLABLE'}
                isBouncing={bouncingBin === 'NON_RECYCLABLE'}
                itemCount={greenBinCount}
              />
            </div>
          </div>
        )}

        {/* --- STAGES 6 & 7: MULTI-ITEM ROUNDS (ROUND 4 & FINAL MISSION) --- */}
        {(stage === 'ROUND_4' || stage === 'FINAL_MISSION') && (
          <div className="flex-1 flex flex-col items-center justify-between my-auto space-y-2">
            {/* Top Dialogue & Earth Helper */}
            <div className="w-full flex items-center justify-center gap-4 text-center">
              {stage === 'FINAL_MISSION' && <CuteEarth mood="happy" />}
              <GreenKnight mood={knightMood} speakingText={knightText} />
            </div>

            {/* Countdown or Ready Button for Final Mission */}
            {stage === 'FINAL_MISSION' && countdown !== null ? (
              <div className="text-6xl md:text-8xl font-black text-amber-500 animate-ping my-4">
                {countdown}
              </div>
            ) : stage === 'FINAL_MISSION' && currentItems.length === 6 && stars < 16 ? (
              <motion.button
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.95 }}
                onClick={triggerFinalCountdown}
                className="bg-gradient-to-r from-emerald-500 to-green-600 text-white font-black text-2xl md:text-4xl px-8 py-4 rounded-3xl border-4 border-white shadow-2xl cursor-pointer"
              >
                💚 SẴN SÀNG!
              </motion.button>
            ) : (
              /* Active Multiple Trash Items Grid (Rendered BELOW Knight dialogue) */
              <div className="w-full my-2 bg-white/75 backdrop-blur rounded-3xl p-3 md:p-4 border-4 border-emerald-300 shadow-xl">
                <p className="text-center font-extrabold text-sm md:text-base text-emerald-900 mb-2">
                  kéo từng món rác vào thùng tương ứng ({currentItems.length} món còn lại):
                </p>

                <div className="flex flex-wrap items-center justify-center gap-3 md:gap-6 min-h-[160px]">
                  {currentItems.map((item) => (
                    <TrashItem
                      key={item.id}
                      item={item}
                      onDrop={handleDrop}
                      onDragMove={handleDragMove}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Bottom Bins Area */}
            <div className="w-full flex items-center justify-around gap-4 pt-2">
              <TrashBin
                ref={blueBinRef}
                category="RECYCLABLE"
                isHovered={hoveredBin === 'RECYCLABLE'}
                isBouncing={bouncingBin === 'RECYCLABLE'}
                itemCount={blueBinCount}
              />
              <TrashBin
                ref={greenBinRef}
                category="NON_RECYCLABLE"
                isHovered={hoveredBin === 'NON_RECYCLABLE'}
                isBouncing={bouncingBin === 'NON_RECYCLABLE'}
                itemCount={greenBinCount}
              />
            </div>
          </div>
        )}

        {/* --- STAGE 8: VICTORY SCREEN --- */}
        {stage === 'VICTORY' && (
          <div className="flex-1 flex flex-col items-center justify-center my-auto space-y-6 text-center">
            {/* Grand Victory Banner */}
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 200 }}
              className="bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-500 border-8 border-white rounded-3xl p-4 md:p-6 shadow-2xl"
            >
              <h1 className="text-3xl md:text-5xl font-black text-amber-950 uppercase tracking-wide flex items-center justify-center gap-2">
                <span>🏆</span> CHÚC MỪNG CÁC HIỆP SĨ XANH NHÍ!
              </h1>
              <div className="flex items-center justify-center gap-2 mt-2 text-2xl md:text-3xl font-black text-emerald-900">
                <span>⭐ Bạn đã đạt {stars} / 22 ngôi sao xuất sắc!</span>
              </div>
            </motion.div>

            {/* Happy Earth & Green Knight Victory Scene */}
            <div className="flex items-center justify-center gap-8 md:gap-16 my-4">
              <CuteEarth mood="victory" speakingText={earthText} />
              <GreenKnight mood="victory" speakingText={knightText} />
            </div>

            {/* Victory Slogan Box */}
            <div className="bg-white/95 backdrop-blur border-4 border-emerald-500 rounded-2xl p-4 shadow-xl max-w-xl">
              <p className="text-xl md:text-3xl font-black text-emerald-900">
                « Rác đúng chỗ – Trái Đất thêm xanh! »
              </p>
              <p className="text-lg md:text-2xl font-extrabold text-blue-700 mt-1">
                « Bé phân loại rác – Bé bảo vệ môi trường! »
              </p>
            </div>

            {/* Play Again Button */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => startStage('INTRO')}
              className="bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600 text-white font-black text-2xl md:text-4xl px-12 py-5 rounded-3xl border-4 border-white shadow-2xl flex items-center gap-3 cursor-pointer ring-8 ring-blue-300/50"
            >
              <span>🔄</span> CHƠI LẠI
            </motion.button>
          </div>
        )}
      </main>
    </div>
  );
}
