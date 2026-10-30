import { type NextRequest, NextResponse } from "next/server";
import manifest from "./data/public-cloudinary-manifest.json";
import mediaState from "./data/public-cloudinary-state.json";

const legacyEncodedFiles = new Map(
  manifest.assets
    .filter(({ path }) => /[^\x00-\x7F]|\s/.test(path))
    .map(({ path, publicId }) => [path, publicId] as const)
);

const LEGACY_PATH = "/blog/posadzki-zywiczne-sokolow-glogów-rzeszow-okolice";
const CANONICAL_PATH = "/blog/posadzki-zywiczne-sokolow-glogow-rzeszow-okolice";

function decodeLegacyPath(pathname: string): string {
  // Pathnames can arrive as percent-encoded or decoded Unicode depending on the proxy.
  let result = pathname;
  for (let i = 0; i < 2; i++) {
    try {
      const decoded = decodeURIComponent(result);
      if (decoded === result) break;
      result = decoded;
    } catch {
      break;
    }
  }
  return result.normalize("NFC");
}

export function middleware(request: NextRequest) {
  const normalizedPath = decodeLegacyPath(request.nextUrl.pathname);

  // Vercel's config-level redirects do not match a few URI-encoded Unicode and
  // whitespace filenames. Preserve their old URLs with a normalized 308.
  if (mediaState.active) {
    const publicId = legacyEncodedFiles.get(normalizedPath);
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    if (publicId && cloudName) {
      return NextResponse.redirect(
        "https://res.cloudinary.com/" + cloudName + "/image/upload/f_auto,q_auto:best/" + publicId,
        308
      );
    }
  }

  if (normalizedPath !== LEGACY_PATH) {
    return NextResponse.next();
  }

  const destination = request.nextUrl.clone();
  destination.pathname = CANONICAL_PATH;
  return NextResponse.redirect(destination, 308);
}

export const config = {
  matcher: ["/blog/:path*", "/images/:path*", "/realizacje/:path*"],
};
