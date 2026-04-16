export default function TrocaPage() {
  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: '60px 24px' }}>
      <h1 style={{ fontSize: 28, fontWeight: 700, color: '#292929', marginBottom: 8 }}>Políticas de Troca</h1>
      <p style={{ fontSize: 13, color: '#888', marginBottom: 40 }}>Última atualização: Abril de 2026</p>

      <p style={{ fontSize: 15, color: '#444', lineHeight: 1.8, marginBottom: 32 }}>Na <strong>useKIN</strong>, queremos que sua experiência de compra seja segura e transparente. Caso você precise trocar um produto, confira abaixo as condições e orientações.</p>

      {[
        { titulo: '1. Solicitação de troca', texto: 'Para solicitar uma troca, o produto deverá estar sem sinais de uso, em perfeito estado e com a embalagem original quando possível.\n\nA solicitação deve ser feita pelo e-mail usekin@gmail.com informando: nome completo, número do pedido e motivo da troca.\n\nApós o recebimento da solicitação, nossa equipe enviará as orientações para continuidade do processo.' },
        { titulo: '2. Condições para troca', texto: 'A troca poderá ser aprovada apenas após análise do produto devolvido. Não serão aceitos itens com sinais de uso indevido, danos causados após o recebimento ou ausência de condições adequadas para conferência.' },
        { titulo: '3. Envio do produto para troca', texto: 'Após a aprovação da solicitação, a useKIN informará o procedimento para envio do item.' },
        { titulo: '4. Dúvidas sobre devolução ou reembolso', texto: 'Para casos de devolução por arrependimento, reembolso ou defeito de fabricação, consulte nossa Política de Reembolso e Devoluções.' },
        { titulo: '5. Fale com a useKIN', texto: 'Se tiver dúvidas, entre em contato: usekin@gmail.com' },
      ].map((item, i) => (
        <div key={i} style={{ marginBottom: 32 }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: '#292929', marginBottom: 12 }}>{item.titulo}</h2>
          {item.texto.split('\n\n').map((p, j) => (
            <p key={j} style={{ fontSize: 15, color: '#444', lineHeight: 1.8, marginBottom: 12 }}>{p}</p>
          ))}
        </div>
      ))}
    </div>
  )
}
