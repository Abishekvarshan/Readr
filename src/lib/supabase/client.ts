import { createBrowserClient } from "@supabase/ssr";
import { env, hasSupabase } from "@/lib/config";

export function createSupabaseBrowserClient() {
  if (!hasSupabase) {
    return null;
  }

  return createBrowserClient(env.supabaseUrl, env.supabasePublishableKey);
}
