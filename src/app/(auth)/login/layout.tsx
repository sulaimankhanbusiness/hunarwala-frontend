import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Login — HunarWalaa',
  description: 'Sign in to your HunarWalaa account to manage bookings, chat with helpers, and access your wallet.',
  keywords: ['hunarwala login', 'hunarwalaa sign in', 'service marketplace Pakistan login'],
  openGraph: {
    title: 'Login — HunarWalaa',
    description: 'Sign in to your HunarWalaa account.',
    url: 'https://hunarwalaa.com/login',
    siteName: 'HunarWalaa',
    locale: 'en_PK',
    type: 'website',
  },
  alternates: { canonical: 'https://hunarwalaa.com/login' },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
