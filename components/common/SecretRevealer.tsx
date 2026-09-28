'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Heart, Key, Lock, Gift, Mail, Sparkles } from 'lucide-react';
import { RevealStyle } from '@/types/experience';
import { sfx } from '@/lib/audio';

interface SecretRevealerProps {
  revealStyle?: RevealStyle;
  onReveal: () => void;
  senderName: string;
  recipientName: string;
}

export default function SecretRevealer({
  revealStyle = 'wax_seal',
  onReveal,
  senderName,
  recipientName,
}: SecretRevealerProps) {
  const [scratchProgress, setScratchProgress] = useState(0);
  const [unlockedHearts, setUnlockedHearts] = useState<number[]>([]);
  const [keyInserted, setKeyInserted] = useState(false);
  const [ribbonUntied, setRibbonUntied] = useState(false);
  const [curtainsOpened, setCurtainsOpened] = useState(false);
  const [cardFlipped, setCardFlipped] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Scratch card canvas setup
  const initScratchCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = canvas.offsetWidth || 300;
    canvas.height = canvas.offsetHeight || 180;

    // Metallic silver/rose cover
    const grad = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    grad.addColorStop(0, '#be185d');
    grad.addColorStop(0.5, '#e11d48');
    grad.addColorStop(1, '#9d174d');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 15px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('✨ Scratch here with finger or mouse ✨', canvas.width / 2, canvas.height / 2 + 5);
  }, []);

  useEffect(() => {
    if (revealStyle === 'scratch') {
      initScratchCanvas();
    }
  }, [revealStyle, initScratchCanvas]);

  const handleScratchMove = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    const x = clientX - rect.left;
    const y = clientY - rect.top;

    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.arc(x, y, 22, 0, Math.PI * 2);
    ctx.fill();

    setScratchProgress((prev) => {
      const next = prev + 3;
      if (next >= 60) {
        onReveal();
      }
      return next;
    });
  };

  // Heart unlock: tap 3 hearts
  const handleHeartTap = (idx: number) => {
    sfx.playPop();
    const updated = [...unlockedHearts, idx];
    setUnlockedHearts(updated);
    if (updated.length >= 3) {
      setTimeout(() => onReveal(), 400);
    }
  };

  // Gift box reveal
  const handleUntieRibbon = () => {
    sfx.playChime();
    setRibbonUntied(true);
    setTimeout(() => onReveal(), 600);
  };

  // Lock and key reveal
  const handleTurnKey = () => {
    sfx.playChime();
    setKeyInserted(true);
    setTimeout(() => onReveal(), 500);
  };

  // Curtains reveal
  const handleOpenCurtains = () => {
    sfx.playChime();
    setCurtainsOpened(true);
    setTimeout(() => onReveal(), 700);
  };

  // Mystery card reveal
  const handleFlipCard = () => {
    sfx.playPop();
    setCardFlipped(true);
    setTimeout(() => onReveal(), 600);
  };

  return (
    <div className="w-full flex flex-col items-center justify-center min-h-[220px]">
      {/* 1. Gift Box */}
      {revealStyle === 'gift_box' && (
        <div className="relative flex flex-col items-center space-y-4">
          <button
            onClick={handleUntieRibbon}
            className={`group relative flex h-28 w-28 items-center justify-center rounded-3xl bg-gradient-to-tr from-rose-700 via-pink-600 to-rose-500 shadow-2xl border-2 border-rose-400/40 cursor-pointer transition-transform ${
              ribbonUntied ? 'scale-110 -translate-y-2' : 'hover:scale-105 active:scale-95 animate-gentle-pulse'
            }`}
          >
            <Gift className="h-12 w-12 text-white" />
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-full bg-amber-400 text-slate-950 font-black text-[10px] uppercase shadow">
              Untie Me
            </div>
          </button>
          <span className="text-xs text-rose-300 font-medium">
            Tap the gift box to untie the romantic bow
          </span>
        </div>
      )}

      {/* 2. Lock & Key */}
      {revealStyle === 'lock_key' && (
        <div className="relative flex flex-col items-center space-y-4">
          <button
            onClick={handleTurnKey}
            className={`relative flex h-28 w-28 items-center justify-center rounded-full bg-gradient-to-tr from-amber-700 via-rose-700 to-amber-500 shadow-2xl border-2 border-amber-400/40 cursor-pointer transition-transform ${
              keyInserted ? 'rotate-90 scale-105' : 'hover:scale-105 active:scale-95 animate-gentle-pulse'
            }`}
          >
            <Lock className="h-10 w-10 text-white" />
            <div className="absolute -bottom-2 -right-2 flex h-10 w-10 items-center justify-center rounded-full bg-amber-400 text-slate-900 shadow-lg">
              <Key className="h-5 w-5" />
            </div>
          </button>
          <span className="text-xs text-amber-300 font-medium">
            Tap to insert key and unlock the heart padlock
          </span>
        </div>
      )}

      {/* 3. Heart Unlock (Tap 3 hearts) */}
      {revealStyle === 'heart_unlock' && (
        <div className="space-y-4 text-center">
          <span className="text-xs text-rose-300 font-medium block">
            Tap all 3 glowing hearts to open the capsule:
          </span>
          <div className="flex items-center justify-center gap-4">
            {[0, 1, 2].map((idx) => {
              const isFilled = unlockedHearts.includes(idx);
              return (
                <button
                  key={idx}
                  onClick={() => handleHeartTap(idx)}
                  className={`flex h-14 w-14 items-center justify-center rounded-2xl border transition-all cursor-pointer ${
                    isFilled
                      ? 'bg-rose-600 border-rose-400 text-white scale-110 shadow-lg shadow-rose-600/40'
                      : 'bg-rose-950/40 border-rose-500/30 text-rose-400 hover:scale-105'
                  }`}
                >
                  <Heart className={`h-6 w-6 ${isFilled ? 'fill-white' : ''}`} />
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* 4. Scratch Reveal */}
      {revealStyle === 'scratch' && (
        <div className="relative w-full max-w-xs h-40 rounded-2xl overflow-hidden border-2 border-rose-500/30 shadow-2xl flex items-center justify-center bg-rose-950/50">
          <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center">
            <Sparkles className="h-6 w-6 text-rose-400 mb-1" />
            <span className="text-sm font-bold text-white">Unlocking your secret...</span>
            <span className="text-xs text-rose-300/80 mt-1">Almost there!</span>
          </div>
          <canvas
            ref={canvasRef}
            onMouseMove={handleScratchMove}
            onTouchMove={handleScratchMove}
            className="absolute inset-0 w-full h-full cursor-crosshair touch-none"
          />
        </div>
      )}

      {/* 5. Velvet Curtain Reveal */}
      {revealStyle === 'curtain' && (
        <div className="relative w-full max-w-xs h-36 rounded-2xl overflow-hidden border border-rose-500/30 bg-[#160918] flex items-center justify-center shadow-2xl">
          <div
            className={`absolute left-0 top-0 bottom-0 w-1/2 bg-gradient-to-r from-red-950 via-rose-900 to-rose-950 transition-transform duration-700 border-r border-rose-500/30 z-10 ${
              curtainsOpened ? '-translate-x-full' : 'translate-x-0'
            }`}
          />
          <div
            className={`absolute right-0 top-0 bottom-0 w-1/2 bg-gradient-to-l from-red-950 via-rose-900 to-rose-950 transition-transform duration-700 border-l border-rose-500/30 z-10 ${
              curtainsOpened ? 'translate-x-full' : 'translate-x-0'
            }`}
          />
          <button
            onClick={handleOpenCurtains}
            className="z-20 flex items-center gap-2 rounded-xl bg-amber-500 px-4 py-2 text-xs font-bold text-slate-950 shadow hover:bg-amber-400 active:scale-95 transition-all"
          >
            <Sparkles className="h-4 w-4" />
            <span>Draw Curtains ✨</span>
          </button>
        </div>
      )}

      {/* 6. Mystery Card Flip */}
      {revealStyle === 'mystery_card' && (
        <button
          onClick={handleFlipCard}
          className={`relative w-40 h-56 rounded-2xl border-2 border-rose-400/40 bg-gradient-to-b from-[#250d28] to-[#120515] shadow-2xl flex flex-col items-center justify-center p-4 transition-all duration-500 cursor-pointer ${
            cardFlipped ? 'rotate-y-180 scale-105' : 'hover:scale-105 active:scale-95 animate-gentle-pulse'
          }`}
        >
          <Sparkles className="h-8 w-8 text-rose-400 mb-2" />
          <span className="text-xs font-bold text-white uppercase tracking-wider">The Lovers</span>
          <span className="text-[10px] text-rose-300/70 mt-1">Tap card to flip destiny</span>
        </button>
      )}

      {/* 7. Default Wax Seal / Envelope */}
      {(revealStyle === 'wax_seal' || revealStyle === 'envelope') && (
        <div className="relative mx-auto max-w-xs aspect-[4/3] w-full rounded-2xl border border-amber-500/30 bg-gradient-to-b from-[#2a1324] to-[#1a0a16] shadow-2xl flex flex-col items-center justify-center p-6 overflow-hidden">
          <Mail className="h-16 w-16 text-rose-400/40 mb-3" />
          <button
            onClick={() => {
              sfx.playChime();
              onReveal();
            }}
            className="group relative flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-tr from-amber-600 via-rose-600 to-amber-500 shadow-xl shadow-amber-600/30 hover:scale-105 active:scale-95 transition-all cursor-pointer animate-gentle-pulse"
            aria-label="Tap wax seal to open secret letter"
          >
            <div className="flex flex-col items-center justify-center text-white">
              <Heart className="h-6 w-6 fill-white" />
              <span className="text-[10px] font-bold tracking-wider uppercase mt-0.5">OPEN</span>
            </div>
          </button>
          <p className="text-[11px] text-amber-300/80 mt-4 font-medium tracking-wide">
            ✨ Tap the golden seal to unlock ✨
          </p>
        </div>
      )}
    </div>
  );
}
