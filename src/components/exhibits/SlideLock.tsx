import { useState } from 'react';
import { motion } from 'framer-motion';
import { Lock, Unlock, CheckCircle2 } from 'lucide-react';
import { sfx, resumeAudio } from '@/lib/audio';

interface SlideLockProps {
  label: string;
  hiddenText: string;
  bgClass: string;
  onReveal: () => void;
}

export function SlideLock({
  label,
  hiddenText,
  bgClass,
  onReveal,
}: SlideLockProps) {
  const [unlocked, setUnlocked] = useState(false);

  function handleUnlock() {
    resumeAudio();
    sfx.pop();
    setUnlocked(true);
    sfx.reveal();
    onReveal();
  }

  return (
    <div className={`relative w-full rounded-2xl border-[3px] border-[#1a1a1a] overflow-hidden ${bgClass} shadow-[4px_4px_0_#1a1a1a]`}>
      {/* Checkmark badge when unlocked */}
      {unlocked && (
        <motion.div
          initial={{ scale: 0, rotate: -30 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 200, damping: 12 }}
          className="absolute top-3 right-3 z-20"
        >
          <div className="w-10 h-10 rounded-full bg-[#4ecdc4] border-[3px] border-[#1a1a1a] shadow-[2px_2px_0_#1a1a1a] flex items-center justify-center">
            <CheckCircle2 className="w-6 h-6 text-white" />
          </div>
        </motion.div>
      )}
      {/* Hidden content */}
      <div className="p-6 min-h-[200px] flex flex-col items-center justify-center text-center">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: unlocked ? 1 : 0, y: unlocked ? 0 : 10 }}
          transition={{ duration: 0.4 }}
        >
          <p className="font-hand text-2xl text-[#1a1a1a] leading-snug">
            {hiddenText}
          </p>
        </motion.div>
      </div>

      {/* Slider track */}
      {!unlocked && (
        <div className="p-4 pt-0">
          <div className="relative h-14 rounded-full border-[3px] border-[#1a1a1a] bg-white/60 overflow-hidden">
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <span className="font-display font-bold text-sm text-[#1a1a1a]/40 tracking-wide">
                {label} →
              </span>
            </div>
            <motion.button
              drag="x"
              dragConstraints={{ left: 0, right: 180 }}
              dragElastic={0}
              dragMomentum={false}
              onDragEnd={(_, info) => {
                if (info.offset.x > 120) {
                  handleUnlock();
                }
              }}
              whileTap={{ scale: 0.95 }}
              className="absolute left-1 top-1 bottom-1 w-12 rounded-full bg-[#ff6b9d] border-[3px] border-[#1a1a1a] shadow-[2px_2px_0_#1a1a1a] flex items-center justify-center cursor-grab active:cursor-grabbing z-10"
            >
              <Lock className="w-5 h-5 text-white" />
            </motion.button>
          </div>
          <p className="text-center font-display text-xs text-[#1a1a1a]/40 mt-2">
            Drag the lock to the right
          </p>
        </div>
      )}

      {unlocked && (
        <div className="px-4 pb-4 flex justify-center">
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#4ecdc4] border-[3px] border-[#1a1a1a] shadow-[2px_2px_0_#1a1a1a]">
            <Unlock className="w-4 h-4 text-white" />
            <span className="font-display font-bold text-sm text-white">Unlocked</span>
          </div>
        </div>
      )}
    </div>
  );
}
