import Link from "next/link";
import { requireRole } from "@/lib/auth/session";
import { getDashboardBooks, getOrders } from "@/lib/data/queries";

export default async function DashboardPage() {
  const profile = await requireRole(["seller", "admin"]);
  const [books, orders] = await Promise.all([getDashboardBooks(), getOrders()]);

  return (
    <div className="container-shell py-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Seller dashboard</h1>
          <p className="mt-2 text-muted">Welcome back, {profile.full_name || profile.email || "Seller"}.</p>
        </div>
        <div className="flex gap-3">
          <Link href="/dashboard/books" className="btn-primary">Manage books</Link>
          <Link href="/dashboard/orders" className="btn-secondary">View orders</Link>
        </div>
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-3">
        <div className="surface p-5"><p className="text-sm text-muted">Total listings</p><p className="text-3xl font-bold">{books.length}</p></div>
        <div className="surface p-5"><p className="text-sm text-muted">Orders</p><p className="text-3xl font-bold">{orders.length}</p></div>
        <div className="surface p-5"><p className="text-sm text-muted">Role</p><p className="text-3xl font-bold capitalize">{profile.role}</p></div>
      </div>
    </div>
  );
}