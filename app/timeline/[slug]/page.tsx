import React from 'react';
import { Metadata } from 'next';
import { getExperienceBySlugAsync, saveExperienceAsync } from '@/lib/storage';
import TimelineExperience from '@/components/experiences/TimelineExperience';
import { getAppUrl } from '@/lib/config';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const exp = await getExperienceBySlugAsync(slug);

  const title = exp ? `The Story of ${exp.senderName} & ${exp.recipientName || 'You'}` : 'Love Story Timeline | Lover';
  const desc = 'A beautiful interactive timeline chronicling your relationship milestones.';
  const pageUrl = getAppUrl(`/timeline/${slug}`);

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

export default async function TimelinePage({ params }: PageProps) {
  const { slug } = await params;
  let experience = await getExperienceBySlugAsync(slug);

  if (!experience) {
    const parts = slug.split('-and-');
    const sender = parts[0] ? parts[0].charAt(0).toUpperCase() + parts[0].slice(1) : 'Someone Special';
    const recipient = parts[1] ? parts[1].charAt(0).toUpperCase() + parts[1].slice(1) : 'You';

    experience = await saveExperienceAsync({
      slug,
      type: 'timeline',
      theme: 'romantic',
      title: `The Story of ${sender} & ${recipient}`,
      senderName: sender,
      recipientName: recipient,
      message: 'Every chapter of us is worth remembering. Here is our story, from the very first page.',
      reactions: { '❤️': 4, '✨': 2 },
      viewsCount: 1,
    });
  }

  return <TimelineExperience experience={experience} />;
}
