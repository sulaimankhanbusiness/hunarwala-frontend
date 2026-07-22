import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { Users, ShieldCheck, Zap, MapPin, ExternalLink } from 'lucide-react';

export const metadata: Metadata = {
  title: 'About Us — HunarWalaa',
  description: 'Learn about HunarWalaa — Pakistan\'s skill marketplace connecting clients with verified local professionals. Founded by Sulaiman Khan.',
  alternates: { canonical: 'https://hunarwalaa.com/about' },
};

const founderJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  '@id': 'https://hunarwalaa.com/about#sulaiman-khan',
  name: 'Sulaiman Khan',
  jobTitle: 'Co-Founder & CEO',
  description: 'Sulaiman Khan is the Co-Founder and CEO of HunarWalaa, Pakistan\'s trusted service marketplace. A Software Engineering graduate from Abdul Wali Khan University Mardan, he leads product strategy, software architecture, and business growth for the platform.',
  url: 'https://hunarwalaa.com/about',
  image: 'https://hunarwalaa.com/sulaiman-khan.jpg',
  alumniOf: {
    '@type': 'EducationalOrganization',
    name: 'Abdul Wali Khan University Mardan',
  },
  worksFor: { '@id': 'https://hunarwalaa.com/#organization' },
  sameAs: ['https://www.linkedin.com/in/sulaiman-khan-19b3311b4'],
};

const values = [
  {
    icon: ShieldCheck,
    title: 'Verified Professionals',
    description: 'Every helper on our platform goes through a verification process including CNIC check and skill assessment before they can accept bookings.',
  },
  {
    icon: Zap,
    title: 'Fast Booking',
    description: 'Book a skilled professional in minutes. No long wait times, no back-and-forth — just pick a service, choose a helper, and confirm.',
  },
  {
    icon: MapPin,
    title: 'Local First',
    description: 'We connect you with the nearest available professional — at home, on the road, or anywhere across Pakistan. Wherever you are, help is close by.',
  },
  {
    icon: Users,
    title: 'Fair for Everyone',
    description: 'Clients get quality service at fair prices. Helpers get consistent work and a platform that treats them as professionals, not gig workers.',
  },
];

export default function AboutPage() {
  return (
    <div className="bg-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(founderJsonLd) }}
      />

      {/* Hero */}
      <section className="bg-gradient-to-br from-indigo-600 to-blue-700 text-white py-20 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">About HunarWalaa</h1>
          <p className="text-indigo-100 text-lg md:text-xl">
            Pakistan&apos;s skill marketplace — connecting people with verified local professionals wherever they need help, at home, on the road, or anywhere in between.
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="max-w-4xl mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Mission</h2>
            <p className="text-gray-600 text-lg leading-relaxed mb-4">
              HunarWalaa was built around a simple idea — whenever you need a skilled professional, you should be able to find one nearby within minutes. Whether your pipe bursts at home, your car breaks down on the motorway, or your AC stops working in the middle of summer, help should never be more than a few taps away.
            </p>
            <p className="text-gray-600 text-lg leading-relaxed mb-4">
              We connect clients with verified professionals across every category — plumbers, electricians, mechanics, cleaners, and more. At home, on the road, wherever you are.
            </p>
            <p className="text-gray-600 text-lg leading-relaxed">
              At the same time, we believe skilled tradespeople deserve dignity and a steady income. HunarWalaa gives them the tools to grow their business without depending on word-of-mouth alone.
            </p>
          </div>
          <div className="bg-indigo-50 rounded-2xl p-8">
            <div className="space-y-6">
              <div>
                <div className="text-4xl font-bold text-indigo-600">30+</div>
                <div className="text-gray-600 mt-1">Service categories</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-indigo-600">300+</div>
                <div className="text-gray-600 mt-1">Cities covered across Pakistan</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-indigo-600">100%</div>
                <div className="text-gray-600 mt-1">Verified professionals</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Founder */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Meet the Founder</h2>
          <div className="flex flex-col md:flex-row items-center md:items-start gap-8 bg-indigo-50 rounded-2xl p-8">
            <Image
              src="/sulaiman-khan.jpg"
              alt="Sulaiman Khan, Co-Founder and CEO of HunarWalaa"
              width={160}
              height={160}
              className="rounded-2xl object-cover w-40 h-40 flex-shrink-0"
            />
            <div>
              <h3 className="text-2xl font-bold text-gray-900">Sulaiman Khan</h3>
              <p className="text-indigo-600 font-semibold mb-4">Co-Founder &amp; CEO, HunarWalaa</p>
              <p className="text-gray-600 leading-relaxed mb-4">
                Sulaiman Khan is the Co-Founder and CEO of HunarWalaa, leading product strategy, software architecture, and business growth. He designed and built the platform using Next.js, React Native, NestJS, and PostgreSQL to connect skilled professionals across Pakistan with customers who need their services.
              </p>
              <p className="text-gray-600 leading-relaxed mb-4">
                He holds a BS in Software Engineering from Abdul Wali Khan University Mardan (2021) and is focused on making HunarWalaa Pakistan&apos;s most trusted service marketplace — helping skilled workers find opportunities and grow their careers through technology.
              </p>
              <a
                href="https://www.linkedin.com/in/sulaiman-khan-19b3311b4"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-indigo-600 font-semibold hover:text-indigo-700 transition-colors"
              >
                Connect on LinkedIn <ExternalLink size={16} />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="bg-gray-50 py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">What We Stand For</h2>
          <div className="grid md:grid-cols-2 gap-8">
            {values.map(({ icon: Icon, title, description }) => (
              <div key={title} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center mb-4">
                  <Icon className="w-6 h-6 text-indigo-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
                <p className="text-gray-600 leading-relaxed">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Story */}
      <section className="max-w-3xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-gray-900 mb-6">How It Started</h2>
        <div className="prose prose-gray max-w-none text-gray-600 text-lg leading-relaxed space-y-4">
          <p>
            HunarWalaa started from a simple frustration — too many skilled workers in Pakistan had no reliable way to find clients, and too many clients had no reliable way to find skilled workers.
          </p>
          <p>
            The informal market existed but it was built entirely on referrals. New workers couldn&apos;t break in, and clients had no recourse when things went wrong. And if something went wrong away from home — a car breakdown on a highway, a flat tyre on a long drive — you were truly on your own.
          </p>
          <p>
            We built HunarWalaa to change that. A structured, location-aware marketplace where the quality of your work — not the size of your network — determines your success. And where anyone, anywhere in Pakistan, can find the right professional at the right moment.
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-indigo-600 text-white py-14 px-4 text-center">
        <h2 className="text-2xl md:text-3xl font-bold mb-4">Ready to get started?</h2>
        <p className="text-indigo-100 mb-8 text-lg">Find a verified professional near you in minutes.</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/services"
            className="inline-block bg-white text-indigo-600 font-semibold px-8 py-3 rounded-xl hover:bg-indigo-50 transition-colors"
          >
            Browse Services
          </Link>
          <Link
            href="/contact"
            className="inline-block border border-white text-white font-semibold px-8 py-3 rounded-xl hover:bg-white/10 transition-colors"
          >
            Contact Us
          </Link>
        </div>
      </section>
    </div>
  );
}
