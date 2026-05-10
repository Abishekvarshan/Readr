import Link from "next/link";
import { FirebaseAuthButtons } from "@/components/auth/firebase-auth-buttons";
import { loginAction } from "@/server/actions";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const nextPath = typeof params.next === "string" ? params.next : undefined;

  return (
    <div className="container-shell py-14">
      <div className="surface mx-auto max-w-lg p-8">
        <h1 className="text-3xl font-bold">Login</h1>
        <p className="mt-2 text-muted">Access your account, manage listings, and review orders.</p>
        {typeof params.message === "string" && (
          <div className="mt-4 rounded-2xl border border-[var(--border)] p-3 text-sm text-muted">
            {params.message}
          </div>
        )}
        <form action={loginAction} className="mt-6 grid gap-4">
          <label>
            <span className="mb-2 block text-sm font-medium">Email</span>
            <input className="field" type="email" name="email" required />
          </label>
          <label>
            <span className="mb-2 block text-sm font-medium">Password</span>
            <input className="field" type="password" name="password" required />
          </label>
          <button className="btn-primary" type="submit">Login</button>
        </form>
        <FirebaseAuthButtons nextPath={nextPath ?? "/books"} />
        <p className="mt-4 text-sm text-muted">
          No account yet? <Link href="/signup" className="font-semibold text-[var(--primary)]">Create one</Link>
        </p>
      </div>
    </div>
  );
}
