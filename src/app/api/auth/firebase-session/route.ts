import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

const cookieName = "firebase_session";

type FirebaseLookupUser = {
  localId: string;
  email?: string;
  displayName?: string;
  photoUrl?: string;
  providerUserInfo?: Array<{ providerId?: string }>;
};

export async function GET() {
  const cookieStore = await cookies();
  const session = cookieStore.get(cookieName)?.value;

  if (!session) {
    return NextResponse.json({ profile: null });
  }

  try {
    return NextResponse.json({ profile: JSON.parse(session) });
  } catch {
    cookieStore.delete(cookieName);
    return NextResponse.json({ profile: null });
  }
}

export async function POST(request: Request) {
  const { idToken } = (await request.json()) as { idToken?: string };
  const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;

  if (!idToken || !apiKey) {
    return NextResponse.json({ error: "Missing Firebase token or config." }, { status: 400 });
  }

  const response = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${apiKey}`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ idToken }),
  });

  if (!response.ok) {
    return NextResponse.json({ error: "Firebase token verification failed." }, { status: 401 });
  }

  const data = (await response.json()) as { users?: FirebaseLookupUser[] };
  const user = data.users?.[0];

  if (!user) {
    return NextResponse.json({ error: "Firebase user was not found." }, { status: 401 });
  }

  const provider = user.providerUserInfo?.[0]?.providerId ?? "firebase";
  const profile = {
    id: user.localId,
    email: user.email ?? null,
    full_name: user.displayName ?? null,
    photo_url: user.photoUrl ?? null,
    provider,
    role: "customer",
  };

  const admin = createSupabaseAdminClient();
  const { error: saveError } = admin
    ? await admin.from("firebase_profiles").upsert(
        {
          ...profile,
          last_login_at: new Date().toISOString(),
        },
        { onConflict: "id" },
      )
    : { error: null };

  const cookieStore = await cookies();
  cookieStore.set(
    cookieName,
    JSON.stringify(profile),
    {
      httpOnly: true,
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    },
  );

  return NextResponse.json({
    ok: true,
    profile,
    savedProfile: Boolean(admin && !saveError),
    saveError: saveError?.message ?? null,
  });
}

export async function DELETE() {
  const cookieStore = await cookies();
  cookieStore.delete(cookieName);

  return NextResponse.json({ ok: true });
}
