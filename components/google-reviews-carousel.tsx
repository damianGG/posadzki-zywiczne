"use client";

import { useState } from "react";
import { ExternalLink, Star } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { GOOGLE_MAPS_PROFILE_URL, type GoogleReview } from "@/lib/google-reviews";

function ReviewCard({ review }: { review: GoogleReview }) {
  const [expanded, setExpanded] = useState(false);
  const canExpand = !review.excerpt && review.content.length > 155;

  return (
    <article className="flex h-full w-full min-h-[340px] flex-col rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
      <div className="flex items-center justify-between gap-3">
        <span className="flex gap-1" aria-label={review.rating + " na 5 gwiazdek"}>
          {Array.from({ length: 5 }, (_, index) => (
            <Star
              key={index}
              className={
                index < review.rating
                  ? "h-5 w-5 fill-amber-400 text-amber-400"
                  : "h-5 w-5 text-slate-300"
              }
              aria-hidden="true"
            />
          ))}
        </span>
        <span className="flex items-center gap-1.5 text-xs font-semibold text-slate-600">
          <span aria-hidden="true" className="bg-gradient-to-br from-blue-500 via-red-500 to-green-500 bg-clip-text text-xl font-extrabold text-transparent">G</span>
          Google
        </span>
      </div>

      <div className="mt-7 flex-1">
        {review.content ? (
          <p className={"whitespace-pre-line break-words text-base leading-7 text-slate-700 " + (expanded ? "" : "line-clamp-6")}>
            {review.content}
          </p>
        ) : (
          <p className="text-base text-slate-500">Ocena bez komentarza tekstowego.</p>
        )}

        {review.excerpt && (
          <p className="mt-3 text-xs text-slate-500">
            Fragment opinii — pełna treść dostępna w Google Maps.
          </p>
        )}

        {canExpand && (
          <button
            type="button"
            aria-expanded={expanded}
            onClick={() => setExpanded((value) => !value)}
            className="mt-3 text-sm font-semibold text-primary hover:underline"
          >
            {expanded ? "Zwiń opinię" : "Czytaj więcej"}
          </button>
        )}
      </div>

      <div className="mt-6 flex flex-wrap items-end justify-between gap-4 border-t border-slate-100 pt-5">
        <div className="min-w-0">
          <p className="font-semibold text-slate-900">{review.author}</p>
          <p className="text-sm text-slate-500">{review.published}</p>
        </div>
        <a
          href={GOOGLE_MAPS_PROFILE_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-sm font-medium text-primary underline-offset-4 hover:underline"
          aria-label={"Zobacz opinie w Google Maps, autor: " + review.author}
        >
          Zobacz w Google
          <ExternalLink className="h-4 w-4" aria-hidden="true" />
        </a>
      </div>
    </article>
  );
}

export default function GoogleReviewsCarousel({ reviews }: { reviews: GoogleReview[] }) {
  if (!reviews.length) return null;

  return (
    <div className="relative mx-auto w-full max-w-5xl">
      <Carousel opts={{ align: "start", loop: reviews.length > 2 }} className="w-full">
        <CarouselContent className="-ml-4 items-stretch pb-2">
          {reviews.map((review) => (
            <CarouselItem
              key={review.id}
              className="flex pl-4 sm:basis-[85%] md:basis-1/2 lg:basis-[46%]"
            >
              <ReviewCard review={review} />
            </CarouselItem>
          ))}
        </CarouselContent>
        {reviews.length > 1 && (
          <>
            <CarouselPrevious
              aria-label="Poprzednia opinia"
              className="left-1 top-1/2 z-10 h-10 w-10 border-slate-200 bg-white shadow-md md:-left-5"
            />
            <CarouselNext
              aria-label="Następna opinia"
              className="right-1 top-1/2 z-10 h-10 w-10 border-slate-200 bg-white shadow-md md:-right-5"
            />
          </>
        )}
      </Carousel>
    </div>
  );
}
