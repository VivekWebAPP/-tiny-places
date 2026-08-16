import type { ThemeKey } from './types';

export interface Theme {
  key: ThemeKey;
  name: string;
  bg: string;
  bgSoft: string;
  surface: string;
  border: string;
  text: string;
  textSoft: string;
  primary: string;
  primaryText: string;
  accent: string;
  accentText: string;
  shadow: string;
}

export const themes: Record<ThemeKey, Theme> = {
  buttercup: {
    key: 'buttercup',
    name: 'Buttercup',
    bg: 'bg-[#fff8d6]',
    bgSoft: 'bg-[#fff3b0]',
    surface: 'bg-[#fffaf0]',
    border: 'border-[#2b2417]',
    text: 'text-[#2b2417]',
    textSoft: 'text-[#6b5d3e]',
    primary: 'bg-[#ffd23f]',
    primaryText: 'text-[#2b2417]',
    accent: 'bg-[#ff8c42]',
    accentText: 'text-white',
    shadow: 'shadow-[4px_4px_0_#2b2417]',
  },
  blossom: {
    key: 'blossom',
    name: 'Blossom',
    bg: 'bg-[#ffe4ec]',
    bgSoft: 'bg-[#ffc2d4]',
    surface: 'bg-[#fff5f8]',
    border: 'border-[#3d1f2b]',
    text: 'text-[#3d1f2b]',
    textSoft: 'text-[#7a4a5c]',
    primary: 'bg-[#ff6b9d]',
    primaryText: 'text-white',
    accent: 'bg-[#c44569]',
    accentText: 'text-white',
    shadow: 'shadow-[4px_4px_0_#3d1f2b]',
  },
  lavender: {
    key: 'lavender',
    name: 'Lavender',
    bg: 'bg-[#ede4ff]',
    bgSoft: 'bg-[#d4c2ff]',
    surface: 'bg-[#f6f0ff]',
    border: 'border-[#2d2152]',
    text: 'text-[#2d2152]',
    textSoft: 'text-[#5f4d8e]',
    primary: 'bg-[#9b7ade]',
    primaryText: 'text-white',
    accent: 'bg-[#6b4eb8]',
    accentText: 'text-white',
    shadow: 'shadow-[4px_4px_0_#2d2152]',
  },
  mint: {
    key: 'mint',
    name: 'Mint',
    bg: 'bg-[#dcf5e5]',
    bgSoft: 'bg-[#b8e8c8]',
    surface: 'bg-[#f0fbf4]',
    border: 'border-[#1a3a28]',
    text: 'text-[#1a3a28]',
    textSoft: 'text-[#3d6b52]',
    primary: 'bg-[#4ecdc4]',
    primaryText: 'text-white',
    accent: 'bg-[#2bb673]',
    accentText: 'text-white',
    shadow: 'shadow-[4px_4px_0_#1a3a28]',
  },
  peach: {
    key: 'peach',
    name: 'Peach',
    bg: 'bg-[#ffeadb]',
    bgSoft: 'bg-[#ffd0b0]',
    surface: 'bg-[#fff7f0]',
    border: 'border-[#3d2417]',
    text: 'text-[#3d2417]',
    textSoft: 'text-[#7a5a3e]',
    primary: 'bg-[#ff9a76]',
    primaryText: 'text-white',
    accent: 'bg-[#e8654f]',
    accentText: 'text-white',
    shadow: 'shadow-[4px_4px_0_#3d2417]',
  },
  sky: {
    key: 'sky',
    name: 'Sky',
    bg: 'bg-[#dcefff]',
    bgSoft: 'bg-[#b8dfff]',
    surface: 'bg-[#f0f8ff]',
    border: 'border-[#173d5c]',
    text: 'text-[#173d5c]',
    textSoft: 'text-[#3e6b8e]',
    primary: 'bg-[#4da6ff]',
    primaryText: 'text-white',
    accent: 'bg-[#2b7cd9]',
    accentText: 'text-white',
    shadow: 'shadow-[4px_4px_0_#173d5c]',
  },
};

export const themeKeys = Object.keys(themes) as ThemeKey[];
