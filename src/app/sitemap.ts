import { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = "https://www.usekin.com.br";

  const staticPages: MetadataRoute.Sitemap = [
    { url: siteUrl, lastModified: new Date(), changeFrequency: "daily", priority: 1 },
    { url: `${siteUrl}/categorias/todos-produtos`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    { url: `${siteUrl}/categorias/oversizeds`, lastModified: new Date(), changeFrequency: "daily", priority: 0.8 },
    { url: `${siteUrl}/categorias/mousepads`, lastModified: new Date(), changeFrequency: "daily", priority: 0.8 },
    { url: `${siteUrl}/categorias/original-collection`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: `${siteUrl}/categorias/original-collection/immortals`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.7 },
    { url: `${siteUrl}/categorias/original-collection/my-life-my-style`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.7 },
    { url: `${siteUrl}/sobre`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
    { url: `${siteUrl}/contato`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
    { url: `${siteUrl}/politicas/reembolso`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.3 },
    { url: `${siteUrl}/politicas/troca`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.3 },
    { url: `${siteUrl}/politicas/privacidade`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.3 },
    { url: `${siteUrl}/politicas/entrega`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.3 },
  ];

  let productPages: MetadataRoute.Sitemap = [];
  try {
    const produtos = await prisma.produto.findMany({
      where: { status: "ativo" },
      include: { colecao: true },
    });
    productPages = produtos.map((produto: any) => {
      const tipo = produto.tipo === 'camiseta' ? 'camiseta' : 'mousepad'
      const url = produto.categoria === 'colecao' && produto.colecao?.slug
        ? `${siteUrl}/produto/${produto.colecao.slug}/${tipo}/${produto.slug}` 
        : `${siteUrl}/produto/${tipo}/${produto.slug}` 
      return {
        url,
        lastModified: produto.atualizadoEm,
        changeFrequency: "weekly" as const,
        priority: 0.7,
      }
    });
  } catch {
    // Fallback
  }

  return [...staticPages, ...productPages];
}
