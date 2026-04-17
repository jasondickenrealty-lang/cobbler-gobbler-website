import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Marketing Display | Cobblestone Creamery',
  robots: { index: false, follow: false },
};

export default function MarketingDisplayLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=no" />
      </head>
      <body style={{ margin: 0, padding: 0, background: '#000', overflow: 'hidden' }}>
        {children}
      </body>
    </html>
  );
}
