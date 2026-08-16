let ctx: AudioContext | null = null;

function getCtx(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!ctx) {
    const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AC) return null;
    ctx = new AC();
  }
  return ctx;
}

function tone(
  freq: number,
  duration: number,
  type: OscillatorType = 'sine',
  volume = 0.15,
  when = 0,
) {
  const ac = getCtx();
  if (!ac) return;
  const t = ac.currentTime + when;
  const osc = ac.createOscillator();
  const gain = ac.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, t);
  gain.gain.setValueAtTime(0, t);
  gain.gain.linearRampToValueAtTime(volume, t + 0.01);
  gain.gain.exponentialRampToValueAtTime(0.0001, t + duration);
  osc.connect(gain);
  gain.connect(ac.destination);
  osc.start(t);
  osc.stop(t + duration + 0.05);
}

export const sfx = {
  click: () => tone(600, 0.08, 'square', 0.08),
  pop: () => {
    tone(800, 0.06, 'sine', 0.12);
    tone(1200, 0.08, 'sine', 0.1, 0.04);
  },
  knock: () => {
    tone(200, 0.12, 'sine', 0.2);
    tone(150, 0.15, 'sine', 0.15, 0.05);
  },
  door: () => {
    tone(120, 0.3, 'sawtooth', 0.1);
    tone(80, 0.4, 'sine', 0.15, 0.1);
  },
  reveal: () => {
    tone(523, 0.12, 'sine', 0.12);
    tone(659, 0.12, 'sine', 0.12, 0.1);
    tone(784, 0.2, 'sine', 0.12, 0.2);
  },
  success: () => {
    tone(523, 0.1, 'sine', 0.15);
    tone(659, 0.1, 'sine', 0.15, 0.1);
    tone(784, 0.1, 'sine', 0.15, 0.2);
    tone(1047, 0.3, 'sine', 0.15, 0.3);
  },
  error: () => {
    tone(200, 0.15, 'sawtooth', 0.12);
    tone(150, 0.2, 'sawtooth', 0.1, 0.1);
  },
  stamp: () => {
    tone(100, 0.05, 'square', 0.2);
    tone(80, 0.15, 'sine', 0.15, 0.02);
  },
  whoosh: () => {
    const ac = getCtx();
    if (!ac) return;
    const t = ac.currentTime;
    const osc = ac.createOscillator();
    const gain = ac.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(400, t);
    osc.frequency.exponentialRampToValueAtTime(100, t + 0.3);
    gain.gain.setValueAtTime(0.08, t);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.3);
    osc.connect(gain);
    gain.connect(ac.destination);
    osc.start(t);
    osc.stop(t + 0.35);
  },
  type: () => tone(1200 + Math.random() * 200, 0.03, 'square', 0.04),
};

export function resumeAudio() {
  const ac = getCtx();
  if (ac && ac.state === 'suspended') ac.resume();
}
