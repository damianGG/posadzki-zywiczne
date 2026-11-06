import Link from "next/link";
import { Button } from "@/components/ui/button";
import { serviceGroups } from "@/lib/service-navigation";
import { industrialServices } from "@/lib/industrial-services";

export default function IndustrialServicePage({ slug }: { slug: keyof typeof industrialServices }) {
  const page = industrialServices[slug];
  const services = serviceGroups.flatMap(group => [...group.items]);
  return (
    <main>
      <section className="border-b bg-muted/30">
        <div className="container mx-auto max-w-5xl py-12 md:py-20">
          <nav aria-label="Okruszki" className="mb-8 text-sm text-muted-foreground"><Link href="/" className="hover:underline">Strona główna</Link><span aria-hidden="true"> / </span><span aria-current="page">{page.title}</span></nav>
          <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">Firma i przemysł</p>
          <h1 className="max-w-4xl text-4xl font-semibold tracking-tight md:text-5xl">{page.title}</h1>
          <p className="mt-6 max-w-3xl text-lg leading-relaxed text-muted-foreground">{page.intro}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild><Link href="/kontakt">Prześlij dane do wyceny</Link></Button>
            <Button asChild variant="outline"><a href="tel:+48507384619">Zadzwoń: 507 384 619</a></Button>
          </div>
          <p className="mt-4 text-sm text-muted-foreground">Masz wskazany system? Prześlij jego nazwę i specyfikację projektu na <a className="underline" href="mailto:biuro@posadzkizywiczne.com">biuro@posadzkizywiczne.com</a>.</p>
        </div>
      </section>
      <div className="container mx-auto max-w-5xl py-12">
        <div className="grid gap-8 md:grid-cols-2">{page.sections.map(([title, text]) => (
          <section key={title} className="rounded-xl border p-6"><h2 className="text-2xl font-semibold">{title}</h2><p className="mt-4 leading-relaxed text-muted-foreground">{text}</p></section>
        ))}</div>
        <section className="mt-12" aria-labelledby="service-faq">
          <h2 id="service-faq" className="text-2xl font-semibold">Pytania przed wyborem posadzki</h2>
          {page.questions.map(([question, answer]) => <details key={question} className="mt-4 border-b pb-4"><summary className="cursor-pointer py-2 font-medium">{question}</summary><p className="mt-2 leading-relaxed text-muted-foreground">{answer}</p></details>)}
        </section>
        <section className="mt-12 rounded-xl bg-muted/40 p-6">
          <h2 className="text-2xl font-semibold">Poznaj zakres naszych prac</h2>
          <p className="mt-3 text-muted-foreground">W portfolio znajdziesz zdjęcia i opisy wykonanych prac. Zastosowany system i zakres podajemy przy konkretnym projekcie.</p>
          <Link href="/realizacje" className="mt-4 inline-block font-semibold underline">Zobacz portfolio realizacji</Link>
        </section>
        <section className="mt-12" aria-labelledby="related-services">
          <h2 id="related-services" className="text-2xl font-semibold">Powiązane usługi</h2>
          <div className="mt-4 flex flex-wrap gap-3">{page.related.map(href => <Link key={href} href={href} className="rounded-lg border px-4 py-3 hover:bg-muted">{services.find(service => service.href === href)?.title}</Link>)}</div>
        </section>
      </div>
    </main>
  );
}
