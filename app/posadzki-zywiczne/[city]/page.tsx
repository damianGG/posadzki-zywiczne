import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllRealizacje } from "@/lib/realizacje";
import { absoluteUrl, SITE_EMAIL, SITE_PHONE, SITE_URL } from "@/lib/site-config";
import { generatePageMetadata } from "@/lib/seo";
import { getBreadcrumbSchema } from "@/lib/structured-data";
import { getLocalServicePage, isProjectInCity, localServicePages } from "@/lib/local-service-pages";

export const revalidate = 300;
export const dynamicParams = false;

type Props = { params: Promise<{ city: string }> };

export function generateStaticParams() {
  return Object.keys(localServicePages).map(city => ({ city }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { city } = await params;
  const page = getLocalServicePage(city);
  if (!page) return { robots: { index: false }, title: "Nie znaleziono strony" };
  return generatePageMetadata({
    title: page.title,
    description: page.description,
    path: `/posadzki-zywiczne/${page.slug}`,
    image: "/garaz/garaz-zywica-2.jpg",
  });
}

function jsonLd(value: unknown): string {
  return JSON.stringify(value).replace(/</g, "\\u003c");
}

function formatSurface(value: string): string {
  const number = value.trim();
  return /^\d+(?:[.,]\d+)?$/.test(number) ? number + " m²" : number;
}

export default async function LocalServicePage({ params }: Props) {
  const { city } = await params;
  const page = getLocalServicePage(city);
  if (!page) notFound();

  const url = absoluteUrl(`/posadzki-zywiczne/${page.slug}`);
  const projects = (await getAllRealizacje())
    .filter(project =>
      Boolean(project.slug && project.images.main) &&
      isProjectInCity(project.location, page.city),
    ).slice(0, 6);

  const breadcrumbs = getBreadcrumbSchema([
    { name: "Strona główna", url: SITE_URL },
    { name: "Posadzki żywiczne " + page.city, url },
  ]);

  const service = {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": url + "#service",
    name: "Wykonanie posadzek żywicznych " + page.city,
    serviceType: "Wykonanie posadzek żywicznych",
    description: page.description,
    url,
    provider: { "@id": SITE_URL + "/#organization" },
    areaServed: { "@type": "City", name: page.city, address: { "@type": "PostalAddress", addressCountry: "PL" } },
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
  };

  // Only mark up photos that are actually displayed and have a verified DB location.
  const gallery = projects.map(project => ({
    "@type": "ImageObject",
    contentUrl: project.images.main,
    caption: project.title + " – " + project.location,
    associatedMedia: { "@type": "WebPage", url: absoluteUrl("/realizacje/" + project.slug) },
  }));

  return (
    <main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(breadcrumbs) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(service) }} />
      {gallery.length > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: jsonLd({
              "@context": "https://schema.org",
              "@type": "ImageGallery",
              "@id": url + "#galeria",
              name: "Udokumentowane realizacje – " + page.city,
              image: gallery,
            }),
          }}
        />
      )}

      <div className="border-b bg-muted/30">
        <div className="container mx-auto max-w-6xl px-4 py-4">
          <nav aria-label="Ścieżka nawigacji" className="text-sm text-muted-foreground">
            <Link href="/" className="hover:underline">Strona główna</Link>
            <span className="mx-2" aria-hidden="true">/</span>
            <span aria-current="page">Posadzki żywiczne {page.city}</span>
          </nav>
        </div>
      </div>

      <header className="bg-gradient-to-b from-zinc-50 to-background py-14 md:py-20">
        <div className="container mx-auto max-w-6xl px-4">
          <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-primary">Wykonawca posadzek żywicznych</p>
          <h1 className="max-w-4xl text-4xl font-bold leading-tight tracking-tight md:text-6xl">
            Posadzki żywiczne {page.city}
          </h1>
          <p className="mt-6 max-w-3xl text-lg leading-relaxed text-muted-foreground md:text-xl">
            {page.lead}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link className="inline-flex items-center rounded-lg bg-primary px-6 py-3 font-semibold text-primary-foreground hover:opacity-90" href="/kontakt">
              Poproś o wycenę
            </Link>
            <a className="inline-flex items-center rounded-lg border px-6 py-3 font-semibold hover:bg-muted" href={`tel:${SITE_PHONE}`}>
              Zadzwoń: 507 384 619
            </a>
          </div>
          <p className="mt-4 text-sm text-muted-foreground">
            {projects.length > 0
              ? `Poniżej prezentujemy ${projects.length} projektów z dokumentacją zdjęciową i lokalizacją: ${page.city}.`
              : "Zdjęcia ukończonych projektów publikujemy w portfolio wraz z informacją o ich lokalizacji."}
          </p>
        </div>
      </header>

      <section className="container mx-auto max-w-6xl px-4 py-12">
        <h2 className="text-2xl font-bold md:text-3xl">Jak dobieramy posadzkę {page.cityLocative}?</h2>
        <p className="mt-4 max-w-4xl leading-relaxed text-muted-foreground">{page.localContext}</p>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {[
            { title: "Ocena podłoża", description: "Sprawdzamy stan betonu, rysy, wilgotność i istniejące warstwy." },
            { title: "Dobór systemu", description: "Ustalamy wymaganą odporność, fakturę, grubość i warunki eksploatacji." },
            { title: "Wycena i realizacja", description: "Przygotowujemy zakres, harmonogram oraz zalecenia użytkowania." },
          ].map(item => (
            <div key={item.title} className="rounded-xl border bg-background p-6">
              <h3 className="font-semibold">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.description}</p>
            </div>
          ))}
        </div>
      </section>

      {projects.length > 0 && (
        <section className="bg-muted/30 py-14" aria-labelledby="local-projects-heading">
          <div className="container mx-auto max-w-6xl px-4">
            <h2 id="local-projects-heading" className="text-2xl font-bold md:text-3xl">
              Posadzki żywiczne {page.city} – zdjęcia naszych realizacji
            </h2>
            <p className="mt-3 max-w-3xl leading-relaxed text-muted-foreground">
              Poniższe zdjęcia pochodzą z opublikowanych kart wykonanych projektów.
              Przy każdej realizacji podajemy jej lokalizację i udokumentowane szczegóły.
            </p>
            <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {projects.map(project => (
                <Link key={project.slug} href={`/realizacje/${project.slug}`}
                  className="group overflow-hidden rounded-xl border bg-background transition-shadow hover:shadow-lg">
                  <div className="relative aspect-[4/3]">
                    <Image src={project.images.main}
                      alt={`${project.title} – ${project.location}`}
                      fill sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover transition-transform duration-300 group-hover:scale-105" />
                  </div>
                  <div className="p-5">
                    <h3 className="font-semibold leading-snug group-hover:text-primary">{project.title}</h3>
                    <p className="mt-2 text-sm text-muted-foreground">
                      {project.location}
                      {project.details.surface && " · " + formatSurface(project.details.surface)}
                    </p>
                    {project.details.system && <p className="mt-2 text-sm">{project.details.system}</p>}
                    <span className="mt-3 block text-sm font-medium text-primary">Zobacz zdjęcia i opis prac</span>
                  </div>
                </Link>
              ))}
            </div>
            <Link href="/realizacje" className="mt-7 inline-block font-medium text-primary underline-offset-4 hover:underline">
              Zobacz całe portfolio
            </Link>
          </div>
        </section>
      )}

      <section className="container mx-auto max-w-6xl space-y-12 px-4 py-14">
        {page.sections.map(section => (
          <div key={section.title} className="max-w-4xl">
            <h2 className="text-2xl font-bold">{section.title}</h2>
            {section.paragraphs.map(text => <p key={text} className="mt-4 leading-relaxed text-muted-foreground">{text}</p>)}
          </div>
        ))}
        <div className="max-w-4xl rounded-xl border p-6">
          <h2 className="text-2xl font-bold">Wycena posadzki – czego potrzebujemy?</h2>
          <p className="mt-3 leading-relaxed text-muted-foreground">
            Podaj metraż, miejscowość, zdjęcia podłoża i planowane zastosowanie.
            Wycena zależy między innymi od przygotowania betonu, napraw, systemu,
            wykończenia i szczegółów takich jak cokoły i dylatacje.
            Bez oceny podłoża nie podajemy niezweryfikowanej ceny za m².
          </p>
          <div className="mt-4 flex flex-wrap gap-4">
            <Link href="/kontakt" className="font-semibold text-primary underline-offset-4 hover:underline">Wyślij zapytanie</Link>
            <a href={`mailto:${SITE_EMAIL}`} className="font-semibold text-primary underline-offset-4 hover:underline">{SITE_EMAIL}</a>
          </div>
        </div>
      </section>

      <section className="bg-muted/30 py-14" aria-labelledby="faq-heading">
        <div className="container mx-auto max-w-6xl px-4">
          <h2 id="faq-heading" className="text-2xl font-bold md:text-3xl">Pytania o posadzki żywiczne {page.cityLocative}</h2>
          <dl className="mt-6 grid max-w-4xl gap-5">
            {page.faq.map(item => (
              <div key={item.question} className="rounded-xl border bg-background p-6">
                <dt className="font-semibold">{item.question}</dt>
                <dd className="mt-3 leading-relaxed text-muted-foreground">{item.answer}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="container mx-auto max-w-6xl px-4 py-14">
        <h2 className="text-2xl font-bold">Zobacz szczegóły oferty i poradniki</h2>
        <div className="mt-5 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Link href="/garaze" className="rounded-lg border p-5 font-semibold hover:border-primary">Posadzki żywiczne do garaży</Link>
          <Link href="/posadzki-zywiczne-na-balkony" className="rounded-lg border p-5 font-semibold hover:border-primary">Balkony i tarasy</Link>
          <Link href="/posadzki-elektrostatyczne" className="rounded-lg border p-5 font-semibold hover:border-primary">Posadzki elektrostatyczne ESD</Link>
          <Link href={`/blog/posadzki-zywiczne-${page.slug}`} className="rounded-lg border p-5 font-semibold hover:border-primary">
            Poradnik techniczny – {page.city}
          </Link>
        </div>
        <p className="mt-8 text-muted-foreground">
          Prace wyceniamy indywidualnie po ustaleniu zakresu.{" "}
          <Link href="/kontakt" className="font-semibold text-primary hover:underline">Skontaktuj się w sprawie realizacji {page.cityLocative}.</Link>
        </p>
      </section>
    </main>
  );
}
