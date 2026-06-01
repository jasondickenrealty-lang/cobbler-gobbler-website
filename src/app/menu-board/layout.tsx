import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Menu Board | Cobblestone Creamery',
  robots: { index: false, follow: false },
};

/** Standalone layout — no site nav, no global styles, just the TV display. */
export default function MenuBoardLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=no" />
      </head>
      <body style={{ margin: 0, padding: 0, overflow: 'hidden' }}>
        {children}
      </body>
    </html>
  );
}
