import { getCategoryDisplayName } from '@/lib/realizacje-helpers';
import type { Realizacja, RealizacjaCategory } from '@/types/realizacje';
import Image from 'next/image';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface Props {
  realizacje: Realizacja[];
  selectedCategory?: string;
}

const categories: RealizacjaCategory[] = [
  'schody', 'garaze', 'kuchnie', 'balkony-tarasy',
  'domy-mieszkania', 'pomieszczenia-czyste',
];

/**
 * Server-rendered portfolio listing. Filtering uses links to query-string URLs
 * rather than useSearchParams, so real project links remain in the initial HTML.
 */
export default function RealizacjeClient({ realizacje, selectedCategory }: Props) {
  const active: RealizacjaCategory | 'all' =
    selectedCategory && categories.includes(selectedCategory as RealizacjaCategory)
      ? selectedCategory as RealizacjaCategory
      : 'all';
  const filtered = realizacje.filter(project => active === 'all' || project.category === active);

  return (
    <>
      <section className="w-full border-b bg-white py-8" aria-label="Filtrowanie realizacji">
        <div className="container mx-auto px-4">
          <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-2">
            <span className="mr-2 text-sm font-medium text-gray-700">Kategoria:</span>
            <Button asChild variant={active === 'all' ? 'default' : 'outline'} size="sm" className="rounded-full">
              <Link href="/realizacje" aria-current={active === 'all' ? 'page' : undefined}>Wszystkie</Link>
            </Button>
            {categories.map(category => (
              <Button
                asChild
                key={category}
                variant={active === category ? 'default' : 'outline'}
                size="sm"
                className="rounded-full"
              >
                <Link
                  href={`/realizacje?kategoria=${category}`}
                  aria-current={active === category ? 'page' : undefined}
                >
                  {getCategoryDisplayName(category)}
                </Link>
              </Button>
            ))}
          </div>
        </div>
      </section>

      <section className="w-full py-16">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-6xl">
            <p className="mb-8 text-gray-600" aria-live="polite">
              Znaleziono: <span className="font-semibold">{filtered.length}</span>{' '}
              {filtered.length === 1 ? 'projekt' : 'projektów'}
            </p>
            {filtered.length === 0 ? (
              <div className="py-16 text-center">
                <p className="text-xl text-gray-600">
                  {realizacje.length === 0
                    ? 'Obecnie przygotowujemy galerię realizacji. Skontaktuj się z nami, aby zobaczyć zdjęcia wykonanych prac.'
                    : 'Nie znaleziono projektów w wybranej kategorii.'}
                </p>
                {realizacje.length === 0 ? (
                  <Button asChild className="mt-4"><Link href="/kontakt">Zapytaj o nasze realizacje</Link></Button>
                ) : (
                  <Button asChild className="mt-4"><Link href="/realizacje">Pokaż wszystkie</Link></Button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                {filtered.map(project => (
                  <Link key={project.slug} href={`/realizacje/${project.slug}`} className="group block">
                    <article className="flex h-full flex-col overflow-hidden rounded-lg bg-white shadow-md transition-shadow hover:shadow-xl">
                      <div className="relative h-64 overflow-hidden bg-gray-100">
                        {project.images.main ? (
                          <Image
                            src={project.images.main}
                            alt={project.title}
                            fill
                            className="object-cover transition-transform duration-300 group-hover:scale-105"
                            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                            quality={85}
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center text-sm text-gray-600">
                            Zdjęcia w przygotowaniu
                          </div>
                        )}
                        <Badge className="absolute left-4 top-4 bg-blue-600 text-white">
                          {getCategoryDisplayName(project.category)}
                        </Badge>
                      </div>
                      <div className="flex flex-1 flex-col p-6">
                        <h2 className="mb-3 text-xl font-semibold transition-colors group-hover:text-blue-600">
                          {project.title}
                        </h2>
                        <p className="mb-4 line-clamp-2 flex-1 text-gray-600">{project.description}</p>
                        <div className="mb-4 flex flex-wrap gap-2">
                          {(project.tags || []).slice(0, 3).map(tag => (
                            <Badge key={tag} variant="outline" className="text-xs">{tag}</Badge>
                          ))}
                        </div>
                        <p className="text-sm text-gray-500">
                          {project.location}
                          {project.details.surface ? ` · ${project.details.surface}` : ''}
                        </p>
                      </div>
                    </article>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
