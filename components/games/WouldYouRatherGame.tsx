'use client';

import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { Sparkles, RefreshCw, Share2, Heart, Check, ArrowRight } from 'lucide-react';
import { sfx } from '@/lib/audio';
import ShareModal from '@/components/common/ShareModal';

const WOULD_YOU_RATHER_QUESTIONS = [
  {
    optA: 'Live in a cozy penthouse in Paris overlooking the Eiffel Tower 🗼',
    optB: 'Live in a secluded seaside villa in Amalfi with private beach access 🌊',
  },
  {
    optA: 'Have your partner cook you a 5-star dinner every single evening 🍝',
    optB: 'Have your partner bring you fresh coffee & breakfast in bed every morning ☕',
  },
  {
    optA: 'Go on a wild 14-day backpacking adventure across Japanese mountains 🗻',
    optB: 'Relax in an all-inclusive 5-star overwater bungalow in the Maldives 🏝️',
  },
  {
    optA: 'Never have an argument last longer than 5 minutes again 🕊️',
    optB: 'Always know intuitively the exact gift or comfort they need 🎁',
  },
  {
    optA: 'Slow dance under a starry night sky with your favorite song playing 🌌',
    optB: 'Laugh uncontrollably together until your stomach hurts at midnight 🍕',
  },
];

export default function WouldYouRatherGame() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [choices, setChoices] = useState<string[]>([]);
  const [isFinished, setIsFinished] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);

  const handleChoose = (choice: string) => {
    sfx.playPop();
    const updated = [...choices, choice];
    setChoices(updated);

    if (currentIndex < WOULD_YOU_RATHER_QUESTIONS.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setIsFinished(true);
      sfx.playCelebration();
      confetti({
        particleCount: 50,
        spread: 65,
        origin: { y: 0.6 },
        colors: ['#f43f5e', '#ec4899', '#fda4af', '#a855f7'],
      });
    }
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setChoices([]);
    setIsFinished(false);
    sfx.playPop();
  };

  const currentQ = WOULD_YOU_RATHER_QUESTIONS[currentIndex];

  return (
    <div className="w-full max-w-xl mx-auto rounded-3xl border border-rose-500/25 bg-[#160918]/85 p-6 sm:p-8 shadow-2xl backdrop-blur-2xl text-center space-y-6">
      <div className="inline-flex items-center gap-2 text-xs font-semibold text-rose-400 uppercase tracking-widest">
        <Sparkles className="h-3.5 w-3.5" />
        <span>Couple Edition</span>
        <Sparkles className="h-3.5 w-3.5" />
      </div>

      <div className="space-y-1">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Would You Rather?
        </h2>
        <p className="text-xs sm:text-sm text-rose-300/70">
          Make tough romantic choices and compare answers with your partner
        </p>
      </div>

      {!isFinished ? (
        <div className="space-y-6">
          <div className="flex items-center justify-between text-xs text-rose-400 font-mono">
            <span>Dilemma {currentIndex + 1} of {WOULD_YOU_RATHER_QUESTIONS.length}</span>
            <span>{Math.round(((currentIndex + 1) / WOULD_YOU_RATHER_QUESTIONS.length) * 100)}%</span>
          </div>

          <div className="space-y-3">
            <button
              onClick={() => handleChoose(currentQ.optA)}
              className="w-full p-5 rounded-2xl border border-rose-500/30 bg-rose-950/40 hover:bg-rose-900/50 hover:border-rose-400 text-white font-medium text-sm sm:text-base transition-all active:scale-[0.98] shadow-md text-left"
            >
              <span className="text-xs font-bold text-rose-400 block mb-1 uppercase tracking-wider">Option A</span>
              {currentQ.optA}
            </button>

            <div className="flex items-center justify-center">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-rose-600/30 text-rose-300 text-xs font-bold font-mono">
                OR
              </span>
            </div>

            <button
              onClick={() => handleChoose(currentQ.optB)}
              className="w-full p-5 rounded-2xl border border-rose-500/30 bg-rose-950/40 hover:bg-rose-900/50 hover:border-rose-400 text-white font-medium text-sm sm:text-base transition-all active:scale-[0.98] shadow-md text-left"
            >
              <span className="text-xs font-bold text-rose-400 block mb-1 uppercase tracking-wider">Option B</span>
              {currentQ.optB}
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-6 animate-fadeIn">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-tr from-rose-500 to-pink-500 text-white shadow-xl shadow-rose-500/40">
            <Heart className="h-10 w-10 fill-white" />
          </div>

          <div>
            <h3 className="text-xl sm:text-2xl font-bold text-white">
              Your Romantic Blueprint ✨
            </h3>
            <p className="text-xs sm:text-sm text-rose-300/80 mt-1">
              Send this to your partner and see how many choices you agree on!
            </p>
          </div>

          <div className="rounded-2xl border border-rose-500/20 bg-rose-950/20 p-4 text-left space-y-2.5 max-h-52 overflow-y-auto">
            {choices.map((c, i) => (
              <div key={i} className="flex items-start gap-2 text-xs text-rose-100">
                <Check className="h-3.5 w-3.5 text-rose-400 shrink-0 mt-0.5" />
                <span>{c}</span>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={() => setIsShareOpen(true)}
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-rose-600 via-rose-500 to-pink-600 px-5 py-2.5 text-xs sm:text-sm font-semibold text-white shadow-lg shadow-rose-600/30 hover:brightness-110 active:scale-95 transition-all"
            >
              <Share2 className="h-4 w-4" />
              <span>Share My Choices</span>
            </button>

            <button
              onClick={handleRestart}
              className="flex items-center gap-1.5 rounded-xl border border-rose-500/30 bg-rose-950/40 px-4 py-2.5 text-xs sm:text-sm font-medium text-rose-200 hover:text-white transition-all active:scale-95"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              <span>Restart Game</span>
            </button>
          </div>
        </div>
      )}

      {/* Share Modal */}
      <ShareModal
        isOpen={isShareOpen}
        onClose={() => setIsShareOpen(false)}
        url="/#games"
        title="Would You Rather Couple Answers"
        names="My Romantic Choices"
        subtitle="Can your partner match your exact romantic blueprint?"
        theme="pink_glow"
      />
    </div>
  );
}
