import { createClient } from "@supabase/supabase-js";
import { hasSupabaseAdmin } from "@/lib/config";

export function createSupabaseAdminClient() {
  if (!hasSupabaseAdmin) {
    return null;
  }

  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    },
  );
}