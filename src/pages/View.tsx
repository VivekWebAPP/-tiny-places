import { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import {
  Bell,
  Volume2,
  VolumeX,
  ArrowRight,
  Mail,
  RefreshCw,
  MessageCircle,
  Loader2,
  CheckCircle2,
} from 'lucide-react';
import { PhoneFrame } from '@/components/PhoneFrame';
import { NeoButton } from '@/components/NeoButton';
import { themes } from '@/lib/themes';
import type { CardData } from '@/lib/types';
import { supabase } from '@/lib/supabase';
import { sfx, resumeAudio } from '@/lib/audio';
import { ScratchCard } from '@/components/exhibits/ScratchCard';
import { SlideLock } from '@/components/exhibits/SlideLock';
import { CurtainReveal } from '@/components/exhibits/CurtainReveal';
import { WordSearch } from '@/components/exhibits/WordSearch';
import { EnvelopeLetter } from '@/components/exhibits/EnvelopeLetter';
import { RedButton } from '@/components/exhibits/RedButton';
import { Agreement } from '@/components/exhibits/Agreement';

type Step =
  | 'intro'
  | 'door'
  | 'museum'
  | 'exhibit1'
  | 'exhibit2'
  | 'exhibit3'
  | 'redbutton'
  | 'letter'
  | 'wordsearch'
  | 'agreement'
  | 'outro';

const stepOrder: Step[] = [
  'intro',
  'door',
  'museum',
  'exhibit1',
  'exhibit2',
  'exhibit3',
  'redbutton',
  'letter',
  'wordsearch',
  'agreement',
  'outro',
];

export default function View() {
  const { cardId } = useParams<{ cardId: string }>();
  const [card, setCard] = useState<CardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState<Step>('intro');
  const [soundOn, setSoundOn] = useState(true);
  const [exhibitsViewed, setExhibitsViewed] = useState<Set<number>>(new Set());
  const [exhibitCompleted, setExhibitCompleted] = useState(false);
  const [letterCompleted, setLetterCompleted] = useState(false);

  useEffect(() => {
    async function load() {
      if (!cardId) {
        setError('No card ID provided.');
        setLoading(false);
        return;
      }
      try {
        const { data, error } = await supabase
          .from('cards')
          .select('data')
          .eq('id', cardId)
          .maybeSingle();
        if (error) throw error;
        if (!data) {
          setError('Card not found.');
          setLoading(false);
          return;
        }
        setCard(data.data as CardData);
      } catch {
        setError('Could not load this card.');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [cardId]);

  function next() {
    const idx = stepOrder.indexOf(step);
    if (idx < stepOrder.length - 1) {
      setStep(stepOrder[idx + 1]);
    }
  }

  function toggleSound() {
    resumeAudio();
    setSoundOn(!soundOn);
    sfx.click();
  }

  // Reset completion flag when entering a new exhibit/interactive step
  useEffect(() => {
    setExhibitCompleted(false);
    setLetterCompleted(false);
  }, [step]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f5f0e6] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-[#1a1a1a]" />
          <p className="font-display text-[#1a1a1a]/60">Loading your card...</p>
        </div>
      </div>
    );
  }

  if (error || !card) {
    return (
      <div className="min-h-screen bg-[#f5f0e6] flex items-center justify-center px-6">
        <div className="text-center max-w-sm">
          <div className="text-5xl mb-4">🫥</div>
          <h1 className="font-display font-bold text-2xl text-[#1a1a1a] mb-2">
            {error || 'Something went wrong'}
          </h1>
          <p className="font-display text-[#1a1a1a]/60 mb-6">
            This card may have been deleted or the link is broken.
          </p>
          <a href="/">
            <NeoButton color="bg-[#ff6b9d]" textColor="text-white">
              Go home
            </NeoButton>
          </a>
        </div>
      </div>
    );
  }

  const theme = themes[card.theme];

  function handleExhibitComplete(n: number) {
    setExhibitsViewed((prev) => new Set(prev).add(n));
  }

  const allExhibitsViewed = exhibitsViewed.size >= 3;

  return (
    <div className={`min-h-screen ${theme.bg} paper-texture flex flex-col items-center py-6 px-4`}>
      {/* Sound toggle */}
      <button
        onClick={toggleSound}
        className="fixed top-4 right-4 z-50 w-10 h-10 rounded-xl bg-white border-[3px] border-[#1a1a1a] shadow-[3px_3px_0_#1a1a1a] flex items-center justify-center"
      >
        {soundOn ? <Volume2 className="w-5 h-5 text-[#1a1a1a]" /> : <VolumeX className="w-5 h-5 text-[#1a1a1a]" />}
      </button>

      <PhoneFrame bgClass={theme.bg}>
        <AnimatePresence mode="wait">
          {/* STEP 1: Intro notification */}
          {step === 'intro' && (
            <motion.div
              key="intro"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className={`min-h-full flex flex-col items-center justify-center px-6 py-10 pt-16 ${theme.bg}`}
            >
              <motion.div
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                className="w-full max-w-xs"
              >
                {/* Paper notification */}
                <div className={`relative p-5 rounded-2xl border-[3px] border-[#1a1a1a] bg-white shadow-[5px_5px_0_#1a1a1a] ${theme.bgSoft}`}>
                  {/* Tape */}
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-16 h-6 bg-[#ffd23f]/60 border border-[#1a1a1a]/20 rotate-2" />
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#ff6b9d] border-[2px] border-[#1a1a1a] flex items-center justify-center flex-shrink-0">
                      <Bell className="w-5 h-5 text-white" fill="white" />
                    </div>
                    <div>
                      <p className="font-display font-bold text-sm text-[#1a1a1a]">
                        1 unopened message
                      </p>
                      <p className="font-hand text-lg text-[#1a1a1a] mt-1 leading-tight">
                        Actually... it's more than a message.
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="mt-10"
              >
                <NeoButton
                  size="lg"
                  color={theme.primary}
                  textColor={theme.primaryText}
                  onClick={() => {
                    resumeAudio();
                    sfx.pop();
                    next();
                  }}
                >
                  <span className="flex items-center gap-2">
                    Open it <ArrowRight className="w-5 h-5" />
                  </span>
                </NeoButton>
              </motion.div>
            </motion.div>
          )}

          {/* STEP 2: Knock-knock door */}
          {step === 'door' && (
            <DoorScreen
              key="door"
              card={card}
              theme={theme}
              onNext={() => {
                sfx.door();
                setTimeout(next, 600);
              }}
            />
          )}

          {/* STEP 3: Museum hub */}
          {step === 'museum' && (
            <MuseumScreen
              key="museum"
              card={card}
              theme={theme}
              exhibitsViewed={exhibitsViewed}
              onEnterExhibit={(n) => {
                sfx.click();
                setStep(`exhibit${n}` as Step);
              }}
              onContinue={() => {
                sfx.pop();
                setStep('redbutton');
              }}
              allViewed={allExhibitsViewed}
            />
          )}

          {/* Exhibit 001 — Scratch */}
          {step === 'exhibit1' && (
            <ExhibitScreen
              key="exhibit1"
              title={card.exhibits.scratch.title}
              theme={theme}
              onBack={() => setStep('museum')}
              onNext={() => {
                handleExhibitComplete(1);
                setStep('museum');
              }}
              canContinue={exhibitCompleted}
            >
              <ScratchCard
                coverText={card.exhibits.scratch.coverText}
                hiddenText={card.exhibits.scratch.hiddenText}
                bgClass={theme.surface}
                onReveal={() => setExhibitCompleted(true)}
              />
            </ExhibitScreen>
          )}

          {/* Exhibit 002 — Slide Lock */}
          {step === 'exhibit2' && (
            <ExhibitScreen
              key="exhibit2"
              title={card.exhibits.slideLock.title}
              theme={theme}
              onBack={() => setStep('museum')}
              onNext={() => {
                handleExhibitComplete(2);
                setStep('museum');
              }}
              canContinue={exhibitCompleted}
            >
              <SlideLock
                label={card.exhibits.slideLock.label}
                hiddenText={card.exhibits.slideLock.hiddenText}
                bgClass={theme.surface}
                onReveal={() => setExhibitCompleted(true)}
              />
            </ExhibitScreen>
          )}

          {/* Exhibit 003 — Curtain */}
          {step === 'exhibit3' && (
            <ExhibitScreen
              key="exhibit3"
              title={card.exhibits.curtain.title}
              theme={theme}
              onBack={() => setStep('museum')}
              onNext={() => {
                handleExhibitComplete(3);
                setStep('museum');
              }}
              canContinue={exhibitCompleted}
            >
              <CurtainReveal
                hiddenText={card.exhibits.curtain.hiddenText}
                imageUrl={card.exhibits.curtain.imageUrl}
                bgClass={theme.surface}
                onReveal={() => setExhibitCompleted(true)}
              />
            </ExhibitScreen>
          )}

          {/* STEP 4: Red Button */}
          {step === 'redbutton' && (
            <ExhibitScreen
              key="redbutton"
              title=""
              theme={theme}
              hideTitle
              onNext={next}
              canContinue={exhibitCompleted}
            >
              <RedButton
                title={card.diagnostic.title}
                checks={card.diagnostic.checks}
                stampText={card.diagnostic.stampText}
                bgClass={theme.surface}
                onComplete={() => setExhibitCompleted(true)}
              />
            </ExhibitScreen>
          )}

          {/* STEP 5: Envelope Letter */}
          {step === 'letter' && (
            <ExhibitScreen
              key="letter"
              title="A letter for you"
              theme={theme}
              onNext={next}
              canContinue={letterCompleted}
            >
              <EnvelopeLetter
                letter={card.letter}
                signature={card.letterSignature}
                bgClass={theme.surface}
                onRead={() => setLetterCompleted(true)}
              />
            </ExhibitScreen>
          )}

          {/* STEP 6: Word Search */}
          {step === 'wordsearch' && (
            <ExhibitScreen
              key="wordsearch"
              title=""
              theme={theme}
              hideTitle
              onNext={next}
              canContinue={exhibitCompleted}
            >
              <WordSearch
                title={card.wordSearch.title}
                words={card.wordSearch.words}
                bgClass={theme.surface}
                onComplete={() => setExhibitCompleted(true)}
              />
            </ExhibitScreen>
          )}

          {/* STEP 7: Agreement */}
          {step === 'agreement' && (
            <ExhibitScreen
              key="agreement"
              title=""
              theme={theme}
              hideTitle
              onNext={next}
              canContinue={exhibitCompleted}
            >
              <Agreement
                title={card.agreement.title}
                items={card.agreement.items}
                stampText={card.agreement.stampText}
                bgClass={theme.surface}
                onComplete={() => setExhibitCompleted(true)}
              />
            </ExhibitScreen>
          )}

          {/* STEP 8: Outro */}
          {step === 'outro' && (
            <motion.div
              key="outro"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className={`min-h-full flex flex-col items-center justify-center px-6 py-10 pt-16 ${theme.bg} text-center`}
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200 }}
                className="text-6xl mb-6"
              >
                💖
              </motion.div>
              <h2 className="font-hand text-3xl text-[#1a1a1a] leading-snug mb-8 max-w-xs">
                {card.outro.message}
              </h2>

              <div className="flex flex-col gap-3 w-full max-w-xs">
                {card.outro.whatsappNumber && (
                  <a
                    href={`https://wa.me/${card.outro.whatsappNumber}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <NeoButton color="bg-[#4ecdc4]" textColor="text-white" className="w-full">
                      <span className="flex items-center justify-center gap-2">
                        <MessageCircle className="w-5 h-5" /> Send a message
                      </span>
                    </NeoButton>
                  </a>
                )}
                {card.outro.email && (
                  <a href={`mailto:${card.outro.email}`}>
                    <NeoButton color="bg-white" className="w-full">
                      <span className="flex items-center justify-center gap-2">
                        <Mail className="w-5 h-5" /> Email them
                      </span>
                    </NeoButton>
                  </a>
                )}
                <button
                  onClick={() => {
                    sfx.pop();
                    confetti({
                      particleCount: 60,
                      spread: 60,
                      origin: { y: 0.5 },
                      colors: ['#ff6b9d', '#ffd23f', '#4ecdc4'],
                    });
                    setStep('intro');
                    setExhibitsViewed(new Set());
                  }}
                >
                  <NeoButton color={theme.primary} textColor={theme.primaryText} className="w-full">
                    <span className="flex items-center justify-center gap-2">
                      <RefreshCw className="w-5 h-5" /> Experience again
                    </span>
                  </NeoButton>
                </button>

                <a href="/" className="mt-4">
                  <span className="font-display text-sm text-[#1a1a1a]/50 hover:text-[#1a1a1a]">
                    Make your own →
                  </span>
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </PhoneFrame>

      {/* Progress dots */}
      <div className="flex gap-1.5 mt-4">
        {stepOrder.map((s) => (
          <div
            key={s}
            className={`h-2 rounded-full transition-all ${
              s === step ? 'w-6 bg-[#1a1a1a]' : 'w-2 bg-[#1a1a1a]/20'
            }`}
          />
        ))}
      </div>
    </div>
  );
}

function DoorScreen({
  card,
  theme,
  onNext,
}: {
  card: CardData;
  theme: typeof themes.buttercup;
  onNext: () => void;
}) {
  const [knocked, setKnocked] = useState(false);
  const [opened, setOpened] = useState(false);
  const [runawayPos, setRunawayPos] = useState<{ top: string; left: string } | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  function dodgeButton() {
    sfx.whoosh();
    const top = 10 + Math.random() * 70;
    const left = 10 + Math.random() * 70;
    setRunawayPos({ top: `${top}%`, left: `${left}%` });
  }

  return (
    <motion.div
      key="door"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={`relative min-h-full flex flex-col items-center justify-center px-6 py-10 pt-16 ${theme.bg}`}
    >
      {!opened ? (
        <>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="font-hand text-2xl text-[#1a1a1a] mb-6 text-center"
          >
            knock knock...
          </motion.p>

          {/* Door */}
          <motion.button
            onClick={() => {
              resumeAudio();
              sfx.knock();
              setKnocked(true);
            }}
            whileTap={{ scale: 0.97 }}
            className="relative w-40 h-56 rounded-t-2xl rounded-b-md bg-[#c44569] border-[4px] border-[#1a1a1a] shadow-[5px_5px_0_#1a1a1a] flex flex-col items-center justify-center"
          >
            {/* Door panels */}
            <div className="absolute inset-3 rounded-t-xl border-[2px] border-[#1a1a1a]/30 grid grid-rows-2 gap-2">
              <div className="rounded-lg border-[2px] border-[#1a1a1a]/20" />
              <div className="rounded-lg border-[2px] border-[#1a1a1a]/20" />
            </div>
            {/* Knocker */}
            <div className="relative z-10 w-12 h-12 rounded-full bg-[#ffd23f] border-[3px] border-[#1a1a1a] flex items-center justify-center text-2xl">
              🚪
            </div>
          </motion.button>

          {knocked && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-8 text-center w-full"
            >
              <p className="font-hand text-xl text-[#1a1a1a] mb-1">
                HEY {card.recipientName.toUpperCase()}.
              </p>
              <p className="font-hand text-lg text-[#1a1a1a]/80 mb-6 max-w-xs mx-auto">
                {card.introNote}
              </p>
              <div className="relative h-32 flex items-center justify-center gap-3">
                {/* FINE button — always stays in place */}
                <NeoButton
                  color={theme.primary}
                  textColor={theme.primaryText}
                  onClick={() => {
                    setOpened(true);
                    onNext();
                  }}
                >
                  Fine
                </NeoButton>

                {/* ABSOLUTELY NOT — evasive, absolutely positioned */}
                <div
                  style={
                    runawayPos
                      ? {
                          position: 'absolute',
                          top: runawayPos.top,
                          left: runawayPos.left,
                          transition: 'all 0.15s ease-out',
                        }
                      : { position: 'relative' }
                  }
                  onMouseEnter={dodgeButton}
                  onTouchStart={(e) => {
                    e.preventDefault();
                    dodgeButton();
                  }}
                  onClick={(e) => {
                    e.preventDefault();
                    dodgeButton();
                  }}
                >
                  <div className="select-none cursor-default">
                    <NeoButton color="bg-white">
                      Absolutely not
                    </NeoButton>
                  </div>
                </div>
              </div>
              {runawayPos && (
                <p className="font-display text-xs text-[#1a1a1a]/40 mt-2">
                  (it doesn't want to be pressed)
                </p>
              )}
            </motion.div>
          )}
        </>
      ) : (
        <motion.div
          initial={{ rotateY: 0 }}
          animate={{ rotateY: 80 }}
          transition={{ duration: 0.6 }}
          className="w-40 h-56 rounded-t-2xl rounded-b-md bg-[#c44569] border-[4px] border-[#1a1a1a]"
        />
      )}
    </motion.div>
  );
}

function MuseumScreen({
  card,
  theme,
  exhibitsViewed,
  onEnterExhibit,
  onContinue,
  allViewed,
}: {
  card: CardData;
  theme: typeof themes.buttercup;
  exhibitsViewed: Set<number>;
  onEnterExhibit: (n: number) => void;
  onContinue: () => void;
  allViewed: boolean;
}) {
  const exhibits = [
    { n: 1, title: card.exhibits.scratch.title, emoji: '🔍' },
    { n: 2, title: card.exhibits.slideLock.title, emoji: '🔓' },
    { n: 3, title: card.exhibits.curtain.title, emoji: '🪟' },
  ];

  return (
    <motion.div
      key="museum"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={`min-h-full flex flex-col px-6 py-10 pt-16 ${theme.bg}`}
    >
      <div className="text-center mb-6">
        <h2 className="font-display font-bold text-2xl text-[#1a1a1a]">
          {card.museumTitle}
        </h2>
        <p className="font-hand text-lg text-[#1a1a1a]/60 mt-1">
          Tap an exhibit to explore
        </p>
      </div>

      <div className="space-y-4 flex-1">
        {exhibits.map((ex) => {
          const viewed = exhibitsViewed.has(ex.n);
          return (
            <motion.button
              key={ex.n}
              onClick={() => onEnterExhibit(ex.n)}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
              className={`w-full flex items-center gap-4 p-4 rounded-2xl border-[3px] border-[#1a1a1a] shadow-[4px_4px_0_#1a1a1a] text-left transition-all ${
                viewed ? 'bg-[#4ecdc4]' : theme.surface
              }`}
            >
              <div className="w-12 h-12 rounded-xl bg-white border-[2px] border-[#1a1a1a] flex items-center justify-center text-2xl flex-shrink-0">
                {ex.emoji}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-display font-bold text-sm text-[#1a1a1a]">
                  {ex.title}
                </p>
                <p className="font-display text-xs text-[#1a1a1a]/50">
                  {viewed ? '✓ Viewed' : 'Tap to explore'}
                </p>
              </div>
              {viewed && <CheckCircle2 className="w-5 h-5 text-white flex-shrink-0" />}
              {!viewed && <ArrowRight className="w-5 h-5 text-[#1a1a1a] flex-shrink-0" />}
            </motion.button>
          );
        })}
      </div>

      <motion.div
        animate={{ opacity: allViewed ? 1 : 0.3 }}
        className="mt-6 flex justify-center"
      >
        <NeoButton
          color={theme.primary}
          textColor={theme.primaryText}
          onClick={onContinue}
          disabled={!allViewed}
        >
          <span className="flex items-center gap-2">
            Continue the tour <ArrowRight className="w-4 h-4" />
          </span>
        </NeoButton>
      </motion.div>

      {!allViewed && (
        <p className="text-center font-display text-xs text-[#1a1a1a]/40 mt-2">
          View all {3 - exhibitsViewed.size} more exhibit{3 - exhibitsViewed.size !== 1 ? 's' : ''} to continue
        </p>
      )}
    </motion.div>
  );
}

function ExhibitScreen({
  title,
  theme,
  children,
  onBack,
  onNext,
  hideTitle,
  canContinue,
}: {
  title: string;
  theme: typeof themes.buttercup;
  children: React.ReactNode;
  onBack?: () => void;
  onNext: () => void;
  hideTitle?: boolean;
  canContinue: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -30 }}
      className={`min-h-full flex flex-col px-6 py-10 pt-16 ${theme.bg}`}
    >
      {onBack && (
        <button
          onClick={onBack}
          className="self-start flex items-center gap-1 font-display font-bold text-sm text-[#1a1a1a]/60 hover:text-[#1a1a1a] mb-4"
        >
          <ArrowRight className="w-4 h-4 rotate-180" /> Back
        </button>
      )}
      {!hideTitle && title && (
        <h2 className="font-display font-bold text-xl text-[#1a1a1a] text-center mb-6">
          {title}
        </h2>
      )}
      <div className="flex-1 flex flex-col justify-center">{children}</div>

      {/* Gated continue button — only appears when canContinue is true */}
      <div className="mt-6 flex flex-col items-center gap-2">
        <AnimatePresence>
          {canContinue && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              <NeoButton size="sm" color="bg-white" onClick={onNext}>
                <span className="flex items-center gap-2">
                  Continue <ArrowRight className="w-4 h-4" />
                </span>
              </NeoButton>
            </motion.div>
          )}
        </AnimatePresence>
        {!canContinue && (
          <p className="font-display text-xs text-[#1a1a1a]/40 text-center">
            Complete the interaction to continue
          </p>
        )}
      </div>
    </motion.div>
  );
}
