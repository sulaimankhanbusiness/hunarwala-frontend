'use client';

import { useEffect, useRef, useState } from 'react';
import { ArrowRight, CheckCircle2, Star, Briefcase } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import ScrollReveal from '@/components/ScrollReveal';

const PERKS = [
  { icon: CheckCircle2, text: 'Verified clients and secure payments'     },
  { icon: Star,         text: 'Build your rating and grow your business' },
  { icon: Briefcase,    text: 'Flexible hours — you are the boss'        },
];

export default function EarnSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setInView(true); obs.disconnect(); } },
      { threshold: 0.2 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <section className="bg-gray-50 py-12 md:py-24 border-t border-gray-100 overflow-hidden relative">
      {/* Subtle background accent */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-50 rounded-full blur-3xl -mr-48 -mt-48 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-violet-50 rounded-full blur-3xl -ml-48 -mb-48 pointer-events-none" />

      <div ref={sectionRef} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-20 items-center">

          {/* ── Left: Text ──────────────────────────────────────────────── */}
          <ScrollReveal delay={0}>
            <div className="inline-flex items-center gap-2 bg-indigo-50 border border-indigo-100 text-indigo-600 px-4 py-1.5 rounded-full text-sm font-semibold mb-6">
              For Skilled Professionals
            </div>

            <h2 className="text-3xl md:text-5xl font-extrabold mb-4 md:mb-6 leading-tight text-gray-900">
              Turn Your Skills into{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">
                Steady Earnings
              </span>
            </h2>
            <p className="text-base md:text-lg text-gray-500 mb-7 md:mb-10 leading-relaxed max-w-lg">
              Join thousands of service providers in Pakistan. Set your own rates, work on your schedule, and grow your professional reputation on HunarWalaa.
            </p>

            <ul className="space-y-4 mb-10">
              {PERKS.map(({ icon: Icon, text }, i) => {
                const styles = [
                  { bg: 'bg-indigo-50', color: 'text-indigo-600' },
                  { bg: 'bg-amber-50',  color: 'text-amber-600'  },
                  { bg: 'bg-emerald-50',color: 'text-emerald-600'},
                ][i];
                return (
                  <li key={i} className="flex items-center gap-4 text-gray-700 font-medium">
                    <div className={`flex-shrink-0 w-10 h-10 ${styles.bg} rounded-xl flex items-center justify-center border border-gray-100`}>
                      <Icon size={18} className={styles.color} />
                    </div>
                    {text}
                  </li>
                );
              })}
            </ul>

            <Link
              href="/register?type=helper"
              className="inline-flex items-center gap-3 px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold transition-all shadow-lg shadow-indigo-600/25 hover:-translate-y-0.5 hover:shadow-indigo-600/40"
            >
              Register and Start Earning
              <ArrowRight size={20} />
            </Link>
          </ScrollReveal>

          {/* ── Right: Pro image with floating cards ────────────────────── */}
          <ScrollReveal delay={150}>
            <div className="relative max-w-xs md:max-w-sm mx-auto">
              {/* Main image */}
              <div className="relative rounded-3xl overflow-hidden shadow-[0_20px_60px_-10px_rgba(99,102,241,0.2)] ring-1 ring-indigo-100 aspect-[3/4]">
                <Image
                  src="/pro-helper.png"
                  fill
                  className="object-cover"
                  alt="HunarWalaa professional helper"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-indigo-900/30 via-transparent to-transparent" />
              </div>

              {/* Floating: new booking card */}
              <div className={`absolute -bottom-3 left-2 md:-bottom-4 md:-left-6 bg-white border border-gray-100 rounded-2xl px-3 py-3 md:px-5 md:py-4 shadow-[0_8px_32px_rgba(0,0,0,0.10)] transition-all duration-700 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                <div className="flex items-center gap-2 md:gap-3">
                  <div className="w-8 h-8 md:w-10 md:h-10 bg-emerald-50 rounded-xl flex items-center justify-center flex-shrink-0">
                    <CheckCircle2 size={16} className="text-emerald-500" />
                  </div>
                  <div>
                    <p className="text-gray-900 font-bold text-xs md:text-sm leading-none">New Booking!</p>
                    <p className="text-gray-400 text-[10px] md:text-xs mt-1">Plumbing • Rs. 800/hr</p>
                  </div>
                  <span className="ml-2 text-emerald-500 text-[10px] md:text-xs font-bold whitespace-nowrap">Just now</span>
                </div>
              </div>

              {/* Floating: rating card */}
              <div className={`absolute -top-3 right-2 md:-top-4 md:-right-4 bg-white border border-gray-100 rounded-2xl px-3 py-2 md:px-4 md:py-3 shadow-[0_8px_32px_rgba(0,0,0,0.10)] transition-all duration-700 delay-200 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                <div className="flex items-center gap-1.5">
                  <Star size={13} className="text-amber-400" fill="currentColor" />
                  <span className="text-gray-900 font-extrabold text-xs md:text-sm">4.9</span>
                  <span className="text-gray-400 text-[10px] md:text-xs">/ 5.0</span>
                </div>
                <p className="text-gray-400 text-[10px] mt-0.5">Average Rating</p>
              </div>
            </div>
          </ScrollReveal>

        </div>
      </div>
    </section>
  );
}
