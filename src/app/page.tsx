import type { Metadata } from 'next';
import Link from 'next/link';
import HelperSearch from '@/features/helpers/components/HelperSearch';
import EarnSection from '@/features/helpers/components/EarnSection';
import ScrollReveal from '@/components/ScrollReveal';
import {
  ShieldCheck, CheckCircle2, Zap,
  ChevronRight,
} from 'lucide-react';
import HeroContent from './_components/HeroContent';
import CategoryGrid from './_components/CategoryGrid';
import PromoMarquee from './_components/PromoMarquee';

interface ApiCategory { id: number; name: string; slug: string }

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000';

async function fetchCategories(): Promise<ApiCategory[]> {
  try {
    const res = await fetch(`${API_BASE}/skills/categories`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return [];
    const json = await res.json();
    return Array.isArray(json.data) ? json.data : [];
  } catch {
    return [];
  }
}

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


const CLIENT_STEPS = [
  { step: '01', title: 'Search & Discover',   body: 'Browse 50+ categories or search by skill. Filter by city, price & rating to find your match in seconds.' },
  { step: '02', title: 'Book in Seconds',     body: 'View the pro\'s full profile, pick a date and time, and confirm — they respond within minutes.' },
  { step: '03', title: 'Confirm & Review',    body: 'Once the job is done, confirm the work, settle payment directly, and leave a rating.' },
];

const TRUST_CARDS = [
  {
    icon: ShieldCheck,
    title: 'Verified Professionals',
    body: 'Every helper undergoes a strict background check and skill verification before joining.',
    iconBg: 'bg-indigo-50', iconColor: 'text-indigo-600', accent: 'border-t-indigo-500',
  },
  {
    icon: CheckCircle2,
    title: 'Transparent Pricing',
    body: 'Know the rates upfront. No hidden fees. Pay only for what you agreed on.',
    iconBg: 'bg-emerald-50', iconColor: 'text-emerald-600', accent: 'border-t-emerald-500',
  },
  {
    icon: Zap,
    title: 'Fast & Reliable',
    body: 'Book a pro in minutes. Our matching system connects you with the nearest available expert.',
    iconBg: 'bg-amber-50', iconColor: 'text-amber-600', accent: 'border-t-amber-500',
  },
];

export default async function Home() {
  const categories = (await fetchCategories()).slice(0, 6);
  return (
    <div className="min-h-screen">

      {/* ── Promo Marquee ─────────────────────────────────────────────────── */}
      <PromoMarquee />

      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-indigo-50/40 to-white">
        <HeroContent />
      </section>

      {/* ── Search & Results — RIGHT after hero for instant payoff ────────── */}
      <section id="search" className="scroll-mt-20">
        <HelperSearch />
      </section>

      {/* ── Service Categories ────────────────────────────────────────────── */}
      <section className="bg-white py-10 md:py-20 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <ScrollReveal className="text-center mb-8 md:mb-12">
            <div className="inline-flex items-center gap-2 bg-indigo-50 text-indigo-600 px-4 py-1.5 rounded-full text-sm font-semibold mb-3 border border-indigo-100">
              Popular Services
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">Browse by Category</h2>
            <p className="text-gray-500">Not sure what you need? Start with a category</p>
          </ScrollReveal>

          <CategoryGrid categories={categories} />

          <ScrollReveal className="text-center mt-8">
            <Link href="/services" className="inline-flex items-center gap-1.5 text-sm font-semibold text-indigo-600 hover:text-indigo-700 transition-colors">
              View all services <ChevronRight size={16} />
            </Link>
          </ScrollReveal>
        </div>
      </section>

      {/* ── How It Works (summary) ───────────────────────────────────────── */}
      <section className="bg-gray-50 py-10 md:py-16 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <ScrollReveal className="text-center mb-7 md:mb-10">
            <div className="inline-flex items-center gap-2 bg-indigo-50 text-indigo-600 px-4 py-1.5 rounded-full text-sm font-semibold mb-3 border border-indigo-100">
              Simple Process
            </div>
            <h2 className="text-xl md:text-3xl font-bold text-gray-900 mb-2">How HunarWalaa Works</h2>
            <p className="text-sm md:text-base text-gray-500 max-w-lg mx-auto">Book a verified professional in three simple steps.</p>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-6 mb-6 md:mb-8">
            {CLIENT_STEPS.map(({ step, title, body }, i) => (
              <ScrollReveal key={step} delay={i * 100}>
                <div className="relative bg-white rounded-2xl p-4 md:p-6 border border-gray-100 shadow-[0_2px_16px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_32px_rgba(0,0,0,0.08)] transition-all duration-300 flex md:block items-start gap-4">
                  <div className="flex items-center gap-3 mb-0 md:mb-3 flex-shrink-0 md:flex-shrink">
                    <div className="w-9 h-9 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-extrabold text-sm flex-shrink-0">
                      {step}
                    </div>
                    <h3 className="font-bold text-gray-900 text-sm md:hidden">{title}</h3>
                  </div>
                  <div>
                    <h3 className="hidden md:block font-bold text-gray-900 text-sm mb-2">{title}</h3>
                    <p className="text-gray-500 text-sm leading-relaxed">{body}</p>
                  </div>
                  {i < CLIENT_STEPS.length - 1 && (
                    <ChevronRight size={16} className="hidden md:block absolute -right-3 top-1/2 -translate-y-1/2 text-indigo-300 z-10" />
                  )}
                </div>
              </ScrollReveal>
            ))}
          </div>

          <ScrollReveal className="text-center">
            <Link
              href="/how-it-works"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-indigo-600 hover:text-indigo-700 transition-colors"
            >
              See the full guide <ChevronRight size={16} />
            </Link>
          </ScrollReveal>

        </div>
      </section>

      {/* ── Earn Section ─────────────────────────────────────────────────── */}
      <EarnSection />

      {/* ── Why Choose HunarWalaa ────────────────────────────────────────── */}
      <section className="bg-white py-12 md:py-24 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <ScrollReveal className="text-center mb-8 md:mb-16">
            <div className="inline-flex items-center gap-2 bg-indigo-50 text-indigo-600 px-4 py-1.5 rounded-full text-sm font-semibold mb-3 border border-indigo-100">
              Why HunarWalaa?
            </div>
            <h2 className="text-xl md:text-4xl font-bold text-gray-900 mb-3">A Marketplace You Can Trust</h2>
            <p className="text-gray-500 max-w-2xl mx-auto text-sm md:text-lg leading-relaxed">
              Every transaction on HunarWalaa is protected — from profile verification to secure payment release.
            </p>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8">
            {TRUST_CARDS.map(({ icon: Icon, title, body, iconBg, iconColor, accent }, i) => (
              <ScrollReveal key={title} delay={i * 120}>
                <div className={`bg-white rounded-2xl p-5 md:p-8 shadow-[0_2px_20px_rgba(0,0,0,0.06)] border border-gray-100 border-t-4 ${accent} hover:shadow-[0_12px_40px_rgba(0,0,0,0.1)] transition-all duration-300 group h-full flex md:block items-start gap-4`}>
                  <div className={`w-12 h-12 md:w-14 md:h-14 ${iconBg} ${iconColor} rounded-2xl flex items-center justify-center flex-shrink-0 md:mb-6`}>
                    <Icon size={24} />
                  </div>
                  <div>
                    <h3 className="text-base md:text-xl font-bold mb-1 md:mb-3 text-gray-900">{title}</h3>
                    <p className="text-gray-500 text-sm leading-relaxed">{body}</p>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>

        </div>
      </section>

    </div>
  );
}
