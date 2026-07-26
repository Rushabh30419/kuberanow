import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth, signIn } from "@/lib/auth";
import LoginCard from "./LoginCard";

export const metadata: Metadata = {
  title: "Login | KuberaNow",
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string; error?: string }>;
}) {
  const session = await auth();
  if (session) redirect(session.user.role === "reader" ? "/dashboard" : "/admin");

  const params = await searchParams;

  async function loginAction(formData: FormData) {
    "use server";
    const email = String(formData.get("email") ?? "").toLowerCase();
    const password = String(formData.get("password") ?? "");
    const callbackUrl = String(formData.get("callbackUrl") ?? "/admin");
    try {
      await signIn("credentials", { email, password, redirectTo: callbackUrl });
    } catch (err) {
      // NextAuth throws a redirect on success; only rethrow actual errors.
      if (err instanceof Error && err.message === "NEXT_REDIRECT") throw err;
      throw err;
    }
  }

  return (
    <main className="bg-background-color flex w-full flex-1 items-center justify-center px-4 py-16">
      <LoginCard callbackUrl={params.callbackUrl} error={params.error} loginAction={loginAction} />
    </main>
  );
}
