import React from 'react';
import { Metadata } from 'next';
import { getExperienceBySlugAsync, saveExperienceAsync } from '@/lib/storage';
import QuizExperience from '@/components/experiences/QuizExperience';
import { getAppUrl } from '@/lib/config';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const exp = await getExperienceBySlugAsync(slug);

  const title = exp ? `How Well Do You Know ${exp.senderName}?` : 'Couple Quiz | Lover';
  const desc = 'Take the couple trivia quiz and find out your compatibility level!';
  const pageUrl = getAppUrl(`/quiz/${slug}`);

  return {
    title: `${title} | Lover`,
    description: desc,
    alternates: {
      canonical: pageUrl,
    },
    openGraph: {
      title,
      description: desc,
      url: pageUrl,
    },
  };
}

export default async function QuizPage({ params }: PageProps) {
  const { slug } = await params;
  let experience = await getExperienceBySlugAsync(slug);

  if (!experience) {
    const rawName = slug.replace(/-/g, ' ');
    const sender = rawName.charAt(0).toUpperCase() + rawName.slice(1);

    experience = await saveExperienceAsync({
      slug,
      type: 'quiz',
      theme: 'pink_glow',
      title: `How Well Do You Really Know ${sender}?`,
      senderName: sender,
      recipientName: 'My Favorite Person',
      message: 'Think you know all my quirks, cravings, and secret habits? Prove your top-tier status!',
      reactions: { '💯': 2, '❤️': 4 },
      viewsCount: 1,
    });
  }

  return <QuizExperience experience={experience} />;
}
