import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact Us — HunarWalaa',
  description:
    'Get in touch with HunarWalaa. Call, WhatsApp, or email us for booking support, complaints, partnerships, or any questions about our service marketplace in Pakistan.',
  keywords: [
    'contact HunarWalaa',
    'HunarWalaa support',
    'service marketplace Pakistan',
    'book plumber electrician Pakistan',
    'hunarwalaa.com contact',
  ],
  openGraph: {
    title: 'Contact Us — HunarWalaa',
    description: 'Reach out to HunarWalaa for support, bookings, or partnerships. We reply within 24 hours.',
    url: 'https://hunarwalaa.com/contact',
    siteName: 'HunarWalaa',
    locale: 'en_PK',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'Contact Us — HunarWalaa',
    description: 'Reach out to HunarWalaa for support, bookings, or partnerships.',
  },
  alternates: {
    canonical: 'https://hunarwalaa.com/contact',
  },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children;
}
