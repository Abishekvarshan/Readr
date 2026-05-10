import { NextResponse } from "next/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { mockBooks } from "@/lib/data/mock";

export async function POST() {
  const admin = createSupabaseAdminClient();
  if (!admin) {
    return NextResponse.json({ ok: false, message: "Missing SUPABASE_SERVICE_ROLE_KEY" }, { status: 500 });
  }

  const { error } = await admin.from("books").upsert(mockBooks, { onConflict: "slug" });
  if (error) {
    return NextResponse.json({ ok: false, message: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true, inserted: mockBooks.length });
}