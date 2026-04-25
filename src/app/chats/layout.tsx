import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Messages — HunarWalaa',
  description: 'Chat directly with your booked professionals on HunarWalaa. Stay updated on your service in real time.',
  keywords: ['hunarwala chat', 'message helper Pakistan', 'hunarwalaa messages'],
  openGraph: {
    title: 'Messages — HunarWalaa',
    description: 'Chat with your professionals in real time on HunarWalaa.',
    url: 'https://hunarwalaa.com/chats',
    siteName: 'HunarWalaa',
    locale: 'en_PK',
    type: 'website',
  },
  alternates: { canonical: 'https://hunarwalaa.com/chats' },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
