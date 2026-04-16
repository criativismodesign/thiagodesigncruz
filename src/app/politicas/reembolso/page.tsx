export default function ReembolsoPage() {
  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: '60px 24px' }}>
      <h1 style={{ fontSize: 28, fontWeight: 700, color: '#292929', marginBottom: 8 }}>Política de Reembolso e Devoluções</h1>
      <p style={{ fontSize: 13, color: '#888', marginBottom: 40 }}>Última atualização: Abril de 2026</p>

      <p style={{ fontSize: 15, color: '#444', lineHeight: 1.8, marginBottom: 32 }}>Na <strong>useKIN</strong>, queremos que sua experiência de compra seja segura e transparente. Se você não ficar satisfeito com o produto ou se arrepender da compra, poderá solicitar a devolução de acordo com as condições abaixo.</p>

      {[
        { titulo: '1. Devolução por arrependimento', texto: 'De acordo com o Código de Defesa do Consumidor, você pode solicitar a devolução do pedido por arrependimento em até 7 dias corridos após o recebimento do produto.\n\nPara solicitar a devolução, envie um e-mail para usekin@gmail.com informando: nome completo e número do pedido.\n\nApós o recebimento e análise do produto devolvido, o reembolso será realizado em até 30 dias, utilizando o mesmo método de pagamento escolhido na compra.' },
        { titulo: '2. Produto com defeito de fabricação', texto: 'Se o produto apresentar defeito de fabricação, você poderá solicitar a análise em até 7 dias corridos após o recebimento.\n\nEnvie e-mail para usekin@gmail.com informando: nome completo, número do pedido, descrição do defeito e fotos ou vídeos.\n\nApós análise, a useKIN realizará a tratativa adequada, que poderá incluir reenvio, troca ou reembolso.' },
        { titulo: '3. Envio da devolução', texto: 'Nos casos de arrependimento dentro do prazo legal ou defeito de fabricação, o custo do envio será coberto pela useKIN por meio de logística reversa. Após aprovação, nossa equipe enviará por e-mail as orientações de postagem.' },
        { titulo: '4. Condições para devolução', texto: 'Para que a devolução seja aprovada, o produto deverá ser enviado em condições adequadas para análise, sem sinais de uso indevido e preferencialmente com a embalagem original.' },
        { titulo: '5. Reembolso', texto: 'Quando a devolução for aprovada, o reembolso será feito pelo mesmo método de pagamento utilizado na compra. O prazo para conclusão do estorno pode variar de acordo com a operadora do cartão, banco ou meio de pagamento escolhido.' },
        { titulo: '6. Fale com a useKIN', texto: 'Se tiver dúvidas sobre devoluções ou reembolso, entre em contato: usekin@gmail.com' },
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
