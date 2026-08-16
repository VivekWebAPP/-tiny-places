import type { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface PhoneFrameProps {
  children: ReactNode;
  bgClass?: string;
  showNotch?: boolean;
}

export function PhoneFrame({
  children,
  bgClass = 'bg-[#fff8d6]',
  showNotch = true,
}: PhoneFrameProps) {
  return (
    <div className="relative mx-auto w-full max-w-[420px]">
      {/* Phone body */}
      <div className={`relative rounded-[2.5rem] border-[4px] border-[#1a1a1a] ${bgClass} shadow-[8px_8px_0_#1a1a1a] overflow-hidden`}>
        {/* Notch */}
        {showNotch && (
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-28 h-6 bg-[#1a1a1a] rounded-b-2xl z-30 flex items-center justify-center gap-2">
            <div className="w-2 h-2 rounded-full bg-[#333]" />
            <div className="w-6 h-1 rounded-full bg-[#222]" />
          </div>
        )}
        {/* Screen content */}
        <div className="relative h-[680px] max-h-[80vh] overflow-y-auto no-scrollbar">
          {children}
        </div>
      </div>
    </div>
  );
}

export function ScreenWrapper({
  children,
  bgClass,
  className = '',
}: {
  children: ReactNode;
  bgClass: string;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className={`min-h-full flex flex-col items-center justify-center px-6 py-10 pt-16 ${bgClass} ${className}`}
    >
      {children}
    </motion.div>
  );
}
