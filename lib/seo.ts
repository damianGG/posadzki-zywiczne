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
      name: p.publisherName ?? "Posadzki Żywiczne",
      logo: p.publisherLogo
        ? { "@type": "ImageObject", url: p.publisherLogo }
        : { "@type": "ImageObject", url: "https://posadzkizywiczne.com/images/logo.png" }
    },
    datePublished: p.datePublished,
    dateModified: p.dateModified ?? p.datePublished
  };
}

export function getDefaultSEOConfig() {
  return {
    siteName: "Posadzki Żywiczne",
    siteUrl: "https://posadzkizywiczne.com",
    defaultTitle: "Posadzki żywiczne | Garaże, kuchnie, balkony, tarasy | Gwarancja",
    defaultDescription: "Wykonujemy trwałe i estetyczne posadzki żywiczne w garażach, kuchniach, łazienkach, piwnicach, halach oraz na balkonach i tarasach.",
    defaultImage: "https://posadzkizywiczne.com/images/home-banner.jpg",
    locale: "pl_PL",
  };
}

export function generatePageMetadata(params: {
  title: string;
  description: string;
  path: string;
  keywords?: string;
  image?: string;
}) {
  const config = getDefaultSEOConfig();
  const canonicalUrl = `${config.siteUrl}${params.path}`;
  const imageUrl = params.image || config.defaultImage;

  return {
    title: params.title,
    description: params.description,
    keywords: params.keywords,
    openGraph: {
      title: params.title,
      description: params.description,
      url: canonicalUrl,
      siteName: config.siteName,
      locale: config.locale,
      type: 'website' as const,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: params.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image' as const,
      title: params.title,
      description: params.description,
      images: [imageUrl],
    },
    alternates: {
      canonical: canonicalUrl,
    },
  };
}

