'use client';

import React, { useState } from 'react';
import { Flame, RefreshCw } from 'lucide-react';
import { sfx } from '@/lib/audio';
import confetti from 'canvas-confetti';

const QUESTIONS = [
  "Never have I ever checked my partner's phone without them knowing.",
  "Never have I ever pretended to like a gift from my partner.",
  "Never have I ever forgotten an important anniversary.",
  "Never have I ever accidentally said the wrong name in bed.",
  "Never have I ever stalked my partner's ex on social media.",
  "Never have I ever lied about my body count.",
  "Never have I ever secretly thrown away my partner's clothing.",
  "Never have I ever fallen asleep during a movie my partner really wanted to watch.",
  "Never have I ever faked being sick to get out of a date.",
  "Never have I ever had a crush on one of my partner's friends.",
  "Never have I ever practiced an argument in the shower.",
  "Never have I ever eaten my partner's leftover food and lied about it."
];

export default function NeverHaveIEver() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [questions] = useState(() => [...QUESTIONS].sort(() => Math.random() - 0.5));
  const [animating, setAnimating] = useState(false);

  const nextQuestion = () => {
    sfx.playDodge();
    setAnimating(true);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % questions.length);
      setAnimating(false);
    }, 300);
  };

  const handleConfession = () => {
    sfx.playCelebration();
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.6 },
      colors: ['#ef4444', '#f97316', '#eab308']
    });
    nextQuestion();
  };

  return (
    <div className="flex flex-col items-center justify-center p-6 sm:p-10 w-full max-w-2xl mx-auto">
      <div className="text-center mb-10">
        <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center justify-center gap-2">
          <Flame className="h-7 w-7 text-orange-500" />
          Never Have I Ever
        </h2>
        <p className="text-sm text-rose-200/70 mt-2">The spicy couples edition. Be honest!</p>
      </div>

      <div className={`w-full bg-[#1a0b16]/80 backdrop-blur-md border border-orange-500/20 rounded-3xl p-8 sm:p-12 text-center shadow-xl transition-all duration-300 ${animating ? 'scale-95 opacity-0' : 'scale-100 opacity-100'}`}>
        <p className="text-orange-400 font-bold text-sm tracking-widest uppercase mb-4">Question {currentIndex + 1} of {questions.length}</p>
        <h3 className="text-2xl sm:text-3xl font-bold text-white leading-tight">
          "{questions[currentIndex]}"
        </h3>
      </div>

      <div className="grid grid-cols-2 gap-4 mt-10 w-full sm:max-w-md">
        <button
          onClick={handleConfession}
          className="flex flex-col items-center justify-center gap-2 rounded-2xl bg-gradient-to-br from-orange-500 to-red-600 p-4 text-white shadow-lg hover:brightness-110 active:scale-95 transition-all"
        >
          <span className="text-xl font-black">I Have!</span>
          <span className="text-xs text-white/70">Guilty as charged 😅</span>
        </button>
        
        <button
          onClick={nextQuestion}
          className="flex flex-col items-center justify-center gap-2 rounded-2xl bg-white/10 border border-white/20 p-4 text-white shadow-lg hover:bg-white/20 active:scale-95 transition-all"
        >
          <span className="text-xl font-black">Never</span>
          <span className="text-xs text-white/70">I'm innocent 😇</span>
        </button>
      </div>

      <button
        onClick={nextQuestion}
        className="mt-8 flex items-center gap-2 text-xs font-bold text-rose-300 hover:text-white transition-colors"
      >
        <RefreshCw className="h-3 w-3" />
        <span>Skip Question</span>
      </button>
    </div>
  );
}
