import React from 'react';
import { Metadata } from 'next';
import { getExperienceBySlugAsync, saveExperienceAsync } from '@/lib/storage';
import SurpriseExperience from '@/components/experiences/SurpriseExperience';
import { getAppUrl } from '@/lib/config';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const exp = await getExperienceBySlugAsync(slug);

  const title = exp ? `A Secret Envelope for ${exp.recipientName || 'You'}` : 'A Secret Love Capsule | Lover';
  const desc = 'Tap the golden wax seal to unwrap a secret love note.';
  const pageUrl = getAppUrl(`/surprise/${slug}`);

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

export default async function SurprisePage({ params }: PageProps) {
  const { slug } = await params;
  let experience = await getExperienceBySlugAsync(slug);

  if (!experience) {
    const rawName = slug.replace(/-/g, ' ');
    const recipient = rawName.charAt(0).toUpperCase() + rawName.slice(1);

    experience = await saveExperienceAsync({
      slug,
      type: 'surprise',
      theme: 'dreamy',
      title: `A Secret Envelope for ${recipient}`,
      senderName: 'Your Secret Admirer',
      recipientName: recipient,
      message: 'If I had a flower for every time I thought of you, I could walk through an eternal garden. You bring pure sunshine to my days.',
      secondaryMessage: 'Cherished beyond words, today and always.',
      reactions: { '💖': 4, '🌸': 3 },
      viewsCount: 1,
    });
  }

  return <SurpriseExperience experience={experience} />;
}
