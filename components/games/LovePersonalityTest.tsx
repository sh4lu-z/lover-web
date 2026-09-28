'use client';

import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { Sparkles, RefreshCw, Share2, Compass, Heart, Award, ArrowRight } from 'lucide-react';
import { sfx } from '@/lib/audio';
import ShareModal from '@/components/common/ShareModal';

interface Archetype {
  title: string;
  badge: string;
  tagline: string;
  traits: string[];
  compatibility: string;
}

const ARCHETYPES: Record<string, Archetype> = {
  anchor: {
    title: 'The Devoted Anchor',
    badge: '⚓ ETERNAL LOYALTY',
    tagline: 'Grounded, warm, endlessly faithful and protective.',
    traits: ['Unshakable loyalty', 'World-class comfort hugs', 'Never forgets small details'],
    compatibility: 'Pairs best with Playful Sparks who bring spontaneous laughter.',
  },
  spark: {
    title: 'The Playful Spark',
    badge: '⚡ ELECTRIC CHARM',
    tagline: 'Spontaneous, hilarious, adventurous and infectious energy.',
    traits: ['Always down for midnight snacks', 'Turns grocery runs into dates', 'Zero dull moments'],
    compatibility: 'Pairs best with Devoted Anchors who provide sweet grounding warmth.',
  },
  poet: {
    title: 'The Gentle Poet',
    badge: '📜 DEEP SOUL',
    tagline: 'Deeply thoughtful, tenderhearted, and deeply romantic.',
    traits: ['Remembers first conversations', 'Leaves handwritten notes', 'Soulful eye contact'],
    compatibility: 'Pairs best with Cosmic Visionaries who value emotional depth.',
  },
  visionary: {
    title: 'The Cosmic Visionary',
    badge: '✨ POWER COUPLE',
    tagline: 'Ambitious, inspiring, dreams big and loves fiercely.',
    traits: ['Encourages your biggest dreams', 'Plans unforgettable trips', 'Loyal ride-or-die'],
    compatibility: 'Pairs best with Gentle Poets who bring peace to chaotic days.',
  },
};

const QUESTIONS = [
  {
    q: 'How do you instinctively show someone they are deeply loved?',
    opts: [
      { text: 'Cooking their favorite comfort meal and making sure they rest', type: 'anchor' },
      { text: 'Whispering inside jokes and whisking them away on a surprise date', type: 'spark' },
      { text: 'Writing heartfelt letters or giving gifts loaded with personal meaning', type: 'poet' },
      { text: 'Supporting their grandest ambitions and standing beside them always', type: 'visionary' },
    ],
  },
  {
    q: 'What is your ideal Saturday evening together?',
    opts: [
      { text: 'Blanket fort, homemade cocoa, and comfortable silence', type: 'anchor' },
      { text: 'Trying that chaotic new Korean street food spot downtown', type: 'spark' },
      { text: 'Candlelight jazz, deep vinyl listening, and stargazing', type: 'poet' },
      { text: 'Cocktails on a skyline terrace dreaming up our next international trip', type: 'visionary' },
    ],
  },
  {
    q: 'When your partner has had an overwhelming day, your first move is:',
    opts: [
      { text: 'Running a hot bath, ordering dinner, and taking all chores off their plate', type: 'anchor' },
      { text: 'Making them laugh until they forget why they were stressed', type: 'spark' },
      { text: 'Holding them tight and listening intently without trying to fix it right away', type: 'poet' },
      { text: 'Reminding them of who they are and planning a solution together', type: 'visionary' },
    ],
  },
];

export default function LovePersonalityTest() {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [scores, setScores] = useState<Record<string, number>>({ anchor: 0, spark: 0, poet: 0, visionary: 0 });
  const [result, setResult] = useState<Archetype | null>(null);
  const [isShareOpen, setIsShareOpen] = useState(false);

  const handleSelect = (type: string) => {
    sfx.playPop();
    const updated = { ...scores, [type]: (scores[type] || 0) + 1 };
    setScores(updated);

    if (currentIdx < QUESTIONS.length - 1) {
      setCurrentIdx((prev) => prev + 1);
    } else {
      // Find top archetype
      let topType = 'anchor';
      let maxScore = -1;
      Object.entries(updated).forEach(([k, v]) => {
        if (v > maxScore) {
          maxScore = v;
          topType = k;
        }
      });

      setResult(ARCHETYPES[topType] || ARCHETYPES.anchor);
      sfx.playCelebration();
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#f43f5e', '#a855f7', '#ec4899', '#fde047'],
      });
    }
  };

  const handleRestart = () => {
    setCurrentIdx(0);
    setScores({ anchor: 0, spark: 0, poet: 0, visionary: 0 });
    setResult(null);
    sfx.playPop();
  };

  const currentQ = QUESTIONS[currentIdx];

  return (
    <div className="w-full max-w-xl mx-auto rounded-3xl border border-rose-500/25 bg-[#160918]/85 p-6 sm:p-8 shadow-2xl backdrop-blur-2xl text-center space-y-6">
      <div className="inline-flex items-center gap-2 text-xs font-semibold text-rose-400 uppercase tracking-widest">
        <Compass className="h-3.5 w-3.5 text-rose-400" />
        <span>Romantic Archetype Quiz</span>
        <Sparkles className="h-3.5 w-3.5 text-rose-400" />
      </div>

      <div className="space-y-1">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Love Personality Test
        </h2>
        <p className="text-xs sm:text-sm text-rose-300/70">
          Discover how your soul navigates affection, chemistry, and romance
        </p>
      </div>

      {!result ? (
        <div className="space-y-6">
          <div className="flex items-center justify-between text-xs text-rose-400 font-mono">
            <span>Question {currentIdx + 1} of {QUESTIONS.length}</span>
            <span>{Math.round(((currentIdx + 1) / QUESTIONS.length) * 100)}%</span>
          </div>

          <div className="h-1.5 w-full bg-rose-950/60 rounded-full overflow-hidden border border-rose-500/15">
            <div 
              className="h-full bg-gradient-to-r from-rose-600 to-pink-500 transition-all duration-300"
              style={{ width: `${((currentIdx + 1) / QUESTIONS.length) * 100}%` }}
            />
          </div>

          <h3 className="text-lg sm:text-xl font-bold text-white text-left">
            {currentQ.q}
          </h3>

          <div className="space-y-2.5 pt-1 text-left">
            {currentQ.opts.map((opt, i) => (
              <button
                key={i}
                onClick={() => handleSelect(opt.type)}
                className="w-full p-4 rounded-2xl border border-rose-500/20 bg-rose-950/30 hover:border-rose-400 hover:bg-rose-900/40 text-rose-100 text-sm font-medium transition-all active:scale-[0.99] flex items-center justify-between group"
              >
                <span>{opt.text}</span>
                <ArrowRight className="h-4 w-4 text-rose-400 opacity-0 group-hover:opacity-100 transition-opacity shrink-0 ml-2" />
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="space-y-6 animate-fadeIn">
          <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-tr from-rose-600 via-rose-500 to-pink-500 text-white shadow-xl shadow-rose-600/40">
            <Award className="h-12 w-12" />
          </div>

          <div>
            <span className="text-xs font-mono font-bold text-rose-400 tracking-widest block mb-1">
              {result.badge}
            </span>
            <h3 className="text-2xl sm:text-3xl font-black text-white">
              {result.title}
            </h3>
            <p className="text-sm font-medium text-rose-200/90 italic mt-1">
              &ldquo;{result.tagline}&rdquo;
            </p>
          </div>

          <div className="rounded-2xl border border-rose-500/20 bg-rose-950/20 p-5 text-left space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-rose-300 block">
              Core Romantic Superpowers
            </span>
            <ul className="space-y-1.5 text-xs text-rose-200">
              {result.traits.map((t, idx) => (
                <li key={idx} className="flex items-center gap-2">
                  <Heart className="h-3.5 w-3.5 text-rose-400 fill-rose-400 shrink-0" />
                  <span>{t}</span>
                </li>
              ))}
            </ul>
            <div className="border-t border-rose-500/15 pt-2 text-xs text-rose-300/80 italic">
              ❤️ {result.compatibility}
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={() => setIsShareOpen(true)}
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-rose-600 via-rose-500 to-pink-600 px-5 py-2.5 text-xs sm:text-sm font-semibold text-white shadow-lg shadow-rose-600/30 hover:brightness-110 active:scale-95 transition-all"
            >
              <Share2 className="h-4 w-4" />
              <span>Share My Archetype</span>
            </button>

            <button
              onClick={handleRestart}
              className="flex items-center gap-1.5 rounded-xl border border-rose-500/30 bg-rose-950/40 px-4 py-2.5 text-xs sm:text-sm font-medium text-rose-200 hover:text-white transition-all active:scale-95"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              <span>Retake Test</span>
            </button>
          </div>
        </div>
      )}

      {/* Share Modal */}
      {result && (
        <ShareModal
          isOpen={isShareOpen}
          onClose={() => setIsShareOpen(false)}
          url="/#games"
          title={`My Love Personality: ${result.title}`}
          names={result.title}
          subtitle={result.tagline}
          theme="romantic"
        />
      )}
    </div>
  );
}
