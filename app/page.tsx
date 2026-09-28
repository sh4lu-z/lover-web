'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Heart, 
  Sparkles, 
  ArrowRight, 
  Share2, 
  Award, 
  Mail, 
  HelpCircle, 
  Gamepad2, 
  Flame, 
  Compass, 
  Palette,
  ExternalLink,
  Clock,
  GitCommit,
  Gift,
  Lock,
  Layers,
  PartyPopper,
  Info
} from 'lucide-react';
import Navbar from '@/components/common/Navbar';
import Footer from '@/components/common/Footer';
import RomanticBackground from '@/components/common/RomanticBackground';
import AdvancedExperienceCreator from '@/components/create/AdvancedExperienceCreator';
import OnboardingModal from '@/components/common/OnboardingModal';
import MobileBottomNav from '@/components/common/MobileBottomNav';

// Games Suite
import LoveCalculator from '@/components/games/LoveCalculator';
import DateIdeaGenerator from '@/components/games/DateIdeaGenerator';
import ThisOrThatGame from '@/components/games/ThisOrThatGame';
import WouldYouRatherGame from '@/components/games/WouldYouRatherGame';
import LovePersonalityTest from '@/components/games/LovePersonalityTest';
import TruthOrDareGame from '@/components/games/TruthOrDareGame';
import RandomLoveChallenge from '@/components/games/RandomLoveChallenge';
import EmojiLoveQuiz from '@/components/games/EmojiLoveQuiz';
import MemoryMatchGame from '@/components/games/MemoryMatchGame';

import { THEMES } from '@/lib/themes';
import { sfx } from '@/lib/audio';
import confetti from 'canvas-confetti';

const RUNAWAY_PROMPTS = [
  'No',
  'Are you sure? 🥺',
  'Really sure? 💔',
  'Think again! ✨',
  'Nice try! 😉',
  'You can\'t catch me! 🍫',
  'Look at the Yes button! 🥰',
];

export default function HomePage() {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);
  const [selectedGameTab, setSelectedGameTab] = useState<
    'calculator' | 'date_wheel' | 'would_you_rather' | 'personality' | 'truth_dare' | 'challenge' | 'emoji' | 'memory'
  >('calculator');
  const [selectedThemePreview, setSelectedThemePreview] = useState<keyof typeof THEMES>('romantic');

  // Hero interactive preview state
  const [heroNoIndex, setHeroNoIndex] = useState(0);
  const [heroNoPosition, setHeroNoPosition] = useState<{ x: number; y: number } | null>(null);
  const [heroYesScale, setHeroYesScale] = useState(1);
  const [heroCelebrated, setHeroCelebrated] = useState(false);

  const handleHeroNoDodge = () => {
    sfx.playDodge();
    setHeroNoIndex((prev) => (prev + 1) % RUNAWAY_PROMPTS.length);
    setHeroYesScale((prev) => Math.min(prev + 0.15, 2.0));
    const newX = (Math.random() - 0.5) * 160;
    const newY = (Math.random() - 0.5) * 90;
    setHeroNoPosition({ x: newX, y: newY });
  };

  const handleHeroYes = () => {
    sfx.playCelebration();
    setHeroCelebrated(true);
    confetti({
      particleCount: 50,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#f43f5e', '#ec4899', '#fda4af', '#fde047'],
    });
  };

  const handleHeroReset = () => {
    setHeroCelebrated(false);
    setHeroNoIndex(0);
    setHeroNoPosition(null);
    setHeroYesScale(1);
    sfx.playPop();
  };

  return (
    <div className="relative min-h-screen flex flex-col justify-between selection:bg-rose-500 selection:text-white pb-16 md:pb-0">
      <RomanticBackground theme={selectedThemePreview} />
      <Navbar 
        onOpenCreate={() => setIsCreateOpen(true)}
        onOpenOnboarding={() => setIsOnboardingOpen(true)}
      />

      <main className="relative z-10 flex-1 space-y-20 sm:space-y-28 pb-20">
        {/* HERO SECTION */}
        <section className="relative pt-12 sm:pt-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Left Hero Pitch */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              {/* Unboxed Metadata Tagline */}
              <div className="flex items-center justify-center lg:justify-start gap-2 text-xs font-semibold text-rose-400 uppercase tracking-widest">
                <Sparkles className="h-3.5 w-3.5 text-rose-400" />
                <span>The Modern Romantic Web Platform</span>
                <span aria-hidden="true">·</span>
                <span>Zero Account Needed</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.12]">
                Create unforgettable <br className="hidden sm:inline" />
                <span className="romantic-gradient-text">love experiences</span> <br className="hidden sm:inline" />
                in seconds.
              </h1>

              <p className="text-base sm:text-lg text-rose-200/80 max-w-xl mx-auto lg:mx-0 leading-relaxed">
                Personalized love pages, playful runaway-button Valentine invites, couple quizzes, and secret reveal links. Share via unique link with anyone special.
              </p>

              {/* CTAs */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
                <button
                  onClick={() => setIsCreateOpen(true)}
                  className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-rose-600 via-rose-500 to-pink-600 px-6 py-4 text-sm sm:text-base font-bold text-white shadow-xl shadow-rose-600/30 hover:brightness-110 active:scale-95 transition-all cursor-pointer"
                >
                  <Sparkles className="h-4 w-4" />
                  <span>Create an Experience</span>
                  <ArrowRight className="h-4 w-4" />
                </button>

                <a
                  href="#games"
                  className="flex items-center gap-2 rounded-2xl border border-rose-500/30 bg-rose-950/40 px-6 py-4 text-sm sm:text-base font-semibold text-rose-200 hover:border-rose-400 hover:text-white transition-all active:scale-95"
                >
                  <Gamepad2 className="h-4 w-4 text-rose-400" />
                  <span>Play Love Games</span>
                </a>

                <button
                  onClick={() => setIsOnboardingOpen(true)}
                  className="flex items-center gap-1.5 px-4 py-4 rounded-2xl text-xs sm:text-sm font-semibold text-rose-300 hover:text-white transition-colors"
                >
                  <Info className="h-4 w-4 text-rose-400" />
                  <span>How It Works</span>
                </button>
              </div>

              {/* Trust & Social Proof Unboxed Text */}
              <div className="pt-4 flex items-center justify-center lg:justify-start gap-3 text-xs text-rose-300/70">
                <span>Over 12,000+ Yes responses</span>
                <span aria-hidden="true">·</span>
                <span>Instant QR social cards</span>
                <span aria-hidden="true">·</span>
                <span>100% Free & Private</span>
              </div>
            </div>

            {/* Right Hero Live Interactive Valentine Preview Card */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="relative w-full max-w-sm sm:max-w-md rounded-3xl border border-rose-500/30 bg-[#160918]/90 p-6 sm:p-7 shadow-2xl backdrop-blur-2xl text-center space-y-5">
                <div className="flex items-center justify-between text-[11px] text-rose-400 font-semibold uppercase tracking-wider">
                  <span className="flex items-center gap-1">
                    <Heart className="h-3 w-3 fill-rose-400" />
                    <span>Live Interactive Demo</span>
                  </span>
                  <span>Try clicking &ldquo;No&rdquo;!</span>
                </div>

                {!heroCelebrated ? (
                  <div className="space-y-4">
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-tr from-rose-600 to-pink-500 text-white shadow-lg shadow-rose-600/30 animate-gentle-pulse">
                      <Heart className="h-8 w-8 fill-white" />
                    </div>

                    <div className="space-y-1">
                      <h2 className="text-xl sm:text-2xl font-black text-white">
                        Mia, will you be my Valentine? 💕
                      </h2>
                      <p className="text-xs text-rose-200/70">
                        From: <span className="text-rose-100 font-semibold">Alex</span>
                      </p>
                    </div>

                    <div className="relative py-4 flex items-center justify-center gap-3 min-h-[100px]">
                      <button
                        onClick={handleHeroYes}
                        style={{ transform: `scale(${heroYesScale})` }}
                        className="z-20 flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-rose-600 to-pink-600 px-5 py-2.5 text-xs sm:text-sm font-bold text-white shadow-lg shadow-rose-600/40 hover:brightness-110 active:scale-95 transition-all cursor-pointer whitespace-nowrap"
                      >
                        <Heart className="h-4 w-4 fill-white" />
                        <span>YES! 💖</span>
                      </button>

                      <button
                        onClick={handleHeroNoDodge}
                        onMouseEnter={handleHeroNoDodge}
                        onTouchStart={handleHeroNoDodge}
                        style={
                          heroNoPosition
                            ? {
                                transform: `translate(${heroNoPosition.x}px, ${heroNoPosition.y}px)`,
                                transition: 'transform 0.15s cubic-bezier(0.34, 1.56, 0.64, 1)',
                              }
                            : {}
                        }
                        className="z-10 rounded-xl border border-rose-500/30 bg-rose-950/60 px-4 py-2.5 text-xs font-semibold text-rose-300 hover:bg-rose-900/60 transition-colors select-none whitespace-nowrap cursor-pointer"
                      >
                        {RUNAWAY_PROMPTS[heroNoIndex]}
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4 animate-fadeIn">
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-tr from-rose-500 to-pink-500 text-white shadow-lg animate-bounce">
                      <Award className="h-7 w-7" />
                    </div>
                    <div>
                      <h2 className="text-xl font-black text-white">IT&apos;S A YES! 🎉</h2>
                      <p className="text-xs text-rose-200/90 mt-1">
                        Valentine contract sealed with endless love and snacks!
                      </p>
                    </div>
                    <div className="flex items-center justify-center gap-2 pt-1">
                      <button
                        onClick={() => setIsCreateOpen(true)}
                        className="rounded-xl bg-rose-600 px-4 py-2 text-xs font-bold text-white shadow hover:bg-rose-500 transition-all"
                      >
                        Make Yours Now
                      </button>
                      <button
                        onClick={handleHeroReset}
                        className="rounded-xl border border-rose-500/30 bg-rose-950/40 px-3 py-2 text-xs text-rose-200 hover:text-white transition-all"
                      >
                        Reset Demo
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* SECTION: DISCOVER / PUBLIC GALLERY */}
        <section id="discover" className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-semibold text-rose-400 uppercase tracking-widest mb-1">
                <Sparkles className="h-3.5 w-3.5" />
                <span>Featured Experiences Gallery</span>
              </div>
              <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
                Curated Romantic Moments
              </h2>
            </div>
            <button
              onClick={() => setIsCreateOpen(true)}
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-rose-400 hover:text-white transition-colors"
            >
              <span>Build your own custom link</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              {
                title: 'Alex & Mia Valentine',
                slug: 'alex-and-mia',
                type: 'Valentine Proposal',
                desc: 'Will you be my Valentine? Features the runaway "No" button & official signed contract.',
                url: '/valentine/alex-and-mia',
                badge: 'Hot Viral',
                icon: Heart,
              },
              {
                title: 'A Handwritten Love Letter',
                slug: 'sweet-letter',
                type: 'Digital Envelope',
                desc: 'An unfolding vintage parchment letter with animated typewriter calligraphy.',
                url: '/letter/sweet-letter',
                badge: 'Handwritten',
                icon: Mail,
              },
              {
                title: 'The Chapters of Us',
                slug: 'our-story',
                type: 'Milestone Timeline',
                desc: 'From first coffee glance to moving in together, immortalized in a story timeline.',
                url: '/timeline/our-story',
                badge: 'Storyline',
                icon: GitCommit,
              },
              {
                title: 'Valentine & Anniversary Countdown',
                slug: 'valentine-countdown',
                type: 'Love Countdown',
                desc: 'Live countdown timer ticking seconds until the next special anniversary dinner.',
                url: '/countdown/valentine-countdown',
                badge: 'Ticking Live',
                icon: Clock,
              },
              {
                title: 'How Well Do You Know Jordan?',
                slug: 'jordan',
                type: 'Couple Quiz',
                desc: '5 trivia questions testing cravings, quirks, and comfort food secrets.',
                url: '/quiz/jordan',
                badge: 'Quiz',
                icon: HelpCircle,
              },
              {
                title: 'A Sealed Secret Envelope',
                slug: 'for-you',
                type: 'Wax Seal Capsule',
                desc: 'A confidential love note sealed with interactive golden wax to tap and unwrap.',
                url: '/surprise/for-you',
                badge: 'Secret',
                icon: Sparkles,
              },
            ].map((exp) => {
              const ExpIcon = exp.icon;
              return (
                <Link
                  key={exp.slug}
                  href={exp.url}
                  className="group relative rounded-3xl border border-rose-500/20 bg-[#160918]/85 p-6 flex flex-col justify-between hover:border-rose-400 hover:bg-[#1a0a1c] transition-all shadow-xl"
                >
                  <div>
                    <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-rose-400 mb-3">
                      <span className="flex items-center gap-1.5">
                        <ExpIcon className="h-3.5 w-3.5 text-rose-400" />
                        <span>{exp.type}</span>
                      </span>
                      <span className="text-rose-300/80 px-2 py-0.5 rounded-full bg-rose-500/10 border border-rose-500/20">
                        {exp.badge}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-white group-hover:text-rose-200 transition-colors">
                      {exp.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-rose-300/70 mt-1.5 leading-relaxed">
                      {exp.desc}
                    </p>
                  </div>

                  <div className="mt-5 pt-3 border-t border-rose-500/15 flex items-center justify-between text-xs font-semibold text-rose-400">
                    <span>Open Live Experience</span>
                    <ExternalLink className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        {/* SECTION: VALENTINE EXPERIENCE SHOWCASE */}
        <section id="valentine" className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
          <div className="rounded-3xl border border-rose-500/20 bg-gradient-to-b from-[#180918]/90 to-[#100511]/90 p-8 sm:p-12 backdrop-blur-2xl shadow-2xl space-y-8">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 text-xs font-semibold text-rose-400 uppercase tracking-widest mb-2">
                <Heart className="h-3.5 w-3.5 fill-rose-400" />
                <span>The Valentine Experience</span>
              </div>
              <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
                The Playful Runaway &ldquo;No&rdquo; Button
              </h2>
              <p className="text-sm sm:text-base text-rose-200/80 mt-2 leading-relaxed">
                Want to ask someone out, propose Valentine plans, or confess your feelings with playful humor? Our Valentine page features a runaway &ldquo;No&rdquo; button that dodges the cursor, while the &ldquo;Yes&rdquo; button grows larger with each escape!
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="rounded-2xl border border-rose-500/20 bg-rose-950/30 p-5 space-y-2">
                <span className="text-2xl">🏃‍♂️💨</span>
                <h3 className="text-base font-bold text-white">Playful Runaway Button</h3>
                <p className="text-xs text-rose-300/70 leading-relaxed">
                  Hovering or tapping &ldquo;No&rdquo; makes it dart away with funny voice lines, while the &ldquo;Yes&rdquo; button scales up!
                </p>
              </div>

              <div className="rounded-2xl border border-rose-500/20 bg-rose-950/30 p-5 space-y-2">
                <span className="text-2xl">📜💍</span>
                <h3 className="text-base font-bold text-white">Official Love Contract</h3>
                <p className="text-xs text-rose-300/70 leading-relaxed">
                  Once they say Yes, an official customized Certificate is generated with perks, date stamp, and signature.
                </p>
              </div>

              <div className="rounded-2xl border border-rose-500/20 bg-rose-950/30 p-5 space-y-2">
                <span className="text-2xl">📸✨</span>
                <h3 className="text-base font-bold text-white">Instant Social Share Card</h3>
                <p className="text-xs text-rose-300/70 leading-relaxed">
                  Download high-resolution 1080×1080 Instagram & story cards complete with custom QR code.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={() => {
                  setIsCreateOpen(true);
                  sfx.playChime();
                }}
                className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-rose-600 via-rose-500 to-pink-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-rose-600/30 hover:brightness-110 active:scale-95 transition-all"
              >
                <Heart className="h-4 w-4 fill-white" />
                <span>Create a Valentine Invite</span>
              </button>

              <Link
                href="/valentine/alex-and-mia"
                className="flex items-center gap-2 rounded-xl border border-rose-500/30 bg-rose-950/40 px-5 py-3 text-sm font-semibold text-rose-200 hover:text-white transition-all"
              >
                <span>View Sample: Alex & Mia</span>
                <ExternalLink className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </section>

        {/* SECTION: FEATURED LOVE GAMES (EXPANDED SUITE) */}
        <section id="games" className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full space-y-8">
          <div className="text-center max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-2 text-xs font-semibold text-rose-400 uppercase tracking-widest mb-2">
              <Gamepad2 className="h-3.5 w-3.5" />
              <span>The Love Games Hub</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              Interactive Couple Games Suite
            </h2>
            <p className="text-sm text-rose-200/70 mt-2">
              Play directly in your browser, generate personalized results, and challenge your partner.
            </p>

            {/* Segmented Filter Control */}
            <div className="flex flex-wrap items-center justify-center gap-1.5 p-1.5 bg-rose-950/40 rounded-2xl border border-rose-500/20 mt-6 max-w-full">
              {[
                { id: 'calculator', label: 'Love Calculator', icon: Flame },
                { id: 'date_wheel', label: 'Date Roulette', icon: Compass },
                { id: 'would_you_rather', label: 'Would You Rather', icon: Heart },
                { id: 'personality', label: 'Personality Test', icon: Award },
                { id: 'truth_dare', label: 'Truth or Dare', icon: Flame },
                { id: 'challenge', label: 'Love Mission', icon: Sparkles },
                { id: 'emoji', label: 'Emoji Riddle', icon: HelpCircle },
                { id: 'memory', label: 'Memory Match', icon: Sparkles },
              ].map((tab) => {
                const TabIcon = tab.icon;
                const isSelected = selectedGameTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => {
                      setSelectedGameTab(tab.id as typeof selectedGameTab);
                      sfx.playPop();
                    }}
                    className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl transition-all whitespace-nowrap cursor-pointer ${
                      isSelected
                        ? 'bg-rose-600 text-white shadow'
                        : 'text-rose-300 hover:text-white'
                    }`}
                  >
                    <TabIcon className="h-3.5 w-3.5" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active Game Display */}
          <div className="pt-2">
            {selectedGameTab === 'calculator' && <LoveCalculator />}
            {selectedGameTab === 'date_wheel' && <DateIdeaGenerator />}
            {selectedGameTab === 'would_you_rather' && <WouldYouRatherGame />}
            {selectedGameTab === 'personality' && <LovePersonalityTest />}
            {selectedGameTab === 'truth_dare' && <TruthOrDareGame />}
            {selectedGameTab === 'challenge' && <RandomLoveChallenge />}
            {selectedGameTab === 'emoji' && <EmojiLoveQuiz />}
            {selectedGameTab === 'memory' && <MemoryMatchGame />}
          </div>
        </section>

        {/* SECTION: SURPRISE LINKS & 7 REVEAL MODES */}
        <section id="surprise" className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
          <div className="rounded-3xl border border-rose-500/20 bg-[#160a18]/85 p-8 sm:p-12 backdrop-blur-2xl shadow-2xl space-y-8">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 text-xs font-semibold text-amber-300 uppercase tracking-widest mb-2">
                <Gift className="h-3.5 w-3.5" />
                <span>7 Secret Reveal Styles</span>
              </div>
              <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
                Cinematic Love Revelations
              </h2>
              <p className="text-sm sm:text-base text-rose-200/80 mt-2 leading-relaxed">
                Choose how your partner experiences your surprise confession. From golden wax seals and scratch-off cards to gift box ribbons and heart locks!
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
              {[
                { title: 'Wax Seal', emoji: '📜', desc: 'Golden seal crack' },
                { title: 'Scratch Reveal', emoji: '✨', desc: 'Finger scratch canvas' },
                { title: 'Gift Box', emoji: '🎁', desc: 'Untie silk ribbon' },
                { title: 'Heart Lock', emoji: '🔐', desc: 'Turn vintage key' },
                { title: '3 Hearts', emoji: '💖', desc: 'Tap 3 glowing hearts' },
                { title: 'Curtains', emoji: '🎭', desc: 'Velvet theater draw' },
                { title: 'Destiny Card', emoji: '🃏', desc: 'Mystical tarot flip' },
              ].map((rev) => (
                <div key={rev.title} className="rounded-2xl border border-rose-500/20 bg-rose-950/30 p-3.5 text-center space-y-1">
                  <span className="text-2xl block mb-1">{rev.emoji}</span>
                  <span className="text-xs font-bold text-white block">{rev.title}</span>
                  <span className="text-[10px] text-rose-300/60 block">{rev.desc}</span>
                </div>
              ))}
            </div>

            <div className="pt-2 flex flex-wrap items-center gap-4">
              <button
                onClick={() => {
                  setIsCreateOpen(true);
                  sfx.playChime();
                }}
                className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-rose-600 via-rose-500 to-pink-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-rose-600/30 hover:brightness-110 active:scale-95 transition-all"
              >
                <Sparkles className="h-4 w-4" />
                <span>Create Secret Link</span>
              </button>

              <Link
                href="/surprise/for-you"
                className="flex items-center gap-2 rounded-xl border border-rose-500/30 bg-rose-950/40 px-5 py-3 text-sm font-semibold text-rose-200 hover:text-white transition-all"
              >
                <span>Experience Demo Capsule</span>
                <ExternalLink className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </section>

        {/* SECTION: THEME SYSTEM */}
        <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full space-y-6">
          <div className="text-center max-w-xl mx-auto">
            <div className="inline-flex items-center gap-2 text-xs font-semibold text-rose-400 uppercase tracking-widest mb-1">
              <Palette className="h-3.5 w-3.5" />
              <span>Theme Aesthetics</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              7 Curated Romantic Moods
            </h2>
            <p className="text-xs sm:text-sm text-rose-200/70 mt-1">
              Tap any palette below to preview ambient backdrop lighting.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
            {Object.values(THEMES).map((t) => {
              const isSelected = selectedThemePreview === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => {
                    setSelectedThemePreview(t.id);
                    sfx.playPop();
                  }}
                  className={`flex flex-col items-center justify-center p-3 rounded-2xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'border-rose-400 bg-rose-600/40 text-white shadow-lg shadow-rose-600/20 scale-105'
                      : 'border-rose-500/20 bg-rose-950/30 text-rose-300 hover:border-rose-500/40'
                  }`}
                >
                  <span className="text-2xl mb-1">{t.heartEmoji}</span>
                  <span className="text-xs font-bold text-center leading-tight">{t.name}</span>
                </button>
              );
            })}
          </div>
        </section>

        {/* SECTION: FINAL CTA BANNER */}
        <section className="px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto w-full">
          <div className="rounded-3xl border border-rose-500/30 bg-gradient-to-r from-rose-900/60 via-pink-900/60 to-rose-950/60 p-8 sm:p-12 text-center shadow-2xl backdrop-blur-2xl space-y-4">
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              Ready to make someone smile today?
            </h2>
            <p className="text-sm text-rose-200/80 max-w-md mx-auto">
              Create your customized romantic page, Valentine invite, or couple quiz now.
            </p>
            <div className="pt-2">
              <button
                onClick={() => {
                  setIsCreateOpen(true);
                  sfx.playChime();
                }}
                className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-rose-600 via-rose-500 to-pink-600 px-8 py-4 text-base font-bold text-white shadow-xl shadow-rose-600/40 hover:brightness-110 active:scale-95 transition-all cursor-pointer"
              >
                <Heart className="h-5 w-5 fill-white" />
                <span>Create Something Special ✨</span>
              </button>
            </div>
          </div>
        </section>
      </main>

      <Footer />

      {/* Mobile Bottom Bar for native app feel */}
      <MobileBottomNav onOpenCreate={() => setIsCreateOpen(true)} />

      {/* Advanced Experience Creation Modal */}
      <AdvancedExperienceCreator
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
      />

      {/* Onboarding Flow Modal */}
      <OnboardingModal
        isOpen={isOnboardingOpen}
        onClose={() => setIsOnboardingOpen(false)}
        onStartCreate={() => setIsCreateOpen(true)}
      />
    </div>
  );
}
