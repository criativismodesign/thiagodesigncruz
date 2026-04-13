import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET() {
  try {
    console.log("=== DEBUG PRODUCTS ===")
    
    if (!prisma) {
      return NextResponse.json({ error: "Prisma not available" }, { status: 500 })
    }

    // Buscar todos os produtos
    const products = await (prisma as any).product.findMany({
      select: {
        id: true,
        slug: true,
        name: true,
        status: true
      },
      take: 50 // Limitar para não sobrecarregar
    })

    console.log(`Found ${products.length} products`)
    
    // Verificar se o produto específico existe
    const targetId = "cmnwbsncl0001lf04tryuhn3l"
    const targetProduct = products.find(p => p.id === targetId || p.slug === targetId)
    
    return NextResponse.json({
      totalProducts: products.length,
      targetProduct: targetProduct || "NOT FOUND",
      products: products.map(p => ({
        id: p.id,
        slug: p.slug,
        name: p.name,
        status: p.status
      }))
    })
  } catch (error) {
    console.error("Debug products error:", error)
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : "Unknown error" 
    }, { status: 500 })
  }
}
