import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// Temporarily disable database in production
export const prisma = process.env.NODE_ENV === "production" 
  ? undefined 
  : (globalForPrisma.prisma ?? new PrismaClient({
      log: ["query", "error", "warn"],
    }));

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
