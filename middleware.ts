import { type NextRequest, NextResponse } from "next/server";

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
  if (decodeLegacyPath(request.nextUrl.pathname) !== LEGACY_PATH) {
    return NextResponse.next();
  }

  const destination = request.nextUrl.clone();
  destination.pathname = CANONICAL_PATH;
  return NextResponse.redirect(destination, 308);
}

export const config = {
  matcher: ["/blog/:path*"],
};
