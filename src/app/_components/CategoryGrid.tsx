'use client';

import {
  Wrench, SprayCanIcon, Hammer, Paintbrush2, AirVent, Package,
  Scissors, BookOpen, Sun, Settings, Flame, Camera, Heart,
  Sparkles, Leaf, Droplets, Car, Star, Layers, Battery, Zap,
  ShieldCheck, type LucideIcon,
} from 'lucide-react';
import { useSkillStore } from '@/stores/useSkillStore';

type SlugStyle = { icon: LucideIcon; light: string; text: string };

const SLUG_CONFIG: Record<string, SlugStyle> = {
  'plumbing':             { icon: Wrench,        light: 'bg-indigo-50',  text: 'text-indigo-600'  },
  'electrical':           { icon: Zap,           light: 'bg-amber-50',   text: 'text-amber-600'   },
  'cleaning':             { icon: SprayCanIcon,  light: 'bg-emerald-50', text: 'text-emerald-600' },
  'carpentry':            { icon: Hammer,        light: 'bg-orange-50',  text: 'text-orange-600'  },
  'painting':             { icon: Paintbrush2,   light: 'bg-purple-50',  text: 'text-purple-600'  },
  'ac-repair':            { icon: AirVent,       light: 'bg-cyan-50',    text: 'text-cyan-600'    },
  'moving-shifting':      { icon: Package,       light: 'bg-rose-50',    text: 'text-rose-600'    },
  'tailor-stitching':     { icon: Scissors,      light: 'bg-pink-50',    text: 'text-pink-600'    },
  'tutoring':             { icon: BookOpen,      light: 'bg-blue-50',    text: 'text-blue-600'    },
  'private-tutor':        { icon: BookOpen,      light: 'bg-blue-50',    text: 'text-blue-600'    },
  'solar-installation':   { icon: Sun,           light: 'bg-yellow-50',  text: 'text-yellow-600'  },
  'pest-control':         { icon: ShieldCheck,   light: 'bg-green-50',   text: 'text-green-600'   },
  'home-repair':          { icon: Settings,      light: 'bg-slate-50',   text: 'text-slate-600'   },
  'home-renovation':      { icon: Hammer,        light: 'bg-stone-50',   text: 'text-stone-600'   },
  'deep-cleaning':        { icon: SprayCanIcon,  light: 'bg-teal-50',    text: 'text-teal-600'    },
  'appliance-repair':     { icon: Settings,      light: 'bg-gray-50',    text: 'text-gray-600'    },
  'geyser-repair':        { icon: Flame,         light: 'bg-red-50',     text: 'text-red-600'     },
  'cctv-installation':    { icon: Camera,        light: 'bg-indigo-50',  text: 'text-indigo-600'  },
  'motorcycle-mechanic':  { icon: Wrench,        light: 'bg-orange-50',  text: 'text-orange-600'  },
  'ups-inverter-repair':  { icon: Battery,       light: 'bg-yellow-50',  text: 'text-yellow-600'  },
  'home-nursing':         { icon: Heart,         light: 'bg-rose-50',    text: 'text-rose-600'    },
  'at-home-beauty':       { icon: Sparkles,      light: 'bg-pink-50',    text: 'text-pink-600'    },
  'gardening':            { icon: Leaf,          light: 'bg-green-50',   text: 'text-green-600'   },
  'water-tank-cleaning':  { icon: Droplets,      light: 'bg-blue-50',    text: 'text-blue-600'    },
  'car-denting-painting': { icon: Car,           light: 'bg-slate-50',   text: 'text-slate-600'   },
  'laundry-dry-cleaning': { icon: Scissors,      light: 'bg-sky-50',     text: 'text-sky-600'     },
  'waterproofing':        { icon: Droplets,      light: 'bg-blue-50',    text: 'text-blue-600'    },
  'car-mechanic':         { icon: Car,           light: 'bg-gray-50',    text: 'text-gray-600'    },
  'car-wash':             { icon: Car,           light: 'bg-sky-50',     text: 'text-sky-600'     },
  'mehendi-artist':       { icon: Sparkles,      light: 'bg-amber-50',   text: 'text-amber-600'   },
  'generator-repair':     { icon: Zap,           light: 'bg-yellow-50',  text: 'text-yellow-600'  },
  'event-decoration':     { icon: Star,          light: 'bg-purple-50',  text: 'text-purple-600'  },
  'tiling-flooring':      { icon: Layers,        light: 'bg-stone-50',   text: 'text-stone-600'   },
};

const DEFAULT_STYLE: SlugStyle = { icon: Wrench, light: 'bg-gray-50', text: 'text-gray-600' };

interface Category { id: number; name: string; slug: string }

export default function CategoryGrid({ categories }: { categories: Category[] }) {
  const setPendingSkill = useSkillStore(s => s.setPendingSkill);

  const handleClick = (name: string) => {
    setPendingSkill(name);
    document.getElementById('search')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 md:gap-4">
      {categories.map(({ id, name, slug }) => {
        const { icon: Icon, light, text } = SLUG_CONFIG[slug] ?? DEFAULT_STYLE;
        return (
          <button
            key={id}
            onClick={() => handleClick(name)}
            className="group flex flex-col items-center gap-2 md:gap-3 p-3 md:p-4 rounded-2xl hover:shadow-lg border border-gray-100 hover:border-indigo-100 bg-white hover:bg-indigo-50/30 transition-all duration-300 hover:-translate-y-1 text-left w-full"
          >
            <div className={`w-11 h-11 md:w-14 md:h-14 ${light} ${text} rounded-xl md:rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
              <Icon size={22} />
            </div>
            <span className="text-[11px] md:text-xs font-semibold text-gray-700 group-hover:text-indigo-600 transition-colors text-center leading-tight">{name}</span>
          </button>
        );
      })}
    </div>
  );
}
