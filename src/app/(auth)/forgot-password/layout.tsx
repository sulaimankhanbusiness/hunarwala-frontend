import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Forgot Password — HunarWalaa',
  description: 'Reset the password for your HunarWalaa account.',
  robots: { index: false, follow: true },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
