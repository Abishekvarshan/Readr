import { BookCard } from "@/components/books/book-card";
import { SearchFilters } from "@/components/books/search-filters";
import { getBooks, getCategories } from "@/lib/data/queries";
import Link from "next/link";

const authorPortraits: Record<string, string> = {
  "James Clear": "https://commons.wikimedia.org/wiki/Special:FilePath/James_Clear_in_2010.jpg",
  "Paulo Coelho": "https://commons.wikimedia.org/wiki/Special:FilePath/Paulo_Coelho_2013-10-01_001.jpg",
  "Robert C. Martin":
    "https://commons.wikimedia.org/wiki/Special:FilePath/Robert_C._Martin_surrounded_by_computers.jpg",
  "J.K. Rowling": "https://commons.wikimedia.org/wiki/Special:FilePath/J._K._Rowling_2010.jpg",
};

export default async function BooksPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const filters = {
    query: typeof params.query === "string" ? params.query : undefined,
    category: typeof params.category === "string" ? params.category : undefined,
    condition: typeof params.condition === "string" ? params.condition : undefined,
    maxPrice: typeof params.maxPrice === "string" ? params.maxPrice : undefined,
  };

  const [books, categories] = await Promise.all([getBooks(filters), getCategories()]);
  const heroBook = books[0];
  const authors = books
    .filter((book, index, list) => list.findIndex((entry) => entry.author === book.author) === index)
    .slice(0, 4);

  return (
    <div className="container-shell py-5">
      <section className="market-shadow relative overflow-hidden rounded-lg border border-[var(--border)] bg-[linear-gradient(120deg,#fff8ed_0%,#f5e6d3_55%,#d9b66b_100%)] p-5 sm:p-8">
        {heroBook && (
          <div
            className="absolute inset-0 bg-cover bg-center opacity-20 mix-blend-multiply"
            style={{ backgroundImage: `url(${heroBook.image_url})` }}
          />
        )}
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(255,250,242,0.94)_0%,rgba(245,230,211,0.84)_58%,rgba(217,182,107,0.58)_100%)]" />
        <div className="relative z-10 flex flex-wrap items-end justify-between gap-4">
          <div className="max-w-2xl">
            <span className="badge badge-amber">Readr Library</span>
            <h1 className="mt-4 text-3xl font-black text-[var(--brown)] sm:text-5xl">
              Explore books one by one.
            </h1>
            <p className="mt-3 max-w-xl text-sm leading-6 text-muted sm:text-base">
              Browse the shelf, filter by category or condition, and open each book to view details before adding it to your cart.
            </p>
          </div>
          <SearchFilters categories={categories} searchParams={params} />
        </div>
      </section>

      {authors.length > 0 && (
        <section className="mt-4">
          <div className="mb-3 flex items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-black text-[var(--brown)]">Featured authors</h2>
              <p className="text-xs text-muted">A quick way to connect books with the writers behind them.</p>
            </div>
            <p className="text-sm font-semibold text-[var(--brown)]">{books.length} books found</p>
          </div>
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            {authors.map((book) => (
              <Link
                key={book.author}
                href={`/books?query=${encodeURIComponent(book.author)}`}
                className="relative min-h-24 overflow-hidden rounded-lg border border-[var(--border)] bg-[var(--card)] p-3"
              >
                <div
                  className="absolute inset-0 bg-cover bg-center opacity-20 mix-blend-multiply"
                  style={{
                    backgroundImage: `url(${authorPortraits[book.author] || book.image_url})`,
                  }}
                />
                <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(255,250,242,0.94),rgba(255,250,242,0.64))]" />
                <div className="relative z-10">
                  <p className="text-sm font-black text-[var(--brown)]">{book.author}</p>
                  <p className="mt-1 line-clamp-1 text-xs text-muted">{book.title}</p>
                  <p className="mt-3 text-xs font-bold text-[var(--gold)]">View books</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      <div className="mt-3 grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-4">
        {books.length ? (
          books.map((book) => <BookCard key={book.id} book={book} compact />)
        ) : (
          <div className="surface p-8 md:col-span-3 xl:col-span-4">
            <h2 className="text-xl font-semibold">No books found</h2>
            <p className="mt-2 text-muted">Try changing the search criteria or reset the filters.</p>
          </div>
        )}
      </div>
    </div>
  );
}
