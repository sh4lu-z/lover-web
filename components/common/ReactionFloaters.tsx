'use client';

import React, { useState } from 'react';
import { sfx } from '@/lib/audio';
import { fetchSecureApi } from '@/lib/crypto';

interface ReactionFloatersProps {
  slug: string;
  initialReactions?: Record<string, number>;
}

interface FloatingEmoji {
  id: number;
  emoji: string;
  x: number;
  y: number;
}

const EMOJI_OPTIONS = [
  { emoji: '❤️', label: 'Love' },
  { emoji: '💖', label: 'Sparkle Heart' },
  { emoji: '🥰', label: 'Adore' },
  { emoji: '😍', label: 'Crush' },
  { emoji: '🌹', label: 'Rose' },
  { emoji: '✨', label: 'Magic' },
  { emoji: '💌', label: 'Letter' },
  { emoji: '💍', label: 'Forever' },
];


export default function ReactionFloaters({
  slug,
  initialReactions = {},
}: ReactionFloatersProps) {
  const [reactions, setReactions] = useState<Record<string, number>>(initialReactions);
  const [floatingItems, setFloatingItems] = useState<FloatingEmoji[]>([]);
  const idCounterRef = React.useRef(0);

  const handleReact = async (emoji: string, e: React.MouseEvent) => {
    sfx.playPop();

    // Spawn floating emoji from button position
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    idCounterRef.current += 1;
    const newId = idCounterRef.current;
    
    setFloatingItems((prev) => [

      ...prev,
      {
        id: newId,
        emoji,
        x: rect.left + rect.width / 2 + (Math.random() - 0.5) * 30,
        y: rect.top,
      },
    ]);

    // Update state immediately
    setReactions((prev) => ({
      ...prev,
      [emoji]: (prev[emoji] || 0) + 1,
    }));

    // Auto cleanup floating item after 2 seconds
    setTimeout(() => {
      setFloatingItems((prev) => prev.filter((item) => item.id !== newId));
    }, 2000);

    // Call server to persist reaction
    try {
      await fetchSecureApi(`/api/experiences/${slug}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reaction: emoji }),
      });
    } catch {
      // offline/client safe
    }
  };

  return (
    <div className="relative w-full">
      {/* Reaction Buttons Row */}
      <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 py-4">
        {EMOJI_OPTIONS.map(({ emoji, label }) => {
          const count = reactions[emoji] || 0;
          return (
            <button
              key={emoji}
              onClick={(e) => handleReact(emoji, e)}
              className="group relative flex items-center gap-1.5 rounded-full border border-rose-500/20 bg-rose-950/40 px-3.5 py-2 text-xs font-medium text-rose-100 hover:border-rose-400 hover:bg-rose-900/50 hover:scale-110 active:scale-95 transition-all shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500"
              title={`Send ${label}`}
            >
              <span className="text-base group-hover:animate-bounce">{emoji}</span>
              {count > 0 && (
                <span className="text-[11px] font-semibold text-rose-300 tabular-nums">
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Floating Animations Portal */}
      <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden" aria-hidden="true">
        {floatingItems.map((item) => (
          <div
            key={item.id}
            className="absolute text-3xl animate-float-up pointer-events-none"
            style={{
              left: `${item.x}px`,
              top: `${item.y}px`,
            }}
          >
            {item.emoji}
          </div>
        ))}
      </div>
    </div>
  );
}
