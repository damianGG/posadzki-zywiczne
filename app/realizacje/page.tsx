import { getAllRealizacje, getRealizacjeMetadata, getCategoryDisplayName } from '@/lib/realizacje';
import { RealizacjaCategory } from '@/types/realizacje';
import Image from 'next/image';
import Link from 'next/link';
import { Metadata } from 'next';
import { Badge } from '@/components/ui/badge';
import { Contact1 } from '@/blocks/contact/contact1';
import { CTA2 } from '@/blocks/cta/cta2';

export const metadata: Metadata = {
  title: 'Nasze Realizacje - Posadzki Żywiczne | Portfolio Projektów',
  description: 'Zobacz nasze najnowsze realizacje posadzek żywicznych w domach, garażach, na balkonach i tarasach. Profesjonalne wykonanie, gwarancja jakości.',
  keywords: 'realizacje posadzki żywiczne, portfolio posadzek, projekty epoksydowe, realizacje garaż, posadzka balkon realizacja',
  openGraph: {
    title: 'Nasze Realizacje - Posadzki Żywiczne | Portfolio Projektów',
    description: 'Zobacz nasze najnowsze realizacje posadzek żywicznych w domach, garażach, na balkonach i tarasach.',
    url: 'https://posadzkizywiczne.com/realizacje',
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
    canonical: 'https://posadzkizywiczne.com/realizacje',
  },
};

export const dynamic = 'force-static';

export default function RealizacjePage() {
  const realizacje = getAllRealizacje();
  const metadata = getRealizacjeMetadata();

  const categories: RealizacjaCategory[] = ['garaz', 'dom', 'balkon-taras'];

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="w-full py-20 lg:py-32 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl lg:text-5xl font-bold tracking-tight mb-6">
              Nasze Realizacje Posadzek Żywicznych
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Zobacz, jak przekształcamy przestrzenie dzięki wysokiej jakości posadzkom żywicznym. 
              Każdy projekt to historia sukcesu i zadowolenia naszych klientów.
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm">
              <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm">
                <span className="font-semibold text-2xl">{metadata.totalCount}</span>
                <span className="text-gray-600">zrealizowanych projektów</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Portfolio Grid by Category */}
      <section className="w-full py-16">
        <div className="container mx-auto px-4">
          {categories.map((category) => {
            const categoryRealizacje = realizacje.filter(r => r.category === category);
            
            if (categoryRealizacje.length === 0) return null;

            return (
              <div key={category} className="mb-20">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-3xl font-bold">
                    {getCategoryDisplayName(category)}
                  </h2>
                  <Badge variant="secondary" className="text-lg px-4 py-2">
                    {categoryRealizacje.length} {categoryRealizacje.length === 1 ? 'projekt' : 'projektów'}
                  </Badge>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {categoryRealizacje.map((realizacja) => (
                    <Link
                      key={realizacja.slug}
                      href={`/realizacje/${realizacja.slug}`}
                      className="group block"
                    >
                      <article className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 h-full flex flex-col">
                        <div className="relative h-64 overflow-hidden">
                          <Image
                            src={realizacja.images.main}
                            alt={realizacja.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          <div className="absolute top-4 right-4">
                            <Badge className="bg-white/90 text-gray-900 hover:bg-white">
                              {getCategoryDisplayName(realizacja.category)}
                            </Badge>
                          </div>
                        </div>

                        <div className="p-6 flex-1 flex flex-col">
                          <h3 className="text-xl font-semibold mb-3 group-hover:text-blue-600 transition-colors">
                            {realizacja.title}
                          </h3>
                          
                          <p className="text-gray-600 mb-4 line-clamp-2 flex-1">
                            {realizacja.description}
                          </p>

                          <div className="flex flex-wrap gap-2 text-sm text-gray-500 mt-auto">
                            <div className="flex items-center gap-1">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                              </svg>
                              <span>{realizacja.location}</span>
                            </div>
                            <span>•</span>
                            <span>{realizacja.details.surface}</span>
                            <span>•</span>
                            <span>{realizacja.details.system}</span>
                          </div>
                        </div>
                      </article>
                    </Link>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* CTA Section */}
      <CTA2 />
      
      {/* Contact Section */}
      <Contact1 />
    </div>
  );
}
