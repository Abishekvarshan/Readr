export function SiteFooter() {
  return (
    <footer className="mt-10 bg-[var(--brown)] text-white">
      <div className="container-shell grid gap-4 py-8 md:grid-cols-2 md:items-center">
        <div>
          <p className="font-semibold">Readr</p>
          <p className="text-sm text-white/70">
            A simple mobile-first marketplace for used books, school books, and rare finds.
          </p>
        </div>
        <div className="text-sm text-white/70 md:text-right">
          <p>Browse, add to cart, and checkout with less friction.</p>
        </div>
      </div>
    </footer>
  );
}
