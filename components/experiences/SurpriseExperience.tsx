'use client';

import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { Heart, Sparkles, Share2, Mail, Lock, Unlock, Plus } from 'lucide-react';
import Link from 'next/link';
import { ExperienceData } from '@/types/experience';
import { THEMES } from '@/lib/themes';
import RomanticBackground from '@/components/common/RomanticBackground';
import ReactionFloaters from '@/components/common/ReactionFloaters';
import ShareModal from '@/components/common/ShareModal';
import { sfx } from '@/lib/audio';

import SecretRevealer from '@/components/common/SecretRevealer';

interface SurpriseExperienceProps {
  experience: ExperienceData;
  isCreatorPreview?: boolean;
}

export default function SurpriseExperience({
  experience,
  isCreatorPreview = false,
}: SurpriseExperienceProps) {
  const [isRevealed, setIsRevealed] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);

  const handleReveal = () => {
    if (isRevealed) return;
    sfx.playCelebration();
    setIsRevealed(true);

    // Confetti burst
    confetti({
      particleCount: 60,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#f43f5e', '#ec4899', '#fda4af', '#fde047'],
    });
  };

  const themeConfig = THEMES[experience.theme] || THEMES.dreamy;


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
            <span>Share Secret</span>
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="relative z-10 flex-1 flex items-center justify-center p-4 sm:p-6 my-auto">
        <div className="relative w-full max-w-lg rounded-3xl border border-rose-500/25 bg-[#170a18]/90 p-6 sm:p-10 shadow-2xl backdrop-blur-2xl text-center">
          {!isRevealed ? (
            /* Sealed Envelope State */
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 text-xs font-semibold text-amber-300 uppercase tracking-widest">
                <Lock className="h-3.5 w-3.5" />
                <span>Confidential Love Capsule</span>
                <Sparkles className="h-3.5 w-3.5" />
              </div>

              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                  {experience.recipientName ? `A Secret for ${experience.recipientName}` : 'A Secret Awaits You'}
                </h1>
                <p className="mt-1 text-xs sm:text-sm text-rose-300/70">
                  Sent with care by <span className="text-rose-200 font-semibold">{experience.senderName}</span>
                </p>
              </div>

              {/* Interactive Secret Revealer Supporting 7 Modes */}
              <div className="py-2">
                <SecretRevealer
                  revealStyle={experience.revealType || 'wax_seal'}
                  onReveal={handleReveal}
                  senderName={experience.senderName}
                  recipientName={experience.recipientName}
                />
              </div>
            </div>
          ) : (
            /* Revealed Message State */
            <div className="space-y-6 animate-fadeIn">
              <div className="inline-flex items-center gap-2 text-xs font-semibold text-emerald-400 uppercase tracking-widest">
                <Unlock className="h-3.5 w-3.5" />
                <span>Secret Revealed</span>
                <Sparkles className="h-3.5 w-3.5" />
              </div>

              <div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-serif">
                  {experience.title || 'What My Heart Wanted to Say'}
                </h2>
                <p className="text-xs text-rose-300/70 mt-1">
                  From: <span className="text-rose-200 font-semibold">{experience.senderName}</span>
                </p>
              </div>

              {/* Revealed Love Note Card */}
              <div className="rounded-2xl border border-amber-500/30 bg-gradient-to-b from-[#2a1324]/80 to-[#1b0a17]/90 p-6 text-left space-y-3 shadow-inner">
                <div className="text-3xl text-amber-400/50 font-serif leading-none">&ldquo;</div>
                <p className="text-sm sm:text-base text-rose-50 font-serif leading-relaxed italic pl-2">
                  {experience.message}
                </p>
                {experience.secondaryMessage && (
                  <p className="text-xs sm:text-sm text-rose-200/90 pt-2 border-t border-rose-500/20 pl-2">
                    {experience.secondaryMessage}
                  </p>
                )}
                <div className="text-right text-xs text-amber-300 font-mono pt-2">
                  Forever Sealed With Love 💌
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                <button
                  onClick={() => setIsShareOpen(true)}
                  className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-rose-600 via-rose-500 to-pink-600 px-5 py-2.5 text-xs sm:text-sm font-semibold text-white shadow-lg shadow-rose-600/30 hover:brightness-110 active:scale-95 transition-all"
                >
                  <Share2 className="h-4 w-4" />
                  <span>Share This Secret</span>
                </button>
              </div>

              {/* Reactions */}
              <div className="pt-2">
                <span className="text-[11px] text-rose-300/70 block mb-1">
                  Send a reaction to {experience.senderName}:
                </span>
                <ReactionFloaters slug={experience.slug} initialReactions={experience.reactions} />
              </div>
            </div>
          )}

          {/* Create CTA */}
          <div className="mt-8 pt-6 border-t border-rose-500/15 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <span className="text-rose-300/60">
              Want to send your own secret surprise link?
            </span>
            <Link
              href="/"
              className="flex items-center gap-1 text-rose-400 hover:text-white font-medium hover:underline underline-offset-4 transition-colors"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Create Surprise Link</span>
            </Link>
          </div>
        </div>
      </main>

      {/* Share Modal */}
      <ShareModal
        isOpen={isShareOpen}
        onClose={() => setIsShareOpen(false)}
        url={`/surprise/${experience.slug}`}
        title={`A Secret Envelope from ${experience.senderName}`}
        names={`${experience.senderName} ✉️`}
        subtitle="A secret love link is waiting to be unsealed..."
        theme={experience.theme}
      />
    </div>
  );
}
