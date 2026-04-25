import type { Metadata } from 'next';
import HelperSearch from '@/features/helpers/components/HelperSearch';
import EarnSection from '@/features/helpers/components/EarnSection';
import ScrollReveal from '@/components/ScrollReveal';
import { ShieldCheck, CheckCircle2, Zap, Star, Users, MapPin, Briefcase } from 'lucide-react';

export const metadata: Metadata = {
  title: 'HunarWalaa — Find Skilled Professionals',
  description: 'Pakistan\'s #1 service marketplace. Book verified plumbers, electricians, cleaners and 20+ skilled professionals near you. Fast, safe, and affordable.',
  keywords: [
    'HunarWalaa', 'HunarWala', 'hunarwala', 'hunarwalaa',
    'home services Pakistan', 'hire plumber Pakistan',
    'electrician near me Pakistan', 'book helper Pakistan',
    'verified professionals Pakistan', 'service marketplace Pakistan',
    'ہنروالا',
  ],
  openGraph: {
    title: 'HunarWalaa — Find Skilled Professionals',
    description: 'Book verified plumbers, electricians, cleaners and more across Pakistan.',
    url: 'https://hunarwalaa.com',
    siteName: 'HunarWalaa',
    locale: 'en_PK',
    type: 'website',
  },
  alternates: { canonical: 'https://hunarwalaa.com' },
};

const HERO_STATS = [
  { icon: Briefcase, value: '8,500+', label: 'Bookings Completed' },
  { icon: Users,     value: '1,200+', label: 'Verified Professionals' },
  { icon: Star,      value: '4.8★',   label: 'Average Rating' },
  { icon: MapPin,    value: '35+',    label: 'Cities Covered' },
];

const TRUST_CARDS = [
  {
    icon: ShieldCheck,
    title: 'Verified Professionals',
    body: 'Every helper undergoes a strict background check and skill verification process before joining.',
  },
  {
    icon: CheckCircle2,
    title: 'Transparent Pricing',
    body: 'Know the rates upfront. No hidden fees or last-minute surprises. Pay only for what you agreed on.',
  },
  {
    icon: Zap,
    title: 'Fast & Reliable',
    body: 'Book a pro in minutes. Our matching system connects you with the nearest available expert instantly.',
  },
];

export default function Home() {
  return (
    <div className="min-h-screen">

      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <section className="relative bg-gradient-to-br from-blue-700 via-blue-800 to-indigo-900 text-white py-24 pb-32 overflow-hidden">

        {/* Animated dot grid */}
        <div className="absolute inset-0 anim-dot-grid bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:20px_20px]" />

        {/* Floating morphing blobs */}
        <div className="absolute -top-24 -left-24  w-96 h-96 bg-blue-400/20  anim-blob        blur-3xl rounded-full" />
        <div className="absolute -bottom-16 -right-16 w-80 h-80 bg-indigo-400/20 anim-blob-delayed blur-3xl rounded-full" />
        <div className="absolute top-1/3 right-1/4  w-48 h-48 bg-white/5     anim-float-slow  blur-2xl rounded-full" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">

          {/* Badge */}
          <div className="anim-hero-badge inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 px-4 py-1.5 rounded-full text-blue-100 text-sm font-medium mb-8">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
            </span>
            #1 Service Marketplace in Pakistan
          </div>

          {/* Headline */}
          <h1 className="anim-hero-title text-5xl md:text-6xl font-extrabold mb-6 tracking-tight leading-tight">
            Expert Help, <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-white">
              Right at Your Doorstep
            </span>
          </h1>

          {/* Subtitle */}
          <p className="anim-hero-subtitle text-xl text-blue-100/90 mb-10 max-w-2xl mx-auto leading-relaxed">
            Connect with verified professionals for plumbing, electrical work, cleaning, and more.
            Trusted by thousands of households.
          </p>

          {/* CTAs */}
          <div className="anim-hero-ctas flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="#search"
              className="px-8 py-4 bg-white text-blue-700 rounded-xl font-bold hover:bg-blue-50 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 text-center"
            >
              Find a Professional
            </a>
            <a
              href="/register?type=helper"
              className="px-8 py-4 bg-amber-500 text-white rounded-xl font-bold hover:bg-amber-600 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 text-center flex items-center gap-2 justify-center"
            >
              Become a Helper
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
            </a>
          </div>

          {/* Hero stats row */}
          <div className="anim-hero-stats mt-14 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
            {HERO_STATS.map(({ icon: Icon, value, label }) => (
              <div
                key={label}
                className="bg-white/10 backdrop-blur-sm border border-white/15 rounded-2xl px-4 py-4 flex flex-col items-center gap-1.5 hover:bg-white/15 transition-colors"
              >
                <Icon size={18} className="text-blue-200 mb-0.5" />
                <span className="text-xl font-extrabold text-white">{value}</span>
                <span className="text-xs text-blue-200/70 font-medium text-center leading-tight">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Search & Results ─────────────────────────────────────────────── */}
      <section id="search" className="bg-gray-50 pb-20 scroll-mt-20">
        <HelperSearch />
      </section>

      {/* ── Earn Section (animated client component) ─────────────────────── */}
      <EarnSection />

      {/* ── Trust / Why Choose ───────────────────────────────────────────── */}
      <section className="bg-white py-24 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <ScrollReveal className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose HunarWalaa</h2>
            <p className="text-gray-500 max-w-2xl mx-auto">
              We don't just find you help; we ensure peace of mind with our rigorous vetting and safety standards.
            </p>
          </ScrollReveal>

          <div className="grid md:grid-cols-3 gap-12">
            {TRUST_CARDS.map(({ icon: Icon, title, body }, i) => (
              <ScrollReveal key={title} delay={i * 120}>
                <div className="text-center p-6 rounded-2xl hover:bg-blue-50 transition-colors duration-300 group">
                  <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 icon-pop group-hover:scale-110 group-hover:bg-blue-200 transition-all duration-300">
                    <Icon size={32} />
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-gray-900">{title}</h3>
                  <p className="text-gray-600 leading-relaxed">{body}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
