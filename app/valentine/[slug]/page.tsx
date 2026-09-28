import React from 'react';
import { Metadata } from 'next';
import { getExperienceBySlugAsync, saveExperienceAsync } from '@/lib/storage';
import ValentineExperience from '@/components/experiences/ValentineExperience';
import { getAppUrl } from '@/lib/config';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const exp = await getExperienceBySlugAsync(slug);

  const title = exp ? `${exp.senderName}'s Valentine Invitation` : 'A Valentine Question For You 💕';
  const desc = exp?.message || 'Will you be my Valentine? Tap to answer!';
  const pageUrl = getAppUrl(`/valentine/${slug}`);

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

export default async function ValentinePage({ params }: PageProps) {
  const { slug } = await params;
  let experience = await getExperienceBySlugAsync(slug);

  // If not yet saved in database, parse dynamically from slug names (e.g. /valentine/romeo-and-juliet)
  if (!experience) {
    const parts = slug.split('-and-');
    const sender = parts[0] ? parts[0].charAt(0).toUpperCase() + parts[0].slice(1) : 'Someone Special';
    const recipient = parts[1] ? parts[1].charAt(0).toUpperCase() + parts[1].slice(1) : 'You';

    experience = await saveExperienceAsync({
      slug,
      type: 'valentine',
      theme: 'valentine',
      title: `Valentine Invitation for ${recipient}`,
      senderName: sender,
      recipientName: recipient,
      customQuestion: 'Will you be my Valentine?',
      message: 'Every moment with you feels like pure magic. I have a very important question...',
      secondaryMessage: 'I promise endless laughs, warm hugs, sweet memories and chocolate!',
      reactions: { '❤️': 3 },
      viewsCount: 1,
    });
  }

  return <ValentineExperience experience={experience} />;
}
