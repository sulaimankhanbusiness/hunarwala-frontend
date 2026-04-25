import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'My Bookings — HunarWalaa',
  description: 'View and manage all your service bookings on HunarWalaa. Track status, chat with helpers, and handle payments.',
  keywords: ['hunarwala bookings', 'manage service bookings Pakistan', 'hunarwalaa'],
  openGraph: {
    title: 'My Bookings — HunarWalaa',
    description: 'Track and manage your service bookings on HunarWalaa.',
    url: 'https://hunarwalaa.com/bookings',
    siteName: 'HunarWalaa',
    locale: 'en_PK',
    type: 'website',
  },
  alternates: { canonical: 'https://hunarwalaa.com/bookings' },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
