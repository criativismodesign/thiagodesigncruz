import { NextRequest, NextResponse } from "next/server";
import { payment } from "@/lib/mercadopago";
import { prisma } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const orderId = searchParams.get("order");

    if (!orderId) {
      return NextResponse.json({ error: "Order ID required" }, { status: 400 });
    }

    // Get order from database
    const order = await prisma?.order.findUnique({
      where: { id: orderId },
      select: { paymentId: true, status: true }
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // Check payment status in MercadoPago if we have payment ID
    if (order.paymentId) {
      try {
        const paymentData = await payment.get({
          id: order.paymentId
        });

        // Update order status if changed
        if (paymentData.status !== order.status) {
          await prisma?.order.update({
            where: { id: orderId },
            data: { status: paymentData.status }
          });
        }

        let statusNormalizado = paymentData.status
        if (paymentData.status === 'approved') statusNormalizado = 'paid'

        return NextResponse.json({
          status: statusNormalizado,
          orderId: orderId
        });
      } catch (mpError) {
        console.error("Error checking MercadoPago payment:", mpError);
        // Return current status from database
        return NextResponse.json({
          status: order.status,
          orderId: orderId
        });
      }
    }

    // Return current status from database
    return NextResponse.json({
      status: order.status,
      orderId: orderId
    });

  } catch (error) {
    console.error("Payment status check error:", error);
    return NextResponse.json(
      { error: "Erro ao verificar status do pagamento" },
      { status: 500 }
    );
  }
}
