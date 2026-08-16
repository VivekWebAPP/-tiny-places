import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';
import { sfx, resumeAudio } from '@/lib/audio';

interface ScratchCardProps {
  coverText: string;
  hiddenText: string;
  bgClass: string;
  onReveal: () => void;
}

const REVEAL_THRESHOLD = 0.4;
const RADIUS = 25;

export function ScratchCard({
  coverText,
  hiddenText,
  bgClass,
  onReveal,
}: ScratchCardProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isErased, setIsErased] = useState(false);
  const [progress, setProgress] = useState(0);
  const isDrawing = useRef(false);
  const lastPos = useRef<{ x: number; y: number } | null>(null);
  const strokeCount = useRef(0);

  // Draw the dusty overlay on mount
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Prevent touch scrolling
    canvas.style.touchAction = 'none';

    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    const w = rect.width;
    const h = rect.height;

    // Solid dusty gray-beige base
    ctx.fillStyle = '#c8c0b0';
    ctx.fillRect(0, 0, w, h);

    // Translucent noise dots
    for (let i = 0; i < 200; i++) {
      const r = Math.random() * 3 + 1;
      ctx.fillStyle = `rgba(${100 + Math.random() * 60}, ${90 + Math.random() * 50}, ${70 + Math.random() * 40}, ${0.3 + Math.random() * 0.3})`;
      ctx.beginPath();
      ctx.arc(Math.random() * w, Math.random() * h, r, 0, Math.PI * 2);
      ctx.fill();
    }

    // "RUB HERE" text
    ctx.fillStyle = 'rgba(40, 35, 25, 0.5)';
    ctx.font = 'bold 16px "Space Grotesk", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('🤚 RUB HERE 🤚', w / 2, h / 2);
  }, []);

  function getPos(e: React.PointerEvent): { x: number; y: number } {
    const canvas = canvasRef.current!;
    const rect = canvas.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  }

  function erase(x: number, y: number) {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.globalCompositeOperation = 'destination-out';

    if (lastPos.current) {
      // Draw solid circles along the path between last and current
      const dx = x - lastPos.current.x;
      const dy = y - lastPos.current.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const steps = Math.max(1, Math.ceil(dist / (RADIUS / 2)));
      for (let i = 0; i <= steps; i++) {
        const t = i / steps;
        const cx = lastPos.current.x + dx * t;
        const cy = lastPos.current.y + dy * t;
        ctx.beginPath();
        ctx.arc(cx, cy, RADIUS, 0, Math.PI * 2);
        ctx.fill();
      }
    } else {
      ctx.beginPath();
      ctx.arc(x, y, RADIUS, 0, Math.PI * 2);
      ctx.fill();
    }
    lastPos.current = { x, y };
    strokeCount.current++;
  }

  function checkProgress() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    let cleared = 0;
    let total = 0;
    // Sample every 4th pixel (step of 16 bytes = 4 pixels)
    for (let i = 3; i < imgData.data.length; i += 16) {
      total++;
      if (imgData.data[i] === 0) cleared++;
    }

    const pct = total > 0 ? cleared / total : 0;
    setProgress(pct);

    if (pct >= REVEAL_THRESHOLD && !isErased) {
      setIsErased(true);
      sfx.reveal();
      // Clear the rest of the canvas
      ctx.globalCompositeOperation = 'destination-out';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      onReveal();
    }
  }

  return (
    <div className={`relative w-full aspect-square rounded-2xl border-[3px] border-[#1a1a1a] overflow-hidden ${bgClass} shadow-[4px_4px_0_#1a1a1a]`}>
      {/* Hidden message underneath — visible as pixels erase */}
      <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
        <motion.p
          initial={{ scale: 0.85, opacity: 0.5 }}
          animate={{ scale: isErased ? 1 : 0.9, opacity: isErased ? 1 : 0.5 }}
          transition={{ duration: 0.4 }}
          className="font-hand text-2xl text-[#1a1a1a] leading-snug"
        >
          {hiddenText}
        </motion.p>
      </div>

      {/* Checkmark badge when erased */}
      {isErased && (
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

      {/* Scratch canvas on top */}
      {!isErased && (
        <canvas
          ref={canvasRef}
          onPointerDown={(e) => {
            resumeAudio();
            isDrawing.current = true;
            lastPos.current = null;
            const pos = getPos(e);
            erase(pos.x, pos.y);
          }}
          onPointerMove={(e) => {
            if (!isDrawing.current) return;
            const pos = getPos(e);
            erase(pos.x, pos.y);
            // Check every ~20 strokes
            if (strokeCount.current % 20 === 0) {
              checkProgress();
            }
          }}
          onPointerUp={() => {
            isDrawing.current = false;
            lastPos.current = null;
            checkProgress();
          }}
          onPointerLeave={() => {
            isDrawing.current = false;
            lastPos.current = null;
          }}
          className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing"
        />
      )}

      {/* Cover text label + progress bar */}
      {!isErased && (
        <>
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 pointer-events-none">
            <span className="font-display text-xs text-[#1a1a1a]/40 px-3 py-1 rounded-full bg-white/50">
              {coverText}
            </span>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-[#1a1a1a]/10">
            <div
              className="h-full bg-[#ff6b9d] transition-all duration-150"
              style={{ width: `${Math.min(100, (progress / REVEAL_THRESHOLD) * 100)}%` }}
            />
          </div>
        </>
      )}
    </div>
  );
}
