import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import type { WordSearchWord } from '@/lib/types';
import { sfx, resumeAudio } from '@/lib/audio';

interface WordSearchProps {
  title: string;
  words: WordSearchWord[];
  bgClass: string;
  onComplete: () => void;
}

const GRID_SIZE = 10;

function buildGrid(words: WordSearchWord[]): { grid: string[][]; placements: Map<string, { cells: [number, number][] }> } {
  const grid: string[][] = Array.from({ length: GRID_SIZE }, () =>
    Array.from({ length: GRID_SIZE }, () => ''),
  );
  const placements = new Map<string, { cells: [number, number][] }>();
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

  const directions: [number, number][] = [
    [0, 1],   // right
    [1, 0],   // down
    [1, 1],   // diag down-right
    [0, -1],  // left
  ];

  const sortedWords = [...words].sort((a, b) => b.word.length - a.word.length);

  for (const w of sortedWords) {
    const word = w.word.toUpperCase().replace(/\s/g, '');
    if (word.length > GRID_SIZE) continue;
    let placed = false;
    for (let attempt = 0; attempt < 100 && !placed; attempt++) {
      const dir = directions[Math.floor(Math.random() * directions.length)];
      const maxRow = dir[0] > 0 ? GRID_SIZE - word.length : GRID_SIZE - 1;
      const minRow = dir[0] < 0 ? word.length - 1 : 0;
      const maxCol = dir[1] > 0 ? GRID_SIZE - word.length : GRID_SIZE - 1;
      const minCol = dir[1] < 0 ? word.length - 1 : 0;
      const row = Math.floor(Math.random() * (maxRow - minRow + 1)) + minRow;
      const col = Math.floor(Math.random() * (maxCol - minCol + 1)) + minCol;

      let canPlace = true;
      const cells: [number, number][] = [];
      for (let i = 0; i < word.length; i++) {
        const r = row + dir[0] * i;
        const c = col + dir[1] * i;
        if (r < 0 || r >= GRID_SIZE || c < 0 || c >= GRID_SIZE) {
          canPlace = false;
          break;
        }
        if (grid[r][c] !== '' && grid[r][c] !== word[i]) {
          canPlace = false;
          break;
        }
        cells.push([r, c]);
      }

      if (canPlace) {
        for (let i = 0; i < word.length; i++) {
          grid[cells[i][0]][cells[i][1]] = word[i];
        }
        placements.set(word, { cells });
        placed = true;
      }
    }
  }

  // Fill empty cells
  for (let r = 0; r < GRID_SIZE; r++) {
    for (let c = 0; c < GRID_SIZE; c++) {
      if (grid[r][c] === '') {
        grid[r][c] = letters[Math.floor(Math.random() * letters.length)];
      }
    }
  }

  return { grid, placements };
}

export function WordSearch({ title, words, bgClass, onComplete }: WordSearchProps) {
  const { grid, placements } = useMemo(() => buildGrid(words), [words]);
  const [found, setFound] = useState<Set<string>>(new Set());
  const [selected, setSelected] = useState<[number, number][]>([]);
  const [selecting, setSelecting] = useState(false);

  function getWordFromCells(cells: [number, number][]): string {
    return cells.map(([r, c]) => grid[r][c]).join('');
  }

  function checkSelection() {
    if (selected.length < 2) return;
    const word = getWordFromCells(selected);
    const reversed = word.split('').reverse().join('');
    const target = [...placements.keys()].find(
      (w) => w === word || w === reversed,
    );
    if (target && !found.has(target)) {
      const newFound = new Set(found);
      newFound.add(target);
      setFound(newFound);
      sfx.success();
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#ff6b9d', '#ffd23f', '#4ecdc4', '#9b7ade'],
      });

      if (newFound.size === placements.size) {
        setTimeout(() => onComplete(), 800);
      }
    }
    setSelected([]);
  }

  function handleCellDown(r: number, c: number) {
    resumeAudio();
    sfx.type();
    setSelecting(true);
    setSelected([[r, c]]);
  }

  function handleCellEnter(r: number, c: number) {
    if (!selecting) return;
    const last = selected[selected.length - 1];
    if (last && last[0] === r && last[1] === c) return;

    // Only allow straight lines
    const first = selected[0];
    const dr = r - first[0];
    const dc = c - first[1];
    if (dr === 0 || dc === 0 || Math.abs(dr) === Math.abs(dc)) {
      const steps = Math.max(Math.abs(dr), Math.abs(dc));
      const cells: [number, number][] = [];
      for (let i = 0; i <= steps; i++) {
        const sr = first[0] + (steps === 0 ? 0 : Math.round(dr / steps) * i);
        const sc = first[1] + (steps === 0 ? 0 : Math.round(dc / steps) * i);
        cells.push([sr, sc]);
      }
      setSelected(cells);
    }
  }

  function handleUp() {
    setSelecting(false);
    checkSelection();
  }

  function isCellSelected(r: number, c: number): boolean {
    return selected.some(([sr, sc]) => sr === r && sc === c);
  }

  function isCellFound(r: number, c: number): boolean {
    for (const word of found) {
      const placement = placements.get(word);
      if (placement) {
        if (placement.cells.some(([sr, sc]) => sr === r && sc === c)) return true;
      }
    }
    return false;
  }

  return (
    <div className={`w-full rounded-2xl border-[3px] border-[#1a1a1a] ${bgClass} shadow-[4px_4px_0_#1a1a1a] p-4`}>
      <h3 className="font-display font-bold text-lg text-[#1a1a1a] text-center mb-3">
        {title}
      </h3>

      {/* Word list */}
      <div className="flex flex-wrap justify-center gap-2 mb-4">
        {words.map((w) => {
          const isFound = found.has(w.word.toUpperCase().replace(/\s/g, ''));
          return (
            <div
              key={w.word}
              className={`px-3 py-1.5 rounded-full border-[2px] border-[#1a1a1a] font-display font-bold text-sm flex items-center gap-1 transition-all ${
                isFound ? 'bg-[#4ecdc4] text-white line-through' : 'bg-white text-[#1a1a1a]'
              }`}
            >
              <span>{w.emoji}</span>
              {w.word}
            </div>
          );
        })}
      </div>

      {/* Grid */}
      <div
        className="grid gap-0.5 select-none touch-none mx-auto"
        style={{ gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)` }}
        onPointerUp={handleUp}
        onPointerLeave={handleUp}
      >
        {grid.map((row, r) =>
          row.map((letter, c) => {
            const isSelected = isCellSelected(r, c);
            const isFound = isCellFound(r, c);
            return (
              <div
                key={`${r}-${c}`}
                onPointerDown={() => handleCellDown(r, c)}
                onPointerEnter={() => handleCellEnter(r, c)}
                className={`aspect-square flex items-center justify-center rounded-md font-display font-bold text-xs sm:text-sm cursor-pointer transition-colors ${
                  isFound
                    ? 'bg-[#4ecdc4] text-white'
                    : isSelected
                      ? 'bg-[#ff6b9d] text-white'
                      : 'bg-white/70 text-[#1a1a1a]'
                }`}
              >
                {letter}
              </div>
            );
          }),
        )}
      </div>

      {found.size === placements.size && (
        <motion.p
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="text-center font-hand text-2xl text-[#1a1a1a] mt-4"
        >
          You found them all! ✨
        </motion.p>
      )}
    </div>
  );
}
