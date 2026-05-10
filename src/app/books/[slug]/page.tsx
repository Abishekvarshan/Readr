import { notFound } from "next/navigation";
import { addToCartAction } from "@/server/actions";
import { getBookBySlug } from "@/lib/data/queries";
import { formatCurrency } from "@/lib/utils";

export default async function BookDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const book = await getBookBySlug(slug);
  if (!book) notFound();

  return (
    <div className="container-shell py-10">
      <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr]">
        <div className="surface overflow-hidden">
          <img src={book.image_url} alt={book.title} className="h-full max-h-[550px] w-full object-cover" />
        </div>
        <div className="space-y-6">
          <div className="flex flex-wrap gap-2">
            <span className="badge badge-slate">{book.category}</span>
            <span className="badge badge-amber">{book.condition.replace("_", " ")}</span>
          </div>
          <div>
            <h1 className="text-4xl font-bold">{book.title}</h1>
            <p className="mt-2 text-lg text-muted">by {book.author}</p>
          </div>
          <p className="text-muted">{book.description}</p>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="surface p-4">
              <p className="text-sm text-muted">Price</p>
              <p className="text-2xl font-bold">{formatCurrency(book.price)}</p>
            </div>
            <div className="surface p-4">
              <p className="text-sm text-muted">Availability</p>
              <p className="text-2xl font-bold">{book.stock} copies</p>
            </div>
          </div>
          <div className="surface grid gap-3 p-5 sm:grid-cols-2">
            <div>
              <p className="text-sm text-muted">Language</p>
              <p className="font-semibold">{book.language}</p>
            </div>
            <div>
              <p className="text-sm text-muted">Seller</p>
              <p className="font-semibold">{book.seller_name}</p>
            </div>
            <div>
              <p className="text-sm text-muted">ISBN</p>
              <p className="font-semibold">{book.isbn || "N/A"}</p>
            </div>
            <div>
              <p className="text-sm text-muted">Published year</p>
              <p className="font-semibold">{book.published_year || "N/A"}</p>
            </div>
          </div>

          <form action={addToCartAction} className="flex flex-wrap gap-3">
            <input type="hidden" name="bookId" value={book.id} />
            <input type="number" name="quantity" min="1" max={book.stock} defaultValue="1" className="field w-28" />
            <button className="btn-primary" type="submit" disabled={book.stock < 1}>
              {book.stock > 0 ? "Add to cart" : "Out of stock"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}