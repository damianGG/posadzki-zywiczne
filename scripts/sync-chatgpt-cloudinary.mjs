/**
 * During a reviewed production deployment, synchronizes GitHub-uploaded original
 * project photos with Cloudinary. Cloudinary stores the original unchanged;
 * responsive transformations happen only when the image is delivered.
 *
 * In preview/local builds no remote writes occur. Local original photos remain
 * available so reviewers can inspect the PR before merging.
 */
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { createHash } from "node:crypto";
import { v2 as cloudinary } from "cloudinary";

const root = process.cwd();
const catalogPath = path.join(root, "data", "chatgpt-realizacje.json");
const manifestPath = path.join(root, "data", "chatgpt-image-manifest.generated.json");

const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const allowedImage = /^\/chatgpt-realizacje\/([a-z0-9]+(?:-[a-z0-9]+)*)\/([a-z0-9][a-z0-9._-]*\.(?:jpe?g|png|webp|avif|heic|heif))$/i;

function getPhotoPaths(project) {
  const gallery = Array.isArray(project.images?.gallery) ? project.images.gallery : [];
  const sources = [project.images?.main, ...gallery.map(img => typeof img === "string" ? img : img?.url)];
  return [...new Set(sources.filter(src => typeof src === "string" && src.startsWith("/chatgpt-realizacje/")))];
}

async function syncProjectPhoto(slug, src) {
  const match = allowedImage.exec(src);
  if (!match || match[1] !== slug || src.includes("..")) {
    throw new Error("Invalid or cross-project source photo path: " + src);
  }
  const filename = match[2];
  const localPath = path.resolve(root, "public", "chatgpt-realizacje", slug, filename);
  const bytes = await readFile(localPath);
  const hash = createHash("sha256").update(bytes).digest("hex").slice(0, 16);
  const publicId = `realizacje/chatgpt/${slug}/${path.parse(filename).name}-${hash}`;

  // Idempotent: same content + filename always maps to the same Cloudinary asset.
  try {
    const existing = await cloudinary.api.resource(publicId, { resource_type: "image" });
    if (existing?.secure_url) return existing.secure_url;
  } catch (error) {
    // Only a real 404 means upload is needed. Do not mask auth/API failures.
    if (error?.http_code !== 404 && error?.error?.http_code !== 404) {
      throw error;
    }
  }

  const uploaded = await cloudinary.uploader.upload(localPath, {
    public_id: publicId,
    overwrite: false,
    unique_filename: false,
    resource_type: "image",
    // Deliberately NO format, width, height, crop, or incoming transformation.
  });
  if (!uploaded?.secure_url) throw new Error("Cloudinary returned no secure URL");
  return uploaded.secure_url;
}

async function main() {
  const catalog = JSON.parse(await readFile(catalogPath, "utf8"));
  if (!Array.isArray(catalog)) throw new Error("ChatGPT catalog must be an array");

  const manifest = {};
  const isProduction = process.env.VERCEL_ENV === "production";
  const hasLocalPhotos = catalog.some(project => getPhotoPaths(project).length > 0);

  if (isProduction && hasLocalPhotos) {
    const { CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } = process.env;
    if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_API_KEY || !CLOUDINARY_API_SECRET) {
      throw new Error("Missing Cloudinary credentials. Refusing to deploy broken project photos.");
    }
    cloudinary.config({
      cloud_name: CLOUDINARY_CLOUD_NAME,
      api_key: CLOUDINARY_API_KEY,
      api_secret: CLOUDINARY_API_SECRET,
      secure: true,
    });

    for (const project of catalog) {
      if (!project || !slugPattern.test(project.slug || "")) {
        throw new Error("Invalid project slug in ChatGPT catalog");
      }
      for (const src of getPhotoPaths(project)) {
        manifest[src] = await syncProjectPhoto(project.slug, src);
      }
    }
  }
  // Local/preview: unchanged files from public/, no Cloudinary writes.
  await writeFile(manifestPath, JSON.stringify(manifest, null, 2) + "\n", "utf8");
  console.log(
    `ChatGPT media sync: ${isProduction ? "production" : "preview/local"}, ${Object.keys(manifest).length} original photos mapped`
  );
}

main().catch(error => {
  console.error("ChatGPT Cloudinary image synchronization failed:", error instanceof Error ? error.message : "Unexpected failure");
  process.exitCode = 1;
});
