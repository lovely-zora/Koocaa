import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
  pool: Pool | undefined;
};

// 1. Create a database connection pool (cached for Next.js hot reloads)
const pool = globalForPrisma.pool ?? new Pool({ 
  connectionString: process.env.DATABASE_URL 
});

if (process.env.NODE_ENV !== "production") globalForPrisma.pool = pool;

// 2. Wrap the pool in Prisma's PostgreSQL adapter
const adapter = new PrismaPg(pool);

// 3. Initialize Prisma 7 with the required adapter
export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({ adapter });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;