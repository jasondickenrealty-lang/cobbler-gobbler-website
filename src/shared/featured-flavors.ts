/**
 * Single source of truth for in-stock / featured ice cream flavors.
 * Update this file and both the website and online-ordering will reflect the change.
 *
 * `image` is optional. A flavor we do not have a cone photo for renders the
 * drawn <FlavorCone /> swatch instead, so the lineup can list everything the
 * shop actually scoops without waiting on a photo shoot. Drop a real photo in
 * `public/menu-cones/` and point `image` at it to replace the drawing.
 */

export interface FeaturedFlavor {
  id: string
  name: string
  image?: string // path relative to each app's public dir; omit to draw the cone
}

export const FEATURED_FLAVORS: FeaturedFlavor[] = [
  { id: 'vanilla-bean', name: 'Vanilla Bean', image: '/menu-cones/vanilla.png' },
  { id: 'vanilla', name: 'Vanilla' },
  { id: 'chocolate', name: 'Chocolate', image: '/menu-cones/chocolate.png' },
  { id: 'strawberry', name: 'Strawberry', image: '/menu-cones/strawberry.png' },
  { id: 'orange-sherbet', name: 'Orange Sherbet' },
  { id: 'mint-choc-chip', name: 'Mint Chocolate Chip', image: '/menu-cones/mint_chocolate_chip.png' },
  { id: 'superman', name: 'Superman', image: '/menu-cones/superman.png' },
  { id: 'butter-pecan', name: 'Butter Pecan', image: '/menu-cones/butter-pecan.png' },
  { id: 'coffee-lovers', name: 'Coffee Lovers', image: '/menu-cones/coffee.png' },
  { id: 'dairy-free-vanilla', name: 'Dairy Free Vanilla' },
  { id: 'monster-cookie', name: 'Monster Cookie' },
  { id: 'cinnamon-churro', name: 'Cinnamon Churro' },
  { id: 'brownie-batter-cookie-dough', name: 'Brownie Batter Cookie Dough' },
  { id: 'choc-chip-cookie-dough', name: 'Chocolate Chip Cookie Dough', image: '/menu-cones/chocolate-chip-cookie-dough.png' },
  { id: 'triple-peanut-butter-cup', name: 'Triple Peanut Butter Cup', image: '/menu-cones/triple-peanut-butter-cup.png' },
  { id: 'cookies-n-cream', name: 'Cookies N Cream', image: '/menu-cones/oreo.png' },
]

export const FEATURED_FLAVOR_NAMES = FEATURED_FLAVORS.map((f) => f.name)
