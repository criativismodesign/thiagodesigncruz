import { NextRequest, NextResponse } from "next/server";
import { payment } from "@/lib/mercadopago";
import { prisma } from "@/lib/db";

export async function POST(request: NextRequest) {
  try {
    // Return early if database is disabled
    if (!prisma) {
      return NextResponse.json({ received: true });
    }

    const body = await request.json();

    // MercadoPago sends different notification types
    if (body.type === "payment" || body.action === "payment.updated") {
      const paymentId = body.data?.id || body.id;

      if (!paymentId) {
        return NextResponse.json({ received: true });
      }

      // Fetch payment details from MercadoPago
      const paymentData = await payment.get({ id: paymentId });

      const orderId = paymentData.external_reference;
      if (!orderId) {
        return NextResponse.json({ received: true });
      }

      // Map MercadoPago status to our order status
      let orderStatus = "pending";
      switch (paymentData.status) {
        case "approved":
          orderStatus = "paid";
          break;
        case "pending":
        case "in_process":
          orderStatus = "pending";
          break;
        case "rejected":
        case "cancelled":
          orderStatus = "cancelled";
          break;
        case "refunded":
        case "charged_back":
          orderStatus = "cancelled";
          break;
      }

      // Update order in database
      await prisma.order.update({
        where: { id: orderId },
        data: {
          status: orderStatus,
          paymentId: String(paymentId),
          paymentMethod: paymentData.payment_method_id || "mercadopago",
        },
      });

      // If payment approved, update product stock
      if (orderStatus === "paid") {
        const orderItems = await prisma.orderItem.findMany({
          where: { orderId },
        });

        const order = await prisma.order.findUnique({
          where: { id: orderId },
        });

        for (const item of orderItems) {
          // Log purchase analytics
          await prisma.productAnalytics.create({
            data: {
              event: "purchase",
              produtoId: item.produtoId,
              userId: order?.userId,
              metadata: JSON.stringify({
                orderId,
                quantity: item.quantity,
                price: item.price,
              }),
            },
          });
        }
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook error:", error);
    // Always return 200 to MercadoPago to avoid retries
    return NextResponse.json({ received: true });
  }
}
