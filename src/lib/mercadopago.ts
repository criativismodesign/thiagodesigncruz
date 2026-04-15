import { MercadoPagoConfig, Payment } from 'mercadopago'

const client = new MercadoPagoConfig({
  accessToken: process.env.MERCADO_PAGO_ACCESS_TOKEN || '',
})

export const payment = new Payment(client)

export const createPreference = async (items: any[]) => {
  try {
    const response = await fetch('https://api.mercadopago.com/checkout/preferences', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.MERCADO_PAGO_ACCESS_TOKEN}`
      },
      body: JSON.stringify({
        items: items.map(item => ({
          title: item.title,
          unit_price: item.unit_price,
          quantity: item.quantity,
          currency_id: 'BRL'
        })),
        back_urls: {
          success: `${process.env.NEXT_PUBLIC_URL}/pedido-confirmado`,
          failure: `${process.env.NEXT_PUBLIC_URL}/carrinho`,
          pending: `${process.env.NEXT_PUBLIC_URL}/pagamento-pix`
        },
        auto_return: 'approved',
        notification_url: `${process.env.NEXT_PUBLIC_URL}/api/payments/webhook`
      })
    })
    
    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error creating MercadoPago preference:', error)
    throw error
  }
}

export const preference = createPreference
