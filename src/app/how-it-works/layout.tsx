import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'How It Works — HunarWalaa',
  description: 'Learn how HunarWalaa connects you with verified professionals in Pakistan. Search, book, track, and get the job done — in minutes.',
  keywords: ['how hunarwala works', 'book home service Pakistan', 'hire helper Pakistan', 'hunarwala guide', 'hunarwalaa'],
  openGraph: {
    title: 'How It Works — HunarWalaa',
    description: 'Search, book, and track verified professionals across Pakistan in just a few taps.',
    url: 'https://hunarwalaa.com/how-it-works',
    siteName: 'HunarWalaa',
    locale: 'en_PK',
    type: 'website',
  },
  alternates: { canonical: 'https://hunarwalaa.com/how-it-works' },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
