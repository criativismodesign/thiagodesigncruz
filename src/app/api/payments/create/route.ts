import { NextRequest, NextResponse } from "next/server";
import { preference, payment } from "@/lib/mercadopago";
import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(request: NextRequest) {
  console.log("=== API PAYMENTS/CREATE START ===");
  console.log("Timestamp:", new Date().toISOString());
  
  try {
    console.log("=== API PAYMENTS/CREATE DEBUG ===");
    
    // Prisma should always be available in production
    if (!prisma) {
      console.log("ERROR: Prisma is null");
      return NextResponse.json({ 
        error: "Erro de conexão com o banco de dados." 
      }, { status: 500 });
    }

    const body = await request.json();
    console.log("Request body:", JSON.stringify(body, null, 2));
    const {
      items,
      payer,
      shippingAddress,
      shippingCost,
      discount,
      cupomId,
      cupomDesconto,
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
    const total = subtotal + shippingCost - (discount || 0) - (cupomDesconto || 0);

    // Create order in database without items first
    const orderData: any = {
      userId: userId ?? null,
      status: "pending",
      total,
      subtotal,
      shipping: shippingCost,
      discount: discount || 0,
      paymentMethod: paymentMethod || "mercadopago",
      shippingAddress: JSON.stringify(shippingAddress),
    };

    const order = await (prisma as any).order.create({ data: orderData });

    // Create order items using raw SQL to bypass foreign key constraint
    console.log("Creating order items with raw SQL...");
    
    for (const item of items) {
      // Find product
      let realProduct = await (prisma as any).produto.findUnique({
        where: { id: item.productId },
        select: { id: true },
      });
      
      if (!realProduct) {
        realProduct = await (prisma as any).produto.findUnique({
          where: { slug: item.productId },
          select: { id: true },
        });
      }
      
      if (!realProduct) {
        throw new Error(`Produto não encontrado: ${item.productId}`);
      }
      
      // Create OrderItem with raw SQL
      await (prisma as any).$executeRaw`
        INSERT INTO "OrderItem" (id, "orderId", "productId", quantity, price, size, color, "customDesign")
        VALUES (${`orderitem_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`}, ${order.id}, ${realProduct.id}, ${item.quantity}, ${item.price}, ${item.size || null}, ${item.color || null}, ${item.customDesign || null})
      `;
    }

    // Incrementar uso do cupom se aplicado
    if (cupomId) {
      await (prisma as any).cupom.update({
        where: { id: cupomId },
        data: { totalusado: { increment: 1 } }
      })
    }

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

    
    // Create MercadoPago preference for all payment methods (Pix, Cartão, Boleto)
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
    console.error("=== PAYMENT CREATION ERROR ===");
    console.error("Error:", error);
    console.error("Error message:", error instanceof Error ? error.message : "Unknown error");
    console.error("Error stack:", error instanceof Error ? error.stack : "No stack");
    console.error("=== END ERROR ===");
    
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Erro ao processar pagamento" },
      { status: 500 }
    );
  }
}
