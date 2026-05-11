import Link from "next/link";
import { getOrderById } from "@/lib/data/queries";
import { formatCurrency } from "@/lib/utils";

export default async function OrderSuccessPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const orderId = typeof params.order_id === "string" ? params.order_id : "";
  const order = orderId ? await getOrderById(orderId) : null;

  return (
    <div className="container-shell py-16">
      <div className="surface mx-auto max-w-3xl p-8 text-center">
        <span className="badge badge-green">Order confirmation</span>
        <h1 className="mt-4 text-4xl font-bold">Thanks for your order!</h1>
        <p className="mt-3 text-muted">
          {order
            ? `Order ${order.id} has been recorded with a current payment status of ${order.payment_status}.`
            : "Your order was received. Payment status will be updated after the PayHere notify callback succeeds."}
        </p>

        {order && (
          <div className="mt-8 grid gap-4 text-left md:grid-cols-2">
            <div className="surface p-4">
              <p className="text-sm text-muted">Customer</p>
              <p className="font-semibold">{order.customer_name}</p>
              <p className="text-sm text-muted">{order.customer_email}</p>
            </div>
            <div className="surface p-4">
              <p className="text-sm text-muted">Total</p>
              <p className="font-semibold">{formatCurrency(order.total_amount)}</p>
              <p className="text-sm text-muted">Status: {order.order_status}</p>
            </div>
          </div>
        )}

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href="/books" className="btn-primary">Continue shopping</Link>
          <Link href="/dashboard/orders" className="btn-secondary">View orders dashboard</Link>
        </div>
      </div>
    </div>
  );
}
