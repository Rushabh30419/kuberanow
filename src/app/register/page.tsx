import type { Metadata } from "next";
import { redirect } from "next/navigation";
import bcrypt from "bcryptjs";
import { auth, signIn } from "@/lib/auth";
import { prisma } from "@/lib/db";
import RegisterCard from "./RegisterCard";

export const metadata: Metadata = {
  title: "Create account | KuberaNow",
};

export default async function RegisterPage() {
  const session = await auth();
  if (session) redirect("/dashboard");

  async function registerAction(formData: FormData) {
    "use server";
    const name = String(formData.get("name") ?? "").trim();
    const email = String(formData.get("email") ?? "").toLowerCase().trim();
    const password = String(formData.get("password") ?? "");

    if (!email || !password || password.length < 6) {
      throw new Error("Please provide a valid email and a password of at least 6 characters.");
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      throw new Error("An account with this email already exists.");
    }

    const passwordHash = await bcrypt.hash(password, 12);
    await prisma.user.create({
      data: { name, email, passwordHash, role: "reader" },
    });

    await signIn("credentials", { email, password, redirectTo: "/dashboard" });
  }

  return (
    <main className="bg-background-color flex w-full flex-1 items-center justify-center px-4 py-16">
      <RegisterCard registerAction={registerAction} />
    </main>
  );
}
