'use client';

import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Sparkles, RefreshCw, Trophy, Heart } from 'lucide-react';
import { sfx } from '@/lib/audio';

const ICONS = ['💍', '💌', '🌹', '🍫', '🧸', '🥂'];

interface Card {
  id: number;
  icon: string;
  isFlipped: boolean;
  isMatched: boolean;
}

function createDeck(): Card[] {
  return [...ICONS, ...ICONS]
    .sort(() => Math.random() - 0.5)
    .map((icon, idx) => ({
      id: idx,
      icon,
      isFlipped: false,
      isMatched: false,
    }));
}

export default function MemoryMatchGame() {
  const [cards, setCards] = useState<Card[]>(createDeck);
  const [flippedIndices, setFlippedIndices] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [isWon, setIsWon] = useState(false);

  const initGame = () => {
    setCards(createDeck());
    setFlippedIndices([]);
    setMoves(0);
    setIsWon(false);
  };

  const handleCardClick = (index: number) => {
    if (cards[index].isFlipped || cards[index].isMatched || flippedIndices.length >= 2) {
      return;
    }

    sfx.playPop();
    const updatedCards = cards.map((c, i) => (i === index ? { ...c, isFlipped: true } : c));
    setCards(updatedCards);

    const newFlipped = [...flippedIndices, index];
    setFlippedIndices(newFlipped);

    if (newFlipped.length === 2) {
      setMoves((m) => m + 1);
      const [idx1, idx2] = newFlipped;

      if (updatedCards[idx1].icon === updatedCards[idx2].icon) {
        // Matched!
        sfx.playChime();
        const matchedDeck = updatedCards.map((c, i) =>
          i === idx1 || i === idx2 ? { ...c, isMatched: true } : c
        );
        setCards(matchedDeck);
        setFlippedIndices([]);

        // Check if all matched
        if (matchedDeck.every((c) => c.isMatched)) {
          setIsWon(true);
          sfx.playCelebration();
          confetti({
            particleCount: 50,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#f43f5e', '#ec4899', '#fda4af', '#fde047'],
          });
        }
      } else {
        // Not matched, flip back after brief pause
        setTimeout(() => {
          setCards((prev) =>
            prev.map((c, i) => (i === idx1 || i === idx2 ? { ...c, isFlipped: false } : c))
          );
          setFlippedIndices([]);
        }, 800);
      }
    }
  };


  return (
    <div className="w-full max-w-xl mx-auto rounded-3xl border border-rose-500/25 bg-[#160918]/85 p-6 sm:p-8 shadow-2xl backdrop-blur-2xl text-center space-y-6">
      <div className="inline-flex items-center gap-2 text-xs font-semibold text-rose-400 uppercase tracking-widest">
        <Sparkles className="h-3.5 w-3.5" />
        <span>Couple Mini-Game</span>
        <Sparkles className="h-3.5 w-3.5" />
      </div>

      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Romantic Memory Match
          </h2>
          <p className="text-xs text-rose-300/70">Find all 6 matching love tokens</p>
        </div>
        <div className="text-right">
          <span className="text-[10px] text-rose-400 uppercase tracking-wider block">Moves</span>
          <span className="text-lg font-black text-white tabular-nums">{moves}</span>
        </div>
      </div>

      {!isWon ? (
        <div className="grid grid-cols-4 sm:grid-cols-4 gap-2.5 sm:gap-3 py-2">
          {cards.map((card, idx) => (
            <button
              key={card.id}
              onClick={() => handleCardClick(idx)}
              className={`aspect-square rounded-2xl flex items-center justify-center text-2xl sm:text-3xl transition-all duration-300 cursor-pointer shadow-md ${
                card.isFlipped || card.isMatched
                  ? 'bg-rose-950/80 border-2 border-rose-400 rotate-0'
                  : 'bg-gradient-to-tr from-rose-900/60 to-pink-950/60 border border-rose-500/30 hover:border-rose-400 hover:scale-105 active:scale-95'
              }`}
            >
              {card.isFlipped || card.isMatched ? (
                <span>{card.icon}</span>
              ) : (
                <Heart className="h-5 w-5 text-rose-500/40 fill-rose-500/20" />
              )}
            </button>
          ))}
        </div>
      ) : (
        <div className="space-y-4 animate-fadeIn py-4">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-tr from-rose-500 to-pink-500 text-white shadow-xl shadow-rose-500/40 animate-bounce">
            <Trophy className="h-10 w-10" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-white">Pure Harmonic Chemistry! 💖</h3>
            <p className="text-xs sm:text-sm text-rose-200/90 mt-1">
              You cleared all pairs in just <span className="font-bold text-white">{moves} moves</span>! Your connection is in complete sync.
            </p>
          </div>
          <button
            onClick={initGame}
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-rose-600 via-rose-500 to-pink-600 px-5 py-2.5 text-xs sm:text-sm font-semibold text-white shadow-lg shadow-rose-600/30 hover:brightness-110 active:scale-95 transition-all"
          >
            <RefreshCw className="h-4 w-4" />
            <span>Play Again</span>
          </button>
        </div>
      )}
    </div>
  );
}
