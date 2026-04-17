import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const codigo = searchParams.get('codigo')

    if (!codigo) {
      return NextResponse.json({ error: 'Código de rastreio obrigatório' }, { status: 400 })
    }

    const token = process.env.MELHOR_ENVIO_TOKEN
    if (!token) {
      return NextResponse.json({ error: 'Token não configurado' }, { status: 500 })
    }

    const response = await fetch(`https://melhorenvio.com.br/api/v2/me/shipment/tracking`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        'User-Agent': 'UseKIN E-commerce (contato@usekin.com.br)',
        'Accept': 'application/json',
      },
      body: JSON.stringify({ orders: [codigo] })
    })

    const data = await response.json()
    
    if (!data || !data[codigo]) {
      return NextResponse.json({ eventos: [] })
    }

    const tracking = data[codigo]
    const eventos = tracking.tracking || []

    return NextResponse.json({
      codigo,
      status: tracking.status || '',
      eventos: eventos.map((e: any) => ({
        data: e.happened_at || e.created_at,
        descricao: e.description || e.message,
        local: e.location || '',
      }))
    })
  } catch (error) {
    console.error('Erro ao rastrear:', error)
    return NextResponse.json({ error: 'Erro ao rastrear envio' }, { status: 500 })
  }
}
