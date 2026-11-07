"use client";

/* eslint-disable @next/next/no-img-element */
import { useState } from "react";
import { ExternalLink, Star } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import type { GoogleReview } from "@/lib/google-reviews";

function ReviewCard({ review }: { review: GoogleReview }) {
  const [expanded, setExpanded] = useState(false);
  const canExpand = review.content.length > 120;

  const author = (
    <span className="flex min-w-0 items-center gap-3">
      {review.authorPhotoUri ? (
        <img
          src={review.authorPhotoUri}
          alt=""
          width={44}
          height={44}
          loading="lazy"
          className="h-11 w-11 shrink-0 rounded-full object-cover"
        />
      ) : (
        <span
          aria-hidden="true"
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-slate-100 font-semibold text-slate-700"
        >
          {review.author.slice(0, 1).toUpperCase()}
        </span>
      )}
      <span className="min-w-0">
        <span className="block truncate font-semibold text-slate-900">{review.author}</span>
        {review.published && (
          <span className="block text-sm text-slate-500">{review.published}</span>
        )}
      </span>
    </span>
  );

  return (
    <article className="flex h-full w-full min-h-[370px] flex-col rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
      <div className="flex items-center justify-between gap-3">
        <span className="flex gap-1" aria-label={"Ocena " + review.rating + " na 5"}>
          {Array.from({ length: 5 }, (_, index) => (
            <Star
              key={index}
              className={
                index < Math.round(review.rating)
                  ? "h-5 w-5 fill-amber-400 text-amber-400"
                  : "h-5 w-5 text-slate-300"
              }
              aria-hidden="true"
            />
          ))}
        </span>
        <span translate="no" className="whitespace-nowrap text-xs font-normal text-[#5e5e5e]">Google Maps</span>
      </div>
      <div className="mt-7 flex-1">
        {review.content ? (
          <p
            className={
              "whitespace-pre-line break-words text-base leading-7 text-slate-700 " +
              (expanded ? "" : "line-clamp-6")
            }
          >
            {review.content}
          </p>
        ) : (
          <p className="text-base text-slate-600">Ocena bez komentarza tekstowego.</p>
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
        {review.translated && (
          <p className="mt-3 text-xs text-slate-500">Opinia przetłumaczona przez Google.</p>
        )}
      </div>
      <div className="mt-6 flex flex-wrap items-end justify-between gap-4 border-t border-slate-100 pt-5">
        {review.authorUri ? (
          <a
            href={review.authorUri}
            target="_blank"
            rel="noopener noreferrer"
            className="min-w-0"
            aria-label={"Profil Google: " + review.author}
          >
            {author}
          </a>
        ) : (
          author
        )}
        <a
          href={review.reviewUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-sm font-medium text-primary underline-offset-4 hover:underline"
        >
          Czytaj na Google
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
