import Link from "next/link";
import { Button } from "@/components/ui/button";
import { serviceGroups } from "@/lib/service-navigation";
import RelatedSystems from "@/components/related-systems";
import { industrialServices } from "@/lib/industrial-services";
import EditorialPhotoSlot from "@/components/editorial-photo-slot";

const photoBriefs: Record<keyof typeof industrialServices, {
  hero: string;
  details: [string, string];
}> = {
  "parkingi": {
    hero: "Szeroki plan parkingu z rzeczywistą rampą i posadzką",
    details: ["Detal rampy z antypoślizgową fakturą", "Wpust, dylatacja lub połączenie przy ścianie"],
  },
  "hale-magazyny": {
    hero: "Posadzka w hali ze strefą pracy lub ruchem wózków",
    details: ["Zbliżenie nawierzchni przy kołach wózka", "Naprawa betonu i dylatacja przed wykonaniem systemu"],
  },
  "gastronomia": {
    hero: "Wykonana posadzka w kuchni profesjonalnej lub zmywalni",
    details: ["Wyoblony cokół przy ścianie kuchni", "Odwodnienie i detal przy wpuscie podłogowym"],
  },
  "pomieszczenia-czyste": {
    hero: "Gotowa posadzka w rzeczywistym pomieszczeniu kontrolowanym",
    details: ["Bezspoinowe połączenie posadzki ze ścianą", "Detal wykończenia przy przejściu instalacyjnym"],
  },
};

export default function IndustrialServicePage({ slug }: { slug: keyof typeof industrialServices }) {
  const page = industrialServices[slug];
  const brief = photoBriefs[slug];
  const services = serviceGroups.flatMap(group => [...group.items]);

  return (
    <main>
      <section className="border-b bg-muted/30">
        <div className="container mx-auto grid max-w-6xl gap-10 px-4 py-12 md:py-20 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div>
            <nav aria-label="Okruszki" className="mb-8 text-sm text-muted-foreground">
              <Link href="/" className="hover:underline">Strona główna</Link>
              <span aria-hidden="true"> / </span><span aria-current="page">{page.title}</span>
            </nav>
            <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">Firma i przemysł</p>
            <h1 className="max-w-4xl text-4xl font-semibold tracking-tight md:text-5xl">{page.title}</h1>
            <p className="mt-6 max-w-3xl text-lg leading-relaxed text-muted-foreground">{page.intro}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild><Link href="/kontakt">Prześlij dane do wyceny</Link></Button>
              <Button asChild variant="outline"><a href="tel:+48507384619">Zadzwoń: 507 384 619</a></Button>
            </div>
            <p className="mt-4 text-sm text-muted-foreground">
              Masz wskazany system? Prześlij jego nazwę i specyfikację projektu na{" "}
              <a className="underline" href="mailto:biuro@posadzkizywiczne.com">biuro@posadzkizywiczne.com</a>.
            </p>
          </div>
          <EditorialPhotoSlot
            label={page.title}
            shot={brief.hero}
            caption="Miejsce na zdjęcie z autentycznej inwestycji."
            sizes="(max-width: 1024px) 100vw, 45vw"
          />
        </div>
      </section>

      <div className="container mx-auto max-w-6xl px-4 py-12">
        <div className="grid gap-8 md:grid-cols-2">
          {page.sections.map(([title, description]) => (
            <section key={title} className="rounded-xl border p-6">
              <h2 className="text-2xl font-semibold">{title}</h2>
              <p className="mt-4 leading-relaxed text-muted-foreground">{description}</p>
            </section>
          ))}
        </div>

        <section className="mt-14" aria-labelledby="industrial-visual-details">
          <h2 id="industrial-visual-details" className="text-2xl font-semibold md:text-3xl">Detale, które pokazują jakość wykonania</h2>
          <p className="mt-3 max-w-3xl text-muted-foreground">
            W tych miejscach chcemy pokazać rzeczywiste zbliżenia zamiast ogólnych ilustracji.
          </p>
          <div className="mt-6 grid gap-5 md:grid-cols-2">
            {brief.details.map((shot, index) => (
              <EditorialPhotoSlot
                key={shot}
                label={index === 0 ? "Detal powierzchni" : "Detal techniczny"}
                shot={shot}
                aspect="wide"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            ))}
          </div>
        </section>

        <section className="mt-12" aria-labelledby="service-faq">
          <h2 id="service-faq" className="text-2xl font-semibold">Pytania przed wyborem posadzki</h2>
          {page.questions.map(([question, answer]) => (
            <details key={question} className="mt-4 border-b pb-4">
              <summary className="cursor-pointer py-2 font-medium">{question}</summary>
              <p className="mt-2 leading-relaxed text-muted-foreground">{answer}</p>
            </details>
          ))}
        </section>
        <section className="mt-12 rounded-xl bg-muted/40 p-6">
          <h2 className="text-2xl font-semibold">Poznaj zakres naszych prac</h2>
          <p className="mt-3 text-muted-foreground">
            W portfolio znajdziesz zdjęcia i opisy wykonanych prac. Zastosowany system i zakres podajemy przy konkretnym projekcie.
          </p>
          <Link href="/realizacje" className="mt-4 inline-block font-semibold underline">Zobacz portfolio realizacji</Link>
        </section>
        {(slug === "parkingi" || slug === "hale-magazyny") && (
          <RelatedSystems application={slug === "parkingi" ? "parkingi" : "hale"} />
        )}
        <section className="mt-12" aria-labelledby="related-services">
          <h2 id="related-services" className="text-2xl font-semibold">Powiązane usługi</h2>
          <div className="mt-4 flex flex-wrap gap-3">
            {page.related.map(href => (
              <Link key={href} href={href} className="rounded-lg border px-4 py-3 hover:bg-muted">
                {services.find(service => service.href === href)?.title}
              </Link>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
