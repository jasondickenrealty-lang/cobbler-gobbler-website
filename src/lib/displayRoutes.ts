/**
 * Full-screen display routes: TV menu boards and in-store kiosks.
 *
 * These render on unattended screens, so site chrome meant for phone visitors
 * (sticky action bars, popups, chat launchers) must never appear on them —
 * nobody is there to dismiss it, and it covers the content customers came to read.
 */
export const DISPLAY_ROUTES = ['/menu-board', '/marketing-display', '/loyalty-kiosk'];

export function isDisplayRoute(pathname: string | null | undefined): boolean {
  if (!pathname) return false;
  return DISPLAY_ROUTES.some(route => pathname === route || pathname.startsWith(`${route}/`));
}
