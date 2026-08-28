/**
 * A drawn waffle cone, used wherever a featured flavor has no photo.
 *
 * The shop scoops more flavors than we have cone photography for, and the
 * lineup should list what is actually in the case rather than only what has
 * been shot. This renders a scoop in that flavor's colors so a photo-less
 * entry reads as a designed card instead of a broken image. Give the flavor a
 * real photo in `public/menu-cones/` and it takes over automatically.
 *
 * Pure SVG with no state, so it renders on the server like the photos it
 * replaces. Gradient ids are namespaced per flavor because several of these
 * appear on the same page.
 */

interface Swatch {
  /** Scoop color. */
  base: string;
  /** Lighter tint for the top of the scoop. */
  light: string;
  /** Chips, flecks or swirl color. */
  accent?: string;
  /** Bits suspended in the scoop, cycled across fixed positions. */
  speckles?: string[];
  /** A ribbon folded through the scoop, e.g. cinnamon or fudge. */
  swirl?: boolean;
  /** Highlight color. White reads as a grey smudge on a dark scoop. */
  sheen?: string;
}

const NEUTRAL: Swatch = { base: '#e8d3a8', light: '#f7ecd2' };

/**
 * Keyed on the lowercased flavor name. Anything not listed falls back to a
 * cream scoop, so a flavor the owner adds later still renders correctly.
 */
const SWATCHES: Record<string, Swatch> = {
  'vanilla': { base: '#ecd7a0', light: '#faf0d2' },
  'vanilla bean': {
    base: '#e9d19a',
    light: '#f8ecc9',
    accent: '#6b4a2a',
    speckles: ['#6b4a2a'],
  },
  'dairy free vanilla': { base: '#e4d6b4', light: '#f5ecd8' },
  'orange sherbet': { base: '#f0913c', light: '#fbc079' },
  'monster cookie': {
    base: '#d8b271',
    light: '#eed7a7',
    accent: '#4a2e1e',
    speckles: ['#4a2e1e', '#b33a2f', '#1d466f', '#355b3b', '#c9912f'],
  },
  'cinnamon churro': {
    base: '#dda45d',
    light: '#f1c994',
    accent: '#8b5a2b',
    swirl: true,
  },
  'brownie batter cookie dough': {
    base: '#71482d',
    light: '#9c7048',
    accent: '#3b2415',
    speckles: ['#3b2415', '#d8b271'],
    swirl: true,
    sheen: '#d8b271',
  },
};

/** Fixed so the server and the browser draw the same scoop. */
const SPECKLES: Array<[number, number, number]> = [
  [86, 96, 5],
  [138, 84, 4],
  [112, 124, 5.5],
  [70, 146, 4.5],
  [160, 118, 5],
  [178, 160, 4],
  [58, 176, 4.5],
  [126, 168, 5],
  [98, 60, 4],
  [150, 148, 4.5],
  [108, 194, 4],
  [166, 78, 4],
];

function slugify(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

export default function FlavorCone({
  name,
  variant = 'tall',
  className = '',
}: {
  name: string;
  /**
   * 'tall' matches the 231x432 cone photos. 'card' crops to a square so the
   * drawing fills a photo frame instead of sitting letterboxed inside it.
   */
  variant?: 'tall' | 'card';
  className?: string;
}) {
  const swatch = SWATCHES[name.trim().toLowerCase()] ?? NEUTRAL;
  const id = slugify(name) || 'flavor';

  return (
    <svg
      viewBox={variant === 'card' ? '0 36 231 231' : '0 0 231 432'}
      preserveAspectRatio="xMidYMid meet"
      role="img"
      aria-label={`${name} ice cream at Cobblestone Creamery`}
      className={className}
    >
      <defs>
        <linearGradient id={`scoop-${id}`} x1="0.25" y1="0" x2="0.75" y2="1">
          <stop offset="0%" stopColor={swatch.light} />
          <stop offset="65%" stopColor={swatch.base} />
        </linearGradient>
        <linearGradient id={`cone-${id}`} x1="0" y1="0" x2="1" y2="0.4">
          <stop offset="0%" stopColor="#e6b26a" />
          <stop offset="55%" stopColor="#d99f4e" />
          <stop offset="100%" stopColor="#bd8438" />
        </linearGradient>
        <pattern
          id={`waffle-${id}`}
          width="17"
          height="17"
          patternUnits="userSpaceOnUse"
          patternTransform="rotate(45)"
        >
          <path d="M0 0 V17 M0 0 H17" stroke="#a97029" strokeOpacity="0.42" strokeWidth="2" fill="none" />
        </pattern>
        <clipPath id={`cone-clip-${id}`}>
          <path d="M63 198 L168 198 L115.5 404 Z" />
        </clipPath>
        <clipPath id={`scoop-clip-${id}`}>
          <path d="M115.5 44 A52 52 0 0 1 166 108 A50 50 0 0 1 172 202 L59 202 A50 50 0 0 1 65 108 A52 52 0 0 1 115.5 44 Z" />
        </clipPath>
      </defs>

      {/* Cone */}
      <path d="M63 198 L168 198 L115.5 404 Z" fill={`url(#cone-${id})`} />
      <g clipPath={`url(#cone-clip-${id})`}>
        <rect x="55" y="190" width="121" height="220" fill={`url(#waffle-${id})`} />
      </g>
      <path
        d="M63 198 L168 198 L115.5 404 Z"
        fill="none"
        stroke="#a97029"
        strokeOpacity="0.5"
        strokeWidth="3"
        strokeLinejoin="round"
      />

      {/* Scoop */}
      <path
        d="M115.5 44 A52 52 0 0 1 166 108 A50 50 0 0 1 172 202 L59 202 A50 50 0 0 1 65 108 A52 52 0 0 1 115.5 44 Z"
        fill={`url(#scoop-${id})`}
        stroke="#8a6a3a"
        strokeOpacity="0.22"
        strokeWidth="2"
      />

      <g clipPath={`url(#scoop-clip-${id})`}>
        {swatch.swirl && swatch.accent && (
          <g fill="none" stroke={swatch.accent} strokeOpacity="0.55" strokeLinecap="round">
            <path d="M52 128 C88 104 142 152 182 122" strokeWidth="11" />
            <path d="M48 176 C90 150 140 196 186 170" strokeWidth="9" />
            <path d="M70 86 C100 70 132 92 164 76" strokeWidth="7" />
          </g>
        )}
        {swatch.speckles &&
          SPECKLES.map(([cx, cy, r], i) => (
            <circle
              key={`${cx}-${cy}`}
              cx={cx}
              cy={cy}
              r={r}
              fill={swatch.speckles![i % swatch.speckles!.length]}
              fillOpacity="0.85"
            />
          ))}
      </g>

      {/* Highlight and the shadow the scoop drops into the cone */}
      <ellipse
        cx="86"
        cy="86"
        rx="21"
        ry="13"
        fill={swatch.sheen ?? '#ffffff'}
        fillOpacity="0.28"
        transform="rotate(-28 86 86)"
      />
      <path d="M59 202 L172 202 L168 212 L63 212 Z" fill="#000000" fillOpacity="0.08" />
    </svg>
  );
}
