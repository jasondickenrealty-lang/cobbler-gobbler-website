/**
 * Server-only helper for fetching REAL Google reviews via the Places API (v1).
 *
 * Configure with SERVER-SIDE env vars (do NOT prefix with NEXT_PUBLIC_ — the key
 * must never reach the browser):
 *   GOOGLE_PLACES_API_KEY=<your key with Places API enabled>
 *   GOOGLE_PLACE_ID=<your Google Business Profile place ID>
 *
 * If the env vars are absent, or the request fails, this returns
 * { configured: false } so the UI can fall back to a neutral
 * "Read our Google Reviews" call-to-action. It NEVER returns fabricated
 * ratings, review counts, or testimonials.
 */

export interface GoogleReview {
  author: string;
  rating: number;
  text: string;
  timeAgo: string;
}

export interface GoogleReviewsData {
  configured: boolean;
  rating: number | null;
  reviewCount: number | null;
  reviews: GoogleReview[];
  /** Link to the business's Google reviews page (always safe to show). */
  googleUrl: string;
}

// Public Google Maps link to the business profile. Safe to always render.
const DEFAULT_GOOGLE_URL =
  'https://www.google.com/maps/search/?api=1&query=Cobblestone+Creamery+900+Main+Street+Evansville+Indiana';

/**
 * Fetches live rating, review count, and up to 5 recent reviews from Google.
 * Cached at the framework level by the caller (ISR revalidate).
 */
export async function getGoogleReviews(): Promise<GoogleReviewsData> {
  const apiKey = process.env.GOOGLE_PLACES_API_KEY;
  const placeId = process.env.GOOGLE_PLACE_ID;

  const empty: GoogleReviewsData = {
    configured: false,
    rating: null,
    reviewCount: null,
    reviews: [],
    googleUrl: DEFAULT_GOOGLE_URL,
  };

  if (!apiKey || !placeId) {
    return empty;
  }

  try {
    const res = await fetch(
      `https://places.googleapis.com/v1/places/${encodeURIComponent(placeId)}?languageCode=en`,
      {
        method: 'GET',
        headers: {
          'X-Goog-Api-Key': apiKey,
          'X-Goog-FieldMask':
            'rating,userRatingCount,googleMapsUri,reviews.rating,reviews.text,reviews.relativePublishTimeDescription,reviews.authorAttribution',
        },
        // Refresh at most once per hour.
        next: { revalidate: 3600 },
      }
    );

    if (!res.ok) {
      return empty;
    }

    const data: any = await res.json();

    const rating = typeof data?.rating === 'number' ? data.rating : null;
    const reviewCount =
      typeof data?.userRatingCount === 'number' ? data.userRatingCount : null;

    // Only surface real reviews with actual text.
    const reviews: GoogleReview[] = Array.isArray(data?.reviews)
      ? data.reviews
          .map((r: any): GoogleReview | null => {
            const text: string = r?.text?.text?.toString().trim() || '';
            const author: string =
              r?.authorAttribution?.displayName?.toString().trim() || '';
            const rvRating =
              typeof r?.rating === 'number' ? r.rating : null;
            if (!text || rvRating == null) return null;
            return {
              author: author || 'Google reviewer',
              rating: rvRating,
              text,
              timeAgo: r?.relativePublishTimeDescription?.toString() || '',
            };
          })
          .filter((r: GoogleReview | null): r is GoogleReview => r !== null)
          .slice(0, 3)
      : [];

    // If Google returned nothing usable, fall back to the neutral CTA.
    if (rating == null && reviews.length === 0) {
      return empty;
    }

    return {
      configured: true,
      rating,
      reviewCount,
      reviews,
      googleUrl:
        typeof data?.googleMapsUri === 'string'
          ? data.googleMapsUri
          : DEFAULT_GOOGLE_URL,
    };
  } catch {
    return empty;
  }
}
