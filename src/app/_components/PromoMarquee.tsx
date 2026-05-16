import Link from 'next/link';

const ITEMS = [
  '🎉 New Professional? Register today & get FREE Rs. 2,000 wallet credit — Start earning from day one!',
  '⚡ Clients are searching for your skill right now — Join HunarWalaa & get found instantly',
  '💼 New Professional? Get Rs. 2,000 FREE wallet credit added to your account — valid for your first 3 months',
  '🚀 No upfront cost — Your Rs. 2,000 free credit covers your first bookings automatically',
  '✅ 300+ cities across Pakistan — Verified Professionals are earning more every day',
  '🔥 Join HunarWalaa now — Get clients, get paid, grow your business',
];

export default function PromoMarquee() {
  const repeated = [...ITEMS, ...ITEMS];

  return (
    <div className="text-indigo-900 py-2.5 overflow-hidden relative" style={{ background: '#e4e8ff' }}>
      <style>{`
        @keyframes marquee-scroll {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .marquee-track {
          display: flex;
          width: max-content;
          animation: marquee-scroll 40s linear infinite;
        }
        .marquee-track:hover {
          animation-play-state: paused;
        }
      `}</style>

      {/* Edge fades */}
      <div className="absolute left-0 top-0 bottom-0 w-16 z-10 pointer-events-none" style={{ background: 'linear-gradient(to right, #e4e8ff, transparent)' }} />
      <div className="absolute right-0 top-0 bottom-0 w-16 z-10 pointer-events-none" style={{ background: 'linear-gradient(to left, #e4e8ff, transparent)' }} />

      <div className="marquee-track">
        {repeated.map((item, i) => (
          <span key={i} className="flex items-center whitespace-nowrap text-sm font-medium px-8">
            {item}
            <span className="ml-8 text-indigo-300">•</span>
          </span>
        ))}
      </div>

      {/* Sticky CTA on the right */}
      <div className="absolute right-0 top-0 bottom-0 flex items-center z-20 pr-3 pl-16" style={{ background: 'linear-gradient(to left, #e4e8ff 60%, transparent)' }}>
        <Link
          href="/register?type=helper"
          className="text-xs font-black bg-indigo-600 text-white px-3 py-1.5 rounded-full hover:bg-indigo-700 transition-colors whitespace-nowrap shadow-lg"
        >
          Register Free →
        </Link>
      </div>
    </div>
  );
}
