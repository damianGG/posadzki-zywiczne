import type { MetadataRoute } from "next";
import { getAllBlogPosts } from "@/lib/blog";
import { getAllRealizacje } from "@/lib/realizacje";
import { localServicePages } from "@/lib/local-service-pages";
import { SITE_URL } from "@/lib/site-config";
import { catalogSystems } from "@/lib/floor-system-catalog";
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
    "/parkingi",
    "/hale-magazyny",
    "/gastronomia",
    "/zamow",
    "/kalkulator",
    "/systemy",
    "/kontakt",
    "/realizacje",
    "/blog",
    "/kamienny-dywan",
  ].map((path) => ({ url: `${SITE_URL}${path}` }));

  const systemPages = catalogSystems.filter(system => !system.isConcept).map(system => ({ url: `${SITE_URL}/systemy/${system.slug}` }));
  const cityPages = stoneCities.map(city => ({ url: `${SITE_URL}/kamienny-dywan/${city.slug}` }));
  const localPages = Object.keys(localServicePages).map(city => ({ url: `${SITE_URL}/posadzki-zywiczne/${city}` }));
  return [...staticPages, ...systemPages, ...localPages, ...cityPages, ...posts, ...realizacje];
}
