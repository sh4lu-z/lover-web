import React from 'react';
import { Metadata } from 'next';
import { getExperienceBySlugAsync, saveExperienceAsync } from '@/lib/storage';
import LovePageExperience from '@/components/experiences/LovePageExperience';
import { getAppUrl } from '@/lib/config';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const exp = await getExperienceBySlugAsync(slug);

  const title = exp ? `A Love Page For ${exp.recipientName || 'You'}` : 'A Special Love Page | Lover';
  const desc = exp?.message || 'A personalized romantic love letter and memory experience.';
  const pageUrl = getAppUrl(`/love/${slug}`);

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

export default async function LovePage({ params }: PageProps) {
  const { slug } = await params;
  let experience = await getExperienceBySlugAsync(slug);

  if (!experience) {
    const parts = slug.split('-and-');
    const sender = parts[0] ? parts[0].charAt(0).toUpperCase() + parts[0].slice(1) : 'Someone Special';
    const recipient = parts[1] ? parts[1].charAt(0).toUpperCase() + parts[1].slice(1) : 'You';

    experience = await saveExperienceAsync({
      slug,
      type: 'love_page',
      theme: 'romantic',
      title: `To My One & Only ${recipient}`,
      senderName: sender,
      recipientName: recipient,
      message: 'Looking back on every laughter-filled night, every quiet sunrise together, I realize home is anywhere you are.',
      secondaryMessage: 'My heart skips a beat every time I hear your voice. Here is to our forever chapter.',
      reactions: { '❤️': 5, '✨': 3 },
      viewsCount: 1,
    });
  }

  return <LovePageExperience experience={experience} />;
}
