type Props = {
  searchParams?: {
    ok?: string;
    pageName?: string;
    pagesCount?: string;
  };
};

export default function FacebookAuthSuccessPage({ searchParams }: Props) {
  const isOk = searchParams?.ok === '1';
  const pageName = searchParams?.pageName || null;
  const pagesCount = Number(searchParams?.pagesCount || '0');

  return (
    <main className="min-h-dvh bg-cream flex items-center justify-center px-6 py-10">
      <div className="max-w-xl w-full bg-white rounded-xl shadow-sm border border-gold/20 p-8 text-center">
        <div className="text-5xl mb-4">{isOk ? '✓' : '!'}</div>
        <h1 className="font-serif text-3xl text-primary mb-3">
          {isOk ? 'Facebook Page Connected' : 'Facebook Connection Status'}
        </h1>
        {isOk ? (
          <>
            <p className="text-dark/70">
              Successfully connected
              {pageName ? <> to <span className="font-medium text-dark">{pageName}</span></> : null}.
            </p>
            {pagesCount > 1 ? (
              <p className="text-dark/60 mt-2">{pagesCount} pages found. The first page is set as primary.</p>
            ) : null}
            <p className="text-dark/50 text-sm mt-6">You can close this window.</p>
          </>
        ) : (
          <p className="text-dark/70">Connection did not complete. Please retry from /auth/facebook.</p>
        )}
      </div>
    </main>
  );
}
