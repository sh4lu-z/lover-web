export type ExperienceType = 
  | 'love_page' 
  | 'valentine' 
  | 'quiz' 
  | 'surprise' 
  | 'love_letter'
  | 'countdown'
  | 'timeline'
  | 'compatibility' 
  | 'date_wheel' 
  | 'this_or_that' 
  | 'memory_match'
  | 'would_you_rather'
  | 'truth_or_dare'
  | 'personality_test'
  | 'love_challenge'
  | 'emoji_quiz';

export type ThemeType = 
  | 'romantic' 
  | 'valentine' 
  | 'cute' 
  | 'dark_love' 
  | 'pink_glow' 
  | 'dreamy' 
  | 'minimal';

export type RevealStyle = 
  | 'envelope' 
  | 'wax_seal' 
  | 'gift_box' 
  | 'lock_key' 
  | 'heart_unlock' 
  | 'scratch' 
  | 'curtain' 
  | 'mystery_card';

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
}

export interface ThisOrThatItem {
  id: string;
  optA: string;
  optB: string;
  senderChoice?: 'A' | 'B';
}

export interface TimelineItem {
  id: string;
  date: string;
  title: string;
  description: string;
  emoji?: string;
  imageUrl?: string;
}

export interface CountdownConfig {
  occasion: 'valentine' | 'birthday' | 'anniversary' | 'first_meet' | 'special_date' | 'custom';
  targetDate: string;
  eventTitle: string;
}

export interface ExperienceData {
  id: string;
  slug: string;
  type: ExperienceType;
  theme: ThemeType;
  title: string;
  senderName: string;
  recipientName: string;
  message: string;
  secondaryMessage?: string;
  customQuestion?: string; // For Valentine, e.g. "Will you be my Valentine?"
  photos?: string[];
  revealType?: RevealStyle;
  revealDate?: string;
  quizQuestions?: QuizQuestion[];
  quizAnswers?: Record<string, number>;
  thisOrThatItems?: ThisOrThatItem[];
  timelineItems?: TimelineItem[];
  countdownConfig?: CountdownConfig;
  dateIdeas?: string[];
  yesClicked?: boolean;
  yesTimestamp?: string;
  reactions: Record<string, number>;
  viewsCount: number;
  uniqueViews?: number;
  quizAttempts?: number;
  sharesCount: number;
  lastActivity?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ShareCardConfig {
  names: string;
  title: string;
  subtitle: string;
  theme: ThemeType;
  layout?: 'minimal' | 'romantic' | 'valentine' | 'neon' | 'elegant' | 'cute';
  url: string;
  quote?: string;
  score?: number | string;
}
