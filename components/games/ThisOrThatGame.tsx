'use client';

import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { Sparkles, RefreshCw, Share2, Heart, Check } from 'lucide-react';
import { sfx } from '@/lib/audio';
import ShareModal from '@/components/common/ShareModal';

const QUESTIONS = [
  { optA: 'Morning Cuddles & Coffee ☕', optB: 'Late-Night Whispers & Star Watching 🌌' },
  { optA: 'Cook an Elaborate Dinner Together 🍝', optB: 'Order Midnight Takeout in Bed 🍕' },
  { optA: 'Spontaneous Unplanned Roadtrip 🚗', optB: 'Cozy Blanket Fort Movie Marathon 🍿' },
  { optA: 'Golden Beach Sunset Walk 🏖️', optB: 'Snowy Cabin with a Fireplace 🏔️' },
  { optA: 'Cute Matching Hoodies 🧸', optB: 'Dressing Up for Candlelight Cocktails 🍸' },
  { optA: 'Slow Dance in the Kitchen 💃', optB: 'Chaotic Karaoke Screaming in the Car 🎤' },
];

export default function ThisOrThatGame() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [choices, setChoices] = useState<string[]>([]);
  const [isFinished, setIsFinished] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);

  const handleChoose = (choice: string) => {
    sfx.playPop();
    const updated = [...choices, choice];
    setChoices(updated);

    if (currentIndex < QUESTIONS.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setIsFinished(true);
      sfx.playCelebration();
      confetti({
        particleCount: 40,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#f43f5e', '#ec4899', '#fda4af'],
      });
    }
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setChoices([]);
    setIsFinished(false);
    sfx.playPop();
  };

  const currentQ = QUESTIONS[currentIndex];

  return (
    <div className="w-full max-w-xl mx-auto rounded-3xl border border-rose-500/25 bg-[#160918]/85 p-6 sm:p-8 shadow-2xl backdrop-blur-2xl text-center space-y-6">
      <div className="inline-flex items-center gap-2 text-xs font-semibold text-rose-400 uppercase tracking-widest">
        <Sparkles className="h-3.5 w-3.5" />
        <span>Couple Edition</span>
        <Sparkles className="h-3.5 w-3.5" />
      </div>

      <div className="space-y-1">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          This or That
        </h2>
        <p className="text-xs sm:text-sm text-rose-300/70">
          Pick your romantic preference and compare your couple chemistry
        </p>
      </div>

      {!isFinished ? (
        <div className="space-y-6">
          <div className="flex items-center justify-between text-xs text-rose-400 font-mono">
            <span>Question {currentIndex + 1} of {QUESTIONS.length}</span>
            <span>{Math.round(((currentIndex + 1) / QUESTIONS.length) * 100)}%</span>
          </div>

          <div className="grid grid-cols-1 gap-3.5">
            <button
              onClick={() => handleChoose(currentQ.optA)}
              className="p-5 rounded-2xl border border-rose-500/30 bg-rose-950/40 hover:bg-rose-900/50 hover:border-rose-400 text-white font-medium text-sm sm:text-base transition-all active:scale-[0.98] shadow-md hover:shadow-rose-600/20 cursor-pointer"
            >
              {currentQ.optA}
            </button>

            <div className="flex items-center justify-center">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-rose-600/30 text-rose-300 text-xs font-bold font-mono">
                OR
              </span>
            </div>

            <button
              onClick={() => handleChoose(currentQ.optB)}
              className="p-5 rounded-2xl border border-rose-500/30 bg-rose-950/40 hover:bg-rose-900/50 hover:border-rose-400 text-white font-medium text-sm sm:text-base transition-all active:scale-[0.98] shadow-md hover:shadow-rose-600/20 cursor-pointer"
            >
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
              Your Romantic Vibe Profile ✨
            </h3>
            <p className="text-xs sm:text-sm text-rose-300/80 mt-1">
              Share this with your partner and challenge them to take the exact same test!
            </p>
          </div>

          {/* Choices summary */}
          <div className="rounded-2xl border border-rose-500/20 bg-rose-950/20 p-4 text-left space-y-2 max-h-48 overflow-y-auto">
            {choices.map((c, i) => (
              <div key={i} className="flex items-center gap-2 text-xs text-rose-100">
                <Check className="h-3.5 w-3.5 text-rose-400 shrink-0" />
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
              <span>Play Again</span>
            </button>
          </div>
        </div>
      )}

      {/* Share Modal */}
      <ShareModal
        isOpen={isShareOpen}
        onClose={() => setIsShareOpen(false)}
        url="/#games"
        title="Couple This or That Results"
        names="My Romantic Choices"
        subtitle="Can your partner match your exact romantic preferences?"
        theme="cute"
      />
    </div>
  );
}
