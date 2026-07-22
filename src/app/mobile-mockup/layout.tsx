import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Mobile Mockup — HunarWalaa',
  description: 'Internal mobile app mockup preview.',
  robots: { index: false, follow: false },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
