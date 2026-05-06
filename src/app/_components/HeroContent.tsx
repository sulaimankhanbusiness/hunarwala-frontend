'use client';

import { useState, useEffect } from 'react';
import { Search, Shield, MessageSquare, Lock, Users, Star } from 'lucide-react';
import Image from 'next/image';
import { SITE_STATS } from '@/lib/constants';

const WORKER_IMAGES = [
  '/hero-workers.png',
  '/pro-helper.png',
];

const FEATURES = [
  { icon: Shield,        title: 'Verified Professionals', desc: 'Trusted & background checked' },
  { icon: MessageSquare, title: 'Chat Before Hiring',     desc: 'Discuss requirements easily'  },
  { icon: Lock,          title: 'Secure & Safe',          desc: 'Secure payments, always'      },
];

export default function HeroContent() {
  const [current, setCurrent] = useState(0);
  const [prev,    setPrev]    = useState<number | null>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent(c => {
        const next = (c + 1) % WORKER_IMAGES.length;
        setPrev(c);
        setTimeout(() => setPrev(null), 560);
        return next;
      });
    }, 2500);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
      {/* ── Two-column layout ─────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-8 items-end pt-6 lg:pt-10">

        {/* Left: text */}
        <div className="py-6 lg:py-14">

          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-indigo-50 border border-indigo-100 text-indigo-700 px-3 py-1.5 rounded-full text-xs font-bold mb-4 tracking-wide">
            <Shield size={13} className="text-indigo-500 flex-shrink-0" />
            Verified Professionals · Pakistan
          </div>

          {/* Headline */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[3.1rem] font-extrabold text-gray-900 mb-4 leading-[1.1] tracking-tight">
            Find Trusted Help
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">
              Right at Your Door
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-sm md:text-lg text-gray-500 mb-5 max-w-lg leading-relaxed">
            Connect with verified plumbers, electricians, cleaners, and more — anywhere in Pakistan. Book in minutes, pay securely.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <a
              href="#search"
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold transition-all shadow-lg shadow-indigo-600/30 hover:shadow-xl hover:-translate-y-0.5 text-sm w-full sm:w-auto"
            >
              <Search size={16} />
              Find a Professional
            </a>
            <a
              href="/register?type=helper"
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-white hover:bg-indigo-50 text-indigo-600 rounded-xl font-bold border border-indigo-200 hover:border-indigo-400 transition-all text-sm w-full sm:w-auto"
            >
              <Users size={16} />
              Offer Your Skills
            </a>
          </div>

          {/* Feature bullets */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {FEATURES.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="flex items-center gap-2.5">
                <div className="w-8 h-8 bg-indigo-50 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Icon size={14} className="text-indigo-600" />
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-800 leading-none mb-0.5">{title}</p>
                  <p className="text-[11px] text-gray-400">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: worker image + floating cards */}
        <div className="relative hidden lg:flex items-end justify-center">
          {/* Blob */}
          <div className="absolute w-[400px] h-[400px] bg-gradient-to-br from-indigo-100 to-violet-100 rounded-full -z-10 bottom-0 left-1/2 -translate-x-1/2" />

          {/* Worker image — sliding slideshow */}
          <div className="relative h-[480px] w-[360px] overflow-hidden">
            {prev !== null && (
              <div key={`prev-${prev}`} className="absolute inset-0 worker-slide-out">
                <Image src={WORKER_IMAGES[prev]} fill className="object-contain object-bottom" alt="" />
              </div>
            )}
            <div key={`curr-${current}`} className={`absolute inset-0 ${prev !== null ? 'worker-slide-in' : ''}`}>
              <Image src={WORKER_IMAGES[current]} fill className="object-contain object-bottom" alt="HunarWalaa Professional" priority={current === 0} />
            </div>
          </div>

          {/* Floating: Verified Pros card */}
          <div className="absolute top-12 right-2 bg-white rounded-2xl px-4 py-3 shadow-[0_8px_32px_rgba(0,0,0,0.10)] border border-gray-100 flex items-center gap-3 animate-in fade-in slide-in-from-top-4 duration-700">
            <div className="flex -space-x-2">
              {['A','K','S'].map((l, i) => (
                <div
                  key={i}
                  className="w-7 h-7 rounded-full border-2 border-white flex items-center justify-center text-white text-[9px] font-extrabold"
                  style={{ background: ['#6366f1','#8b5cf6','#a78bfa'][i] }}
                >
                  {l}
                </div>
              ))}
            </div>
            <div>
              <p className="text-sm font-extrabold text-gray-900 leading-none">1,200+</p>
              <p className="text-[10px] text-gray-400 font-medium">Verified Pros</p>
            </div>
          </div>

          {/* Floating: Rating card */}
          <div className="absolute bottom-20 right-0 bg-white rounded-2xl px-4 py-3 shadow-[0_8px_32px_rgba(0,0,0,0.10)] border border-gray-100 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
            <div className="flex items-center gap-1.5 mb-0.5">
              <Star size={14} className="text-amber-400" fill="currentColor" />
              <span className="text-sm font-extrabold text-gray-900">4.8</span>
            </div>
            <p className="text-[10px] text-gray-400 font-medium">Average Rating</p>
          </div>
        </div>
      </div>

      {/* ── Stats bar ─────────────────────────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_4px_24px_rgba(0,0,0,0.06)] px-4 py-4 md:px-6 md:py-5 grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-0">
        {SITE_STATS.map(({ icon: Icon, value, label }) => (
          <div key={value} className="flex items-center gap-2 md:gap-3">
            <div className="w-8 h-8 md:w-10 md:h-10 rounded-xl bg-indigo-50 flex items-center justify-center flex-shrink-0">
              <Icon size={16} className="text-indigo-600" />
            </div>
            <div>
              <p className="text-base md:text-lg font-extrabold text-gray-900 leading-none">{value}</p>
              <p className="text-[10px] md:text-xs text-gray-400 font-medium">{label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ── Trusted by ────────────────────────────────────────────────── */}
      <div className="text-center py-3 text-xs md:text-sm text-gray-400">
        <Shield size={12} className="inline mr-1.5 text-indigo-400" />
        Trusted by thousands of customers{' '}
        <a href="#search" className="text-indigo-600 font-semibold hover:underline">across Pakistan</a>
      </div>
    </div>
  );
}
