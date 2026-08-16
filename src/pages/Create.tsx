import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Palette,
  Type,
  Gamepad2,
  FileText,
  CheckCircle2,
  Plus,
  Trash2,
  Link2,
  Loader2,
  Eye,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { NeoButton } from '@/components/NeoButton';
import { themes, themeKeys } from '@/lib/themes';
import { templateMeta, templateKeys, makeDefaultCard } from '@/lib/templates';
import type { CardData, TemplateKey, ThemeKey, AgreementItem } from '@/lib/types';
import { supabase } from '@/lib/supabase';
import { sfx, resumeAudio } from '@/lib/audio';

type Section =
  | 'template'
  | 'theme'
  | 'basics'
  | 'exhibits'
  | 'diagnostic'
  | 'letter'
  | 'wordsearch'
  | 'agreement'
  | 'outro'
  | 'share';

const sectionList: { key: Section; label: string; icon: typeof Type }[] = [
  { key: 'template', label: 'Template', icon: Type },
  { key: 'theme', label: 'Theme', icon: Palette },
  { key: 'basics', label: 'Names & Intro', icon: Type },
  { key: 'exhibits', label: 'Museum Exhibits', icon: Gamepad2 },
  { key: 'diagnostic', label: 'Red Button', icon: Gamepad2 },
  { key: 'letter', label: 'Letter', icon: FileText },
  { key: 'wordsearch', label: 'Word Search', icon: Gamepad2 },
  { key: 'agreement', label: 'Agreement', icon: CheckCircle2 },
  { key: 'outro', label: 'Outro', icon: Type },
  { key: 'share', label: 'Share', icon: Link2 },
];

export default function Create() {
  const navigate = useNavigate();
  const [card, setCard] = useState<CardData>(() => makeDefaultCard('friendship'));
  const [section, setSection] = useState<Section>('template');
  const [saving, setSaving] = useState(false);
  const [shareUrl, setShareUrl] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [expanded, setExpanded] = useState<Section | null>('template');

  function update<K extends keyof CardData>(key: K, value: CardData[K]) {
    setCard((c) => ({ ...c, [key]: value }));
  }

  function selectTemplate(t: TemplateKey) {
    resumeAudio();
    sfx.pop();
    setCard(makeDefaultCard(t));
  }

  function selectTheme(t: ThemeKey) {
    resumeAudio();
    sfx.click();
    update('theme', t);
  }

  async function saveAndShare() {
    setSaving(true);
    try {
      const { data, error } = await supabase
        .from('cards')
        .insert({ data: card })
        .select('id')
        .single();
      if (error) throw error;
      const url = `${window.location.origin}/view/${data.id}`;
      setShareUrl(url);
      setSection('share');
    } catch (err) {
      console.error(err);
      alert('Could not save. Please try again.');
    } finally {
      setSaving(false);
    }
  }

  function copyLink() {
    if (!shareUrl) return;
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    sfx.pop();
    setTimeout(() => setCopied(false), 2000);
  }

  const theme = themes[card.theme];

  return (
    <div className="min-h-screen bg-[#f5f0e6] paper-texture">
      {/* Top bar */}
      <div className="sticky top-0 z-40 bg-white/90 backdrop-blur border-b-[3px] border-[#1a1a1a]">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 font-display font-bold text-[#1a1a1a] hover:opacity-60"
          >
            <ArrowLeft className="w-5 h-5" />
            Home
          </button>
          <h1 className="font-display font-bold text-lg text-[#1a1a1a] hidden sm:block">
            Creator Studio
          </h1>
          <NeoButton
            size="sm"
            color="bg-[#ff6b9d]"
            textColor="text-white"
            onClick={saveAndShare}
            disabled={saving}
          >
            <span className="flex items-center gap-2">
              {saving ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Link2 className="w-4 h-4" />
              )}
              {saving ? 'Saving...' : 'Save & Share'}
            </span>
          </NeoButton>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-6 flex flex-col lg:flex-row gap-6">
        {/* Sidebar */}
        <aside className="lg:w-64 lg:sticky lg:top-20 lg:self-start">
          <div className="rounded-2xl border-[3px] border-[#1a1a1a] bg-white shadow-[4px_4px_0_#1a1a1a] p-3">
            <p className="font-display font-bold text-sm text-[#1a1a1a]/50 px-2 mb-2 uppercase tracking-wide">
              Steps
            </p>
            <div className="flex lg:flex-col gap-1 overflow-x-auto no-scrollbar">
              {sectionList.map((s, i) => (
                <button
                  key={s.key}
                  onClick={() => {
                    sfx.click();
                    setSection(s.key);
                    setExpanded(s.key);
                  }}
                  className={`flex items-center gap-2 px-3 py-2.5 rounded-xl font-display font-bold text-sm whitespace-nowrap transition-all ${
                    section === s.key
                      ? `${theme.primary} ${theme.text} border-[2px] border-[#1a1a1a] shadow-[2px_2px_0_#1a1a1a]`
                      : 'text-[#1a1a1a]/60 hover:bg-black/5'
                  }`}
                >
                  <span className="text-xs opacity-50">{i + 1}</span>
                  <s.icon className="w-4 h-4" />
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          {/* Live preview indicator */}
          <div className="mt-4 p-3 rounded-2xl border-[3px] border-[#1a1a1a] bg-white shadow-[4px_4px_0_#1a1a1a]">
            <div className="flex items-center gap-2 mb-2">
              <Eye className="w-4 h-4 text-[#1a1a1a]" />
              <span className="font-display font-bold text-sm text-[#1a1a1a]">
                Preview
              </span>
            </div>
            <div className={`rounded-xl border-[2px] border-[#1a1a1a] ${theme.bg} p-3`}>
              <p className="font-hand text-lg text-[#1a1a1a] leading-tight">
                {card.recipientName}
              </p>
              <p className="font-display text-xs text-[#1a1a1a]/60 mt-1">
                {templateMeta[card.template].name} · {themes[card.theme].name}
              </p>
            </div>
          </div>
        </aside>

        {/* Main editor */}
        <main className="flex-1 min-w-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={section}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              className="rounded-2xl border-[3px] border-[#1a1a1a] bg-white shadow-[5px_5px_0_#1a1a1a] p-6"
            >
              {section === 'template' && (
                <Section title="Choose a template" icon={Type}>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {templateKeys.map((t) => (
                      <button
                        key={t}
                        onClick={() => selectTemplate(t)}
                        className={`p-5 rounded-xl border-[3px] text-left transition-all ${
                          card.template === t
                            ? 'border-[#1a1a1a] bg-[#fff8d6] shadow-[4px_4px_0_#1a1a1a]'
                            : 'border-[#1a1a1a]/20 hover:border-[#1a1a1a] hover:shadow-[3px_3px_0_#1a1a1a]'
                        }`}
                      >
                        <span className="text-3xl">{templateMeta[t].emoji}</span>
                        <h3 className="font-display font-bold text-lg text-[#1a1a1a] mt-2">
                          {templateMeta[t].name}
                        </h3>
                        <p className="font-display text-sm text-[#1a1a1a]/60 mt-1">
                          {templateMeta[t].description}
                        </p>
                      </button>
                    ))}
                  </div>
                </Section>
              )}

              {section === 'theme' && (
                <Section title="Pick a color theme" icon={Palette}>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {themeKeys.map((t) => (
                      <button
                        key={t}
                        onClick={() => selectTheme(t)}
                        className={`rounded-xl border-[3px] p-4 transition-all ${
                          card.theme === t
                            ? 'border-[#1a1a1a] shadow-[4px_4px_0_#1a1a1a]'
                            : 'border-[#1a1a1a]/20 hover:border-[#1a1a1a]'
                        } ${themes[t].bg}`}
                      >
                        <div className="flex gap-2 mb-3">
                          <div className={`w-8 h-8 rounded-lg border-[2px] border-[#1a1a1a] ${themes[t].primary}`} />
                          <div className={`w-8 h-8 rounded-lg border-[2px] border-[#1a1a1a] ${themes[t].accent}`} />
                          <div className={`w-8 h-8 rounded-lg border-[2px] border-[#1a1a1a] ${themes[t].surface}`} />
                        </div>
                        <span className="font-display font-bold text-[#1a1a1a]">
                          {themes[t].name}
                        </span>
                      </button>
                    ))}
                  </div>
                </Section>
              )}

              {section === 'basics' && (
                <Section title="Names & Intro" icon={Type}>
                  <Field label="Recipient's name">
                    <TextInput
                      value={card.recipientName}
                      onChange={(v) => update('recipientName', v)}
                      placeholder="Their name"
                    />
                  </Field>
                  <Field label="Your name (author)">
                    <TextInput
                      value={card.authorName}
                      onChange={(v) => update('authorName', v)}
                      placeholder="Your name"
                    />
                  </Field>
                  <Field label="Museum/gallery title">
                    <TextInput
                      value={card.museumTitle}
                      onChange={(v) => update('museumTitle', v)}
                      placeholder="Museum of Us"
                    />
                  </Field>
                  <Field label="Intro note (shown after the door opens)">
                    <TextArea
                      value={card.introNote}
                      onChange={(v) => update('introNote', v)}
                      placeholder="I made a tiny place on the internet for you."
                    />
                  </Field>
                </Section>
              )}

              {section === 'exhibits' && (
                <Section title="Museum Exhibits" icon={Gamepad2}>
                  <SubSection title="Exhibit 001 — Dusty Glass (Scratch)">
                    <Field label="Cover text (shown before reveal)">
                      <TextInput
                        value={card.exhibits.scratch.coverText}
                        onChange={(v) =>
                          update('exhibits', {
                            ...card.exhibits,
                            scratch: { ...card.exhibits.scratch, coverText: v },
                          })
                        }
                      />
                    </Field>
                    <Field label="Hidden text (revealed by rubbing)">
                      <TextArea
                        value={card.exhibits.scratch.hiddenText}
                        onChange={(v) =>
                          update('exhibits', {
                            ...card.exhibits,
                            scratch: { ...card.exhibits.scratch, hiddenText: v },
                          })
                        }
                      />
                    </Field>
                  </SubSection>

                  <SubSection title="Exhibit 002 — Locked Drawer (Slide Lock)">
                    <Field label="Slider label">
                      <TextInput
                        value={card.exhibits.slideLock.label}
                        onChange={(v) =>
                          update('exhibits', {
                            ...card.exhibits,
                            slideLock: { ...card.exhibits.slideLock, label: v },
                          })
                        }
                      />
                    </Field>
                    <Field label="Hidden text (revealed by sliding)">
                      <TextArea
                        value={card.exhibits.slideLock.hiddenText}
                        onChange={(v) =>
                          update('exhibits', {
                            ...card.exhibits,
                            slideLock: { ...card.exhibits.slideLock, hiddenText: v },
                          })
                        }
                      />
                    </Field>
                  </SubSection>

                  <SubSection title="Exhibit 003 — Behind the Curtain">
                    <Field label="Hidden text">
                      <TextArea
                        value={card.exhibits.curtain.hiddenText}
                        onChange={(v) =>
                          update('exhibits', {
                            ...card.exhibits,
                            curtain: { ...card.exhibits.curtain, hiddenText: v },
                          })
                        }
                      />
                    </Field>
                    <Field label="Image URL (optional — leave blank for emoji)">
                      <TextInput
                        value={card.exhibits.curtain.imageUrl}
                        onChange={(v) =>
                          update('exhibits', {
                            ...card.exhibits,
                            curtain: { ...card.exhibits.curtain, imageUrl: v },
                          })
                        }
                        placeholder="https://..."
                      />
                    </Field>
                  </SubSection>
                </Section>
              )}

              {section === 'diagnostic' && (
                <Section title="Red Button Diagnostic" icon={Gamepad2}>
                  <Field label="Diagnostic title">
                    <TextInput
                      value={card.diagnostic.title}
                      onChange={(v) =>
                        update('diagnostic', { ...card.diagnostic, title: v })
                      }
                    />
                  </Field>
                  <Field label="Stamp text (after diagnostic runs)">
                    <TextInput
                      value={card.diagnostic.stampText}
                      onChange={(v) =>
                        update('diagnostic', { ...card.diagnostic, stampText: v })
                      }
                    />
                  </Field>
                  <div className="mt-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-display font-bold text-sm text-[#1a1a1a]">
                        Checklist items
                      </span>
                      <button
                        onClick={() => {
                          sfx.click();
                          update('diagnostic', {
                            ...card.diagnostic,
                            checks: [
                              ...card.diagnostic.checks,
                              { label: 'Checking...', result: 'PENDING' },
                            ],
                          });
                        }}
                        className="flex items-center gap-1 text-sm font-display font-bold text-[#ff6b9d]"
                      >
                        <Plus className="w-4 h-4" /> Add
                      </button>
                    </div>
                    <div className="space-y-2">
                      {card.diagnostic.checks.map((check, i) => (
                        <div key={i} className="flex gap-2 items-start">
                          <input
                            value={check.label}
                            onChange={(e) => {
                              const checks = [...card.diagnostic.checks];
                              checks[i] = { ...check, label: e.target.value };
                              update('diagnostic', { ...card.diagnostic, checks });
                            }}
                            className="flex-1 px-3 py-2 rounded-lg border-[2px] border-[#1a1a1a]/20 font-display text-sm"
                            placeholder="Checking..."
                          />
                          <input
                            value={check.result}
                            onChange={(e) => {
                              const checks = [...card.diagnostic.checks];
                              checks[i] = { ...check, result: e.target.value };
                              update('diagnostic', { ...card.diagnostic, checks });
                            }}
                            className="w-32 px-3 py-2 rounded-lg border-[2px] border-[#1a1a1a]/20 font-display text-sm font-bold"
                            placeholder="RESULT"
                          />
                          <button
                            onClick={() => {
                              update('diagnostic', {
                                ...card.diagnostic,
                                checks: card.diagnostic.checks.filter((_, j) => j !== i),
                              });
                            }}
                            className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </Section>
              )}

              {section === 'letter' && (
                <Section title="Handwritten Letter" icon={FileText}>
                  <Field label="Letter body (will appear on lined paper)">
                    <TextArea
                      value={card.letter}
                      onChange={(v) => update('letter', v)}
                      rows={10}
                      placeholder="Write your heartfelt note..."
                    />
                  </Field>
                  <Field label="Signature">
                    <TextInput
                      value={card.letterSignature}
                      onChange={(v) => update('letterSignature', v)}
                      placeholder="— Your name"
                    />
                  </Field>
                </Section>
              )}

              {section === 'wordsearch' && (
                <Section title="Word Search Puzzle" icon={Gamepad2}>
                  <Field label="Puzzle title">
                    <TextInput
                      value={card.wordSearch.title}
                      onChange={(v) =>
                        update('wordSearch', { ...card.wordSearch, title: v })
                      }
                    />
                  </Field>
                  <div className="mt-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-display font-bold text-sm text-[#1a1a1a]">
                        Words to find
                      </span>
                      <button
                        onClick={() => {
                          sfx.click();
                          update('wordSearch', {
                            ...card.wordSearch,
                            words: [
                              ...card.wordSearch.words,
                              { word: 'NEW', emoji: '✨' },
                            ],
                          });
                        }}
                        className="flex items-center gap-1 text-sm font-display font-bold text-[#ff6b9d]"
                      >
                        <Plus className="w-4 h-4" /> Add
                      </button>
                    </div>
                    <div className="space-y-2">
                      {card.wordSearch.words.map((w, i) => (
                        <div key={i} className="flex gap-2 items-center">
                          <input
                            value={w.word}
                            onChange={(e) => {
                              const words = [...card.wordSearch.words];
                              words[i] = { ...w, word: e.target.value.toUpperCase() };
                              update('wordSearch', { ...card.wordSearch, words });
                            }}
                            className="flex-1 px-3 py-2 rounded-lg border-[2px] border-[#1a1a1a]/20 font-display font-bold text-sm uppercase"
                          />
                          <input
                            value={w.emoji}
                            onChange={(e) => {
                              const words = [...card.wordSearch.words];
                              words[i] = { ...w, emoji: e.target.value };
                              update('wordSearch', { ...card.wordSearch, words });
                            }}
                            className="w-16 px-3 py-2 rounded-lg border-[2px] border-[#1a1a1a]/20 font-display text-center text-lg"
                          />
                          <button
                            onClick={() => {
                              update('wordSearch', {
                                ...card.wordSearch,
                                words: card.wordSearch.words.filter((_, j) => j !== i),
                              });
                            }}
                            className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                    <p className="text-xs text-[#1a1a1a]/50 mt-2 font-display">
                      Words are hidden in a grid. Tap them to highlight.
                    </p>
                  </div>
                </Section>
              )}

              {section === 'agreement' && (
                <Section title="Agreement / Contract" icon={CheckCircle2}>
                  <Field label="Contract title">
                    <TextInput
                      value={card.agreement.title}
                      onChange={(v) =>
                        update('agreement', { ...card.agreement, title: v })
                      }
                    />
                  </Field>
                  <Field label="Stamp text (when all items checked)">
                    <TextInput
                      value={card.agreement.stampText}
                      onChange={(v) =>
                        update('agreement', { ...card.agreement, stampText: v })
                      }
                    />
                  </Field>
                  <div className="mt-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-display font-bold text-sm text-[#1a1a1a]">
                        Checklist items
                      </span>
                      <button
                        onClick={() => {
                          sfx.click();
                          const newItem: AgreementItem = {
                            id: `i${Date.now()}`,
                            text: 'New agreement item',
                          };
                          update('agreement', {
                            ...card.agreement,
                            items: [...card.agreement.items, newItem],
                          });
                        }}
                        className="flex items-center gap-1 text-sm font-display font-bold text-[#ff6b9d]"
                      >
                        <Plus className="w-4 h-4" /> Add
                      </button>
                    </div>
                    <div className="space-y-2">
                      {card.agreement.items.map((item, i) => (
                        <div key={item.id} className="flex gap-2 items-start">
                          <input
                            value={item.text}
                            onChange={(e) => {
                              const items = [...card.agreement.items];
                              items[i] = { ...item, text: e.target.value };
                              update('agreement', { ...card.agreement, items });
                            }}
                            className="flex-1 px-3 py-2 rounded-lg border-[2px] border-[#1a1a1a]/20 font-display text-sm"
                          />
                          <button
                            onClick={() => {
                              update('agreement', {
                                ...card.agreement,
                                items: card.agreement.items.filter((_, j) => j !== i),
                              });
                            }}
                            className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </Section>
              )}

              {section === 'outro' && (
                <Section title="Outro Screen" icon={Type}>
                  <Field label="Closing message">
                    <TextArea
                      value={card.outro.message}
                      onChange={(v) =>
                        update('outro', { ...card.outro, message: v })
                      }
                    />
                  </Field>
                  <Field label="WhatsApp number (optional — include country code, no +)">
                    <TextInput
                      value={card.outro.whatsappNumber}
                      onChange={(v) =>
                        update('outro', { ...card.outro, whatsappNumber: v })
                      }
                      placeholder="15551234567"
                    />
                  </Field>
                  <Field label="Email (optional)">
                    <TextInput
                      value={card.outro.email}
                      onChange={(v) => update('outro', { ...card.outro, email: v })}
                      placeholder="you@example.com"
                    />
                  </Field>
                </Section>
              )}

              {section === 'share' && (
                <Section title="Share your card" icon={Link2}>
                  {shareUrl ? (
                    <div className="space-y-4">
                      <div className="p-4 rounded-xl bg-[#fff8d6] border-[3px] border-[#1a1a1a] shadow-[3px_3px_0_#1a1a1a]">
                        <p className="font-display text-sm text-[#1a1a1a]/60 mb-2">
                          Your card is live! Share this link:
                        </p>
                        <div className="flex gap-2 items-center">
                          <input
                            readOnly
                            value={shareUrl}
                            className="flex-1 px-3 py-2 rounded-lg border-[2px] border-[#1a1a1a] font-display text-sm bg-white"
                          />
                          <NeoButton
                            size="sm"
                            color={copied ? 'bg-[#4ecdc4]' : 'bg-[#ff6b9d]'}
                            textColor="text-white"
                            onClick={copyLink}
                          >
                            {copied ? 'Copied!' : 'Copy'}
                          </NeoButton>
                        </div>
                      </div>
                      <NeoButton
                        color="bg-white"
                        onClick={() => window.open(shareUrl, '_blank')}
                      >
                        <span className="flex items-center gap-2">
                          <Eye className="w-4 h-4" /> Open it
                        </span>
                      </NeoButton>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <p className="font-display text-[#1a1a1a]/60 mb-4">
                        Click "Save & Share" at the top to generate your link.
                      </p>
                      <NeoButton
                        color="bg-[#ff6b9d]"
                        textColor="text-white"
                        onClick={saveAndShare}
                        disabled={saving}
                      >
                        <span className="flex items-center gap-2">
                          {saving ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Link2 className="w-4 h-4" />
                          )}
                          {saving ? 'Saving...' : 'Save & generate link'}
                        </span>
                      </NeoButton>
                    </div>
                  )}
                </Section>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Nav buttons */}
          <div className="flex justify-between mt-4">
            <NeoButton
              size="sm"
              color="bg-white"
              onClick={() => {
                const idx = sectionList.findIndex((s) => s.key === section);
                if (idx > 0) {
                  const prev = sectionList[idx - 1].key;
                  setSection(prev);
                  setExpanded(prev);
                  sfx.click();
                }
              }}
              disabled={section === 'template'}
            >
              <span className="flex items-center gap-1">
                <ChevronUp className="w-4 h-4" /> Back
              </span>
            </NeoButton>
            <NeoButton
              size="sm"
              color="bg-white"
              onClick={() => {
                const idx = sectionList.findIndex((s) => s.key === section);
                if (idx < sectionList.length - 1) {
                  const next = sectionList[idx + 1].key;
                  setSection(next);
                  setExpanded(next);
                  sfx.click();
                }
              }}
              disabled={section === 'share'}
            >
              <span className="flex items-center gap-1">
                Next <ChevronDown className="w-4 h-4" />
              </span>
            </NeoButton>
          </div>
        </main>
      </div>
    </div>
  );
}

function Section({
  title,
  icon: Icon,
  children,
}: {
  title: string;
  icon: typeof Type;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-[#fff8d6] border-[3px] border-[#1a1a1a] shadow-[2px_2px_0_#1a1a1a] flex items-center justify-center">
          <Icon className="w-5 h-5 text-[#1a1a1a]" />
        </div>
        <h2 className="font-display font-bold text-2xl text-[#1a1a1a]">{title}</h2>
      </div>
      <div className="space-y-4">{children}</div>
    </div>
  );
}

function SubSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(true);
  return (
    <div className="rounded-xl border-[2px] border-[#1a1a1a]/15 overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-4 py-3 bg-[#f5f0e6] font-display font-bold text-[#1a1a1a]"
      >
        {title}
        {open ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
      </button>
      {open && <div className="p-4 space-y-3">{children}</div>}
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="block font-display font-bold text-sm text-[#1a1a1a] mb-1.5">
        {label}
      </span>
      {children}
    </label>
  );
}

function TextInput({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full px-4 py-2.5 rounded-lg border-[2px] border-[#1a1a1a]/20 font-display text-sm focus:border-[#ff6b9d] focus:outline-none transition-colors"
    />
  );
}

function TextArea({
  value,
  onChange,
  placeholder,
  rows = 4,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  rows?: number;
}) {
  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      rows={rows}
      className="w-full px-4 py-2.5 rounded-lg border-[2px] border-[#1a1a1a]/20 font-display text-sm focus:border-[#ff6b9d] focus:outline-none transition-colors resize-y"
    />
  );
}
