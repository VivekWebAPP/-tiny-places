import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import type { AgreementItem } from '@/lib/types';
import { sfx, resumeAudio } from '@/lib/audio';
import { NeoButton } from '@/components/NeoButton';
import { Check } from 'lucide-react';

interface AgreementProps {
  title: string;
  items: AgreementItem[];
  stampText: string;
  bgClass: string;
  onComplete: () => void;
}

export function Agreement({
  title,
  items,
  stampText,
  bgClass,
  onComplete,
}: AgreementProps) {
  const [checked, setChecked] = useState<Set<string>>(new Set());
  const [stamped, setStamped] = useState(false);

  const allChecked = checked.size === items.length;

  function toggle(id: string) {
    resumeAudio();
    sfx.click();
    const next = new Set(checked);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setChecked(next);
  }

  function accept() {
    resumeAudio();
    sfx.stamp();
    setStamped(true);
    confetti({
      particleCount: 100,
      spread: 80,
      origin: { y: 0.5 },
      colors: ['#ff6b9d', '#ffd23f', '#4ecdc4', '#9b7ade'],
    });
    setTimeout(() => onComplete(), 1500);
  }

  return (
    <div className={`relative w-full rounded-2xl border-[3px] border-[#1a1a1a] ${bgClass} shadow-[4px_4px_0_#1a1a1a] p-6 overflow-hidden`}>
      <h3 className="font-display font-bold text-lg text-[#1a1a1a] text-center mb-2">
        {title}
      </h3>
      <p className="font-display text-xs text-[#1a1a1a]/50 text-center mb-5">
        Check all boxes to proceed
      </p>

      <div className="space-y-3 mb-6">
        {items.map((item) => {
          const isChecked = checked.has(item.id);
          return (
            <button
              key={item.id}
              onClick={() => toggle(item.id)}
              className={`w-full flex items-start gap-3 p-3 rounded-xl border-[2px] transition-all text-left ${
                isChecked
                  ? 'bg-[#4ecdc4] border-[#1a1a1a] shadow-[2px_2px_0_#1a1a1a]'
                  : 'bg-white/70 border-[#1a1a1a]/20 hover:border-[#1a1a1a]/40'
              }`}
            >
              <div
                className={`mt-0.5 w-6 h-6 rounded-md border-[2px] border-[#1a1a1a] flex items-center justify-center flex-shrink-0 ${
                  isChecked ? 'bg-white' : 'bg-transparent'
                }`}
              >
                {isChecked && <Check className="w-4 h-4 text-[#1a1a1a]" strokeWidth={3} />}
              </div>
              <span className="font-hand text-lg text-[#1a1a1a] leading-snug">
                {item.text}
              </span>
            </button>
          );
        })}
      </div>

      <div className="flex justify-center">
        <NeoButton
          color={allChecked ? 'bg-[#ff6b9d]' : 'bg-white'}
          textColor={allChecked ? 'text-white' : 'text-[#1a1a1a]/30'}
          onClick={accept}
          disabled={!allChecked}
        >
          I Accept
        </NeoButton>
      </div>

      {/* Stamp overlay */}
      <AnimatePresence>
        {stamped && (
          <motion.div
            initial={{ scale: 3, opacity: 0, rotate: -20 }}
            animate={{ scale: 1, opacity: 1, rotate: -12 }}
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
          >
            <div className="px-8 py-4 rounded-lg border-[5px] border-[#e8654f] text-[#e8654f] font-display font-black text-2xl uppercase bg-white/80" style={{ borderStyle: 'double' }}>
              {stampText}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
