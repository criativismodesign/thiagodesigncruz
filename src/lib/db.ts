import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// Emergency: completely disable database in production
export const prisma = undefined;

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
