import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
      },
      {
        userAgent: '*',
        disallow: '/private', // Przykład zablokowanej sekcji
      },
    ],
    sitemap: 'https://posadzkizywiczne.com/sitemap.xml',
    host: 'https://posadzkizywiczne.com',
  };
}
