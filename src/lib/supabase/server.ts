import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import { env, hasSupabase } from "@/lib/config";

export async function createSupabaseServerClient() {
  const cookieStore = await cookies();

  if (!hasSupabase) {
    return null;
  }

  return createServerClient(
    env.supabaseUrl,
    env.supabasePublishableKey,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        },
      },
    },
  );
}
