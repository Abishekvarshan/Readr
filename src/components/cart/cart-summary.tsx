import { formatCurrency } from "@/lib/utils";

type Props = {
  subtotal: number;
  shipping: number;
  total: number;
};

export function CartSummary({ subtotal, shipping, total }: Props) {
  return (
    <aside className="surface h-fit p-5">
      <h3 className="text-lg font-semibold">Order summary</h3>
      <div className="mt-4 space-y-3 text-sm">
        <div className="flex justify-between">
          <span className="text-muted">Subtotal</span>
          <span>{formatCurrency(subtotal)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted">Shipping</span>
          <span>{formatCurrency(shipping)}</span>
        </div>
        <div className="flex justify-between border-t border-[var(--border)] pt-3 text-base font-semibold">
          <span>Total</span>
          <span>{formatCurrency(total)}</span>
        </div>
      </div>
    </aside>
  );
}