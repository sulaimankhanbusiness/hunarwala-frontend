import { MetadataRoute } from 'next';
import { CITIES, SKILLS } from './services/_data/locations';

const BASE = 'https://hunarwalaa.com';
const API_BASE = (process.env.NEXT_PUBLIC_API_URL ?? 'https://api.hunarwalaa.com').replace(/\/api$/i, '');
const MAX_SITEMAP_PAGES = 50;

async function fetchAllHelperIds(): Promise<string[]> {
  const ids: string[] = [];
  let page = 1;
  const limit = 100;

  try {
    while (page <= MAX_SITEMAP_PAGES) {
      const res = await fetch(
        `${API_BASE}/users/search?page=${page}&limit=${limit}&approvalStatus=approved`,
        { next: { revalidate: 86400 } },
      );
      if (!res.ok) break;
      const json = await res.json();
      const items: { id?: string; userId?: string }[] = json?.data?.items ?? json?.items ?? [];
      if (!items.length) break;
      ids.push(...items.map((h) => h.id ?? h.userId).filter((id): id is string => !!id));
      if (items.length < limit) break;
      page++;
    }
  } catch {
    // API unavailable at build time — sitemap will contain only static routes
  }

  return ids;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const helperIds = await fetchAllHelperIds();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: BASE,                    lastModified: new Date(), changeFrequency: 'daily',   priority: 1.0 },
    { url: `${BASE}/services`,      lastModified: new Date(), changeFrequency: 'daily',   priority: 0.9 },
    { url: `${BASE}/how-it-works`,  lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE}/about`,         lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE}/contact`,       lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE}/login`,         lastModified: new Date(), changeFrequency: 'yearly',  priority: 0.4 },
    { url: `${BASE}/register`,      lastModified: new Date(), changeFrequency: 'yearly',  priority: 0.4 },
    { url: `${BASE}/terms`,         lastModified: new Date(), changeFrequency: 'yearly',  priority: 0.3 },
    { url: `${BASE}/privacy`,       lastModified: new Date(), changeFrequency: 'yearly',  priority: 0.3 },
    { url: `${BASE}/cancellation`,  lastModified: new Date(), changeFrequency: 'yearly',  priority: 0.3 },
    { url: `${BASE}/ownership`,     lastModified: new Date(), changeFrequency: 'yearly',  priority: 0.2 },
  ];

  // City landing pages — 9 routes
  const cityRoutes: MetadataRoute.Sitemap = Object.keys(CITIES).map((city) => ({
    url: `${BASE}/services/${city}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.85,
  }));

  // City × Skill pages — 9 × 12 = 108 routes
  const citySkillRoutes: MetadataRoute.Sitemap = Object.keys(CITIES).flatMap((city) =>
    SKILLS.map((svc) => ({
      url: `${BASE}/services/${city}/${svc.slug}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.75,
    })),
  );

  // Dynamic helper profile pages
  const helperRoutes: MetadataRoute.Sitemap = helperIds.map((id) => ({
    url: `${BASE}/helper/${id}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  return [...staticRoutes, ...cityRoutes, ...citySkillRoutes, ...helperRoutes];
}
