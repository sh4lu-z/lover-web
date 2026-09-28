'use client';

import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { Sparkles, Trophy, CheckCircle2, XCircle, RefreshCw, Heart } from 'lucide-react';
import { sfx } from '@/lib/audio';

interface EmojiRiddle {
  emojis: string;
  hint: string;
  options: string[];
  correct: number;
}

const RIDDLES: EmojiRiddle[] = [
  {
    emojis: '🚢 ❄️ 💎 🚪 🎻',
    hint: 'A legendary 1997 romance drama on the high seas',
    options: ['Titanic', 'The Notebook', 'Cast Away', 'Pirates of the Caribbean'],
    correct: 0,
  },
  {
    emojis: '🌧️ 💌 🦢 👴 👵',
    hint: '“If you’re a bird, I’m a bird”',
    options: ['La La Land', 'The Notebook', 'Pride and Prejudice', 'About Time'],
    correct: 1,
  },
  {
    emojis: '🎹 💃 🌆 🎺 💔',
    hint: 'An aspiring actress and a jazz musician in Los Angeles',
    options: ['Midnight in Paris', 'A Star Is Born', 'La La Land', 'Before Sunrise'],
    correct: 2,
  },
  {
    emojis: '🥀 🕰️ 🏰 ☕ 👹',
    hint: 'A tale as old as time',
    options: ['Beauty and the Beast', 'Cinderella', 'Sleeping Beauty', 'Shrek'],
    correct: 0,
  },
  {
    emojis: '✈️ 🕰️ 🚆 ☕ 🇦🇹',
    hint: 'Two strangers meet on a train and wander Vienna together',
    options: ['Before Sunrise', 'Eat Pray Love', 'Letters to Juliet', 'Roman Holiday'],
    correct: 0,
  },
];

export default function EmojiLoveQuiz() {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [isFinished, setIsFinished] = useState(false);

  const riddle = RIDDLES[currentIdx];

  const handleSelect = (idx: number) => {
    sfx.playPop();
    const updated = { ...selectedAnswers, [currentIdx]: idx };
    setSelectedAnswers(updated);

    if (currentIdx < RIDDLES.length - 1) {
      setTimeout(() => setCurrentIdx((c) => c + 1), 350);
    } else {
      setTimeout(() => {
        setIsFinished(true);
        sfx.playCelebration();
        confetti({
          particleCount: 40,
          spread: 60,
          origin: { y: 0.6 },
          colors: ['#f43f5e', '#ec4899', '#fda4af', '#fde047'],
        });
      }, 400);
    }
  };

  const handleRestart = () => {
    setCurrentIdx(0);
    setSelectedAnswers({});
    setIsFinished(false);
    sfx.playPop();
  };

  const score = Object.entries(selectedAnswers).reduce((acc, [qIdx, ans]) => {
    return ans === RIDDLES[Number(qIdx)].correct ? acc + 1 : acc;
  }, 0);

  return (
    <div className="w-full max-w-xl mx-auto rounded-3xl border border-rose-500/25 bg-[#160918]/85 p-6 sm:p-8 shadow-2xl backdrop-blur-2xl text-center space-y-6">
      <div className="inline-flex items-center gap-2 text-xs font-semibold text-rose-400 uppercase tracking-widest">
        <Sparkles className="h-3.5 w-3.5 text-rose-400" />
        <span>Emoji Love Trivia</span>
        <Sparkles className="h-3.5 w-3.5 text-rose-400" />
      </div>

      <div className="space-y-1">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Guess The Romance Movie!
        </h2>
        <p className="text-xs sm:text-sm text-rose-300/70">
          Decipher iconic love stories through emoji clues
        </p>
      </div>

      {!isFinished ? (
        <div className="space-y-6">
          <div className="flex items-center justify-between text-xs text-rose-400 font-mono">
            <span>Riddle {currentIdx + 1} of {RIDDLES.length}</span>
            <span>Score: {score}</span>
          </div>

          {/* Emoji Clue Display */}
          <div className="rounded-2xl border border-rose-500/30 bg-rose-950/40 p-6 sm:p-8 text-center space-y-2">
            <span className="text-4xl sm:text-5xl tracking-widest block py-2 select-none animate-gentle-pulse">
              {riddle.emojis}
            </span>
            <p className="text-xs text-rose-300/80 italic">
              Hint: &ldquo;{riddle.hint}&rdquo;
            </p>
          </div>

          {/* Options */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left">
            {riddle.options.map((opt, i) => (
              <button
                key={i}
                onClick={() => handleSelect(i)}
                className="p-4 rounded-xl border border-rose-500/20 bg-rose-950/30 hover:border-rose-400 hover:bg-rose-900/40 text-sm font-medium text-white transition-all active:scale-95"
              >
                {opt}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="space-y-6 animate-fadeIn">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-tr from-rose-600 via-rose-500 to-pink-500 text-white shadow-xl shadow-rose-600/40">
            <Trophy className="h-10 w-10" />
          </div>

          <div>
            <h3 className="text-2xl font-black text-white">
              {score >= 4 ? 'Rom-Com Encyclopedic Genius! 🎬💖' : 'Great Effort! Time for a Movie Marathon 🍿'}
            </h3>
            <p className="text-xs sm:text-sm text-rose-200/80 mt-1">
              You scored <span className="font-bold text-white text-base">{score} / {RIDDLES.length}</span> correct answers!
            </p>
          </div>

          <div className="flex justify-center pt-2">
            <button
              onClick={handleRestart}
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-rose-600 to-pink-600 px-6 py-2.5 text-xs sm:text-sm font-bold text-white shadow-lg hover:brightness-110 active:scale-95 transition-all"
            >
              <RefreshCw className="h-4 w-4" />
              <span>Play Again</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
