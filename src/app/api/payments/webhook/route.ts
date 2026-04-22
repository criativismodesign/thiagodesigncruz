import { NextRequest, NextResponse } from "next/server";
import { payment } from "@/lib/mercadopago";
import { prisma } from "@/lib/prisma";
import { enviarEmailNovoPedido, enviarEmailConfirmacaoCliente } from '@/lib/email'

export async function GET() {
  return new Response('OK', { status: 200 })
}

export async function POST(request: NextRequest) {
  try {
    // Return early if database is disabled
    if (!prisma) {
      return NextResponse.json({ received: true });
    }

    const body = await request.json();

    // Processar em background para não dar timeout
    const processWebhook = async () => {
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

      if (orderStatus === "paid") {
        console.log('=== WEBHOOK PAID - INICIANDO ENVIO DE EMAIL ===')
        console.log('Order ID:', orderId)
        const orderItems = await prisma.orderItem.findMany({
          where: { orderId },
          include: {
            product: { select: { nome: true, sku: true } }
          }
        }).catch(() => []);

        const order = await prisma.order.findUnique({
          where: { id: orderId },
          include: {
            user: { select: { name: true, email: true, phone: true, cpf: true } }
          }
        });

        console.log('Order found:', order ? 'yes' : 'no')
        console.log('payerEmail:', order?.payerEmail)
        console.log('user email:', order?.user?.email)

        for (const item of orderItems) {
          try {
            await prisma.productAnalytics.create({
              data: {
                event: "purchase",
                produtoId: item.productId,
                userId: order?.userId,
                metadata: JSON.stringify({
                  orderId,
                  quantity: item.quantity,
                  price: item.price,
                }),
              },
            });
          } catch (analyticsError) {
            console.log('Analytics error (ignorado):', analyticsError)
          }
        }

        if (order) {
          const clienteNome = order.payerName || order.user?.name || 'Cliente'
          const clienteEmail = order.payerEmail || order.user?.email || ''
          const clienteTelefone = order.payerPhone || order.user?.phone || ''
          const clienteCpf = order.payerCpf || order.user?.cpf || ''

          let enderecoFormatado = order.shippingAddress
          try {
            const e = JSON.parse(order.shippingAddress)
            enderecoFormatado = `${e.street}, ${e.number}${e.complement ? `, ${e.complement}` : ''} — ${e.neighborhood}, ${e.city}/${e.state} — CEP ${e.zipCode}` 
          } catch {}

          const produtos = orderItems.map((item: any) => ({
            nome: item.product?.nome || 'Produto',
            sku: item.product?.sku || undefined,
            quantidade: item.quantity,
            tamanho: item.size || undefined,
            cor: item.color || undefined,
            preco: item.price,
          }))

          await enviarEmailNovoPedido({
            pedidoId: orderId,
            clienteNome,
            clienteEmail,
            clienteTelefone,
            clienteCpf,
            produtos,
            endereco: enderecoFormatado,
            total: order.total,
            frete: order.shipping,
            formaPagamento: paymentData.payment_method_id || 'pix',
          })

          if (clienteEmail) {
            await enviarEmailConfirmacaoCliente({
              pedidoId: orderId,
              clienteNome,
              clienteEmail,
              produtos,
              total: order.total,
              frete: order.shipping,
            })
          }

          // Incrementar uso do cupom se aplicado
          if (order.cupomId) {
            await (prisma as any).cupom.update({
              where: { id: order.cupomId },
              data: { totalusado: { increment: 1 } }
            })
          }
        }
      }
    }

    }
    // Responder imediatamente ao MP
    processWebhook().catch(console.error)
    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook error:", error);
    // Always return 200 to MercadoPago to avoid retries
    return NextResponse.json({ received: true });
  }
}
