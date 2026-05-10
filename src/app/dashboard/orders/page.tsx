import { requireRole } from "@/lib/auth/session";
import { getOrders } from "@/lib/data/queries";
import { formatCurrency } from "@/lib/utils";

export default async function DashboardOrdersPage() {
  await requireRole(["seller", "admin"]);
  const orders = await getOrders();

  return (
    <div className="container-shell py-10">
      <h1 className="text-3xl font-bold">Orders</h1>
      <p className="mt-2 text-muted">Monitor sandbox payments, customer details, and fulfillment status.</p>

      <div className="mt-8 space-y-4">
        {orders.map((order) => (
          <div key={order.id} className="surface p-5">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <h2 className="font-semibold">{order.id}</h2>
                <p className="text-sm text-muted">{order.customer_name} · {order.customer_email}</p>
              </div>
              <div className="text-right">
                <p className="font-semibold">{formatCurrency(order.total_amount)}</p>
                <p className="text-sm text-muted">
                  {order.order_status} / {order.payment_status}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}