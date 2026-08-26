/**
 * The bar that says "this is not your live site yet".
 *
 * Shown only in Draft Mode, i.e. only to a browser that opened the owner's
 * private preview link. It has to be unmissable: the entire promise of preview
 * is that the owner is never confused about whether the public can see this.
 */

import { PREVIEW_CHANGE_LIMIT } from '@/lib/siteContent';

export default function PreviewBanner({ pendingChanges }: { pendingChanges: string[] }) {
  const shown = pendingChanges.slice(0, PREVIEW_CHANGE_LIMIT);
  const extra = pendingChanges.length - shown.length;

  return (
    <div className="sticky top-0 z-[100] border-b-2 border-amber-500 bg-amber-100 text-amber-950 print:hidden">
      <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-2 text-sm sm:flex-row sm:items-center sm:justify-between">
        <p className="font-semibold">
          Preview — not published yet.
          {shown.length ? (
            <span className="font-normal">
              {' '}
              Unpublished: {shown.join(', ')}
              {extra > 0 ? ` +${extra} more` : ''}.
            </span>
          ) : (
            <span className="font-normal"> Nothing is waiting to be published.</span>
          )}
        </p>
        <p className="shrink-0 text-xs sm:text-sm">
          <span className="hidden sm:inline">Only people with your link can see this. </span>
          <a href="/api/preview/exit" className="font-semibold underline underline-offset-2">
            Exit preview
          </a>
        </p>
      </div>
    </div>
  );
}
