import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const { cepDestino, produtos } = await request.json()

    if (!cepDestino || cepDestino.replace(/\D/g, '').length !== 8) {
      return NextResponse.json({ error: 'CEP inválido' }, { status: 400 })
    }

    const token = process.env.MELHOR_ENVIO_TOKEN
    if (!token) {
      return NextResponse.json({ error: 'Token não configurado' }, { status: 500 })
    }

    // Montar pacotes baseado nos produtos
    const pacotes = produtos.map((p: any) => {
      if (p.tipo === 'mousepad') {
        return {
          weight: 0.710,
          width: 7,
          height: 7.5,
          length: 37.5,
        }
      }
      // Camiseta - peso varia por tamanho
      const pesosCamiseta: Record<string, number> = { P: 0.4, M: 0.4, G: 0.42, GG: 0.43 }
      return {
        weight: pesosCamiseta[p.tamanho] || 0.4,
        width: 18,
        height: 9.5,
        length: 27.5,
      }
    })

    // Calcular peso total e dimensões máximas
    const pesoTotal = pacotes.reduce((acc: number, p: any) => acc + p.weight, 0)
    const larguraMax = Math.max(...pacotes.map((p: any) => p.width))
    const alturaTotal = pacotes.reduce((acc: number, p: any) => acc + p.height, 0)
    const comprimentoMax = Math.max(...pacotes.map((p: any) => p.length))

    const body = {
      from: { postal_code: '74650030' },
      to: { postal_code: cepDestino.replace(/\D/g, '') },
      package: {
        weight: pesoTotal,
        width: larguraMax,
        height: alturaTotal,
        length: comprimentoMax,
      },
      options: {
        receipt: false,
        own_hand: false,
      },
      services: '1,2,3,4,17,18', // Correios PAC, SEDEX e outros
    }

    const response = await fetch('https://sandbox.melhorenvio.com.br/api/v2/me/shipment/calculate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        'User-Agent': 'UseKIN E-commerce (contato@usekin.com.br)',
        'Accept': 'application/json',
      },
      body: JSON.stringify(body),
    })

    const data = await response.json()

    // Filtrar apenas resultados válidos com preço
    const fretes = Array.isArray(data) ? data
      .filter((f: any) => f.price && !f.error)
      .map((f: any) => ({
        id: f.id,
        nome: f.name,
        empresa: f.company?.name || '',
        preco: parseFloat(f.price),
        prazo: f.delivery_time,
        logo: f.company?.picture || '',
      }))
      .sort((a: any, b: any) => a.preco - b.preco)
      : []

    return NextResponse.json({ fretes })
  } catch (error) {
    console.error('Erro ao calcular frete:', error)
    return NextResponse.json({ error: 'Erro ao calcular frete' }, { status: 500 })
  }
}
