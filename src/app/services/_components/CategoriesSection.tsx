'use client';

import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import type { LucideIcon } from 'lucide-react';
import {
  Droplets, Zap, Sparkles, Hammer, Wind, Leaf, Package,
  Shield, HeartPulse, BookOpen, ChefHat, Car, Wifi,
  Scissors, Camera, Paintbrush2, Wrench, ChevronRight,
  Flame, Layers, Battery, Settings, Sun,
} from 'lucide-react';
import { getCategories } from '@/features/skills/services/skills.service';

interface CategoryMeta {
  icon: LucideIcon;
  color: string;
  bg: string;
  border: string;
  description: string;
}

// Keyword → visual config map (checked in order, first match wins).
// Uses word-token matching to avoid short keywords like 'it' matching
// inside unrelated words like 'stitching'.
const KEYWORD_MAP: Array<{ keywords: string[]; meta: CategoryMeta }> = [
  { keywords: ['geyser', 'boiler', 'heater', 'geysir'],
    meta: { icon: Flame,       color: 'text-red-600',     bg: 'bg-red-50',     border: 'border-red-100',     description: 'Geyser repair & installation' } },
  { keywords: ['solar', 'panel', 'renewable', 'photovoltaic'],
    meta: { icon: Sun,         color: 'text-yellow-600',  bg: 'bg-yellow-50',  border: 'border-yellow-100',  description: 'Solar panel installation & repair' } },
  { keywords: ['ups', 'inverter', 'battery', 'backup', 'generator'],
    meta: { icon: Battery,     color: 'text-amber-600',   bg: 'bg-amber-50',   border: 'border-amber-100',   description: 'UPS, inverter & generator repair' } },
  { keywords: ['tile', 'tiling', 'flooring', 'marble', 'ceramic', 'floor'],
    meta: { icon: Layers,      color: 'text-stone-600',   bg: 'bg-stone-50',   border: 'border-stone-100',   description: 'Tiling & flooring services' } },
  { keywords: ['appliance', 'fridge', 'washing', 'microwave', 'oven', 'dishwasher'],
    meta: { icon: Settings,    color: 'text-gray-600',    bg: 'bg-gray-50',    border: 'border-gray-100',    description: 'Home appliance repair' } },
  { keywords: ['plumb', 'pipe', 'drain', 'faucet', 'tap', 'leak', 'sewage'],
    meta: { icon: Droplets,    color: 'text-blue-600',    bg: 'bg-blue-50',    border: 'border-blue-100',    description: 'Pipes, faucets, drainage & leaks' } },
  { keywords: ['water', 'tank', 'waterproof'],
    meta: { icon: Droplets,    color: 'text-cyan-600',    bg: 'bg-cyan-50',    border: 'border-cyan-100',    description: 'Water tank & waterproofing' } },
  { keywords: ['electr', 'wiring', 'circuit', 'socket', 'switchboard'],
    meta: { icon: Zap,         color: 'text-yellow-600',  bg: 'bg-yellow-50',  border: 'border-yellow-100',  description: 'Wiring, fixtures & installations' } },
  { keywords: ['deep clean', 'clean', 'wash', 'sanit', 'hygien', 'maid', 'laundry', 'dry clean', 'ironing'],
    meta: { icon: Sparkles,    color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-100', description: 'Cleaning & laundry services' } },
  { keywords: ['carpentr', 'wood', 'furniture', 'cabinet', 'door', 'renovati', 'repair'],
    meta: { icon: Hammer,      color: 'text-amber-700',   bg: 'bg-amber-50',   border: 'border-amber-100',   description: 'Carpentry, repair & renovation' } },
  { keywords: ['ac', 'hvac', 'air condition', 'cooling', 'refriger', 'servi'],
    meta: { icon: Wind,        color: 'text-sky-600',     bg: 'bg-sky-50',     border: 'border-sky-100',     description: 'AC servicing, repair & installation' } },
  { keywords: ['garden', 'landscap', 'lawn', 'plant', 'tree', 'grass'],
    meta: { icon: Leaf,        color: 'text-green-600',   bg: 'bg-green-50',   border: 'border-green-100',   description: 'Gardening, trimming & landscaping' } },
  { keywords: ['moving', 'shifting', 'transport', 'packers', 'delivery', 'reloc'],
    meta: { icon: Package,     color: 'text-orange-600',  bg: 'bg-orange-50',  border: 'border-orange-100',  description: 'House moving & delivery services' } },
  { keywords: ['security', 'guard', 'cctv', 'surveillance', 'camera install'],
    meta: { icon: Shield,      color: 'text-slate-600',   bg: 'bg-slate-50',   border: 'border-slate-100',   description: 'Guards, CCTV & safety systems' } },
  { keywords: ['health', 'medical', 'nurs', 'doctor', 'physio', 'patient'],
    meta: { icon: HeartPulse,  color: 'text-rose-600',    bg: 'bg-rose-50',    border: 'border-rose-100',    description: 'Home nursing & medical care' } },
  { keywords: ['tutor', 'teach', 'educat', 'lesson', 'academ', 'school', 'coach'],
    meta: { icon: BookOpen,    color: 'text-violet-600',  bg: 'bg-violet-50',  border: 'border-violet-100',  description: 'Home tutoring & academic help' } },
  { keywords: ['cook', 'chef', 'food', 'cater', 'meal', 'catering'],
    meta: { icon: ChefHat,     color: 'text-pink-600',    bg: 'bg-pink-50',    border: 'border-pink-100',    description: 'Personal chefs & catering' } },
  { keywords: ['motorcycle', 'motorbike', 'bike', 'scooter', 'car', 'auto', 'vehicle', 'mechanic'],
    meta: { icon: Car,         color: 'text-indigo-600',  bg: 'bg-indigo-50',  border: 'border-indigo-100',  description: 'Vehicle repair & maintenance' } },
  { keywords: ['computer', 'laptop', 'internet', 'network', 'software', 'wifi', 'tech support', 'it service'],
    meta: { icon: Wifi,        color: 'text-cyan-600',    bg: 'bg-cyan-50',    border: 'border-cyan-100',    description: 'IT support & tech installations' } },
  { keywords: ['tailor', 'stitching', 'sewing', 'cloth', 'fashion', 'alteration', 'dress'],
    meta: { icon: Scissors,    color: 'text-fuchsia-600', bg: 'bg-fuchsia-50', border: 'border-fuchsia-100', description: 'Tailoring & clothing alterations' } },
  { keywords: ['mehendi', 'henna', 'beauty', 'salon', 'makeup', 'facial', 'waxing', 'bridal'],
    meta: { icon: Sparkles,    color: 'text-pink-600',    bg: 'bg-pink-50',    border: 'border-pink-100',    description: 'Beauty & grooming services' } },
  { keywords: ['photo', 'video', 'wedding', 'event', 'film', 'cinemat'],
    meta: { icon: Camera,      color: 'text-teal-600',    bg: 'bg-teal-50',    border: 'border-teal-100',    description: 'Photography & videography' } },
  { keywords: ['paint', 'colour', 'color', 'wall'],
    meta: { icon: Paintbrush2, color: 'text-lime-600',    bg: 'bg-lime-50',    border: 'border-lime-100',    description: 'Interior & exterior painting' } },
  { keywords: ['pest', 'termite', 'insect', 'cockroach', 'mosquito', 'fumig'],
    meta: { icon: Shield,      color: 'text-green-600',   bg: 'bg-green-50',   border: 'border-green-100',   description: 'Pest control & fumigation' } },
];

const FALLBACK: CategoryMeta = {
  icon: Wrench,
  color: 'text-gray-600',
  bg: 'bg-gray-50',
  border: 'border-gray-100',
  description: 'Professional services on demand',
};

// Splits category name into tokens and checks if any keyword is a
// prefix-match of any token — prevents 'it' matching inside 'stitching'.
function getCategoryMeta(name: string): CategoryMeta {
  const lower = name.toLowerCase();
  const tokens = lower.split(/[\s&,\/\-_]+/);
  for (const { keywords, meta } of KEYWORD_MAP) {
    if (keywords.some((kw) =>
      lower.includes(kw) && (
        kw.length > 4 ||                          // long keywords are safe as substrings
        tokens.some((t) => t === kw || t.startsWith(kw))  // short keywords need word boundary
      )
    )) return meta;
  }
  return FALLBACK;
}

function Skeleton() {
  return (
    <div className="flex flex-col items-center gap-3 p-5 rounded-2xl border border-gray-100 bg-white animate-pulse">
      <div className="w-14 h-14 bg-gray-100 rounded-2xl" />
      <div className="h-3 bg-gray-100 rounded-full w-20" />
      <div className="h-2 bg-gray-100 rounded-full w-28" />
    </div>
  );
}

export function CategoriesSection() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['service-categories'],
    queryFn: getCategories,
    staleTime: 1000 * 60 * 10,
  });

  const categories: Array<{ id: number; name: string }> =
    Array.isArray(data) ? data : (data?.items ?? data?.data ?? []);

  return (
    <section id="categories" className="bg-white py-10 md:py-20 border-t border-gray-100 scroll-mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="text-center mb-8 md:mb-12">
          <span className="inline-block bg-indigo-50 text-indigo-600 text-xs font-bold px-4 py-1.5 rounded-full mb-4 border border-indigo-100">
            All Categories
          </span>
          <h2 className="text-xl md:text-4xl font-extrabold text-gray-900 mb-3">
            Browse by Category
          </h2>
          <p className="text-sm md:text-base text-gray-500 max-w-xl mx-auto leading-relaxed">
            From home repairs to personal care — find a verified professional for every need.
          </p>
        </div>

        {isLoading && (
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3 md:gap-4">
            {Array.from({ length: 10 }).map((_, i) => <Skeleton key={i} />)}
          </div>
        )}

        {error && (
          <div className="text-center py-12 text-gray-400">
            <Wrench size={32} className="mx-auto mb-3 opacity-40" />
            <p className="font-medium text-sm">Could not load categories. Please try again.</p>
          </div>
        )}

        {!isLoading && !error && categories.length > 0 && (
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3 md:gap-4">
            {categories.map((cat) => {
              const meta = getCategoryMeta(cat.name);
              const Icon = meta.icon;
              return (
                <Link
                  key={cat.id}
                  href={`/?skill=${encodeURIComponent(cat.name)}#search`}
                  className={`group flex flex-col items-center gap-2 md:gap-3 p-3 md:p-5 rounded-2xl border ${meta.border} bg-white hover:shadow-xl hover:-translate-y-1 transition-all duration-300 text-center`}
                >
                  <div className={`w-11 h-11 md:w-14 md:h-14 ${meta.bg} ${meta.color} rounded-xl md:rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                    <Icon size={22} />
                  </div>
                  <div>
                    <p className="text-xs md:text-sm font-bold text-gray-800 leading-tight mb-0.5 md:mb-1">{cat.name}</p>
                    <p className="text-[10px] md:text-[11px] text-gray-400 leading-snug hidden sm:block">{meta.description}</p>
                  </div>
                </Link>
              );
            })}
          </div>
        )}

        <div className="text-center mt-8 md:mt-12">
          <Link
            href="/#search"
            className="inline-flex items-center gap-2 px-7 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition-all shadow-lg shadow-indigo-200 hover:-translate-y-0.5 text-sm"
          >
            Search All Professionals
            <ChevronRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
}
