export function gerarUrlProduto(produto: {
  slug: string
  tipo: string
  categoria: string
  colecao?: { slug: string } | null
}): string {
  const tipo = produto.tipo === 'camiseta' ? 'camiseta' : 'mousepad'
  
  if (produto.categoria === 'colecao' && produto.colecao?.slug) {
    return `/produto/${produto.colecao.slug}/${tipo}/${produto.slug}` 
  }
  
  return `/produto/${tipo}/${produto.slug}` 
}
