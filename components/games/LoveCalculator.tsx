'use client';

import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { Heart, Sparkles, RefreshCw, Share2, Flame, Shield, Laugh, Compass } from 'lucide-react';
import { sfx } from '@/lib/audio';
import ShareModal from '@/components/common/ShareModal';

export default function LoveCalculator() {
  const [name1, setName1] = useState('');
  const [name2, setName2] = useState('');
  const [isCalculating, setIsCalculating] = useState(false);
  const [result, setResult] = useState<{
    score: number;
    verdict: string;
    passion: number;
    trust: number;
    humor: number;
    romance: number;
  } | null>(null);
  const [isShareOpen, setIsShareOpen] = useState(false);

  // Deterministic yet fun calculation based on names
  const calculateCompatibility = () => {
    if (!name1.trim() || !name2.trim()) return;
    setIsCalculating(true);
    sfx.playChime();

    setTimeout(() => {
      const combined = (name1.trim() + name2.trim()).toLowerCase();
      let hash = 0;
      for (let i = 0; i < combined.length; i++) {
        hash = (hash << 5) - hash + combined.charCodeAt(i);
        hash |= 0;
      }
      
      // Calculate high romantic base score (75 - 99)
      const absHash = Math.abs(hash);
      const score = 75 + (absHash % 25);
      const passion = 70 + ((absHash >> 2) % 30);
      const trust = 80 + ((absHash >> 4) % 20);
      const humor = 75 + ((absHash >> 6) % 25);
      const romance = 82 + ((absHash >> 8) % 18);

      let verdict = 'Cosmic Destiny! A match written in the stars.';
      if (score >= 95) verdict = 'Unstoppable Soulmates! Pure celestial synergy.';
      else if (score >= 90) verdict = 'Electric Connection! Magnetic & deeply romantic.';
      else if (score >= 85) verdict = 'Harmonious Partners! Endless laughter & loyalty.';

      setResult({
        score,
        verdict,
        passion,
        trust,
        humor,
        romance,
      });
      setIsCalculating(false);
      sfx.playCelebration();

      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#f43f5e', '#ec4899', '#fda4af', '#fde047'],
      });
    }, 1200);
  };

  const handleReset = () => {
    setResult(null);
    setName1('');
    setName2('');
    sfx.playPop();
  };

  return (
    <div className="w-full max-w-xl mx-auto rounded-3xl border border-rose-500/25 bg-[#160918]/85 p-6 sm:p-8 shadow-2xl backdrop-blur-2xl text-center space-y-6">
      <div className="inline-flex items-center gap-2 text-xs font-semibold text-rose-400 uppercase tracking-widest">
        <Sparkles className="h-3.5 w-3.5" />
        <span>Love Compatibility Calculator</span>
        <Sparkles className="h-3.5 w-3.5" />
      </div>

      <div className="space-y-1">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Cosmic Synergy & Affinity
        </h2>
        <p className="text-xs sm:text-sm text-rose-300/70">
          Enter two names to measure your celestial chemistry and romantic harmony
        </p>
      </div>

      {!result ? (
        <div className="space-y-4 pt-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-rose-300/80 mb-1 text-left">
                First Person
              </label>
              <input
                type="text"
                placeholder="e.g. Alex"
                value={name1}
                onChange={(e) => setName1(e.target.value)}
                className="w-full rounded-xl border border-rose-500/30 bg-rose-950/40 px-3.5 py-2.5 text-sm text-white placeholder-rose-400/40 focus:border-rose-400 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-rose-300/80 mb-1 text-left">
                Second Person
              </label>
              <input
                type="text"
                placeholder="e.g. Mia"
                value={name2}
                onChange={(e) => setName2(e.target.value)}
                className="w-full rounded-xl border border-rose-500/30 bg-rose-950/40 px-3.5 py-2.5 text-sm text-white placeholder-rose-400/40 focus:border-rose-400 focus:outline-none"
              />
            </div>
          </div>

          <button
            onClick={calculateCompatibility}
            disabled={!name1.trim() || !name2.trim() || isCalculating}
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-rose-600 via-rose-500 to-pink-600 py-3 text-sm font-semibold text-white shadow-lg shadow-rose-600/30 hover:brightness-110 active:scale-[0.99] transition-all disabled:opacity-50 cursor-pointer"
          >
            <Heart className={`h-4 w-4 ${isCalculating ? 'animate-ping' : 'fill-white'}`} />
            <span>{isCalculating ? 'Aligning the Stars...' : 'Calculate Love Score'}</span>
          </button>
        </div>
      ) : (
        /* Results View */
        <div className="space-y-6 animate-fadeIn">
          {/* Circular Score Meter */}
          <div className="mx-auto flex h-28 w-28 flex-col items-center justify-center rounded-full bg-gradient-to-tr from-rose-600 via-rose-500 to-pink-500 text-white shadow-xl shadow-rose-600/40 animate-gentle-pulse">
            <span className="text-3xl font-black tabular-nums">{result.score}%</span>
            <span className="text-[10px] uppercase font-bold tracking-wider">Synergy</span>
          </div>

          <div className="space-y-1">
            <h3 className="text-xl font-bold text-white">
              {name1} & {name2}
            </h3>
            <p className="text-sm font-medium text-rose-200/90 italic">
              &ldquo;{result.verdict}&rdquo;
            </p>
          </div>

          {/* Metric Breakdown */}
          <div className="grid grid-cols-2 gap-3 text-left">
            <div className="rounded-xl border border-rose-500/20 bg-rose-950/20 p-3">
              <div className="flex items-center justify-between text-xs text-rose-300 font-medium mb-1">
                <span className="flex items-center gap-1">
                  <Flame className="h-3.5 w-3.5 text-rose-400" />
                  <span>Passion</span>
                </span>
                <span className="font-mono text-white">{result.passion}%</span>
              </div>
              <div className="h-1.5 w-full bg-rose-950/60 rounded-full overflow-hidden">
                <div className="h-full bg-rose-500 rounded-full" style={{ width: `${result.passion}%` }} />
              </div>
            </div>

            <div className="rounded-xl border border-rose-500/20 bg-rose-950/20 p-3">
              <div className="flex items-center justify-between text-xs text-rose-300 font-medium mb-1">
                <span className="flex items-center gap-1">
                  <Shield className="h-3.5 w-3.5 text-rose-400" />
                  <span>Trust</span>
                </span>
                <span className="font-mono text-white">{result.trust}%</span>
              </div>
              <div className="h-1.5 w-full bg-rose-950/60 rounded-full overflow-hidden">
                <div className="h-full bg-rose-500 rounded-full" style={{ width: `${result.trust}%` }} />
              </div>
            </div>

            <div className="rounded-xl border border-rose-500/20 bg-rose-950/20 p-3">
              <div className="flex items-center justify-between text-xs text-rose-300 font-medium mb-1">
                <span className="flex items-center gap-1">
                  <Laugh className="h-3.5 w-3.5 text-rose-400" />
                  <span>Humor</span>
                </span>
                <span className="font-mono text-white">{result.humor}%</span>
              </div>
              <div className="h-1.5 w-full bg-rose-950/60 rounded-full overflow-hidden">
                <div className="h-full bg-rose-500 rounded-full" style={{ width: `${result.humor}%` }} />
              </div>
            </div>

            <div className="rounded-xl border border-rose-500/20 bg-rose-950/20 p-3">
              <div className="flex items-center justify-between text-xs text-rose-300 font-medium mb-1">
                <span className="flex items-center gap-1">
                  <Compass className="h-3.5 w-3.5 text-rose-400" />
                  <span>Romance</span>
                </span>
                <span className="font-mono text-white">{result.romance}%</span>
              </div>
              <div className="h-1.5 w-full bg-rose-950/60 rounded-full overflow-hidden">
                <div className="h-full bg-rose-500 rounded-full" style={{ width: `${result.romance}%` }} />
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={() => setIsShareOpen(true)}
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-rose-600 via-rose-500 to-pink-600 px-5 py-2.5 text-xs sm:text-sm font-semibold text-white shadow-lg shadow-rose-600/30 hover:brightness-110 active:scale-95 transition-all"
            >
              <Share2 className="h-4 w-4" />
              <span>Share Compatibility Card</span>
            </button>

            <button
              onClick={handleReset}
              className="flex items-center gap-1.5 rounded-xl border border-rose-500/30 bg-rose-950/40 px-4 py-2.5 text-xs sm:text-sm font-medium text-rose-200 hover:text-white transition-all active:scale-95"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              <span>Test Another Pair</span>
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
          title={`${name1} + ${name2} Love Compatibility: ${result.score}%`}
          names={`${name1} & ${name2}`}
          subtitle={`Score: ${result.score}% - ${result.verdict}`}
          theme="romantic"
        />
      )}
    </div>
  );
}
