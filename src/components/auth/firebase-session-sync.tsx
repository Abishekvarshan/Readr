"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { firebaseAuth } from "@/lib/firebase/client";

type FirebaseSessionProfile = {
  id?: string;
  role?: string;
};

async function getServerProfile() {
  const response = await fetch("/api/auth/firebase-session", { cache: "no-store" });
  if (!response.ok) return null;

  const data = (await response.json()) as { profile?: FirebaseSessionProfile | null };
  return data.profile ?? null;
}

export function FirebaseSessionSync() {
  const router = useRouter();
  const syncedUidRef = useRef<string | null>(null);

  useEffect(() => {
    if (!firebaseAuth) return undefined;

    return onAuthStateChanged(firebaseAuth, async (firebaseUser) => {
      const serverProfile = await getServerProfile();

      if (!firebaseUser) {
        syncedUidRef.current = null;
        if (!serverProfile) return;
        await fetch("/api/auth/firebase-session", { method: "DELETE" });
        router.refresh();
        return;
      }

      if (syncedUidRef.current === firebaseUser.uid) return;
      if (serverProfile?.id === firebaseUser.uid && serverProfile.role === "customer") return;

      const idToken = await firebaseUser.getIdToken();
      const response = await fetch("/api/auth/firebase-session", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ idToken }),
      });

      if (response.ok) {
        syncedUidRef.current = firebaseUser.uid;
        router.refresh();
      }
    });
  }, [router]);

  return null;
}
