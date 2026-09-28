'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Heart, 
  Share2, 
  Trash2, 
  ExternalLink, 
  Plus, 
  Eye, 
  Sparkles, 
  Check, 
  Copy, 
  QrCode, 
  Award,
  ArrowLeft,
  Users,
  Clock,
  BarChart3,
  HelpCircle
} from 'lucide-react';
import { ExperienceData } from '@/types/experience';
import Navbar from '@/components/common/Navbar';
import Footer from '@/components/common/Footer';
import RomanticBackground from '@/components/common/RomanticBackground';
import AdvancedExperienceCreator from '@/components/create/AdvancedExperienceCreator';
import ShareModal from '@/components/common/ShareModal';
import { sfx } from '@/lib/audio';
import { getAppUrl } from '@/lib/config';
import { fetchSecureApi } from '@/lib/crypto';


export default function VaultPage() {
  const [experiences, setExperiences] = useState<ExperienceData[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [copiedSlug, setCopiedSlug] = useState<string | null>(null);
  const [activeShare, setActiveShare] = useState<ExperienceData | null>(null);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        let localList: ExperienceData[] = [];
        if (typeof window !== 'undefined') {
          const localRaw = localStorage.getItem('lover_my_vault');
          if (localRaw) {
            try {
              localList = JSON.parse(localRaw);
            } catch {
              // ignore
            }
          }
        }

        let serverList: ExperienceData[] = [];
        if (localList.length > 0) {
          const slugs = localList.map((e) => e.slug).filter(Boolean).join(',');
          const res = await fetch(`/api/experiences?slugs=${encodeURIComponent(slugs)}`);
          const data = await res.json();
          if (data.success && Array.isArray(data.experiences)) {
            serverList = data.experiences;
          }
        }

        const map = new Map<string, ExperienceData>();
        // Add server data first (most updated reactions & stats)
        serverList.forEach((e) => map.set(e.slug, e));
        // Fill in any local items that might not have fetched yet
        localList.forEach((e) => {
          if (!map.has(e.slug)) map.set(e.slug, e);
        });

        const merged = Array.from(map.values());

        if (mounted) {
          setExperiences(merged);
          setLoading(false);
        }
      } catch (err) {
        console.error(err);
        if (mounted) {
          setLoading(false);
        }
      }
    };

    load();
    return () => {
      mounted = false;
    };
  }, []);

  const refreshExperiences = React.useCallback(async () => {
    try {
      let localList: ExperienceData[] = [];
      if (typeof window !== 'undefined') {
        const localRaw = localStorage.getItem('lover_my_vault');
        if (localRaw) {
          try {
            localList = JSON.parse(localRaw);
          } catch {
            // ignore
          }
        }
      }

      let serverList: ExperienceData[] = [];
      if (localList.length > 0) {
        const slugs = localList.map((e) => e.slug).filter(Boolean).join(',');
        const res = await fetch(`/api/experiences?slugs=${encodeURIComponent(slugs)}`);
        const data = await res.json();
        if (data.success && Array.isArray(data.experiences)) {
          serverList = data.experiences;
        }
      }

      const map = new Map<string, ExperienceData>();
      serverList.forEach((e) => map.set(e.slug, e));
      localList.forEach((e) => {
        if (!map.has(e.slug)) map.set(e.slug, e);
      });

      setExperiences(Array.from(map.values()));
    } catch {
      // ignore
    }
  }, []);

  const handleCopyLink = (exp: ExperienceData) => {
    const fullUrl = getAppUrl(getUrl(exp));
    
    navigator.clipboard.writeText(fullUrl);
    sfx.playPop();
    setCopiedSlug(exp.slug);
    setTimeout(() => setCopiedSlug(null), 2000);
  };

  const handleDelete = async (slug: string) => {
    if (!confirm('Are you sure you want to delete this experience?')) return;
    sfx.playPop();

    // Find the experience ID from local vault to use as delete authorization token
    const exp = experiences.find((e) => e.slug === slug);
    const deleteToken = exp?.id || '';

    // Remove from server (send creator token for authorization)
    try {
      await fetchSecureApi(`/api/experiences/${slug}?token=${encodeURIComponent(deleteToken)}`, {
        method: 'DELETE',
      });
    } catch {
      // fallback — still remove locally
    }

    // Remove from local storage
    if (typeof window !== 'undefined') {
      const localRaw = localStorage.getItem('lover_my_vault');
      if (localRaw) {
        try {
          const list: ExperienceData[] = JSON.parse(localRaw);
          const filtered = list.filter((e) => e.slug !== slug);
          localStorage.setItem('lover_my_vault', JSON.stringify(filtered));
        } catch {
          // ignore
        }
      }
    }

    setExperiences((prev) => prev.filter((e) => e.slug !== slug));
  };

  const getUrl = (exp: ExperienceData) => {
    if (exp.type === 'valentine') return `/valentine/${exp.slug}`;
    if (exp.type === 'love_letter') return `/letter/${exp.slug}`;
    if (exp.type === 'countdown') return `/countdown/${exp.slug}`;
    if (exp.type === 'timeline') return `/timeline/${exp.slug}`;
    if (exp.type === 'quiz') return `/quiz/${exp.slug}`;
    if (exp.type === 'surprise') return `/surprise/${exp.slug}`;
    return `/love/${exp.slug}`;
  };

  // Engagement stats calculations
  const totalViews = experiences.reduce((acc, curr) => acc + (curr.viewsCount || 0), 0);
  const totalUniqueViews = experiences.reduce((acc, curr) => acc + (curr.uniqueViews || Math.floor((curr.viewsCount || 1) * 0.7)), 0);
  const totalShares = experiences.reduce((acc, curr) => acc + (curr.sharesCount || 0), 0);
  const yesResponses = experiences.filter((e) => e.type === 'valentine' && e.yesClicked).length;
  const totalQuizAttempts = experiences.reduce((acc, curr) => acc + (curr.quizAttempts || 0), 0);
  const totalReactions = experiences.reduce((acc, curr) => {
    const reactionSum = Object.values(curr.reactions || {}).reduce((a, b) => a + b, 0);
    return acc + reactionSum;
  }, 0);

  // Highest view for visual scaling
  const maxExpView = Math.max(...experiences.map((e) => e.viewsCount || 1), 10);

  return (
    <div className="relative min-h-screen flex flex-col justify-between selection:bg-rose-500 selection:text-white">
      <RomanticBackground theme="romantic" />
      <Navbar onOpenCreate={() => setIsCreateOpen(true)} />

      <main className="relative z-10 mx-auto max-w-6xl w-full px-4 sm:px-6 lg:px-8 py-10 space-y-8 flex-1">
        {/* Back and Page Title */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <Link 
              href="/" 
              className="inline-flex items-center gap-1.5 text-xs text-rose-300 hover:text-white transition-colors mb-2"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Back to Home</span>
            </Link>
            <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              My Love Vault & Analytics
            </h1>
            <p className="text-sm text-rose-200/70 mt-1">
              Real-time engagement analytics, views, reactions, and quick link controls
            </p>
          </div>

          <button
            onClick={() => setIsCreateOpen(true)}
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-rose-600 via-rose-500 to-pink-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-rose-600/30 hover:brightness-110 active:scale-95 transition-all self-start sm:self-auto cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            <span>Create New Experience</span>
          </button>
        </div>

        {/* Engagement Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <div className="rounded-2xl border border-rose-500/20 bg-[#160918]/80 p-4 sm:p-5 backdrop-blur-xl">
            <div className="flex items-center justify-between text-xs text-rose-400 font-semibold uppercase tracking-wider mb-2">
              <span>Total Views</span>
              <Eye className="h-4 w-4 text-rose-400" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-white tabular-nums">
              {totalViews}
            </div>
            <p className="text-[11px] text-rose-300/60 mt-1">
              ~{totalUniqueViews} unique visitors
            </p>
          </div>

          <div className="rounded-2xl border border-rose-500/20 bg-[#160918]/80 p-4 sm:p-5 backdrop-blur-xl">
            <div className="flex items-center justify-between text-xs text-rose-400 font-semibold uppercase tracking-wider mb-2">
              <span>Reactions & Love</span>
              <Heart className="h-4 w-4 text-rose-400 fill-rose-400" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-rose-300 tabular-nums">
              {totalReactions} ❤️
            </div>
            <p className="text-[11px] text-rose-300/60 mt-1">
              Across all experiences
            </p>
          </div>

          <div className="rounded-2xl border border-rose-500/20 bg-[#160918]/80 p-4 sm:p-5 backdrop-blur-xl">
            <div className="flex items-center justify-between text-xs text-rose-400 font-semibold uppercase tracking-wider mb-2">
              <span>Yes & Quizzes</span>
              <Award className="h-4 w-4 text-rose-400" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-white tabular-nums">
              {yesResponses} Yes · {totalQuizAttempts} Quizzes
            </div>
            <p className="text-[11px] text-rose-300/60 mt-1">Interactive responses</p>
          </div>

          <div className="rounded-2xl border border-rose-500/20 bg-[#160918]/80 p-4 sm:p-5 backdrop-blur-xl">
            <div className="flex items-center justify-between text-xs text-rose-400 font-semibold uppercase tracking-wider mb-2">
              <span>Shares Generated</span>
              <Share2 className="h-4 w-4 text-rose-400" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-white tabular-nums">
              {totalShares}
            </div>
            <p className="text-[11px] text-rose-300/60 mt-1">Link copies & QR cards</p>
          </div>
        </div>

        {/* Lightweight Visual Bar Chart for Top Experiences */}
        {experiences.length > 0 && (
          <div className="rounded-3xl border border-rose-500/20 bg-[#160918]/80 p-5 sm:p-6 backdrop-blur-xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4 text-rose-400" />
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                  Experience Engagement Overview
                </h3>
              </div>
              <span className="text-xs text-rose-400/70 font-mono">Relative Views & Traffic</span>
            </div>

            <div className="space-y-3 pt-1">
              {experiences.slice(0, 5).map((exp) => {
                const pct = Math.min(100, Math.max(12, Math.round(((exp.viewsCount || 1) / maxExpView) * 100)));
                return (
                  <div key={exp.id} className="space-y-1">
                    <div className="flex items-center justify-between text-xs text-rose-200">
                      <span className="font-semibold truncate max-w-[200px] sm:max-w-xs">{exp.title}</span>
                      <span className="font-mono tabular-nums text-rose-400">{exp.viewsCount || 0} views · {exp.sharesCount || 0} shares</span>
                    </div>
                    <div className="h-2 w-full bg-rose-950/60 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-rose-600 via-rose-500 to-pink-500 rounded-full transition-all duration-500"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Experiences List */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <span>Your Active Experiences</span>
            <span className="text-xs font-mono text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded-full border border-rose-500/20">
              {experiences.length}
            </span>
          </h2>

          {loading ? (
            <div className="text-center py-12 text-rose-300/60">
              Loading your love experiences...
            </div>
          ) : experiences.length === 0 ? (
            /* Empty state */
            <div className="rounded-3xl border border-dashed border-rose-500/30 bg-[#140916]/60 p-12 text-center space-y-4">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-rose-950/50 text-rose-400">
                <Heart className="h-8 w-8" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">No experiences created yet</h3>
                <p className="text-xs sm:text-sm text-rose-300/70 mt-1 max-w-sm mx-auto">
                  Create a playful runaway-button Valentine invite, love letter, or couple quiz in just 30 seconds!
                </p>
              </div>
              <button
                onClick={() => setIsCreateOpen(true)}
                className="inline-flex items-center gap-2 rounded-xl bg-rose-600 px-5 py-2.5 text-xs sm:text-sm font-semibold text-white shadow-lg hover:bg-rose-500 transition-all"
              >
                <Plus className="h-4 w-4" />
                <span>Create Your First Experience</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {experiences.map((exp) => {
                const targetUrl = getUrl(exp);
                return (
                  <div
                    key={exp.id}
                    className="relative rounded-2xl border border-rose-500/20 bg-[#170918]/85 p-5 shadow-lg backdrop-blur-xl flex flex-col justify-between gap-4 hover:border-rose-500/40 transition-all"
                  >
                    <div>
                      {/* Top labels */}
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-rose-400 px-2 py-0.5 rounded-md bg-rose-500/10 border border-rose-500/20">
                          {exp.type.replace('_', ' ')}
                        </span>
                        <div className="flex items-center gap-3 text-[11px] text-rose-300/70 font-mono">
                          <span className="flex items-center gap-1">
                            <Eye className="h-3 w-3" />
                            <span>{exp.viewsCount || 0}</span>
                          </span>
                          <span className="flex items-center gap-1">
                            <Share2 className="h-3 w-3" />
                            <span>{exp.sharesCount || 0}</span>
                          </span>
                        </div>
                      </div>

                      {/* Title & names */}
                      <h3 className="text-base sm:text-lg font-bold text-white line-clamp-1">
                        {exp.title}
                      </h3>
                      <p className="text-xs text-rose-300/80 mt-0.5">
                        {exp.senderName} {exp.recipientName ? `→ ${exp.recipientName}` : ''}
                      </p>

                      {/* Snippet */}
                      {exp.message && (
                        <p className="text-xs text-rose-200/60 line-clamp-2 mt-2 italic">
                          &ldquo;{exp.message}&rdquo;
                        </p>
                      )}

                      {/* Yes badge for Valentine */}
                      {exp.type === 'valentine' && exp.yesClicked && (
                        <div className="mt-3 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-950/60 border border-emerald-500/30 text-emerald-300 text-[11px] font-semibold">
                          <Award className="h-3.5 w-3.5 text-emerald-400" />
                          <span>She/He Said YES! Officially Sealed 💍</span>
                        </div>
                      )}
                    </div>

                    {/* Action Bar */}
                    <div className="flex items-center justify-between gap-2 pt-3 border-t border-rose-500/15">
                      <div className="flex items-center gap-2">
                        <Link
                          href={targetUrl}
                          className="flex items-center gap-1 text-xs font-semibold text-rose-300 hover:text-white transition-colors"
                        >
                          <ExternalLink className="h-3.5 w-3.5" />
                          <span>Open</span>
                        </Link>

                        <button
                          onClick={() => handleCopyLink(exp)}
                          className="flex items-center gap-1 text-xs font-semibold text-rose-300 hover:text-white transition-colors ml-2"
                        >
                          {copiedSlug === exp.slug ? (
                            <>
                              <Check className="h-3.5 w-3.5 text-emerald-400" />
                              <span className="text-emerald-300">Copied!</span>
                            </>
                          ) : (
                            <>
                              <Copy className="h-3.5 w-3.5" />
                              <span>Copy Link</span>
                            </>
                          )}
                        </button>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setActiveShare(exp)}
                          className="flex h-8 w-8 items-center justify-center rounded-lg border border-rose-500/20 bg-rose-950/40 text-rose-300 hover:border-rose-400 hover:text-white transition-colors"
                          title="Generate Share Card / QR Code"
                        >
                          <QrCode className="h-4 w-4" />
                        </button>

                        <button
                          onClick={() => handleDelete(exp.slug)}
                          className="flex h-8 w-8 items-center justify-center rounded-lg border border-rose-500/20 bg-rose-950/40 text-rose-400 hover:border-rose-600 hover:text-rose-200 transition-colors"
                          title="Delete experience"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>

      <Footer />

      {/* Advanced Creation Modal */}
      <AdvancedExperienceCreator
        isOpen={isCreateOpen}
        onClose={() => {
          setIsCreateOpen(false);
          refreshExperiences();
        }}
      />

      {/* Share Modal */}
      {activeShare && (
        <ShareModal
          isOpen={!!activeShare}
          onClose={() => setActiveShare(null)}
          url={getUrl(activeShare)}
          title={activeShare.title}
          names={`${activeShare.senderName} ${activeShare.recipientName ? `& ${activeShare.recipientName}` : ''}`}
          subtitle={activeShare.message?.substring(0, 80) || "A special experience created just for you ❤️"}
          theme={activeShare.theme}
        />
      )}
    </div>
  );
}
