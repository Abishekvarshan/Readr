import { NextResponse } from "next/server";
import { env, hasSupabase } from "@/lib/config";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function GET() {
  if (!hasSupabase) {
    return NextResponse.json(
      {
        connected: false,
        message: "Supabase env vars are missing.",
        hasUrl: Boolean(env.supabaseUrl),
        hasPublishableKey: Boolean(env.supabasePublishableKey),
      },
      { status: 500 },
    );
  }

  const supabase = await createSupabaseServerClient();

  if (!supabase) {
    return NextResponse.json(
      {
        connected: false,
        message: "Supabase client could not be created.",
      },
      { status: 500 },
    );
  }

  const { error: booksError } = await supabase
    .from("books")
    .select("id", { count: "exact", head: true });

  if (!booksError) {
    return NextResponse.json({
      connected: true,
      message: "Supabase is connected and the books table is reachable.",
      projectUrl: env.supabaseUrl,
    });
  }

  const { error: authError } = await supabase.auth.getSession();

  return NextResponse.json(
    {
      connected: !authError,
      message: authError
        ? "Supabase connection failed."
        : "Supabase is connected, but the books table is not reachable yet.",
      projectUrl: env.supabaseUrl,
      tableError: booksError.message,
      authError: authError?.message ?? null,
    },
    { status: authError ? 500 : 200 },
  );
}
