import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Join Free — HunarWalaa',
  description: 'Create a free HunarWalaa account. Find skilled professionals near you or register as a helper and start earning in Pakistan.',
  keywords: ['join hunarwala', 'register hunarwalaa', 'become helper Pakistan', 'hire professionals Pakistan', 'hunarwala signup'],
  openGraph: {
    title: 'Join Free — HunarWalaa',
    description: 'Create a free account and connect with verified professionals across Pakistan.',
    url: 'https://hunarwalaa.com/register',
    siteName: 'HunarWalaa',
    locale: 'en_PK',
    type: 'website',
  },
  alternates: { canonical: 'https://hunarwalaa.com/register' },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
