import crypto from "crypto";
import { absoluteUrl } from "@/lib/utils";
import { env } from "@/lib/config";
import { type Order } from "@/types";

function md5(value: string) {
  return crypto.createHash("md5").update(value).digest("hex").toUpperCase();
}

export function buildPayHerePayload(order: Order) {
  const amount = Number(order.total_amount).toFixed(2);
  const merchantSecretHash = md5(env.payHereMerchantSecret);
  const hash = md5(`${env.payHereMerchantId}${order.id}${amount}${order.currency}${merchantSecretHash}`);

  return {
    merchant_id: env.payHereMerchantId,
    return_url: absoluteUrl(`/orders/success?order_id=${order.id}`),
    cancel_url: absoluteUrl(`/checkout?cancelled=1`),
    notify_url: absoluteUrl("/api/payhere/notify"),
    order_id: order.id,
    items: `Readr Order ${order.id}`,
    currency: order.currency,
    amount,
    first_name: order.customer_name.split(" ")[0] || order.customer_name,
    last_name: order.customer_name.split(" ").slice(1).join(" ") || "Customer",
    email: order.customer_email,
    phone: order.customer_phone,
    address: order.customer_address,
    city: "Colombo",
    country: "Sri Lanka",
    hash,
  };
}

export function getPayHereEndpoint() {
  return env.payHereSandbox
    ? "https://sandbox.payhere.lk/pay/checkout"
    : "https://www.payhere.lk/pay/checkout";
}

export function verifyPayHereNotification(payload: Record<string, string>) {
  const merchantSecretHash = md5(env.payHereMerchantSecret);
  const local = md5(
    `${payload.merchant_id}${payload.order_id}${payload.payhere_amount}${payload.payhere_currency}${payload.status_code}${merchantSecretHash}`,
  );
  return local === payload.md5sig?.toUpperCase();
}
