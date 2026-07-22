import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Verify Email — HunarWalaa',
  description: 'Verify your email address to activate your HunarWalaa account.',
  robots: { index: false, follow: true },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
