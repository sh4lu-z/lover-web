'use client';

import React, { useState, useEffect } from 'react';
import { 
  X, Sparkles, Heart, Mail, HelpCircle, ArrowRight, ArrowLeft, Check, 
  Clock, GitCommit, Eye, Gift, Lock, Key, Layers, Palette 
} from 'lucide-react';
import { ExperienceType, ThemeType, RevealStyle, ExperienceData } from '@/types/experience';
import { THEMES } from '@/lib/themes';
import { sfx } from '@/lib/audio';
import { fetchSecureApi } from '@/lib/crypto';
import confetti from 'canvas-confetti';
import ShareModal from '@/components/common/ShareModal';
import { APP_DOMAIN } from '@/lib/config';


interface AdvancedCreatorProps {
  isOpen: boolean;
  onClose: () => void;
  initialType?: ExperienceType;
}

const TYPES_CATALOG: { id: ExperienceType; name: string; icon: React.ElementType; badge: string; desc: string }[] = [
  { id: 'valentine', name: 'Valentine Invite', icon: Heart, badge: 'Popular', desc: 'Playful runaway "No" button & official signed certificate' },
  { id: 'love_letter', name: 'Handwritten Letter', icon: Mail, badge: 'Emotional', desc: 'Textured envelope with animated handwriting reveal' },
  { id: 'surprise', name: 'Secret Capsule', icon: Sparkles, badge: 'Mystery', desc: '7 reveal modes: wax seal, scratch, gift box, or lock' },
  { id: 'quiz', name: 'Couple Quiz', icon: HelpCircle, badge: 'Fun', desc: '5 trivia questions testing how well they truly know you' },
  { id: 'timeline', name: 'Love Story Timeline', icon: GitCommit, badge: 'Romantic', desc: 'Chronicle relationship milestones from first meet to today' },
  { id: 'countdown', name: 'Love Countdown', icon: Clock, badge: 'Anticipation', desc: 'Live ticking countdown to anniversary, date night, or birthday' },
];

const REVEAL_STYLES: { id: RevealStyle; name: string; emoji: string }[] = [
  { id: 'wax_seal', name: 'Golden Wax Seal', emoji: '📜' },
  { id: 'scratch', name: 'Scratch Reveal', emoji: '✨' },
  { id: 'gift_box', name: 'Gift Box Ribbon', emoji: '🎁' },
  { id: 'lock_key', name: 'Heart Lock & Key', emoji: '🔐' },
  { id: 'heart_unlock', name: '3-Heart Unlock', emoji: '💖' },
  { id: 'curtain', name: 'Velvet Curtains', emoji: '🎭' },
  { id: 'mystery_card', name: 'Destiny Card Flip', emoji: '🃏' },
];

export default function AdvancedExperienceCreator({
  isOpen,
  onClose,
  initialType = 'valentine',
}: AdvancedCreatorProps) {
  const [step, setStep] = useState(1);
  const [type, setType] = useState<ExperienceType>(initialType);
  const [senderName, setSenderName] = useState('');
  const [recipientName, setRecipientName] = useState('');
  const [theme, setTheme] = useState<ThemeType>('valentine');
  const [revealStyle, setRevealStyle] = useState<RevealStyle>('wax_seal');
  const [customQuestion, setCustomQuestion] = useState('Will you be my Valentine?');
  const [message, setMessage] = useState('');
  const [secondaryMessage, setSecondaryMessage] = useState('');
  const [customSlug, setCustomSlug] = useState('');
  const [slugAvailable, setSlugAvailable] = useState<boolean | null>(null);
  const [checkingSlug, setCheckingSlug] = useState(false);
  const [countdownDate, setCountdownDate] = useState('2026-10-15');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdExperience, setCreatedExperience] = useState<ExperienceData | null>(null);
  const [showShareModal, setShowShareModal] = useState(false);

  // Reset all form state when modal opens fresh
  useEffect(() => {
    if (isOpen) {
      setStep(1);
      setType(initialType);
      setSenderName('');
      setRecipientName('');
      setTheme('valentine');
      setRevealStyle('wax_seal');
      setCustomQuestion('Will you be my Valentine?');
      setMessage('');
      setSecondaryMessage('');
      setCustomSlug('');
      setSlugAvailable(null);
      setCountdownDate('2026-10-15');
      setIsSubmitting(false);
      setCreatedExperience(null);
      setShowShareModal(false);
    }
  }, [isOpen, initialType]);

  // Check slug availability with debounce
  useEffect(() => {
    if (!customSlug.trim()) return;
    const timeout = setTimeout(async () => {
      setCheckingSlug(true);
      try {
        const res = await fetch(`/api/slug-check?slug=${encodeURIComponent(customSlug)}`);
        const data = await res.json();
        setSlugAvailable(data.available);
      } catch {
        setSlugAvailable(true);
      } finally {
        setCheckingSlug(false);
      }
    }, 300);

    return () => clearTimeout(timeout);
  }, [customSlug]);


  if (!isOpen) return null;

  const handleNextStep = () => {
    sfx.playPop();
    setStep((s) => Math.min(s + 1, 7));
  };

  const handlePrevStep = () => {
    sfx.playPop();
    setStep((s) => Math.max(s - 1, 1));
  };

  const handleSubmit = async () => {
    if (!senderName.trim()) return;
    setIsSubmitting(true);
    sfx.playChime();

    try {
      const payload: Partial<ExperienceData> = {
        type,
        theme,
        revealType: revealStyle,
        senderName: senderName.trim(),
        recipientName: recipientName.trim(),
        customQuestion: type === 'valentine' ? customQuestion : undefined,
        message: message.trim() || 'Thinking of you with all my heart.',
        secondaryMessage: secondaryMessage.trim() || undefined,
        slug: customSlug.trim() ? customSlug.trim() : undefined,
        countdownConfig: type === 'countdown' ? {
          occasion: 'custom',
          targetDate: new Date(countdownDate).toISOString(),
          eventTitle: customQuestion || `Countdown for ${recipientName || 'Us'}`,
        } : undefined,
        title: type === 'valentine'
          ? (customQuestion || 'Will you be my Valentine?')
          : type === 'love_letter'
          ? `A Letter for ${recipientName || 'You'}`
          : type === 'timeline'
          ? `The Story of ${senderName} & ${recipientName || 'You'}`
          : `A Secret Note for ${recipientName || 'You'}`,
      };

      const res = await fetchSecureApi('/api/experiences', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success && data.experience) {
        // Save to localStorage for local vault
        if (typeof window !== 'undefined') {
          const raw = localStorage.getItem('lover_my_vault') || '[]';
          try {
            const vault = JSON.parse(raw);
            vault.unshift(data.experience);
            localStorage.setItem('lover_my_vault', JSON.stringify(vault));
          } catch {
            // ignore
          }
        }

        setCreatedExperience(data.experience);
        sfx.playCelebration();
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.6 },
          colors: ['#f43f5e', '#ec4899', '#fda4af', '#fde047'],
        });
        setShowShareModal(true);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getTargetUrl = (exp: ExperienceData) => {
    if (exp.type === 'valentine') return `/valentine/${exp.slug}`;
    if (exp.type === 'love_letter') return `/letter/${exp.slug}`;
    if (exp.type === 'countdown') return `/countdown/${exp.slug}`;
    if (exp.type === 'timeline') return `/timeline/${exp.slug}`;
    if (exp.type === 'quiz') return `/quiz/${exp.slug}`;
    if (exp.type === 'surprise') return `/surprise/${exp.slug}`;
    return `/love/${exp.slug}`;
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-fadeIn" onClick={onClose}>
        <div 
          className="relative w-full max-w-2xl rounded-3xl border border-rose-500/25 bg-[#140a17]/95 p-5 sm:p-8 shadow-2xl backdrop-blur-2xl text-rose-50 max-h-[92vh] overflow-y-auto flex flex-col justify-between"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-rose-500/15 pb-4 mb-4">
            <div className="flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-rose-600/30 text-rose-400 font-mono text-xs font-bold">
                {step}/7
              </span>
              <div>
                <h3 className="text-sm sm:text-base font-bold text-white">Experience Builder</h3>
                <p className="text-[11px] text-rose-300/70">
                  {step === 1 && 'Choose Experience Format'}
                  {step === 2 && 'Enter Names'}
                  {step === 3 && 'Select Visual Aesthetic'}
                  {step === 4 && 'Personalize Message & Content'}
                  {step === 5 && 'Choose Reveal & Animation Style'}
                  {step === 6 && 'Real-Time Live Preview'}
                  {step === 7 && 'Custom URL Slug & Instant Publish'}
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-white/5 text-rose-300 hover:bg-white/10 hover:text-white transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Stepper Progress Bar */}
          <div className="h-1 w-full bg-rose-950/60 rounded-full overflow-hidden mb-6">
            <div
              className="h-full bg-gradient-to-r from-rose-600 via-rose-500 to-pink-500 transition-all duration-300"
              style={{ width: `${(step / 7) * 100}%` }}
            />
          </div>

          {/* STEP 1: Experience Type */}
          {step === 1 && (
            <div className="space-y-4">
              <span className="text-xs font-semibold text-rose-300 uppercase tracking-wider block">
                Select your experience format:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {TYPES_CATALOG.map((t) => {
                  const Icon = t.icon;
                  const isSelected = type === t.id;
                  return (
                    <button
                      key={t.id}
                      onClick={() => {
                        setType(t.id);
                        sfx.playPop();
                      }}
                      className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                        isSelected
                          ? 'border-rose-400 bg-rose-600/30 shadow-lg shadow-rose-600/20'
                          : 'border-rose-500/20 bg-rose-950/30 hover:border-rose-500/40 hover:bg-rose-900/30'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <Icon className={`h-5 w-5 ${isSelected ? 'text-white' : 'text-rose-400'}`} />
                        <span className="text-[10px] font-mono uppercase text-rose-300 px-2 py-0.5 rounded-full bg-rose-500/10 border border-rose-500/20">
                          {t.badge}
                        </span>
                      </div>
                      <h4 className="text-sm font-bold text-white mb-0.5">{t.name}</h4>
                      <p className="text-xs text-rose-200/70 leading-relaxed">{t.desc}</p>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 2: Names */}
          {step === 2 && (
            <div className="space-y-5">
              <span className="text-xs font-semibold text-rose-300 uppercase tracking-wider block">
                Who are the stars of this experience?
              </span>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-rose-300/80 mb-1">
                    Your Name (Sender) <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Alex"
                    value={senderName}
                    onChange={(e) => setSenderName(e.target.value)}
                    className="w-full rounded-xl border border-rose-500/30 bg-rose-950/40 px-3.5 py-3 text-sm text-white placeholder-rose-400/40 focus:border-rose-400 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-rose-300/80 mb-1">
                    Their Name (Recipient / Valentine / Partner)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Mia"
                    value={recipientName}
                    onChange={(e) => setRecipientName(e.target.value)}
                    className="w-full rounded-xl border border-rose-500/30 bg-rose-950/40 px-3.5 py-3 text-sm text-white placeholder-rose-400/40 focus:border-rose-400 focus:outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Theme */}
          {step === 3 && (
            <div className="space-y-4">
              <span className="text-xs font-semibold text-rose-300 uppercase tracking-wider block">
                Choose a visual theme & mood:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {Object.values(THEMES).map((t) => {
                  const isSelected = theme === t.id;
                  return (
                    <button
                      key={t.id}
                      onClick={() => {
                        setTheme(t.id);
                        sfx.playPop();
                      }}
                      className={`flex items-center gap-3 p-3 rounded-2xl border text-left transition-all ${
                        isSelected
                          ? 'border-rose-400 bg-rose-600/30 shadow'
                          : 'border-rose-500/20 bg-rose-950/30 hover:border-rose-500/40'
                      }`}
                    >
                      <span className="text-2xl">{t.heartEmoji}</span>
                      <div>
                        <h4 className="text-xs font-bold text-white">{t.name}</h4>
                        <p className="text-[11px] text-rose-300/70 line-clamp-1">{t.tagline}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 4: Custom Message */}
          {step === 4 && (
            <div className="space-y-4">
              <span className="text-xs font-semibold text-rose-300 uppercase tracking-wider block">
                Customize your words & dates:
              </span>

              {type === 'valentine' && (
                <div>
                  <label className="block text-xs text-rose-300/80 mb-1">The Big Question</label>
                  <input
                    type="text"
                    value={customQuestion}
                    onChange={(e) => setCustomQuestion(e.target.value)}
                    className="w-full rounded-xl border border-rose-500/30 bg-rose-950/40 px-3.5 py-2.5 text-sm text-white focus:border-rose-400 focus:outline-none"
                  />
                </div>
              )}

              {type === 'countdown' && (
                <div>
                  <label className="block text-xs text-rose-300/80 mb-1">Target Date & Event</label>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="date"
                      value={countdownDate}
                      onChange={(e) => setCountdownDate(e.target.value)}
                      className="rounded-xl border border-rose-500/30 bg-rose-950/40 px-3.5 py-2.5 text-sm text-white focus:border-rose-400 focus:outline-none"
                    />
                    <input
                      type="text"
                      placeholder="e.g. Our Anniversary"
                      value={customQuestion}
                      onChange={(e) => setCustomQuestion(e.target.value)}
                      className="rounded-xl border border-rose-500/30 bg-rose-950/40 px-3.5 py-2.5 text-sm text-white focus:border-rose-400 focus:outline-none"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs text-rose-300/80 mb-1">
                  Heartfelt Message / Love Note
                </label>
                <textarea
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Write your private message, compliment, or why they mean the world to you..."
                  className="w-full rounded-xl border border-rose-500/30 bg-rose-950/40 px-3.5 py-2.5 text-sm text-white placeholder-rose-400/40 focus:border-rose-400 focus:outline-none resize-none"
                />
              </div>

              <div>
                <label className="block text-xs text-rose-300/80 mb-1">
                  Secondary Whisper / Secret Promise (Optional)
                </label>
                <input
                  type="text"
                  value={secondaryMessage}
                  onChange={(e) => setSecondaryMessage(e.target.value)}
                  placeholder="e.g. I promise to love you forever and always buy the snacks!"
                  className="w-full rounded-xl border border-rose-500/30 bg-rose-950/40 px-3.5 py-2.5 text-sm text-white placeholder-rose-400/40 focus:border-rose-400 focus:outline-none"
                />
              </div>
            </div>
          )}

          {/* STEP 5: Reveal Mode */}
          {step === 5 && (
            <div className="space-y-4">
              <span className="text-xs font-semibold text-rose-300 uppercase tracking-wider block">
                How should they unlock or reveal this?
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {REVEAL_STYLES.map((r) => {
                  const isSelected = revealStyle === r.id;
                  return (
                    <button
                      key={r.id}
                      onClick={() => {
                        setRevealStyle(r.id);
                        sfx.playPop();
                      }}
                      className={`p-3.5 rounded-2xl border flex flex-col items-center justify-center text-center transition-all ${
                        isSelected
                          ? 'border-rose-400 bg-rose-600/40 text-white shadow-md'
                          : 'border-rose-500/20 bg-rose-950/30 text-rose-200 hover:border-rose-500/40'
                      }`}
                    >
                      <span className="text-2xl mb-1">{r.emoji}</span>
                      <span className="text-xs font-bold leading-tight">{r.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 6: Live Preview */}
          {step === 6 && (
            <div className="space-y-4 text-center">
              <span className="text-xs font-semibold text-rose-300 uppercase tracking-wider block">
                Live Card Preview
              </span>

              <div className="rounded-2xl border border-rose-500/30 bg-gradient-to-b from-[#250d26] to-[#120514] p-6 text-center space-y-3 max-w-sm mx-auto shadow-2xl">
                <span className="text-2xl">
                  {type === 'valentine' ? '❤️' : type === 'love_letter' ? '📜' : '✨'}
                </span>
                <h4 className="text-lg font-bold text-white font-serif">
                  {type === 'valentine'
                    ? (customQuestion || 'Will you be my Valentine?')
                    : `${recipientName || 'You'} & ${senderName}`}
                </h4>
                <p className="text-xs text-rose-200/80 italic line-clamp-3">
                  &ldquo;{message || 'Every second with you is a memory I keep close to my heart.'}&rdquo;
                </p>
                <div className="pt-2 text-[10px] text-rose-400 font-mono">
                  Theme: {THEMES[theme]?.name} · Reveal: {revealStyle.replace('_', ' ')}
                </div>
              </div>
            </div>
          )}

          {/* STEP 7: Custom Slug & Generate */}
          {step === 7 && (
            <div className="space-y-5">
              <span className="text-xs font-semibold text-rose-300 uppercase tracking-wider block">
                Choose your custom shareable link:
              </span>

              <div>
                <label className="block text-xs text-rose-300/80 mb-1">
                  Custom URL Slug (letters, numbers, hyphens)
                </label>
                <div className="flex items-center gap-2 rounded-xl border border-rose-500/30 bg-rose-950/40 p-2">
                  <span className="text-xs text-rose-400/70 font-mono select-none pl-2">
                    {APP_DOMAIN}/{type === 'valentine' ? 'valentine' : type === 'love_letter' ? 'letter' : 'love'}/
                  </span>
                  <input
                    type="text"
                    value={customSlug}
                    onChange={(e) => {
                      const val = e.target.value.toLowerCase().replace(/[^a-z0-9\-]/g, '');
                      setCustomSlug(val);
                      if (!val.trim()) setSlugAvailable(null);
                    }}

                    placeholder={recipientName ? `${senderName.toLowerCase()}-and-${recipientName.toLowerCase()}` : 'our-story'}
                    className="flex-1 bg-transparent px-2 text-xs text-white focus:outline-none"
                  />
                  {checkingSlug && <span className="text-[10px] text-rose-400 animate-pulse">Checking...</span>}
                  {slugAvailable === true && <span className="text-xs text-emerald-400 font-bold">✓ Available</span>}
                  {slugAvailable === false && <span className="text-xs text-rose-400 font-bold">✗ Taken</span>}
                </div>
              </div>

              <div className="rounded-2xl border border-rose-500/20 bg-rose-950/20 p-4 text-xs text-rose-300/80 space-y-1">
                <span className="font-bold text-white block">Ready to Publish:</span>
                <div>• Recipient: {recipientName || 'Special Someone'}</div>
                <div>• Sender: {senderName}</div>
                <div>• Format: {type.replace('_', ' ')}</div>
                <div>• Private & Shareable instantly with one click</div>
              </div>
            </div>
          )}

          {/* Bottom Step Actions */}
          <div className="pt-6 border-t border-rose-500/15 flex items-center justify-between gap-3">
            {step > 1 ? (
              <button
                type="button"
                onClick={handlePrevStep}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-rose-500/30 bg-rose-950/40 text-xs font-semibold text-rose-200 hover:text-white transition-colors"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                <span>Back</span>
              </button>
            ) : <div />}

            {step < 7 ? (
              <button
                type="button"
                onClick={handleNextStep}
                disabled={step === 2 && !senderName.trim()}
                className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-rose-600 to-pink-600 px-6 py-2.5 text-xs sm:text-sm font-bold text-white shadow hover:brightness-110 active:scale-95 transition-all disabled:opacity-50"
              >
                <span>Continue</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={!senderName.trim() || isSubmitting || slugAvailable === false}
                className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-rose-600 via-rose-500 to-pink-600 px-6 py-3 text-xs sm:text-sm font-bold text-white shadow-lg shadow-rose-600/30 hover:brightness-110 active:scale-95 transition-all disabled:opacity-50"
              >
                <Sparkles className="h-4 w-4" />
                <span>{isSubmitting ? 'Creating Experience...' : 'Publish & Get Link ✨'}</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Share Modal Trigger on Creation */}
      {createdExperience && (
        <ShareModal
          isOpen={showShareModal}
          onClose={() => {
            setShowShareModal(false);
            onClose();
          }}
          url={getTargetUrl(createdExperience)}
          title={createdExperience.title}
          names={`${createdExperience.senderName} ${createdExperience.recipientName ? `& ${createdExperience.recipientName}` : ''}`}
          subtitle={createdExperience.message?.substring(0, 80) || "A special experience awaits you..."}
          theme={createdExperience.theme}
        />
      )}
    </>
  );
}
