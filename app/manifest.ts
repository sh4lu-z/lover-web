import { MetadataRoute } from 'next';
import { APP_DOMAIN } from '@/lib/config';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Lover — Romantic Experiences & Love Games',
    short_name: 'Lover',
    description:
      'Create personalized love pages, playful Valentine runaway-button invitations, couple quizzes, secret reveal links, and romantic shareable cards.',
    start_url: '/',
    display: 'standalone',
    background_color: '#0b070c',
    theme_color: '#0b070c',
    icons: [
      {
        src: '/favicon.ico',
        sizes: 'any',
        type: 'image/x-icon',
      },
    ],
  };
}
