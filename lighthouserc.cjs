const production = process.env.LHCI_TARGET === "production";
const origin = production ? "https://posadzkizywiczne.com" : "http://localhost:3000";
const routes = ["/", "/garaze", "/posadzki-zywiczne-na-balkony", "/kamienny-dywan", "/posadzki-elektrostatyczne"];
// Local CI has no production Neon credentials: don't score a calculator fallback as the real calculator.
if (production) routes.push("/kalkulator?typ=garaz");
module.exports = {
  ci: {
    collect: {
      url: routes.map(route => origin + route),
      numberOfRuns: 3,
      ...(production ? {} : { startServerCommand: "pnpm start", startServerReadyPattern: "Ready in", startServerReadyTimeout: 60000 }),
      settings: { onlyCategories: ["performance", "accessibility", "seo", "best-practices"], chromeFlags: "--no-sandbox --disable-dev-shm-usage" },
    },
    assert: {
      assertions: {
        "categories:performance": ["warn", { minScore: 0.90, aggregationMethod: "median" }],
        "categories:accessibility": ["warn", { minScore: 0.95, aggregationMethod: "median" }],
        "categories:seo": ["warn", { minScore: 0.95, aggregationMethod: "median" }],
        "largest-contentful-paint": ["warn", { maxNumericValue: 2500, aggregationMethod: "median" }],
        "total-blocking-time": ["warn", { maxNumericValue: 200, aggregationMethod: "median" }],
        "cumulative-layout-shift": ["warn", { maxNumericValue: 0.1, aggregationMethod: "median" }],
        "resource-summary:script:size": ["error", { maxNumericValue: 1500000, aggregationMethod: "median" }],
        "total-byte-weight": ["error", { maxNumericValue: 3000000, aggregationMethod: "median" }],
      },
    },
  },
};
