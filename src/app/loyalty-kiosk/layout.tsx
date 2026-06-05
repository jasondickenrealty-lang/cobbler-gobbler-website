import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Loyalty Sign Up | Cobblestone Creamery',
  robots: { index: false, follow: false },
};

// Kiosk layout — intentionally bare (no navbar, no footer, no chat widget).
// This page runs on the in-store loyalty kiosk tablet.
export default function LoyaltyKioskLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
