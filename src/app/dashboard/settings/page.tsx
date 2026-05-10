import { requireRole } from "@/lib/auth/session";
import { env, hasPayHere, hasSupabase } from "@/lib/config";

export default async function DashboardSettingsPage() {
  await requireRole(["seller", "admin"]);

  return (
    <div className="container-shell py-10">
      <h1 className="text-3xl font-bold">Configuration status</h1>
      <div className="mt-8 grid gap-4 md:grid-cols-2">
        <div className="surface p-5">
          <p className="text-sm text-muted">Supabase</p>
          <p className="mt-1 text-xl font-semibold">{hasSupabase ? "Connected via env" : "Missing environment values"}</p>
        </div>
        <div className="surface p-5">
          <p className="text-sm text-muted">PayHere Sandbox</p>
          <p className="mt-1 text-xl font-semibold">{hasPayHere ? "Configured" : "Pending credentials"}</p>
        </div>
        <div className="surface p-5 md:col-span-2">
          <p className="text-sm text-muted">App URL</p>
          <p className="mt-1 font-semibold">{env.appUrl}</p>
        </div>
      </div>
    </div>
  );
}