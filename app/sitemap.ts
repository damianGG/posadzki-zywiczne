import { MetadataRoute } from 'next';

import { getAllPosts } from '@/lib/posts-json';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://posadzkizywiczne.com';

const base = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.posadzkizywiczne.com';
  const posts = getAllPosts().map(p => ({
    url: `${base}/blog/${p.slug}`,
    lastModified: p.updated ?? p.date,
    changeFrequency: 'monthly' as const,
    priority: 0.7
  }));

  return [
    {
      url: `${baseUrl}/`,
      lastModified: new Date().toISOString(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/posadzki-zywiczne-na-balkony`,
      lastModified: new Date().toISOString(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/garaze`,
      lastModified: new Date().toISOString(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/kuchnia-salon`,
      lastModified: new Date().toISOString(),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/pomieszczenia-czyste`,
      lastModified: new Date().toISOString(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/kontakt`,
      lastModified: new Date().toISOString(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
     { url: base, lastModified: new Date(), changeFrequency: 'weekly', priority: 1 },
    { url: `${base}/blog`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    ...posts
  ];
}