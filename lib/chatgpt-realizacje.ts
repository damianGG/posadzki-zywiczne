import data from "@/data/chatgpt-realizacje.json";
import originalImageMap from "@/data/chatgpt-image-manifest.generated.json";
import type { Realizacja, RealizacjaCategory } from "@/types/realizacje";

/**
 * ChatGPT-managed portfolio entries.
 *
 * Content is committed via the already-connected GitHub integration, reviewed
 * in a PR, then published by Vercel after merge. No public write endpoint or
 * long-lived secret is exposed to the model or to the browser.
 *
 * Original photos should be stored unmodified or referenced by the original
 * Cloudinary secure_url. The site generates responsive delivery variants.
 */
const categories = new Set<RealizacjaCategory>([
  "schody",
  "garaze",
  "kuchnie",
  "balkony-tarasy",
  "domy-mieszkania",
  "pomieszczenia-czyste",
]);

function hasSafeImageUrl(src: unknown): src is string {
  if (typeof src !== "string") return false;
  if (src.startsWith("/")) {
    return src.startsWith("/") && !src.startsWith("//") && !src.includes("..");
  }
  try {
    const url = new URL(src);
    return url.protocol === "https:" && url.hostname === "res.cloudinary.com";
  } catch {
    return false;
  }
}

function isValidProject(item: unknown): item is Realizacja {
  if (!item || typeof item !== "object") return false;
  const project = item as Partial<Realizacja>;
  return (
    typeof project.slug === "string" &&
    /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(project.slug) &&
    typeof project.title === "string" && project.title.length > 8 &&
    typeof project.description === "string" && project.description.length > 40 &&
    typeof project.location === "string" && project.location.trim().length > 1 &&
    typeof project.date === "string" && !Number.isNaN(Date.parse(project.date)) &&
    categories.has(project.category as RealizacjaCategory) &&
    Array.isArray(project.tags) && Array.isArray(project.features) &&
    Array.isArray(project.keywords) &&
    !!project.images && hasSafeImageUrl(project.images.main) &&
    Array.isArray(project.images.gallery) &&
    project.images.gallery.every(image => {
      if (typeof image === "string") return hasSafeImageUrl(image);
      return !!image && hasSafeImageUrl(image.url);
    }) &&
    !!project.details &&
    typeof project.details.surface === "string" &&
    typeof project.details.system === "string"
  );
}

// Parse as unknown and validate records, rather than trusting uploaded content.
const rawProjects: unknown = data;

const imageMap = originalImageMap as Record<string, string>;

function resolvedPhoto(url: string): string {
  return imageMap[url] || url;
}

/** Returns Cloudinary original URLs on production and local URLs in previews. */
export const chatgptRealizacje: Realizacja[] = Array.isArray(rawProjects)
  ? rawProjects.filter(isValidProject).map(project => ({
      ...project,
      images: {
        main: resolvedPhoto(project.images.main),
        gallery: project.images.gallery.map(image => typeof image === "string"
          ? resolvedPhoto(image)
          : { ...image, url: resolvedPhoto(image.url) }),
      },
    }))
  : [];
