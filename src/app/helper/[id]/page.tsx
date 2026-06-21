import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import type { HelperProfile } from '@/features/helpers/types/helpers.types';
import HelperProfileClient from './HelperProfileClient';

const API_BASE = (process.env.NEXT_PUBLIC_API_URL ?? 'https://api.hunarwalaa.com').replace(/\/api$/, '');

function resolveMediaUrl(path: string | null | undefined): string {
  if (!path) return '';
  if (path.startsWith('http://') || path.startsWith('https://')) return path;
  return `${API_BASE}${path.startsWith('/') ? '' : '/'}${path}`;
}

async function fetchHelper(id: string): Promise<HelperProfile | null> {
  try {
    const res = await fetch(`${API_BASE}/users/profile?userId=${id}`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return null;
    const json = await res.json();
    return (json?.data ?? json) as HelperProfile;
  } catch {
    return null;
  }
}

function buildJsonLd(helper: HelperProfile, id: string) {
  const profileUrl = `https://hunarwalaa.com/helper/${id}`;
  const imageUrl = resolveMediaUrl(helper.profileImage);

  const schema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    '@id': profileUrl,
    name: helper.fullName,
    url: profileUrl,
    ...(helper.headline && { jobTitle: helper.headline }),
    ...(helper.bio && { description: helper.bio }),
    ...(imageUrl && { image: imageUrl }),
    address: {
      '@type': 'PostalAddress',
      addressLocality: helper.city,
      addressRegion: helper.region,
      addressCountry: 'PK',
    },
  };

  if (helper.avgRating > 0 && helper.totalReviews > 0) {
    schema.aggregateRating = {
      '@type': 'AggregateRating',
      ratingValue: helper.avgRating.toFixed(1),
      ratingCount: helper.totalReviews,
      reviewCount: helper.totalReviews,
      bestRating: '5',
      worstRating: '1',
    };
  }

  if (helper.reviews?.length > 0) {
    schema.review = helper.reviews.slice(0, 5).map((r) => ({
      '@type': 'Review',
      reviewRating: {
        '@type': 'Rating',
        ratingValue: r.rating,
        bestRating: '5',
      },
      author: { '@type': 'Person', name: r.reviewerName },
      ...(r.comment && { reviewBody: r.comment }),
      datePublished: r.createdAt?.split('T')[0],
    }));
  }

  if (helper.services?.length > 0) {
    schema.hasOfferCatalog = {
      '@type': 'OfferCatalog',
      name: `${helper.fullName}'s Services`,
      itemListElement: helper.services.map((svc) => ({
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: svc.name,
          ...(svc.description && { description: svc.description }),
        },
        price: svc.price,
        priceCurrency: 'PKR',
      })),
    };
  }

  return schema;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const helper = await fetchHelper(id);

  if (!helper) return { title: 'Professional Not Found — HunarWalaa' };

  const name = helper.fullName;
  const city = helper.city ?? 'Pakistan';
  const services = (helper.services ?? []).map((s) => s.name).slice(0, 3).join(', ');
  const rating = helper.avgRating > 0 ? `${helper.avgRating.toFixed(1)}★` : '';
  const jobs = helper.jobsCompleted ? `${helper.jobsCompleted}+ jobs` : '';
  const verified = helper.isVerified ? 'Verified ' : '';

  const title = [name, services || helper.headline, city].filter(Boolean).join(' · ') + ' — HunarWalaa';
  const description = [
    `${verified}professional in ${city}`,
    services ? `specialising in ${services}` : helper.headline,
    [rating, jobs].filter(Boolean).join(', '),
    "Book on HunarWalaa — Pakistan's trusted service marketplace.",
  ].filter(Boolean).join('. ');

  const profileUrl = `https://hunarwalaa.com/helper/${id}`;

  return {
    title,
    description,
    keywords: [
      name,
      ...(services ? services.split(', ') : []),
      `${services || 'professional'} in ${city}`,
      `hire ${services || 'helper'} ${city}`,
      'HunarWalaa', 'verified professional Pakistan',
    ],
    alternates: { canonical: profileUrl },
    openGraph: {
      title,
      description,
      url: profileUrl,
      siteName: 'HunarWalaa',
      locale: 'en_PK',
      type: 'profile',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  };
}

export default async function HelperProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const helper = await fetchHelper(id);

  if (!helper) notFound();

  const jsonLd = buildJsonLd(helper, id);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <HelperProfileClient id={id} initialHelper={helper} />
    </>
  );
}
