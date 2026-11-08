import { ExternalLink, Star } from "lucide-react";
import GoogleReviewsCarousel from "@/components/google-reviews-carousel";
import {
  GOOGLE_MAPS_PROFILE_URL,
  displayedReviewsAverage,
  googleReviews,
} from "@/lib/google-reviews";

export default function GoogleReviewsSection() {
  return (
    <section
      id="opinie-google"
      aria-labelledby="opinie-google-heading"
      className="w-full overflow-hidden bg-[#f7f8fa] py-16 text-slate-800 md:py-24"
    >
      <div className="container mx-auto max-w-6xl px-4 md:px-6">
        <div className="mx-auto max-w-3xl text-center">
          <p className="mb-4 text-xs font-bold uppercase tracking-[0.24em] text-primary sm:text-sm">
            Opinie klientów
          </p>
          <h2
            id="opinie-google-heading"
            className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl md:text-5xl"
          >
            Co mówią klienci po wykonaniu posadzki?
          </h2>
          <p className="mt-4 text-base text-slate-600">
            Zobacz opinie klientów o naszej pracy opublikowane w Google.
          </p>

          <a
            href={GOOGLE_MAPS_PROFILE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="mx-auto mt-9 inline-flex flex-wrap items-center justify-center gap-3 rounded-full border border-slate-200 bg-white px-6 py-4 shadow-sm transition-shadow hover:shadow-md"
            aria-label="Zobacz wizytówkę Posadzkizywiczne.com i opinie w Google Maps"
          >
            <span className="flex items-center gap-2 font-semibold text-slate-700">
              <span aria-hidden="true" className="bg-gradient-to-br from-blue-500 via-red-500 to-green-500 bg-clip-text text-2xl font-extrabold text-transparent">G</span>
              Google
            </span>
            <strong className="text-2xl text-slate-900">
              {displayedReviewsAverage.toLocaleString("pl-PL", {
                minimumFractionDigits: 1,
                maximumFractionDigits: 1,
              })}
            </strong>
            <span
              className="flex items-center gap-0.5"
              aria-label={"Średnia " + displayedReviewsAverage + " na 5 z prezentowanych opinii"}
            >
              {Array.from({ length: 5 }, (_, index) => (
                <Star
                  key={index}
                  className={
                    index < Math.round(displayedReviewsAverage)
                      ? "h-5 w-5 fill-amber-400 text-amber-400"
                      : "h-5 w-5 text-slate-300"
                  }
                  aria-hidden="true"
                />
              ))}
            </span>
            <span className="w-full text-xs text-slate-500 sm:w-auto">
              z {googleReviews.length} pokazanych opinii
            </span>
          </a>
          <p className="mt-3 text-xs text-slate-500">
            To średnia z prezentowanych ocen, nie całkowita ocena wizytówki Google.
          </p>
        </div>

        <div className="mt-12 md:mt-14">
          <GoogleReviewsCarousel reviews={googleReviews} />
        </div>

        <div className="mt-12 flex flex-col items-center gap-3 text-center">
          <a
            href={GOOGLE_MAPS_PROFILE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 font-semibold text-primary underline-offset-4 hover:underline"
          >
            Zobacz wszystkie opinie w Google Maps
            <ExternalLink className="h-4 w-4" aria-hidden="true" />
          </a>
          <p className="max-w-2xl text-xs text-slate-500">
            Źródło: Google Maps. Opinie przepisane ze zrzutów ekranu udostępnionych
            8 listopada 2026 r. Sekcja nie aktualizuje się automatycznie.
            Daty publikacji są względne i pochodzą ze zrzutów.
          </p>
        </div>
      </div>
    </section>
  );
}
