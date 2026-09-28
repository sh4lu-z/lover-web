import { ThemeType } from '@/types/experience';

export interface ThemeConfig {
  id: ThemeType;
  name: string;
  tagline: string;
  bgGradient: string;
  cardBg: string;
  cardBorder: string;
  accentText: string;
  buttonGradient: string;
  glowColor: string;
  particleColors: string[];
  heartEmoji: string;
}

export const THEMES: Record<ThemeType, ThemeConfig> = {
  romantic: {
    id: 'romantic',
    name: 'Romantic Velvet',
    tagline: 'Deep crimson wine, delicate blush and rose gold',
    bgGradient: 'from-[#12070d] via-[#1a0914] to-[#080306]',
    cardBg: 'bg-[#1e0a16]/80',
    cardBorder: 'border-rose-500/25',
    accentText: 'text-rose-400',
    buttonGradient: 'from-rose-600 via-rose-500 to-pink-600 hover:from-rose-500 hover:to-pink-500',
    glowColor: 'rgba(244, 63, 94, 0.4)',
    particleColors: ['#f43f5e', '#fb7185', '#fda4af', '#e11d48'],
    heartEmoji: '🌹',
  },
  valentine: {
    id: 'valentine',
    name: 'Classic Valentine',
    tagline: 'Strawberry red, pure affection and cupid arrows',
    bgGradient: 'from-[#1a050d] via-[#240813] to-[#0d0207]',
    cardBg: 'bg-[#2a0b17]/80',
    cardBorder: 'border-red-500/30',
    accentText: 'text-red-400',
    buttonGradient: 'from-red-600 via-rose-600 to-pink-500 hover:from-red-500 hover:to-pink-400',
    glowColor: 'rgba(239, 68, 68, 0.45)',
    particleColors: ['#ef4444', '#f87171', '#fca5a5', '#dc2626'],
    heartEmoji: '❤️',
  },
  cute: {
    id: 'cute',
    name: 'Cute Pastel',
    tagline: 'Soft peach, baby blush and gentle lavender',
    bgGradient: 'from-[#180f1e] via-[#211227] to-[#0d0711]',
    cardBg: 'bg-[#291732]/80',
    cardBorder: 'border-pink-400/25',
    accentText: 'text-pink-300',
    buttonGradient: 'from-pink-500 via-rose-400 to-amber-300 hover:from-pink-400 hover:to-amber-200 text-slate-900',
    glowColor: 'rgba(244, 114, 182, 0.35)',
    particleColors: ['#f472b6', '#c084fc', '#fbcfe8', '#fed7aa'],
    heartEmoji: '🧸',
  },
  dark_love: {
    id: 'dark_love',
    name: 'Midnight Passion',
    tagline: 'Obsidian black, neon ruby glow and mystery',
    bgGradient: 'from-[#050204] via-[#0d050c] to-[#020103]',
    cardBg: 'bg-[#120712]/90',
    cardBorder: 'border-rose-600/40',
    accentText: 'text-rose-500',
    buttonGradient: 'from-rose-700 via-red-700 to-purple-800 hover:from-rose-600 hover:to-purple-700',
    glowColor: 'rgba(225, 29, 72, 0.5)',
    particleColors: ['#be123c', '#9f1239', '#e11d48', '#881337'],
    heartEmoji: '🖤',
  },
  pink_glow: {
    id: 'pink_glow',
    name: 'Pink Cyber Glow',
    tagline: 'Vibrant magenta, electric fuchsia and neon hearts',
    bgGradient: 'from-[#160618] via-[#25092a] to-[#0b020c]',
    cardBg: 'bg-[#2b0c30]/80',
    cardBorder: 'border-fuchsia-500/35',
    accentText: 'text-fuchsia-400',
    buttonGradient: 'from-fuchsia-600 via-pink-600 to-rose-500 hover:from-fuchsia-500 hover:to-pink-400',
    glowColor: 'rgba(217, 70, 239, 0.45)',
    particleColors: ['#d946ef', '#ec4899', '#f472b6', '#a855f7'],
    heartEmoji: '💖',
  },
  dreamy: {
    id: 'dreamy',
    name: 'Dreamy Sunset',
    tagline: 'Golden hour honey, dusk violet and starry night',
    bgGradient: 'from-[#190d1f] via-[#21122b] to-[#0d0514]',
    cardBg: 'bg-[#291435]/80',
    cardBorder: 'border-violet-400/25',
    accentText: 'text-amber-300',
    buttonGradient: 'from-violet-600 via-fuchsia-600 to-amber-500 hover:from-violet-500 hover:to-amber-400',
    glowColor: 'rgba(168, 85, 247, 0.4)',
    particleColors: ['#a855f7', '#fbbf24', '#f43f5e', '#c084fc'],
    heartEmoji: '✨',
  },
  minimal: {
    id: 'minimal',
    name: 'Pure Minimalist',
    tagline: 'Monochrome slate, warm pearl and crisp elegance',
    bgGradient: 'from-[#0f1115] via-[#161920] to-[#0a0c0f]',
    cardBg: 'bg-[#181c24]/85',
    cardBorder: 'border-slate-700/60',
    accentText: 'text-rose-300',
    buttonGradient: 'from-slate-100 to-slate-300 text-slate-950 hover:from-white hover:to-slate-200',
    glowColor: 'rgba(255, 255, 255, 0.15)',
    particleColors: ['#ffffff', '#e2e8f0', '#fda4af', '#cbd5e1'],
    heartEmoji: '🤍',
  },
};
