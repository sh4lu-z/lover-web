'use client';

import React, { useState } from 'react';
import { Gift, Copy, Check, RefreshCw, Heart } from 'lucide-react';
import { sfx } from '@/lib/audio';

const COUPON_TEMPLATES = [
  { title: "One Free Massage", desc: "Good for a 30-minute back or foot massage.", color: "from-rose-400 to-pink-500" },
  { title: "Movie Night Choice", desc: "You pick the movie tonight, no complaints from me!", color: "from-purple-400 to-indigo-500" },
  { title: "Breakfast in Bed", desc: "Redeem for a delicious breakfast served right in bed.", color: "from-amber-400 to-orange-500" },
  { title: "Get Out of Jail Free", desc: "Wins one argument automatically. Use wisely!", color: "from-emerald-400 to-teal-500" },
  { title: "One Big Bear Hug", desc: "Redeemable anytime, anywhere. Guaranteed to make you smile.", color: "from-blue-400 to-cyan-500" },
  { title: "Yes Day", desc: "I have to say YES to whatever you ask for the next 3 hours.", color: "from-fuchsia-400 to-pink-600" },
  { title: "Chore Pass", desc: "I'll do one of your least favorite chores today.", color: "from-yellow-400 to-amber-600" },
  { title: "Late Night Snack Run", desc: "I will go get your favorite cravings, no questions asked.", color: "from-rose-500 to-red-600" }
];

export default function LoveCoupons() {
  const [coupon, setCoupon] = useState(COUPON_TEMPLATES[0]);
  const [copied, setCopied] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const generateRandom = () => {
    sfx.playPop();
    setIsGenerating(true);
    
    let next;
    do {
      next = COUPON_TEMPLATES[Math.floor(Math.random() * COUPON_TEMPLATES.length)];
    } while (next.title === coupon.title);
    
    setTimeout(() => {
      setCoupon(next);
      setIsGenerating(false);
    }, 400);
  };

  const handleCopy = () => {
    sfx.playChime();
    const text = `🎟️ LOVE COUPON 🎟️\n\n${coupon.title}\n${coupon.desc}\n\nRedeemable anytime! Made with ❤️ from Lover`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col items-center justify-center p-6 sm:p-10 w-full">
      <div className="text-center mb-8">
        <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center justify-center gap-2">
          <Gift className="h-7 w-7 text-rose-400" />
          Love Coupon Generator
        </h2>
        <p className="text-sm text-rose-200/70 mt-2">Generate digital coupons for your partner</p>
      </div>

      <div className={`relative w-full max-w-sm transition-transform duration-500 ${isGenerating ? 'scale-95 opacity-50 blur-sm' : 'scale-100 opacity-100'}`}>
        <div className="relative rounded-2xl overflow-hidden shadow-2xl">
          {/* Coupon Border Pattern */}
          <div className="absolute inset-x-0 top-0 h-4 bg-[radial-gradient(circle,transparent_4px,#fff_5px)] bg-[length:16px_16px] -mt-2 opacity-20"></div>
          
          <div className={`bg-gradient-to-br ${coupon.color} p-8 text-center text-white min-h-[220px] flex flex-col justify-center`}>
            <div className="mx-auto w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mb-4 backdrop-blur-sm border border-white/30">
              <Heart className="h-6 w-6 text-white fill-white" />
            </div>
            <h3 className="text-2xl font-bold mb-2 leading-tight drop-shadow-sm">{coupon.title}</h3>
            <p className="text-white/90 text-sm font-medium drop-shadow-sm">{coupon.desc}</p>
            
            <div className="mt-6 flex items-center justify-between border-t border-white/20 pt-4 text-xs font-mono font-bold tracking-widest text-white/70">
              <span>NO EXPIRATION</span>
              <span>1 USE ONLY</span>
            </div>
          </div>
          
          <div className="absolute inset-x-0 bottom-0 h-4 bg-[radial-gradient(circle,transparent_4px,#fff_5px)] bg-[length:16px_16px] -mb-2 opacity-20 rotate-180"></div>
        </div>
      </div>

      <div className="flex flex-wrap gap-4 mt-10 justify-center">
        <button
          onClick={generateRandom}
          className="flex items-center gap-2 rounded-xl bg-white/10 px-6 py-3 text-sm font-bold text-white shadow-lg backdrop-blur-md hover:bg-white/20 transition-all border border-rose-500/30"
        >
          <RefreshCw className={`h-4 w-4 ${isGenerating ? 'animate-spin' : ''}`} />
          <span>Draw Another</span>
        </button>

        <button
          onClick={handleCopy}
          className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-rose-500 to-pink-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-rose-500/25 hover:brightness-110 active:scale-95 transition-all"
        >
          {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          <span>{copied ? 'Copied!' : 'Copy to Send'}</span>
        </button>
      </div>
    </div>
  );
}
