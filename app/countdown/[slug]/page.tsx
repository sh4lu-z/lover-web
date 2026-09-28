import React from 'react';
import { Metadata } from 'next';
import { getExperienceBySlugAsync, saveExperienceAsync } from '@/lib/storage';
import LoveCountdownExperience from '@/components/experiences/LoveCountdownExperience';
import { getAppUrl } from '@/lib/config';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const exp = await getExperienceBySlugAsync(slug);

  const title = exp?.countdownConfig?.eventTitle
    ? `Countdown to ${exp.countdownConfig.eventTitle}`
    : 'Love Countdown Timer | Lover';
  const desc = 'A live countdown timer ticking down to your next special moment together.';
  const pageUrl = getAppUrl(`/countdown/${slug}`);

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

export default async function CountdownPage({ params }: PageProps) {
  const { slug } = await params;
  let experience = await getExperienceBySlugAsync(slug);

  if (!experience) {
    const parts = slug.split('-and-');
    const sender = parts[0] ? parts[0].charAt(0).toUpperCase() + parts[0].slice(1) : 'Someone Special';
    const recipient = parts[1] ? parts[1].charAt(0).toUpperCase() + parts[1].slice(1) : 'You';

    // Default countdown: 30 days from now
    const targetDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();

    experience = await saveExperienceAsync({
      slug,
      type: 'countdown',
      theme: 'dreamy',
      title: `Countdown for ${recipient}`,
      senderName: sender,
      recipientName: recipient,
      message: 'Every second ticking brings us closer to our next beautiful moment together.',
      countdownConfig: {
        occasion: 'custom',
        targetDate,
        eventTitle: `Special Day with ${recipient}`,
      },
      reactions: { '❤️': 2, '✨': 3 },
      viewsCount: 1,
    });
  }

  return <LoveCountdownExperience experience={experience} />;
}
