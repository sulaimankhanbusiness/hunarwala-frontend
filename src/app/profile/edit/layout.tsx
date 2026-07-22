import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Edit Profile — HunarWalaa',
  description: 'Update your HunarWalaa profile details, services, and rates.',
  robots: { index: false, follow: true },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
