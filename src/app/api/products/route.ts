import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    // Return early if database is disabled
    if (!prisma) {
      return NextResponse.json({ 
        message: "Produtos temporariamente desabilitados. Usando dados estáticos." 
      }, { status: 503 });
    }

    const { searchParams } = new URL(request.url);
    const categoria = searchParams.get("categoria");
    const featured = searchParams.get("featured");
    const search = searchParams.get("search");

    const where: Record<string, unknown> = { status: "ativo" };

    if (categoria) {
      where.categoria = categoria;
    }

    if (featured === "true") {
      // Produto não tem campo featured, pode adicionar se necessário
    }

    if (search) {
      where.OR = [
        { nome: { contains: search } },
        { descricaoCurta: { contains: search } },
      ];
    }

    const produtos = await prisma.produto.findMany({
      where,
      orderBy: { criadoEm: "desc" },
    });

    return NextResponse.json(produtos);
  } catch {
    return NextResponse.json(
      { error: "Erro ao buscar produtos" },
      { status: 500 }
    );
  }
}
