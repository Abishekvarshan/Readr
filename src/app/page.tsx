import Link from "next/link";
import Image from "next/image";
import { ArrowRight, BadgePercent, BookCopy, Clock3, Flame, ShieldCheck, Truck } from "lucide-react";
import { BookCard } from "@/components/books/book-card";
import { getBooks, getCategories, getMarketplaceStats } from "@/lib/data/queries";

const quickCategories = ["Fiction", "Self Help", "Technology", "Fantasy", "School", "Sinhala", "Kids", "Exam Prep"];

export default async function HomePage() {
  const [books, categories, stats] = await Promise.all([getBooks(), getCategories(), getMarketplaceStats()]);
  const featured = books.slice(0, 8);
  const heroBook = featured[0];
  const visibleCategories = [...new Set([...categories, ...quickCategories])].slice(0, 8);

  return (
    <div className="pb-10">
      <section className="bg-[var(--brown)] pb-4">
        <div className="container-shell grid gap-3 lg:grid-cols-[230px_1fr_260px]">
          <aside className="surface hidden p-3 lg:block">
            <h2 className="px-2 pb-2 text-sm font-bold text-[var(--brown)]">Categories</h2>
            <nav className="grid gap-1">
              {visibleCategories.map((category) => (
                <Link
                  key={category}
                  href={`/books?category=${encodeURIComponent(category)}`}
                  className="rounded-md px-3 py-2 text-sm text-[var(--foreground)] hover:bg-[var(--paper)]"
                >
                  {category}
                </Link>
              ))}
            </nav>
          </aside>

          <div className="market-shadow relative overflow-hidden rounded-lg bg-[linear-gradient(120deg,#fff8ed_0%,#f5e6d3_55%,#d9b66b_100%)]">
            {heroBook && (
              <Image
                src={heroBook.image_url}
                alt=""
                fill
                sizes="(max-width: 1024px) 100vw, 700px"
                className="object-cover opacity-20 mix-blend-multiply"
                priority
              />
            )}
            <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(255,250,242,0.94)_0%,rgba(245,230,211,0.86)_52%,rgba(217,182,107,0.6)_100%)]" />
            <div className="relative z-10 flex min-h-[300px] items-center p-5 sm:p-8">
              <div className="relative z-10 max-w-xl">
                <span className="badge badge-amber">Book deals for every reader</span>
                <h1 className="mt-4 text-3xl font-black leading-tight text-[var(--brown)] sm:text-5xl">
                  Browse used books and buy in minutes.
                </h1>
                <p className="mt-3 max-w-lg text-sm font-medium text-[var(--muted)] sm:text-base">
                  Find affordable fiction, school books, tech guides, and rare second-hand reads with a simple mobile shopping flow.
                </p>
                <div className="mt-5 flex flex-wrap gap-3">
                  <Link href="/books" className="btn-primary">
                    Shop books <ArrowRight className="h-4 w-4" />
                  </Link>
                  <Link href="/books?condition=like_new" className="btn-secondary">
                    Like-new deals
                  </Link>
                </div>
              </div>
            </div>
          </div>

          <aside className="grid grid-cols-3 gap-2 lg:grid-cols-1 lg:gap-3">
            {[
              {
                icon: Truck,
                label: "Islandwide delivery",
                value: "Fast checkout",
              },
              {
                icon: ShieldCheck,
                label: "Trusted copies",
                value: "Condition listed",
              },
              {
                icon: BookCopy,
                label: "Books available",
                value: `${stats.books}+ listed`,
              },
            ].map((item) => (
              <div key={item.label} className="surface relative flex min-h-20 flex-col items-center justify-center gap-1 overflow-hidden bg-[var(--card)] p-2 text-center lg:min-h-0 lg:flex-row lg:justify-start lg:gap-3 lg:p-4 lg:text-left">
                <item.icon className="absolute -left-1 -top-1 h-16 w-16 text-[var(--gold)] opacity-20 lg:hidden" />
                <item.icon className="relative z-10 h-5 w-5 shrink-0 text-[var(--gold)] lg:h-7 lg:w-7" />
                <div className="relative z-10 min-w-0">
                  <p className="text-[11px] font-bold leading-4 lg:text-sm">{item.label}</p>
                  <p className="text-[10px] leading-4 text-muted lg:text-xs">{item.value}</p>
                </div>
              </div>
            ))}
          </aside>
        </div>
      </section>

      <section className="container-shell mt-4 lg:hidden">
        <div className="flex gap-2 overflow-x-auto pb-1">
          {visibleCategories.map((category) => (
            <Link
              key={category}
              href={`/books?category=${encodeURIComponent(category)}`}
              className="shrink-0 rounded-lg bg-[var(--card)] px-4 py-2 text-sm font-semibold text-[var(--brown)]"
            >
              {category}
            </Link>
          ))}
        </div>
      </section>

      <section className="container-shell mt-5">
        <div className="surface overflow-hidden">
          <div className="flex items-center justify-between bg-[var(--brown)] px-4 py-3 text-white">
            <div className="flex items-center gap-2">
              <Flame className="h-5 w-5 text-[var(--gold)]" />
              <h2 className="font-bold">Flash Book Deals</h2>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <Clock3 className="h-4 w-4" />
              Today only
            </div>
          </div>
          <div className="grid grid-cols-2 gap-px bg-[var(--border)] sm:grid-cols-4">
            {featured.slice(0, 4).map((book) => (
              <Link key={book.id} href={`/books/${book.slug}`} className="bg-[var(--card)] p-3">
                <p className="line-clamp-1 text-sm font-bold">{book.title}</p>
                <p className="mt-1 text-lg font-black text-[var(--gold)]">LKR {book.price.toLocaleString()}</p>
                <p className="mt-1 text-xs text-muted">{book.condition.replace("_", " ")}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="container-shell mt-6">
        <div className="mb-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <BadgePercent className="h-5 w-5 text-[var(--gold)]" />
            <h2 className="text-xl font-black text-[var(--brown)]">Just For You</h2>
          </div>
          <Link href="/books" className="text-sm font-bold text-[var(--brown)]">
            View all
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
          {featured.map((book) => (
            <BookCard key={book.id} book={book} compact />
          ))}
        </div>
      </section>

    </div>
  );
}
