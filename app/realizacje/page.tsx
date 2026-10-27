import { getAllRealizacje } from '@/lib/realizacje';
import { Contact1 } from '@/blocks/contact/contact1';
import { CTA2 } from '@/blocks/cta/cta2';
import { Metadata } from 'next';
import { absoluteUrl } from '@/lib/site-config';
import RealizacjeClient from './realizacje-client';

// Revalidate every 60 seconds to show new realizacje
export const revalidate = 60;

export const metadata: Metadata = {
  title: 'Realizacje posadzek żywicznych | Zdjęcia i opis prac',
  description: 'Zobacz nasze najnowsze realizacje posadzek żywicznych w domach, garażach, na balkonach i tarasach. Profesjonalne wykonanie, gwarancja jakości.',
  keywords: 'realizacje posadzki żywiczne, portfolio posadzek, projekty epoksydowe, realizacje garaż, posadzka balkon realizacja',
  openGraph: {
    title: 'Realizacje posadzek żywicznych | Zdjęcia i opis prac',
    description: 'Zobacz nasze najnowsze realizacje posadzek żywicznych w domach, garażach, na balkonach i tarasach.',
    url: absoluteUrl("/realizacje"),
    images: [
      {
        url: 'https://posadzkizywiczne.com/garaz/garaz-zywica-2.jpg',
        width: 1200,
        height: 630,
        alt: 'Realizacje posadzek żywicznych',
      },
    ],
  },
  alternates: {
    canonical: absoluteUrl("/realizacje"),
  },
};

type Props = { searchParams: Promise<{ kategoria?: string | string[] }> };

export default async function RealizacjePage({ searchParams }: Props) {
  const { kategoria } = await searchParams;
  const selectedCategory = typeof kategoria === 'string' ? kategoria : undefined;
  const allRealizacje = await getAllRealizacje();

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="w-full py-20 lg:py-32 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl lg:text-5xl font-bold tracking-tight mb-6">
              Nasze kilka ostatnich realizacji
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Zobacz ostatnio zrealizowane projekty posadzek żywicznych. 
              Każda realizacja to unikalne rozwiązanie dostosowane do potrzeb klienta.
            </p>
          </div>
        </div>
      </section>

      {/* Filters and cards are rendered on the server, also for search crawlers. */}
      <RealizacjeClient realizacje={allRealizacje} selectedCategory={selectedCategory} />

      {/* CTA Section */}
      <CTA2 />
      
      {/* Contact Section */}
      <Contact1 />
    </div>
  );
}
