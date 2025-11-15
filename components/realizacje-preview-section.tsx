import { getLatestRealizacje, getCategoryDisplayName, getTypeDisplayName } from '@/lib/realizacje';
import Image from 'next/image';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';

interface RealizacjePreviewSectionProps {
  title?: string;
  subtitle?: string;
  limit?: number;
}

export default function RealizacjePreviewSection({
  title = "Nasze Najnowsze Realizacje",
  subtitle = "Zobacz, jak tworzymy piękne i trwałe posadzki dla naszych klientów",
  limit = 3
}: RealizacjePreviewSectionProps) {
  const realizacje = getLatestRealizacje(limit);

  if (realizacje.length === 0) {
    return null;
  }

  return (
    <section className="w-full py-16 lg:py-24 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold tracking-tight mb-4">
            {title}
          </h2>
          <p className="text-lg text-gray-600">
            {subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {realizacje.map((realizacja) => (
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
                  <div className="absolute top-4 left-4 right-4 flex justify-between items-start">
                    <Badge className="bg-blue-600 text-white hover:bg-blue-700">
                      {getCategoryDisplayName(realizacja.category)}
                    </Badge>
                    <Badge variant="secondary" className="bg-white/90 text-gray-900">
                      {getTypeDisplayName(realizacja.type)}
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
                  </div>
                </div>
              </article>
            </Link>
          ))}
        </div>

        <div className="text-center">
          <Link
            href="/realizacje"
            className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Zobacz wszystkie realizacje
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
