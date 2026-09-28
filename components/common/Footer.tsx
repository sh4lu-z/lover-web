import React from 'react';
import Link from 'next/link';
import { Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="relative border-t border-rose-500/15 bg-[#080409] py-12 text-rose-300/80">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-tr from-rose-600 to-pink-500 text-white shadow-sm shadow-rose-600/30">
              <Heart className="h-3.5 w-3.5 fill-white" />
            </span>
            <span className="text-base font-bold text-white tracking-tight">Lover</span>
            <span className="text-xs text-rose-400/60">· Share love in seconds</span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 text-xs sm:text-sm text-rose-300/70">
            <Link href="/#valentine" className="hover:text-rose-100 transition-colors">
              Valentine Experience
            </Link>
            <Link href="/#games" className="hover:text-rose-100 transition-colors">
              Love Calculator
            </Link>
            <Link href="/#surprise" className="hover:text-rose-100 transition-colors">
              Secret Envelope
            </Link>
            <Link href="/vault" className="hover:text-rose-100 transition-colors">
              My Vault
            </Link>
          </div>

          <div className="text-xs text-rose-400/60 text-center md:text-right">
            Crafted for lovers, soulmates & secret admirers.
          </div>
        </div>
      </div>
    </footer>
  );
}
