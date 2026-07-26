import NextAuth, { type NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "./db";
import type { UserRole } from "./types";

/**
 * Auth.js v5 config with Credentials provider.
 *
 * - Passwords verified via bcrypt against the User table.
 * - The session/JWT is extended with `role` and `id` for use in guards,
 *   middleware, and the admin UI.
 */
const config = {
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
  },
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(creds) {
        const email = creds?.email as string | undefined;
        const password = creds?.password as string | undefined;
        if (!email || !password) return null;

        const user = await prisma.user.findUnique({
          where: { email: email.toLowerCase() },
          include: {
            roleRelation: {
              select: {
                name: true,
                permissions: {
                  select: { permission: { select: { key: true } } },
                },
              },
            },
          },
        });
        if (!user || !user.passwordHash) return null;

        const valid = await bcrypt.compare(password, user.passwordHash);
        if (!valid) return null;

        // Map the role name back to the legacy UserRole union for the JWT,
        // plus the full permission-key list for client-side gating.
        const roleName = user.roleRelation?.name ?? "Reader";
        const legacyRole: UserRole =
          roleName === "Admin" ? "admin" : roleName === "Editor" ? "editor" : "reader";
        const permissions = user.roleRelation?.permissions.map((rp) => rp.permission.key) ?? [];

        return {
          id: user.id,
          email: user.email,
          name: user.name ?? undefined,
          role: legacyRole,
          permissions,
        };
      },
    }),
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.id = user.id as string;
        token.role = (user as { role: UserRole }).role;
        token.permissions = (user as { permissions?: string[] }).permissions ?? [];
      }
      return token;
    },
    session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as UserRole;
        session.user.permissions = (token.permissions as string[] | undefined) ?? [];
      }
      return session;
    },
  },
} satisfies NextAuthConfig;

export const { auth, handlers, signIn, signOut } = NextAuth(config);
