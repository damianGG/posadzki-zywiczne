import { BlogPost } from "./blog"

export function getOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Posadzki Żywiczne",
    "url": "https://posadzkizywiczne.com",
    "logo": "https://posadzkizywiczne.com/images/logo.png",
    "description": "Wykonujemy trwałe i estetyczne posadzki żywiczne w garażach, kuchniach, łazienkach, piwnicach, halach oraz na balkonach i tarasach.",
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "PL"
    },
    "contactPoint": {
      "@type": "ContactPoint",
      "contactType": "customer service",
      "availableLanguage": "Polish"
    },
    "sameAs": []
  }
}

export function getLocalBusinessSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "Posadzki Żywiczne",
    "image": "https://posadzkizywiczne.com/images/home-banner.jpg",
    "url": "https://posadzkizywiczne.com",
    "telephone": "",
    "priceRange": "$$",
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "PL"
    },
    "geo": {
      "@type": "GeoCoordinates"
    },
    "openingHoursSpecification": {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday"
      ],
      "opens": "08:00",
      "closes": "17:00"
    }
  }
}

export function getArticleSchema(post: BlogPost) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": post.title,
    "description": post.excerpt,
    "image": post.image.url,
    "datePublished": post.publishedAt,
    "dateModified": post.updatedAt || post.publishedAt,
    "author": {
      "@type": "Person",
      "name": post.author.name
    },
    "publisher": {
      "@type": "Organization",
      "name": "Posadzki Żywiczne",
      "logo": {
        "@type": "ImageObject",
        "url": "https://posadzkizywiczne.com/images/logo.png"
      }
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": post.seo.canonicalUrl
    }
  }
}

export function getBreadcrumbSchema(items: Array<{ name: string; url: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": item.url
    }))
  }
}

export function getWebsiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Posadzki Żywiczne",
    "url": "https://posadzkizywiczne.com",
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": "https://posadzkizywiczne.com/blog?search={search_term_string}"
      },
      "query-input": "required name=search_term_string"
    }
  }
}

export function getServiceSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    "serviceType": "Posadzki Żywiczne",
    "provider": {
      "@type": "Organization",
      "name": "Posadzki Żywiczne"
    },
    "areaServed": {
      "@type": "Country",
      "name": "Polska"
    },
    "description": "Profesjonalne wykonywanie posadzek żywicznych w garażach, kuchniach, łazienkach, piwnicach, halach oraz na balkonach i tarasach."
  }
}
