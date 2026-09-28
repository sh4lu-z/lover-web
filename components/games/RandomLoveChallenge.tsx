'use client';

import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { Sparkles, Trophy, Shuffle, Check, Clock, Heart } from 'lucide-react';
import { sfx } from '@/lib/audio';

interface Challenge {
  id: string;
  title: string;
  desc: string;
  timeLimit: string;
  reward: string;
}

const CHALLENGES: Challenge[] = [
  {
    id: 'c1',
    title: 'The 3-Photo Memory Hunt',
    desc: 'Find 3 candid photos on your phone that capture their most radiant smile, their goofiest face, and your favorite memory together. Send them right now!',
    timeLimit: '2 Minutes',
    reward: 'Endless hugs + smile guarantee',
  },
  {
    id: 'c2',
    title: 'The Secret Stash Love Note',
    desc: 'Write a tiny handwritten note saying “You are my favorite person on earth” and hide it inside their bag, jacket pocket, or book where they will find it later.',
    timeLimit: '3 Minutes',
    reward: 'A sweet future surprise gasp',
  },
  {
    id: 'c3',
    title: 'The 30-Second Forehead Kiss & Gaze',
    desc: 'Drop whatever you are doing, walk over, give a soft forehead kiss, and gently hold their hands for 30 seconds without saying a single word.',
    timeLimit: '30 Seconds',
    reward: 'Pure oxytocin & calm heartbeat',
  },
  {
    id: 'c4',
    title: 'The Nostalgic Song Dedication',
    desc: 'Find the song that played on your first roadtrip or date. Put it on the speaker, grab their waist, and slow dance in the living room or kitchen.',
    timeLimit: '3 Minutes',
    reward: 'Butterflies all over again',
  },
  {
    id: 'c5',
    title: 'The Midnight Snack Treaty',
    desc: 'Order or sneak into the kitchen to prepare their all-time favorite midnight craving with a cute message drawn on the napkin.',
    timeLimit: '10 Minutes',
    reward: 'Top tier partner certification',
  },
];

export default function RandomLoveChallenge() {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [completed, setCompleted] = useState<string[]>([]);
  const current = CHALLENGES[currentIdx];

  const handleNext = () => {
    sfx.playChime();
    setCurrentIdx((prev) => (prev + 1) % CHALLENGES.length);
  };

  const handleDone = () => {
    sfx.playCelebration();
    if (!completed.includes(current.id)) {
      setCompleted([...completed, current.id]);
    }
    confetti({
      particleCount: 40,
      spread: 60,
      origin: { y: 0.6 },
      colors: ['#f43f5e', '#ec4899', '#fda4af', '#fde047'],
    });
  };

  const isDone = completed.includes(current.id);

  return (
    <div className="w-full max-w-xl mx-auto rounded-3xl border border-rose-500/25 bg-[#160918]/85 p-6 sm:p-8 shadow-2xl backdrop-blur-2xl text-center space-y-6">
      <div className="inline-flex items-center gap-2 text-xs font-semibold text-rose-400 uppercase tracking-widest">
        <Trophy className="h-3.5 w-3.5 text-rose-400" />
        <span>Daily Romance Mission</span>
        <Sparkles className="h-3.5 w-3.5 text-rose-400" />
      </div>

      <div className="space-y-1">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Random Love Challenge
        </h2>
        <p className="text-xs sm:text-sm text-rose-300/70">
          Tiny romantic adventures to spark spontaneous joy right now
        </p>
      </div>

      {/* Challenge Card */}
      <div className="rounded-2xl border border-rose-500/30 bg-gradient-to-b from-rose-950/50 to-rose-950/20 p-6 text-left space-y-3">
        <div className="flex items-center justify-between text-xs text-rose-400 font-mono">
          <span className="flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" />
            <span>Time: {current.timeLimit}</span>
          </span>
          <span className="text-[10px] font-bold uppercase text-amber-300">
            Mission #{currentIdx + 1}
          </span>
        </div>

        <h3 className="text-lg sm:text-xl font-bold text-white">
          {current.title}
        </h3>

        <p className="text-xs sm:text-sm text-rose-200/90 leading-relaxed">
          {current.desc}
        </p>

        <div className="rounded-xl border border-rose-500/15 bg-rose-950/30 p-3 text-xs text-rose-300 flex items-center gap-2">
          <Heart className="h-4 w-4 text-rose-400 fill-rose-400 shrink-0" />
          <span>Reward: <strong>{current.reward}</strong></span>
        </div>
      </div>

      {/* Action controls */}
      <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
        <button
          onClick={handleDone}
          className={`flex items-center gap-2 rounded-xl px-5 py-2.5 text-xs sm:text-sm font-bold text-white shadow-lg transition-all ${
            isDone
              ? 'bg-emerald-600'
              : 'bg-gradient-to-r from-rose-600 to-pink-600 hover:brightness-110 active:scale-95 shadow-rose-600/30'
          }`}
        >
          <Check className="h-4 w-4" />
          <span>{isDone ? 'Mission Completed! ✨' : 'Accept & Mark Done!'}</span>
        </button>

        <button
          onClick={handleNext}
          className="flex items-center gap-1.5 rounded-xl border border-rose-500/30 bg-rose-950/40 px-4 py-2.5 text-xs sm:text-sm font-semibold text-rose-200 hover:text-white transition-all active:scale-95"
        >
          <Shuffle className="h-3.5 w-3.5" />
          <span>Spin Next Challenge</span>
        </button>
      </div>
    </div>
  );
}
