'use client';

import React, { useState } from 'react';
import { X, Sparkles, Heart, Share2, Award, ArrowRight, Check } from 'lucide-react';
import { sfx } from '@/lib/audio';

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStartCreate: () => void;
}

const STEPS = [
  {
    step: '01',
    title: 'Choose Experience',
    desc: 'Pick from Valentine invitations with runaway "No" buttons, handwritten digital love letters, secret wax-sealed envelopes, couple quizzes, or milestone timelines.',
    icon: Sparkles,
  },
  {
    step: '02',
    title: 'Personalize In 30 Seconds',
    desc: 'Enter names, choose from 7 romantic aesthetics, and customize your personal message, question, or relationship dates. No sign up required.',
    icon: Heart,
  },
  {
    step: '03',
    title: 'Share Unique Link or QR Card',
    desc: 'Send a clean name-based link (like /valentine/alex-and-mia) on WhatsApp or download a high-res photo card with embedded QR code.',
    icon: Share2,
  },
  {
    step: '04',
    title: 'Interact & Celebrate Together',
    desc: 'They open the link, watch the animated reveals, dodge the "No" button, answer trivia, and send live floating reaction emojis back to you!',
    icon: Award,
  },
];

export default function OnboardingModal({
  isOpen,
  onClose,
  onStartCreate,
}: OnboardingModalProps) {
  const [currentStep, setCurrentStep] = useState(0);

  if (!isOpen) return null;

  const handleNext = () => {
    sfx.playPop();
    if (currentStep < STEPS.length - 1) {
      setCurrentStep((c) => c + 1);
    } else {
      onClose();
      onStartCreate();
    }
  };

  const stepData = STEPS[currentStep];
  const StepIcon = stepData.icon;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div 
        className="relative w-full max-w-lg rounded-3xl border border-rose-500/25 bg-[#150a18]/95 p-6 sm:p-8 shadow-2xl backdrop-blur-2xl text-rose-50 text-center space-y-6"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-white/5 text-rose-300 hover:bg-white/10 hover:text-white transition-colors"
          aria-label="Close onboarding"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Step Indicator */}
        <div className="flex items-center justify-center gap-1.5 pt-2">
          {STEPS.map((_, idx) => (
            <div
              key={idx}
              className={`h-1.5 rounded-full transition-all ${
                idx === currentStep ? 'w-8 bg-rose-500' : 'w-2 bg-rose-950/60'
              }`}
            />
          ))}
        </div>

        {/* Icon Avatar */}
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-tr from-rose-600 to-pink-500 shadow-xl shadow-rose-600/30 text-white animate-gentle-pulse">
          <StepIcon className="h-10 w-10" />
        </div>

        {/* Step Content */}
        <div className="space-y-2">
          <span className="text-[11px] font-mono font-bold uppercase tracking-widest text-rose-400">
            Step {stepData.step} of 04
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            {stepData.title}
          </h2>
          <p className="text-xs sm:text-sm text-rose-200/80 max-w-sm mx-auto leading-relaxed pt-1">
            {stepData.desc}
          </p>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-3 pt-2">
          {currentStep > 0 && (
            <button
              onClick={() => {
                sfx.playPop();
                setCurrentStep((c) => c - 1);
              }}
              className="px-4 py-2.5 rounded-xl border border-rose-500/30 bg-rose-950/40 text-xs font-semibold text-rose-200 hover:text-white transition-colors"
            >
              Previous
            </button>
          )}

          <button
            onClick={handleNext}
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-rose-600 via-rose-500 to-pink-600 px-6 py-2.5 text-xs sm:text-sm font-bold text-white shadow-lg shadow-rose-600/30 hover:brightness-110 active:scale-95 transition-all"
          >
            <span>{currentStep === STEPS.length - 1 ? 'Start Creating Now ✨' : 'Next Step'}</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
