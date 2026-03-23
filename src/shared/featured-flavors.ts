/**
 * Single source of truth for in-stock / featured ice cream flavors.
 * Update this file and both the website and online-ordering will reflect the change.
 */

export interface FeaturedFlavor {
  id: string
  name: string
  image: string // path relative to each app's public dir
}

export const FEATURED_FLAVORS: FeaturedFlavor[] = [
  { id: 'vanilla-bean', name: 'Vanilla Bean', image: '/menu-cones/vanilla.jpg' },
  { id: 'chocolate', name: 'Chocolate', image: '/menu-cones/chocolate.jpeg' },
  { id: 'superman', name: 'Superman', image: '/menu-cones/superman.png' },
  { id: 'mint-choc-chip', name: 'Mint Chocolate Chip', image: '/menu-cones/mint_chocolate_chip.jpeg' },
  { id: 'cake-batter', name: 'Cake Batter', image: '/menu-cones/cake-batter.png' },
  { id: 'cookies-and-cream', name: 'Cookies and Cream', image: '/menu-cones/oreo.jpg' },
  { id: 'strawberry', name: 'Strawberry', image: '/menu-cones/strawberry.jpg' },
  { id: 'triple-peanut-butter-cup', name: 'Triple Peanut Butter Cup', image: '/menu-cones/triple-peanut-butter-cup.png' },
]

export const FEATURED_FLAVOR_NAMES = FEATURED_FLAVORS.map((f) => f.name)
