import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { serviceGroups } from "@/lib/service-navigation";
import { stoneCarpetGallery } from "@/lib/stone-carpet-gallery";
import type { Realizacja, RealizacjaCategory } from "@/types/realizacje";
import EditorialPhotoSlot from "@/components/editorial-photo-slot";

// Curated fallbacks keep photographed services visible when the CMS is unavailable.
const photoCategories: Partial<Record<string, RealizacjaCategory>> = {
  "/garaze": "garaze",
  "/posadzki-zywiczne-na-balkony": "balkony-tarasy",
  "/kuchnia-salon": "domy-mieszkania",

};
// A contextual image is never evidence of a specific industrial system or project.
const industrialPhotos: Record<string, { src: string; alt: string; caption: string; pattern: RegExp }> = {
  "/hale-magazyny": { src: "/produkcja.jpg", alt: "Przykładowe otoczenie produkcyjne", caption: "Zdjęcie poglądowe · przemysł", pattern: /\b(hal[aeiy]|magazyn\w*|zakład produkcyjny)\b/i },
  "/parkingi": { src: "/garaz/garaz-hala.png", alt: "Poglądowy przykład dużej powierzchni posadzkowej", caption: "Materiał poglądowy · nawierzchnia pod ruch pojazdów", pattern: /\bparking\w*\b/i },
  "/gastronomia": { src: "/gastronomia.jpg", alt: "Przykładowe otoczenie gastronomiczne", caption: "Zdjęcie poglądowe · gastronomia", pattern: /\b(gastronomi\w*|kuchni\w* przemysłow\w*|zmywalni\w*)\b/i },
  "/posadzki-elektrostatyczne": { src: "/produkcja.jpg", alt: "Przykładowe otoczenie przemysłowe, nie potwierdzenie parametrów ESD", caption: "Zdjęcie poglądowe · nie dokumentacja ESD", pattern: /\bESD\b|elektrostatyczn\w*|antystatyczn\w*/i },
  "/pomieszczenia-czyste": { src: "/gastronomia.jpg", alt: "Poglądowy przykład pomieszczenia o wymaganiach higienicznych", caption: "Zdjęcie poglądowe · nie potwierdza klasy czystości", pattern: /clean\s?room|pomieszczeni\w* czyst\w*|laboratori\w*/i },
};
const servicePhotos: Record<string, { src: string; alt: string; caption: string }> = {
  "/garaze": { src: "/garaz/IMG_1253.JPG", alt: "Jasna posadzka z płatkami i cokołami w garażu", caption: "Posadzka z płatkami · zdjęcie z naszej galerii" },
  "/posadzki-zywiczne-na-balkony": { src: "/realizacje/krakow-rydlowka-balkon/IMG_1315.JPG", alt: "Balkon z jasną posadzką w płatki i żółtą balustradą", caption: "Wykończenie balkonu · z naszej galerii" },
  "/kamienny-dywan": { src: stoneCarpetGallery[0].src, alt: stoneCarpetGallery[0].alt, caption: "Kamienny dywan na stopniach i podeście" },
};

export function Feature5({ projects = [] }: { projects?: Realizacja[] }) {

  return (
    <section className="container mx-auto px-4 py-16 lg:py-24" aria-labelledby="services-heading">
      <p className="brand-eyebrow">Zastosowania i realizacje</p>
      <h2 id="services-heading" className="mt-3 text-3xl font-semibold tracking-tight md:text-4xl">Zobacz, co możemy wykonać</h2>
      <p className="mt-4 max-w-2xl text-muted-foreground">
        Wybierz miejsce, w którym planujesz posadzkę. Zobacz zdjęcia, zakres wykonania i odpowiedzi na pytania o koszt oraz codzienne użytkowanie.
      </p>
      {serviceGroups.map(group => (
        <div key={group.title} className="mt-10">
          <h3 className="brand-section-heading mb-5 text-2xl font-semibold">{group.title}</h3>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {group.items.map(item => {
              const category = photoCategories[item.href];
              const industrial = industrialPhotos[item.href];
              const project = projects.find(candidate => Boolean(candidate.images.main) && (industrial ? industrial.pattern.test(candidate.title) : candidate.category === category));
              const selectedPhoto = servicePhotos[item.href] || (!project ? industrial : undefined);
              const src = selectedPhoto?.src || project?.images.main;
              const alt = selectedPhoto?.alt || (project ? `${project.title} — ${project.location}` : undefined);
              const caption = selectedPhoto?.caption || (project ? `Z naszej realizacji: ${project.location}` : undefined);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="group overflow-hidden rounded-2xl border bg-background shadow-sm transition-colors hover:border-[#895238] focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
                >
                  <EditorialPhotoSlot
                    src={src}
                    alt={alt}
                    label={item.title}
                    caption={caption}
                    aspect="wide"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="!rounded-none !border-0"
                  />
                  {!src && <h4 className="px-5 pt-5 text-lg font-semibold">{item.title}</h4>}
                  <div className="flex items-start justify-between gap-4 p-5">
                    <p className="text-sm leading-relaxed text-muted-foreground">{item.description}</p>
                    <ArrowRight className="mt-1 h-4 w-4 shrink-0 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      ))}
    </section>
  );
}
