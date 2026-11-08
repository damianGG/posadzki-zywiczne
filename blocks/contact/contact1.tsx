import { Mail, Phone } from "lucide-react";

// Static contact block: no client-side hydration or calendar libraries required.
export const Contact1 = () => (
  <section id="kontakt" aria-labelledby="contact-heading" className="w-full py-16 lg:py-24">
    <div className="container mx-auto max-w-6xl px-4">
      <div className="max-w-2xl">
        <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          Kontakt
        </p>
        <h2 id="contact-heading" className="text-3xl font-semibold tracking-tight md:text-4xl">
          Porozmawiajmy o Twojej posadzce
        </h2>
        <p className="mt-4 text-base leading-relaxed text-muted-foreground md:text-lg">
          Napisz, gdzie planujesz prace i jaki jest przybliżony metraż.
          Jeśli masz zdjęcia podłoża, dołącz je do wiadomości — to ułatwi wycenę.
        </p>
        <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:gap-8">
          <a href="tel:+48507384619" className="inline-flex items-center gap-3 font-semibold underline-offset-4 hover:underline">
            <Phone className="h-5 w-5 shrink-0" aria-hidden="true" />
            507 384 619
          </a>
          <a href="mailto:biuro@posadzkizywiczne.com" className="inline-flex items-center gap-3 font-semibold underline-offset-4 hover:underline">
            <Mail className="h-5 w-5 shrink-0" aria-hidden="true" />
            biuro@posadzkizywiczne.com
          </a>
        </div>
      </div>
    </div>
  </section>
);
