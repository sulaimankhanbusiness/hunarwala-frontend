import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Star, BadgeCheck, ArrowRight, MapPin, ShieldCheck, Clock, ChevronRight } from 'lucide-react';
import { CITIES, SKILLS } from '../../_data/locations';

export const revalidate = 3600;

const API_BASE = (process.env.NEXT_PUBLIC_API_URL ?? 'https://api.hunarwalaa.com').replace(/\/api$/, '');

async function fetchHelpersBySkill(city: string, skillApiName: string) {
  try {
    const res = await fetch(
      `${API_BASE}/users/search?city=${encodeURIComponent(city)}&skill=${encodeURIComponent(skillApiName)}&limit=12`,
    );
    if (!res.ok) return [];
    const json = await res.json();
    return json?.data?.items ?? json?.items ?? [];
  } catch {
    return [];
  }
}

export function generateStaticParams() {
  return Object.keys(CITIES).flatMap((city) =>
    SKILLS.map((svc) => ({ city, skill: svc.slug })),
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ city: string; skill: string }>;
}): Promise<Metadata> {
  const { city, skill } = await params;
  const cityName = CITIES[city];
  const skillData = SKILLS.find((s) => s.slug === skill);
  if (!cityName || !skillData) return { title: 'Not Found' };

  const helpers = await fetchHelpersBySkill(cityName, skillData.apiName);

  const title = `${skillData.name} in ${cityName} | HunarWalaa — Verified Professionals`;
  const description = `Hire verified ${skillData.name.toLowerCase()} in ${cityName}. ${skillData.description}. Book on HunarWalaa — Pakistan's trusted service marketplace.`;

  return {
    title,
    description,
    // No live listings yet — keep this variant out of the index until it has real, unique content.
    ...(helpers.length === 0 && { robots: { index: false, follow: true } }),
    keywords: [
      `${skillData.name.toLowerCase()} in ${cityName}`,
      `hire ${skillData.name.toLowerCase()} ${cityName}`,
      `best ${skillData.name.toLowerCase()} ${cityName}`,
      `${skillData.name.toLowerCase()} near me ${cityName}`,
      `${skillData.name.toLowerCase()} price ${cityName}`,
      `HunarWalaa ${skillData.name.toLowerCase()} ${cityName}`,
      `verified ${skillData.name.toLowerCase()} Pakistan`,
    ],
    alternates: { canonical: `https://hunarwalaa.com/services/${city}/${skill}` },
    openGraph: {
      title,
      description,
      url: `https://hunarwalaa.com/services/${city}/${skill}`,
      siteName: 'HunarWalaa',
      locale: 'en_PK',
      type: 'website',
    },
  };
}

export default async function CitySkillPage({
  params,
}: {
  params: Promise<{ city: string; skill: string }>;
}) {
  const { city, skill } = await params;
  const cityName = CITIES[city];
  const skillData = SKILLS.find((s) => s.slug === skill);
  if (!cityName || !skillData) notFound();

  const helpers = await fetchHelpersBySkill(cityName, skillData.apiName);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: `${skillData.name} in ${cityName}`,
    description: skillData.description,
    provider: {
      '@type': 'LocalBusiness',
      name: 'HunarWalaa',
      url: 'https://hunarwalaa.com',
    },
    areaServed: { '@type': 'City', name: cityName },
    url: `https://hunarwalaa.com/services/${city}/${skill}`,
    offers: {
      '@type': 'AggregateOffer',
      priceCurrency: 'PKR',
      availability: 'https://schema.org/InStock',
    },
  };

  const FAQ = [
    {
      q: `How much does a ${skillData.name.toLowerCase()} cost in ${cityName}?`,
      a: `${skillData.name} rates in ${cityName} vary by job complexity. Browse individual profiles on HunarWalaa to compare prices. Most professionals list their daily rate and per-service pricing upfront.`,
    },
    {
      q: `How do I hire a ${skillData.name.toLowerCase()} in ${cityName}?`,
      a: `Search for ${skillData.name.toLowerCase()} professionals on HunarWalaa, filter by ${cityName}, compare ratings and reviews, then book directly through the platform in under 2 minutes.`,
    },
    {
      q: `Are ${skillData.name.toLowerCase()} professionals on HunarWalaa verified?`,
      a: `Yes. Every professional on HunarWalaa is background-checked and skill-verified before they can accept bookings. You can also see real client reviews on each profile.`,
    },
  ];

  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQ.map(({ q, a }) => ({
      '@type': 'Question',
      name: q,
      acceptedAnswer: { '@type': 'Answer', text: a },
    })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />

      <div className="min-h-screen bg-gray-50">

        {/* Breadcrumb */}
        <div className="bg-white border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <nav className="text-sm text-gray-500 flex items-center gap-1.5 flex-wrap">
              <Link href="/" className="hover:text-indigo-600 transition-colors">Home</Link>
              <ChevronRight size={12} />
              <Link href="/services" className="hover:text-indigo-600 transition-colors">Services</Link>
              <ChevronRight size={12} />
              <Link href={`/services/${city}`} className="hover:text-indigo-600 transition-colors">{cityName}</Link>
              <ChevronRight size={12} />
              <span className="text-gray-900 font-medium">{skillData.name}</span>
            </nav>
          </div>
        </div>

        {/* Hero */}
        <div className="bg-gradient-to-br from-indigo-700 via-indigo-600 to-blue-600 text-white py-12 md:py-18">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 bg-white/15 border border-white/25 rounded-full px-4 py-1.5 text-sm font-semibold mb-4">
                <MapPin size={13} /> {cityName} · {skillData.name}
              </div>
              <h1 className="text-3xl md:text-5xl font-black mb-4 tracking-tight leading-tight">
                Hire a {skillData.name} in {cityName}
              </h1>
              <p className="text-indigo-100 text-base md:text-lg mb-8 leading-relaxed max-w-2xl">
                {skillData.description}. Browse verified {skillData.name.toLowerCase()} professionals in {cityName},
                compare prices and reviews, then book instantly.
              </p>
              <Link
                href={`/?city=${encodeURIComponent(cityName)}&skill=${encodeURIComponent(skillData.apiName)}`}
                className="inline-flex items-center gap-2 bg-white text-indigo-700 font-bold px-7 py-3.5 rounded-xl hover:bg-indigo-50 transition-colors shadow-lg shadow-indigo-900/20"
              >
                Find {skillData.name} in {cityName} <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">

          {/* Helpers list */}
          {helpers.length > 0 ? (
            <section>
              <h2 className="text-2xl font-black text-gray-900 mb-1">
                {skillData.name} Professionals in {cityName}
              </h2>
              <p className="text-gray-500 mb-7 text-sm">
                Verified, reviewed and available to book today.
              </p>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {(helpers as {
                  id: string; fullName: string; headline?: string;
                  averageRating?: number; totalReviews?: number;
                  jobsCompleted?: number; dailyRate?: number;
                  isVerified?: boolean; profileImage?: string | null;
                  completionRate?: number;
                }[]).map((h) => (
                  <Link
                    key={h.id}
                    href={`/helper/${h.id}`}
                    className="bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-md hover:border-indigo-100 transition-all"
                  >
                    <div className="flex items-start gap-4 mb-4">
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
                        {h.headline && <p className="text-xs text-indigo-600 font-medium truncate">{h.headline}</p>}
                      </div>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-gray-500 flex-wrap">
                      {h.averageRating ? (
                        <span className="flex items-center gap-0.5 font-semibold text-gray-700">
                          <Star size={11} className="fill-yellow-400 text-yellow-400" />
                          {h.averageRating.toFixed(1)}
                          {h.totalReviews ? <span className="text-gray-400 font-normal">({h.totalReviews})</span> : null}
                        </span>
                      ) : null}
                      {h.jobsCompleted ? <span>{h.jobsCompleted} jobs</span> : null}
                      {h.completionRate ? <span>{h.completionRate}% completion</span> : null}
                    </div>
                    {h.dailyRate ? (
                      <div className="mt-3 pt-3 border-t border-gray-50 flex items-center justify-between">
                        <span className="text-xs text-gray-400">Starting from</span>
                        <span className="text-sm font-black text-indigo-600">Rs.{h.dailyRate.toLocaleString()}/day</span>
                      </div>
                    ) : null}
                  </Link>
                ))}
              </div>
            </section>
          ) : (
            <section className="bg-white rounded-2xl border border-gray-100 p-10 text-center">
              <p className="text-2xl mb-3">{skillData.icon}</p>
              <h2 className="font-bold text-gray-900 mb-2">No {skillData.name} pros listed yet in {cityName}</h2>
              <p className="text-gray-500 text-sm mb-6">Check back soon — or search all cities for available professionals.</p>
              <Link href="/services" className="inline-flex items-center gap-2 bg-indigo-600 text-white font-bold px-6 py-3 rounded-xl hover:bg-indigo-700 transition-colors text-sm">
                Browse All Services <ArrowRight size={15} />
              </Link>
            </section>
          )}

          {/* FAQ */}
          <section>
            <h2 className="text-2xl font-black text-gray-900 mb-6">
              Frequently Asked Questions
            </h2>
            <div className="space-y-4">
              {FAQ.map(({ q, a }) => (
                <div key={q} className="bg-white rounded-2xl border border-gray-100 p-6">
                  <h3 className="font-bold text-gray-900 mb-2">{q}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{a}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Trust row */}
          <section className="grid sm:grid-cols-3 gap-4">
            {[
              { icon: <ShieldCheck size={20} className="text-indigo-600" />, label: 'Verified Professionals', bg: 'bg-indigo-50' },
              { icon: <Star size={20} className="text-amber-500" />, label: 'Real Client Reviews', bg: 'bg-amber-50' },
              { icon: <Clock size={20} className="text-emerald-600" />, label: 'Book in Under 2 Minutes', bg: 'bg-emerald-50' },
            ].map(({ icon, label, bg }) => (
              <div key={label} className={`${bg} rounded-2xl p-5 flex items-center gap-3`}>
                {icon}
                <span className="font-bold text-gray-800 text-sm">{label}</span>
              </div>
            ))}
          </section>

          {/* Related services in same city */}
          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-4">
              Other Services in {cityName}
            </h2>
            <div className="flex flex-wrap gap-2">
              {SKILLS.filter((s) => s.slug !== skill).map((s) => (
                <Link
                  key={s.slug}
                  href={`/services/${city}/${s.slug}`}
                  className="inline-flex items-center gap-1.5 bg-white border border-gray-200 text-gray-600 hover:border-indigo-300 hover:text-indigo-600 text-sm font-medium px-4 py-2 rounded-full transition-all"
                >
                  {s.icon} {s.name} in {cityName}
                </Link>
              ))}
            </div>
          </section>

        </div>
      </div>
    </>
  );
}
