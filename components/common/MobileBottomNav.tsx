'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Heart, Gamepad2, FolderHeart, Sparkles, Plus } from 'lucide-react';
import { sfx } from '@/lib/audio';

interface MobileBottomNavProps {
  onOpenCreate: () => void;
}

export default function MobileBottomNav({ onOpenCreate }: MobileBottomNavProps) {
  const pathname = usePathname();

  const isHome = pathname === '/';
  const isVault = pathname.startsWith('/vault');

  return (
    <nav 
      aria-label="Mobile Bottom Navigation"
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#0e0610]/90 backdrop-blur-xl border-t border-rose-500/20 px-3 py-2 pb-safe"
    >
      <div className="grid grid-cols-5 items-center justify-items-center max-w-md mx-auto">
        {/* Tab 1: Home */}
        <Link
          href="/"
          onClick={() => sfx.playPop()}
          className={`flex flex-col items-center justify-center min-h-[44px] min-w-[44px] py-1 ${
            isHome ? 'text-rose-400 font-bold' : 'text-rose-200/60 hover:text-white'
          }`}
        >
          <Heart className={`h-5 w-5 ${isHome ? 'fill-rose-400' : ''}`} />
          <span className="text-[10px] mt-0.5 tracking-tight">Home</span>
        </Link>

        {/* Tab 2: Valentine */}
        <Link
          href="/#valentine"
          onClick={() => sfx.playPop()}
          className="flex flex-col items-center justify-center min-h-[44px] min-w-[44px] py-1 text-rose-200/60 hover:text-white"
        >
          <Sparkles className="h-5 w-5 text-rose-400" />
          <span className="text-[10px] mt-0.5 tracking-tight">Valentine</span>
        </Link>

        {/* Center Prominent CTA: Create */}
        <button
          onClick={() => {
            sfx.playChime();
            onOpenCreate();
          }}
          className="flex flex-col items-center justify-center -mt-4 bg-gradient-to-tr from-rose-600 to-pink-500 text-white rounded-full h-12 w-12 shadow-lg shadow-rose-600/40 active:scale-95 transition-transform"
          aria-label="Create experience"
        >
          <Plus className="h-6 w-6" />
        </button>

        {/* Tab 4: Games */}
        <Link
          href="/#games"
          onClick={() => sfx.playPop()}
          className="flex flex-col items-center justify-center min-h-[44px] min-w-[44px] py-1 text-rose-200/60 hover:text-white"
        >
          <Gamepad2 className="h-5 w-5" />
          <span className="text-[10px] mt-0.5 tracking-tight">Games</span>
        </Link>

        {/* Tab 5: Vault */}
        <Link
          href="/vault"
          onClick={() => sfx.playPop()}
          className={`flex flex-col items-center justify-center min-h-[44px] min-w-[44px] py-1 ${
            isVault ? 'text-rose-400 font-bold' : 'text-rose-200/60 hover:text-white'
          }`}
        >
          <FolderHeart className={`h-5 w-5 ${isVault ? 'fill-rose-400/20' : ''}`} />
          <span className="text-[10px] mt-0.5 tracking-tight">Vault</span>
        </Link>
      </div>
    </nav>
  );
}
