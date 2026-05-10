import Link from "next/link";
import { BookOpen, LayoutDashboard, Search, ShoppingCart, UserRound } from "lucide-react";
import { getCartSummary } from "@/lib/data/queries";
import { getCurrentProfile } from "@/lib/auth/session";
import { logoutAction } from "@/server/actions";

export async function SiteHeader() {
  const [cart, profile] = await Promise.all([getCartSummary(), getCurrentProfile()]);
  const cartCount = cart.lines.reduce((sum, line) => sum + line.quantity, 0);
  const canAccessDashboard = profile?.role === "seller" || profile?.role === "admin";

  return (
    <header className="sticky top-0 z-40 bg-[var(--brown)] text-white shadow-md">
      <div className="border-b border-white/10">
        <div className="container-shell flex items-center justify-between gap-3 py-2 text-xs">
          <span className="hidden sm:inline">A Home for Every Reader</span>
          <div className="ml-auto flex items-center gap-3">
            <Link href="/books" className="hover:text-[var(--gold)]">Browse</Link>
            <Link href="/cart" className="hover:text-[var(--gold)]">Cart ({cartCount})</Link>
            {profile ? (
              <form action={logoutAction}>
                <button className="hover:text-[var(--gold)]">Logout</button>
              </form>
            ) : (
              <>
                <Link href="/login" className="hover:text-[var(--gold)]">Login</Link>
                <Link href="/signup" className="hover:text-[var(--gold)]">Sign up</Link>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="container-shell grid gap-3 py-3 md:grid-cols-[auto_1fr_auto] md:items-center">
        <div className="flex items-center justify-between gap-3">
          <Link href="/" className="flex items-center gap-2 text-xl font-bold">
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--gold)] text-white">
              <BookOpen className="h-6 w-6" />
            </span>
            Readr
          </Link>
          <Link href="/cart" className="relative flex h-10 w-10 items-center justify-center rounded-lg bg-white/10 md:hidden">
            <ShoppingCart className="h-5 w-5" />
            {cartCount > 0 && (
              <span className="absolute -right-1 -top-1 rounded-full bg-[var(--gold)] px-1.5 text-xs font-bold">
                {cartCount}
              </span>
            )}
          </Link>
        </div>

        <form action="/books" className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-[var(--muted)]" />
          <input
            className="h-12 w-full rounded-lg border-0 bg-white pl-10 pr-24 text-[var(--foreground)] outline-none ring-2 ring-transparent placeholder:text-[var(--muted)] focus:ring-[var(--gold)]"
            name="query"
            placeholder="Search books, authors, ISBN..."
          />
          <button className="absolute right-1 top-1 h-10 rounded-md bg-[var(--gold)] px-4 text-sm font-bold text-white" type="submit">
            Search
          </button>
        </form>

        <nav className="hidden items-center gap-2 md:flex">
          {canAccessDashboard && (
            <Link href="/dashboard" className="rounded-lg px-3 py-2 text-sm font-medium hover:bg-white/10">
              <span className="inline-flex items-center gap-1">
                <LayoutDashboard className="h-4 w-4" /> Dashboard
              </span>
            </Link>
          )}
          <Link href="/cart" className="relative flex h-11 w-11 items-center justify-center rounded-lg bg-white/10 hover:bg-white/15">
            <ShoppingCart className="h-5 w-5" />
            {cartCount > 0 && (
              <span className="absolute -right-1 -top-1 rounded-full bg-[var(--gold)] px-1.5 text-xs font-bold">
                {cartCount}
              </span>
            )}
          </Link>
          {profile ? (
            <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-white/10" title={profile.email ?? "Account"}>
              <UserRound className="h-5 w-5" />
            </span>
          ) : (
            <Link href="/login" className="rounded-lg bg-[var(--gold)] px-4 py-2 text-sm font-bold">
              Login
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
