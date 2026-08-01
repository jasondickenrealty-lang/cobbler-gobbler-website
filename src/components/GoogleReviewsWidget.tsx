/**
 * GoogleReviewsWidget (server component)
 *
 * Renders ONLY real, verifiable Google reviews. Data is fetched server-side
 * from the Google Places API via getGoogleReviews() (see src/lib/google-reviews.ts),
 * which keeps the API key off the client and refreshes hourly (ISR).
 *
 * If live reviews are not configured (missing GOOGLE_PLACES_API_KEY /
 * GOOGLE_PLACE_ID) or Google returns nothing, this falls back to a neutral
 * "Read our Google Reviews" call-to-action. It NEVER displays fabricated
 * ratings, review counts, or testimonials, and emits no review schema.
 */

import { getGoogleReviews } from '@/lib/google-reviews';

function StarRating({ rating, size = 'md' }: { rating: number; size?: 'sm' | 'md' | 'lg' }) {
  const sizes = { sm: 'w-3.5 h-3.5', md: 'w-5 h-5', lg: 'w-7 h-7' };
  const cls = sizes[size];
  return (
    <div className="flex items-center gap-0.5" aria-label={`${rating} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((star) => (
        <svg key={star} viewBox="0 0 20 20" className={cls} aria-hidden="true">
          <path
            fill={star <= Math.round(rating) ? '#F59E0B' : '#E5E7EB'}
            d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
          />
        </svg>
      ))}
    </div>
  );
}

function GoogleGlyph() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
    </svg>
  );
}

export default async function GoogleReviewsWidget() {
  const data = await getGoogleReviews();

  return (
    <section className="bg-white border-y border-dark/10">
      <div className="mx-auto max-w-7xl px-6 py-16 md:py-20">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-dugout-red sm:text-sm sm:tracking-[0.32em]">What Guests Are Saying</p>
            <h2 className="mt-2 font-serif text-4xl uppercase tracking-[0.08em] text-primary md:text-5xl">
              Reviews
            </h2>
          </div>

          {/* Rating badge — only shown when a real rating is available */}
          {data.configured && data.rating != null ? (
            <a
              href={data.googleUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-wrap items-center gap-4 rounded-[1.75rem] border border-dark/[0.08] bg-light-cream px-5 py-5 shadow-sm transition-shadow hover:shadow-md self-start sm:gap-5 sm:px-6 md:self-auto"
            >
              <div className="text-center">
                <p className="font-serif text-5xl font-bold text-primary">{data.rating.toFixed(1)}</p>
                <StarRating rating={data.rating} size="md" />
                {data.reviewCount != null && (
                  <p className="mt-1 text-xs text-dark/50">{data.reviewCount.toLocaleString()} reviews</p>
                )}
              </div>
              <div className="flex flex-col items-start gap-1 border-l border-dark/10 pl-5">
                <GoogleGlyph />
                <p className="text-xs font-semibold text-dark">Google</p>
                <p className="text-[0.68rem] text-dark/50 leading-tight">Read all reviews</p>
              </div>
            </a>
          ) : (
            <a
              href={data.googleUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-4 rounded-[1.75rem] border border-dark/[0.08] bg-light-cream px-6 py-5 shadow-sm transition-shadow hover:shadow-md self-start md:self-auto"
            >
              <GoogleGlyph />
              <div className="flex flex-col items-start">
                <p className="text-sm font-semibold text-dark">Read Our Google Reviews</p>
                <p className="text-[0.72rem] text-dark/50 leading-tight">See what guests say on Google</p>
              </div>
            </a>
          )}
        </div>

        {/* Real review cards — only when Google returned reviews with text */}
        {data.reviews.length > 0 && (
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {data.reviews.map((review, i) => (
              <article
                key={`${review.author}-${i}`}
                className="flex flex-col justify-between rounded-[1.75rem] border border-dark/[0.08] bg-light-cream p-6 shadow-[0_14px_26px_rgba(16,36,63,0.06)]"
              >
                <div>
                  <StarRating rating={review.rating} size="sm" />
                  <p className="mt-4 text-base leading-7 text-dark/[0.78]">&ldquo;{review.text}&rdquo;</p>
                </div>
                <div className="mt-5 flex items-center justify-between">
                  <p className="text-sm font-semibold text-primary">{review.author}</p>
                  {review.timeAgo && <p className="text-xs text-dark/40">{review.timeAgo}</p>}
                </div>
              </article>
            ))}
          </div>
        )}

        {/* CTA */}
        <div className="mt-8 text-center">
          <a
            href={data.googleUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-dark/[0.12] bg-white px-6 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-primary shadow-sm transition-colors hover:border-primary/30 hover:bg-light-cream"
          >
            Read Our Google Reviews
            <svg width="14" height="14" viewBox="0 0 20 20" fill="currentColor" className="opacity-50" aria-hidden="true">
              <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}
