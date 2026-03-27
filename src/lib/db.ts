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

// Enable database in production with DIRECT_URL
export const prisma = process.env.NODE_ENV === "production" 
  ? new PrismaClient({
      log: ["error", "warn"],
      datasources: {
        db: {
          url: process.env.DIRECT_URL || process.env.DATABASE_URL
        }
      }
    })
  : (globalForPrisma.prisma ?? new PrismaClient({
      log: ["query", "error", "warn"],
    }));

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
