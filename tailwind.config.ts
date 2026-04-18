import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#10243f',
        cream: '#efe1c5',
        gold: '#c9912f',
        dark: '#0b1628',
        'light-cream': '#f8f3e7',
        'dugout-red': '#b33a2f',
        'ballpark-blue': '#1d466f',
        scoreboard: '#15273f',
        sand: '#d8b87f',
        chalk: '#fdf9ef',
        field: '#355b3b',
        // Keep old names mapped for employee pages
        secondary: '#b33a2f',
        accent: '#1d466f',
      },
      fontFamily: {
        serif: ['var(--font-display)', 'Impact', 'sans-serif'],
        sans: ['var(--font-body)', 'Trebuchet MS', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
export default config
