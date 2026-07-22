import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Choose Your Role — HunarWalaa',
  description: 'Tell us whether you\'re looking to hire a professional or offer your skills on HunarWalaa.',
  robots: { index: false, follow: true },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
