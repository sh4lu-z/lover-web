'use client';

import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { Sparkles, Shuffle, Check, Calendar, Heart, Clock, DollarSign, Copy } from 'lucide-react';
import { sfx } from '@/lib/audio';

interface DateIdea {
  id: string;
  category: 'cozy' | 'adventure' | 'foodie' | 'budget' | 'luxury';
  title: string;
  description: string;
  duration: string;
  cost: '$' | '$$' | '$$$';
  tip: string;
}

const DATE_IDEAS: DateIdea[] = [
  {
    id: 'd1',
    category: 'cozy',
    title: 'Living Room Blanket Fort & Ghibli Marathon',
    description: 'Build an elaborate blanket fort using all pillows and fairy lights, make homemade hot chocolate with marshmallows, and binge cozy movies.',
    duration: '3-4 hours',
    cost: '$',
    tip: 'No phones allowed inside the fort except for movie audio!',
  },
  {
    id: 'd2',
    category: 'foodie',
    title: 'The Great Blindfolded Dessert Tasting Contest',
    description: 'Each person secretly buys 3 random unique pastries or sweets from local bakeries. Take turns blindfolding each other and guessing the flavors!',
    duration: '2 hours',
    cost: '$$',
    tip: 'Winner gets their breakfast in bed made the next morning.',
  },
  {
    id: 'd3',
    category: 'adventure',
    title: 'Sunset Rooftop or Hilltop Stargazing Picnic',
    description: 'Pack a warm thermos, strawberries, cheese board, and drive up to the highest scenic viewpoint right as the golden hour fades into stars.',
    duration: '2-3 hours',
    cost: '$',
    tip: 'Download a stargazing app like SkyView to spot constellations together.',
  },
  {
    id: 'd4',
    category: 'foodie',
    title: 'Homemade Pasta & Candlelight MasterChef Night',
    description: 'Put on an Italian jazz playlist, uncork a bottle of wine, and roll fresh handmade fettuccine dough from scratch together.',
    duration: '3 hours',
    cost: '$$',
    tip: 'Flour handprints on aprons are mandatory.',
  },
  {
    id: 'd5',
    category: 'budget',
    title: 'Bookstore Scavenger Hunt & Cafe Date',
    description: 'Visit a cozy local indie bookstore. You have 20 minutes to find: a book with their favorite color, a travel guide to your dream trip, and a love poem.',
    duration: '2 hours',
    cost: '$',
    tip: 'Leave a sweet sticky note hidden inside a romance novel for a stranger to find.',
  },
  {
    id: 'd6',
    category: 'luxury',
    title: 'Private Spa & Sunset Cocktail Lounge',
    description: 'Book a couples massage followed by dressing up to the nines for skyline rooftop cocktails and decadent chocolate fondue.',
    duration: '4-5 hours',
    cost: '$$$',
    tip: 'Wear the outfit your partner always compliments you in.',
  },
  {
    id: 'd7',
    category: 'adventure',
    title: 'Thrift Store Outfit Challenge Date',
    description: 'Go to a vintage thrift store with a $15 budget each. Pick out the most hilarious or stylish outfit for the other person to wear to dinner!',
    duration: '3 hours',
    cost: '$',
    tip: 'Take vintage polaroids in your newly acquired outfits.',
  },
  {
    id: 'd8',
    category: 'cozy',
    title: 'Midnight Baking & Pillow Talk Podcast',
    description: 'Bake warm chocolate chip cookies at midnight. Eat them warm while asking each other the 36 Questions That Lead to Love.',
    duration: '2 hours',
    cost: '$',
    tip: 'Glass of cold milk or vanilla oat milk is essential.',
  },
];

export default function DateIdeaGenerator() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [currentIdea, setCurrentIdea] = useState<DateIdea>(DATE_IDEAS[0]);
  const [isSpinning, setIsSpinning] = useState(false);
  const [isLocked, setIsLocked] = useState(false);
  const [copied, setCopied] = useState(false);

  const filterIdeas = DATE_IDEAS.filter(
    (idea) => selectedCategory === 'all' || idea.category === selectedCategory
  );

  const handleShuffle = () => {
    setIsSpinning(true);
    setIsLocked(false);
    sfx.playChime();

    let counter = 0;
    const interval = setInterval(() => {
      const randomIdx = Math.floor(Math.random() * filterIdeas.length);
      setCurrentIdea(filterIdeas[randomIdx]);
      counter++;
      if (counter > 8) {
        clearInterval(interval);
        setIsSpinning(false);
        sfx.playPop();
      }
    }, 80);
  };

  const handleLockIn = () => {
    setIsLocked(true);
    sfx.playCelebration();
    confetti({
      particleCount: 40,
      spread: 60,
      origin: { y: 0.7 },
      colors: ['#f43f5e', '#ec4899', '#fda4af', '#f59e0b'],
    });
  };

  const handleCopyDate = () => {
    const text = `Hey! ❤️ I locked in our next date idea: "${currentIdea.title}"\n${currentIdea.description}\nLet's do this soon! ✨`;
    navigator.clipboard.writeText(text);
    sfx.playPop();
    setCopied(true);
    setTimeout(() => setCopied(false), 2400);
  };

  return (
    <div className="w-full max-w-xl mx-auto rounded-3xl border border-rose-500/25 bg-[#160918]/85 p-6 sm:p-8 shadow-2xl backdrop-blur-2xl text-center space-y-6">
      <div className="inline-flex items-center gap-2 text-xs font-semibold text-rose-400 uppercase tracking-widest">
        <Calendar className="h-3.5 w-3.5" />
        <span>Date Night Roulette</span>
        <Sparkles className="h-3.5 w-3.5" />
      </div>

      <div className="space-y-1">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Date Idea Generator
        </h2>
        <p className="text-xs sm:text-sm text-rose-300/70">
          Never ask &ldquo;what do you want to do tonight?&rdquo; again!
        </p>
      </div>

      {/* Category selector */}
      <div className="flex flex-wrap items-center justify-center gap-1.5 p-1 bg-rose-950/40 rounded-xl border border-rose-500/15">
        {[
          { id: 'all', label: 'All Vibes' },
          { id: 'cozy', label: 'Cozy Home' },
          { id: 'adventure', label: 'Adventure' },
          { id: 'foodie', label: 'Foodie' },
          { id: 'budget', label: 'Budget' },
          { id: 'luxury', label: 'Luxury' },
        ].map((cat) => (
          <button
            key={cat.id}
            onClick={() => {
              setSelectedCategory(cat.id);
              sfx.playPop();
            }}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              selectedCategory === cat.id
                ? 'bg-rose-600 text-white shadow'
                : 'text-rose-300 hover:text-white'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Date Idea Card */}
      <div className={`relative rounded-2xl border border-rose-500/30 bg-gradient-to-b from-rose-950/50 to-rose-950/20 p-6 text-left transition-all ${isSpinning ? 'opacity-50 scale-95 blur-[1px]' : 'opacity-100 scale-100'}`}>
        <div className="flex items-center justify-between text-xs text-rose-400 mb-2 font-mono">
          <span className="flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" />
            <span>{currentIdea.duration}</span>
          </span>
          <span className="flex items-center gap-1">
            <DollarSign className="h-3.5 w-3.5" />
            <span className="font-bold">{currentIdea.cost}</span>
          </span>
        </div>

        <h3 className="text-lg sm:text-xl font-bold text-white mb-2 leading-snug">
          {currentIdea.title}
        </h3>

        <p className="text-xs sm:text-sm text-rose-200/90 leading-relaxed mb-4">
          {currentIdea.description}
        </p>

        <div className="rounded-xl border border-rose-500/15 bg-rose-950/40 p-3 text-xs text-rose-300/80">
          <span className="font-bold text-rose-300 mr-1">Pro-Tip:</span>
          <span>{currentIdea.tip}</span>
        </div>
      </div>

      {/* Action Controls */}
      <div className="flex flex-wrap items-center justify-center gap-3">
        <button
          onClick={handleShuffle}
          disabled={isSpinning}
          className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-rose-600 via-rose-500 to-pink-600 px-5 py-2.5 text-xs sm:text-sm font-semibold text-white shadow-lg shadow-rose-600/30 hover:brightness-110 active:scale-95 transition-all"
        >
          <Shuffle className={`h-4 w-4 ${isSpinning ? 'animate-spin' : ''}`} />
          <span>Spin New Idea</span>
        </button>

        {!isLocked ? (
          <button
            onClick={handleLockIn}
            className="flex items-center gap-1.5 rounded-xl border border-rose-500/30 bg-rose-950/40 px-4 py-2.5 text-xs sm:text-sm font-semibold text-rose-200 hover:text-white transition-all active:scale-95"
          >
            <Heart className="h-3.5 w-3.5 text-rose-400" />
            <span>Lock It In! 🔒</span>
          </button>
        ) : (
          <button
            onClick={handleCopyDate}
            className="flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2.5 text-xs sm:text-sm font-semibold text-white transition-all active:scale-95 shadow-lg shadow-emerald-600/30"
          >
            {copied ? (
              <>
                <Check className="h-3.5 w-3.5" />
                <span>Invite Copied!</span>
              </>
            ) : (
              <>
                <Copy className="h-3.5 w-3.5" />
                <span>Copy Date Invite</span>
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
}
