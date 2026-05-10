import Link from "next/link";
import { type Book } from "@/types";
import { formatCurrency } from "@/lib/utils";

export function BookCard({ book, compact = false }: { book: Book; compact?: boolean }) {
  return (
    <article className="surface group overflow-hidden transition hover:-translate-y-0.5 hover:shadow-lg">
      <Link href={`/books/${book.slug}`} className="block bg-white">
        <img
          src={book.image_url}
          alt={book.title}
          className={compact ? "aspect-[4/5] w-full object-cover" : "h-64 w-full object-cover"}
        />
      </Link>
      <div className={compact ? "space-y-2 p-3" : "space-y-3 p-5"}>
        {!compact && (
          <div className="flex items-center justify-between gap-2">
            <span className="badge badge-slate">{book.category}</span>
            <span className={book.stock > 0 ? "badge badge-green" : "badge badge-amber"}>
              {book.stock > 0 ? `${book.stock} in stock` : "Out of stock"}
            </span>
          </div>
        )}
        <div>
          <Link href={`/books/${book.slug}`}>
            <h3 className={compact ? "line-clamp-2 min-h-10 text-sm font-bold leading-5" : "text-lg font-semibold"}>
              {book.title}
            </h3>
          </Link>
          <p className="line-clamp-1 text-xs text-muted">by {book.author}</p>
        </div>
        {!compact && <p className="line-clamp-3 text-sm text-muted">{book.description}</p>}
        <div className={compact ? "grid gap-2" : "flex items-center justify-between gap-3"}>
          <div className="min-w-0">
            <p className={compact ? "text-lg font-black text-[var(--gold)]" : "text-xl font-bold text-[var(--gold)]"}>
              {formatCurrency(book.price)}
            </p>
            <p className="text-xs capitalize text-muted">
              {book.condition.replace("_", " ")} · {book.stock > 0 ? `${book.stock} left` : "Out"}
            </p>
          </div>
          <Link href={`/books/${book.slug}`} className={compact ? "btn-primary px-3 py-2 text-xs" : "btn-primary px-4 py-2 text-sm"}>
            View
          </Link>
        </div>
      </div>
    </article>
  );
}
