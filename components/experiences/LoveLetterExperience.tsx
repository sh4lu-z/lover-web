'use client';

import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Heart, Sparkles, Share2, Mail, RefreshCw, Plus, Volume2, VolumeX } from 'lucide-react';
import Link from 'next/link';
import { ExperienceData } from '@/types/experience';
import { THEMES } from '@/lib/themes';
import RomanticBackground from '@/components/common/RomanticBackground';
import ReactionFloaters from '@/components/common/ReactionFloaters';
import ShareModal from '@/components/common/ShareModal';
import { sfx } from '@/lib/audio';

interface LoveLetterExperienceProps {
  experience: ExperienceData;
  isCreatorPreview?: boolean;
}

export default function LoveLetterExperience({
  experience,
  isCreatorPreview = false,
}: LoveLetterExperienceProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [displayedText, setDisplayedText] = useState('');
  const [isTypingDone, setIsTypingDone] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);

  const fullLetter = experience.message || 'Every moment with you is etched into my heart forever.';

  const handleOpenEnvelope = () => {
    if (isOpen) return;
    sfx.playChime();
    setDisplayedText('');
    setIsTypingDone(false);
    setIsOpen(true);

    confetti({
      particleCount: 40,
      spread: 60,
      origin: { y: 0.6 },
      colors: ['#f43f5e', '#ec4899', '#fda4af'],
    });
  };

  // Handwriting typewriter effect
  useEffect(() => {
    if (!isOpen) return;
    let i = 0;

    const interval = setInterval(() => {
      i++;
      setDisplayedText(fullLetter.slice(0, i));
      if (i % 8 === 0) sfx.playPop();

      if (i >= fullLetter.length) {
        clearInterval(interval);
        setIsTypingDone(true);
        sfx.playCelebration();
      }
    }, 38);

    return () => clearInterval(interval);
  }, [isOpen, fullLetter]);


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
            <span>Share Letter</span>
          </button>
        </div>
      </header>

      {/* Main Experience Body */}
      <main className="relative z-10 flex-1 flex items-center justify-center p-4 sm:p-6 my-auto">
        <div className="relative w-full max-w-xl text-center space-y-6">
          {!isOpen ? (
            /* Sealed Envelope Presentation */
            <div className="rounded-3xl border border-rose-500/25 bg-[#170918]/90 p-8 sm:p-12 shadow-2xl backdrop-blur-2xl space-y-6 animate-fadeIn">
              <div className="inline-flex items-center gap-2 text-xs font-semibold text-rose-400 uppercase tracking-widest">
                <Sparkles className="h-3.5 w-3.5" />
                <span>Special Delivery</span>
                <Sparkles className="h-3.5 w-3.5" />
              </div>

              <div>
                <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight font-serif">
                  A Love Letter For {experience.recipientName || 'You'}
                </h1>
                <p className="text-xs sm:text-sm text-rose-300/70 mt-1">
                  Penned with all the devotion of <span className="text-rose-200 font-semibold">{experience.senderName}</span>
                </p>
              </div>

              {/* Envelope Flap Card */}
              <div className="relative mx-auto max-w-sm aspect-[4/3] rounded-3xl border-2 border-rose-500/30 bg-gradient-to-b from-[#2b1024] to-[#150716] p-6 shadow-2xl flex flex-col items-center justify-center cursor-pointer group hover:scale-[1.02] transition-transform">
                <div className="absolute top-4 left-6 text-left">
                  <span className="text-[10px] text-rose-400/60 uppercase block">Deliver to:</span>
                  <span className="text-sm font-serif font-bold text-white">{experience.recipientName || 'My Love'}</span>
                </div>

                <div className="absolute top-4 right-6 text-right">
                  <span className="text-[10px] text-rose-400/60 uppercase block">From:</span>
                  <span className="text-sm font-serif font-bold text-rose-300">{experience.senderName}</span>
                </div>

                {/* Wax Seal Trigger */}
                <button
                  onClick={handleOpenEnvelope}
                  className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-tr from-rose-700 via-rose-600 to-pink-600 shadow-xl shadow-rose-600/40 text-white animate-gentle-pulse group-hover:scale-110 active:scale-95 transition-all cursor-pointer mt-6"
                >
                  <Mail className="h-8 w-8" />
                </button>

                <p className="text-xs text-rose-300/80 mt-5 font-medium tracking-wide">
                  ✨ Tap to open and unfold letter ✨
                </p>
              </div>
            </div>
          ) : (
            /* Unfolded Parchment Letter */
            <div className="rounded-3xl border-2 border-amber-300/30 bg-gradient-to-b from-[#fffbf2] to-[#faf3e3] text-slate-900 p-6 sm:p-10 shadow-2xl text-left space-y-6 animate-fadeIn">
              {/* Letter Header */}
              <div className="border-b border-amber-900/15 pb-4 flex items-center justify-between">
                <div>
                  <span className="text-xs font-serif text-amber-900/60 uppercase tracking-widest block">
                    Dearest
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-serif font-black text-rose-950">
                    {experience.recipientName || 'My One and Only'},
                  </h2>
                </div>
                <div className="text-right">
                  <span className="text-xs font-serif text-amber-800/60 block">
                    {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </span>
                  <span className="text-xs font-serif italic text-rose-800">With all my heart</span>
                </div>
              </div>

              {/* Letter Body with Handwriting Style Typewriter */}
              <div className="min-h-[160px] py-2">
                <p className="text-base sm:text-lg font-serif text-slate-800 leading-relaxed italic whitespace-pre-line">
                  {displayedText}
                  {!isTypingDone && (
                    <span className="inline-block w-1.5 h-5 bg-rose-600 ml-1 animate-pulse" />
                  )}
                </p>

                {experience.secondaryMessage && isTypingDone && (
                  <p className="mt-4 pt-4 border-t border-amber-900/10 text-sm sm:text-base font-serif text-rose-900 leading-relaxed animate-fadeIn">
                    {experience.secondaryMessage}
                  </p>
                )}
              </div>

              {/* Sign-off */}
              <div className="border-t border-amber-900/15 pt-4 flex items-center justify-between text-xs sm:text-sm font-serif">
                <span className="text-amber-900/70">Always & Forever,</span>
                <span className="font-bold text-rose-950 text-base">{experience.senderName} ❤️</span>
              </div>

              {/* Bottom Actions inside the card */}
              <div className="pt-4 flex flex-wrap items-center justify-between gap-3 border-t border-amber-900/10">
                <button
                  onClick={() => setIsShareOpen(true)}
                  className="flex items-center gap-2 rounded-xl bg-rose-600 px-4 py-2.5 text-xs font-bold text-white shadow hover:bg-rose-500 active:scale-95 transition-all"
                >
                  <Share2 className="h-3.5 w-3.5" />
                  <span>Share This Letter</span>
                </button>

                <button
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-1.5 text-xs text-rose-900/70 hover:text-rose-900 transition-colors"
                >
                  <RefreshCw className="h-3 w-3" />
                  <span>Fold Back</span>
                </button>
              </div>

              {/* Reactions */}
              <div className="pt-2">
                <span className="text-[11px] text-amber-900/70 block mb-1">
                  Send your reaction to {experience.senderName}:
                </span>
                <ReactionFloaters slug={experience.slug} initialReactions={experience.reactions} />
              </div>
            </div>
          )}

          {/* Create CTA */}
          <div className="text-center pt-2">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs text-rose-300 hover:text-white transition-colors"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Write your own romantic love letter</span>
            </Link>
          </div>
        </div>
      </main>

      {/* Share Modal */}
      <ShareModal
        isOpen={isShareOpen}
        onClose={() => setIsShareOpen(false)}
        url={`/letter/${experience.slug}`}
        title={`A Love Letter for ${experience.recipientName || 'You'}`}
        names={`${experience.senderName} & ${experience.recipientName}`}
        subtitle={experience.message?.substring(0, 80) || "A sealed love letter awaits your hands..."}
        theme={experience.theme}
      />
    </div>
  );
}
