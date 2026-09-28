'use client';

import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { Heart, Sparkles, Share2, CheckCircle2, XCircle, RefreshCw, Trophy, Plus } from 'lucide-react';
import Link from 'next/link';
import { ExperienceData, QuizQuestion } from '@/types/experience';
import { THEMES } from '@/lib/themes';
import RomanticBackground from '@/components/common/RomanticBackground';
import ReactionFloaters from '@/components/common/ReactionFloaters';
import ShareModal from '@/components/common/ShareModal';
import { sfx } from '@/lib/audio';

interface QuizExperienceProps {
  experience: ExperienceData;
  isCreatorPreview?: boolean;
}

const DEFAULT_QUESTIONS: QuizQuestion[] = [
  {
    id: 'q1',
    question: 'What is my ultimate comfort food when I have had a long day?',
    options: ['Crispy Garlic Pizza', 'Spicy Ramen with Extra Egg', 'Fresh Tacos & Guacamole', 'Warm Chocolate Chip Cookies'],
    correctIndex: 1,
  },
  {
    id: 'q2',
    question: 'What would my dream impromptu weekend getaway look like?',
    options: ['A cozy cabin in the misty mountains', 'A sunny beachfront villa with sunset music', 'A bustling European city food crawl', 'Camping under the stars with hot cocoa'],
    correctIndex: 0,
  },
  {
    id: 'q3',
    question: 'Who falls asleep first during movie nights?',
    options: ['Always me, 15 minutes in', 'You, without a doubt!', 'We both stay awake miraculously', 'We never even finish picking the movie!'],
    correctIndex: 0,
  },
  {
    id: 'q4',
    question: 'What is my secret superpower in this relationship?',
    options: ['Remembering obscure details you mentioned months ago', 'Giving world-class hugs', 'Picking the exact right playlist', 'Always being down for midnight snacks'],
    correctIndex: 3,
  },
  {
    id: 'q5',
    question: 'What do I love most about you?',
    options: ['Your radiant smile that lights up the whole room', 'Your kindness & huge heart', 'How effortlessly cute you are', 'All of the above, every single second'],
    correctIndex: 3,
  },
];

export default function QuizExperience({
  experience,
  isCreatorPreview = false,
}: QuizExperienceProps) {
  const questions = experience.quizQuestions && experience.quizQuestions.length > 0 
    ? experience.quizQuestions 
    : DEFAULT_QUESTIONS;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [isFinished, setIsFinished] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);

  const currentQ = questions[currentIndex];
  const total = questions.length;

  const handleSelectOption = (optIdx: number) => {
    sfx.playPop();
    const updated = { ...selectedAnswers, [currentIndex]: optIdx };
    setSelectedAnswers(updated);

    if (currentIndex < total - 1) {
      setTimeout(() => {
        setCurrentIndex(currentIndex + 1);
      }, 300);
    } else {
      // Calculate score & finish
      setTimeout(() => {
        setIsFinished(true);
        sfx.playCelebration();
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.6 },
          colors: ['#f43f5e', '#a855f7', '#ec4899', '#fbcfe8'],
        });
      }, 400);
    }
  };

  const calculateScore = () => {
    let correct = 0;
    questions.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.correctIndex) {
        correct++;
      }
    });
    return Math.round((correct / total) * 100);
  };

  const score = isFinished ? calculateScore() : 0;

  const getVerdict = (s: number) => {
    if (s === 100) return { title: 'Soulmate Telepathy! 💖', desc: 'You know everything down to the atomic level. Absolute soulmate status!' };
    if (s >= 80) return { title: 'Top-Tier Partner! ✨', desc: 'You know them almost inside out. Ride or die certified!' };
    if (s >= 60) return { title: 'Solid Connection! 🍕', desc: 'Not bad at all! Just means you need more date nights to study up!' };
    return { title: 'Emergency Date Required! 😂', desc: 'Time for an emergency boba & gossip date to get caught up!' };
  };

  const verdict = getVerdict(score);

  const handleRestart = () => {
    setSelectedAnswers({});
    setCurrentIndex(0);
    setIsFinished(false);
    sfx.playPop();
  };

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
            <span>Share Quiz</span>
          </button>
        </div>
      </header>

      {/* Main Quiz Area */}
      <main className="relative z-10 flex-1 flex items-center justify-center p-4 sm:p-6 my-auto">
        <div className="w-full max-w-lg rounded-3xl border border-rose-500/25 bg-[#170918]/90 p-6 sm:p-8 shadow-2xl backdrop-blur-2xl text-center space-y-6">
          {!isFinished ? (
            /* Quiz Active State */
            <div className="space-y-6">
              {/* Progress and question counter */}
              <div className="flex items-center justify-between text-xs text-rose-300/80">
                <span className="font-semibold uppercase tracking-wider text-rose-400">
                  Question {currentIndex + 1} of {total}
                </span>
                <span className="font-mono tabular-nums">{Math.round(((currentIndex + 1) / total) * 100)}%</span>
              </div>

              {/* Progress Bar */}
              <div className="h-1.5 w-full bg-rose-950/60 rounded-full overflow-hidden border border-rose-500/15">
                <div 
                  className="h-full bg-gradient-to-r from-rose-600 to-pink-500 transition-all duration-300"
                  style={{ width: `${((currentIndex + 1) / total) * 100}%` }}
                />
              </div>

              {/* Question Text */}
              <div className="space-y-1">
                <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight leading-snug">
                  {currentQ.question}
                </h1>
                <p className="text-xs text-rose-300/60">
                  Created by <span className="text-rose-200 font-semibold">{experience.senderName}</span>
                </p>
              </div>

              {/* Options */}
              <div className="space-y-2.5 pt-2 text-left">
                {currentQ.options.map((opt, oIdx) => {
                  const isSelected = selectedAnswers[currentIndex] === oIdx;
                  return (
                    <button
                      key={oIdx}
                      onClick={() => handleSelectOption(oIdx)}
                      className={`w-full flex items-center justify-between p-4 rounded-2xl border text-sm font-medium transition-all active:scale-[0.99] cursor-pointer ${
                        isSelected
                          ? 'border-rose-400 bg-rose-600 text-white shadow-lg shadow-rose-600/30'
                          : 'border-rose-500/20 bg-rose-950/30 text-rose-100 hover:border-rose-500/40 hover:bg-rose-900/40'
                      }`}
                    >
                      <span>{opt}</span>
                      <span className="text-xs text-rose-400 font-mono">
                        {String.fromCharCode(65 + oIdx)}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          ) : (
            /* Results Screen */
            <div className="space-y-6 animate-fadeIn">
              <div className="inline-flex items-center gap-2 text-xs font-semibold text-rose-400 uppercase tracking-widest">
                <Trophy className="h-3.5 w-3.5 text-amber-400" />
                <span>Quiz Results</span>
                <Trophy className="h-3.5 w-3.5 text-amber-400" />
              </div>

              {/* Big Score Display */}
              <div className="mx-auto flex h-28 w-28 flex-col items-center justify-center rounded-full bg-gradient-to-tr from-rose-600 via-rose-500 to-pink-500 text-white shadow-xl shadow-rose-600/40 animate-gentle-pulse">
                <span className="text-3xl font-black tabular-nums">{score}%</span>
                <span className="text-[10px] uppercase font-bold tracking-wider">Score</span>
              </div>

              <div>
                <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                  {verdict.title}
                </h2>
                <p className="mt-1 text-xs sm:text-sm text-rose-200/90 max-w-sm mx-auto">
                  {verdict.desc}
                </p>
              </div>

              {/* Answer breakdown review */}
              <div className="rounded-2xl border border-rose-500/20 bg-rose-950/20 p-4 text-left space-y-3 max-h-52 overflow-y-auto">
                <span className="text-[11px] font-bold uppercase tracking-wider text-rose-300 block">
                  Question Breakdown
                </span>
                {questions.map((q, idx) => {
                  const userAns = selectedAnswers[idx];
                  const isCorrect = userAns === q.correctIndex;
                  return (
                    <div key={q.id} className="text-xs border-b border-rose-500/10 pb-2">
                      <div className="flex items-center gap-1.5 font-medium text-white mb-0.5">
                        {isCorrect ? (
                          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                        ) : (
                          <XCircle className="h-3.5 w-3.5 text-rose-400 shrink-0" />
                        )}
                        <span>{q.question}</span>
                      </div>
                      <div className="pl-5 text-[11px] text-rose-300/70">
                        Your answer: <span className={isCorrect ? 'text-emerald-300 font-semibold' : 'text-rose-300'}>{q.options[userAns]}</span>
                        {!isCorrect && (
                          <span className="block text-emerald-400/90">
                            Creator chose: {q.options[q.correctIndex]}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Actions */}
              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                <button
                  onClick={() => setIsShareOpen(true)}
                  className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-rose-600 via-rose-500 to-pink-600 px-5 py-2.5 text-xs sm:text-sm font-semibold text-white shadow-lg shadow-rose-600/30 hover:brightness-110 active:scale-95 transition-all"
                >
                  <Share2 className="h-4 w-4" />
                  <span>Share My Score Card</span>
                </button>

                <button
                  onClick={handleRestart}
                  className="flex items-center gap-1.5 rounded-xl border border-rose-500/30 bg-rose-950/40 px-4 py-2.5 text-xs sm:text-sm font-medium text-rose-200 hover:text-white transition-all active:scale-95"
                >
                  <RefreshCw className="h-3.5 w-3.5" />
                  <span>Retake Quiz</span>
                </button>
              </div>

              {/* Reactions */}
              <div className="pt-2">
                <span className="text-[11px] text-rose-300/70 block mb-1">
                  Send reaction to {experience.senderName}:
                </span>
                <ReactionFloaters slug={experience.slug} initialReactions={experience.reactions} />
              </div>
            </div>
          )}

          {/* Create CTA */}
          <div className="mt-8 pt-6 border-t border-rose-500/15 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <span className="text-rose-300/60">
              Want to see how well someone knows you?
            </span>
            <Link
              href="/"
              className="flex items-center gap-1 text-rose-400 hover:text-white font-medium hover:underline underline-offset-4 transition-colors"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Create Your Own Quiz</span>
            </Link>
          </div>
        </div>
      </main>

      {/* Share Modal */}
      <ShareModal
        isOpen={isShareOpen}
        onClose={() => setIsShareOpen(false)}
        url={`/quiz/${experience.slug}`}
        title={`How Well Do You Know ${experience.senderName}?`}
        names={`${experience.senderName}'s Quiz`}
        subtitle={isFinished ? `Scored ${score}% - ${verdict.title}` : "Take the quiz and test your knowledge!"}
        theme={experience.theme}
      />
    </div>
  );
}
