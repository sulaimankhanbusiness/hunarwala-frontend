"use client";

import {
  Home, Search, BookOpen, MessageCircle, Wallet, Star, MapPin,
  CheckCircle, Bell, ArrowLeft, Filter, Clock, Send, Wrench,
  Zap, Droplets, Hammer, Paintbrush, TrendingUp, Package,
  Settings, ChevronRight, Plus, Locate, Pencil, ChevronDown,
  AlertCircle, Calendar, Users, Eye, EyeOff, Mail, Lock,
  ArrowRight, Sparkles, CheckSquare, LogOut, User, Phone, Shield,
  Award, ThumbsUp, MoreHorizontal, Check, Heart, Navigation,
} from "lucide-react";

/* ─────────────────────────── Phone Frame ─────────────────────────── */
function PhoneFrame({ children, title }: { children: React.ReactNode; title: string }) {
  return (
    <div className="flex flex-col items-center gap-3">
      <span className="text-[10px] font-bold text-[#525252] bg-white border border-[#E4E5E1] px-3.5 py-1.5 rounded-full tracking-widest uppercase shadow-sm">
        {title}
      </span>
      <div
        className="relative w-[320px] bg-white overflow-hidden"
        style={{
          height: 660,
          borderRadius: 44,
          border: "10px solid #0D0D0D",
          boxShadow:
            "0 50px 100px -20px rgba(0,0,0,0.40), 0 20px 50px -10px rgba(0,0,0,0.22), 0 6px 16px rgba(0,0,0,0.12), 0 0 0 1px rgba(255,255,255,0.06)",
        }}
      >
        {/* Dynamic Island */}
        <div
          className="absolute z-40"
          style={{
            top: 9,
            left: "50%",
            transform: "translateX(-50%)",
            width: 100,
            height: 28,
            borderRadius: 20,
            background: "#000",
          }}
        />
        {/* Status Bar */}
        <div className="absolute top-0 left-0 right-0 h-11 z-30 flex items-center justify-between px-5 pt-1 pointer-events-none">
          <span className="text-[11px] font-semibold text-gray-900 tabular-nums">9:41</span>
          <div className="flex items-center gap-1">
            <div className="flex gap-[2px] items-end">
              {[3, 5, 7, 9].map((h, i) => (
                <div
                  key={i}
                  className="w-[3px] rounded-sm"
                  style={{ height: h, background: i > 0 ? "#0D0D0D" : "#C9CDC8" }}
                />
              ))}
            </div>
            <svg width="15" height="11" viewBox="0 0 15 11" fill="none">
              <path d="M0.5 4.5C2.8 2 12.2 2 14.5 4.5" stroke="#0D0D0D" strokeWidth="1.4" strokeLinecap="round" />
              <path d="M3 7C4.8 5.3 10.2 5.3 12 7" stroke="#0D0D0D" strokeWidth="1.4" strokeLinecap="round" />
              <circle cx="7.5" cy="9.5" r="1.2" fill="#0D0D0D" />
            </svg>
            <svg width="23" height="11" viewBox="0 0 23 11" fill="none">
              <rect x="0.5" y="0.5" width="18" height="10" rx="3" stroke="#0D0D0D" strokeWidth="1.2" />
              <rect x="2" y="2" width="14" height="7" rx="1.5" fill="#0D0D0D" />
              <path d="M20 3.5C20.8 3.5 21.5 4.2 21.5 5V6C21.5 6.8 20.8 7.5 20 7.5V3.5Z" fill="#0D0D0D" />
            </svg>
          </div>
        </div>
        {/* Home Indicator */}
        <div
          className="absolute z-40"
          style={{
            bottom: 8,
            left: "50%",
            transform: "translateX(-50%)",
            width: 120,
            height: 4,
            borderRadius: 99,
            background: "rgba(0,0,0,0.28)",
          }}
        />
        <div className="h-full overflow-hidden pt-11">{children}</div>
      </div>
    </div>
  );
}

/* ─────────────────────────── Bottom Nav (dark pill) ─────────────────────────── */
function BottomNav({ active }: { active: string }) {
  const tabs = [
    { icon: Home,          label: "Home",     id: "home"     },
    { icon: Search,        label: "Explore",  id: "search"   },
    { icon: BookOpen,      label: "Bookings", id: "bookings", badge: 2 },
    { icon: MessageCircle, label: "Chats",    id: "chats",    badge: 5 },
    { icon: Wallet,        label: "Wallet",   id: "wallet"   },
  ];
  return (
    <div
      className="absolute bottom-0 left-0 right-0 pb-5 pt-1 px-3"
      style={{ background: "linear-gradient(to top, rgba(248,249,251,1) 60%, transparent)" }}
    >
      <div className="flex items-center justify-around bg-[#1E1B4B] rounded-[24px] py-2.5 px-2 shadow-lg shadow-indigo-950/50">
        {tabs.map(({ icon: Icon, label, id, badge }) => {
          const isActive = active === id;
          return (
            <button key={id} className="relative flex flex-col items-center gap-0.5 px-2 pt-1">
              {isActive && (
                <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-4 h-[3px] bg-indigo-400 rounded-full" />
              )}
              {badge && (
                <div className="absolute top-0 right-0 w-3.5 h-3.5 bg-red-500 rounded-full flex items-center justify-center border border-[#1E1B4B]">
                  <span className="text-[6px] text-white font-bold">{badge}</span>
                </div>
              )}
              <Icon
                size={17}
                className={isActive ? "text-white" : "text-indigo-300/40"}
                strokeWidth={isActive ? 2.5 : 1.8}
              />
              <span className={`text-[8px] font-bold ${isActive ? "text-white" : "text-indigo-300/40"}`}>
                {label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ─────────────────────────── HOME SCREEN ─────────────────────────── */
function HomeScreen() {
  const CATEGORIES = [
    { icon: Zap,        label: "Electrical", color: "text-amber-600",  bg: "bg-amber-50",   active: true  },
    { icon: Droplets,   label: "Plumbing",   color: "text-blue-600",   bg: "bg-blue-50",    active: false },
    { icon: Hammer,     label: "Carpentry",  color: "text-orange-600", bg: "bg-orange-50",  active: false },
    { icon: Settings,   label: "Cleaning",   color: "text-teal-600",   bg: "bg-teal-50",    active: false },
    { icon: Paintbrush, label: "Painting",   color: "text-pink-600",   bg: "bg-pink-50",    active: false },
    { icon: Wrench,     label: "AC Repair",  color: "text-cyan-600",   bg: "bg-cyan-50",    active: false },
  ];
  const PROS = [
    { name: "Kamran Ali",  title: "Expert Electrician · 6 yrs",   rating: 4.8, reviews: 124, price: "Rs. 1,500", bg: "from-blue-500 to-blue-700",   initial: "K", pinTop: 42,  pinLeft: 62,  pinBg: "bg-blue-500",   icon: Zap    },
    { name: "Akash Khan",  title: "Master Electrician · 4 yrs",   rating: 4.2, reviews: 86,  price: "Rs. 1,200", bg: "from-purple-500 to-purple-700", initial: "A", pinTop: 92,  pinLeft: 198, pinBg: "bg-purple-500", icon: Zap    },
    { name: "Tahir Khan",  title: "Multi-Trade Specialist · 8 yrs",rating: 4.6, reviews: 97,  price: "Rs. 1,800", bg: "from-teal-500 to-teal-700",   initial: "T", pinTop: 58,  pinLeft: 250, pinBg: "bg-teal-500",   icon: Wrench },
  ];

  return (
    <div className="h-full flex flex-col bg-[#F8F9FB]">
      {/* Header */}
      <div className="bg-white px-4 pt-1 pb-2.5 flex-shrink-0 border-b border-gray-100">
        <div className="flex items-center justify-between mb-1.5">
          <div>
            <p className="text-[9px] text-gray-400 font-semibold">Good morning, Sulaiman 👋</p>
            <div className="flex items-center gap-1 mt-0.5">
              <MapPin size={10} className="text-indigo-500" />
              <p className="text-[11px] font-extrabold text-gray-900">Islamabad, Punjab</p>
              <ChevronDown size={9} className="text-gray-400" />
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <button className="relative w-8 h-8 bg-gray-100 rounded-xl flex items-center justify-center">
              <Bell size={14} className="text-gray-600" />
              <div className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white" />
            </button>
            <div className="flex items-center gap-1 bg-indigo-50 border border-indigo-100 rounded-xl px-2 py-1">
              <Wallet size={10} className="text-indigo-600" />
              <span className="text-[9px] font-bold text-indigo-700">979 PKR</span>
            </div>
            <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-indigo-700 rounded-xl flex items-center justify-center">
              <span className="text-white font-extrabold text-sm">S</span>
            </div>
          </div>
        </div>
        {/* Search */}
        <div className="bg-gray-100 rounded-2xl flex items-center gap-2 px-3 py-2">
          <Search size={14} className="text-gray-400 flex-shrink-0" />
          <span className="text-[11px] text-gray-400 flex-1">Search services or helpers...</span>
          <div className="w-7 h-7 bg-indigo-600 rounded-xl flex items-center justify-center">
            <Filter size={11} className="text-white" />
          </div>
        </div>
        {/* Stats */}
        <div className="flex divide-x divide-gray-100 mt-2">
          {[["100+","Jobs"],["1,200+","Pros"],["4.8★","Rating"],["300+","Cities"]].map(([val, lbl]) => (
            <div key={lbl} className="flex-1 text-center">
              <p className="text-[10px] font-extrabold text-gray-900">{val}</p>
              <p className="text-[8px] text-gray-400">{lbl}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-none pb-20">
        {/* Categories */}
        <div className="px-4 pt-3">
          <div className="flex items-center justify-between mb-2">
            <p className="text-[11px] font-extrabold text-gray-800">Service Categories</p>
            <button className="text-[9px] text-indigo-600 font-bold">All Services</button>
          </div>
          <div className="grid grid-cols-3 gap-1.5">
            {CATEGORIES.map(({ icon: Icon, label, color, bg, active }) => (
              <button
                key={label}
                className={`flex flex-col items-center gap-1.5 py-2.5 rounded-2xl border ${
                  active ? "bg-indigo-600 border-indigo-500" : `${bg} border-transparent`
                }`}
              >
                <div className={`w-8 h-8 ${active ? "bg-white/20" : "bg-white shadow-sm"} rounded-xl flex items-center justify-center`}>
                  <Icon size={15} className={active ? "text-white" : color} />
                </div>
                <span className={`text-[9px] font-bold ${active ? "text-white" : "text-gray-700"}`}>{label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Promo Banner */}
        <div className="mx-4 mt-3 bg-gradient-to-r from-indigo-600 to-violet-600 rounded-2xl p-3.5 flex items-center justify-between overflow-hidden relative">
          <div className="absolute -right-6 -top-6 w-24 h-24 bg-white/10 rounded-full" />
          <div className="absolute -right-2 bottom-0 w-16 h-16 bg-white/5 rounded-full" />
          <div>
            <span className="bg-white/20 text-white text-[8px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wide">Limited Offer</span>
            <p className="text-white font-extrabold text-[12px] mt-1">First Booking Free!</p>
            <p className="text-indigo-200 text-[9px] mt-0.5">Use code <span className="font-bold text-white">FIRST100</span></p>
            <button className="mt-2 bg-white text-indigo-700 text-[10px] font-extrabold px-3 py-1 rounded-lg">Claim Now →</button>
          </div>
          <div className="w-12 h-12 bg-white/15 rounded-2xl flex items-center justify-center flex-shrink-0">
            <Sparkles size={20} className="text-amber-300" />
          </div>
        </div>

        {/* Near Me Map */}
        <div className="px-4 mt-3">
          <div className="flex items-center justify-between mb-2">
            <p className="text-[11px] font-extrabold text-gray-800">Pros Near You</p>
            <div className="flex items-center gap-1 bg-green-50 border border-green-100 px-2 py-0.5 rounded-lg">
              <div className="w-1.5 h-1.5 bg-green-500 rounded-full" />
              <span className="text-[9px] font-bold text-green-700">3 online now</span>
            </div>
          </div>
          <div className="rounded-2xl overflow-hidden border border-gray-200 shadow-sm relative" style={{ height: 140 }}>
            <svg viewBox="0 0 296 140" className="absolute inset-0 w-full h-full" preserveAspectRatio="xMidYMid slice">
              <rect width="296" height="140" fill="#EEF2E8" />
              <rect x="0" y="0" width="90" height="65" fill="#D6EAC8" rx="5" />
              <rect x="185" y="90" width="80" height="50" fill="#D6EAC8" rx="5" />
              <rect x="110" y="5" width="48" height="20" fill="#CDD5C6" rx="3" />
              <rect x="10" y="78" width="28" height="16" fill="#CDD5C6" rx="3" />
              <rect x="45" y="76" width="32" height="15" fill="#CDD5C6" rx="3" />
              <rect x="170" y="10" width="30" height="22" fill="#CDD5C6" rx="3" />
              <rect x="205" y="62" width="28" height="20" fill="#CDD5C6" rx="3" />
              <rect x="240" y="60" width="24" height="18" fill="#CDD5C6" rx="3" />
              <line x1="0" y1="125" x2="296" y2="125" stroke="#E5E7EB" strokeWidth="0.6" strokeDasharray="8,6" />
              <line x1="91" y1="0" x2="91" y2="140" stroke="#E5E7EB" strokeWidth="0.6" strokeDasharray="8,6" />
              <text x="12" y="119" fontSize="4" fill="#9CA3AF" fontFamily="sans-serif">Islamabad Expressway</text>
              <text x="94" y="35" fontSize="4" fill="#9CA3AF" fontFamily="sans-serif" transform="rotate(90,94,35)">Jinnah Ave</text>
            </svg>
            {PROS.map(({ name, pinTop, pinLeft, pinBg, icon: Icon }) => (
              <div key={name} className="absolute z-10" style={{ top: pinTop * 0.55, left: pinLeft * 0.95, transform: "translate(-50%,-100%)" }}>
                <div className="flex flex-col items-center">
                  <div className={`${pinBg} text-white text-[7px] font-extrabold px-1.5 py-0.5 rounded-lg shadow-md whitespace-nowrap flex items-center gap-0.5`}>
                    <Icon size={6} />{name.split(" ")[0]}
                  </div>
                  <div className={`w-1.5 h-1.5 ${pinBg} rotate-45 -mt-0.5`} />
                </div>
              </div>
            ))}
            <div className="absolute z-10" style={{ top: 78, left: 91, transform: "translate(-50%,-50%)" }}>
              <div className="relative flex items-center justify-center">
                <div className="absolute w-8 h-8 bg-indigo-400/25 rounded-full animate-ping" />
                <div className="w-3.5 h-3.5 bg-indigo-600 rounded-full border-2 border-white shadow-lg z-10" />
              </div>
            </div>
            <div className="absolute right-2 top-2 flex flex-col gap-1 z-20">
              <button className="w-5 h-5 bg-white rounded-lg shadow flex items-center justify-center text-gray-700 font-bold text-xs border border-gray-100">+</button>
              <button className="w-5 h-5 bg-white rounded-lg shadow flex items-center justify-center text-gray-700 font-bold text-xs border border-gray-100">−</button>
            </div>
            <div className="absolute top-2 left-2 bg-indigo-600 text-white text-[8px] font-bold px-2 py-0.5 rounded-lg shadow z-20 flex items-center gap-1">
              <MapPin size={7} />3 pros nearby
            </div>
          </div>
        </div>

        {/* Top Rated Pros */}
        <div className="mt-3">
          <div className="flex items-center justify-between px-4 mb-2">
            <p className="text-[11px] font-extrabold text-gray-800">Top Rated Pros</p>
            <button className="text-[9px] text-indigo-600 font-bold">See all</button>
          </div>
          <div className="flex gap-2.5 pl-4 overflow-x-auto scrollbar-none pr-4">
            {PROS.map(({ name, title, rating, reviews, price, bg, initial }) => (
              <div key={name} className="flex-shrink-0 w-[155px] bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm">
                <div className={`h-14 bg-gradient-to-r ${bg} relative`}>
                  <div className="absolute top-2 right-2 bg-green-500/90 text-white text-[7px] font-extrabold px-1.5 py-0.5 rounded-full flex items-center gap-0.5">
                    <CheckCircle size={6} />Verified
                  </div>
                  <div className="absolute -bottom-5 left-2.5 w-10 h-10 border-2 border-white shadow-sm rounded-xl overflow-hidden">
                    <div className={`w-full h-full bg-gradient-to-br ${bg} flex items-center justify-center`}>
                      <span className="text-white font-extrabold">{initial}</span>
                    </div>
                  </div>
                </div>
                <div className="px-2.5 pt-7 pb-2.5">
                  <p className="text-[11px] font-extrabold text-gray-900">{name}</p>
                  <p className="text-[8px] text-indigo-600 font-semibold leading-tight mb-1">{title}</p>
                  <div className="flex items-center gap-0.5 mb-1.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} size={7} className={i < Math.round(rating) ? "text-amber-400 fill-amber-400" : "text-gray-200 fill-gray-200"} />
                    ))}
                    <span className="text-[8px] font-bold text-gray-700 ml-0.5">{rating}</span>
                    <span className="text-[7px] text-gray-400">({reviews})</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[7px] text-gray-400">From</p>
                      <p className="text-[10px] font-extrabold text-gray-900">{price}</p>
                    </div>
                    <button className="bg-indigo-600 text-white text-[9px] font-bold py-1.5 px-2.5 rounded-xl">Book</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Services */}
        <div className="px-4 mt-3 pb-2">
          <div className="flex items-center justify-between mb-2">
            <p className="text-[11px] font-extrabold text-gray-800">Quick Services</p>
            <button className="text-[9px] text-indigo-600 font-bold">More</button>
          </div>
          {[
            { icon: Zap,      label: "Emergency Electrician", eta: "~30 min", price: "Rs. 500",   color: "text-amber-600", bg: "bg-amber-50"  },
            { icon: Droplets, label: "Pipe Leak Repair",      eta: "~1 hr",   price: "Rs. 400",   color: "text-blue-600",  bg: "bg-blue-50"   },
            { icon: Wrench,   label: "AC Gas Refill",         eta: "~2 hrs",  price: "Rs. 1,500", color: "text-cyan-600",  bg: "bg-cyan-50"   },
          ].map(({ icon: Icon, label, eta, price, color, bg }) => (
            <div key={label} className="flex items-center gap-3 bg-white rounded-2xl p-3 border border-gray-100 shadow-sm mb-2">
              <div className={`w-10 h-10 ${bg} rounded-xl flex items-center justify-center flex-shrink-0`}>
                <Icon size={17} className={color} />
              </div>
              <div className="flex-1">
                <p className="text-[11px] font-extrabold text-gray-900">{label}</p>
                <div className="flex items-center gap-1 mt-0.5">
                  <Clock size={8} className="text-gray-400" />
                  <span className="text-[9px] text-gray-400">{eta}</span>
                  <span className="text-gray-300 text-[9px]">·</span>
                  <span className="text-[9px] font-bold text-indigo-600">{price}</span>
                </div>
              </div>
              <div className="w-8 h-8 bg-indigo-50 rounded-xl flex items-center justify-center">
                <ArrowRight size={13} className="text-indigo-600" />
              </div>
            </div>
          ))}
        </div>
      </div>

      <BottomNav active="home" />
    </div>
  );
}

/* ─────────────────────────── SERVICES / SEARCH SCREEN ─────────────────────────── */
function SearchScreen() {
  return (
    <div className="h-full bg-[#F8F9FB] overflow-y-auto scrollbar-none pb-20">
      <div className="bg-white px-4 pt-2 pb-3 sticky top-0 z-10 border-b border-gray-100">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-[14px] font-extrabold text-gray-900">Browse Services</h2>
          <div className="flex gap-1.5">
            <button className="w-8 h-8 bg-gray-100 rounded-xl flex items-center justify-center">
              <Filter size={13} className="text-gray-600" />
            </button>
          </div>
        </div>
        <div className="bg-gray-100 rounded-2xl flex items-center gap-2 px-3 py-2">
          <Search size={14} className="text-gray-400" />
          <span className="text-[11px] text-gray-400 flex-1">Services, helpers, categories...</span>
        </div>
        <div className="flex items-center gap-1.5 mt-2 overflow-x-auto pb-0.5 scrollbar-none">
          <span className="text-[8px] text-gray-400 font-extrabold flex-shrink-0 uppercase tracking-wide">Trending:</span>
          {["Plumbing","AC Repair","Electrical","Cleaning","Painting"].map((t) => (
            <button key={t} className="flex-shrink-0 px-2 py-0.5 rounded-lg text-[9px] font-bold bg-indigo-50 text-indigo-600 border border-indigo-100">{t}</button>
          ))}
        </div>
      </div>

      {/* All Categories */}
      <div className="px-4 pt-3 pb-2">
        <p className="text-[9px] font-extrabold text-gray-400 uppercase tracking-widest mb-2">All Categories</p>
        <div className="grid grid-cols-2 gap-2">
          {[
            { icon: Droplets,   label: "Plumbing",    sub: "Pipes, faucets & leaks",          color: "text-blue-600",   bg: "bg-blue-50",   border: "border-blue-100"   },
            { icon: Zap,        label: "Electrical",  sub: "Wiring, fixtures & fuse box",     color: "text-amber-600",  bg: "bg-amber-50",  border: "border-amber-100"  },
            { icon: Hammer,     label: "Carpentry",   sub: "Furniture, doors & woodwork",     color: "text-orange-600", bg: "bg-orange-50", border: "border-orange-100" },
            { icon: Settings,   label: "Cleaning",    sub: "Deep clean & laundry services",   color: "text-teal-600",   bg: "bg-teal-50",   border: "border-teal-100"   },
            { icon: Paintbrush, label: "Painting",    sub: "Interior & exterior painting",    color: "text-pink-600",   bg: "bg-pink-50",   border: "border-pink-100"   },
            { icon: Wrench,     label: "AC & HVAC",   sub: "Repair, service & gas refill",    color: "text-cyan-600",   bg: "bg-cyan-50",   border: "border-cyan-100"   },
          ].map(({ icon: Icon, label, sub, color, bg, border }) => (
            <button key={label} className={`bg-white rounded-2xl p-3 border ${border} shadow-sm text-left`}>
              <div className={`w-9 h-9 ${bg} rounded-xl flex items-center justify-center mb-2`}>
                <Icon size={17} className={color} />
              </div>
              <p className="text-[11px] font-extrabold text-gray-900">{label}</p>
              <p className="text-[8px] text-gray-400 leading-tight mt-0.5">{sub}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Popular Services */}
      <div className="px-4 pb-4">
        <p className="text-[9px] font-extrabold text-gray-400 uppercase tracking-widest mb-2">Most Booked</p>
        <div className="flex flex-col gap-2">
          {[
            { icon: Droplets, service: "Plumbing Repair",   price: "Rs. 500",   time: "1–3 hrs",  rating: 4.8, jobs: "2.1k", color: "text-blue-600",  bg: "bg-blue-50"   },
            { icon: Zap,      service: "Electrical Work",   price: "Rs. 600",   time: "2–4 hrs",  rating: 4.7, jobs: "1.8k", color: "text-amber-600", bg: "bg-amber-50"  },
            { icon: Wrench,   service: "AC & HVAC Service", price: "Rs. 1,500", time: "1–3 hrs",  rating: 4.6, jobs: "980",  color: "text-cyan-600",  bg: "bg-cyan-50"   },
            { icon: Settings, service: "Deep Cleaning",     price: "Rs. 1,200", time: "3–5 hrs",  rating: 4.9, jobs: "1.2k", color: "text-teal-600",  bg: "bg-teal-50"   },
          ].map(({ icon: Icon, service, price, time, rating, jobs, color, bg }) => (
            <div key={service} className="bg-white rounded-2xl p-3 border border-gray-100 shadow-sm flex items-center gap-3">
              <div className={`w-11 h-11 ${bg} rounded-xl flex items-center justify-center flex-shrink-0`}>
                <Icon size={19} className={color} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[12px] font-extrabold text-gray-900">{service}</p>
                <div className="flex items-center gap-1 mt-0.5">
                  <Star size={8} className="text-amber-400 fill-amber-400" />
                  <span className="text-[9px] font-bold text-gray-700">{rating}</span>
                  <span className="text-[8px] text-gray-400">· {jobs} jobs · {time}</span>
                </div>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="text-[10px] font-extrabold text-indigo-600">{price}</p>
                <button className="mt-1 bg-indigo-600 text-white text-[9px] font-bold px-2.5 py-1 rounded-xl">Book</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <BottomNav active="search" />
    </div>
  );
}

/* ─────────────────────────── HELPER PROFILE ─────────────────────────── */
function HelperProfileScreen() {
  const days = ["MON","TUE","WED","THU","FRI","SAT","SUN"];
  const isOff = [false, false, false, false, true, false, false];

  return (
    <div className="h-full overflow-y-auto bg-[#F8F9FB] scrollbar-none">
      {/* Hero */}
      <div className="relative">
        <div className="h-28 bg-gradient-to-r from-indigo-600 via-indigo-700 to-violet-700" />
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-4 -right-4 w-32 h-32 bg-white/8 rounded-full" />
          <div className="absolute top-8 -left-8 w-24 h-24 bg-white/5 rounded-full" />
        </div>
        <button className="absolute top-3 left-3 w-7 h-7 bg-black/25 backdrop-blur-sm rounded-xl flex items-center justify-center">
          <ArrowLeft size={13} className="text-white" />
        </button>
        <button className="absolute top-3 right-3 w-7 h-7 bg-black/25 backdrop-blur-sm rounded-xl flex items-center justify-center">
          <MoreHorizontal size={13} className="text-white" />
        </button>
        <div className="absolute top-3 right-12 bg-green-500/90 text-white text-[8px] font-extrabold px-2 py-0.5 rounded-full flex items-center gap-0.5 backdrop-blur-sm">
          <div className="w-1.5 h-1.5 bg-white rounded-full" />Online
        </div>
        <div className="absolute -bottom-11 left-4" style={{ border: "3px solid white", borderRadius: 16 }}>
          <div className="w-22 h-22 bg-gradient-to-br from-indigo-400 to-indigo-700 rounded-2xl flex items-center justify-center relative" style={{ width: 84, height: 84 }}>
            <span className="text-4xl font-extrabold text-white">S</span>
            <div className="absolute bottom-1 right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white" />
          </div>
        </div>
      </div>

      {/* Profile Info */}
      <div className="pt-14 px-4 pb-3 bg-white border-b border-gray-100">
        <div className="flex items-start justify-between mb-0.5">
          <div>
            <div className="flex items-center gap-1.5 flex-wrap">
              <h2 className="text-[15px] font-extrabold text-gray-900">Sulaiman Khan</h2>
              <CheckCircle size={13} className="text-indigo-500" />
            </div>
            <p className="text-[10px] text-indigo-600 font-semibold leading-tight mt-0.5">
              Skilled Electrician · Residential & Commercial
            </p>
          </div>
          <span className="bg-green-50 text-green-600 text-[9px] font-extrabold px-2 py-0.5 rounded-full border border-green-100 flex-shrink-0 mt-0.5">
            Available
          </span>
        </div>
        <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 mt-2 mb-3">
          {([ { Icon: Star,     text: "4.1 (7 reviews)" },
               { Icon: BookOpen, text: "11 Jobs Done"    },
               { Icon: MapPin,   text: "Mardan, KPK"     },
               { Icon: Clock,    text: "2 Yrs Experience"},
          ] as const).map(({ Icon, text }, i) => (
            <div key={i} className="flex items-center gap-0.5">
              <Icon size={9} className="text-gray-400" />
              <span className="text-[9px] text-gray-500">{text}</span>
            </div>
          ))}
        </div>
        <div className="flex gap-2">
          <button className="flex-1 bg-indigo-600 text-white text-[11px] font-extrabold py-2 rounded-xl flex items-center justify-center gap-1.5 shadow-md shadow-indigo-300">
            <BookOpen size={11} />Book Now
          </button>
          <button className="w-10 h-9 bg-gray-100 rounded-xl flex items-center justify-center">
            <MessageCircle size={14} className="text-gray-600" />
          </button>
          <button className="w-10 h-9 bg-gray-100 rounded-xl flex items-center justify-center">
            <Heart size={14} className="text-gray-600" />
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 divide-x divide-gray-100 bg-white border-b border-gray-100">
        {[["11","Jobs"],["4.1","Rating"],["38%","Accept"],["—","Response"]].map(([val, label]) => (
          <div key={label} className="flex flex-col items-center py-2.5 px-1">
            <p className="text-[13px] font-extrabold text-gray-900">{val}</p>
            <p className="text-[7px] text-gray-400 text-center leading-tight mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      {/* Badges */}
      <div className="px-4 py-3 bg-white border-b border-gray-100">
        <h3 className="text-[11px] font-extrabold text-gray-900 mb-1.5">Skills & Badges</h3>
        <div className="flex gap-1.5 flex-wrap">
          {[
            { label: "Wiring Expert",    color: "bg-amber-50 text-amber-700 border-amber-100" },
            { label: "Breaker Repair",   color: "bg-blue-50 text-blue-700 border-blue-100"   },
            { label: "Safety Certified", color: "bg-green-50 text-green-700 border-green-100" },
            { label: "Fast Response",    color: "bg-indigo-50 text-indigo-700 border-indigo-100" },
          ].map(({ label, color }) => (
            <span key={label} className={`text-[9px] font-bold px-2 py-0.5 rounded-lg border ${color}`}>{label}</span>
          ))}
        </div>
      </div>

      {/* About */}
      <div className="px-4 py-3 bg-white border-b border-gray-100">
        <h3 className="text-[11px] font-extrabold text-gray-900 mb-1">About Me</h3>
        <p className="text-[9px] text-gray-500 leading-relaxed">
          Hardworking and dependable electrician with hands-on experience in installing, maintaining, and repairing electrical systems. Strong understanding of wiring, safety standards, and troubleshooting...
        </p>
        <button className="text-[9px] text-indigo-600 font-bold mt-0.5 flex items-center gap-0.5">
          Read More <ChevronRight size={9} />
        </button>
      </div>

      {/* My Services */}
      <div className="px-4 py-3 bg-white border-b border-gray-100">
        <h3 className="text-[11px] font-extrabold text-gray-900 mb-2">My Services</h3>
        {[
          { label: "Breaker Repair",       price: "Rs. 1,500", time: "2.5 hrs", icon: Zap      },
          { label: "Wiring Installation",  price: "Rs. 2,000", time: "4 hrs",   icon: Zap      },
          { label: "Fan & Light Fitting",  price: "Rs. 800",   time: "1 hr",    icon: Settings },
        ].map(({ label, price, time, icon: Icon }) => (
          <div key={label} className="bg-gray-50 rounded-xl p-2.5 flex items-center gap-2.5 border border-gray-100 mb-1.5 last:mb-0">
            <div className="w-8 h-8 bg-indigo-50 rounded-xl flex items-center justify-center flex-shrink-0">
              <Icon size={14} className="text-indigo-600" />
            </div>
            <div className="flex-1">
              <p className="text-[10px] font-extrabold text-gray-900">{label}</p>
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-bold text-indigo-600">{price}</span>
                <span className="text-[8px] text-gray-400">· {time}</span>
              </div>
            </div>
            <button className="text-[8px] font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded-lg">Book</button>
          </div>
        ))}
      </div>

      {/* Working Hours */}
      <div className="px-4 py-3 bg-white border-b border-gray-100">
        <h3 className="text-[11px] font-extrabold text-gray-900 mb-2">Working Hours</h3>
        <div className="flex gap-1">
          {days.map((day, i) => (
            <div key={day} className={`flex-1 text-center rounded-lg py-1.5 ${isOff[i] ? "bg-gray-50" : "bg-indigo-50"}`}>
              <p className="text-[7px] font-bold text-gray-500">{day}</p>
              <p className={`text-[7px] mt-0.5 font-semibold leading-tight ${isOff[i] ? "text-gray-400" : "text-indigo-600"}`}>
                {isOff[i] ? "Off" : "9–18"}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Reviews */}
      <div className="px-4 py-3 bg-white border-b border-gray-100">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-[11px] font-extrabold text-gray-900">Reviews</h3>
          <div className="flex items-center gap-0.5">
            <Star size={9} className="text-amber-400 fill-amber-400" />
            <span className="text-[10px] font-bold text-gray-700">4.1</span>
            <span className="text-[8px] text-gray-400"> · 7 reviews</span>
          </div>
        </div>
        {[
          { name: "Faisal Ahmed", rating: 5, date: "May 2026", text: "Excellent! Fixed the main wiring fault in under 2 hours. Very professional and clean work.", avatar: "F", color: "bg-green-600" },
          { name: "Zara Khan",    rating: 4, date: "Apr 2026", text: "Good service, arrived a bit late but the work quality was great. Would recommend.", avatar: "Z", color: "bg-pink-600"  },
        ].map(({ name, rating, date, text, avatar, color }) => (
          <div key={name} className="pb-2.5 mb-2.5 border-b border-gray-50 last:border-0 last:mb-0 last:pb-0">
            <div className="flex items-center gap-2 mb-1">
              <div className={`w-7 h-7 ${color} rounded-xl flex items-center justify-center flex-shrink-0`}>
                <span className="text-white font-extrabold text-xs">{avatar}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] font-extrabold text-gray-900">{name}</p>
                <p className="text-[8px] text-gray-400">{date}</p>
              </div>
              <div className="flex items-center gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} size={7} className={i < rating ? "text-amber-400 fill-amber-400" : "text-gray-200 fill-gray-200"} />
                ))}
              </div>
            </div>
            <p className="text-[9px] text-gray-500 leading-relaxed">{text}</p>
          </div>
        ))}
        <button className="w-full text-center text-[10px] text-indigo-600 font-bold pt-1">View all 7 reviews →</button>
      </div>

      {/* Quick Info */}
      <div className="px-4 py-3 bg-white border-b border-gray-100">
        <h3 className="text-[11px] font-extrabold text-gray-900 mb-1.5">Quick Info</h3>
        {[
          ["Daily Rate",   "Rs. 200/day"],
          ["Experience",   "2+ Years"],
          ["Member Since", "Apr 2026"],
          ["Service Area", "Mardan, KPK"],
          ["Languages",    "Urdu · English · Pashto"],
          ["Approval",     "Approved ✓"],
        ].map(([label, value]) => (
          <div key={label} className="flex justify-between py-1 border-b border-gray-50 last:border-0">
            <span className="text-[9px] text-gray-400">{label}</span>
            <span className={`text-[9px] font-bold ${label === "Approval" ? "text-green-600" : "text-gray-900"}`}>{value}</span>
          </div>
        ))}
      </div>

      {/* Profile Status */}
      <div className="px-4 py-3 bg-white mb-4">
        <h3 className="text-[11px] font-extrabold text-gray-900 mb-2">Profile Status</h3>
        <div className="bg-indigo-600 rounded-2xl p-3 flex flex-col gap-2">
          {[
            { label: "Identity Verified",  done: true  },
            { label: "Account Approved",   done: true  },
            { label: "Standard Listing",   done: false },
          ].map(({ label, done }) => (
            <div key={label} className="flex items-center gap-2">
              <div className={`w-4 h-4 rounded-full flex items-center justify-center ${done ? "bg-green-400" : "bg-indigo-400"}`}>
                {done ? <Check size={9} className="text-white" /> : <Clock size={9} className="text-white" />}
              </div>
              <span className="text-[10px] text-white font-semibold">{label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────── BOOKINGS SCREEN ─────────────────────────── */
function BookingsScreen() {
  const bookings = [
    { helper: "Sulaiman",   tag: "Expert Electrician · 6 Year Exp",  date: "29 May 2026", time: "07:26 pm", price: "Rs. 200",   type: "Daily Rate",   status: "SETTLED",  canRate: true,  initial: "S", color: "bg-indigo-600"  },
    { helper: "Kamran Ali", tag: "Expert Electrician · 4 Year Exp",  date: "29 May 2026", time: "11:00 am", price: "Rs. 1,500", type: "Service Price", status: "ONGOING",  canRate: false, initial: "K", color: "bg-blue-600"    },
    { helper: "Sulaiman",   tag: "Expert Electrician · 6 Year Exp",  date: "29 May 2026", time: "07:24 pm", price: "Rs. 2,500", type: "Service Price", status: "EXPIRED",  canRate: false, initial: "S", color: "bg-indigo-600"  },
    { helper: "Sajid Khan", tag: "Plumber · 3 Year Experience",      date: "28 May 2026", time: "05:07 pm", price: "Rs. 200",   type: "Daily Rate",   status: "EXPIRED",  canRate: false, initial: "SJ", color: "bg-teal-600"   },
    { helper: "Sulaiman",   tag: "Expert Electrician · 6 Year Exp",  date: "28 May 2026", time: "08:00 pm", price: "Rs. 8,000", type: "Service Price", status: "SETTLED",  canRate: true,  initial: "S", color: "bg-indigo-600"  },
  ];

  const statusStyle: Record<string, string> = {
    SETTLED: "bg-green-50 text-green-700 border border-green-100",
    ONGOING: "bg-blue-50 text-blue-700 border border-blue-100",
    EXPIRED: "bg-red-50 text-red-600 border border-red-100",
  };
  const borderStyle: Record<string, string> = {
    SETTLED: "border-l-green-500",
    ONGOING: "border-l-blue-500",
    EXPIRED: "border-l-red-400",
  };

  return (
    <div className="h-full bg-[#F8F9FB] pb-20 overflow-y-auto scrollbar-none">
      <div className="bg-white px-4 pt-2 pb-3 sticky top-0 z-10 border-b border-gray-100">
        <div className="flex items-center justify-between mb-2">
          <div>
            <p className="text-[8px] text-indigo-600 font-extrabold uppercase tracking-widest">Job Center</p>
            <h2 className="text-[14px] font-extrabold text-gray-900">My Bookings</h2>
          </div>
          <div className="flex gap-1.5">
            <button className="w-8 h-8 bg-gray-100 rounded-xl flex items-center justify-center">
              <Search size={13} className="text-gray-600" />
            </button>
            <button className="w-8 h-8 bg-gray-100 rounded-xl flex items-center justify-center">
              <Filter size={13} className="text-gray-600" />
            </button>
          </div>
        </div>
        {/* Toggle */}
        <div className="flex bg-gray-100 rounded-xl p-1 gap-1 mb-2">
          <button className="flex-1 py-1.5 text-[10px] font-extrabold rounded-lg bg-indigo-600 text-white shadow-sm flex items-center justify-center gap-1">
            <Users size={10} />As Client
            <span className="bg-white text-indigo-600 text-[7px] font-extrabold w-4 h-4 rounded-full flex items-center justify-center">16</span>
          </button>
          <button className="flex-1 py-1.5 text-[10px] font-bold rounded-lg text-gray-400 flex items-center justify-center gap-1">
            As Helper
          </button>
        </div>
        {/* Status filter pills */}
        <div className="flex gap-1.5 overflow-x-auto scrollbar-none">
          {[["All","bg-gray-900 text-white"],["Upcoming","bg-white text-gray-600 border border-gray-200"],["Settled","bg-white text-gray-600 border border-gray-200"],["Expired","bg-white text-gray-600 border border-gray-200"]].map(([label, cls]) => (
            <button key={label} className={`flex-shrink-0 text-[9px] font-bold px-2.5 py-1 rounded-full ${cls}`}>{label}</button>
          ))}
        </div>
      </div>

      <div className="px-4 pt-3 flex flex-col gap-2.5">
        {bookings.map(({ helper, tag, date, time, price, type, status, canRate, initial, color }, i) => (
          <div key={i} className={`bg-white rounded-2xl border border-gray-100 border-l-4 p-3 shadow-sm ${borderStyle[status]}`}>
            <div className="flex items-start gap-2.5 mb-1.5">
              <div className={`w-9 h-9 ${color} rounded-xl flex items-center justify-center flex-shrink-0`}>
                <span className="text-white font-extrabold text-sm">{initial[0]}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[12px] font-extrabold text-gray-900">{helper}</p>
                <p className="text-[8px] text-indigo-600 font-semibold truncate">{tag}</p>
              </div>
              <span className={`text-[8px] font-extrabold px-2 py-0.5 rounded-full flex-shrink-0 ${statusStyle[status]}`}>
                {status}
              </span>
            </div>

            {/* Ongoing progress stepper */}
            {status === "ONGOING" && (
              <div className="flex items-start gap-0 mb-2 mt-1">
                {["Requested","Accepted","In Progress","Done"].map((step, si) => (
                  <div key={step} className="flex items-center flex-1">
                    <div className="flex flex-col items-center">
                      <div className={`w-4 h-4 rounded-full flex items-center justify-center ${si <= 1 ? "bg-blue-600" : "bg-gray-200"}`}>
                        {si < 1 ? <Check size={8} className="text-white" /> : (
                          <div className={`w-1.5 h-1.5 rounded-full ${si <= 1 ? "bg-white" : "bg-gray-400"}`} />
                        )}
                      </div>
                      <span className="text-[6px] text-gray-500 text-center mt-0.5" style={{ width: 30, lineHeight: 1.2 }}>{step}</span>
                    </div>
                    {si < 3 && <div className={`flex-1 h-[1px] mb-3 mx-0.5 ${si < 1 ? "bg-blue-600" : "bg-gray-200"}`} />}
                  </div>
                ))}
              </div>
            )}

            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1">
                <Calendar size={9} className="text-gray-400" />
                <span className="text-[8px] text-gray-400">{date} · {time}</span>
              </div>
              <div className="text-right">
                <p className="text-[11px] font-extrabold text-gray-900">{price}</p>
                <p className="text-[7px] text-gray-400 uppercase tracking-wide">{type}</p>
              </div>
            </div>

            {status === "EXPIRED" && (
              <div className="flex items-start gap-1 bg-red-50 rounded-xl px-2 py-1.5 mb-2">
                <AlertCircle size={9} className="text-red-400 flex-shrink-0 mt-0.5" />
                <p className="text-[8px] text-red-500">Booking expired — not accepted within 15 min. Try booking again.</p>
              </div>
            )}
            {status === "ONGOING" && (
              <div className="flex gap-2">
                <button className="flex-1 bg-blue-50 text-blue-700 text-[9px] font-bold py-1.5 rounded-xl flex items-center justify-center gap-1 border border-blue-100">
                  <MessageCircle size={9} />Chat
                </button>
                <button className="flex-1 bg-green-50 text-green-700 text-[9px] font-bold py-1.5 rounded-xl flex items-center justify-center gap-1 border border-green-100">
                  <Check size={9} />Mark Done
                </button>
              </div>
            )}
            {canRate && (
              <button className="w-full bg-amber-400 text-white text-[10px] font-extrabold py-1.5 rounded-xl flex items-center justify-center gap-1 shadow-sm shadow-amber-200">
                <Star size={9} className="fill-white" />Rate & Review Helper
              </button>
            )}
          </div>
        ))}
        <p className="text-[9px] text-gray-400 text-center py-1">Showing 5 of 16 bookings</p>
      </div>

      <BottomNav active="bookings" />
    </div>
  );
}

/* ─────────────────────────── MESSAGES SCREEN ─────────────────────────── */
function ChatScreen() {
  const conversations = [
    { name: "Sulaiman Khan", role: "Electrician",  lastMsg: "Kam xe",             time: "May 31", avatar: "S", color: "bg-indigo-600",  active: true,  unread: 2 },
    { name: "Jawad Khan",    role: "Plumber",       lastMsg: "Okay I'll be there", time: "May 29", avatar: "J", color: "bg-emerald-600", active: false, unread: 0 },
    { name: "Ashiq Rehman",  role: "AC Technician", lastMsg: "Sanga chal d",      time: "May 12", avatar: "A", color: "bg-amber-600",   active: false, unread: 3 },
  ];

  return (
    <div className="h-full bg-white flex flex-col">
      {/* Header */}
      <div className="bg-white px-4 pt-2 pb-3 border-b border-gray-100">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-[15px] font-extrabold text-gray-900">Messages</h2>
          <div className="flex gap-1.5">
            <button className="w-8 h-8 bg-gray-100 rounded-xl flex items-center justify-center">
              <Search size={13} className="text-gray-600" />
            </button>
            <button className="w-8 h-8 bg-gray-100 rounded-xl flex items-center justify-center">
              <Pencil size={13} className="text-gray-600" />
            </button>
          </div>
        </div>
        <div className="bg-gray-100 rounded-2xl flex items-center gap-2 px-3 py-2">
          <Search size={13} className="text-gray-400" />
          <span className="text-[11px] text-gray-400">Search conversations...</span>
        </div>
        <div className="flex gap-4 mt-2">
          <button className="text-[11px] font-extrabold text-gray-900 border-b-2 border-indigo-600 pb-0.5">All (3)</button>
          <button className="text-[11px] font-bold text-gray-400 pb-0.5">Unread (5)</button>
          <button className="text-[11px] font-bold text-gray-400 pb-0.5">Archived</button>
        </div>
      </div>

      {/* Safety Notice */}
      <div className="bg-amber-50 border-b border-amber-100 px-4 py-1.5 flex items-center gap-1.5">
        <AlertCircle size={10} className="text-amber-500 flex-shrink-0" />
        <p className="text-[8px] text-amber-700">For your safety, keep all communication within HunarWalaa.</p>
      </div>

      {/* Conversation List */}
      <div className="flex-1 overflow-y-auto scrollbar-none">
        {conversations.map(({ name, role, lastMsg, time, avatar, color, active, unread }, i) => (
          <div key={i} className={`flex items-center gap-3 px-4 py-3 border-b border-gray-50 ${active ? "bg-indigo-50/50" : ""}`}>
            <div className={`relative w-11 h-11 ${color} rounded-2xl flex items-center justify-center flex-shrink-0 shadow-sm`}>
              <span className="text-white font-extrabold">{avatar}</span>
              <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-white" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-0.5">
                <p className={`text-[12px] font-extrabold ${active ? "text-gray-900" : "text-gray-700"}`}>{name}</p>
                <span className="text-[8px] text-gray-400">{time}</span>
              </div>
              <p className="text-[9px] text-gray-400 truncate">{role}</p>
              <p className="text-[9px] text-gray-500 truncate">{lastMsg}</p>
            </div>
            {unread > 0 && (
              <div className="w-5 h-5 bg-indigo-600 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-[8px] text-white font-bold">{unread}</span>
              </div>
            )}
          </div>
        ))}

        {/* Active Chat Preview */}
        <div className="mx-3 mt-2 bg-white rounded-2xl border border-indigo-100 shadow-sm overflow-hidden mb-20">
          <div className="bg-indigo-600 px-3 py-2 flex items-center gap-2">
            <div className="w-7 h-7 bg-white/20 rounded-xl flex items-center justify-center">
              <span className="text-white font-extrabold text-xs">S</span>
            </div>
            <div className="flex-1">
              <p className="text-[11px] font-extrabold text-white">Sulaiman Khan</p>
              <div className="flex items-center gap-1">
                <div className="w-1.5 h-1.5 bg-green-400 rounded-full" />
                <span className="text-[8px] text-indigo-200">Online · Electrician</span>
              </div>
            </div>
            <Phone size={13} className="text-white/70" />
          </div>
          <div className="px-3 py-2.5 bg-gray-50 flex flex-col gap-2">
            {/* Received */}
            <div className="flex items-end gap-1.5">
              <div className="w-5 h-5 bg-indigo-600 rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-white text-[8px] font-bold">S</span>
              </div>
              <div className="bg-white rounded-2xl rounded-bl-sm px-2.5 py-1.5 max-w-[70%] shadow-sm border border-gray-100">
                <p className="text-[10px] text-gray-800">Sanga raxi na. Kawal ba dr sha?</p>
                <p className="text-[7px] text-gray-400 text-right mt-0.5">Sunday 10:12 AM</p>
              </div>
            </div>
            {/* Sent */}
            <div className="flex justify-end">
              <div className="bg-indigo-600 rounded-2xl rounded-br-sm px-2.5 py-1.5 max-w-[70%]">
                <p className="text-[10px] text-white">Sanga raxi na.</p>
                <p className="text-[7px] text-indigo-200 text-right mt-0.5">Sunday ✓✓</p>
              </div>
            </div>
            <div className="flex justify-end">
              <div className="bg-indigo-600 rounded-2xl rounded-br-sm px-2.5 py-1.5 max-w-[70%]">
                <p className="text-[10px] text-white">Kam xe</p>
                <p className="text-[7px] text-indigo-200 text-right mt-0.5">Sunday ✓✓</p>
              </div>
            </div>
          </div>
          <div className="px-3 py-2 flex items-center gap-2 border-t border-gray-100 bg-white">
            <div className="flex-1 bg-gray-100 rounded-xl px-3 py-1.5 flex items-center gap-1">
              <span className="text-[10px] text-gray-400 flex-1">Type a message...</span>
            </div>
            <button className="w-8 h-8 bg-indigo-600 rounded-xl flex items-center justify-center">
              <Send size={13} className="text-white" />
            </button>
          </div>
        </div>
      </div>

      <BottomNav active="chats" />
    </div>
  );
}

/* ─────────────────────────── WALLET SCREEN ─────────────────────────── */
function WalletScreen() {
  return (
    <div className="h-full bg-[#F8F9FB] overflow-y-auto scrollbar-none pb-20">
      {/* Hero */}
      <div className="bg-gradient-to-br from-indigo-600 via-indigo-700 to-violet-700 px-4 pt-2 pb-6 relative overflow-hidden">
        <div className="absolute -top-6 -right-6 w-28 h-28 bg-white/8 rounded-full" />
        <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-white/5 rounded-full" />
        <div className="flex items-start justify-between mb-4">
          <div>
            <p className="text-indigo-200 text-[8px] font-extrabold uppercase tracking-widest mb-0.5">Financial Overview</p>
            <h2 className="text-[15px] font-extrabold text-white leading-tight">My Wallet</h2>
            <p className="text-indigo-200/70 text-[9px]">Earnings, commissions & top-ups</p>
          </div>
          <button className="bg-white/20 border border-white/25 text-white text-[9px] font-extrabold px-2.5 py-1.5 rounded-xl flex items-center gap-1">
            <Plus size={10} />Top-Up
          </button>
        </div>
        <div className="flex gap-3">
          {[
            { val: "979.04",   label: "BALANCE (PKR)"   },
            { val: "2,000",    label: "TOTAL TOPPED UP" },
            { val: "1,020",    label: "COMMISSION PAID" },
          ].map(({ val, label }) => (
            <div key={label} className="flex-1">
              <p className="text-white font-extrabold text-[14px] leading-tight tabular-nums">{val}</p>
              <p className="text-indigo-200/70 text-[7px] font-bold tracking-wide uppercase leading-tight mt-0.5">{label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Balance Cards */}
      <div className="px-4 -mt-3 flex gap-2 mb-3">
        <div className="flex-1 bg-white rounded-2xl p-3 border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-1">
            <p className="text-[7px] text-gray-400 font-bold uppercase tracking-wide">Spendable</p>
            <span className="text-[7px] bg-green-50 text-green-600 font-extrabold px-1.5 py-0.5 rounded-full border border-green-100">Available</span>
          </div>
          <p className="text-[17px] font-extrabold text-gray-900 leading-tight tabular-nums">979.04</p>
          <p className="text-[8px] text-gray-400 font-semibold">PKR</p>
        </div>
        <div className="flex-1 bg-white rounded-2xl p-3 border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-1">
            <p className="text-[7px] text-gray-400 font-bold uppercase tracking-wide">Pending</p>
            <span className="text-[7px] bg-amber-50 text-amber-600 font-extrabold px-1.5 py-0.5 rounded-full border border-amber-100">Soon</span>
          </div>
          <p className="text-[17px] font-extrabold text-gray-900 leading-tight tabular-nums">222</p>
          <p className="text-[8px] text-gray-400 font-semibold">PKR</p>
        </div>
      </div>

      {/* Quick Top-Up */}
      <div className="px-4 mb-3">
        <p className="text-[9px] font-extrabold text-gray-500 uppercase tracking-widest mb-2">Quick Top-Up</p>
        <div className="grid grid-cols-4 gap-1.5">
          {["500","1,000","2,000","5,000"].map((amount) => (
            <button key={amount} className="bg-white rounded-xl border border-gray-200 py-2 text-center shadow-sm hover:border-indigo-300">
              <p className="text-[10px] font-extrabold text-gray-900">Rs.</p>
              <p className="text-[10px] font-extrabold text-indigo-600">{amount}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Policy */}
      <div className="px-4 mb-3">
        <div className="bg-white rounded-2xl p-3 border border-gray-100 shadow-sm">
          <h3 className="text-[11px] font-extrabold text-gray-900 mb-2">Wallet Policy</h3>
          {[
            { icon: "%", bg: "bg-indigo-50 text-indigo-600",  text: "An 8% commission is deducted from every settled booking." },
            { icon: "✓", bg: "bg-green-50 text-green-600",    text: "Maintain at least Rs. 200 to keep receiving job requests." },
            { icon: "!",  bg: "bg-red-50 text-red-500",        text: "Cancellations may incur a Rs. 75 penalty deduction."      },
          ].map(({ icon, bg, text }) => (
            <div key={text} className="flex items-start gap-2 mb-2 last:mb-0">
              <span className={`w-5 h-5 rounded-lg flex items-center justify-center text-[9px] font-extrabold flex-shrink-0 mt-0.5 ${bg}`}>{icon}</span>
              <p className="text-[9px] text-gray-600 leading-relaxed">{text}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Ledger */}
      <div className="px-4 mb-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-[11px] font-extrabold text-gray-900">Transaction Ledger</h3>
          <span className="text-[8px] text-gray-400">Last 30 days</span>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="flex text-[7px] text-gray-400 font-bold uppercase px-3 py-2 bg-gray-50 border-b border-gray-100">
            <span className="flex-1">Transaction</span>
            <span className="w-20">Reference</span>
            <span className="w-16 text-right">Amount</span>
          </div>
          {[
            { type: "Commission", date: "May 31 · 5:42 PM",  ref: "Job #3eff4",  amount: "−120 PKR",   positive: false },
            { type: "Commission", date: "May 29 · 10:00 AM", ref: "Job #4d5d6",  amount: "−160 PKR",   positive: false },
            { type: "Commission", date: "May 26 · 6:38 PM",  ref: "Job #6e8a0",  amount: "−16 PKR",    positive: false },
            { type: "Commission", date: "May 17 · 11:17 PM", ref: "Job #b8909",  amount: "−160 PKR",   positive: false },
            { type: "Top-Up",     date: "May 3 · 2:23 PM",   ref: "TXN-184836", amount: "+2,000 PKR",  positive: true  },
          ].map(({ type, date, ref, amount, positive }, i) => (
            <div key={i} className="flex items-center px-3 py-2.5 border-b border-gray-50 last:border-0">
              <div className="flex-1 min-w-0 flex items-center gap-2">
                <div className={`w-7 h-7 ${positive ? "bg-green-50" : "bg-red-50"} rounded-xl flex items-center justify-center flex-shrink-0`}>
                  {positive
                    ? <TrendingUp size={12} className="text-green-500" />
                    : <Package size={12} className="text-red-400" />
                  }
                </div>
                <div>
                  <p className="text-[10px] font-bold text-gray-900">{type}</p>
                  <p className="text-[8px] text-gray-400">{date}</p>
                </div>
              </div>
              <span className="w-20 text-[8px] text-indigo-600 font-semibold truncate">{ref}</span>
              <span className={`w-16 text-right text-[10px] font-extrabold tabular-nums ${positive ? "text-green-600" : "text-red-500"}`}>{amount}</span>
            </div>
          ))}
        </div>
      </div>

      <BottomNav active="wallet" />
    </div>
  );
}

/* ─────────────────────────── NOTIFICATIONS SCREEN ─────────────────────────── */
function NotificationsScreen() {
  const notifications = [
    { icon: BookOpen,      color: "bg-indigo-50 text-indigo-600",  title: "New Job Request",           body: "Kamran Ali requested your service for Wiring Installation.", time: "2 min ago",  unread: true  },
    { icon: Wallet,        color: "bg-green-50 text-green-600",    title: "Payment Received",          body: "Rs. 1,500 settled for Job #4d5d6. Your balance: 979 PKR.",  time: "1 hr ago",   unread: true  },
    { icon: Star,          color: "bg-amber-50 text-amber-600",    title: "New Review",                body: "Faisal Ahmed gave you 5★ — \"Excellent service, very professional!\"", time: "3 hrs ago",  unread: false },
    { icon: CheckCircle,   color: "bg-blue-50 text-blue-600",      title: "Booking Confirmed",         body: "Your booking with Tahir Khan on 30 May has been confirmed.", time: "Yesterday",  unread: false },
    { icon: AlertCircle,   color: "bg-red-50 text-red-500",        title: "Low Wallet Balance",        body: "Balance below Rs. 300. Top up to keep receiving job requests.", time: "2 days ago", unread: false },
    { icon: Award,         color: "bg-purple-50 text-purple-600",  title: "Profile Milestone",         body: "Congrats! You completed 10 jobs. Keep up the great work 🎉",  time: "3 days ago", unread: false },
  ];

  return (
    <div className="h-full bg-[#F8F9FB] overflow-y-auto scrollbar-none pb-8">
      <div className="bg-white px-4 pt-2 pb-3 sticky top-0 z-10 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <h2 className="text-[14px] font-extrabold text-gray-900">Notifications</h2>
          <button className="text-[10px] text-indigo-600 font-bold">Mark all read</button>
        </div>
        <div className="flex gap-2 mt-2 overflow-x-auto scrollbar-none">
          {[["All","bg-gray-900 text-white"],["Jobs","bg-white text-gray-600 border border-gray-200"],["Payments","bg-white text-gray-600 border border-gray-200"],["System","bg-white text-gray-600 border border-gray-200"]].map(([label, cls]) => (
            <button key={label} className={`flex-shrink-0 text-[9px] font-bold px-3 py-1 rounded-full ${cls}`}>{label}</button>
          ))}
        </div>
      </div>

      <div className="px-4 pt-3 flex flex-col gap-2">
        {notifications.map(({ icon: Icon, color, title, body, time, unread }, i) => (
          <div key={i} className={`flex gap-3 bg-white rounded-2xl p-3 border shadow-sm ${unread ? "border-indigo-100 bg-indigo-50/30" : "border-gray-100"}`}>
            <div className={`w-10 h-10 ${color} rounded-xl flex items-center justify-center flex-shrink-0`}>
              <Icon size={17} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5 mb-0.5">
                <p className="text-[11px] font-extrabold text-gray-900 flex-1">{title}</p>
                {unread && <div className="w-2 h-2 bg-indigo-600 rounded-full flex-shrink-0" />}
              </div>
              <p className="text-[9px] text-gray-500 leading-relaxed mb-1">{body}</p>
              <p className="text-[8px] text-gray-400 font-medium">{time}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─────────────────────────── BOOKING DETAIL SCREEN ─────────────────────────── */
function BookingDetailScreen() {
  return (
    <div className="h-full bg-[#F8F9FB] overflow-y-auto scrollbar-none pb-8">
      {/* Header */}
      <div className="bg-white px-4 pt-2 pb-3 border-b border-gray-100 sticky top-0 z-10">
        <div className="flex items-center gap-2 mb-1">
          <button className="w-7 h-7 bg-gray-100 rounded-xl flex items-center justify-center">
            <ArrowLeft size={13} className="text-gray-700" />
          </button>
          <div className="flex-1">
            <p className="text-[9px] text-gray-400 font-semibold uppercase tracking-wide">Booking Details</p>
            <p className="text-[12px] font-extrabold text-gray-900">Job #3eff4</p>
          </div>
          <span className="bg-green-50 text-green-700 text-[9px] font-extrabold px-2.5 py-1 rounded-full border border-green-100">SETTLED</span>
        </div>
      </div>

      <div className="px-4 py-3 flex flex-col gap-3">
        {/* Helper Card */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-3">
          <p className="text-[9px] text-gray-400 font-extrabold uppercase tracking-wide mb-2">Service Provider</p>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-indigo-700 rounded-2xl flex items-center justify-center flex-shrink-0">
              <span className="text-white font-extrabold text-xl">S</span>
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-1">
                <p className="text-[13px] font-extrabold text-gray-900">Sulaiman Khan</p>
                <CheckCircle size={11} className="text-indigo-500" />
              </div>
              <p className="text-[9px] text-indigo-600 font-semibold">Electrician · Mardan, KPK</p>
              <div className="flex items-center gap-0.5 mt-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} size={8} className={i < 4 ? "text-amber-400 fill-amber-400" : "text-gray-200 fill-gray-200"} />
                ))}
                <span className="text-[9px] font-bold text-gray-700 ml-0.5">4.1</span>
              </div>
            </div>
            <button className="w-9 h-9 bg-indigo-50 rounded-xl flex items-center justify-center border border-indigo-100">
              <MessageCircle size={14} className="text-indigo-600" />
            </button>
          </div>
        </div>

        {/* Progress */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-3">
          <p className="text-[9px] text-gray-400 font-extrabold uppercase tracking-wide mb-3">Job Progress</p>
          <div className="flex items-start gap-0">
            {[
              { step: "Requested", done: true  },
              { step: "Accepted",  done: true  },
              { step: "In Progress", done: true },
              { step: "Completed", done: true  },
              { step: "Settled",   done: true  },
            ].map(({ step, done }, si) => (
              <div key={step} className="flex items-center flex-1">
                <div className="flex flex-col items-center">
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center ${done ? "bg-green-500" : "bg-gray-200"}`}>
                    <Check size={10} className={done ? "text-white" : "text-gray-400"} />
                  </div>
                  <span className="text-[6px] text-gray-500 text-center mt-0.5" style={{ width: 36, lineHeight: 1.3 }}>{step}</span>
                </div>
                {si < 4 && <div className={`flex-1 h-[1.5px] mb-3.5 ${done ? "bg-green-500" : "bg-gray-200"}`} />}
              </div>
            ))}
          </div>
        </div>

        {/* Service Details */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-3">
          <p className="text-[9px] text-gray-400 font-extrabold uppercase tracking-wide mb-2">Service Details</p>
          {[
            ["Service",  "Breaker Repair"],
            ["Date",     "29 May 2026, 7:26 PM"],
            ["Duration", "2.5 Hours"],
            ["Location", "Islamabad, Punjab"],
            ["Pricing",  "Daily Rate"],
          ].map(([label, value]) => (
            <div key={label} className="flex justify-between py-1.5 border-b border-gray-50 last:border-0">
              <span className="text-[9px] text-gray-400">{label}</span>
              <span className="text-[9px] font-bold text-gray-900">{value}</span>
            </div>
          ))}
        </div>

        {/* Payment Summary */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-3">
          <p className="text-[9px] text-gray-400 font-extrabold uppercase tracking-wide mb-2">Payment Summary</p>
          {[
            ["Service Charge", "Rs. 200"],
            ["Platform Fee (8%)", "−Rs. 16"],
          ].map(([label, value]) => (
            <div key={label} className="flex justify-between py-1 border-b border-gray-50 last:border-0">
              <span className="text-[9px] text-gray-500">{label}</span>
              <span className="text-[9px] font-bold text-gray-900">{value}</span>
            </div>
          ))}
          <div className="flex justify-between pt-2 mt-1 border-t border-gray-100">
            <span className="text-[11px] font-extrabold text-gray-900">Net Earned</span>
            <span className="text-[11px] font-extrabold text-green-600">Rs. 184</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <button className="flex-1 bg-indigo-50 border border-indigo-100 text-indigo-700 text-[10px] font-extrabold py-2.5 rounded-xl flex items-center justify-center gap-1">
            <ThumbsUp size={12} />Rate Helper
          </button>
          <button className="flex-1 bg-gray-100 text-gray-700 text-[10px] font-extrabold py-2.5 rounded-xl flex items-center justify-center gap-1">
            <BookOpen size={12} />Book Again
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────── SPLASH SCREEN ─────────────────────────── */
function SplashScreen() {
  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-indigo-700 via-indigo-600 to-violet-700 relative overflow-hidden">
      <div className="absolute -top-16 -right-16 w-56 h-56 bg-white/5 rounded-full" />
      <div className="absolute -bottom-20 -left-20 w-72 h-72 bg-white/5 rounded-full" />
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-violet-500/10 rounded-full" />

      <div className="flex justify-center pt-12 flex-shrink-0">
        <div className="bg-white/15 border border-white/20 px-4 py-1.5 rounded-full flex items-center gap-1.5">
          <Sparkles size={10} className="text-amber-300" />
          <span className="text-white text-[10px] font-bold tracking-widest uppercase">Pakistan&apos;s #1 Service App</span>
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-6">
        <div className="relative mb-6">
          <div className="absolute inset-0 bg-white/15 rounded-3xl blur-xl scale-125" />
          <div className="relative w-24 h-24 bg-white rounded-3xl flex items-center justify-center shadow-2xl shadow-indigo-900/50">
            <div className="w-16 h-16 bg-gradient-to-br from-indigo-600 to-violet-600 rounded-2xl flex items-center justify-center">
              <span className="text-white font-extrabold text-3xl tracking-tight">H</span>
            </div>
          </div>
        </div>

        <div className="text-white font-extrabold text-3xl tracking-tight mb-1">
          HunarWalaa<span className="text-amber-300">.</span>
        </div>
        <p className="text-indigo-200 text-[12px] text-center mb-8">
          Pakistan&apos;s trusted service marketplace
        </p>

        <div className="flex gap-5 mb-8">
          {[["1,200+","Verified Pros"],["4.8★","Avg Rating"],["300+","Cities"]].map(([val, lbl]) => (
            <div key={lbl} className="text-center">
              <p className="text-white font-extrabold text-[15px]">{val}</p>
              <p className="text-indigo-200/70 text-[9px]">{lbl}</p>
            </div>
          ))}
        </div>

        <div className="flex gap-2 mb-8">
          {[
            { icon: Zap,      label: "Electric",  bg: "bg-amber-400/20",  text: "text-amber-200"  },
            { icon: Droplets, label: "Plumbing",  bg: "bg-blue-400/20",   text: "text-blue-200"   },
            { icon: Hammer,   label: "Carpentry", bg: "bg-orange-400/20", text: "text-orange-200" },
            { icon: Wrench,   label: "AC Repair", bg: "bg-cyan-400/20",   text: "text-cyan-200"   },
          ].map(({ icon: Icon, label, bg, text }) => (
            <div key={label} className={`flex flex-col items-center gap-1 ${bg} px-3 py-2 rounded-2xl`}>
              <Icon size={14} className={text} />
              <span className={`text-[8px] font-bold ${text}`}>{label}</span>
            </div>
          ))}
        </div>

        <div className="w-full flex flex-col gap-2.5 px-2">
          <button className="w-full bg-white text-indigo-700 font-extrabold py-3.5 rounded-2xl text-[13px] flex items-center justify-center gap-2 shadow-lg shadow-indigo-900/30">
            Find a Professional <ArrowRight size={15} />
          </button>
          <button className="w-full bg-white/15 border border-white/25 text-white font-extrabold py-3 rounded-2xl text-[13px]">
            Offer Your Skills
          </button>
        </div>
      </div>

      <div className="flex-shrink-0 pb-8 px-6">
        <p className="text-center text-indigo-200/60 text-[10px]">
          Already have an account?{" "}
          <span className="text-white font-bold underline">Sign In</span>
        </p>
      </div>
    </div>
  );
}

/* ─────────────────────────── LOGIN SCREEN ─────────────────────────── */
function LoginScreen() {
  return (
    <div className="h-full flex flex-col bg-gradient-to-b from-indigo-50 to-white overflow-y-auto scrollbar-none">
      <div className="flex flex-col items-center pt-8 pb-5 px-6 flex-shrink-0">
        <div className="w-14 h-14 bg-gradient-to-br from-indigo-600 to-violet-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-300/50 mb-3">
          <span className="text-white font-extrabold text-2xl">H</span>
        </div>
        <h2 className="text-[17px] font-extrabold text-indigo-700 tracking-tight">
          HunarWalaa<span className="text-amber-500">.</span>
        </h2>
        <p className="text-[10px] text-gray-400">Pakistan&apos;s trusted service marketplace</p>
      </div>

      <div className="mx-4 flex-shrink-0">
        <div className="bg-white rounded-3xl border border-gray-100 shadow-xl shadow-indigo-100/60 p-5">
          <h3 className="text-[16px] font-extrabold text-gray-900 mb-0.5">Welcome back</h3>
          <p className="text-[11px] text-gray-400 mb-5">Sign in to continue to your account</p>

          <div className="mb-3">
            <label className="text-[10px] font-bold text-gray-700 mb-1 block">Email Address</label>
            <div className="bg-gray-50 border border-gray-200 rounded-2xl flex items-center gap-2.5 px-3 py-2.5">
              <Mail size={14} className="text-gray-400 flex-shrink-0" />
              <span className="text-[11px] text-gray-400 flex-1">sulaiman.khan@example.com</span>
            </div>
          </div>

          <div className="mb-3">
            <div className="flex items-center justify-between mb-1">
              <label className="text-[10px] font-bold text-gray-700">Password</label>
              <button className="text-[10px] text-indigo-600 font-bold">Forgot?</button>
            </div>
            <div className="bg-gray-50 border border-gray-200 rounded-2xl flex items-center gap-2.5 px-3 py-2.5">
              <Lock size={14} className="text-gray-400 flex-shrink-0" />
              <span className="text-[11px] text-gray-400 flex-1 tracking-widest">••••••••</span>
              <Eye size={14} className="text-gray-400 flex-shrink-0" />
            </div>
          </div>

          <div className="flex items-center gap-2 mb-5">
            <div className="w-4 h-4 border-2 border-indigo-600 rounded-md flex items-center justify-center bg-indigo-600">
              <CheckSquare size={10} className="text-white" />
            </div>
            <span className="text-[10px] text-gray-600">Keep me signed in</span>
          </div>

          <button className="w-full bg-indigo-600 text-white font-extrabold py-3 rounded-2xl text-[13px] shadow-lg shadow-indigo-300/50 flex items-center justify-center gap-2">
            Sign In <ArrowRight size={15} />
          </button>

          <p className="text-center text-[11px] text-gray-400 mt-4">
            No account?{" "}
            <span className="text-indigo-600 font-bold">Create one →</span>
          </p>
        </div>
      </div>

      <div className="flex justify-center gap-5 mt-5 px-4 flex-shrink-0 pb-4">
        {[
          { icon: CheckCircle, label: "Verified Pros",  color: "text-indigo-500" },
          { icon: Star,        label: "4.8★ Rated",     color: "text-amber-500"  },
          { icon: Users,       label: "1,200+ Pros",    color: "text-indigo-500" },
        ].map(({ icon: Icon, label, color }) => (
          <div key={label} className="flex items-center gap-1">
            <Icon size={11} className={color} />
            <span className="text-[9px] text-gray-500 font-medium">{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─────────────────────────── REGISTER SCREEN ─────────────────────────── */
function RegisterScreen() {
  return (
    <div className="h-full flex flex-col bg-gradient-to-b from-indigo-50 to-white overflow-y-auto scrollbar-none">
      <div className="flex flex-col items-center pt-6 pb-3 px-6 flex-shrink-0">
        <div className="w-11 h-11 bg-gradient-to-br from-indigo-600 to-violet-600 rounded-xl flex items-center justify-center shadow-md shadow-indigo-300/40 mb-2">
          <span className="text-white font-extrabold text-lg">H</span>
        </div>
        <h2 className="text-[15px] font-extrabold text-indigo-700">
          HunarWalaa<span className="text-amber-500">.</span>
        </h2>
        <p className="text-[9px] text-gray-400">Join Pakistan&apos;s service marketplace</p>
      </div>

      <div className="mx-4 flex-shrink-0">
        <div className="bg-white rounded-3xl border border-gray-100 shadow-xl shadow-indigo-100/60 p-4">
          <h3 className="text-[15px] font-extrabold text-gray-900 mb-0.5">Create Account</h3>
          <p className="text-[10px] text-gray-400 mb-4">Join thousands of users across Pakistan</p>

          <div className="mb-3.5">
            <p className="text-[10px] font-bold text-gray-700 mb-1.5">I am a...</p>
            <div className="flex bg-gray-100 rounded-xl p-1 gap-1">
              <button className="flex-1 py-2 bg-indigo-600 text-white rounded-lg text-[10px] font-extrabold flex items-center justify-center gap-1 shadow-sm">
                <User size={11} />Client
              </button>
              <button className="flex-1 py-2 text-gray-400 rounded-lg text-[10px] font-bold flex items-center justify-center gap-1">
                <Wrench size={11} />Helper
              </button>
            </div>
          </div>

          {[
            { label: "Full Name",     placeholder: "Sulaiman Khan",    icon: User,  type: "text" },
            { label: "Email Address", placeholder: "you@example.com",  icon: Mail,  type: "email" },
            { label: "Phone Number",  placeholder: "+92 3XX XXXXXXX",  icon: Phone, type: "tel"   },
          ].map(({ label, placeholder, icon: Icon }) => (
            <div key={label} className="mb-2.5">
              <label className="text-[10px] font-bold text-gray-700 mb-1 block">{label}</label>
              <div className="bg-gray-50 border border-gray-200 rounded-2xl flex items-center gap-2 px-3 py-2.5">
                <Icon size={13} className="text-gray-400 flex-shrink-0" />
                <span className="text-[11px] text-gray-400">{placeholder}</span>
              </div>
            </div>
          ))}

          <div className="mb-4">
            <label className="text-[10px] font-bold text-gray-700 mb-1 block">Password</label>
            <div className="bg-gray-50 border border-gray-200 rounded-2xl flex items-center gap-2 px-3 py-2.5">
              <Lock size={13} className="text-gray-400 flex-shrink-0" />
              <span className="text-[11px] text-gray-400 flex-1 tracking-widest">••••••••</span>
              <EyeOff size={13} className="text-gray-400 flex-shrink-0" />
            </div>
          </div>

          <button className="w-full bg-indigo-600 text-white font-extrabold py-3 rounded-2xl text-[12px] shadow-lg shadow-indigo-300/50 flex items-center justify-center gap-2 mb-3">
            Join HunarWalaa <ArrowRight size={14} />
          </button>

          <p className="text-center text-[10px] text-gray-400">
            Already have an account?{" "}
            <span className="text-indigo-600 font-bold">Sign In</span>
          </p>
        </div>
      </div>

      <div className="flex justify-center gap-4 mt-3 px-4 flex-shrink-0 pb-4">
        {[
          { icon: CheckCircle, text: "Free to join"      },
          { icon: Shield,      text: "Secure & verified" },
          { icon: Star,        text: "4.8★ avg rating"   },
        ].map(({ icon: Icon, text }) => (
          <div key={text} className="flex items-center gap-1">
            <Icon size={10} className="text-indigo-500" />
            <span className="text-[9px] text-gray-400">{text}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─────────────────────────── ACCOUNT SCREEN ─────────────────────────── */
function AccountScreen() {
  return (
    <div className="h-full bg-[#F8F9FB] overflow-y-auto scrollbar-none pb-4">
      {/* Hero */}
      <div className="bg-gradient-to-br from-indigo-600 to-violet-700 px-4 pt-3 pb-14 relative overflow-hidden">
        <div className="absolute -top-4 -right-4 w-28 h-28 bg-white/8 rounded-full" />
        <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-white/5 rounded-full" />
        <div className="flex items-center justify-between mb-4">
          <p className="text-indigo-200 text-[9px] font-bold uppercase tracking-widest">My Account</p>
          <button className="w-8 h-8 bg-white/15 rounded-xl flex items-center justify-center border border-white/20">
            <Settings size={14} className="text-white" />
          </button>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-900/30">
              <div className="w-14 h-14 bg-gradient-to-br from-indigo-400 to-indigo-700 rounded-xl flex items-center justify-center">
                <span className="text-white font-extrabold text-2xl">S</span>
              </div>
            </div>
            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-400 rounded-full border-2 border-white flex items-center justify-center">
              <Check size={9} className="text-white" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1.5 mb-0.5">
              <h2 className="text-white font-extrabold text-[16px]">Sulaiman Khan</h2>
              <CheckCircle size={13} className="text-indigo-300" />
            </div>
            <p className="text-indigo-200 text-[9px]">sulaiman.khan@sarmaaya.pk</p>
            <div className="flex items-center gap-1.5 mt-1">
              <span className="bg-green-400/25 text-green-200 text-[8px] font-bold px-2 py-0.5 rounded-full border border-green-300/30">Available</span>
              <span className="bg-white/15 text-white text-[8px] font-bold px-2 py-0.5 rounded-full">Approved ✓</span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Strip */}
      <div className="mx-4 -mt-7 bg-white rounded-2xl border border-gray-100 shadow-md p-3 mb-3 relative z-10">
        <div className="flex divide-x divide-gray-100">
          {[["11","Jobs"],["4.1★","Rating"],["979 PKR","Wallet"],["2 Yrs","Exp"]].map(([val, lbl]) => (
            <div key={lbl} className="flex-1 text-center px-1">
              <p className="text-[12px] font-extrabold text-gray-900">{val}</p>
              <p className="text-[8px] text-gray-400">{lbl}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Profile Completion */}
      <div className="mx-4 mb-3 bg-white rounded-2xl border border-gray-100 shadow-sm p-3">
        <div className="flex items-center justify-between mb-1.5">
          <p className="text-[10px] font-extrabold text-gray-900">Profile Completion</p>
          <span className="text-[10px] font-extrabold text-indigo-600">72%</span>
        </div>
        <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full" style={{ width: "72%" }} />
        </div>
        <p className="text-[8px] text-gray-400 mt-1">Add portfolio photos to reach 100%</p>
      </div>

      {/* Main Menu */}
      <div className="mx-4 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-3">
        {[
          { icon: User,      label: "Edit Profile",     sub: "Update your info & photo",         color: "bg-indigo-50 text-indigo-600"   },
          { icon: Wrench,    label: "My Services",      sub: "Manage your service offerings",    color: "bg-orange-50 text-orange-600"   },
          { icon: BookOpen,  label: "My Bookings",      sub: "View job history & active jobs",   color: "bg-sky-50 text-sky-600"         },
          { icon: Wallet,    label: "Wallet",           sub: "Balance, top-up & transactions",   color: "bg-emerald-50 text-emerald-600" },
          { icon: Star,      label: "My Reviews",       sub: "4.1★ · 7 reviews received",        color: "bg-amber-50 text-amber-600"     },
          { icon: Bell,      label: "Notifications",    sub: "Job alerts & app updates",         color: "bg-purple-50 text-purple-600"   },
        ].map(({ icon: Icon, label, sub, color }, i, arr) => (
          <button key={label} className={`w-full flex items-center gap-3 px-4 py-3 ${i < arr.length - 1 ? "border-b border-gray-50" : ""}`}>
            <div className={`w-9 h-9 ${color} rounded-xl flex items-center justify-center flex-shrink-0`}>
              <Icon size={15} />
            </div>
            <div className="flex-1 text-left">
              <p className="text-[12px] font-extrabold text-gray-900">{label}</p>
              <p className="text-[8px] text-gray-400">{sub}</p>
            </div>
            <ChevronRight size={14} className="text-gray-300" />
          </button>
        ))}
      </div>

      {/* Support */}
      <div className="mx-4 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-3">
        {[
          { icon: CheckCircle, label: "Help & Support", sub: "FAQs, contact & live chat" },
          { icon: Shield,      label: "Privacy Policy", sub: "How we handle your data"   },
        ].map(({ icon: Icon, label, sub }, i) => (
          <button key={label} className={`w-full flex items-center gap-3 px-4 py-3 ${i === 0 ? "border-b border-gray-50" : ""}`}>
            <div className="w-9 h-9 bg-gray-50 rounded-xl flex items-center justify-center flex-shrink-0">
              <Icon size={15} className="text-gray-500" />
            </div>
            <div className="flex-1 text-left">
              <p className="text-[12px] font-extrabold text-gray-900">{label}</p>
              <p className="text-[8px] text-gray-400">{sub}</p>
            </div>
            <ChevronRight size={14} className="text-gray-300" />
          </button>
        ))}
      </div>

      {/* Logout */}
      <div className="mx-4">
        <button className="w-full bg-red-50 border border-red-100 text-red-600 font-extrabold py-3.5 rounded-2xl text-[13px] flex items-center justify-center gap-2">
          <LogOut size={15} />Logout
        </button>
        <p className="text-center text-[8px] text-gray-300 mt-2">HunarWalaa v1.0.0 · sulaiman.khan@sarmaaya.pk</p>
      </div>
    </div>
  );
}

/* ─────────────────────────── MAIN PAGE ─────────────────────────── */
export default function MobileMockupPage() {
  const screens = [
    { id: "splash",       title: "Splash Screen",    component: <SplashScreen />         },
    { id: "login",        title: "Login",            component: <LoginScreen />           },
    { id: "register",     title: "Register",         component: <RegisterScreen />        },
    { id: "home",         title: "Home",             component: <HomeScreen />            },
    { id: "search",       title: "Services",         component: <SearchScreen />          },
    { id: "profile",      title: "Helper Profile",   component: <HelperProfileScreen />   },
    { id: "bookings",     title: "My Bookings",      component: <BookingsScreen />        },
    { id: "chat",         title: "Messages",         component: <ChatScreen />            },
    { id: "wallet",       title: "Wallet",           component: <WalletScreen />          },
    { id: "notifs",       title: "Notifications",    component: <NotificationsScreen />   },
    { id: "booking-detail", title: "Booking Detail", component: <BookingDetailScreen />   },
    { id: "account",      title: "Account",          component: <AccountScreen />         },
  ];

  return (
    <div
      className="min-h-screen"
      style={{ background: "radial-gradient(140% 100% at 50% 0%, #F8F9F6 0%, #E2E5DC 100%)" }}
    >
      {/* Page Header */}
      <div className="text-center pt-14 pb-10 px-6">
        <div className="inline-flex items-center gap-2 bg-[#012C3F]/8 text-[#012C3F] px-5 py-2 rounded-full text-[11px] font-bold mb-5 border border-[#012C3F]/10 tracking-widest uppercase">
          HunarWalaa · Mobile UI
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold text-[#0D0D0D] mb-4 tracking-tight">
          App Mockup Designs
        </h1>
        <p className="text-[#525252] text-base max-w-lg mx-auto leading-relaxed">
          12 screens — splash, auth, and all core app flows based on the live HunarWalaa app.
        </p>
      </div>

      {/* Phone Grid */}
      <div className="flex flex-wrap justify-center gap-10 max-w-7xl mx-auto px-6 pb-16">
        {screens.map(({ id, title, component }) => (
          <PhoneFrame key={id} title={title}>
            {component}
          </PhoneFrame>
        ))}
      </div>

      {/* Design System */}
      <div className="max-w-4xl mx-auto px-6 pb-20">
        <h2 className="text-xl font-extrabold text-[#0D0D0D] mb-6 text-center tracking-tight">Design System</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Primary",    swatch: "bg-indigo-600",  hex: "#4F46E5", note: "CTAs, Nav, Badges"  },
            { label: "Secondary",  swatch: "bg-amber-400",   hex: "#FBBF24", note: "Rate Helper, Stars" },
            { label: "Success",    swatch: "bg-green-500",   hex: "#22C55E", note: "SETTLED, Approved"  },
            { label: "Danger",     swatch: "bg-red-500",     hex: "#EF4444", note: "EXPIRED, Penalties" },
          ].map(({ label, swatch, hex, note }) => (
            <div key={label} className="bg-white rounded-2xl p-4 text-center border border-[#E4E5E1] shadow-sm">
              <div className={`w-12 h-12 ${swatch} rounded-xl mx-auto mb-3 shadow-md`} />
              <p className="text-[#0D0D0D] font-bold text-sm">{label}</p>
              <p className="text-[#525252] text-xs">{hex}</p>
              <p className="text-[#A3A3A3] text-[10px] mt-1">{note}</p>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-3xl p-6 border border-[#E4E5E1] shadow-sm">
          <h3 className="text-[#012C3F] font-bold text-sm mb-4 tracking-widest uppercase">Patterns Matching Live App</h3>
          <div className="grid grid-cols-2 gap-3 text-[11px]">
            {[
              "Realistic phone frame with dynamic island & home indicator",
              "Dark pill bottom nav bar (inspired by finance app UI)",
              "Warm grey page background — professional design handoff look",
              "SETTLED / ONGOING / EXPIRED booking status badges",
              "Booking progress stepper (Requested → Settled)",
              "979.04 PKR wallet balance with transaction ledger",
              "8% commission policy & quick top-up chips",
              "Sulaiman Khan helper profile with real reviews",
              "Working hours Mon–Sun grid (Friday = Off)",
              "Notifications screen with unread indicators",
              "Booking detail screen with full payment summary",
              "Near Me map with animated user location dot",
            ].map((item) => (
              <div key={item} className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full mt-1.5 flex-shrink-0" />
                <span className="text-[#525252]">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
