import { PrismaClient } from "@prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";

/**
 * Prisma singleton with the SQLite driver adapter (Prisma 7 requirement).
 *
 * To switch to PostgreSQL (Supabase/Neon):
 *   1. npm install @prisma/adapter-pg
 *   2. change provider in prisma/schema.prisma to "postgresql"
 *   3. replace the adapter below with:
 *        import { PrismaPg } from "@prisma/adapter-pg";
 *        const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
 *   4. npx prisma migrate dev
 */
function createPrismaClient() {
  const adapter = new PrismaBetterSqlite3({ url: process.env.DATABASE_URL! });
  return new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });
}

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
