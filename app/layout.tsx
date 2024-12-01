import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
// import { Header } from "@/components/header";
import Header1 from "@/blocks/header/header1"
import { ModeToggle } from "@/components/ui/mode-toggle";
import { Header2 } from "@/blocks/header/header2";
import { Header3 } from "@/blocks/header/header3";
import { Footer1 } from "@/blocks/footer/footer1";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Posadzki Żywiczne na Balkony i Tarasy | Profesjonalne Usługi",
  description: "Specjalizujemy się w wykonywaniu posadzek żywicznych na balkony, tarasy i do wnętrz. Gwarancja jakości i trwałości. Skontaktuj się z nami!",
  keywords: "posadzki żywiczne, balkony, tarasy, posadzki dekoracyjne, żywica epoksydowa, Warszawa, Kraków,Rzeszów",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pl">
      <head>
        <meta
          property="og:title"
          content="TWBlocks - Free SaaS website blocks"
        />
        <meta
          property="og:description"
          content="Free SaaS website blocks based on React with shadcn & Tailwind"
        />
        <meta
          property="og:image"
          content="https://raw.githubusercontent.com/tommyjepsen/twblocks/main/public/hero4.png?raw=true"
        />
      </head>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >

          <Header2 />

          {/* <ModeToggle /> */}

          {children}
          <Footer1 />
        </ThemeProvider>
      </body>
    </html>
  );
}
