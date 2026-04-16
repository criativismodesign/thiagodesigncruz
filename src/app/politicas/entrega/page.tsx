export default function EntregaPage() {
  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: '60px 24px' }}>
      <h1 style={{ fontSize: 28, fontWeight: 700, color: '#292929', marginBottom: 8 }}>Entrega e Prazo</h1>
      <p style={{ fontSize: 13, color: '#888', marginBottom: 40 }}>Última atualização: Abril de 2026</p>

      {[
        { titulo: 'Quando posso esperar meu pedido?', texto: 'Após a confirmação do pagamento, o prazo estimado para entrega é de 5 a 15 dias úteis após a postagem, dependendo da sua região e da modalidade de envio escolhida.\n\nEm muitos casos, os pedidos chegam antes do prazo final informado. Lembre-se de que o prazo é contado em dias úteis, ou seja, não inclui sábados, domingos e feriados.' },
        { titulo: 'Processamento do pedido', texto: 'Depois que o pagamento é confirmado, o pedido passa pela etapa de separação, conferência, produção e embalagem.\n\nO prazo de processamento é de 1 a 4 dias úteis, podendo variar de acordo com o volume de pedidos e com o tipo de produto comprado.\n\nNa useKIN, buscamos preparar cada pedido com o máximo de cuidado para garantir qualidade, segurança e uma boa experiência de compra.' },
        { titulo: 'O produto será entregue no meu endereço?', texto: 'Sim. A maioria dos pedidos é entregue diretamente no endereço informado no momento da compra.\n\nEm alguns casos, o pedido pode ficar disponível para retirada na unidade local dos Correios ou da transportadora por motivos como endereço incompleto, dificuldade para localizar ou tentativas sem sucesso.\n\nRecomendamos acompanhar o pedido pelo código de rastreamento enviado por e-mail.' },
        { titulo: 'Cometi um erro no endereço. O que fazer?', texto: 'Se você perceber algum erro no endereço após finalizar a compra, entre em contato com a useKIN o quanto antes, preferencialmente no mesmo dia do pedido.\n\nApós a postagem, não é possível alterar o endereço de entrega.\n\nE-mail para contato: usekin@gmail.com' },
        { titulo: 'O rastreamento mostra "entregue", mas eu não recebi. O que fazer?', texto: 'Verifique com outras pessoas da casa ou portaria, confira se houve tentativa de entrega registrada, consulte a unidade local dos Correios e veja se existe alguma notificação deixada no local.\n\nEm alguns casos, o sistema pode registrar a entrega antes da finalização total da rota.' },
        { titulo: 'E se o pedido for extraviado?', texto: 'Caso o pedido seja perdido durante o transporte, a useKIN fará a análise com base no rastreamento. Se confirmado como extraviado, nossa equipe dará o suporte necessário, incluindo reenvio ou reembolso conforme o caso.' },
        { titulo: 'Ainda com dúvidas?', texto: 'Se precisar de ajuda, fale com a gente: usekin@gmail.com' },
      ].map((item, i) => (
        <div key={i} style={{ marginBottom: 32, paddingBottom: 32, borderBottom: i < 6 ? '1px solid #F0F0F0' : 'none' }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: '#292929', marginBottom: 12 }}>{item.titulo}</h2>
          {item.texto.split('\n\n').map((p, j) => (
            <p key={j} style={{ fontSize: 15, color: '#444', lineHeight: 1.8, marginBottom: 12 }}>{p}</p>
          ))}
        </div>
      ))}
    </div>
  )
}
