import Link from "next/link";
import { googleReviews, GOOGLE_MAPS_PROFILE_URL } from "@/lib/google-reviews";

const steps = [
  { number: "01", title: "Najpierw słuchamy.", text: "Opowiedz, jak korzystasz z pomieszczenia. Pomożemy dobrać wygląd, fakturę i system." },
  { number: "02", title: "Dbamy o to, czego nie widać.", text: "Oceniamy podłoże i ustalamy zakres przygotowania, warstw oraz wykończenia." },
  { number: "03", title: "Dopracowujemy szczegóły.", text: "Zwracamy uwagę na krawędzie, połączenia i sposób użytkowania gotowej posadzki." },
];

export default function HomeCraftSection() {
  const review = googleReviews.find(item => item.id === "dominik-burek");
  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16" aria-labelledby="craft-heading">
      <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-start lg:gap-16">
        <div>
          <p className="brand-eyebrow">Ludzie, nie tylko technologia</p>
          <h2 id="craft-heading" className="premium-display mt-3 max-w-xl text-3xl font-medium sm:text-4xl">Dobra posadzka zaczyna się od rozmowy.</h2>
          <p className="mt-4 max-w-xl leading-relaxed text-[#50564E]">Jesteśmy wykonawcami. Wiemy, że wybór posadzki to nie tylko kolor i cena, lecz także komfort na lata. Dlatego pomagamy zrozumieć możliwości i ograniczenia, zanim zdecydujesz się na konkretne rozwiązanie.</p>
          <Link prefetch={false} href="/kontakt" className="mt-4 inline-flex min-h-11 items-center gap-2 font-semibold text-[#273B2E] underline underline-offset-4">Poznajmy się <span aria-hidden="true">↗</span></Link>
        </div>
        {review && <figure className="rounded-xl border border-[#DADBD3] bg-[#F1EFE9] p-6 sm:p-8">
          <p className="text-sm font-semibold tracking-widest text-[#536B50]" aria-label={review.rating + " na 5 gwiazdek"}><span aria-hidden="true">★★★★★</span></p>
          <blockquote className="premium-serif mt-4 text-2xl text-[#273B2E] sm:text-3xl">„{review.content}”</blockquote>
          <figcaption className="mt-5 text-sm text-[#50564E]">
            <span className="block font-semibold text-[#242923]">{review.author}</span>
            <a href={GOOGLE_MAPS_PROFILE_URL} target="_blank" rel="noopener noreferrer" className="mt-1 inline-block underline underline-offset-4">Opinia z Google Maps</a>
          </figcaption>
        </figure>}
      </div>
      <ol className="mt-9 grid gap-6 border-t border-[#DADBD3] pt-7 sm:grid-cols-3 sm:gap-8">
        {steps.map(step => <li key={step.number} className="min-w-0">
          <span className="premium-serif text-2xl text-[#536B50]" aria-hidden="true">{step.number}</span>
          <h3 className="mt-2 text-lg font-semibold tracking-tight">{step.title}</h3>
          <p className="mt-2 text-sm leading-relaxed text-[#50564E]">{step.text}</p>
        </li>)}
      </ol>
    </section>
  );
}
