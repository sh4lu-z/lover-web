'use client';

import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Heart, Sparkles, Share2, Clock, Calendar, PartyPopper, Plus } from 'lucide-react';
import Link from 'next/link';
import { ExperienceData } from '@/types/experience';
import { THEMES } from '@/lib/themes';
import RomanticBackground from '@/components/common/RomanticBackground';
import ReactionFloaters from '@/components/common/ReactionFloaters';
import ShareModal from '@/components/common/ShareModal';
import { sfx } from '@/lib/audio';

interface LoveCountdownExperienceProps {
  experience: ExperienceData;
  isCreatorPreview?: boolean;
}

interface TimeRemaining {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isPast: boolean;
}

export default function LoveCountdownExperience({
  experience,
  isCreatorPreview = false,
}: LoveCountdownExperienceProps) {
  const targetDateStr = experience.countdownConfig?.targetDate || experience.revealDate || '2026-10-15T00:00:00.000Z';
  const eventTitle = experience.countdownConfig?.eventTitle || experience.title || 'Our Special Day';

  const [time, setTime] = useState<TimeRemaining>(() => calculateTime(targetDateStr));
  const [isShareOpen, setIsShareOpen] = useState(false);

  function calculateTime(dateStr: string): TimeRemaining {
    const diff = new Date(dateStr).getTime() - Date.now();
    const isPast = diff <= 0;
    const absDiff = Math.abs(diff);

    const days = Math.floor(absDiff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((absDiff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((absDiff / 1000 / 60) % 60);
    const seconds = Math.floor((absDiff / 1000) % 60);

    return { days, hours, minutes, seconds, isPast };
  }

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(calculateTime(targetDateStr));
    }, 1000);
    return () => clearInterval(timer);
  }, [targetDateStr]);

  const handleCelebrate = () => {
    sfx.playCelebration();
    confetti({
      particleCount: 60,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#f43f5e', '#ec4899', '#fda4af', '#fde047'],
    });
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col justify-between overflow-hidden">
      <RomanticBackground theme={experience.theme} />

      {/* Top Header */}
      <header className="relative z-20 flex items-center justify-between p-4 sm:p-6 max-w-5xl mx-auto w-full">
        <Link 
          href="/" 
          className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-rose-300 hover:text-white transition-colors"
        >
          <span className="flex h-6 w-6 items-center justify-center rounded-md bg-rose-600/30 text-rose-400">
            <Heart className="h-3 w-3 fill-rose-400" />
          </span>
          <span>Lover</span>
        </Link>

        <div className="flex items-center gap-2">
          {isCreatorPreview && (
            <span className="text-xs text-rose-400 font-medium px-2.5 py-1 rounded-full bg-rose-500/10 border border-rose-500/20">
              Preview Mode
            </span>
          )}
          <button
            onClick={() => setIsShareOpen(true)}
            className="flex items-center gap-1.5 rounded-xl border border-rose-500/30 bg-rose-950/40 px-3.5 py-1.5 text-xs font-semibold text-rose-200 hover:border-rose-400 hover:text-white transition-all shadow-sm"
          >
            <Share2 className="h-3.5 w-3.5" />
            <span>Share Countdown</span>
          </button>
        </div>
      </header>

      {/* Main Countdown Body */}
      <main className="relative z-10 flex-1 flex items-center justify-center p-4 sm:p-6 my-auto">
        <div className="w-full max-w-xl rounded-3xl border border-rose-500/25 bg-[#170a18]/90 p-6 sm:p-10 shadow-2xl backdrop-blur-2xl text-center space-y-8">
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-rose-400 uppercase tracking-widest">
            <Clock className="h-3.5 w-3.5 text-rose-400" />
            <span>{time.isPast ? 'Celebrating Every Second Together' : 'Counting Down To Magic'}</span>
            <Sparkles className="h-3.5 w-3.5" />
          </div>

          <div className="space-y-2">
            <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              {eventTitle}
            </h1>
            <p className="text-xs sm:text-sm text-rose-300/80">
              Dedicated to <span className="text-rose-100 font-bold">{experience.recipientName || 'You'}</span> from <span className="text-rose-200 font-semibold">{experience.senderName}</span>
            </p>
          </div>

          {/* 4 Animated Metric Cards */}
          <div className="grid grid-cols-4 gap-2.5 sm:gap-4">
            <div className="rounded-2xl border border-rose-500/30 bg-rose-950/50 p-3 sm:p-4 text-center">
              <span className="text-2xl sm:text-4xl font-black text-white tabular-nums block font-mono">
                {String(time.days).padStart(2, '0')}
              </span>
              <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-rose-400 mt-1 block">
                Days
              </span>
            </div>

            <div className="rounded-2xl border border-rose-500/30 bg-rose-950/50 p-3 sm:p-4 text-center">
              <span className="text-2xl sm:text-4xl font-black text-white tabular-nums block font-mono">
                {String(time.hours).padStart(2, '0')}
              </span>
              <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-rose-400 mt-1 block">
                Hours
              </span>
            </div>

            <div className="rounded-2xl border border-rose-500/30 bg-rose-950/50 p-3 sm:p-4 text-center">
              <span className="text-2xl sm:text-4xl font-black text-white tabular-nums block font-mono">
                {String(time.minutes).padStart(2, '0')}
              </span>
              <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-rose-400 mt-1 block">
                Mins
              </span>
            </div>

            <div className="rounded-2xl border border-rose-500/30 bg-rose-950/50 p-3 sm:p-4 text-center">
              <span className="text-2xl sm:text-4xl font-black text-rose-300 tabular-nums block font-mono animate-gentle-pulse">
                {String(time.seconds).padStart(2, '0')}
              </span>
              <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-rose-400 mt-1 block">
                Secs
              </span>
            </div>
          </div>

          {/* Heartfelt Note */}
          {experience.message && (
            <div className="rounded-2xl border border-rose-500/20 bg-rose-950/20 p-5 text-sm text-rose-200/90 italic leading-relaxed">
              &ldquo;{experience.message}&rdquo;
            </div>
          )}

          {/* Action Button */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={handleCelebrate}
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-rose-600 via-rose-500 to-pink-600 px-6 py-3 text-xs sm:text-sm font-bold text-white shadow-lg shadow-rose-600/30 hover:brightness-110 active:scale-95 transition-all"
            >
              <PartyPopper className="h-4 w-4" />
              <span>Send Celebration Sparkles! 🎉</span>
            </button>

            <button
              onClick={() => setIsShareOpen(true)}
              className="flex items-center gap-1.5 rounded-xl border border-rose-500/30 bg-rose-950/40 px-4 py-3 text-xs sm:text-sm font-semibold text-rose-200 hover:text-white transition-all active:scale-95"
            >
              <Share2 className="h-4 w-4" />
              <span>Share Timer</span>
            </button>
          </div>

          {/* Reactions */}
          <div className="pt-2">
            <span className="text-[11px] text-rose-300/70 block mb-1">
              Send your countdown reaction:
            </span>
            <ReactionFloaters slug={experience.slug} initialReactions={experience.reactions} />
          </div>

          {/* Create CTA */}
          <div className="pt-2 border-t border-rose-500/15">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs text-rose-400 hover:text-white transition-colors"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Create your own romantic countdown</span>
            </Link>
          </div>
        </div>
      </main>

      {/* Share Modal */}
      <ShareModal
        isOpen={isShareOpen}
        onClose={() => setIsShareOpen(false)}
        url={`/countdown/${experience.slug}`}
        title={eventTitle}
        names={`${experience.senderName} & ${experience.recipientName}`}
        subtitle={`Countdown: ${time.days} days, ${time.hours} hrs remaining ❤️`}
        theme={experience.theme}
      />
    </div>
  );
}
