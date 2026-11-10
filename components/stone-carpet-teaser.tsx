import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { stoneCarpetGallery } from "@/lib/stone-carpet-gallery";

export default function StoneCarpetTeaser() {
  const stairs = stoneCarpetGallery[0];
  const detail = stoneCarpetGallery[8];

  return (
    <aside className="mx-auto my-12 grid max-w-6xl gap-7 overflow-hidden rounded-2xl border bg-muted/20 p-5 sm:p-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center" aria-labelledby="stone-teaser-heading">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Powierzchnia w zbliżeniu</p>
        <h2 id="stone-teaser-heading" className="mt-3 text-2xl font-semibold tracking-tight sm:text-3xl">Kamienny dywan na taras i schody</h2>
        <p className="mt-4 leading-relaxed text-muted-foreground">
          Zobacz fakturę naturalnego kruszywa, detal przy krawędzi stopnia i gotowy efekt.
          Opisujemy też hydroizolację, układ warstw i pielęgnację.
        </p>
        <Link href="/kamienny-dywan" className="mt-6 inline-flex items-center gap-2 font-semibold text-primary hover:underline">
          Poznaj ofertę kamiennego dywanu <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </div>
      <div className="grid grid-cols-[1.25fr_0.75fr] gap-3">
        {[stairs, detail].map(photo => (
          <figure key={photo.id} className="min-w-0">
            <div className="relative aspect-[3/4] overflow-hidden rounded-xl bg-zinc-100">
              <Image src={photo.src} alt={photo.alt} fill sizes="(max-width: 1024px) 50vw, 30vw" className="object-cover" />
            </div>
            <figcaption className="mt-2 text-xs leading-snug text-muted-foreground">{photo.caption}</figcaption>
          </figure>
        ))}
      </div>
    </aside>
  );
}
