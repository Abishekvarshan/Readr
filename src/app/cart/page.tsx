import Link from "next/link";
import { CartSummary } from "@/components/cart/cart-summary";
import { getCartSummary } from "@/lib/data/queries";
import { formatCurrency } from "@/lib/utils";
import { removeCartItemAction, updateCartItemAction } from "@/server/actions";

export default async function CartPage() {
  const summary = await getCartSummary();

  return (
    <div className="container-shell py-10">
      <h1 className="text-3xl font-bold">Your cart</h1>
      <p className="mt-2 text-muted">Review your selected books before checkout.</p>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
        <div className="space-y-4">
          {summary.lines.length ? (
            summary.lines.map((line) => (
              <div key={line.book.id} className="surface flex flex-col gap-4 p-4 sm:flex-row">
                <img src={line.book.image_url} alt={line.book.title} className="h-36 w-28 rounded-2xl object-cover" />
                <div className="flex-1">
                  <h2 className="text-lg font-semibold">{line.book.title}</h2>
                  <p className="text-sm text-muted">{line.book.author}</p>
                  <p className="mt-2 font-semibold">{formatCurrency(line.book.price)}</p>
                  <div className="mt-4 flex flex-wrap gap-3">
                    <form action={updateCartItemAction} className="flex items-center gap-2">
                      <input type="hidden" name="bookId" value={line.book.id} />
                      <input type="number" name="quantity" className="field w-24" min="1" max="10" defaultValue={line.quantity} />
                      <button className="btn-secondary px-4 py-2 text-sm">Update</button>
                    </form>
                    <form action={removeCartItemAction}>
                      <input type="hidden" name="bookId" value={line.book.id} />
                      <button className="btn-secondary px-4 py-2 text-sm">Remove</button>
                    </form>
                  </div>
                </div>
                <div className="text-right font-semibold">{formatCurrency(line.lineTotal)}</div>
              </div>
            ))
          ) : (
            <div className="surface p-8">
              <h2 className="text-xl font-semibold">Your cart is empty</h2>
              <p className="mt-2 text-muted">Start by browsing the catalog and adding a few titles.</p>
              <Link href="/books" className="btn-primary mt-4">Browse books</Link>
            </div>
          )}
        </div>

        <div className="space-y-4">
          <CartSummary subtotal={summary.subtotal} shipping={summary.shipping} total={summary.total} />
          {summary.lines.length > 0 && (
            <Link href="/checkout" className="btn-primary w-full">
              Proceed to checkout
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}