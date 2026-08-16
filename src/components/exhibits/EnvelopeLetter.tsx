import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { sfx, resumeAudio } from '@/lib/audio';

interface EnvelopeLetterProps {
  letter: string;
  signature: string;
  bgClass: string;
  onRead: () => void;
}

const TEAR_THRESHOLD = 0.7;

export function EnvelopeLetter({
  letter,
  signature,
  bgClass,
  onRead,
}: EnvelopeLetterProps) {
  const [opened, setOpened] = useState(false);
  const [tearProgress, setTearProgress] = useState(0);
  const [tearing, setTearing] = useState(false);
  const trackRef = useRef<HTMLDivElement>(null);

  function handleDragEnd() {
    if (tearProgress >= TEAR_THRESHOLD && !opened) {
      openEnvelope();
    } else {
      // Snap back
      setTearProgress(0);
    }
  }

  function openEnvelope() {
    setTearing(true);
    sfx.whoosh();
    setTearProgress(1);
    setTimeout(() => {
      setOpened(true);
      onRead();
    }, 500);
  }

  function handleTap() {
    // Touch fallback — tap to open
    if (!opened) {
      resumeAudio();
      openEnvelope();
    }
  }

  const trackWidth = trackRef.current?.offsetWidth ?? 280;

  return (
    <div className="w-full">
      {!opened ? (
        <div className={`relative rounded-2xl border-[3px] border-[#1a1a1a] ${bgClass} shadow-[4px_4px_0_#1a1a1a] overflow-hidden`}>
          {/* Envelope body */}
          <div className="p-8 text-center">
            <p className="font-hand text-xl text-[#1a1a1a] mb-4">
              A letter for you
            </p>
            <p className="font-display text-sm text-[#1a1a1a]/60">
              Drag the slider to tear open
            </p>
          </div>

          {/* Tear track */}
          <div
            ref={trackRef}
            className="relative h-16 border-t-[3px] border-dashed border-[#1a1a1a] bg-white/40 px-4 flex items-center"
            onClick={handleTap}
          >
            {/* Track line */}
            <div className="absolute left-4 right-4 top-1/2 -translate-y-1/2 h-1 rounded-full bg-[#1a1a1a]/15" />

            {/* Torn portion indicator */}
            <div
              className="absolute left-4 top-1/2 -translate-y-1/2 h-1 rounded-full bg-[#ff6b9d] transition-all duration-100"
              style={{ width: `calc(${tearProgress * 100}% - ${tearProgress > 0 ? '1.5rem' : '0px'})` }}
            />

            {/* Draggable tear handle */}
            <motion.div
              drag="x"
              dragConstraints={{ left: 0, right: trackWidth - 48 }}
              dragElastic={0}
              dragMomentum={false}
              onDrag={(_, info) => {
                resumeAudio();
                const progress = Math.min(1, Math.max(0, info.offset.x / (trackWidth - 48)));
                setTearProgress(progress);
              }}
              onDragEnd={handleDragEnd}
              whileTap={{ scale: 0.95 }}
              className="relative z-10 w-12 h-12 rounded-full bg-[#ff6b9d] border-[3px] border-[#1a1a1a] shadow-[2px_2px_0_#1a1a1a] flex items-center justify-center cursor-grab active:cursor-grabbing"
            >
              <span className="text-xl">✉️</span>
            </motion.div>

            {/* Hint text */}
            {tearProgress < 0.05 && (
              <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none">
                <span className="font-display text-xs text-[#1a1a1a]/40">
                  drag →
                </span>
              </div>
            )}
          </div>

          {/* Tear animation overlay */}
          <AnimatePresence>
            {tearing && (
              <motion.div
                initial={{ height: '0%' }}
                animate={{ height: '100%' }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
                className="absolute inset-x-0 bottom-0 bg-white"
                style={{
                  backgroundImage: 'repeating-linear-gradient(90deg, transparent, transparent 8px, rgba(0,0,0,0.05) 8px, rgba(0,0,0,0.05) 10px)',
                }}
              />
            )}
          </AnimatePresence>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative"
        >
          {/* Lined paper letter */}
          <div className="rounded-2xl border-[3px] border-[#1a1a1a] bg-white shadow-[4px_4px_0_#1a1a1a] lined-paper overflow-hidden relative">
            <div className="p-6 pt-8 pl-10">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="font-hand text-lg text-[#1a1a1a] leading-[2rem] whitespace-pre-wrap"
              >
                {letter}
                <span className="font-caveat text-2xl block mt-2 text-[#1a1a1a]">
                  {signature}
                </span>
              </motion.div>
            </div>
            {/* Red margin line */}
            <div className="absolute left-7 top-0 bottom-0 w-[2px] bg-[#ff6b9d]/30" />
          </div>
        </motion.div>
      )}
    </div>
  );
}
