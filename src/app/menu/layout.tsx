import type { Metadata } from 'next';

// ── SEO A/B Title Variants ──────────────────────────────────────────────────
// Variant A (current): category-first
//   'Ice Cream Menu | Cobblestone Creamery — Evansville, IN'
// Variant B: flavor emphasis (test for "milkshake" / "waffle cone" searches)
//   'Waffle Cones, Milkshakes & Sundaes Menu | Cobblestone Creamery Evansville'
// Variant C: action-first (good for "order ice cream evansville" intent)
//   'Order Ice Cream Online | Cobblestone Creamery Menu — Evansville, IN'
//
// ── SEO A/B Description Variants ───────────────────────────────────────────
// Variant A (current):
//   "View the full ice cream menu at Cobblestone Creamery in downtown
//    Evansville, Indiana. Handcrafted scoops, waffle cones, milkshakes,
//    sundaes, and classic cobblers made fresh daily. Order online for pickup!"
// Variant B: specificity + local ("what flavors" intent)
//   "Explore Cobblestone Creamery's full menu — Superman, Triple Peanut Butter
//    Cup, Mint Chip, Strawberry, and rotating specials. Fresh waffle cones,
//    milkshakes & sundaes in downtown Evansville, IN. Order online for pickup."
// Variant C: CTA-heavy (high purchase intent)
//   "Order ice cream online for fast pickup at Cobblestone Creamery —
//    900 Main Street, downtown Evansville. Fresh waffle cones, signature
//    milkshakes, cobblers & sundaes made daily. Skip the line."
// ───────────────────────────────────────────────────────────────────────────

export const metadata: Metadata = {
  title: 'Ice Cream Menu | Cobblestone Creamery — Evansville, IN',
  description:
    'View the full ice cream menu at Cobblestone Creamery in downtown Evansville, Indiana. Handcrafted scoops, waffle cones, milkshakes, sundaes, and classic cobblers made fresh daily. Order online for pickup!',
  alternates: {
    canonical: 'https://cobblestonecreamery.com/menu',
  },
  openGraph: {
    title: 'Ice Cream Menu | Cobblestone Creamery Evansville, IN',
    description:
      'Handcrafted ice cream, waffle cones, milkshakes, sundaes & classic cobblers at Cobblestone Creamery — 900 Main Street, downtown Evansville, IN. Order online for pickup!',
    url: 'https://cobblestonecreamery.com/menu',
    images: [{ url: '/logo.png', width: 800, height: 800, alt: 'Cobblestone Creamery ice cream menu — Evansville, IN' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Ice Cream Menu | Cobblestone Creamery Evansville, IN',
    description:
      'Handcrafted ice cream, waffle cones, milkshakes & cobblers at Cobblestone Creamery in downtown Evansville, IN. Fresh daily — order online for pickup!',
    images: ['/logo.png'],
  },
};

export default function MenuLayout({ children }: { children: React.ReactNode }) {
  return children;
}
