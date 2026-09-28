'use client';

import React, { useState } from 'react';
import { Heart, Sparkles, Share2, Flame, Award, Plus } from 'lucide-react';
import Link from 'next/link';
import { ExperienceData } from '@/types/experience';
import { THEMES } from '@/lib/themes';
import RomanticBackground from '@/components/common/RomanticBackground';
import ReactionFloaters from '@/components/common/ReactionFloaters';
import ShareModal from '@/components/common/ShareModal';
import { sfx } from '@/lib/audio';

interface LovePageExperienceProps {
  experience: ExperienceData;
  isCreatorPreview?: boolean;
}

const DEFAULT_REASONS = [
  { title: 'The Way You Smile', text: 'It lights up my darkest days before you even say a single word.' },
  { title: 'Your Pure Heart', text: 'The compassion and warmth you show to everyone around you inspires me.' },
  { title: 'Our Secret Inside Jokes', text: 'That one look across the room where nobody else has a clue what we mean.' },
  { title: 'Home in Your Arms', text: 'No matter how chaotic the world gets, everything feels right next to you.' },
];

export default function LovePageExperience({
  experience,
  isCreatorPreview = false,
}: LovePageExperienceProps) {
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [revealedReasons, setRevealedReasons] = useState<number[]>([0]);

  const toggleReason = (idx: number) => {
    sfx.playPop();
    setRevealedReasons((prev) =>
      prev.includes(idx) ? prev.filter((i) => i !== idx) : [...prev, idx]
    );
  };

  const themeConfig = THEMES[experience.theme] || THEMES.romantic;

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
            <span>Share Love Page</span>
          </button>
        </div>
      </header>

      {/* Main Love Page Container */}
      <main className="relative z-10 flex-1 max-w-3xl mx-auto w-full p-4 sm:p-6 space-y-8 my-auto">
        {/* Hero Card */}
        <div className="rounded-3xl border border-rose-500/25 bg-[#160916]/85 p-6 sm:p-10 shadow-2xl backdrop-blur-2xl text-center space-y-6">
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-rose-400 uppercase tracking-widest">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Dedicated with Eternal Love</span>
            <Sparkles className="h-3.5 w-3.5" />
          </div>

          <div className="space-y-2">
            <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight font-serif">
              {experience.recipientName ? (
                <>
                  For <span className="romantic-gradient-text">{experience.recipientName}</span>
                </>
              ) : (
                <span className="romantic-gradient-text">{experience.title || 'My One and Only'}</span>
              )}
            </h1>
            <p className="text-xs sm:text-sm text-rose-300/70 font-medium">
              Written from the heart by <span className="text-rose-200 font-semibold">{experience.senderName}</span>
            </p>
          </div>

          {/* Love Letter Body */}
          <div className="relative rounded-2xl border border-rose-500/20 bg-rose-950/30 p-6 sm:p-8 text-left space-y-4">
            <div className="text-4xl text-rose-500/40 font-serif leading-none">&ldquo;</div>
            <p className="text-base sm:text-lg text-rose-100 font-serif leading-relaxed italic pl-2">
              {experience.message || 'Every second with you is a memory I keep close to my heart. Thank you for being my favorite chapter.'}
            </p>
            {experience.secondaryMessage && (
              <p className="text-sm sm:text-base text-rose-200/90 leading-relaxed pl-2 pt-2 border-t border-rose-500/15">
                {experience.secondaryMessage}
              </p>
            )}
            <div className="text-right text-xs text-rose-400/80 font-mono pt-2">
              Forever Yours, {experience.senderName} ❤️
            </div>
          </div>

          {/* Love Affinity Stats Meter */}
          <div className="grid grid-cols-3 gap-3 pt-2">
            <div className="rounded-xl border border-rose-500/20 bg-rose-950/20 p-3">
              <span className="text-[10px] text-rose-400 uppercase tracking-wider block">Affinity</span>
              <span className="text-xl sm:text-2xl font-black text-white tabular-nums">100%</span>
            </div>
            <div className="rounded-xl border border-rose-500/20 bg-rose-950/20 p-3">
              <span className="text-[10px] text-rose-400 uppercase tracking-wider block">Chemistry</span>
              <span className="text-xl sm:text-2xl font-black text-rose-300 tabular-nums">Infinite</span>
            </div>
            <div className="rounded-xl border border-rose-500/20 bg-rose-950/20 p-3">
              <span className="text-[10px] text-rose-400 uppercase tracking-wider block">Status</span>
              <span className="text-xl sm:text-2xl font-black text-emerald-400">Soulmates</span>
            </div>
          </div>
        </div>

        {/* Reasons Why I Adore You Cards */}
        <div className="rounded-3xl border border-rose-500/25 bg-[#160916]/85 p-6 sm:p-8 shadow-2xl backdrop-blur-2xl space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Flame className="h-4 w-4 text-rose-400" />
              <span>Reasons Why I Adore You</span>
            </h2>
            <span className="text-xs text-rose-400/70">Tap cards to reveal</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {DEFAULT_REASONS.map((r, idx) => {
              const isRevealed = revealedReasons.includes(idx);
              return (
                <button
                  key={idx}
                  onClick={() => toggleReason(idx)}
                  className={`text-left rounded-2xl border p-4 transition-all duration-300 cursor-pointer ${
                    isRevealed
                      ? 'border-rose-500/40 bg-rose-950/50 shadow-md shadow-rose-900/20'
                      : 'border-rose-500/20 bg-rose-950/20 hover:border-rose-500/30'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs font-semibold text-rose-400 mb-1">
                    <span>Reason #{idx + 1}</span>
                    <span>{isRevealed ? '❤️' : '✨ Tap'}</span>
                  </div>
                  <h3 className="font-bold text-white text-sm mb-1">{r.title}</h3>
                  {isRevealed ? (
                    <p className="text-xs text-rose-200/90 leading-relaxed animate-fadeIn">
                      {r.text}
                    </p>
                  ) : (
                    <p className="text-xs text-rose-400/50 italic">
                      Click to unlock this love note...
                    </p>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Reaction Section */}
        <div className="rounded-3xl border border-rose-500/25 bg-[#160916]/85 p-6 shadow-2xl backdrop-blur-2xl text-center space-y-2">
          <span className="text-xs font-medium text-rose-300/80">
            Leave a romantic reaction for {experience.senderName}:
          </span>
          <ReactionFloaters slug={experience.slug} initialReactions={experience.reactions} />

          <div className="pt-4 flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => setIsShareOpen(true)}
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-rose-600 via-rose-500 to-pink-600 px-5 py-2.5 text-xs sm:text-sm font-semibold text-white shadow-lg shadow-rose-600/30 hover:brightness-110 active:scale-95 transition-all"
            >
              <Share2 className="h-4 w-4" />
              <span>Share / Download Social Card</span>
            </button>
          </div>
        </div>

        {/* Create Your Own CTA */}
        <div className="text-center py-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs text-rose-400 hover:text-white font-medium hover:underline underline-offset-4 transition-colors"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Create a personalized love page for someone special</span>
          </Link>
        </div>
      </main>

      {/* Share Modal */}
      <ShareModal
        isOpen={isShareOpen}
        onClose={() => setIsShareOpen(false)}
        url={`/love/${experience.slug}`}
        title={`Love Page for ${experience.recipientName || 'You'}`}
        names={`${experience.senderName} & ${experience.recipientName}`}
        subtitle={experience.message?.substring(0, 80) || "A personalized love page dedicated to you ❤️"}
        theme={experience.theme}
      />
    </div>
  );
}
