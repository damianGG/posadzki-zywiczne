/**
 * Immutable legacy public/ image mapping. No Cloudinary API secrets in this module.
 */
import manifest from "@/data/public-cloudinary-manifest.json";
import state from "@/data/public-cloudinary-state.json";

const publicIds = new Map(manifest.assets.map(asset => [asset.path, asset.publicId] as const));

function asLocalPath(src: string): string | null {
  if (src.startsWith("/") && !src.startsWith("//")) return src;
  try {
    const url = new URL(src);
    if (url.protocol === "https:" &&
        (url.hostname === "www.posadzkizywiczne.com" || url.hostname === "posadzkizywiczne.com")) {
      return url.pathname;
    }
  } catch {}
  return null;
}

export function resolveLegacyPublicMedia(src: string): string | null {
  if (!state.active || typeof src !== "string") return null;
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  if (!cloudName) return null;
  const localPath = asLocalPath(src);
  if (!localPath) return null;
  const publicId = publicIds.get(localPath);
  if (!publicId) return null;
  return "https://res.cloudinary.com/" + cloudName + "/image/upload/" + publicId;
}
