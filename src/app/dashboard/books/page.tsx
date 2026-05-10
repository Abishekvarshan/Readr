import { requireRole } from "@/lib/auth/session";
import { getDashboardBooks } from "@/lib/data/queries";
import { createBookAction, deleteBookAction, updateBookAction } from "@/server/actions";

export default async function DashboardBooksPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  await requireRole(["seller", "admin"]);
  const books = await getDashboardBooks();
  const params = await searchParams;

  return (
    <div className="container-shell py-10 space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Manage books</h1>
        <p className="mt-2 text-muted">Add inventory, upload a cover image, edit pricing, and manage stock.</p>
        {typeof params.message === "string" && <div className="surface mt-4 p-4 text-sm text-muted">{params.message}</div>}
      </div>

      <section className="surface p-6">
        <h2 className="text-xl font-semibold">Add a new book</h2>
        <form action={createBookAction} className="mt-5 grid gap-4 md:grid-cols-2">
          <input className="field" name="title" placeholder="Title" required />
          <input className="field" name="author" placeholder="Author" required />
          <input className="field" name="category" placeholder="Category" required />
          <select className="field" name="condition" defaultValue="good">
            <option value="like_new">Like new</option>
            <option value="good">Good</option>
            <option value="fair">Fair</option>
            <option value="acceptable">Acceptable</option>
            <option value="new">New</option>
          </select>
          <input className="field" name="language" placeholder="Language" defaultValue="English" />
          <input className="field" name="sellerName" placeholder="Seller name" required />
          <input className="field" type="number" step="0.01" name="price" placeholder="Price (LKR)" required />
          <input className="field" type="number" name="stock" placeholder="Stock" required />
          <input className="field" name="isbn" placeholder="ISBN (optional)" />
          <input className="field" type="number" name="publishedYear" placeholder="Published year" />
          <input className="field md:col-span-2" name="imageUrl" placeholder="Image URL (optional if using file upload)" />
          <input className="field md:col-span-2" type="file" name="image" accept="image/*" />
          <textarea className="field min-h-28 md:col-span-2" name="description" placeholder="Description" required />
          <label className="flex items-center gap-2 text-sm font-medium md:col-span-2">
            <input type="checkbox" name="featured" /> Mark as featured
          </label>
          <button className="btn-primary md:col-span-2" type="submit">Create book</button>
        </form>
      </section>

      <section className="space-y-4">
        {books.map((book) => (
          <div key={book.id} className="surface p-5">
            <form action={updateBookAction} className="grid gap-3 md:grid-cols-2">
              <input type="hidden" name="id" value={book.id} />
              <input className="field" name="title" defaultValue={book.title} />
              <input className="field" name="author" defaultValue={book.author} />
              <input className="field" name="category" defaultValue={book.category} />
              <select className="field" name="condition" defaultValue={book.condition}>
                <option value="like_new">Like new</option>
                <option value="good">Good</option>
                <option value="fair">Fair</option>
                <option value="acceptable">Acceptable</option>
                <option value="new">New</option>
              </select>
              <input className="field" name="language" defaultValue={book.language} />
              <input className="field" name="sellerName" defaultValue={book.seller_name} />
              <input className="field" type="number" step="0.01" name="price" defaultValue={book.price} />
              <input className="field" type="number" name="stock" defaultValue={book.stock} />
              <input className="field" name="isbn" defaultValue={book.isbn ?? ""} />
              <input className="field" type="number" name="publishedYear" defaultValue={book.published_year ?? ""} />
              <input className="field md:col-span-2" name="imageUrl" defaultValue={book.image_url} />
              <textarea className="field min-h-24 md:col-span-2" name="description" defaultValue={book.description} />
              <label className="flex items-center gap-2 text-sm font-medium md:col-span-2">
                <input type="checkbox" name="featured" defaultChecked={book.featured} /> Featured
              </label>
              <div className="flex flex-wrap gap-3 md:col-span-2">
                <button className="btn-primary" type="submit">Save changes</button>
              </div>
            </form>
            <form action={deleteBookAction} className="mt-3">
              <input type="hidden" name="id" value={book.id} />
              <button className="btn-secondary" type="submit">Delete book</button>
            </form>
          </div>
        ))}
      </section>
    </div>
  );
}