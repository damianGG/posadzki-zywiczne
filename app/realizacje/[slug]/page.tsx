import { getAllRealizacje, getRealizacjaBySlug, getCategoryDisplayName } from '@/lib/realizacje';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Metadata } from 'next';
import { Badge } from '@/components/ui/badge';
import { Contact1 } from '@/blocks/contact/contact1';
import { CTA2 } from '@/blocks/cta/cta2';
import { ImageGallery } from '@/components/ui/image-gallery';

// Revalidate every 60 seconds to show new realizacje
export const revalidate = 60;

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const realizacje = await getAllRealizacje();
  return realizacje.map((realizacja) => ({
    slug: realizacja.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const realizacja = await getRealizacjaBySlug(slug);

  if (!realizacja) {
    return {
      title: 'Realizacja nie znaleziona',
    };
  }

  return {
    title: `${realizacja.title} | Realizacje Posadzek Żywicznych`,
    description: realizacja.description,
    keywords: realizacja.keywords.join(', '),
    openGraph: {
      title: realizacja.title,
      description: realizacja.description,
      url: `https://posadzkizywiczne.com/realizacje/${slug}`,
      images: [
        {
          url: `https://posadzkizywiczne.com${realizacja.images.main}`,
          width: 1200,
          height: 630,
          alt: realizacja.title,
        },
      ],
      type: 'article',
      publishedTime: realizacja.date,
    },
    alternates: {
      canonical: `https://posadzkizywiczne.com/realizacje/${slug}`,
    },
  };
}

export default async function RealizacjaDetailPage({ params }: Props) {
  const { slug } = await params;
  const realizacja = await getRealizacjaBySlug(slug);

  if (!realizacja) {
    notFound();
  }

  // Get related projects from the same category
  const allRealizacje = await getAllRealizacje();
  const relatedProjects = allRealizacje
    .filter(r => r.category === realizacja.category && r.slug !== realizacja.slug)
    .slice(0, 3);

  // Structured data for SEO
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: realizacja.title,
    description: realizacja.description,
    image: `https://posadzkizywiczne.com${realizacja.images.main}`,
    datePublished: realizacja.date,
    author: {
      '@type': 'Organization',
      name: 'Posadzki Żywiczne',
      url: 'https://posadzkizywiczne.com',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Posadzki Żywiczne',
      url: 'https://posadzkizywiczne.com',
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <div className="w-full">
        {/* Breadcrumbs */}
        <div className="w-full bg-gray-50 py-4">
          <div className="container mx-auto px-4">
            <nav className="flex items-center gap-2 text-sm text-gray-600">
              <Link href="/" className="hover:text-blue-600">
                Strona główna
              </Link>
              <span>/</span>
              <Link href="/realizacje" className="hover:text-blue-600">
                Realizacje
              </Link>
              <span>/</span>
              <span className="text-gray-900">{realizacja.title}</span>
            </nav>
          </div>
        </div>

        {/* Hero Section */}
        <section className="w-full py-12 lg:py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <Badge className="mb-4">
                {getCategoryDisplayName(realizacja.category)}
              </Badge>
              
              <h1 className="text-3xl lg:text-5xl font-bold tracking-tight mb-6">
                {realizacja.title}
              </h1>

              <div className="flex flex-wrap gap-6 text-gray-600 mb-8">
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span>{realizacja.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span>{new Date(realizacja.date).toLocaleDateString('pl-PL', { year: 'numeric', month: 'long' })}</span>
                </div>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-6">
                {realizacja.tags.map((tag) => (
                  <Badge key={tag} variant="outline">
                    {tag}
                  </Badge>
                ))}
              </div>

              <p className="text-xl text-gray-700 leading-relaxed">
                {realizacja.description}
              </p>
            </div>
          </div>
        </section>

        {/* Main Image with Gallery */}
        <section className="w-full py-8">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <ImageGallery 
                images={realizacja.images.gallery}
                mainImage={realizacja.images.main}
                title={realizacja.title}
              />
            </div>
          </div>
        </section>

        {/* Details Grid */}
        <section className="w-full py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl font-bold mb-6">Szczegóły projektu</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="text-sm font-semibold text-gray-500 uppercase mb-2">Powierzchnia</h3>
                  <p className="text-2xl font-bold">{realizacja.details.surface}</p>
                </div>
                
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="text-sm font-semibold text-gray-500 uppercase mb-2">System</h3>
                  <p className="text-2xl font-bold">{realizacja.details.system}</p>
                </div>
                
                {realizacja.details.color && (
                  <div className="bg-gray-50 p-6 rounded-lg">
                    <h3 className="text-sm font-semibold text-gray-500 uppercase mb-2">Kolor</h3>
                    <p className="text-2xl font-bold">{realizacja.details.color}</p>
                  </div>
                )}
                
                {realizacja.details.duration && (
                  <div className="bg-gray-50 p-6 rounded-lg">
                    <h3 className="text-sm font-semibold text-gray-500 uppercase mb-2">Czas realizacji</h3>
                    <p className="text-2xl font-bold">{realizacja.details.duration}</p>
                  </div>
                )}
              </div>

              {/* Features */}
              <div className="mb-12">
                <h2 className="text-2xl font-bold mb-6">Zastosowane rozwiązania</h2>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {realizacja.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <svg className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Gallery thumbnails - now part of ImageGallery component */}
              {realizacja.images.gallery.length > 0 && (
                <div className="mb-12">
                  <h2 className="text-2xl font-bold mb-6">Więcej zdjęć</h2>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {realizacja.images.gallery.map((image, index) => (
                      <div key={index} className="relative aspect-square rounded-lg overflow-hidden shadow-md">
                        <Image
                          src={image}
                          alt={`${realizacja.title} - zdjęcie ${index + 1}`}
                          fill
                          className="object-cover hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Client Testimonial */}
              {realizacja.clientTestimonial && (
                <div className="bg-blue-50 p-8 rounded-lg border-l-4 border-blue-600 mb-12">
                  <h2 className="text-2xl font-bold mb-4">Opinia klienta</h2>
                  <p className="text-lg text-gray-700 italic mb-4">
                    &ldquo;{realizacja.clientTestimonial.content}&rdquo;
                  </p>
                  <p className="text-gray-600 font-semibold">
                    — {realizacja.clientTestimonial.author}
                  </p>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Related Projects */}
        {relatedProjects.length > 0 && (
          <section className="w-full py-16 bg-gray-50">
            <div className="container mx-auto px-4">
              <div className="max-w-6xl mx-auto">
                <h2 className="text-3xl font-bold mb-8">Podobne realizacje</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {relatedProjects.map((related) => (
                    <Link
                      key={related.slug}
                      href={`/realizacje/${related.slug}`}
                      className="group block"
                    >
                      <article className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300">
                        <div className="relative h-48 overflow-hidden">
                          <Image
                            src={related.images.main}
                            alt={related.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                        <div className="p-4">
                          <h3 className="font-semibold mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
                            {related.title}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {related.location}
                          </p>
                        </div>
                      </article>
                    </Link>
                  ))}
                </div>

                <div className="text-center mt-8">
                  <Link
                    href="/realizacje"
                    className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold"
                  >
                    Zobacz wszystkie realizacje
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* CTA */}
        <CTA2 />
        
        {/* Contact */}
        <Contact1 />
      </div>
    </>
  );
}
