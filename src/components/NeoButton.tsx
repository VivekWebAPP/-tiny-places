import { motion } from 'framer-motion';
import type { ButtonHTMLAttributes, ReactNode } from 'react';

interface NeoButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  color?: string;
  textColor?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function NeoButton({
  children,
  color = 'bg-white',
  textColor = 'text-[#1a1a1a]',
  size = 'md',
  className = '',
  ...props
}: NeoButtonProps) {
  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  };
  return (
    <motion.button
      whileHover={{ y: -2 }}
      whileTap={{ y: 2, scale: 0.97 }}
      className={`font-display font-bold rounded-xl border-[3px] border-[#1a1a1a] ${color} ${textColor} ${sizes[size]} shadow-[4px_4px_0_#1a1a1a] hover:shadow-[2px_2px_0_#1a1a1a] active:shadow-[0px_0px_0_#1a1a1a] transition-shadow disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
      {...(props as Record<string, unknown>)}
    >
      {children}
    </motion.button>
  );
}
