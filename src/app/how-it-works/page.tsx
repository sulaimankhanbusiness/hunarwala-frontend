'use client';

import React, { useState } from 'react';
import { Search, CheckCircle2, ArrowRight, ChevronRight, Shield } from 'lucide-react';
import Link from 'next/link';
import { SITE_STATS } from '@/lib/constants';

type Tab = 'client' | 'helper';

// ─── Shared phone frame ───────────────────────────────────────────────────────
function PhoneFrame({ children, shadowColor = 'shadow-gray-200' }: { children: React.ReactNode; shadowColor?: string }) {
  return (
    <div className={`relative w-52 md:w-56 rounded-[2.2rem] bg-gray-900 border-[5px] border-gray-800 shadow-2xl ${shadowColor} overflow-hidden`}>
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-16 h-4 bg-gray-900 rounded-b-xl z-10" />
      <div className="bg-white pt-4 overflow-hidden">{children}</div>
    </div>
  );
}

// ─── Step connector ───────────────────────────────────────────────────────────
function Connector({ from, to }: { from: string; to: string }) {
  return (
    <div className="hidden md:flex justify-center -my-6">
      <div className="flex flex-col items-center gap-1">
        <div className={`w-px h-6 bg-gradient-to-b ${from}`} />
        <ChevronRight size={14} className={`${to} rotate-90`} />
        <div className={`w-px h-6 bg-gradient-to-b ${from}`} />
      </div>
    </div>
  );
}

// ─── Sub-step list ────────────────────────────────────────────────────────────
function SubSteps({ items, color }: { items: string[]; color: string }) {
  return (
    <ul className="space-y-3">
      {items.map((s) => (
        <li key={s} className="flex items-start gap-3 text-sm text-gray-600 font-medium">
          <CheckCircle2 size={17} className={`${color} flex-shrink-0 mt-0.5`} />
          {s}
        </li>
      ))}
    </ul>
  );
}

// ─── Phone illustrations ──────────────────────────────────────────────────────

function SearchPhone() {
  return (
    <PhoneFrame shadowColor="shadow-indigo-100">
      <div className="bg-indigo-600 px-3 py-2.5 flex items-center gap-2">
        <div className="h-2 w-14 bg-indigo-300 rounded" />
        <div className="ml-auto w-5 h-5 bg-indigo-500 rounded-full" />
      </div>
      <div className="mx-2.5 mt-2.5 bg-white rounded-xl shadow-sm border border-gray-100 flex items-center gap-2 px-2.5 py-2">
        <div className="w-3 h-3 bg-gray-300 rounded-full flex-shrink-0" />
        <div className="h-2 bg-gray-200 rounded flex-1" />
      </div>
      <div className="mx-2.5 mt-1.5 flex gap-1">
        <div className="bg-indigo-50 border border-indigo-100 rounded-full px-2 py-0.5 flex items-center gap-1">
          <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full" />
          <div className="h-1.5 w-10 bg-indigo-300 rounded" />
        </div>
        <div className="bg-gray-100 rounded-full px-2 py-0.5">
          <div className="h-1.5 w-8 bg-gray-300 rounded" />
        </div>
      </div>
      <div className="mx-2.5 mt-2.5 h-1.5 w-16 bg-gray-400 rounded" />
      <div className="mx-2.5 mt-1.5 grid grid-cols-3 gap-1.5">
        {[['bg-indigo-100','bg-indigo-500'],['bg-yellow-100','bg-yellow-500'],['bg-emerald-100','bg-emerald-500'],
          ['bg-amber-100','bg-amber-500'],['bg-sky-100','bg-sky-500'],['bg-rose-100','bg-rose-500']].map(([bg, dot], i) => (
          <div key={i} className={`${bg} rounded-xl p-2 flex flex-col items-center gap-1`}>
            <div className={`w-5 h-5 ${dot} rounded-lg opacity-70`} />
            <div className="h-1.5 w-8 bg-white/80 rounded" />
          </div>
        ))}
      </div>
      <div className="mx-2.5 mt-2.5 mb-1 h-1.5 w-24 bg-gray-400 rounded" />
      <div className="mx-2.5 mb-3 space-y-1.5">
        {[true, false].map((active, i) => (
          <div key={i} className={`bg-white rounded-xl p-2 border ${active ? 'border-indigo-300 shadow-sm' : 'border-gray-100'} flex items-center gap-2`}>
            <div className={`w-8 h-8 rounded-full flex-shrink-0 ${active ? 'bg-indigo-200' : 'bg-gray-200'}`} />
            <div className="flex-1 min-w-0">
              <div className={`h-1.5 ${active ? 'bg-gray-500' : 'bg-gray-200'} rounded w-14 mb-1`} />
              <div className="flex gap-0.5">
                {[...Array(5)].map((_, j) => (
                  <div key={j} className={`w-1.5 h-1.5 rounded-sm ${j < (active ? 5 : 4) ? 'bg-yellow-400' : 'bg-gray-200'}`} />
                ))}
              </div>
            </div>
            <div className="h-5 w-10 bg-indigo-100 rounded-lg" />
          </div>
        ))}
      </div>
    </PhoneFrame>
  );
}

function BookPhone() {
  return (
    <PhoneFrame shadowColor="shadow-emerald-100">
      <div className="px-3 flex items-center gap-2 mb-2">
        <div className="w-4 h-4 bg-gray-200 rounded-md" />
        <div className="h-2 w-16 bg-gray-300 rounded" />
      </div>
      <div className="flex flex-col items-center py-3 bg-gray-50 border-b border-gray-100">
        <div className="w-14 h-14 rounded-full bg-emerald-200 mb-1.5" />
        <div className="h-2 w-20 bg-gray-500 rounded mb-1.5" />
        <div className="flex gap-0.5 mb-1.5">
          {[...Array(5)].map((_, i) => <div key={i} className="w-2 h-2 bg-yellow-400 rounded-sm" />)}
        </div>
        <div className="flex gap-2">
          <div className="h-1.5 w-14 bg-gray-200 rounded" />
          <div className="h-1.5 w-12 bg-gray-200 rounded" />
        </div>
      </div>
      <div className="px-3 mt-2.5">
        <div className="h-1.5 w-14 bg-gray-400 rounded mb-2" />
        <div className="flex gap-1">
          {[false, false, true, false, false].map((sel, i) => (
            <div key={i} className={`flex-1 rounded-lg py-1.5 flex flex-col items-center gap-0.5 ${sel ? 'bg-emerald-500' : 'bg-gray-100'}`}>
              <div className={`h-1 w-2 rounded ${sel ? 'bg-emerald-300' : 'bg-gray-300'}`} />
              <div className={`h-1.5 w-3 rounded ${sel ? 'bg-white' : 'bg-gray-400'}`} />
            </div>
          ))}
        </div>
      </div>
      <div className="px-3 mt-2.5">
        <div className="h-1.5 w-16 bg-gray-400 rounded mb-2" />
        <div className="flex gap-1">
          {[false, false, true, false].map((sel, i) => (
            <div key={i} className={`flex-1 py-2 rounded-lg ${sel ? 'bg-emerald-500' : 'bg-gray-100'}`}>
              <div className={`h-1.5 mx-1 rounded ${sel ? 'bg-white/60' : 'bg-gray-300'}`} />
            </div>
          ))}
        </div>
      </div>
      <div className="px-3 mt-2.5 flex items-center justify-between">
        <div className="h-1.5 w-12 bg-gray-200 rounded" />
        <div className="h-2 w-14 bg-emerald-100 rounded" />
      </div>
      <div className="px-3 mt-2 mb-3">
        <div className="bg-emerald-500 rounded-xl py-2.5 flex items-center justify-center">
          <div className="h-2 w-16 bg-white/70 rounded" />
        </div>
      </div>
    </PhoneFrame>
  );
}

function TrackingPhone() {
  return (
    <PhoneFrame shadowColor="shadow-sky-100">
      <div className="px-3 flex items-center gap-2 mb-3">
        <div className="w-4 h-4 bg-gray-200 rounded-md" />
        <div className="h-2 w-20 bg-gray-300 rounded" />
        <div className="ml-auto w-6 h-6 bg-sky-100 rounded-full flex items-center justify-center">
          <div className="w-3 h-3 bg-sky-400 rounded-full" />
        </div>
      </div>
      <div className="mx-2.5 h-32 bg-gradient-to-br from-sky-50 to-indigo-100 rounded-xl relative overflow-hidden border border-sky-100">
        <div className="absolute inset-0 opacity-20">
          {[...Array(5)].map((_, i) => <div key={i} className="absolute w-full h-px bg-gray-400" style={{top:`${i*25}%`}} />)}
          {[...Array(5)].map((_, i) => <div key={i} className="absolute h-full w-px bg-gray-400" style={{left:`${i*25}%`}} />)}
        </div>
        <div className="absolute top-1/2 left-0 right-0 h-1.5 bg-white/60 rounded" />
        <div className="absolute left-1/3 top-0 bottom-0 w-1.5 bg-white/60 rounded" />
        <div className="absolute top-[35%] left-[28%] w-6 h-6 bg-sky-500 rounded-full border-2 border-white shadow-md flex items-center justify-center">
          <div className="w-2 h-2 bg-white rounded-full" />
        </div>
        <div className="absolute top-[52%] left-[58%] flex flex-col items-center">
          <div className="w-5 h-5 bg-indigo-600 rounded-full border-2 border-white shadow-md" />
          <div className="w-1 h-2 bg-indigo-600" />
        </div>
      </div>
      <div className="mx-2.5 mt-2 bg-sky-50 rounded-xl border border-sky-100 p-2.5">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-2 h-2 bg-sky-500 rounded-full animate-pulse" />
          <div className="h-2 w-20 bg-sky-400 rounded" />
        </div>
        <div className="flex justify-between">
          {['Confirmed','On way','Arrived'].map((_, i) => (
            <div key={i} className="flex flex-col items-center gap-1">
              <div className={`w-4 h-4 rounded-full border-2 border-white shadow-sm ${i < 2 ? 'bg-sky-500' : 'bg-gray-200'}`} />
              <div className={`h-1 w-8 rounded ${i < 2 ? 'bg-sky-300' : 'bg-gray-200'}`} />
            </div>
          ))}
        </div>
      </div>
      <div className="mx-2.5 mt-2 mb-3">
        <div className="bg-white border border-gray-200 rounded-xl py-2 flex items-center justify-center gap-2">
          <div className="w-3 h-3 bg-gray-300 rounded-full" />
          <div className="h-1.5 w-14 bg-gray-200 rounded" />
        </div>
      </div>
    </PhoneFrame>
  );
}

function ApprovePhone() {
  return (
    <PhoneFrame shadowColor="shadow-violet-100">
      <div className="px-3 flex items-center gap-2 mb-3">
        <div className="h-2 w-20 bg-gray-300 rounded" />
      </div>
      <div className="mx-2.5 bg-gray-50 rounded-xl border border-gray-100 p-3 mb-2">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-8 h-8 rounded-full bg-violet-200" />
          <div>
            <div className="h-2 w-16 bg-gray-400 rounded mb-1" />
            <div className="h-1.5 w-12 bg-gray-200 rounded" />
          </div>
        </div>
        <div className="space-y-1">
          <div className="flex justify-between">
            <div className="h-1.5 w-16 bg-gray-300 rounded" />
            <div className="h-1.5 w-10 bg-gray-300 rounded" />
          </div>
          <div className="flex justify-between">
            <div className="h-1.5 w-20 bg-gray-200 rounded" />
            <div className="h-1.5 w-8 bg-gray-200 rounded" />
          </div>
        </div>
        <div className="mt-2 pt-2 border-t border-gray-200 flex justify-between items-center">
          <div className="h-2 w-10 bg-gray-400 rounded" />
          <div className="h-2.5 w-14 bg-violet-600 rounded" />
        </div>
      </div>
      <div className="mx-2.5 mb-2">
        <div className="bg-violet-600 rounded-xl py-2.5 flex items-center justify-center gap-2">
          <div className="w-3 h-3 bg-white/40 rounded" />
          <div className="h-2 w-16 bg-white/70 rounded" />
        </div>
      </div>
      <div className="mx-2.5 py-1.5 mb-2 flex items-center justify-center">
        <div className="h-1.5 w-24 bg-gray-200 rounded" />
      </div>
    </PhoneFrame>
  );
}

function RatingPhone() {
  return (
    <PhoneFrame shadowColor="shadow-amber-100">
      <div className="flex flex-col items-center pt-3 pb-4">
        <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mb-3">
          <div className="w-11 h-11 rounded-full bg-emerald-500 flex items-center justify-center">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <polyline points="20 6 9 17 4 12" stroke="white" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>
        <div className="h-2.5 w-28 bg-gray-800 rounded mb-1.5" />
        <div className="h-1.5 w-20 bg-gray-300 rounded" />
      </div>
      <div className="h-px bg-gray-100 mx-3" />
      <div className="px-4 mt-3">
        <div className="h-1.5 w-24 bg-gray-400 rounded mb-2.5 mx-auto" />
        <div className="flex justify-center gap-1.5 mb-3">
          {[...Array(5)].map((_, i) => <div key={i} className="w-6 h-6 bg-yellow-400 rounded-lg" />)}
        </div>
        <div className="bg-gray-50 rounded-xl border border-gray-200 p-2 mb-2.5">
          <div className="h-1.5 w-full bg-gray-200 rounded mb-1.5" />
          <div className="h-1.5 w-3/4 bg-gray-200 rounded mb-1.5" />
          <div className="h-1.5 w-1/2 bg-gray-200 rounded" />
        </div>
        <div className="bg-amber-500 rounded-xl py-2 flex items-center justify-center mb-3">
          <div className="h-2 w-20 bg-white/70 rounded" />
        </div>
      </div>
    </PhoneFrame>
  );
}

function RegisterPhone() {
  return (
    <PhoneFrame shadowColor="shadow-indigo-100">
      <div className="flex flex-col items-center pt-2 pb-3 border-b border-gray-100">
        <div className="w-16 h-16 rounded-full bg-indigo-200 mb-2 border-4 border-indigo-100 relative">
          <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-indigo-600 rounded-full border-2 border-white flex items-center justify-center">
            <div className="w-2 h-2 bg-white rounded-sm" />
          </div>
        </div>
        <div className="h-2 w-24 bg-gray-400 rounded mb-1" />
        <div className="h-1.5 w-16 bg-indigo-200 rounded" />
      </div>
      <div className="px-3 mt-3 space-y-2">
        {['Skill','Experience','Rate/day','City'].map((_, i) => (
          <div key={i} className="flex items-center gap-2">
            <div className="h-1.5 w-10 bg-gray-300 rounded flex-shrink-0" />
            <div className={`flex-1 h-6 rounded-lg border ${i === 1 ? 'border-indigo-400 bg-indigo-50' : 'border-gray-200 bg-gray-50'}`} />
          </div>
        ))}
        <div className="pt-1 pb-2">
          <div className="bg-indigo-600 rounded-xl py-2.5 flex items-center justify-center">
            <div className="h-2 w-20 bg-white/70 rounded" />
          </div>
        </div>
      </div>
    </PhoneFrame>
  );
}

function SchedulePhone() {
  return (
    <PhoneFrame shadowColor="shadow-indigo-100">
      <div className="px-3 mb-3">
        <div className="h-2 w-24 bg-gray-400 rounded mb-3" />
        <div className="flex items-center justify-between mb-2">
          <div className="h-2 w-16 bg-gray-300 rounded" />
          <div className="flex gap-2">
            <div className="w-4 h-4 bg-gray-100 rounded" />
            <div className="w-4 h-4 bg-gray-100 rounded" />
          </div>
        </div>
        <div className="grid grid-cols-7 gap-0.5 mb-1">
          {[...Array(7)].map((_, i) => <div key={i} className="h-1.5 bg-gray-200 rounded" />)}
        </div>
        <div className="grid grid-cols-7 gap-0.5">
          {[...Array(28)].map((_, i) => {
            const isOn = [1,3,4,7,8,10,14,15].includes(i);
            const isToday = i === 4;
            return (
              <div key={i} className={`h-5 rounded flex items-center justify-center ${isToday ? 'bg-indigo-600' : isOn ? 'bg-indigo-100' : 'bg-gray-50'}`}>
                <div className={`w-1.5 h-1.5 rounded-full ${isToday ? 'bg-white' : isOn ? 'bg-indigo-400' : 'bg-gray-200'}`} />
              </div>
            );
          })}
        </div>
      </div>
      <div className="px-3 border-t border-gray-100 pt-2 pb-3">
        <div className="h-1.5 w-20 bg-gray-300 rounded mb-2" />
        {[true, false].map((on, i) => (
          <div key={i} className="flex items-center justify-between mb-1.5">
            <div className="h-1.5 w-14 bg-gray-300 rounded" />
            <div className={`w-8 h-4 rounded-full ${on ? 'bg-indigo-500' : 'bg-gray-200'}`} />
          </div>
        ))}
      </div>
    </PhoneFrame>
  );
}

function JobRequestPhone() {
  return (
    <PhoneFrame shadowColor="shadow-emerald-100">
      <div className="px-3 mb-3">
        <div className="h-2 w-20 bg-gray-400 rounded mb-3" />
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-2.5 mb-2 flex items-start gap-2">
          <div className="w-2 h-2 bg-emerald-500 rounded-full flex-shrink-0 mt-0.5 animate-pulse" />
          <div>
            <div className="h-2 w-24 bg-emerald-600 rounded mb-1" />
            <div className="h-1.5 w-16 bg-emerald-300 rounded" />
          </div>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-3 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-full bg-gray-200" />
            <div>
              <div className="h-2 w-16 bg-gray-400 rounded mb-1" />
              <div className="h-1.5 w-10 bg-gray-200 rounded" />
            </div>
            <div className="ml-auto h-4 w-10 bg-emerald-100 rounded-lg" />
          </div>
          <div className="space-y-1.5 mb-3">
            {[28, 20, 24].map((w, i) => (
              <div key={i} className="flex gap-2">
                <div className="w-2 h-2 bg-gray-300 rounded-full mt-0.5 flex-shrink-0" />
                <div className="h-1.5 bg-gray-200 rounded" style={{width:`${w*4}px`}} />
              </div>
            ))}
          </div>
          <div className="flex gap-1.5">
            <div className="flex-1 bg-emerald-500 rounded-lg py-1.5 flex items-center justify-center">
              <div className="h-1.5 w-10 bg-white/70 rounded" />
            </div>
            <div className="flex-1 bg-gray-100 rounded-lg py-1.5 flex items-center justify-center">
              <div className="h-1.5 w-10 bg-gray-300 rounded" />
            </div>
          </div>
        </div>
      </div>
    </PhoneFrame>
  );
}

function EarningsPhone() {
  return (
    <PhoneFrame shadowColor="shadow-amber-100">
      <div className="bg-gradient-to-r from-indigo-600 to-violet-500 px-4 pt-3 pb-6">
        <div className="h-1.5 w-16 bg-white/40 rounded mb-3" />
        <div className="h-7 w-28 bg-white/90 rounded-lg mb-1" />
        <div className="h-1.5 w-20 bg-white/40 rounded" />
      </div>
      <div className="-mt-3 mx-2.5 bg-white rounded-xl border border-gray-100 shadow-sm p-2.5 mb-2">
        <div className="h-1.5 w-16 bg-gray-300 rounded mb-2" />
        <div className="grid grid-cols-3 gap-1.5">
          {[['bg-indigo-50','bg-indigo-400'],['bg-emerald-50','bg-emerald-400'],['bg-amber-50','bg-amber-400']].map(([bg, dot], i) => (
            <div key={i} className={`${bg} rounded-lg p-2 flex flex-col gap-1`}>
              <div className={`w-4 h-4 ${dot} rounded-md opacity-70`} />
              <div className="h-2 w-full bg-white/80 rounded" />
              <div className="h-1.5 w-3/4 bg-white/60 rounded" />
            </div>
          ))}
        </div>
      </div>
      <div className="mx-2.5 pb-3">
        <div className="h-1.5 w-20 bg-gray-300 rounded mb-2" />
        {[true, false, false].map((hi, i) => (
          <div key={i} className="flex items-center gap-2 mb-1.5">
            <div className={`w-6 h-6 rounded-full ${hi ? 'bg-amber-200' : 'bg-gray-200'}`} />
            <div className="flex-1">
              <div className={`h-1.5 ${hi ? 'bg-gray-400' : 'bg-gray-200'} rounded w-20 mb-0.5`} />
              <div className="h-1 w-12 bg-gray-200 rounded" />
            </div>
            <div className={`h-2 w-10 ${hi ? 'bg-emerald-200' : 'bg-gray-200'} rounded`} />
          </div>
        ))}
      </div>
    </PhoneFrame>
  );
}

// ─── Step wrapper ─────────────────────────────────────────────────────────────
function Step({
  stepNum, badgeColor, badgeBg, heading, description, subSteps, checkColor,
  illustration, flip = false,
}: {
  stepNum: string; badgeColor: string; badgeBg: string; heading: React.ReactNode; description: string;
  subSteps: string[]; checkColor: string; illustration: React.ReactNode; flip?: boolean;
}) {
  return (
    <div className="grid md:grid-cols-2 gap-8 lg:gap-20 items-center">
      <div className={flip ? 'order-1 md:order-2' : ''}>
        <div className={`inline-flex items-center gap-2 ${badgeBg} ${badgeColor} border px-3 py-1.5 rounded-full text-xs font-black mb-5`}>
          {stepNum}
        </div>
        <h2 className="text-xl md:text-3xl font-extrabold text-gray-900 mb-3 md:mb-4 leading-tight">{heading}</h2>
        <p className="text-sm md:text-base text-gray-500 leading-relaxed mb-5 md:mb-7">{description}</p>
        <SubSteps items={subSteps} color={checkColor} />
      </div>
      <div className={`flex ${flip ? 'justify-center md:justify-start order-2 md:order-1' : 'justify-center md:justify-end'}`}>
        {illustration}
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function HowItWorksPage() {
  const [tab, setTab] = useState<Tab>('client');

  return (
    <div className="min-h-screen bg-gray-50">

      {/* ── Hero ────────────────────────────────────────────────────────────── */}
      <section className="bg-white border-b border-gray-100 pt-20 pb-10 md:pb-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <span className="inline-block bg-indigo-50 text-indigo-700 text-xs font-black px-4 py-1.5 rounded-full uppercase tracking-widest mb-5 border border-indigo-100">
            Simple Process
          </span>
          <h1 className="text-3xl md:text-5xl font-black text-gray-900 mb-4 tracking-tight">
            How <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">HunarWalaa</span> Works
          </h1>
          <p className="text-base md:text-lg text-gray-500 max-w-2xl mx-auto font-medium leading-relaxed mb-8">
            Connecting Pakistan's finest talent with those who need it most —
            seamless, safe, and professional for every service need.
          </p>

          {/* Tab switcher */}
          <div className="inline-flex bg-gray-100 rounded-2xl p-1.5 gap-1">
            <button
              onClick={() => setTab('client')}
              className={`px-5 md:px-6 py-2.5 rounded-xl font-bold text-sm transition-all ${tab === 'client' ? 'bg-white text-indigo-700 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
            >
              I need a service
            </button>
            <button
              onClick={() => setTab('helper')}
              className={`px-5 md:px-6 py-2.5 rounded-xl font-bold text-sm transition-all ${tab === 'helper' ? 'bg-white text-indigo-700 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
            >
              I want to earn
            </button>
          </div>
        </div>
      </section>

      {/* ── Stats bar ───────────────────────────────────────────────────────── */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4 py-4 grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6">
          {SITE_STATS.map(({ icon: Icon, value, label }) => (
            <div key={value} className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-indigo-50 flex items-center justify-center flex-shrink-0">
                <Icon size={16} className="text-indigo-600" />
              </div>
              <div>
                <p className="text-sm font-extrabold text-gray-900 leading-none">{value}</p>
                <p className="text-[11px] text-gray-400">{label}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── CLIENT FLOW ─────────────────────────────────────────────────────── */}
      {tab === 'client' && (
        <section className="py-10 md:py-20">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 md:space-y-20">

            <Step
              stepNum="STEP 01"
              badgeBg="bg-indigo-50" badgeColor="text-indigo-700" checkColor="text-indigo-500"
              heading={<>Search &amp; discover<br />the right professional</>}
              description="Browse over 20 service categories or type exactly what you need — plumber, electrician, cleaner and more. Filter by city, budget, and rating to find your perfect match."
              subSteps={['Browse 20+ categories or search by skill (e.g. "Plumber")', 'Filter by city, price range & minimum rating', 'Compare profiles, reviews & years of experience']}
              illustration={<SearchPhone />}
            />

            <Connector from="from-indigo-300 to-emerald-300" to="text-emerald-400" />

            <Step
              stepNum="STEP 02"
              badgeBg="bg-emerald-50" badgeColor="text-emerald-700" checkColor="text-emerald-500"
              heading={<>Book in seconds,<br />not hours</>}
              description="Found a pro you like? View their full profile, pick a date and time that works for you, and confirm your booking — they respond within minutes."
              subSteps={['View full profile: bio, skills & verified reviews', 'Pick your preferred date and time slot', 'Instant confirmation — no back-and-forth calls']}
              illustration={<BookPhone />}
              flip
            />

            <Connector from="from-emerald-300 to-sky-300" to="text-sky-400" />

            <Step
              stepNum="STEP 03"
              badgeBg="bg-sky-50" badgeColor="text-sky-700" checkColor="text-sky-500"
              heading={<>Your pro is<br />on the way</>}
              description="Once confirmed, track your professional's status in real-time. Chat with them directly to share access details or instructions before they arrive."
              subSteps={['Notification the moment your pro accepts', 'Live status: Confirmed → On the way → Arrived', 'In-app chat to share instructions or photos']}
              illustration={<TrackingPhone />}
            />

            <Connector from="from-sky-300 to-violet-300" to="text-violet-400" />

            <Step
              stepNum="STEP 04"
              badgeBg="bg-violet-50" badgeColor="text-violet-700" checkColor="text-violet-500"
              heading={<>Confirm the work<br />and settle payment</>}
              description="Once the job is complete, review the work and confirm it's done to your satisfaction. Settle payment directly with your pro — cash, bank transfer, or however you both agree."
              subSteps={['Review the completed work before confirming', 'Settle payment directly with your pro as agreed', 'Raise a dispute through the app if anything goes wrong']}
              illustration={<ApprovePhone />}
              flip
            />

            <Connector from="from-violet-300 to-amber-300" to="text-amber-400" />

            <Step
              stepNum="STEP 05"
              badgeBg="bg-amber-50" badgeColor="text-amber-700" checkColor="text-amber-500"
              heading={<>Rate your pro<br />and relax</>}
              description="Job done! Leave a star rating and written review to help others in the community find the best professionals. Your feedback makes the platform better for everyone."
              subSteps={['Rate with 1–5 stars and leave a review', 'Your review helps other customers choose wisely', 'Good ratings help pros grow their business']}
              illustration={<RatingPhone />}
            />

          </div>

          {/* CTA */}
          <div className="mt-12 md:mt-20 text-center px-4">
            <div className="inline-flex flex-col sm:flex-row items-center gap-4 md:gap-5 bg-white border border-gray-200 rounded-2xl px-6 md:px-8 py-4 md:py-5 shadow-sm">
              <div className="text-left">
                <p className="font-bold text-gray-900 text-sm">Ready to book your first service?</p>
                <p className="text-gray-400 text-xs mt-0.5">Find and book a pro in under 2 minutes.</p>
              </div>
              <Link
                href="/#search"
                className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-sm transition-all shadow-md shadow-indigo-200 hover:-translate-y-0.5 flex items-center gap-1.5 whitespace-nowrap"
              >
                <Search size={14} />
                Book Now
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ── HELPER FLOW ─────────────────────────────────────────────────────── */}
      {tab === 'helper' && (
        <section className="py-10 md:py-20">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 md:space-y-20">

            <Step
              stepNum="STEP 01"
              badgeBg="bg-indigo-50" badgeColor="text-indigo-700" checkColor="text-indigo-500"
              heading={<>Register your skill<br />and build your profile</>}
              description="Sign up as a professional in minutes. Add your skills, experience, and set your hourly rate. A complete profile with a great photo gets you more bookings faster."
              subSteps={['Fill in your skills, experience & hourly rate', 'Upload a profile photo and write a short bio', 'Get verified — build trust with clients from day one']}
              illustration={<RegisterPhone />}
            />

            <Connector from="from-indigo-300 to-violet-300" to="text-violet-400" />

            <Step
              stepNum="STEP 02"
              badgeBg="bg-violet-50" badgeColor="text-violet-700" checkColor="text-violet-500"
              heading={<>Set your own hours<br />and availability</>}
              description="You are in control. Mark which days and hours you are available and only receive bookings when it suits you. Work as much or as little as you want."
              subSteps={['Mark available days directly on your calendar', 'Set working hours — mornings, evenings or full-day', 'Pause availability any time with a single tap']}
              illustration={<SchedulePhone />}
              flip
            />

            <Connector from="from-violet-300 to-emerald-300" to="text-emerald-400" />

            <Step
              stepNum="STEP 03"
              badgeBg="bg-emerald-50" badgeColor="text-emerald-700" checkColor="text-emerald-500"
              heading={<>Receive &amp; accept<br />verified job requests</>}
              description="Clients send you booking requests with full job details — location, service type, and preferred time. Accept the ones that work for you and head out."
              subSteps={['Instant notifications for new booking requests', 'See full job details before accepting anything', 'Chat with the client to clarify requirements']}
              illustration={<JobRequestPhone />}
            />

            <Connector from="from-emerald-300 to-amber-300" to="text-amber-400" />

            <Step
              stepNum="STEP 04"
              badgeBg="bg-amber-50" badgeColor="text-amber-700" checkColor="text-amber-500"
              heading={<>Get paid &amp; grow<br />your reputation</>}
              description="Once the client confirms the job is done, settle payment directly between you — however you both agree. Track your completed jobs, ratings, and reviews all in one dashboard."
              subSteps={['Settle payment directly with the client as agreed', 'Track completed jobs & star ratings from your dashboard', 'Build reputation to attract more and better clients']}
              illustration={<EarningsPhone />}
              flip
            />

          </div>

          {/* CTA */}
          <div className="mt-12 md:mt-20 text-center px-4">
            <div className="inline-flex flex-col sm:flex-row items-center gap-4 md:gap-5 bg-white border border-gray-200 rounded-2xl px-6 md:px-8 py-4 md:py-5 shadow-sm">
              <div className="text-left">
                <p className="font-bold text-gray-900 text-sm">Start earning with your skills today</p>
                <p className="text-gray-400 text-xs mt-0.5">Join 1,200+ verified pros on HunarWalaa</p>
              </div>
              <Link
                href="/register?type=helper"
                className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-sm transition-all shadow-md shadow-indigo-200 hover:-translate-y-0.5 flex items-center gap-1.5 whitespace-nowrap"
              >
                Register as Pro
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ── Trust footer strip ───────────────────────────────────────────────── */}
      <div className="border-t border-gray-100 bg-white py-6 text-center">
        <p className="text-xs md:text-sm text-gray-400">
          <Shield size={12} className="inline mr-1.5 text-indigo-400" />
          Trusted by thousands of customers across Pakistan ·{' '}
          <Link href="/services" className="text-indigo-600 font-semibold hover:underline">Browse all services</Link>
        </p>
      </div>

    </div>
  );
}
