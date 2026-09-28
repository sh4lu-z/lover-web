import React from 'react';
import { Metadata } from 'next';
import { getExperienceBySlugAsync, saveExperienceAsync } from '@/lib/storage';
import LoveLetterExperience from '@/components/experiences/LoveLetterExperience';
import { getAppUrl } from '@/lib/config';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const exp = await getExperienceBySlugAsync(slug);

  const title = exp ? `A Love Letter for ${exp.recipientName || 'You'}` : 'A Handwritten Love Letter | Lover';
  const desc = exp?.message || 'A personalized handwritten love letter with an animated envelope reveal.';
  const pageUrl = getAppUrl(`/letter/${slug}`);

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

export default async function LetterPage({ params }: PageProps) {
  const { slug } = await params;
  let experience = await getExperienceBySlugAsync(slug);

  if (!experience) {
    const parts = slug.split('-and-');
    const sender = parts[0] ? parts[0].charAt(0).toUpperCase() + parts[0].slice(1) : 'Someone Special';
    const recipient = parts[1] ? parts[1].charAt(0).toUpperCase() + parts[1].slice(1) : 'You';

    experience = await saveExperienceAsync({
      slug,
      type: 'love_letter',
      theme: 'romantic',
      title: `A Love Letter for ${recipient}`,
      senderName: sender,
      recipientName: recipient,
      message: 'Every word I write carries the warmth of my heart. This letter is my soul speaking to yours, across the quiet distance between us.',
      secondaryMessage: 'With all my love, today and always.',
      reactions: { '❤️': 3, '💌': 2 },
      viewsCount: 1,
    });
  }

  return <LoveLetterExperience experience={experience} />;
}
