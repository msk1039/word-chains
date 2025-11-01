import Link from "next/link";

import { LoginForm } from "@/components/auth/login-form";

export default function LoginPage() {
  return (
    <main className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-linear-to-br from-slate-100 via-white to-indigo-100 px-4 py-12">
      <div className="flex w-full max-w-5xl flex-col items-center gap-6">
        <div className="text-center">
          <h1 className="text-3xl font-semibold text-slate-900">Welcome back</h1>
          <p className="text-sm text-slate-600">
            Don&apos;t have an account? <Link href="/signup" className="text-indigo-600 hover:underline">Sign up instead.</Link>
          </p>
        </div>
        <LoginForm />
      </div>
    </main>
  );
}
