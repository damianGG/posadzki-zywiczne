import type { MetadataRoute } from "next";
import { getAllBlogPosts } from "@/lib/blog";
import { getAllRealizacje } from "@/lib/realizacje";
import { localServicePages } from "@/lib/local-service-pages";
import { SITE_URL } from "@/lib/site-config";
import { isShopEnabled } from "@/lib/shop-feature";
import { stoneCities } from "@/lib/stone-cities";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const allPosts = getAllBlogPosts();
  const allRealizacje = await getAllRealizacje();

  const posts = allPosts.map((post) => {
    const updated = new Date(post.updatedAt || post.publishedAt);

    return {
      url: `${SITE_URL}/blog/${post.id}`,
      ...(!Number.isNaN(updated.getTime()) ? { lastModified: updated } : {}),
    };
  });

  const realizacje = allRealizacje.map((realizacja) => {
    const projectDate = new Date(realizacja.date);

    return {
      url: `${SITE_URL}/realizacje/${realizacja.slug}`,
      ...(!Number.isNaN(projectDate.getTime()) ? { lastModified: projectDate } : {}),
    };
  });

  const staticPages = [
    "/",
    "/posadzki-zywiczne-na-balkony",
    "/garaze",
    "/posadzki-elektrostatyczne",
    "/kuchnia-salon",
    "/pomieszczenia-czyste",
    "/kalkulator",
    "/kontakt",
    "/realizacje",
    "/blog",
    "/kamienny-dywan",
  ].map((path) => ({ url: `${SITE_URL}${path}` }));

  // Never include the hidden store in the public sitemap.
  if (isShopEnabled() && process.env.VERCEL_ENV === "production") {
    staticPages.push({ url: `${SITE_URL}/sklep` });
    staticPages.push({ url: `${SITE_URL}/sklep/produkty` });
  }

  const cityPages = stoneCities.map(city => ({ url: `${SITE_URL}/kamienny-dywan/${city.slug}` }));
  const localPages = Object.keys(localServicePages).map(city => ({ url: `${SITE_URL}/posadzki-zywiczne/${city}` }));
  return [...staticPages, ...localPages, ...cityPages, ...posts, ...realizacje];
}
