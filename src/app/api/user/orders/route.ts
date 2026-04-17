import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const userId = (session.user as any).id;

    const orders = await prisma?.order.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      include: {
        items: {
          include: {
            product: { select: { nome: true, sku: true } }
          }
        }
      },
    });

    if (!orders) {
      return NextResponse.json([]);
    }

    const formattedOrders = orders.map((order) => ({
      id: order.id,
      status: order.status,
      total: order.total,
      subtotal: order.subtotal,
      shipping: order.shipping,
      discount: order.discount,
      paymentMethod: order.paymentMethod,
      paymentId: order.paymentId,
      trackingCode: order.trackingCode,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
      items: order.items.map((item: any) => ({
        id: item.id,
        name: item.product?.nome || `Produto ${item.productId}`,
        sku: item.product?.sku || null,
        quantity: item.quantity,
        price: item.price,
        size: item.size,
        color: item.color,
        customDesign: item.customDesign,
      })),
      shippingAddress: order.shippingAddress ? JSON.parse(order.shippingAddress) : null,
    }));

    return NextResponse.json(formattedOrders);
  } catch (error) {
    console.error("Error fetching user orders:", error);
    return NextResponse.json(
      { error: "Erro ao buscar pedidos do usuário" },
      { status: 500 }
    );
  }
}
