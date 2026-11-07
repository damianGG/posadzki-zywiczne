import "server-only";

export interface GoogleReview {
  id: string;
  content: string;
  rating: number;
  author: string;
  authorUri?: string;
  authorPhotoUri?: string;
  published?: string;
  reviewUrl: string;
  translated: boolean;
}

export interface GoogleReviewsData {
  rating?: number;
  reviewCount?: number;
  mapsUrl: string;
  reviews: GoogleReview[];
  attributions: Array<{ provider: string; providerUri?: string }>;
}

interface PlacesReview {
  name?: string;
  rating?: number;
  text?: { text?: string };
  originalText?: { text?: string };
  authorAttribution?: { displayName?: string; uri?: string; photoUri?: string };
  relativePublishTimeDescription?: string;
  googleMapsUri?: string;
}

interface PlacesDetails {
  rating?: number;
  userRatingCount?: number;
  googleMapsUri?: string;
  reviews?: PlacesReview[];
  attributions?: Array<{ provider?: string; providerUri?: string }>;
}

export const GOOGLE_REVIEWS_FALLBACK_URL =
  "https://www.google.com/maps/search/?api=1&query=Posadzkizywiczne.com";

function httpsUrl(value?: string): string | undefined {
  if (!value) return undefined;
  try {
    const url = new URL(value);
    return url.protocol === "https:" ? url.toString() : undefined;
  } catch {
    return undefined;
  }
}

// Use only on the server; Places content is not cached or persisted.
export async function getGoogleReviews(): Promise<GoogleReviewsData | null> {
  const apiKey = process.env.GOOGLE_PLACES_API_KEY;
  const placeId = process.env.GOOGLE_PLACE_ID?.trim();
  if (!apiKey || !placeId) return null;

  const fallbackUrl =
    GOOGLE_REVIEWS_FALLBACK_URL + "&query_place_id=" + encodeURIComponent(placeId);

  try {
    const response = await fetch(
      "https://places.googleapis.com/v1/places/" + encodeURIComponent(placeId) + "?languageCode=pl",
      {
        method: "GET",
        headers: {
          "X-Goog-Api-Key": apiKey,
          "X-Goog-FieldMask": "rating,userRatingCount,googleMapsUri,reviews,attributions",
        },
        cache: "no-store",
        signal: AbortSignal.timeout(8000),
      }
    );

    if (!response.ok) {
      console.error("Google Places reviews request failed (HTTP " + response.status + ")");
      return null;
    }

    const place = (await response.json()) as PlacesDetails;
    const mapsUrl = httpsUrl(place.googleMapsUri) ?? fallbackUrl;

    return {
      rating:
        typeof place.rating === "number" && place.rating >= 1 && place.rating <= 5
          ? place.rating
          : undefined,
      reviewCount:
        typeof place.userRatingCount === "number" && place.userRatingCount >= 0
          ? place.userRatingCount
          : undefined,
      mapsUrl,
      // API returns at most 5 reviews ordered by relevance; don't filter by rating.
      reviews: (place.reviews ?? []).map((review, index) => ({
        id: review.name ?? String(index),
        content: review.text?.text ?? review.originalText?.text ?? "",
        rating:
          typeof review.rating === "number" && review.rating >= 1 && review.rating <= 5
            ? review.rating
            : 0,
        author: review.authorAttribution?.displayName || "Użytkownik Google",
        authorUri: httpsUrl(review.authorAttribution?.uri),
        authorPhotoUri: httpsUrl(review.authorAttribution?.photoUri),
        published: review.relativePublishTimeDescription,
        reviewUrl: httpsUrl(review.googleMapsUri) ?? mapsUrl,
        translated: Boolean(
          review.text?.text &&
          review.originalText?.text &&
          review.text.text !== review.originalText.text
        ),
      })),
      attributions: (place.attributions ?? [])
        .filter((attribution) => Boolean(attribution.provider))
        .map((attribution) => ({
          provider: attribution.provider as string,
          providerUri: httpsUrl(attribution.providerUri),
        })),
    };
  } catch (error) {
    console.error(
      "Google Places reviews unavailable:",
      error instanceof Error ? error.message : "Unknown error"
    );
    return null;
  }
}
