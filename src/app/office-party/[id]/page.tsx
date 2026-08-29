import type { Metadata } from 'next';
import { Suspense } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import OfficePartyJoin from '@/components/office-party/OfficePartyJoin';
import { getMenuData } from '@/lib/menu-data';

// The menu is fetched per request so an item pulled from the POS cannot be
// ordered from a stale cached page. The party itself is loaded in the browser,
// because the host link's token must never end up in a shared cache.
export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Your Office Party Order | Cobblestone Creamery',
  description: 'Add your own order to your office party from Cobblestone Creamery.',
  // A party link is private to the people it was sent to.
  robots: { index: false, follow: false },
};

export default async function OfficePartyJoinPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const menu = await getMenuData();

  return (
    <>
      <Navbar />
      <main className="flex-1 bg-white">
        <Suspense
          fallback={<p className="py-24 text-center text-dark/50">Loading the party…</p>}
        >
          <OfficePartyJoin menu={menu} partyId={id} />
        </Suspense>
      </main>
      <Footer />
    </>
  );
}
