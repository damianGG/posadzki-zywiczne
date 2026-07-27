import { Inter } from "next/font/google";
import "./globals.css";
import { Footer1 } from "@/blocks/footer/footer1";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { GoogleTagManager } from "@next/third-parties/google";
import type { Metadata } from "next";
import Script from "next/script";
import { Header2 } from "@/blocks/header/header2";
import {
  getLocalBusinessSchema,
  getOrganizationSchema,
  getWebsiteSchema,
} from "@/lib/structured-data";
import {
  SITE_DESCRIPTION,
  SITE_NAME,
  SITE_URL,
  absoluteUrl,
} from "@/lib/site-config";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  preload: true,
});

const googleVerification = process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION;
const defaultTitle = "Posadzki żywiczne | Garaże, kuchnie, balkony, tarasy | Gwarancja";
const homeBannerUrl = absoluteUrl("/images/home-banner.jpg");

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: defaultTitle,
  description: SITE_DESCRIPTION,
  ...(googleVerification
    ? {
        verification: {
          google: googleVerification,
        },
      }
    : {}),
  openGraph: {
    title: defaultTitle,
    description: SITE_DESCRIPTION,
    url: SITE_URL,
    siteName: SITE_NAME,
    locale: "pl_PL",
    type: "website",
    images: [
      {
        url: homeBannerUrl,
        width: 1200,
        height: 630,
        alt: "Posadzki Żywiczne - Profesjonalne Usługi",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: defaultTitle,
    description: SITE_DESCRIPTION,
    images: [homeBannerUrl],
  },
  alternates: {
    canonical: SITE_URL,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const organizationSchema = getOrganizationSchema();
  const websiteSchema = getWebsiteSchema();
  const localBusinessSchema = getLocalBusinessSchema();

  return (
    <html lang="pl">
      <head>
        <link rel="dns-prefetch" href="https://res.cloudinary.com" />
        <link rel="preconnect" href="https://res.cloudinary.com" crossOrigin="anonymous" />

        <Script
          id="organization-schema"
          type="application/ld+json"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <Script
          id="website-schema"
          type="application/ld+json"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
        <Script
          id="local-business-schema"
          type="application/ld+json"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@graph": localBusinessSchema.map(({ "@context": _context, ...schema }) => schema),
            }),
          }}
        />
      </head>

      <GoogleTagManager gtmId="GTM-5D97JCZ5" />

      <Script
        id="google-analytics-script"
        strategy="afterInteractive"
        src="https://www.googletagmanager.com/gtag/js?id=G-VCXQVYV8TG"
      />
      <Script
        id="google-analytics-init"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-VCXQVYV8TG');
          `,
        }}
      />

      <Script
        id="clarity-script"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            (function(c,l,a,r,i,t,y){
                c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
            })(window, document, "clarity", "script", "pcuspvg0dc");
          `,
        }}
      />

      <body className={inter.className}>
        <Header2 />
        {children}
        <SpeedInsights />
        <Analytics />
        <Footer1 />
      </body>
    </html>
  );
}
