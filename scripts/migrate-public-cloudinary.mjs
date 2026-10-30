/**
 * One-time non-destructive migration of legacy /public image bytes into Cloudinary.
 *
 * Phase A: invoked only in a PRODUCTION Vercel prebuild, never in previews.
 * Files and website URL references are not changed by this step.
 * Phase B: after verifying Phase A, set media-migration-state.json active=true,
 * update Next image loading, and remove the migrated files.
 *
 * Credentials are read only from server-side Vercel environment variables.
 */
import { readFile, access } from "node:fs/promises";
import path from "node:path";
import { createHash } from "node:crypto";
import { v2 as cloudinary } from "cloudinary";

const root = process.cwd();
const manifest = JSON.parse(await readFile(path.join(root, "data/public-cloudinary-manifest.json"), "utf8"));
const state = JSON.parse(await readFile(path.join(root, "data/public-cloudinary-state.json"), "utf8"));
const enabled = process.env.VERCEL_ENV === "production" && state.active !== true;
const assets = manifest.assets;

if (!Array.isArray(assets) || manifest.version !== 1) {
  throw new Error("Invalid Cloudinary legacy media manifest");
}

function gitBlobSha(bytes) {
  return createHash("sha1").update("blob " + bytes.length + "\0").update(bytes).digest("hex");
}

async function migrate(asset) {
  if (
    !/^\/(?!\/)[^?]+$/.test(asset.path) ||
    asset.path.includes("..") ||
    !/^posadzkizywiczne\/legacy\/[a-f0-9]{40}$/.test(asset.publicId) ||
    asset.publicId.split("/").at(-1) !== asset.gitSha
  ) {
    throw new Error("Invalid manifest entry: " + asset.path);
  }
  const local = path.resolve(root, "public", "." + asset.path);
  const publicRoot = path.resolve(root, "public") + path.sep;
  if (!local.startsWith(publicRoot)) throw new Error("Path escapes public directory");
  const bytes = await readFile(local);
  if (bytes.length !== asset.bytes || bytes.length > manifest.maxUploadBytes ||
      gitBlobSha(bytes) !== asset.gitSha) {
    throw new Error("Source image changed since manifest was created: " + asset.path);
  }

  // Calling Cloudinary Resource API is idempotent. No existing asset is overwritten.
  try {
    const resource = await cloudinary.api.resource(asset.publicId, { resource_type: "image" });
    if (resource.bytes !== asset.bytes) throw new Error("Existing Cloudinary asset byte size differs: " + asset.publicId);
    return "already";
  } catch (error) {
    if (error?.http_code !== 404 && error?.error?.http_code !== 404) throw error;
  }

  const result = await cloudinary.uploader.upload(local, {
    public_id: asset.publicId,
    resource_type: "image",
    overwrite: false,
    unique_filename: false,
    use_filename: false,
    tags: ["posadzkizywiczne-legacy-migration"],
  });
  if (result.public_id !== asset.publicId || result.bytes !== asset.bytes ||
      !result.secure_url?.startsWith("https://res.cloudinary.com/")) {
    throw new Error("Unexpected Cloudinary response for " + asset.path);
  }
  return "uploaded";
}

if (!enabled) {
  console.log("[cloudinary migration] skipped: not production or already activated");
} else {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;
  if (!cloudName || !apiKey || !apiSecret) {
    throw new Error("Cloudinary production credentials are required");
  }
  cloudinary.config({cloud_name:cloudName,api_key:apiKey,api_secret:apiSecret,secure:true});
  const unique = [...new Map(assets.map(asset => [asset.gitSha, asset])).values()];
  console.log("[cloudinary migration] starting", unique.length, "unique original files; total aliases:", assets.length);
  const jobs = [...unique];
  const totals = {uploaded:0,already:0,failed:0};
  let cursor = 0;
  async function worker() {
    while (true) {
      const index = cursor++;
      if (index >= jobs.length) return;
      const asset = jobs[index];
      try {
        const outcome = await migrate(asset);
        totals[outcome]++;
        console.log("[cloudinary migration]", index+1+"/"+jobs.length, outcome, asset.path);
      } catch (error) {
        totals.failed++;
        console.error("[cloudinary migration] ERROR", asset.path, error instanceof Error ? error.message : String(error));
      }
    }
  }
  await Promise.all(Array.from({length:3},worker));
  console.log("[cloudinary migration] completed", JSON.stringify(totals));
  if (totals.failed !== 0 || totals.uploaded + totals.already !== unique.length) {
    throw new Error("Cloudinary migration incomplete. No live media routing was changed.");
  }
}
