import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';
import { sfx, resumeAudio } from '@/lib/audio';

interface CurtainRevealProps {
  hiddenText: string;
  imageUrl: string;
  bgClass: string;
  onReveal: () => void;
}

export function CurtainReveal({
  hiddenText,
  imageUrl,
  bgClass,
  onReveal,
}: CurtainRevealProps) {
  const [isCurtainOpen, setIsCurtainOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const dragStartX = useRef<number | null>(null);

  function openCurtains() {
    if (isCurtainOpen) return;
    resumeAudio();
    sfx.whoosh();
    setIsCurtainOpen(true);
    sfx.reveal();
    onReveal();
  }

  function handleTouchStart(e: React.PointerEvent) {
    dragStartX.current = e.clientX;
  }

  function handleTouchEnd(e: React.PointerEvent) {
    if (dragStartX.current === null) return;
    const delta = Math.abs(e.clientX - dragStartX.current);
    // If swiped more than 40px in either direction, open curtains
    if (delta > 40) {
      openCurtains();
    }
    dragStartX.current = null;
  }

  return (
    <div
      ref={containerRef}
      onPointerDown={handleTouchStart}
      onPointerUp={handleTouchEnd}
      className={`relative w-full aspect-square rounded-2xl border-[3px] border-[#1a1a1a] overflow-hidden ${bgClass} shadow-[4px_4px_0_#1a1a1a] select-none`}
      style={{ touchAction: 'none' }}
    >
      {/* Hidden content underneath */}
      <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center gap-4">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt="Reveal"
            className="max-w-full max-h-[55%] rounded-xl border-[3px] border-[#1a1a1a] object-cover"
          />
        ) : (
          <div className="text-6xl">🎉</div>
        )}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: isCurtainOpen ? 1 : 0 }}
          transition={{ duration: 0.4 }}
          className="font-hand text-2xl text-[#1a1a1a] leading-snug"
        >
          {hiddenText}
        </motion.p>
      </div>

      {/* Checkmark badge when opened */}
      {isCurtainOpen && (
        <motion.div
          initial={{ scale: 0, rotate: -30 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 200, damping: 12 }}
          className="absolute top-3 right-3 z-30"
        >
          <div className="w-10 h-10 rounded-full bg-[#4ecdc4] border-[3px] border-[#1a1a1a] shadow-[2px_2px_0_#1a1a1a] flex items-center justify-center">
            <CheckCircle2 className="w-6 h-6 text-white" />
          </div>
        </motion.div>
      )}

      {/* Left curtain — slides out to the left */}
      <div
        className={`absolute left-0 top-0 bottom-0 w-1/2 bg-gradient-to-r from-[#c44569] to-[#a3345f] border-r-[3px] border-[#1a1a1a] z-20 transition-transform duration-700 ease-out ${
          isCurtainOpen ? '-translate-x-full' : 'translate-x-0'
        }`}
      >
        {/* Curtain handle */}
        <div className="h-full w-full flex items-center justify-end pr-2">
          <div className="w-6 h-6 rounded-full bg-[#ffd23f] border-[2px] border-[#1a1a1a] flex items-center justify-center">
            <span className="text-xs">👈</span>
          </div>
        </div>
        {/* Vertical stripe folds */}
        <div
          className="absolute inset-0 opacity-20 pointer-events-none"
          style={{
            backgroundImage:
              'repeating-linear-gradient(90deg, transparent, transparent 12px, rgba(0,0,0,0.3) 12px, rgba(0,0,0,0.3) 14px)',
          }}
        />
      </div>

      {/* Right curtain — slides out to the right */}
      <div
        className={`absolute right-0 top-0 bottom-0 w-1/2 bg-gradient-to-l from-[#c44569] to-[#a3345f] border-l-[3px] border-[#1a1a1a] z-20 transition-transform duration-700 ease-out ${
          isCurtainOpen ? 'translate-x-full' : 'translate-x-0'
        }`}
      >
        {/* Curtain handle */}
        <div className="h-full w-full flex items-center justify-start pl-2">
          <div className="w-6 h-6 rounded-full bg-[#ffd23f] border-[2px] border-[#1a1a1a] flex items-center justify-center">
            <span className="text-xs">👉</span>
          </div>
        </div>
        {/* Vertical stripe folds */}
        <div
          className="absolute inset-0 opacity-20 pointer-events-none"
          style={{
            backgroundImage:
              'repeating-linear-gradient(90deg, transparent, transparent 12px, rgba(0,0,0,0.3) 12px, rgba(0,0,0,0.3) 14px)',
          }}
        />
      </div>

      {/* Pull curtain button — tap fallback */}
      {!isCurtainOpen && (
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-30">
          <button
            onClick={(e) => {
              e.stopPropagation();
              openCurtains();
            }}
            className="px-4 py-2 rounded-full bg-white border-[2px] border-[#1a1a1a] shadow-[2px_2px_0_#1a1a1a] font-display font-bold text-xs text-[#1a1a1a] hover:bg-[#ffd23f] transition-colors"
          >
            🎭 Pull curtains
          </button>
        </div>
      )}
    </div>
  );
}
