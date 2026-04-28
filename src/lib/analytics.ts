export function trackEvent(eventName: string, params: Record<string, any>) {
  if (typeof window !== 'undefined' && typeof (window as any).gtag === 'function') {
    (window as any).gtag('event', eventName, params)
  }
}

export function trackViewItem(produto: {
  id: string | number
  nome: string
  precoAtual: number
  tipo: string
  colecao?: { nome: string } | null
}) {
  trackEvent('view_item', {
    currency: 'BRL',
    value: produto.precoAtual,
    items: [{
      item_id: String(produto.id),
      item_name: produto.nome,
      item_category: produto.tipo,
      item_brand: 'UseKIN',
      item_variant: produto.colecao?.nome || 'avulso',
      price: produto.precoAtual,
      quantity: 1,
    }]
  })
}

export function trackAddToCart(params: {
  id: string | number
  nome: string
  preco: number
  tipo: string
  quantidade: number
  tamanho?: string
  cor?: string
}) {
  trackEvent('add_to_cart', {
    currency: 'BRL',
    value: params.preco * params.quantidade,
    items: [{
      item_id: String(params.id),
      item_name: params.nome,
      item_category: params.tipo,
      item_brand: 'UseKIN',
      item_variant: params.tamanho || params.cor || 'default',
      price: params.preco,
      quantity: params.quantidade,
    }]
  })
}

export function trackBeginCheckout(items: Array<{
  id: string
  name: string
  price: number
  quantity: number
  type: string
  size?: string
}>, total: number) {
  trackEvent('begin_checkout', {
    currency: 'BRL',
    value: total,
    items: items.map(item => ({
      item_id: item.id,
      item_name: item.name,
      item_category: item.type,
      item_brand: 'UseKIN',
      item_variant: item.size || 'default',
      price: item.price,
      quantity: item.quantity,
    }))
  })
}

export function trackPurchase(params: {
  orderId: string
  total: number
  items: Array<{
    id: string
    name: string
    price: number
    quantity: number
    type: string
    size?: string
  }>
}) {
  trackEvent('purchase', {
    transaction_id: params.orderId,
    currency: 'BRL',
    value: params.total,
    items: params.items.map(item => ({
      item_id: item.id,
      item_name: item.name,
      item_category: item.type,
      item_brand: 'UseKIN',
      item_variant: item.size || 'default',
      price: item.price,
      quantity: item.quantity,
    }))
  })
}
