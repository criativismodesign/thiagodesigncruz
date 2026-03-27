import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? 
  (process.env.NODE_ENV === "production" && process.env.DIRECT_URL
    ? new PrismaClient({ datasources: { db: { url: process.env.DIRECT_URL } } })
    : new PrismaClient());

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
