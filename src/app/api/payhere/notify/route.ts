import { NextResponse } from "next/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { verifyPayHereNotification } from "@/lib/payhere";

export async function POST(request: Request) {
  const formData = await request.formData();
  const payload = Object.fromEntries(
    [...formData.entries()].map(([key, value]) => [key, String(value)]),
  ) as Record<string, string>;

  const admin = createSupabaseAdminClient();
  if (!admin) {
    return NextResponse.json({ ok: false, message: "Supabase admin client not configured" }, { status: 500 });
  }

  const isValid = verifyPayHereNotification(payload);

  await admin.from("payment_logs").insert({
    order_id: payload.order_id,
    payload,
    is_valid: isValid,
  });

  if (isValid) {
    const paid = payload.status_code === "2";

    await admin
      .from("orders")
      .update({
        payhere_payment_id: payload.payment_id || null,
        payment_status: paid ? "paid" : "failed",
        order_status: paid ? "paid" : "failed",
      })
      .eq("id", payload.order_id);
  }

  return NextResponse.json({ ok: true });
}