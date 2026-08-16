import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import type { DiagnosticCheck } from '@/lib/types';
import { sfx, resumeAudio } from '@/lib/audio';
import { NeoButton } from '@/components/NeoButton';

interface RedButtonProps {
  title: string;
  checks: DiagnosticCheck[];
  stampText: string;
  bgClass: string;
  onComplete: () => void;
}

type Phase = 'idle' | 'flashing' | 'running' | 'done';

export function RedButton({
  title,
  checks,
  stampText,
  bgClass,
  onComplete,
}: RedButtonProps) {
  const [phase, setPhase] = useState<Phase>('idle');
  const [activeCheck, setActiveCheck] = useState(-1);

  function handlePress() {
    resumeAudio();
    sfx.error();
    setPhase('flashing');
    setTimeout(() => {
      setPhase('running');
      runChecks(0);
    }, 800);
  }

  function runChecks(index: number) {
    if (index >= checks.length) {
      setPhase('done');
      sfx.success();
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.5 },
        colors: ['#ff6b9d', '#ffd23f', '#4ecdc4'],
      });
      return;
    }
    setActiveCheck(index);
    sfx.type();
    setTimeout(() => runChecks(index + 1), 900);
  }

  return (
    <div className={`w-full rounded-2xl border-[3px] border-[#1a1a1a] ${bgClass} shadow-[4px_4px_0_#1a1a1a] p-6`}>
      <h3 className="font-display font-bold text-lg text-[#1a1a1a] text-center mb-6">
        {title}
      </h3>

      <AnimatePresence mode="wait">
        {phase === 'idle' && (
          <motion.div
            key="idle"
            exit={{ opacity: 0 }}
            className="flex flex-col items-center gap-4"
          >
            <motion.button
              onClick={handlePress}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.9 }}
              animate={{ y: [0, -3, 0] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="w-32 h-32 rounded-full bg-[#e8654f] border-[4px] border-[#1a1a1a] shadow-[0_8px_0_#a33,4px_4px_0_#1a1a1a] flex items-center justify-center"
            >
              <span className="font-display font-bold text-white text-sm text-center leading-tight">
                DO NOT
                <br />
                PRESS
              </span>
            </motion.button>
            <p className="font-display text-xs text-[#1a1a1a]/50">
              (you will press it)
            </p>
          </motion.div>
        )}

        {phase === 'flashing' && (
          <motion.div
            key="flash"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center justify-center h-32"
          >
            <motion.div
              animate={{
                backgroundColor: ['#fff', '#ff6b9d', '#fff', '#ff6b9d', '#fff'],
              }}
              transition={{ duration: 0.8, times: [0, 0.25, 0.5, 0.75, 1] }}
              className="w-full h-32 rounded-xl"
            />
          </motion.div>
        )}

        {phase === 'running' && (
          <motion.div
            key="running"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-3"
          >
            <div className="font-display font-bold text-sm text-[#1a1a1a] text-center mb-2">
              RUNNING DIAGNOSTIC...
            </div>
            <div className="w-full h-3 rounded-full bg-white/50 border-[2px] border-[#1a1a1a] overflow-hidden mb-4">
              <motion.div
                className="h-full bg-[#ff6b9d]"
                animate={{ width: `${((activeCheck + 1) / checks.length) * 100}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
            {checks.map((check, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{
                  opacity: i <= activeCheck ? 1 : 0.3,
                  x: 0,
                }}
                transition={{ delay: i * 0.1 }}
                className="flex items-center justify-between px-4 py-2.5 rounded-lg bg-white/70 border-[2px] border-[#1a1a1a]/20"
              >
                <span className="font-display text-sm text-[#1a1a1a]">
                  {check.label}
                </span>
                {i <= activeCheck && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="font-display font-bold text-xs text-[#ff6b9d] uppercase"
                  >
                    {check.result}
                  </motion.span>
                )}
              </motion.div>
            ))}
          </motion.div>
        )}

        {phase === 'done' && (
          <motion.div
            key="done"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center gap-4"
          >
            {/* Stamp */}
            <motion.div
              initial={{ rotate: -20, scale: 0 }}
              animate={{ rotate: -12, scale: 1 }}
              transition={{ type: 'spring', stiffness: 200 }}
              className="px-6 py-3 rounded-lg border-[4px] border-[#e8654f] text-[#e8654f] font-display font-bold text-lg uppercase"
              style={{ borderStyle: 'double' }}
            >
              {stampText}
            </motion.div>
            <NeoButton
              color="bg-[#ff6b9d]"
              textColor="text-white"
              onClick={() => {
                sfx.stamp();
                onComplete();
              }}
            >
              Accept my fate
            </NeoButton>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
