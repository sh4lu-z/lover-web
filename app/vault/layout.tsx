import type { Metadata } from 'next';
import { APP_BASE_URL } from '@/lib/config';

export const metadata: Metadata = {
  title: 'My Love Vault & Relationship Analytics',
  description:
    'Track live views, heart reactions, quiz scores, and responses to your personalized love experiences and invitations.',
  alternates: {
    canonical: `${APP_BASE_URL}/vault`,
  },
  openGraph: {
    title: 'My Love Vault & Analytics | Lover',
    description:
      'Track live views, heart reactions, and responses to your personalized love experiences.',
    url: `${APP_BASE_URL}/vault`,
    type: 'website',
  },
};

export default function VaultLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
