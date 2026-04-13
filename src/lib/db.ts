import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// Emergency: create mock prisma to avoid TypeScript errors
const mockPrisma = {
  user: { 
    findUnique: async (args: any) => null, 
    create: async (args: any) => null 
  },
  product: { 
    findUnique: async (args: any) => null, 
    findMany: async (args: any) => [], 
    groupBy: async (args: any) => [] 
  },
  productAnalytics: { 
    create: async (args: any) => null, 
    count: async (args: any) => 0, 
    groupBy: async (args: any) => [] 
  },
  siteAnalytics: { 
    create: async (args: any) => null, 
    count: async (args: any) => 0, 
    groupBy: async (args: any) => [] 
  },
  order: { 
    create: async (args: any) => null, 
    findMany: async (args: any) => [] 
  },
  $connect: async () => {},
  $disconnect: async () => {},
};

// Production mode: use real database with DATABASE_URL for Vercel
// Always use real Prisma if DATABASE_URL is available (Vercel production)
export const prisma = process.env.DATABASE_URL 
  ? new PrismaClient({
      log: process.env.NODE_ENV === "production" ? ["error", "warn"] : ["query", "error", "warn"],
      datasources: {
        db: {
          url: process.env.DATABASE_URL
        }
      }
    })
  : (globalForPrisma.prisma ?? new PrismaClient({
      log: ["query", "error", "warn"],
    }));

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
