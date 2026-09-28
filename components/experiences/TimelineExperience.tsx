'use client';

import React, { useState } from 'react';
import { Heart, Sparkles, Share2, Plus, Calendar, Compass } from 'lucide-react';
import Link from 'next/link';
import { ExperienceData, TimelineItem } from '@/types/experience';
import { THEMES } from '@/lib/themes';
import RomanticBackground from '@/components/common/RomanticBackground';
import ReactionFloaters from '@/components/common/ReactionFloaters';
import ShareModal from '@/components/common/ShareModal';
import { sfx } from '@/lib/audio';

interface TimelineExperienceProps {
  experience: ExperienceData;
  isCreatorPreview?: boolean;
}

const DEFAULT_TIMELINE: TimelineItem[] = [
  { id: 't1', date: 'The Beginning', title: 'The First Glance', description: 'When our eyes met and the entire room suddenly became quiet.', emoji: '✨' },
  { id: 't2', date: 'A Few Days Later', title: 'Our First Coffee Date', description: 'We ordered two lattes and talked for hours until the cafe closed.', emoji: '☕' },
  { id: 't3', date: 'Month 3', title: 'The Roadtrip & Inside Jokes', description: 'Singing terribly to nostalgic playlists with the windows rolled down.', emoji: '🚗' },
  { id: 't4', date: 'Year 1', title: 'Building a Home Together', description: 'Realizing that home isn’t a zip code, it’s wherever your arms are.', emoji: '🏡' },
  { id: 't5', date: 'Today & Always', title: 'Our Next Great Chapter', description: 'Still falling more deeply in love with you every single sunrise.', emoji: '💍' },
];

export default function TimelineExperience({
  experience,
  isCreatorPreview = false,
}: TimelineExperienceProps) {
  const [isShareOpen, setIsShareOpen] = useState(false);
  const items = experience.timelineItems && experience.timelineItems.length > 0 
    ? experience.timelineItems 
    : DEFAULT_TIMELINE;

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
            <span>Share Timeline</span>
          </button>
        </div>
      </header>

      {/* Main Timeline Body */}
      <main className="relative z-10 flex-1 max-w-3xl mx-auto w-full p-4 sm:p-6 space-y-8 my-auto">
        <div className="rounded-3xl border border-rose-500/25 bg-[#170918]/85 p-6 sm:p-10 shadow-2xl backdrop-blur-2xl text-center space-y-6">
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-rose-400 uppercase tracking-widest">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Our Relationship Story</span>
            <Sparkles className="h-3.5 w-3.5" />
          </div>

          <div className="space-y-2">
            <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight font-serif">
              {experience.title || 'The Chapters of Us'}
            </h1>
            <p className="text-xs sm:text-sm text-rose-300/80">
              Dedicated to <span className="text-white font-bold">{experience.recipientName || 'You'}</span> with love from <span className="text-rose-200 font-semibold">{experience.senderName}</span>
            </p>
            {experience.message && (
              <p className="text-sm text-rose-200/90 italic pt-2 max-w-md mx-auto">
                &ldquo;{experience.message}&rdquo;
              </p>
            )}
          </div>

          {/* Vertical Romantic Stepper Timeline */}
          <div className="relative pt-6 pb-2 text-left space-y-8">
            <div className="absolute left-6 sm:left-8 top-10 bottom-10 w-0.5 bg-gradient-to-b from-rose-500 via-pink-500 to-rose-700/30" />

            {items.map((item, idx) => (
              <div key={item.id || idx} className="relative flex items-start gap-4 sm:gap-6 group">
                {/* Node icon */}
                <div className="relative z-10 flex h-12 w-12 sm:h-14 sm:w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-tr from-rose-600 to-pink-500 text-white shadow-lg shadow-rose-600/30 group-hover:scale-110 transition-transform">
                  <span className="text-xl sm:text-2xl">{item.emoji || '💖'}</span>
                </div>

                {/* Milestone Content Card */}
                <div className="flex-1 rounded-2xl border border-rose-500/20 bg-rose-950/30 p-5 backdrop-blur-md group-hover:border-rose-400/40 transition-colors">
                  <div className="flex items-center justify-between text-xs text-rose-400 font-mono mb-1">
                    <span>{item.date}</span>
                    <span className="text-[10px] uppercase font-bold text-rose-300/60">Milestone #{idx + 1}</span>
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-white mb-1">
                    {item.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-rose-200/80 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Action Row */}
          <div className="pt-4 flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => setIsShareOpen(true)}
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-rose-600 via-rose-500 to-pink-600 px-6 py-3 text-xs sm:text-sm font-bold text-white shadow-lg shadow-rose-600/30 hover:brightness-110 active:scale-95 transition-all"
            >
              <Share2 className="h-4 w-4" />
              <span>Share Our Story Link</span>
            </button>
          </div>

          {/* Reactions */}
          <div className="pt-2">
            <span className="text-[11px] text-rose-300/70 block mb-1">
              Send your reaction to {experience.senderName}:
            </span>
            <ReactionFloaters slug={experience.slug} initialReactions={experience.reactions} />
          </div>
        </div>

        {/* Create CTA */}
        <div className="text-center py-2">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs text-rose-400 hover:text-white transition-colors"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Create your own couple milestone timeline</span>
          </Link>
        </div>
      </main>

      {/* Share Modal */}
      <ShareModal
        isOpen={isShareOpen}
        onClose={() => setIsShareOpen(false)}
        url={`/timeline/${experience.slug}`}
        title={`The Love Timeline of ${experience.senderName} & ${experience.recipientName}`}
        names={`${experience.senderName} + ${experience.recipientName}`}
        subtitle="A beautiful milestone timeline of our love story ✨"
        theme={experience.theme}
      />
    </div>
  );
}
