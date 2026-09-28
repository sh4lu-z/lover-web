'use client';

import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { Sparkles, RefreshCw, Flame, Heart, CheckCircle2, Shuffle } from 'lucide-react';
import { sfx } from '@/lib/audio';

interface Prompt {
  type: 'truth' | 'dare';
  category: 'sweet' | 'romantic' | 'spicy';
  text: string;
}

const PROMPTS: Prompt[] = [
  // Sweet
  { type: 'truth', category: 'sweet', text: 'What was the exact moment you realized you had real feelings for me?' },
  { type: 'dare', category: 'sweet', text: 'Give me a 30-second hug and whisper 3 things you love about my face.' },
  { type: 'truth', category: 'sweet', text: 'What is your favorite inside joke between the two of us?' },
  { type: 'dare', category: 'sweet', text: 'Show me the single favorite photo of me on your phone right now.' },
  // Romantic
  { type: 'truth', category: 'romantic', text: 'If you could relive one single day from our relationship, which one would it be?' },
  { type: 'dare', category: 'romantic', text: 'Look into my eyes for 45 full seconds without laughing or looking away.' },
  { type: 'truth', category: 'romantic', text: 'What song immediately makes you think of me whenever it plays?' },
  { type: 'dare', category: 'romantic', text: 'Slow dance with me to an imaginary romantic song right where we are.' },
  // Spicy / Playful
  { type: 'truth', category: 'spicy', text: 'What outfit or look of mine drives you completely crazy?' },
  { type: 'dare', category: 'spicy', text: 'Give me a slow, gentle neck kiss and tell me your favorite fantasy.' },
  { type: 'truth', category: 'spicy', text: 'Where is the most adventurous place you would ever want to kiss me?' },
  { type: 'dare', category: 'spicy', text: 'Give me a 2-minute relaxing shoulder or hand massage without stopping.' },
];

export default function TruthOrDareGame() {
  const [selectedCategory, setSelectedCategory] = useState<'sweet' | 'romantic' | 'spicy'>('romantic');
  const [selectedType, setSelectedType] = useState<'truth' | 'dare'>('truth');
  const [currentPrompt, setCurrentPrompt] = useState<Prompt>(PROMPTS[4]);
  const [isFlipping, setIsFlipping] = useState(false);
  const [completedCount, setCompletedCount] = useState(0);

  const filterPrompts = PROMPTS.filter(
    (p) => p.category === selectedCategory && p.type === selectedType
  );

  const drawNext = () => {
    setIsFlipping(true);
    sfx.playChime();

    setTimeout(() => {
      const candidates = filterPrompts.length > 0 ? filterPrompts : PROMPTS;
      const randomIdx = Math.floor(Math.random() * candidates.length);
      setCurrentPrompt(candidates[randomIdx]);
      setIsFlipping(false);
      sfx.playPop();
    }, 280);
  };

  const handleComplete = () => {
    sfx.playCelebration();
    setCompletedCount((prev) => prev + 1);
    confetti({
      particleCount: 30,
      spread: 50,
      origin: { y: 0.7 },
      colors: ['#f43f5e', '#ec4899', '#fda4af'],
    });
    drawNext();
  };

  return (
    <div className="w-full max-w-xl mx-auto rounded-3xl border border-rose-500/25 bg-[#160918]/85 p-6 sm:p-8 shadow-2xl backdrop-blur-2xl text-center space-y-6">
      <div className="inline-flex items-center gap-2 text-xs font-semibold text-rose-400 uppercase tracking-widest">
        <Flame className="h-3.5 w-3.5 text-rose-400" />
        <span>Couple Truth or Dare</span>
        <Sparkles className="h-3.5 w-3.5 text-rose-400" />
      </div>

      <div className="space-y-1">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Heart to Heart Challenges
        </h2>
        <p className="text-xs sm:text-sm text-rose-300/70">
          Uncover secret thoughts and share playful romantic moments
        </p>
      </div>

      {/* Category selector */}
      <div className="flex flex-wrap items-center justify-center gap-2">
        {[
          { id: 'sweet', label: 'Sweet & Cozy 🍯' },
          { id: 'romantic', label: 'Deep Romance 🌹' },
          { id: 'spicy', label: 'Playful & Spicy 🔥' },
        ].map((c) => (
          <button
            key={c.id}
            onClick={() => {
              setSelectedCategory(c.id as 'sweet' | 'romantic' | 'spicy');
              sfx.playPop();
            }}
            className={`px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all ${
              selectedCategory === c.id
                ? 'border-rose-400 bg-rose-600 text-white shadow'
                : 'border-rose-500/20 bg-rose-950/30 text-rose-300 hover:text-white'
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      {/* Mode toggle: Truth vs Dare */}
      <div className="flex items-center justify-center gap-2 max-w-xs mx-auto p-1 bg-rose-950/40 rounded-xl border border-rose-500/15">
        <button
          onClick={() => {
            setSelectedType('truth');
            sfx.playPop();
          }}
          className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
            selectedType === 'truth' ? 'bg-rose-600 text-white shadow' : 'text-rose-300 hover:text-white'
          }`}
        >
          Truth 💭
        </button>
        <button
          onClick={() => {
            setSelectedType('dare');
            sfx.playPop();
          }}
          className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
            selectedType === 'dare' ? 'bg-rose-600 text-white shadow' : 'text-rose-300 hover:text-white'
          }`}
        >
          Dare ⚡
        </button>
      </div>

      {/* The Prompt Card */}
      <div
        className={`rounded-2xl border-2 border-rose-500/30 bg-gradient-to-b from-[#2a0e28] to-[#160618] p-6 sm:p-8 text-center min-h-[160px] flex flex-col items-center justify-center transition-all ${
          isFlipping ? 'scale-95 opacity-50 blur-[1px]' : 'scale-100 opacity-100'
        }`}
      >
        <span className="text-[11px] font-mono uppercase font-bold tracking-widest text-rose-400 mb-2">
          {currentPrompt.type === 'truth' ? 'Your Truth Question' : 'Your Romantic Dare'}
        </span>
        <p className="text-base sm:text-lg font-bold text-white leading-relaxed max-w-md">
          &ldquo;{currentPrompt.text}&rdquo;
        </p>
      </div>

      {/* Control Buttons */}
      <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
        <button
          onClick={handleComplete}
          className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 px-5 py-2.5 text-xs sm:text-sm font-bold text-white shadow-lg shadow-emerald-600/30 hover:brightness-110 active:scale-95 transition-all"
        >
          <CheckCircle2 className="h-4 w-4" />
          <span>Completed! (+1)</span>
        </button>

        <button
          onClick={drawNext}
          className="flex items-center gap-1.5 rounded-xl border border-rose-500/30 bg-rose-950/40 px-4 py-2.5 text-xs sm:text-sm font-semibold text-rose-200 hover:text-white transition-all active:scale-95"
        >
          <Shuffle className="h-3.5 w-3.5" />
          <span>Draw Another</span>
        </button>
      </div>

      <div className="text-xs text-rose-400/60 font-mono">
        Completed today: <span className="font-bold text-rose-200">{completedCount}</span> challenges
      </div>
    </div>
  );
}
