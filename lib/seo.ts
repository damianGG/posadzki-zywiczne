export function articleJsonLd(p: {
  url: string;
  title: string;
  description: string;
  datePublished: string;
  dateModified?: string;
  images?: string[];
  publisherName?: string;
  publisherLogo?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    mainEntityOfPage: p.url,
    headline: p.title,
    description: p.description,
    image: p.images ?? [],
    publisher: {
      "@type": "Organization",
      name: p.publisherName ?? "twojadomena.pl",
      logo: p.publisherLogo
        ? { "@type": "ImageObject", url: p.publisherLogo }
        : undefined
    },
    datePublished: p.datePublished,
    dateModified: p.dateModified ?? p.datePublished
  };
}
