"use client";

import { useEffect, useState } from "react";
import {
  FacebookAuthProvider,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
  signOut,
  type User,
} from "firebase/auth";
import { useRouter } from "next/navigation";
import { loadFirebaseAnalytics, firebaseAuth } from "@/lib/firebase/client";

type Props = {
  nextPath?: string;
};

type AuthProvider = "google" | "facebook";

function safeNextPath(nextPath?: string) {
  if (!nextPath || !nextPath.startsWith("/") || nextPath.startsWith("/dashboard")) {
    return "/books";
  }

  return nextPath;
}

function providerFor(provider: AuthProvider) {
  if (provider === "google") {
    const googleProvider = new GoogleAuthProvider();
    googleProvider.setCustomParameters({ prompt: "select_account" });
    return googleProvider;
  }

  return new FacebookAuthProvider();
}

export function FirebaseAuthButtons({ nextPath }: Props) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [message, setMessage] = useState("");
  const [isPending, setIsPending] = useState(false);

  async function createServerSession(firebaseUser: User) {
    const idToken = await firebaseUser.getIdToken();
    const response = await fetch("/api/auth/firebase-session", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ idToken }),
    });

    if (!response.ok) {
      const data = (await response.json().catch(() => null)) as { error?: string } | null;
      throw new Error(data?.error ?? "Could not create a Firebase server session.");
    }
  }

  useEffect(() => {
    void loadFirebaseAnalytics();
    if (!firebaseAuth) return undefined;

    return onAuthStateChanged(firebaseAuth, setUser);
  }, []);

  async function handleSignIn(provider: AuthProvider) {
    if (!firebaseAuth) {
      setMessage("Firebase is not configured yet.");
      return;
    }

    setMessage("");
    setIsPending(true);
    try {
      const result = await signInWithPopup(firebaseAuth, providerFor(provider));
      await createServerSession(result.user);
      setMessage(`Signed in as ${result.user.email ?? result.user.displayName ?? "Firebase user"}.`);
      router.refresh();
      window.location.assign(safeNextPath(nextPath));
    } catch (error) {
      const authError = error as { code?: string; message?: string };
      if (authError.code === "auth/popup-closed-by-user") {
        setMessage("Sign-in was cancelled.");
      } else {
        setMessage(authError.message ?? "Firebase sign-in failed.");
      }
      setIsPending(false);
    }
  }

  async function handleSignOut() {
    if (!firebaseAuth) return;
    await signOut(firebaseAuth);
    await fetch("/api/auth/firebase-session", { method: "DELETE" });
    router.refresh();
    setMessage("Signed out from Firebase.");
  }

  return (
    <div className="mt-6 grid gap-3">
      <div className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.18em] text-muted">
        <span className="h-px flex-1 bg-[var(--border)]" />
        Or continue with
        <span className="h-px flex-1 bg-[var(--border)]" />
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <button
          className="btn-secondary"
          disabled={isPending}
          type="button"
          onClick={() => handleSignIn("google")}
        >
          Google
        </button>
        <button
          className="btn-secondary"
          disabled={isPending}
          type="button"
          onClick={() => handleSignIn("facebook")}
        >
          Facebook
        </button>
      </div>
      {user && (
        <button className="text-left text-sm font-semibold text-[var(--primary)]" type="button" onClick={handleSignOut}>
          Sign out {user.email ?? user.displayName}
        </button>
      )}
      {message && <p className="text-sm text-muted">{message}</p>}
    </div>
  );
}
