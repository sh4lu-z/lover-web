'use client';

import React, { useState, useRef, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Heart, Sparkles, Share2, Award, Calendar, RefreshCw, Plus } from 'lucide-react';
import { ExperienceData } from '@/types/experience';
import { sfx } from '@/lib/audio';
import { fetchSecureApi } from '@/lib/crypto';
import { THEMES } from '@/lib/themes';
import RomanticBackground from '@/components/common/RomanticBackground';
import ReactionFloaters from '@/components/common/ReactionFloaters';
import ShareModal from '@/components/common/ShareModal';
import Link from 'next/link';

interface ValentineExperienceProps {
  experience: ExperienceData;
  isCreatorPreview?: boolean;
}

const RUNAWAY_PROMPTS = [
  'No',
  'Are you sure? 🥺',
  'Really sure? 💔',
  'Think again! ✨',
  'Wrong button! 👉',
  'Look at the Yes button! 🥰',
  'Nice try, too fast for you! 😉',
  'I will buy you chocolate! 🍫',
  'Error 404: "No" not found! 💖',
  'Please don\'t break my heart! 🥀',
  'You have no escape! 💕',
  'Give it another thought! 🌟',
];

export default function ValentineExperience({
  experience,
  isCreatorPreview = false,
}: ValentineExperienceProps) {
  const [hasSaidYes, setHasSaidYes] = useState(experience.yesClicked || false);
  const [noButtonIndex, setNoButtonIndex] = useState(0);
  const [noPosition, setNoPosition] = useState<{ x: number; y: number } | null>(null);
  const [yesScale, setYesScale] = useState(1);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const themeConfig = THEMES[experience.theme] || THEMES.valentine;

  // Runaway logic for "No" button
  const handleNoDodge = () => {
    sfx.playDodge();
    setNoButtonIndex((prev) => (prev + 1) % RUNAWAY_PROMPTS.length);
    setYesScale((prev) => Math.min(prev + 0.15, 2.2)); // Grow Yes button

    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const maxX = Math.max(100, rect.width - 150);
      const maxY = Math.max(80, rect.height - 100);

      // Random position inside the container
      const newX = Math.random() * maxX - maxX / 2;
      const newY = Math.random() * maxY - maxY / 2;
      setNoPosition({ x: newX, y: newY });
    }
  };

  const handleYesClick = async () => {
    sfx.playCelebration();
    setHasSaidYes(true);

    // Burst firework confetti
    const end = Date.now() + 2.5 * 1000;
    const colors = ['#f43f5e', '#ec4899', '#f472b6', '#e11d48', '#fda4af'];

    (function frame() {
      confetti({
        particleCount: 5,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors,
      });
      confetti({
        particleCount: 5,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors,
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    })();

    // Persist Yes click
    try {
      await fetchSecureApi(`/api/experiences/${experience.slug}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ yesClicked: true }),
      });
    } catch {
      // offline safe
    }
  };

  const handleReset = () => {
    setHasSaidYes(false);
    setNoButtonIndex(0);
    setNoPosition(null);
    setYesScale(1);
    sfx.playPop();
  };

  const question = experience.customQuestion || 'Will you be my Valentine?';
  const currentDate = new Date().toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div className="relative min-h-screen w-full flex flex-col justify-between overflow-hidden">
      <RomanticBackground theme={experience.theme} />

      {/* Top Experience Bar */}
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
            <span>Share</span>
          </button>
        </div>
      </header>

      {/* Main Experience Body */}
      <main className="relative z-10 flex-1 flex items-center justify-center p-4 sm:p-6">
        <div 
          ref={containerRef}
          className="relative w-full max-w-xl rounded-3xl border border-rose-500/25 bg-[#170916]/85 p-6 sm:p-10 shadow-2xl backdrop-blur-2xl text-center"
        >
          {!hasSaidYes ? (
            <div className="space-y-6">
              {/* Cute Cupid Badge */}
              <div className="inline-flex items-center gap-2 text-xs font-semibold tracking-wider text-rose-400 uppercase">
                <Sparkles className="h-3.5 w-3.5" />
                <span>Special Invitation for {experience.recipientName || 'You'}</span>
                <Sparkles className="h-3.5 w-3.5" />
              </div>

              {/* Animated Floating Heart Avatar */}
              <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-tr from-rose-600 via-rose-500 to-pink-500 shadow-xl shadow-rose-600/30 animate-gentle-pulse">
                <Heart className="h-12 w-12 fill-white text-white drop-shadow-md" />
              </div>

              {/* Question */}
              <div className="space-y-2">
                <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
                  {experience.recipientName ? `${experience.recipientName}, ` : ''}
                  <span className="romantic-gradient-text">{question}</span>
                </h1>
                {experience.message && (
                  <p className="text-sm sm:text-base text-rose-200/80 max-w-md mx-auto leading-relaxed pt-1">
                    &ldquo;{experience.message}&rdquo;
                  </p>
                )}
                <div className="text-xs text-rose-400/70 font-medium">
                  With all the love from <span className="text-rose-200 font-semibold">{experience.senderName}</span>
                </div>
              </div>

              {/* Interactive Yes / No Buttons Section */}
              <div className="relative pt-6 pb-4 flex flex-col sm:flex-row items-center justify-center gap-4 min-h-[140px]">
                {/* Growing YES Button */}
                <button
                  onClick={handleYesClick}
                  style={{ transform: `scale(${yesScale})` }}
                  className="z-20 flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-rose-600 via-rose-500 to-pink-500 px-8 py-3.5 text-base sm:text-lg font-bold text-white shadow-xl shadow-rose-600/40 hover:brightness-110 active:scale-95 transition-all duration-200 whitespace-nowrap cursor-pointer"
                >
                  <Heart className="h-5 w-5 fill-white" />
                  <span>YES! Absolutely!</span>
                </button>

                {/* Runaway NO Button */}
                <button
                  onClick={handleNoDodge}
                  onMouseEnter={handleNoDodge}
                  onTouchStart={handleNoDodge}
                  style={
                    noPosition
                      ? {
                          transform: `translate(${noPosition.x}px, ${noPosition.y}px)`,
                          transition: 'transform 0.18s cubic-bezier(0.34, 1.56, 0.64, 1)',
                        }
                      : {}
                  }
                  className="z-10 rounded-2xl border border-rose-500/30 bg-rose-950/60 px-6 py-3 text-sm font-semibold text-rose-300 hover:bg-rose-900/60 active:scale-95 transition-colors cursor-pointer select-none whitespace-nowrap"
                >
                  <span>{RUNAWAY_PROMPTS[noButtonIndex]}</span>
                </button>
              </div>

              <div className="text-[11px] text-rose-400/50">
                Hint: Try clicking &ldquo;No&rdquo; if you think you can catch it 😉
              </div>
            </div>
          ) : (
            /* Celebration & Valentine Contract Screen */
            <div className="space-y-6 animate-fadeIn">
              <div className="inline-flex items-center gap-2 text-xs font-semibold text-rose-400 uppercase tracking-widest">
                <Sparkles className="h-3.5 w-3.5" />
                <span>Officially Sealed</span>
                <Sparkles className="h-3.5 w-3.5" />
              </div>

              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-tr from-rose-500 to-pink-500 shadow-xl shadow-rose-500/40 animate-bounce">
                <Award className="h-10 w-10 text-white" />
              </div>

              <div>
                <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                  IT&apos;S A YES! 🎉
                </h2>
                <p className="mt-2 text-sm sm:text-base text-rose-200/90 max-w-md mx-auto">
                  {experience.recipientName} and {experience.senderName} are officially Valentines!
                </p>
                {experience.secondaryMessage && (
                  <p className="mt-2 text-xs sm:text-sm text-rose-300/80 italic">
                    &ldquo;{experience.secondaryMessage}&rdquo;
                  </p>
                )}
              </div>

              {/* Romantic Valentine Certificate */}
              <div className="relative rounded-2xl border border-rose-500/30 bg-gradient-to-b from-rose-950/60 to-rose-950/20 p-5 text-left text-xs sm:text-sm space-y-3">
                <div className="flex items-center justify-between border-b border-rose-500/20 pb-2">
                  <span className="font-bold text-rose-200 uppercase tracking-wider text-[11px]">
                    Official Love Agreement
                  </span>
                  <span className="flex items-center gap-1 text-[11px] text-rose-400 font-mono">
                    <Calendar className="h-3 w-3" />
                    <span>{currentDate}</span>
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-rose-400/70 block text-[10px] uppercase">Valentine</span>
                    <span className="font-bold text-white text-sm">{experience.recipientName || 'My Love'}</span>
                  </div>
                  <div>
                    <span className="text-rose-400/70 block text-[10px] uppercase">Proposed By</span>
                    <span className="font-bold text-white text-sm">{experience.senderName}</span>
                  </div>
                </div>

                <div className="border-t border-rose-500/15 pt-2 text-[11px] text-rose-300/80 leading-relaxed">
                  ✓ Entitled to unlimited hugs, forehead kisses & dessert sharing.<br />
                  ✓ Valid for all upcoming date nights, movies & late-night calls.<br />
                  ✓ Sealed with eternal adoration & sweet promises.
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                <button
                  onClick={() => setIsShareOpen(true)}
                  className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-rose-600 via-rose-500 to-pink-600 px-5 py-2.5 text-xs sm:text-sm font-semibold text-white shadow-lg shadow-rose-600/30 hover:brightness-110 active:scale-95 transition-all"
                >
                  <Share2 className="h-4 w-4" />
                  <span>Share Certificate & Link</span>
                </button>

                <button
                  onClick={handleReset}
                  className="flex items-center gap-1.5 rounded-xl border border-rose-500/30 bg-rose-950/40 px-4 py-2.5 text-xs sm:text-sm font-medium text-rose-200 hover:text-white transition-all active:scale-95"
                >
                  <RefreshCw className="h-3.5 w-3.5" />
                  <span>Replay</span>
                </button>
              </div>

              {/* Send reactions */}
              <div className="pt-2">
                <span className="text-[11px] text-rose-400/70 block mb-1">
                  Send reaction to {experience.senderName}:
                </span>
                <ReactionFloaters slug={experience.slug} initialReactions={experience.reactions} />
              </div>
            </div>
          )}

          {/* Create Your Own CTA at the bottom */}
          <div className="mt-8 pt-6 border-t border-rose-500/15 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <span className="text-rose-300/60">
              Want to ask your own crush or partner?
            </span>
            <Link
              href="/"
              className="flex items-center gap-1 text-rose-400 hover:text-white font-medium hover:underline underline-offset-4 transition-colors"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Create Your Own Valentine</span>
            </Link>
          </div>
        </div>
      </main>

      {/* Share Modal */}
      <ShareModal
        isOpen={isShareOpen}
        onClose={() => setIsShareOpen(false)}
        url={`/valentine/${experience.slug}`}
        title={`${experience.senderName} & ${experience.recipientName}'s Valentine!`}
        names={`${experience.senderName} + ${experience.recipientName}`}
        subtitle={hasSaidYes ? "She/He Said YES! Officially Valentines ❤️" : "Will you be my Valentine? 🌹"}
        theme={experience.theme}
      />
    </div>
  );
}
