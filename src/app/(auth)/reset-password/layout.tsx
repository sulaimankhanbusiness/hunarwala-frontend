import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Reset Password — HunarWalaa',
  description: 'Set a new password for your HunarWalaa account.',
  robots: { index: false, follow: true },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
