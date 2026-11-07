import { Star, ExternalLink } from "lucide-react";
import GoogleReviewsCarousel from "@/components/google-reviews-carousel";
import { getGoogleReviews, GOOGLE_REVIEWS_FALLBACK_URL } from "@/lib/google-reviews";

export default async function GoogleReviewsSection() {
  const data = await getGoogleReviews();
  const mapsUrl = data?.mapsUrl ?? GOOGLE_REVIEWS_FALLBACK_URL;
  const hasRating = typeof data?.rating === "number";

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
            Sprawdź autentyczne opinie o Posadzkizywiczne.com w Google Maps.
          </p>

          {hasRating && (
            <a
              href={mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mx-auto mt-9 inline-flex flex-wrap items-center justify-center gap-3 rounded-full border border-slate-200 bg-white px-6 py-4 shadow-sm transition-shadow hover:shadow-md"
              aria-label="Zobacz ocenę firmy Posadzkizywiczne.com w Google Maps"
            >
              <span className="font-semibold text-slate-700">Google Maps</span>
              <strong className="text-2xl text-slate-900">
                {data.rating.toLocaleString("pl-PL", { maximumFractionDigits: 1 })}
              </strong>
              <span className="flex items-center gap-0.5" aria-label={"Ocena " + data.rating + " na 5"}>
                {Array.from({ length: 5 }, (_, index) => (
                  <Star
                    key={index}
                    className={
                      index < Math.round(data.rating!)
                        ? "h-5 w-5 fill-amber-400 text-amber-400"
                        : "h-5 w-5 text-slate-300"
                    }
                    aria-hidden="true"
                  />
                ))}
              </span>
              {typeof data.reviewCount === "number" && (
                <span className="w-full text-xs text-slate-500 sm:w-auto">
                  {data.reviewCount.toLocaleString("pl-PL")} ocen
                </span>
              )}
            </a>
          )}
        </div>

        {data?.reviews.length ? (
          <div className="mt-12 md:mt-14">
            <GoogleReviewsCarousel reviews={data.reviews} />
          </div>
        ) : (
          <p className="mx-auto mt-12 max-w-xl text-center text-sm text-slate-600">
            Aktualne opinie i oceny znajdziesz bezpośrednio w profilu firmy na Google Maps.
          </p>
        )}

        <div className="mt-12 flex flex-col items-center gap-3 text-center">
          <a
            href={mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 font-semibold text-primary underline-offset-4 hover:underline"
          >
            Zobacz wszystkie opinie w Google Maps
            <ExternalLink className="h-4 w-4" aria-hidden="true" />
          </a>
          <p className="text-xs text-slate-500">
            Źródło: Google Maps. Opinie prezentowane według trafności Google (maksymalnie 5).
          </p>
          {Boolean(data?.attributions.length) && (
            <p className="text-xs text-slate-500">
              Dostawcy danych:{" "}
              {data!.attributions.map((attribution, index) => (
                <span key={attribution.provider + index}>
                  {index > 0 ? ", " : ""}
                  {attribution.providerUri ? (
                    <a
                      href={attribution.providerUri}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline underline-offset-2"
                    >
                      {attribution.provider}
                    </a>
                  ) : (
                    attribution.provider
                  )}
                </span>
              ))}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
