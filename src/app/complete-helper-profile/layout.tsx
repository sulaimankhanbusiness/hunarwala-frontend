import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Complete Your Profile — HunarWalaa',
  description: 'Finish setting up your helper profile to start receiving bookings on HunarWalaa.',
  robots: { index: false, follow: true },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
