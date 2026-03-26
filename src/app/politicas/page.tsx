import Link from "next/link";
import { Shield, FileText, Lock, RefreshCw } from "lucide-react";

export default function PoliciesPage() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-white sm:text-5xl mb-4">
          Políticas da Loja
        </h1>
        <p className="text-lg text-[var(--muted-foreground)]">
          Transparência e segurança para sua experiência de compra.
        </p>
      </div>

      <div className="space-y-12">
        {/* Privacy Policy */}
        <section
          id="privacidade"
          className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 sm:p-8"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="rounded-xl bg-[var(--primary)]/10 p-2.5">
              <Lock className="h-5 w-5 text-[var(--primary)]" />
            </div>
            <h2 className="text-2xl font-bold text-white">
              Política de Privacidade
            </h2>
          </div>
          <div className="space-y-4 text-sm text-[var(--muted-foreground)] leading-relaxed">
            <p>
              A Thiago Design Cruz valoriza a privacidade dos seus clientes.
              Coletamos apenas as informações necessárias para processar pedidos
              e melhorar sua experiência de compra.
            </p>
            <h3 className="text-base font-semibold text-white">
              Dados Coletados
            </h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>
                Informações pessoais (nome, e-mail, telefone) para cadastro e
                comunicação.
              </li>
              <li>
                Endereço de entrega para envio dos produtos.
              </li>
              <li>
                Dados de navegação (cookies) para melhorar a experiência no
                site.
              </li>
            </ul>
            <h3 className="text-base font-semibold text-white">
              Uso dos Dados
            </h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>Processamento e entrega de pedidos.</li>
              <li>
                Comunicação sobre status do pedido e promoções (com seu
                consentimento).
              </li>
              <li>Melhoria dos nossos produtos e serviços.</li>
            </ul>
            <h3 className="text-base font-semibold text-white">
              Segurança
            </h3>
            <p>
              Utilizamos criptografia SSL para proteger seus dados durante a
              transmissão. Seus dados de pagamento são processados diretamente
              pelo Mercado Pago, sem armazenamento em nossos servidores.
            </p>
          </div>
        </section>

        {/* Terms of Service */}
        <section
          id="termos"
          className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 sm:p-8"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="rounded-xl bg-[var(--primary)]/10 p-2.5">
              <FileText className="h-5 w-5 text-[var(--primary)]" />
            </div>
            <h2 className="text-2xl font-bold text-white">
              Termos de Uso
            </h2>
          </div>
          <div className="space-y-4 text-sm text-[var(--muted-foreground)] leading-relaxed">
            <p>
              Ao utilizar o site thiagodesigncruz.com.br, você concorda com os
              seguintes termos e condições:
            </p>
            <h3 className="text-base font-semibold text-white">
              Conta do Usuário
            </h3>
            <p>
              Você é responsável por manter a confidencialidade de sua conta e
              senha. Todas as atividades realizadas com suas credenciais são de
              sua responsabilidade.
            </p>
            <h3 className="text-base font-semibold text-white">
              Propriedade Intelectual
            </h3>
            <p>
              Todos os designs exclusivos da Thiago Design Cruz são protegidos
              por direitos autorais. A reprodução não autorizada é proibida. Ao
              criar designs personalizados, você garante que possui os direitos
              sobre as imagens utilizadas.
            </p>
            <h3 className="text-base font-semibold text-white">
              Preços e Disponibilidade
            </h3>
            <p>
              Os preços podem ser alterados sem aviso prévio. Nos reservamos o
              direito de corrigir erros de preço. A disponibilidade dos produtos
              está sujeita ao estoque.
            </p>
          </div>
        </section>

        {/* Return Policy */}
        <section
          id="trocas"
          className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 sm:p-8"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="rounded-xl bg-[var(--primary)]/10 p-2.5">
              <RefreshCw className="h-5 w-5 text-[var(--primary)]" />
            </div>
            <h2 className="text-2xl font-bold text-white">
              Política de Trocas e Devoluções
            </h2>
          </div>
          <div className="space-y-4 text-sm text-[var(--muted-foreground)] leading-relaxed">
            <h3 className="text-base font-semibold text-white">
              Prazo para Troca/Devolução
            </h3>
            <p>
              Você tem até 7 dias corridos após o recebimento do produto para
              solicitar troca ou devolução, conforme o artigo 49 do Código de
              Defesa do Consumidor.
            </p>
            <h3 className="text-base font-semibold text-white">
              Condições
            </h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>
                O produto deve estar em perfeito estado, sem sinais de uso,
                lavagem ou danos.
              </li>
              <li>Deve conter a etiqueta e embalagem original.</li>
              <li>
                Produtos personalizados só são aceitos para troca em caso de
                defeito de fabricação.
              </li>
            </ul>
            <h3 className="text-base font-semibold text-white">
              Como Solicitar
            </h3>
            <ol className="list-decimal pl-5 space-y-1">
              <li>
                Entre em contato pelo e-mail contato@thiagodesigncruz.com.br ou
                WhatsApp.
              </li>
              <li>
                Informe o número do pedido e o motivo da troca/devolução.
              </li>
              <li>
                Aguarde as instruções para envio do produto (frete por nossa
                conta em caso de defeito).
              </li>
              <li>
                Após recebimento e análise, realizaremos a troca ou reembolso em
                até 10 dias úteis.
              </li>
            </ol>
            <h3 className="text-base font-semibold text-white">
              Reembolso
            </h3>
            <p>
              O reembolso será feito pela mesma forma de pagamento utilizada na
              compra. Para pagamentos via Pix ou boleto, o valor será devolvido
              via transferência bancária.
            </p>
          </div>
        </section>

        {/* Shipping Policy */}
        <section
          id="envio"
          className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 sm:p-8"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="rounded-xl bg-[var(--primary)]/10 p-2.5">
              <Shield className="h-5 w-5 text-[var(--primary)]" />
            </div>
            <h2 className="text-2xl font-bold text-white">
              Política de Envio
            </h2>
          </div>
          <div className="space-y-4 text-sm text-[var(--muted-foreground)] leading-relaxed">
            <h3 className="text-base font-semibold text-white">
              Prazos de Envio
            </h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>
                <strong className="text-white">Produtos em estoque:</strong>{" "}
                envio em até 2 dias úteis após confirmação do pagamento.
              </li>
              <li>
                <strong className="text-white">Produtos personalizados:</strong>{" "}
                envio em até 5 dias úteis após confirmação do pagamento (inclui
                tempo de produção).
              </li>
            </ul>
            <h3 className="text-base font-semibold text-white">
              Frete
            </h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>
                <strong className="text-white">Frete grátis</strong> para
                compras acima de R$ 199,90.
              </li>
              <li>
                Para demais compras, o frete é calculado com base no CEP de
                destino no momento do checkout.
              </li>
            </ul>
            <h3 className="text-base font-semibold text-white">
              Rastreamento
            </h3>
            <p>
              Após o envio, você receberá o código de rastreamento por e-mail.
              É possível acompanhar a entrega pelo site dos Correios ou pelo
              painel da sua conta.
            </p>
          </div>
        </section>
      </div>

      {/* Navigation */}
      <div className="mt-12 flex flex-wrap justify-center gap-3">
        <a
          href="#privacidade"
          className="rounded-lg border border-[var(--border)] px-4 py-2 text-sm text-[var(--muted-foreground)] hover:text-white hover:border-[var(--primary)] transition-colors"
        >
          Privacidade
        </a>
        <a
          href="#termos"
          className="rounded-lg border border-[var(--border)] px-4 py-2 text-sm text-[var(--muted-foreground)] hover:text-white hover:border-[var(--primary)] transition-colors"
        >
          Termos de Uso
        </a>
        <a
          href="#trocas"
          className="rounded-lg border border-[var(--border)] px-4 py-2 text-sm text-[var(--muted-foreground)] hover:text-white hover:border-[var(--primary)] transition-colors"
        >
          Trocas e Devoluções
        </a>
        <a
          href="#envio"
          className="rounded-lg border border-[var(--border)] px-4 py-2 text-sm text-[var(--muted-foreground)] hover:text-white hover:border-[var(--primary)] transition-colors"
        >
          Envio
        </a>
      </div>

      <div className="mt-8 text-center">
        <p className="text-sm text-[var(--muted-foreground)]">
          Última atualização: Março de 2026
        </p>
        <Link
          href="/contato"
          className="mt-2 inline-block text-sm text-[var(--primary)] hover:underline"
        >
          Dúvidas? Entre em contato
        </Link>
      </div>
    </main>
  );
}
