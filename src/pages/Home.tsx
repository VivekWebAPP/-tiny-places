import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Sparkles, Heart, Gift, ArrowRight, Wand2 } from 'lucide-react';
import { NeoButton } from '@/components/NeoButton';

export default function Home() {
  return (
    <div className="min-h-screen bg-[#fff8d6] paper-texture flex flex-col items-center">
      {/* Nav */}
      <nav className="w-full max-w-5xl px-6 py-5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-xl bg-[#ffd23f] border-[3px] border-[#1a1a1a] shadow-[3px_3px_0_#1a1a1a] flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-[#1a1a1a]" />
          </div>
          <span className="font-display font-bold text-xl text-[#1a1a1a]">tiny places</span>
        </div>
        <Link to="/create">
          <NeoButton size="sm" color="bg-[#ffd23f]">
            Start Creating
          </NeoButton>
        </Link>
      </nav>

      {/* Hero */}
      <section className="flex-1 flex flex-col items-center justify-center text-center px-6 py-12 max-w-3xl">
        <motion.div
          initial={{ scale: 0, rotate: -20 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15 }}
          className="mb-6"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border-[3px] border-[#1a1a1a] shadow-[3px_3px_0_#1a1a1a]">
            <Heart className="w-4 h-4 text-[#ff6b9d]" fill="#ff6b9d" />
            <span className="font-display font-bold text-sm text-[#1a1a1a]">
              interactive micro-sites for people you love
            </span>
          </div>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="font-display font-bold text-5xl md:text-7xl text-[#1a1a1a] leading-[1.05] tracking-tight"
        >
          Build a tiny place
          <br />
          <span className="text-[#ff6b9d]">on the internet</span>
          <br />
          for someone.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-6 text-lg md:text-xl text-[#6b5d3e] font-display max-w-xl"
        >
          Create interactive animated micro-sites — greeting cards, proposals,
          apologies, friendship presentations — with games, reveals, and a
          handwritten note. Then share one link.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-10 flex flex-col sm:flex-row gap-4"
        >
          <Link to="/create">
            <NeoButton size="lg" color="bg-[#ff6b9d]" textColor="text-white">
              <span className="flex items-center gap-2">
                <Wand2 className="w-5 h-5" />
                Create a card
              </span>
            </NeoButton>
          </Link>
          <Link to="/create">
            <NeoButton size="lg" color="bg-white">
              <span className="flex items-center gap-2">
                See templates
                <ArrowRight className="w-5 h-5" />
              </span>
            </NeoButton>
          </Link>
        </motion.div>
      </section>

      {/* Feature cards */}
      <section className="w-full max-w-5xl px-6 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className={`p-6 rounded-2xl border-[3px] border-[#1a1a1a] shadow-[5px_5px_0_#1a1a1a] ${f.bg}`}
            >
              <div className="w-12 h-12 rounded-xl bg-white border-[3px] border-[#1a1a1a] shadow-[2px_2px_0_#1a1a1a] flex items-center justify-center mb-4">
                <f.icon className="w-6 h-6 text-[#1a1a1a]" />
              </div>
              <h3 className="font-display font-bold text-xl text-[#1a1a1a] mb-2">
                {f.title}
              </h3>
              <p className="font-display text-[#1a1a1a]/70">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Templates strip */}
      <section className="w-full max-w-5xl px-6 pb-20">
        <h2 className="font-display font-bold text-3xl text-[#1a1a1a] mb-6 text-center">
          Pick a vibe
        </h2>
        <div className="flex flex-wrap justify-center gap-3">
          {templateChips.map((t) => (
            <Link key={t.name} to="/create">
              <motion.div
                whileHover={{ y: -3, rotate: -1 }}
                whileTap={{ scale: 0.95 }}
                className={`px-5 py-3 rounded-xl border-[3px] border-[#1a1a1a] shadow-[3px_3px_0_#1a1a1a] ${t.bg} cursor-pointer`}
              >
                <span className="text-2xl mr-2">{t.emoji}</span>
                <span className="font-display font-bold text-[#1a1a1a]">
                  {t.name}
                </span>
              </motion.div>
            </Link>
          ))}
        </div>
      </section>

      <footer className="w-full py-8 text-center text-[#6b5d3e] font-display">
        <p className="flex items-center justify-center gap-2">
          Made with <Heart className="w-4 h-4 text-[#ff6b9d]" fill="#ff6b9d" /> for people who matter
        </p>
      </footer>
    </div>
  );
}

const features = [
  {
    icon: Wand2,
    title: 'Step-by-step builder',
    desc: 'Customize every slide, game, and reveal. No code, just vibes.',
    bg: 'bg-[#fff3b0]',
  },
  {
    icon: Gift,
    title: 'Interactive exhibits',
    desc: 'Scratch cards, slide locks, curtains, word searches, contracts.',
    bg: 'bg-[#ffc2d4]',
  },
  {
    icon: Sparkles,
    title: 'Share one link',
    desc: 'Send a single URL. They open it and go on an interactive journey.',
    bg: 'bg-[#d4c2ff]',
  },
];

const templateChips = [
  { name: 'Friendship Day', emoji: '🤝', bg: 'bg-[#fff3b0]' },
  { name: 'Proposal', emoji: '💍', bg: 'bg-[#ffc2d4]' },
  { name: "Valentine's", emoji: '💘', bg: 'bg-[#ffd0b0]' },
  { name: 'Apology', emoji: '🙏', bg: 'bg-[#b8dfff]' },
  { name: 'Birthday', emoji: '🎂', bg: 'bg-[#b8e8c8]' },
];
