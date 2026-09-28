'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Volume2, VolumeX, Sparkles, Heart, Menu, X, Plus } from 'lucide-react';
import { sfx } from '@/lib/audio';

interface NavbarProps {
  onOpenCreate?: () => void;
  onOpenOnboarding?: () => void;
}

export default function Navbar({ onOpenCreate, onOpenOnboarding }: NavbarProps) {
  const [isMuted, setIsMuted] = useState(() => {
    if (typeof window !== 'undefined') {
      return sfx.getMuted();
    }
    return false;
  });
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleSound = () => {
    const muted = sfx.toggleMute();
    setIsMuted(muted);
    if (!muted) sfx.playPop();
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-rose-500/15 bg-[#0b070c]/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Zone 1: Single text element brand wordmark */}
        <Link 
          href="/" 
          className="group flex items-center gap-2 text-xl font-bold tracking-tight text-white transition-opacity hover:opacity-90"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-tr from-rose-600 to-pink-500 shadow-md shadow-rose-500/20 group-hover:scale-105 transition-transform">
            <Heart className="h-4 w-4 fill-white text-white" />
          </span>
          <span className="text-xl font-bold tracking-tight text-white">Lover</span>
        </Link>

        {/* Zone 2: 4-6 clean text navigation links */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-rose-200/80">
          <Link 
            href="/#valentine" 
            className="hover:text-white transition-colors hover:underline underline-offset-4 decoration-rose-500/50"
          >
            Valentine
          </Link>
          <Link 
            href="/#games" 
            className="hover:text-white transition-colors hover:underline underline-offset-4 decoration-rose-500/50"
          >
            Love Games
          </Link>
          <Link 
            href="/#discover" 
            className="hover:text-white transition-colors hover:underline underline-offset-4 decoration-rose-500/50"
          >
            Discover
          </Link>
          <button 
            onClick={() => onOpenOnboarding && onOpenOnboarding()}
            className="hover:text-white transition-colors hover:underline underline-offset-4 decoration-rose-500/50 text-left"
          >
            How It Works
          </button>
          <Link 
            href="/vault" 
            className="hover:text-white transition-colors hover:underline underline-offset-4 decoration-rose-500/50"
          >
            My Vault
          </Link>
        </nav>


        {/* Zone 3: 1-2 primary actions */}
        <div className="flex items-center gap-2.5">
          {/* Sound FX toggle */}
          <button
            onClick={toggleSound}
            aria-label={isMuted ? 'Unmute romantic sound effects' : 'Mute romantic sound effects'}
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-rose-500/20 bg-rose-950/30 text-rose-300 hover:border-rose-500/40 hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500"
            title={isMuted ? 'Sound muted (click to enable)' : 'Sound enabled (click to mute)'}
          >
            {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4 text-rose-400" />}
          </button>

          {/* Create Button */}
          {onOpenCreate ? (
            <button
              onClick={() => {
                sfx.playChime();
                onOpenCreate();
              }}
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-rose-600 via-rose-500 to-pink-600 px-4 py-2.5 text-xs sm:text-sm font-semibold text-white shadow-lg shadow-rose-600/25 transition-all hover:brightness-110 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-400 whitespace-nowrap"
            >
              <Plus className="h-4 w-4" />
              <span>Create Experience</span>
            </button>
          ) : (
            <Link
              href="/#create"
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-rose-600 via-rose-500 to-pink-600 px-4 py-2.5 text-xs sm:text-sm font-semibold text-white shadow-lg shadow-rose-600/25 transition-all hover:brightness-110 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-400 whitespace-nowrap"
            >
              <Sparkles className="h-4 w-4" />
              <span>Create Experience</span>
            </Link>
          )}

          {/* Mobile hamburger menu toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="flex h-10 w-10 md:hidden items-center justify-center rounded-lg border border-rose-500/20 bg-rose-950/30 text-rose-300 hover:text-white"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-rose-500/20 bg-[#0e0710]/95 px-4 py-4 backdrop-blur-2xl">
          <nav className="flex flex-col gap-3 text-sm font-medium text-rose-200">
            <Link 
              href="/#valentine" 
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg hover:bg-rose-500/10 transition-colors"
            >
              Valentine Invitation
            </Link>
            <Link 
              href="/#games" 
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg hover:bg-rose-500/10 transition-colors"
            >
              Love Games & Quiz
            </Link>
            <Link 
              href="/#surprise" 
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg hover:bg-rose-500/10 transition-colors"
            >
              Surprise & Secret Links
            </Link>
            <Link 
              href="/#discover" 
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg hover:bg-rose-500/10 transition-colors"
            >
              Discover Gallery
            </Link>
            <Link 
              href="/vault" 
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg hover:bg-rose-500/10 transition-colors"
            >
              My Love Vault
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
