import { BookCard } from "@/components/books/book-card";
import { SearchFilters } from "@/components/books/search-filters";
import { getBooks, getCategories } from "@/lib/data/queries";

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

  return (
    <div className="container-shell py-5">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-[var(--brown)]">{books.length} books found</p>
          <p className="text-xs text-muted">Sort: Latest</p>
        </div>
        <SearchFilters categories={categories} searchParams={params} />
      </div>

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
