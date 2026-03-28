import { NextRequest, NextResponse } from "next/server";
import { preference, payment } from "@/lib/mercadopago";
import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    // Return early if database is disabled
    if (!prisma) {
      return NextResponse.json({ 
        error: "Pagamentos temporariamente desabilitados. Tente novamente mais tarde." 
      }, { status: 503 });
    }

    const body = await request.json();
    const {
      items,
      payer,
      shippingAddress,
      shippingCost,
      discount,
      paymentMethod,
    } = body;

    if (!items || items.length === 0) {
      return NextResponse.json(
        { error: "Carrinho vazio" },
        { status: 400 }
      );
    }

    const session = await getServerSession(authOptions);
    const userId = session?.user
      ? (session.user as unknown as { id: string }).id
      : undefined;

    // Calculate totals
    const subtotal = items.reduce(
      (acc: number, item: { price: number; quantity: number }) =>
        acc + item.price * item.quantity,
      0
    );
    const total = subtotal + shippingCost - (discount || 0);

    // Create order in database
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const orderData: any = {
      userId: userId ?? null,
      status: "pending",
      total,
      subtotal,
      shipping: shippingCost,
      discount: discount || 0,
      paymentMethod: paymentMethod || "mercadopago",
      shippingAddress: JSON.stringify(shippingAddress),
      items: {
        create: await Promise.all(
          items.map(
            async (item: {
              productId: string;
              name: string;
              quantity: number;
              price: number;
              size?: string;
              color?: string;
              customDesign?: string;
            }) => {
              // Find real product by slug
              const realProduct = await prisma!.product.findUnique({
                where: { slug: item.productId },
                select: { id: true },
              });
              
              return {
                productId: realProduct?.id || item.productId,
                quantity: item.quantity,
                price: item.price,
                size: item.size || null,
                color: item.color || null,
                customDesign: item.customDesign || null,
              };
            }
          )
        ),
      },
    };

    const order = await prisma.order.create({ data: orderData });

    const siteUrl = process.env.NEXTAUTH_URL || "https://thiagodesigncruz.com.br";

    // Create MercadoPago preference
    const mpItems = items.map(
      (item: { name: string; quantity: number; price: number }) => ({
        id: order.id,
        title: item.name,
        quantity: item.quantity,
        unit_price: Number(item.price),
        currency_id: "BRL" as const,
      })
    );

    // Add shipping as item if applicable
    if (shippingCost > 0) {
      mpItems.push({
        id: `${order.id}-shipping`,
        title: "Frete",
        quantity: 1,
        unit_price: Number(shippingCost),
        currency_id: "BRL" as const,
      });
    }

    // Add discount as negative item if applicable
    if (discount > 0) {
      mpItems.push({
        id: `${order.id}-discount`,
        title: "Desconto Pix",
        quantity: 1,
        unit_price: -Number(discount),
        currency_id: "BRL" as const,
      });
    }

    // Handle Pix payment directly
    if (paymentMethod === "pix") {
      try {
        const paymentData = {
          transaction_amount: Number(total),
          description: `Pedido ${order.id}`,
          payment_method_id: "pix",
          payer: {
            email: payer.email,
            identification: {
              type: "CPF",
              number: payer.cpf?.replace(/\D/g, ""),
            },
            first_name: payer.name.split(" ")[0],
            last_name: payer.name.split(" ").slice(1).join(" "),
          },
          external_reference: order.id,
          notification_url: `${siteUrl}/api/payments/webhook`,
        };

        const paymentResponse = await payment.create({ body: paymentData });

        // Update order with payment ID
        await prisma.order.update({
          where: { id: order.id },
          data: { 
            paymentId: paymentResponse.id?.toString() || "",
            status: "pending"
          }
        });

        return NextResponse.json({
          orderId: order.id,
          paymentId: paymentResponse.id,
          qrCode: paymentResponse.point_of_interaction?.transaction_data?.qr_code,
          qrCodeBase64: paymentResponse.point_of_interaction?.transaction_data?.qr_code_base64,
          status: paymentResponse.status,
          paymentMethod: "pix"
        });
      } catch (pixError) {
        console.error("Pix payment error:", pixError);
        // Fallback to preference if Pix fails
      }
    }

    // Create MercadoPago preference for other payment methods
    const preferenceData = await preference.create({
      body: {
        items: mpItems,
        payer: {
          name: payer.name,
          email: payer.email,
          phone: {
            number: payer.phone,
          },
          identification: {
            type: "CPF",
            number: payer.cpf?.replace(/\D/g, ""),
          },
        },
        back_urls: {
          success: `${siteUrl}/pedido-confirmado?order=${order.id}`,
          failure: `${siteUrl}/checkout?error=payment_failed&order=${order.id}`,
          pending: `${siteUrl}/pedido-confirmado?order=${order.id}&status=pending`,
        },
        auto_return: "approved",
        external_reference: order.id,
        notification_url: `${siteUrl}/api/payments/webhook`,
        statement_descriptor: "THIAGO DESIGN",
        payment_methods: {
          installments: 12,
        },
      },
    });

    return NextResponse.json({
      preferenceId: preferenceData.id,
      initPoint: preferenceData.init_point,
      sandboxInitPoint: preferenceData.sandbox_init_point,
      orderId: order.id,
    });
  } catch (error) {
    console.error("Payment creation error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Erro ao processar pagamento" },
      { status: 500 }
    );
  }
}
