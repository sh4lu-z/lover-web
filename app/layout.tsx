import type { Metadata, Viewport } from 'next';
import './globals.css';
import { APP_BASE_URL, APP_DOMAIN } from '@/lib/config';

export const viewport: Viewport = {
  themeColor: '#0b070c',
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(APP_BASE_URL),
  title: {
    default: 'Lover — Romantic Experiences, Valentine Invitations & Love Games',
    template: '%s | Lover',
  },
  description:
    'Create unforgettable personalized love pages, playful Valentine runaway-button invitations, couple quizzes, secret reveal links, and romantic shareable cards.',
  applicationName: 'Lover',
  keywords: [
    'valentine',
    'valentine invitation',
    'runaway no button',
    'love letter',
    'couple quiz',
    'relationship games',
    'romantic experience',
    'secret love capsule',
    'love timeline',
    'lover.s4z.top',
  ],
  authors: [{ name: 'Lover', url: APP_BASE_URL }],
  creator: 'Lover',
  publisher: 'Lover',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: APP_BASE_URL,
  },
  openGraph: {
    title: 'Lover — Romantic Experiences, Valentine Invitations & Love Games',
    description:
      'Create personalized love pages, playful Valentine runaway-button invitations, couple quizzes, secret reveal links, and romantic shareable cards.',
    url: APP_BASE_URL,
    siteName: APP_DOMAIN,
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Lover — Romantic Experiences & Love Games',
    description:
      'Create personalized love pages, playful Valentine runaway-button invitations, couple quizzes, secret reveal links, and romantic shareable cards.',
    site: `@${APP_DOMAIN}`,
    creator: `@${APP_DOMAIN}`,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Lover',
  url: APP_BASE_URL,
  applicationCategory: 'LifestyleApplication',
  operatingSystem: 'All',
  description:
    'Create personalized love pages, playful Valentine runaway-button invitations, couple quizzes, secret reveal links, and romantic shareable cards.',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
  },
  author: {
    '@type': 'Organization',
    name: 'Lover',
    url: APP_BASE_URL,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body
        className="min-h-screen bg-[#0b070c] text-rose-50 antialiased selection:bg-rose-500 selection:text-white"
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}
