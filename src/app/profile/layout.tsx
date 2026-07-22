import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'My Profile — HunarWalaa',
  description: 'View and manage your HunarWalaa profile.',
  robots: { index: false, follow: true },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
