import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(request: NextRequest) {
  try {
    // Return early if database is disabled
    if (!prisma) {
      return NextResponse.json({ message: "Database temporarily disabled" }, { status: 503 });
    }

    const body = await request.json();
    const { event, productId, sessionId, userId, metadata, page } = body;

    if (productId) {
      await prisma.productAnalytics.create({
        data: {
          event,
          productId,
          sessionId,
          userId,
          metadata: metadata ? JSON.stringify(metadata) : null,
        },
      });
    } else {
      await prisma.siteAnalytics.create({
        data: {
          event,
          sessionId,
          userId,
          page,
          metadata: metadata ? JSON.stringify(metadata) : null,
        },
      });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Erro ao registrar analytics" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    // Return early if database is disabled
    if (!prisma) {
      return NextResponse.json({ message: "Database temporarily disabled" }, { status: 503 });
    }

    const { searchParams } = new URL(request.url);
    const period = searchParams.get("period") || "30d";

    const daysMap: Record<string, number> = {
      "7d": 7,
      "30d": 30,
      "90d": 90,
      "365d": 365,
    };

    const days = daysMap[period] || 30;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const [productViews, addToCarts, purchases, cartAbandons, siteViews] =
      await Promise.all([
        prisma.productAnalytics.count({
          where: { event: "view", createdAt: { gte: startDate } },
        }),
        prisma.productAnalytics.count({
          where: { event: "add_to_cart", createdAt: { gte: startDate } },
        }),
        prisma.productAnalytics.count({
          where: { event: "purchase", createdAt: { gte: startDate } },
        }),
        prisma.productAnalytics.count({
          where: { event: "cart_abandon", createdAt: { gte: startDate } },
        }),
        prisma.siteAnalytics.count({
          where: { event: "page_view", createdAt: { gte: startDate } },
        }),
      ]);

    const topProducts = await prisma.productAnalytics.groupBy({
      by: ["productId"],
      where: { event: "view", createdAt: { gte: startDate } },
      _count: { id: true },
      orderBy: { _count: { id: "desc" } },
      take: 10,
    });

    const topProductDetails = await Promise.all(
      topProducts.map(async (item: { productId: string; _count: { id: number } }) => {
        const product = await prisma.product.findUnique({
          where: { id: item.productId },
          select: { name: true, slug: true },
        });
        return {
          productId: item.productId,
          name: product?.name || "Produto removido",
          views: item._count.id,
        };
      })
    );

    return NextResponse.json({
      summary: {
        productViews,
        addToCarts,
        purchases,
        cartAbandons,
        siteViews,
        conversionRate:
          productViews > 0
            ? ((purchases / productViews) * 100).toFixed(2)
            : "0",
      },
      topProducts: topProductDetails,
    });
  } catch {
    return NextResponse.json(
      { error: "Erro ao buscar analytics" },
      { status: 500 }
    );
  }
}
