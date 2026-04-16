export default function PrivacidadePage() {
  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: '60px 24px' }}>
      <h1 style={{ fontSize: 28, fontWeight: 700, color: '#292929', marginBottom: 8 }}>Políticas de Privacidade</h1>
      <p style={{ fontSize: 13, color: '#888', marginBottom: 40 }}>Última atualização: Abril de 2026</p>

      <p style={{ fontSize: 15, color: '#444', lineHeight: 1.8, marginBottom: 32 }}>A <strong>useKIN</strong> valoriza a sua privacidade e está comprometida com a proteção dos dados pessoais de clientes, parceiros, fornecedores e usuários do site.</p>

      {[
        { titulo: '1. Aceitação desta Política', texto: 'Ao acessar o site da useKIN, enviar informações ou realizar uma compra, você declara estar ciente e de acordo com esta Política de Privacidade.' },
        { titulo: '2. Quais dados podemos coletar', texto: 'A useKIN pode coletar dados pessoais fornecidos por você, como: nome e sobrenome, e-mail, telefone, CPF quando necessário, endereço de entrega e cobrança, cidade, estado e CEP.\n\nTambém podemos coletar informações de navegação como endereço IP, dispositivo utilizado, páginas acessadas, produtos visualizados e preferências de navegação.' },
        { titulo: '3. Como usamos seus dados', texto: 'Os dados pessoais coletados podem ser utilizados para: processar e entregar pedidos, confirmar pagamentos, enviar atualizações sobre compras e entregas, prestar atendimento ao cliente, melhorar sua experiência no site, personalizar ofertas e cumprir obrigações legais.' },
        { titulo: '4. Compartilhamento de dados', texto: 'A useKIN poderá compartilhar dados pessoais apenas quando necessário para a operação da loja, como com plataformas de pagamento, transportadoras, parceiros de tecnologia e autoridades competentes quando exigido por lei.\n\nA useKIN não vende dados pessoais a terceiros.' },
        { titulo: '5. Cookies e tecnologias de navegação', texto: 'Nosso site pode utilizar cookies para melhorar a navegação, lembrar preferências e entender o comportamento de uso. Você pode alterar as configurações de cookies no seu navegador a qualquer momento.' },
        { titulo: '6. Seus direitos', texto: 'Nos termos da LGPD, você pode solicitar: confirmação do tratamento dos seus dados, acesso, correção, exclusão, portabilidade e revogação do consentimento.' },
        { titulo: '7. Proteção e armazenamento dos dados', texto: 'A useKIN adota medidas técnicas e organizacionais para proteger os dados pessoais contra acessos não autorizados, uso indevido, alteração ou destruição.' },
        { titulo: '8. Links para sites de terceiros', texto: 'O site da useKIN pode conter links para páginas externas. Não nos responsabilizamos pelas práticas de privacidade ou segurança desses outros sites.' },
        { titulo: '9. Atualizações desta Política', texto: 'Esta Política de Privacidade pode ser atualizada a qualquer momento. A versão mais recente estará sempre disponível nesta página.' },
        { titulo: '10. Fale com a useKIN', texto: 'Se você tiver dúvidas sobre esta Política de Privacidade, entre em contato: usekin@gmail.com' },
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
