import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';
import { MapPin, Star, BadgeCheck, ArrowRight, ShieldCheck, Clock } from 'lucide-react';
import { CITIES, SKILLS } from '../_data/locations';

export const revalidate = 3600;

const API_BASE = (process.env.NEXT_PUBLIC_API_URL ?? 'https://api.hunarwalaa.com').replace(/\/api$/, '');

async function fetchTopHelpers(city: string) {
  try {
    const res = await fetch(`${API_BASE}/users/top-rated?city=${encodeURIComponent(city)}&limit=6`);
    if (!res.ok) return [];
    const json = await res.json();
    return json?.data?.items ?? json?.items ?? [];
  } catch {
    return [];
  }
}

export function generateStaticParams() {
  return Object.keys(CITIES).map((city) => ({ city }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ city: string }>;
}): Promise<Metadata> {
  const { city } = await params;
  const cityName = CITIES[city];
  if (!cityName) return { title: 'Not Found' };

  return {
    title: `Home Services in ${cityName} | HunarWalaa — Verified Professionals`,
    description: `Book trusted plumbers, electricians, cleaners, AC technicians and 20+ skilled professionals in ${cityName}. Verified, affordable & available today on HunarWalaa.`,
    keywords: [
      `services in ${cityName}`,
      `home services ${cityName}`,
      `plumber in ${cityName}`,
      `electrician in ${cityName}`,
      `cleaner in ${cityName}`,
      `AC repair ${cityName}`,
      `HunarWalaa ${cityName}`,
      `hire professional ${cityName}`,
    ],
    alternates: { canonical: `https://hunarwalaa.com/services/${city}` },
    openGraph: {
      title: `Home Services in ${cityName} | HunarWalaa`,
      description: `Book verified plumbers, electricians, cleaners & 20+ skilled professionals in ${cityName}. Same-day availability.`,
      url: `https://hunarwalaa.com/services/${city}`,
      siteName: 'HunarWalaa',
      locale: 'en_PK',
      type: 'website',
    },
  };
}

export default async function CityPage({
  params,
}: {
  params: Promise<{ city: string }>;
}) {
  const { city } = await params;
  const cityName = CITIES[city];
  if (!cityName) notFound();

  const helpers = await fetchTopHelpers(cityName);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: `HunarWalaa — ${cityName}`,
    description: `Book verified home service professionals in ${cityName} — plumbers, electricians, cleaners & more.`,
    url: `https://hunarwalaa.com/services/${city}`,
    areaServed: { '@type': 'City', name: cityName },
    serviceType: SKILLS.map((s) => s.name),
    currenciesAccepted: 'PKR',
    paymentAccepted: 'Cash',
    priceRange: 'Rs-RsRs',
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="min-h-screen bg-gray-50">

        {/* Breadcrumb */}
        <div className="bg-white border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <nav className="text-sm text-gray-500 flex items-center gap-1.5 flex-wrap">
              <Link href="/" className="hover:text-indigo-600 transition-colors">Home</Link>
              <span>/</span>
              <Link href="/services" className="hover:text-indigo-600 transition-colors">Services</Link>
              <span>/</span>
              <span className="text-gray-900 font-medium">{cityName}</span>
            </nav>
          </div>
        </div>

        {/* Hero */}
        <div className="bg-gradient-to-br from-indigo-700 via-indigo-600 to-blue-600 text-white py-14 md:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="inline-flex items-center gap-2 bg-white/15 border border-white/25 rounded-full px-4 py-1.5 text-sm font-semibold mb-5">
              <MapPin size={14} /> {cityName}, Pakistan
            </div>
            <h1 className="text-3xl md:text-5xl font-black mb-4 tracking-tight leading-tight">
              Hire Skilled Professionals<br className="hidden md:block" /> in {cityName}
            </h1>
            <p className="text-indigo-100 text-base md:text-xl max-w-2xl mx-auto mb-8 leading-relaxed">
              Verified plumbers, electricians, cleaners and 20+ skilled professionals available in {cityName}.
              Book in seconds, pay when satisfied.
            </p>
            <Link
              href={`/?city=${encodeURIComponent(cityName)}`}
              className="inline-flex items-center gap-2 bg-white text-indigo-700 font-bold px-7 py-3.5 rounded-xl hover:bg-indigo-50 transition-colors shadow-lg shadow-indigo-900/20"
            >
              Find Pros in {cityName} <ArrowRight size={16} />
            </Link>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-14">

          {/* Service grid */}
          <section>
            <h2 className="text-2xl font-black text-gray-900 mb-1">Services in {cityName}</h2>
            <p className="text-gray-500 mb-7 text-sm">Choose a service to browse verified professionals near you.</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {SKILLS.map((svc) => (
                <Link
                  key={svc.slug}
                  href={`/services/${city}/${svc.slug}`}
                  className="flex flex-col items-center gap-2 bg-white border border-gray-100 rounded-2xl p-4 hover:border-indigo-200 hover:shadow-md transition-all text-center group"
                >
                  <span className="text-3xl">{svc.icon}</span>
                  <span className="text-xs font-bold text-gray-700 group-hover:text-indigo-600 transition-colors leading-tight">{svc.name}</span>
                </Link>
              ))}
            </div>
          </section>

          {/* Top helpers */}
          {helpers.length > 0 && (
            <section>
              <h2 className="text-2xl font-black text-gray-900 mb-1">Top-Rated Pros in {cityName}</h2>
              <p className="text-gray-500 mb-7 text-sm">Handpicked, verified professionals with the best reviews.</p>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {(helpers as {
                  id: string; fullName: string; headline?: string;
                  averageRating?: number; jobsCompleted?: number;
                  dailyRate?: number; isVerified?: boolean; profileImage?: string | null;
                }[]).map((h) => (
                  <Link
                    key={h.id}
                    href={`/helper/${h.id}`}
                    className="bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-md hover:border-indigo-100 transition-all flex items-start gap-4"
                  >
                    <div className="w-14 h-14 rounded-xl bg-indigo-100 flex-shrink-0 overflow-hidden">
                      {h.profileImage
                        ? <img src={h.profileImage} alt={h.fullName} className="w-full h-full object-cover" />
                        : <div className="w-full h-full flex items-center justify-center text-indigo-500 font-black text-xl">{h.fullName?.[0]}</div>
                      }
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 mb-0.5">
                        <span className="font-bold text-gray-900 text-sm truncate">{h.fullName}</span>
                        {h.isVerified && <BadgeCheck size={14} className="text-indigo-600 flex-shrink-0" />}
                      </div>
                      {h.headline && <p className="text-xs text-indigo-600 font-medium mb-2 truncate">{h.headline}</p>}
                      <div className="flex items-center gap-3 text-xs text-gray-500 flex-wrap">
                        {h.averageRating ? (
                          <span className="flex items-center gap-0.5">
                            <Star size={10} className="fill-yellow-400 text-yellow-400" /> {h.averageRating.toFixed(1)}
                          </span>
                        ) : null}
                        {h.jobsCompleted ? <span>{h.jobsCompleted} jobs</span> : null}
                        {h.dailyRate ? (
                          <span className="text-indigo-600 font-semibold">Rs.{h.dailyRate.toLocaleString()}/day</span>
                        ) : null}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
              <div className="mt-6 text-center">
                <Link
                  href={`/?city=${encodeURIComponent(cityName)}`}
                  className="inline-flex items-center gap-2 text-indigo-600 font-bold hover:text-indigo-700 transition-colors text-sm"
                >
                  View all professionals in {cityName} <ArrowRight size={14} />
                </Link>
              </div>
            </section>
          )}

          {/* Trust section */}
          <section className="bg-white rounded-3xl border border-gray-100 p-8 md:p-12">
            <h2 className="text-2xl font-black text-gray-900 mb-8 text-center">
              Why Book on HunarWalaa in {cityName}?
            </h2>
            <div className="grid sm:grid-cols-3 gap-8 text-center">
              {[
                {
                  icon: <ShieldCheck size={28} className="text-indigo-600" />,
                  title: 'Verified Professionals',
                  desc: `Every pro in ${cityName} is background-checked and skill-verified before joining HunarWalaa.`,
                },
                {
                  icon: <Star size={28} className="text-amber-500" />,
                  title: 'Real Reviews',
                  desc: 'Ratings from genuine clients after every completed job — no fake reviews, ever.',
                },
                {
                  icon: <Clock size={28} className="text-emerald-600" />,
                  title: 'Book in Seconds',
                  desc: `Search, compare, and book a pro in ${cityName} in under 2 minutes. Available today.`,
                },
              ].map(({ icon, title, desc }) => (
                <div key={title} className="flex flex-col items-center gap-3">
                  <div className="bg-gray-50 p-4 rounded-2xl">{icon}</div>
                  <h3 className="font-bold text-gray-900">{title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Other cities */}
          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-4">HunarWalaa in Other Cities</h2>
            <div className="flex flex-wrap gap-2">
              {Object.entries(CITIES)
                .filter(([slug]) => slug !== city)
                .map(([slug, name]) => (
                  <Link
                    key={slug}
                    href={`/services/${slug}`}
                    className="inline-flex items-center gap-1.5 bg-white border border-gray-200 text-gray-600 hover:border-indigo-300 hover:text-indigo-600 text-sm font-medium px-4 py-2 rounded-full transition-all"
                  >
                    <MapPin size={12} /> {name}
                  </Link>
                ))}
            </div>
          </section>

        </div>
      </div>
    </>
  );
}
