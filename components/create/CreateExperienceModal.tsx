'use client';

import React, { useState } from 'react';
import { X, Sparkles, Heart, Mail, HelpCircle, ArrowRight, Check, Palette } from 'lucide-react';
import { ExperienceType, ThemeType, ExperienceData } from '@/types/experience';
import { THEMES } from '@/lib/themes';
import { sfx } from '@/lib/audio';
import { fetchSecureApi } from '@/lib/crypto';
import confetti from 'canvas-confetti';
import ShareModal from '@/components/common/ShareModal';

interface CreateExperienceModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialType?: ExperienceType;
}

const EXPERIENCE_TYPES: { id: ExperienceType; name: string; icon: React.ElementType; desc: string }[] = [
  { id: 'valentine', name: 'Valentine Invite', icon: Heart, desc: 'Interactive runaway "No" button & official certificate' },
  { id: 'love_page', name: 'Love Page', icon: Sparkles, desc: 'Personalized love letter, reasons why I adore you & stats' },
  { id: 'surprise', name: 'Secret Envelope', icon: Mail, desc: 'Golden wax seal unwrap with secret love confession' },
  { id: 'quiz', name: 'Couple Quiz', icon: HelpCircle, desc: 'How well do you know me? 5 fun questions & score' },
];

export default function CreateExperienceModal({
  isOpen,
  onClose,
  initialType = 'valentine',
}: CreateExperienceModalProps) {
  const [type, setType] = useState<ExperienceType>(initialType);
  const [theme, setTheme] = useState<ThemeType>('valentine');
  const [senderName, setSenderName] = useState('');
  const [recipientName, setRecipientName] = useState('');
  const [customQuestion, setCustomQuestion] = useState('Will you be my Valentine?');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdExperience, setCreatedExperience] = useState<ExperienceData | null>(null);
  const [showShareModal, setShowShareModal] = useState(false);

  if (!isOpen) return null;

  const handleTypeChange = (newType: ExperienceType) => {
    setType(newType);
    sfx.playPop();
    if (newType === 'valentine') {
      setCustomQuestion('Will you be my Valentine?');
      setTheme('valentine');
      if (!message) setMessage('Every moment with you feels like pure magic.');
    } else if (newType === 'love_page') {
      setTheme('romantic');
      if (!message) setMessage('You are my favorite place to go when my mind searches for peace.');
    } else if (newType === 'surprise') {
      setTheme('dreamy');
      if (!message) setMessage('If I had a flower for every time I thought of you, I could walk through an eternal garden.');
    } else if (newType === 'quiz') {
      setTheme('pink_glow');
      if (!message) setMessage('Think you know all my quirks? Let us test your knowledge!');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!senderName.trim()) return;

    setIsSubmitting(true);
    sfx.playChime();

    try {
      const payload: Partial<ExperienceData> = {
        type,
        theme,
        senderName: senderName.trim(),
        recipientName: recipientName.trim(),
        customQuestion: type === 'valentine' ? customQuestion : undefined,
        message: message.trim() || (type === 'valentine' ? 'Every moment with you feels like pure magic.' : 'Thinking of you always.'),
        title: type === 'valentine' 
          ? `Will You Be My Valentine?`
          : type === 'quiz' 
          ? `How Well Do You Know ${senderName}?`
          : `A Love Note for ${recipientName || 'You'}`,
      };

      const res = await fetchSecureApi('/api/experiences', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success && data.experience) {
        // Save to localStorage for user's personal vault
        if (typeof window !== 'undefined') {
          const vaultRaw = localStorage.getItem('lover_my_vault') || '[]';
          try {
            const vault = JSON.parse(vaultRaw);
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
          origin: { y: 0.5 },
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
    if (exp.type === 'quiz') return `/quiz/${exp.slug}`;
    if (exp.type === 'surprise') return `/surprise/${exp.slug}`;
    return `/love/${exp.slug}`;
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
        <div 
          className="relative w-full max-w-2xl rounded-3xl border border-rose-500/25 bg-[#140a17]/95 p-6 sm:p-8 shadow-2xl backdrop-blur-2xl text-rose-50 max-h-[92vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close */}
          <button
            onClick={onClose}
            className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-white/5 text-rose-300 hover:bg-white/10 hover:text-white transition-colors"
            aria-label="Close modal"
          >
            <X className="h-5 w-5" />
          </button>

          {/* Header */}
          <div className="text-center mb-6">
            <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-rose-600 to-pink-500 shadow-lg shadow-rose-600/30">
              <Sparkles className="h-6 w-6 text-white" />
            </div>
            <h2 className="text-2xl font-black text-white tracking-tight">
              Create a Love Experience
            </h2>
            <p className="text-xs sm:text-sm text-rose-300/70 mt-1">
              Personalize in 30 seconds · No sign up required · Share via unique link
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Step 1: Experience Type */}
            <div>
              <label className="block text-xs font-semibold text-rose-300 uppercase tracking-wider mb-2">
                1. Choose Experience Type
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {EXPERIENCE_TYPES.map((et) => {
                  const Icon = et.icon;
                  const isSelected = type === et.id;
                  return (
                    <button
                      key={et.id}
                      type="button"
                      onClick={() => handleTypeChange(et.id)}
                      className={`flex flex-col items-center justify-center p-3 rounded-2xl border text-center transition-all cursor-pointer ${
                        isSelected
                          ? 'border-rose-400 bg-rose-600/40 text-white shadow-md shadow-rose-600/20'
                          : 'border-rose-500/20 bg-rose-950/30 text-rose-200 hover:border-rose-500/40'
                      }`}
                    >
                      <Icon className={`h-5 w-5 mb-1.5 ${isSelected ? 'text-white' : 'text-rose-400'}`} />
                      <span className="text-xs font-bold">{et.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 2: Names */}
            <div>
              <label className="block text-xs font-semibold text-rose-300 uppercase tracking-wider mb-2">
                2. Who is this for?
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-rose-300/80 mb-1">
                    Your Name (Sender) <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Alex"
                    value={senderName}
                    onChange={(e) => setSenderName(e.target.value)}
                    className="w-full rounded-xl border border-rose-500/30 bg-rose-950/40 px-3.5 py-2.5 text-sm text-white placeholder-rose-400/40 focus:border-rose-400 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs text-rose-300/80 mb-1">
                    Their Name (Recipient / Valentine)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Mia"
                    value={recipientName}
                    onChange={(e) => setRecipientName(e.target.value)}
                    className="w-full rounded-xl border border-rose-500/30 bg-rose-950/40 px-3.5 py-2.5 text-sm text-white placeholder-rose-400/40 focus:border-rose-400 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Step 3: Custom Question / Message */}
            <div>
              <label className="block text-xs font-semibold text-rose-300 uppercase tracking-wider mb-2">
                3. Customize Content
              </label>

              {type === 'valentine' && (
                <div className="mb-3">
                  <label className="block text-xs text-rose-300/80 mb-1">
                    The Big Question
                  </label>
                  <input
                    type="text"
                    value={customQuestion}
                    onChange={(e) => setCustomQuestion(e.target.value)}
                    placeholder="Will you be my Valentine?"
                    className="w-full rounded-xl border border-rose-500/30 bg-rose-950/40 px-3.5 py-2.5 text-sm text-white focus:border-rose-400 focus:outline-none"
                  />
                </div>
              )}

              <div>
                <label className="block text-xs text-rose-300/80 mb-1">
                  Heartfelt Message / Love Note
                </label>
                <textarea
                  rows={3}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Write a sweet message, compliment, or why they mean the world to you..."
                  className="w-full rounded-xl border border-rose-500/30 bg-rose-950/40 px-3.5 py-2.5 text-sm text-white placeholder-rose-400/40 focus:border-rose-400 focus:outline-none resize-none"
                />
              </div>
            </div>

            {/* Step 4: Theme */}
            <div>
              <label className="block text-xs font-semibold text-rose-300 uppercase tracking-wider mb-2">
                4. Select Theme
              </label>
              <div className="flex flex-wrap gap-2">
                {Object.values(THEMES).map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => {
                      setTheme(t.id);
                      sfx.playPop();
                    }}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all ${
                      theme === t.id
                        ? 'border-rose-400 bg-rose-600 text-white shadow-sm'
                        : 'border-rose-500/20 bg-rose-950/30 text-rose-300 hover:text-white'
                    }`}
                  >
                    <span>{t.heartEmoji}</span>
                    <span>{t.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={!senderName.trim() || isSubmitting}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-rose-600 via-rose-500 to-pink-600 py-3.5 text-sm sm:text-base font-bold text-white shadow-lg shadow-rose-600/30 hover:brightness-110 active:scale-[0.99] transition-all disabled:opacity-50 cursor-pointer"
              >
                <Sparkles className="h-4 w-4" />
                <span>{isSubmitting ? 'Creating Magic...' : 'Generate Love Link ✨'}</span>
              </button>
            </div>
          </form>
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
