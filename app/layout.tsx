
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
// import { Header } from "@/components/header";
import Header1 from "@/blocks/header/header1"
import { ModeToggle } from "@/components/ui/mode-toggle";
import { Header2 } from "@/blocks/header/header2";
import { Header3 } from "@/blocks/header/header3";
import { Footer1 } from "@/blocks/footer/footer1";
import { NextSeo } from 'next-seo';
import { Analytics } from "@vercel/analytics/react"
import { SpeedInsights } from "@vercel/speed-insights/next"
const inter = Inter({ 
  subsets: ["latin"],
  display: "swap",
  preload: true,
});
import { GoogleAnalytics, GoogleTagManager } from '@next/third-parties/google'
import type { Metadata } from 'next'
import Script from "next/script";
import { getOrganizationSchema, getWebsiteSchema } from "@/lib/structured-data";

export const metadata: Metadata = {
  title: "Posadzki żywiczne | Garaże, kuchnie, balkony, tarasy | Gwarancja",
  description:
    "Wykonujemy trwałe i estetyczne posadzki żywiczne w garażach, kuchniach, łazienkach, piwnicach, halach oraz na balkonach i tarasach. Oferujemy kompleksowy montaż i fachowe doradztwo. Sprawdź naszą ofertę!",
  keywords:
    "posadzki żywiczne, balkony, tarasy, garaże, kuchnie, łazienki, piwnice, posadzki przemysłowe, magazyny, posadzki dekoracyjne, żywica epoksydowa, żywica poliuretanowa, Warszawa, Kraków, Rzeszów",
  openGraph: {
    title: "Posadzki żywiczne | Garaże, kuchnie, balkony, tarasy | Gwarancja",
    description:
      "Wykonujemy trwałe i estetyczne posadzki żywiczne w garażach, kuchniach, łazienkach, piwnicach, halach oraz na balkonach i tarasach. Oferujemy kompleksowy montaż i fachowe doradztwo. Sprawdź naszą ofertę!",
    url: "https://posadzkizywiczne.com",
    images: [
      {
        url: "https://posadzkizywiczne.com/images/home-banner.jpg",
        width: 1200,
        height: 630,
        alt: "Posadzki Żywiczne - Profesjonalne Usługi",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Posadzki żywiczne | Garaże, kuchnie, balkony, tarasy | Gwarancja",
    description:
      "Wykonujemy trwałe i estetyczne posadzki żywiczne w garażach, kuchniach, łazienkach, piwnicach, halach oraz na balkonach i tarasach. Oferujemy kompleksowy montaż i fachowe doradztwo. Sprawdź naszą ofertę!",
    images: ["https://posadzkizywiczne.com/images/home-banner.jpg"],
  },
  alternates: {
    canonical: "https://posadzkizywiczne.com",
  },
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const organizationSchema = getOrganizationSchema();
  const websiteSchema = getWebsiteSchema();

  return (
    <html lang="pl">
      <head>
        {/* Resource hints for faster image loading */}
        <link rel="dns-prefetch" href="https://res.cloudinary.com" />
        <link rel="preconnect" href="https://res.cloudinary.com" crossOrigin="anonymous" />
        
        {/* Structured Data for SEO */}
        <Script
          id="organization-schema"
          type="application/ld+json"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationSchema),
          }}
        />
        <Script
          id="website-schema"
          type="application/ld+json"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(websiteSchema),
          }}
        />
      </head>
      {/* <GoogleAnalytics gaId="GTM-5D97JCZ5" />
      <GoogleAnalytics gaId="G-VCXQVYV8TG" /> */}
      {/* <GoogleTagManager gtmId="G-VCXQVYV8TG" /> */}
      <GoogleTagManager gtmId="GTM-5D97JCZ5" />
      <meta name="google-site-verification" content="ace_3QdAQPGi-d0Su1tT0BZZXdGGGCA1UQn3CbKF7uw" />

      {/* Google Analytics - gtag.js */}
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
        {/* <GoogleAnalytics gaId="GTM-5D97JCZ5" /> */}


        {/* <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        > */}


        <Header2 />

        {/* <ModeToggle /> */}

        {children}
        <SpeedInsights />
        <Analytics />
        <Footer1 />
        {/* </ThemeProvider> */}
      </body>
    </html>
  );
}
