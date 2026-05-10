import Link from "next/link";
import { FirebaseAuthButtons } from "@/components/auth/firebase-auth-buttons";
import { signupAction } from "@/server/actions";

export default async function SignupPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;

  return (
    <div className="container-shell py-14">
      <div className="surface mx-auto max-w-lg p-8">
        <h1 className="text-3xl font-bold">Create account</h1>
        <p className="mt-2 text-muted">Create a customer account to browse books, save your session, and checkout faster.</p>
        {typeof params.message === "string" && (
          <div className="mt-4 rounded-2xl border border-[var(--border)] p-3 text-sm text-muted">
            {params.message}
          </div>
        )}
        <form action={signupAction} className="mt-6 grid gap-4">
          <label>
            <span className="mb-2 block text-sm font-medium">Full name</span>
            <input className="field" name="fullName" required />
          </label>
          <label>
            <span className="mb-2 block text-sm font-medium">Email</span>
            <input className="field" type="email" name="email" required />
          </label>
          <label>
            <span className="mb-2 block text-sm font-medium">Password</span>
            <input className="field" type="password" name="password" required />
          </label>
          <button className="btn-primary" type="submit">Create account</button>
        </form>
        <FirebaseAuthButtons nextPath="/books" />
        <p className="mt-4 text-sm text-muted">
          Already registered? <Link href="/login" className="font-semibold text-[var(--primary)]">Login</Link>
        </p>
      </div>
    </div>
  );
}
