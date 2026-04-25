import type { Metadata } from 'next';
import Link from 'next/link';
import ScrollReveal from '@/components/ScrollReveal';
import EarnSection from '@/features/helpers/components/EarnSection';
import { CategoriesSection } from './_components/CategoriesSection';
import {
  Search, CalendarCheck, Star, ShieldCheck, CheckCircle2, Zap,
  Droplets, Wind, Sparkles, Hammer, ArrowRight, MapPin, Users,
  Briefcase, ChevronRight, Clock, BadgeCheck, PhoneCall, MessageCircle,
} from 'lucide-react';

// ─── SEO Metadata ─────────────────────────────────────────────────────────────

export const metadata: Metadata = {
  title: 'Home Services in Pakistan | HunarWalaa – Verified Professionals',
  description:
    'Book trusted plumbers, electricians, cleaners, carpenters, AC technicians & 20+ skilled professionals across Pakistan. Verified, affordable & available today.',
  keywords: [
    'home services Pakistan',
    'plumber near me Pakistan',
    'electrician Pakistan',
    'house cleaning service',
    'AC repair Karachi Lahore',
    'handyman Pakistan',
    'HunarWalaa services',
    'book professional Pakistan',
    'home maintenance Pakistan',
  ],
  alternates: {
    canonical: 'https://hunarwala.com/services',
  },
  openGraph: {
    type: 'website',
    url: 'https://hunarwala.com/services',
    title: 'Home Services in Pakistan | HunarWalaa',
    description:
      'Book verified plumbers, electricians, cleaners & 20+ skilled professionals across Pakistan. Transparent pricing. Same-day availability.',
    siteName: 'HunarWalaa',
    images: [
      {
        url: 'https://hunarwala.com/og-services.png',
        width: 1200,
        height: 630,
        alt: 'HunarWalaa – Hire skilled home-service professionals across Pakistan',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Home Services in Pakistan | HunarWalaa',
    description:
      'Book trusted plumbers, electricians, cleaners & more across Pakistan. Verified pros, transparent prices.',
    images: ['https://hunarwala.com/og-services.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-snippet': -1, 'max-image-preview': 'large' },
  },
};

// ─── JSON-LD Structured Data ──────────────────────────────────────────────────

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebPage',
      '@id': 'https://hunarwala.com/services',
      url: 'https://hunarwala.com/services',
      name: 'Home Services in Pakistan | HunarWalaa',
      description:
        'Book verified plumbers, electricians, cleaners, carpenters, AC technicians & 20+ skilled professionals across Pakistan.',
      inLanguage: 'en-PK',
      isPartOf: { '@id': 'https://hunarwala.com' },
      breadcrumb: {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://hunarwala.com' },
          { '@type': 'ListItem', position: 2, name: 'Services', item: 'https://hunarwala.com/services' },
        ],
      },
    },
    {
      '@type': 'Organization',
      '@id': 'https://hunarwala.com/#organization',
      name: 'HunarWalaa',
      url: 'https://hunarwala.com',
      description: "Pakistan's trusted marketplace for home services and skilled professionals.",
      areaServed: { '@type': 'Country', name: 'Pakistan' },
    },
    {
      '@type': 'ItemList',
      name: 'Popular Home Services',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Plumbing', url: 'https://hunarwala.com/?skill=Plumbing#search' },
        { '@type': 'ListItem', position: 2, name: 'Electrical Work', url: 'https://hunarwala.com/?skill=Electrical+Work#search' },
        { '@type': 'ListItem', position: 3, name: 'Home Cleaning', url: 'https://hunarwala.com/?skill=Home+Cleaning#search' },
        { '@type': 'ListItem', position: 4, name: 'AC & HVAC', url: 'https://hunarwala.com/?skill=AC+%26+HVAC#search' },
        { '@type': 'ListItem', position: 5, name: 'Carpentry', url: 'https://hunarwala.com/?skill=Carpentry#search' },
      ],
    },
  ],
};

// ─── Static data ──────────────────────────────────────────────────────────────

const HOW_IT_WORKS = [
  {
    step: '01',
    icon: Search,
    title: 'Find Your Service',
    description: 'Browse categories or search for a specific skill. Filter by location, rating, or price to narrow down the best match.',
    color: 'text-blue-600',
    bg: 'bg-blue-50',
    ring: 'ring-blue-100',
  },
  {
    step: '02',
    icon: CalendarCheck,
    title: 'Book Instantly',
    description: 'Pick a date and time that works for you. Send a booking request and get confirmation within minutes.',
    color: 'text-emerald-600',
    bg: 'bg-emerald-50',
    ring: 'ring-emerald-100',
  },
  {
    step: '03',
    icon: Star,
    title: 'Rate & Relax',
    description: 'Your pro arrives, gets the job done, and you pay only when satisfied. Leave a review to help the community.',
    color: 'text-amber-600',
    bg: 'bg-amber-50',
    ring: 'ring-amber-100',
  },
];

const POPULAR_SERVICES = [
  {
    icon: Droplets,
    name: 'Plumbing',
    tagline: 'Leaks, clogs & pipe repairs',
    priceFrom: 'Rs. 500',
    time: '1–3 hrs',
    color: 'text-blue-600',
    bg: 'bg-blue-50',
    border: 'border-blue-100',
    badge: 'bg-blue-100 text-blue-700',
    perks: ['Certified plumbers', 'Same-day available', 'Parts included'],
  },
  {
    icon: Zap,
    name: 'Electrical Work',
    tagline: 'Wiring, sockets & fixtures',
    priceFrom: 'Rs. 800',
    time: '2–4 hrs',
    color: 'text-yellow-600',
    bg: 'bg-yellow-50',
    border: 'border-yellow-100',
    badge: 'bg-yellow-100 text-yellow-700',
    perks: ['Licensed electricians', 'Safety certified', 'Warranty on work'],
  },
  {
    icon: Sparkles,
    name: 'Home Cleaning',
    tagline: 'Deep clean & regular maintenance',
    priceFrom: 'Rs. 1,200',
    time: '2–5 hrs',
    color: 'text-emerald-600',
    bg: 'bg-emerald-50',
    border: 'border-emerald-100',
    badge: 'bg-emerald-100 text-emerald-700',
    perks: ['Eco-friendly products', 'Insured cleaners', 'Flexible schedule'],
  },
  {
    icon: Wind,
    name: 'AC & HVAC',
    tagline: 'Service, repair & installation',
    priceFrom: 'Rs. 1,500',
    time: '1–3 hrs',
    color: 'text-sky-600',
    bg: 'bg-sky-50',
    border: 'border-sky-100',
    badge: 'bg-sky-100 text-sky-700',
    perks: ['All brands covered', 'Gas refilling', '90-day warranty'],
  },
  {
    icon: Hammer,
    name: 'Carpentry',
    tagline: 'Furniture, doors & custom woodwork',
    priceFrom: 'Rs. 700',
    time: '2–6 hrs',
    color: 'text-amber-700',
    bg: 'bg-amber-50',
    border: 'border-amber-100',
    badge: 'bg-amber-100 text-amber-800',
    perks: ['Custom designs', 'Quality materials', 'On-site work'],
  },
  {
    icon: Search,
    name: 'And Much More',
    tagline: 'Browse all 20+ service categories',
    priceFrom: 'Varies',
    time: 'Flexible',
    color: 'text-blue-600',
    bg: 'bg-gray-50',
    border: 'border-gray-100',
    badge: 'bg-gray-100 text-gray-600',
    perks: ['Painting & finishing', 'Tutoring & coaching', 'Security & CCTV'],
    isExplore: true,
  },
];

const TRUST_ITEMS = [
  {
    icon: ShieldCheck,
    title: 'Verified Professionals',
    body: 'Every pro on HunarWalaa goes through identity checks, skill assessments, and community reviews before being listed.',
  },
  {
    icon: CheckCircle2,
    title: 'Transparent Pricing',
    body: 'See hourly rates upfront. Agree on a price before work begins — no surprise charges, ever.',
  },
  {
    icon: BadgeCheck,
    title: 'Satisfaction Guaranteed',
    body: 'Not happy with the work? Raise a dispute and our support team will make it right within 24 hours.',
  },
  {
    icon: MessageCircle,
    title: 'Real-Time Chat',
    body: 'Message your pro directly before and after booking. Get updates, share photos, and coordinate easily.',
  },
  {
    icon: Clock,
    title: 'Flexible Scheduling',
    body: 'Book for today, tomorrow, or a week from now. Pros set their own availability so you always find someone ready.',
  },
  {
    icon: PhoneCall,
    title: '24/7 Support',
    body: 'Our customer support team is always on standby to help resolve issues, process refunds, or answer questions.',
  },
];

const STATS = [
  { icon: Briefcase, value: '8,500+', label: 'Jobs Completed' },
  { icon: Users,     value: '1,200+', label: 'Verified Pros' },
  { icon: Star,      value: '4.8★',   label: 'Avg Rating' },
  { icon: MapPin,    value: '35+',    label: 'Cities' },
];

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ServicesPage() {
  return (
    <main className="min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <section className="relative bg-gradient-to-br from-blue-700 via-blue-800 to-indigo-900 text-white py-24 pb-36 overflow-hidden">

        <div className="absolute inset-0 anim-dot-grid bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:20px_20px]" />
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-blue-400/20 anim-blob blur-3xl rounded-full" />
        <div className="absolute -bottom-16 -right-16 w-80 h-80 bg-indigo-400/20 anim-blob-delayed blur-3xl rounded-full" />
        <div className="absolute top-1/3 right-1/4 w-48 h-48 bg-white/5 anim-float-slow blur-2xl rounded-full" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">

          {/* Badge */}
          <div className="anim-hero-badge inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 px-4 py-1.5 rounded-full text-blue-100 text-sm font-medium mb-8">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
            </span>
            20+ Service Categories · Pakistan-wide
          </div>

          <h1 className="anim-hero-title text-4xl md:text-6xl font-extrabold mb-6 tracking-tight leading-tight">
            Every Service You Need,<br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-white">
              One Trusted Platform
            </span>
          </h1>

          <p className="anim-hero-subtitle text-xl text-blue-100/90 mb-10 max-w-2xl mx-auto leading-relaxed">
            Book verified plumbers, electricians, cleaners, carpenters, and 20+ more
            skilled professionals — delivered to your door across Pakistan.
          </p>

          <div className="anim-hero-ctas flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="#categories"
              className="px-8 py-4 bg-white text-blue-700 rounded-xl font-bold hover:bg-blue-50 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 text-center"
            >
              Browse Services
            </a>
            <Link
              href="/#search"
              className="px-8 py-4 bg-amber-500 text-white rounded-xl font-bold hover:bg-amber-600 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 text-center flex items-center gap-2 justify-center"
            >
              Find a Pro Now
              <ArrowRight size={18} />
            </Link>
          </div>

          {/* Stats row */}
          <div className="anim-hero-stats mt-14 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
            {STATS.map(({ icon: Icon, value, label }) => (
              <div key={label} className="bg-white/10 backdrop-blur-sm border border-white/15 rounded-2xl px-4 py-4 flex flex-col items-center gap-1.5 hover:bg-white/15 transition-colors">
                <Icon size={18} className="text-blue-200 mb-0.5" />
                <span className="text-xl font-extrabold text-white">{value}</span>
                <span className="text-xs text-blue-200/70 font-medium text-center leading-tight">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Dynamic Categories Grid (client component) ─────────────────── */}
      <CategoriesSection />

      {/* ── How It Works ──────────────────────────────────────────────── */}
      <section className="bg-gray-50 py-24 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <ScrollReveal className="text-center mb-16">
            <span className="inline-block bg-emerald-50 text-emerald-700 text-xs font-black px-4 py-1.5 rounded-full uppercase tracking-widest mb-5 border border-emerald-100">
              Simple Process
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-gray-500 max-w-xl mx-auto leading-relaxed">
              From browsing to booking to done — it takes under 3 minutes.
            </p>
          </ScrollReveal>

          <div className="grid md:grid-cols-3 gap-8 relative">
            {/* Connector line between steps (desktop only) */}
            <div className="hidden md:block absolute top-[52px] left-[calc(16.67%+2rem)] right-[calc(16.67%+2rem)] h-px bg-gradient-to-r from-blue-200 via-emerald-200 to-amber-200" />

            {HOW_IT_WORKS.map(({ step, icon: Icon, title, description, color, bg, ring }, i) => (
              <ScrollReveal key={step} delay={i * 130}>
                <div className="relative flex flex-col items-center text-center p-8 bg-white rounded-2xl border border-gray-100 hover:shadow-xl transition-all duration-300 group">
                  {/* Step number */}
                  <div className="absolute -top-3 left-6 bg-white border border-gray-200 text-gray-400 text-[10px] font-black px-2 py-0.5 rounded-full tracking-widest">
                    STEP {step}
                  </div>

                  <div className={`w-16 h-16 ${bg} ${color} ring-4 ${ring} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 icon-pop`}>
                    <Icon size={30} strokeWidth={1.8} />
                  </div>

                  <h3 className="text-lg font-bold text-gray-900 mb-3">{title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{description}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Popular Services ───────────────────────────────────────────── */}
      <section className="bg-white py-24 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <ScrollReveal className="text-center mb-16">
            <span className="inline-block bg-amber-50 text-amber-700 text-xs font-black px-4 py-1.5 rounded-full uppercase tracking-widest mb-5 border border-amber-100">
              Most Booked
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">
              Popular Services
            </h2>
            <p className="text-gray-500 max-w-xl mx-auto leading-relaxed">
              The services our customers book the most — all available in your city today.
            </p>
          </ScrollReveal>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {POPULAR_SERVICES.map(({ icon: Icon, name, tagline, priceFrom, time, color, bg, border, badge, perks, isExplore }, i) => (
              <ScrollReveal key={name} delay={i * 80}>
                <div className={`group h-full flex flex-col bg-white rounded-2xl border ${border} p-6 hover:shadow-xl transition-all duration-300 ${isExplore ? 'bg-gray-50/60' : ''}`}>

                  {/* Header */}
                  <div className="flex items-start justify-between mb-5">
                    <div className={`w-12 h-12 ${bg} ${color} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                      <Icon size={22} />
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <span className={`text-[11px] font-bold px-2.5 py-1 rounded-lg ${badge}`}>
                        From {priceFrom}
                      </span>
                      <span className="text-[11px] text-gray-400 font-medium flex items-center gap-1">
                        <Clock size={10} /> {time}
                      </span>
                    </div>
                  </div>

                  {/* Info */}
                  <h3 className="text-base font-bold text-gray-900 mb-1">{name}</h3>
                  <p className="text-sm text-gray-500 mb-5">{tagline}</p>

                  {/* Perks */}
                  <ul className="space-y-2 mb-6 flex-1">
                    {perks.map((perk) => (
                      <li key={perk} className="flex items-center gap-2 text-xs text-gray-600 font-medium">
                        <CheckCircle2 size={13} className={`${color} flex-shrink-0`} />
                        {perk}
                      </li>
                    ))}
                  </ul>

                  {/* CTA */}
                  <Link
                    href={isExplore ? '#categories' : `/?skill=${encodeURIComponent(name)}#search`}
                    className={`w-full py-2.5 rounded-xl font-semibold text-sm text-center transition-all flex items-center justify-center gap-1.5 ${
                      isExplore
                        ? 'border border-gray-200 text-gray-600 hover:border-blue-500 hover:text-blue-600 hover:bg-blue-50'
                        : `border ${border} ${color} hover:shadow-md hover:-translate-y-0.5 bg-white`
                    }`}
                  >
                    {isExplore ? 'View All Categories' : `Book ${name}`}
                    <ChevronRight size={14} />
                  </Link>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Why HunarWalaa─────────────────────────────────────────────── */}
      <section className="bg-gray-50 py-24 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <ScrollReveal className="text-center mb-16">
            <span className="inline-block bg-blue-50 text-blue-700 text-xs font-black px-4 py-1.5 rounded-full uppercase tracking-widest mb-5 border border-blue-100">
              Why Us
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">
              Built for Peace of Mind
            </h2>
            <p className="text-gray-500 max-w-xl mx-auto leading-relaxed">
              We don't just connect you with workers — we stand behind every booking.
            </p>
          </ScrollReveal>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {TRUST_ITEMS.map(({ icon: Icon, title, body }, i) => (
              <ScrollReveal key={title} delay={i * 80}>
                <div className="group flex gap-5 p-6 bg-white rounded-2xl border border-gray-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                  <div className="flex-shrink-0 w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300 icon-pop">
                    <Icon size={22} />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-2 text-sm">{title}</h3>
                    <p className="text-gray-500 text-sm leading-relaxed">{body}</p>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Earn Section ──────────────────────────────────────────────── */}
      <EarnSection />

      {/* ── Final CTA ─────────────────────────────────────────────────── */}
      <section className="bg-white py-24 border-t border-gray-100">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <ScrollReveal>
            <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 text-xs font-black px-4 py-1.5 rounded-full uppercase tracking-widest mb-6 border border-blue-100">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-600" />
              </span>
              Ready to Get Started?
            </div>

            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-5 leading-tight">
              Your Next Pro is<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                Just a Tap Away
              </span>
            </h2>

            <p className="text-gray-500 text-lg leading-relaxed mb-10 max-w-xl mx-auto">
              Join thousands of households across Pakistan who trust HunarWalaa for reliable, affordable home services.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/#search"
                className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition-all shadow-lg shadow-blue-200 hover:shadow-xl hover:-translate-y-0.5 flex items-center justify-center gap-2"
              >
                <Search size={18} />
                Find a Professional
              </Link>
              <Link
                href="/register?type=helper"
                className="px-8 py-4 bg-white border border-gray-200 hover:border-blue-300 hover:bg-blue-50 text-gray-700 hover:text-blue-700 rounded-xl font-bold transition-all hover:-translate-y-0.5 flex items-center justify-center gap-2"
              >
                Become a Helper
                <ArrowRight size={18} />
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>

    </main>
  );
}
