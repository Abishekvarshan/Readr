import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { type Profile, type UserRole } from "@/types";

const firebaseSessionCookieName = "firebase_session";

async function getFirebaseProfile(): Promise<Profile | null> {
  const cookieStore = await cookies();
  const session = cookieStore.get(firebaseSessionCookieName)?.value;
  if (!session) return null;

  try {
    const profile = JSON.parse(session) as Partial<Profile>;
    if (!profile.id) return null;

    return {
      id: profile.id,
      full_name: profile.full_name ?? null,
      email: profile.email ?? null,
      role: profile.role === "admin" || profile.role === "customer" || profile.role === "seller"
        ? profile.role
        : "customer",
    };
  } catch {
    return null;
  }
}

export async function getCurrentUser() {
  const supabase = await createSupabaseServerClient();
  if (!supabase) return null;

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return user;
}

export async function getCurrentProfile(): Promise<Profile | null> {
  const supabase = await createSupabaseServerClient();
  if (!supabase) return getFirebaseProfile();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return getFirebaseProfile();

  const { data } = await supabase
    .from("profiles")
    .select("id, full_name, email, role")
    .eq("id", user.id)
    .single();

  return (
    data || {
      id: user.id,
      full_name: user.user_metadata?.full_name ?? null,
      email: user.email ?? null,
      role: "customer",
    }
  );
}

export async function requireRole(roles: UserRole[]) {
  const profile = await getCurrentProfile();
  if (!profile || !roles.includes(profile.role)) {
    redirect("/login?next=/dashboard");
  }
  return profile;
}
