import type { MetadataRoute } from "next";
import { getAllBlogPosts } from "@/lib/blog";
import { getAllRealizacje } from "@/lib/realizacje";
import { SITE_URL } from "@/lib/site-config";
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
    "/kuchnia-salon",
    "/pomieszczenia-czyste",
    "/kalkulator",
    "/sklep",
    "/kontakt",
    "/realizacje",
    "/blog",
    "/kamienny-dywan",
  ].map((path) => ({ url: `${SITE_URL}${path}` }));

  const cityPages = stoneCities.map(city => ({ url: `${SITE_URL}/kamienny-dywan/${city.slug}` }));
  return [...staticPages, ...cityPages, ...posts, ...realizacje];
}
