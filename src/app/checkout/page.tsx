import Link from "next/link";
import { redirect } from "next/navigation";
import { CartSummary } from "@/components/cart/cart-summary";
import { hasPayHere } from "@/lib/config";
import { getCartSummary, getOrderById } from "@/lib/data/queries";
import { buildPayHerePayload, getPayHereEndpoint } from "@/lib/payhere";
import { createCheckoutOrderAction } from "@/server/actions";

export default async function CheckoutPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const orderId = typeof params.order_id === "string" ? params.order_id : undefined;
  const summary = await getCartSummary();

  if (!summary.lines.length && !orderId) {
    redirect("/cart");
  }

  const order = orderId ? await getOrderById(orderId) : null;

  return (
    <div className="container-shell py-10">
      <h1 className="text-3xl font-bold">Checkout</h1>
      <p className="mt-2 text-muted">Collect customer details and test the sandbox payment flow.</p>

      {typeof params.message === "string" && (
        <div className="surface mt-6 p-4 text-sm text-muted">{params.message}</div>
      )}

      <div className="mt-8 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="surface p-6">
          {!order ? (
            <form action={createCheckoutOrderAction} className="grid gap-4">
              <label>
                <span className="mb-2 block text-sm font-medium">Full name</span>
                <input className="field" name="customerName" required />
              </label>
              <label>
                <span className="mb-2 block text-sm font-medium">Email</span>
                <input className="field" type="email" name="customerEmail" required />
              </label>
              <label>
                <span className="mb-2 block text-sm font-medium">Phone number</span>
                <input className="field" name="customerPhone" required />
              </label>
              <label>
                <span className="mb-2 block text-sm font-medium">Delivery address</span>
                <textarea className="field min-h-28" name="customerAddress" required />
              </label>
              <button className="btn-primary" type="submit">
                Create order and continue
              </button>
            </form>
          ) : hasPayHere ? (
            <div className="space-y-5">
              <div>
                <h2 className="text-xl font-semibold">Order created</h2>
                <p className="mt-2 text-muted">
                  Your order is ready. Continue to PayHere Sandbox to test a real payment callback flow.
                </p>
              </div>
              <form action={getPayHereEndpoint()} method="post" className="space-y-4">
                {Object.entries(buildPayHerePayload(order)).map(([key, value]) => (
                  <input key={key} type="hidden" name={key} value={String(value)} />
                ))}
                <button className="btn-primary" type="submit">
                  Pay with PayHere Sandbox
                </button>
              </form>
              <p className="text-sm text-muted">
                Sandbox merchant ID and secret must be configured in your environment variables.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              <h2 className="text-xl font-semibold">PayHere not configured yet</h2>
              <p className="text-muted">
                The order was created successfully, but you still need to add the PayHere sandbox merchant credentials.
              </p>
              <Link href={`/orders/success?order_id=${order.id}`} className="btn-secondary">
                View order confirmation
              </Link>
            </div>
          )}
        </div>

        <div className="space-y-4">
          <CartSummary subtotal={summary.subtotal} shipping={summary.shipping} total={summary.total} />
          <div className="surface p-5 text-sm text-muted">
            <p className="font-semibold text-foreground">PayHere Sandbox checklist</p>
            <ul className="mt-3 list-disc space-y-2 pl-5">
              <li>Use sandbox merchant credentials from the README.</li>
              <li>Set the notify URL to <code>/api/payhere/notify</code>.</li>
              <li>Keep the Vercel or local tunnel URL in sync with PayHere settings.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}