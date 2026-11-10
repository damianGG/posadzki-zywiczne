import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { serviceGroups } from "@/lib/service-navigation";
import { getAllRealizacje } from "@/lib/realizacje";
import { stoneCarpetGallery } from "@/lib/stone-carpet-gallery";
import type { RealizacjaCategory } from "@/types/realizacje";
import EditorialPhotoSlot from "@/components/editorial-photo-slot";

// Only display documented photographs from the same service category.
// An empty category deliberately gets a photo brief instead of a misleading image.
const photoCategories: Partial<Record<string, RealizacjaCategory>> = {
  "/garaze": "garaze",
  "/posadzki-zywiczne-na-balkony": "balkony-tarasy",
  "/kuchnia-salon": "domy-mieszkania",
  "/gastronomia": "kuchnie",
  "/pomieszczenia-czyste": "pomieszczenia-czyste",
};

const shotBriefs: Record<string, string> = {
  "/garaze": "Garaż po realizacji, widok całej posadzki i cokołów",
  "/posadzki-zywiczne-na-balkony": "Detal wykończenia balkonu przy progu i okapniku",
  "/kamienny-dywan": "Zbliżenie kruszywa oraz krawędzi stopnia",
  "/kuchnia-salon": "Gotowa posadzka żywiczna we wnętrzu mieszkalnym",
  "/parkingi": "Parking z rampą, odwodnieniem i oznakowaniem",
  "/hale-magazyny": "Posadzka hali z widoczną strefą ruchu wózków",
  "/gastronomia": "Posadzka w kuchni profesjonalnej, wpust i cokół",
  "/posadzki-elektrostatyczne": "Posadzka ESD w rzeczywistej strefie produkcyjnej",
  "/pomieszczenia-czyste": "Bezspoinowa powierzchnia i detal przy ścianie w cleanroomie",
};

export async function Feature5() {
  const projects = await getAllRealizacje();

  return (
    <section className="container mx-auto px-4 py-16 lg:py-24" aria-labelledby="services-heading">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">Zastosowania i realizacje</p>
      <h2 id="services-heading" className="mt-3 text-3xl font-semibold tracking-tight md:text-4xl">Zobacz, co możemy wykonać</h2>
      <p className="mt-4 max-w-2xl text-muted-foreground">
        Wybierz zastosowanie i obejrzyj naszą pracę. Tam, gdzie nie mamy jeszcze odpowiedniego ujęcia, pokazujemy dokładnie, jakie zdjęcie chcemy uzupełnić.
      </p>
      {serviceGroups.map(group => (
        <div key={group.title} className="mt-10">
          <h3 className="mb-5 text-2xl font-semibold">{group.title}</h3>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {group.items.map(item => {
              const category = photoCategories[item.href];
              const project = category
                ? projects.find(candidate => candidate.category === category && Boolean(candidate.images.main))
                : undefined;
              const stonePhoto = item.href === "/kamienny-dywan" ? stoneCarpetGallery[8] : undefined;
              const src = stonePhoto?.src || project?.images.main;
              const alt = stonePhoto?.alt || (project ? `${project.title} — ${project.location}` : undefined);
              const caption = stonePhoto
                ? stonePhoto.caption
                : project
                  ? `Z naszej realizacji: ${project.location}`
                  : "Ujęcie do uzupełnienia z własnej realizacji";

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="group overflow-hidden rounded-2xl border bg-background transition-colors hover:border-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
                >
                  <EditorialPhotoSlot
                    src={src}
                    alt={alt}
                    label={item.title}
                    caption={caption}
                    shot={shotBriefs[item.href] || item.title}
                    aspect="wide"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="!rounded-none !border-0"
                  />
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
