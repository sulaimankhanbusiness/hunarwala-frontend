'use client';

import { useEffect, useRef, useState } from 'react';
import { ArrowRight, CheckCircle2, Zap } from 'lucide-react';
import Link from 'next/link';
import ScrollReveal from '@/components/ScrollReveal';

function useCountUp(target: number, duration = 1400, triggered = false) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!triggered) return;
    let start: number | null = null;
    const step = (ts: number) => {
      if (!start) start = ts;
      const progress = Math.min((ts - start) / duration, 1);
      // ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(eased * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [triggered, target, duration]);

  return value;
}

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

  const jobs   = useCountUp(42,   1200, inView);
  const rating = useCountUp(49,   1400, inView); // displayed as 4.9

  return (
    <section className="bg-gradient-to-r from-blue-900 to-indigo-900 py-20 text-white overflow-hidden relative">
      {/* Animated background blobs */}
      <div className="absolute top-0 right-0 w-72 h-72 bg-blue-400/15 rounded-full blur-3xl -mr-36 -mt-36 anim-blob" />
      <div className="absolute bottom-0 left-0 w-72 h-72 bg-indigo-400/15 rounded-full blur-3xl -ml-36 -mb-36 anim-blob-delayed" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl anim-float-slow" />

      <div ref={sectionRef} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <ScrollReveal delay={0}>
            <h2 className="text-4xl font-extrabold mb-6 leading-tight">
              Turn Your Skills into <br />
              <span className="text-amber-400">Steady Earnings</span>
            </h2>
            <p className="text-xl text-blue-100/80 mb-8 leading-relaxed">
              Join thousands of service providers in Pakistan. Set your own rates, work on your schedule, and grow your professional reputation.
            </p>

            <ul className="space-y-4 mb-10">
              {[
                'Verified clients and secure payments',
                'Flexible work hours — you are the boss',
                'Build your profile and get more jobs',
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-blue-50 font-medium">
                  <div className="flex-shrink-0 w-6 h-6 bg-blue-500/20 rounded-full flex items-center justify-center border border-blue-400/30">
                    <CheckCircle2 size={14} className="text-blue-400" />
                  </div>
                  {item}
                </li>
              ))}
            </ul>

            <Link
              href="/register?type=helper"
              className="inline-flex items-center gap-3 px-8 py-4 bg-amber-500 hover:bg-amber-600 text-white rounded-2xl font-bold transition-all shadow-2xl shadow-amber-500/20 hover:-translate-y-1"
            >
              Register as a Helper Now
              <ArrowRight size={20} />
            </Link>
          </ScrollReveal>

          <ScrollReveal delay={150}>
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-3xl relative">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center text-blue-400 border border-blue-400/20 anim-float">
                  <Zap size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-lg">Instant Matching</h4>
                  <p className="text-sm text-blue-100/60">Connect with local customers</p>
                </div>
              </div>

              <div className="space-y-6">
                {/* Animated progress bar */}
                <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                  <div
                    className={`h-full bg-gradient-to-r from-blue-500 to-indigo-400 rounded-full ${inView ? 'progress-bar-fill' : 'w-0'}`}
                  />
                </div>
                <div className="flex justify-between text-sm font-medium">
                  <span className="text-blue-200">Weekly Target Reach</span>
                  <span className="text-white font-bold">{inView ? '85%' : '0%'}</span>
                </div>

                {/* Count-up stats */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/5 border border-white/10 p-4 rounded-2xl">
                    <p className="text-xs text-blue-200/60 mb-1">Total Jobs</p>
                    <p className="text-xl font-bold tabular-nums">{jobs}</p>
                  </div>
                  <div className="bg-white/5 border border-white/10 p-4 rounded-2xl">
                    <p className="text-xs text-blue-200/60 mb-1">Avg Score</p>
                    <p className="text-xl font-bold tabular-nums">
                      {(rating / 10).toFixed(1)}/5
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
