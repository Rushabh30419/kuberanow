"use client";

import { useTransition } from "react";

type Props = {
  callbackUrl?: string;
  error?: string;
  loginAction: (formData: FormData) => Promise<void>;
};

const ERROR_MESSAGES: Record<string, string> = {
  CredentialsSignin: "Invalid email or password.",
  default: "Something went wrong. Please try again.",
};

export default function LoginCard({ callbackUrl, error, loginAction }: Props) {
  const [pending, start] = useTransition();

  const errorMessage = error
    ? ERROR_MESSAGES[error] ?? ERROR_MESSAGES.default
    : null;

  return (
    <div className="w-full max-w-md">
      <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold text-slate-900">Welcome back</h1>
          <p className="mt-1 text-sm text-slate-500">
            Sign in to your KuberaNow account
          </p>
        </div>

        {errorMessage && (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {errorMessage}
          </div>
        )}

        <form
          action={(formData) => start(() => loginAction(formData))}
          className="space-y-4"
        >
          <input type="hidden" name="callbackUrl" value={callbackUrl ?? "/admin"} />
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">
              Email
            </label>
            <input
              name="email"
              type="email"
              autoComplete="email"
              required
              className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">
              Password
            </label>
            <input
              name="password"
              type="password"
              autoComplete="current-password"
              required
              className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
              placeholder="••••••••"
            />
          </div>
          <button
            type="submit"
            disabled={pending}
            className="w-full rounded-lg bg-blue-700 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-800 disabled:opacity-60"
          >
            {pending ? "Signing in…" : "Sign in"}
          </button>
        </form>

        <div className="mt-6 rounded-lg bg-slate-50 p-3 text-xs text-slate-500">
          <p className="font-semibold text-slate-600">Demo accounts</p>
          <p className="mt-1">admin@kuberanow.com · editor@kuberanow.com · reader@kuberanow.com</p>
          <p>Passwords are <code className="rounded bg-slate-200 px-1">{`<role>123`}</code> (e.g. <code className="rounded bg-slate-200 px-1">admin123</code>)</p>
        </div>

        <p className="mt-6 text-center text-sm text-slate-500">
          New here?{" "}
          <a href="/register" className="font-semibold text-blue-700 hover:underline">
            Create an account
          </a>
        </p>
      </div>
    </div>
  );
}
