import type { MetadataRoute } from "next";
import { getAllPosts } from "@/lib/posts-json";
import { getAllRealizacje } from "@/lib/realizacje";
import { SITE_URL } from "@/lib/site-config";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const allPosts = getAllPosts();
  const allRealizacje = await getAllRealizacje();

  const posts = allPosts.map((post) => {
    let lastModified: Date | undefined;

    if (post.updated?.trim()) {
      const updatedDate = new Date(post.updated);
      if (!Number.isNaN(updatedDate.getTime())) lastModified = updatedDate;
    } else if (post.date?.trim()) {
      const publishedDate = new Date(post.date);
      if (!Number.isNaN(publishedDate.getTime())) lastModified = publishedDate;
    }

    return {
      url: `${SITE_URL}/blog/${post.slug}`,
      ...(lastModified ? { lastModified } : {}),
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
  ].map((path) => ({ url: `${SITE_URL}${path}` }));

  return [...staticPages, ...posts, ...realizacje];
}
