
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
const inter = Inter({ subsets: ["latin"] });
import { GoogleAnalytics } from '@next/third-parties/google'
import type { Metadata } from 'next'

export const metadata: Metadata = {

  title: "Posadzki żywiczne | Remonty balkonów i tarasów | Gwarancja",
  description:
    "Specjalizujemy się w posadzkach żywicznych i remontach balkonów oraz tarasów. Zapewniamy profesjonalne doradztwo i kompleksową realizację. Sprawdź naszą ofertę!",
  keywords:
    "posadzki żywiczne, balkony, tarasy, posadzki dekoracyjne, żywica epoksydowa, Warszawa, Kraków, Rzeszów",
  openGraph: {
    title: "Posadzki żywiczne | Remonty balkonów i tarasów | Gwarancja",
    description:
      "Specjalizujemy się w posadzkach żywicznych i remontach balkonów oraz tarasów. Zapewniamy profesjonalne doradztwo i kompleksową realizację. Sprawdź naszą ofertę!",
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
    title: "Posadzki żywiczne | Remonty balkonów i tarasów | Gwarancja",
    description:
      "Specjalizujemy się w posadzkach żywicznych i remontach balkonów oraz tarasów. Zapewniamy profesjonalne doradztwo i kompleksową realizację. Sprawdź naszą ofertę!",
    images: ["https://posadzkizywiczne.com/images/home-banner.jpg"],
  },
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pl">
      <GoogleAnalytics gaId="GTM-5D97JCZ5" />
      <GoogleAnalytics gaId="G-VCXQVYV8TG" />
      <meta name="google-site-verification" content="ace_3QdAQPGi-d0Su1tT0BZZXdGGGCA1UQn3CbKF7uw" />
      <body className={inter.className}>
        <GoogleAnalytics gaId="GTM-5D97JCZ5" />

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
