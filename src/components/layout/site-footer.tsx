"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function SiteFooter() {
  const pathname = usePathname();

  if (pathname.startsWith("/dashboard")) {
    return null;
  }

  return (
    <footer className="mt-10 bg-[var(--brown)] text-white">
      <div className="container-shell grid gap-3 py-4 sm:gap-5 sm:py-8 lg:grid-cols-[1fr_auto] lg:items-start">
        <div>
          <p className="font-semibold">Readr</p>
          <p className="mt-1 hidden max-w-md text-sm leading-6 text-white/70 sm:block">
            A simple mobile-first marketplace for used books, school books, and rare finds.
          </p>
        </div>

        <nav className="grid grid-cols-2 gap-x-3 gap-y-1 text-sm text-white/70 sm:flex sm:flex-wrap sm:gap-x-4 sm:gap-y-2 lg:justify-end">
          <Link href="/contact" className="rounded-md py-1 hover:text-[var(--gold)]">
            Contact us
          </Link>
          <Link href="/refund-policy" className="rounded-md py-1 hover:text-[var(--gold)]">
            Refund Policy
          </Link>
          <Link href="/privacy-policy" className="rounded-md py-1 hover:text-[var(--gold)]">
            Privacy Policy
          </Link>
          <Link href="/terms-and-conditions" className="rounded-md py-1 hover:text-[var(--gold)]">
            Terms & Conditions
          </Link>
        </nav>
      </div>
    </footer>
  );
}
