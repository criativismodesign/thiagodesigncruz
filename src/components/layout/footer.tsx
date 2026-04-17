import Link from "next/link";
import {
  Palette,
  Mail,
  Phone,
  MapPin,
  Instagram,
  Facebook,
  MessageCircle,
} from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-[var(--border)] bg-[var(--card)]">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div>
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-[var(--primary)] to-[var(--accent)]">
                <Palette className="h-6 w-6 text-white" />
              </div>
              <span className="text-lg font-bold gradient-text">
                UseKIN
              </span>
            </Link>
            <p className="text-sm text-[var(--muted-foreground)] leading-relaxed">
              Camisetas e mouse pads com designs exclusivos. Escolha entre nossos designs únicos ou personalize do seu jeito.
            </p>
            <div className="mt-4 flex gap-3">
              <a
                href="#"
                className="rounded-lg p-2 text-[var(--muted-foreground)] hover:text-white hover:bg-[var(--secondary)] transition-colors"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="rounded-lg p-2 text-[var(--muted-foreground)] hover:text-white hover:bg-[var(--secondary)] transition-colors"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="rounded-lg p-2 text-[var(--muted-foreground)] hover:text-white hover:bg-[var(--secondary)] transition-colors"
              >
                <MessageCircle className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Links */}
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white">
              Navegação
            </h3>
            <ul className="space-y-2.5">
              <li>
                <Link
                  href="/produtos"
                  className="text-sm text-[var(--muted-foreground)] hover:text-white transition-colors"
                >
                  Todos os Produtos
                </Link>
              </li>
              <li>
                <Link
                  href="/produtos?categoria=camisetas"
                  className="text-sm text-[var(--muted-foreground)] hover:text-white transition-colors"
                >
                  Camisetas
                </Link>
              </li>
              <li>
                <Link
                  href="/produtos?categoria=mousepads"
                  className="text-sm text-[var(--muted-foreground)] hover:text-white transition-colors"
                >
                  Mouse Pads
                </Link>
              </li>
              <li>
                <Link
                  href="/criar-design"
                  className="text-sm text-[var(--accent)] hover:text-white transition-colors"
                >
                  Crie Sua Arte
                </Link>
              </li>
            </ul>
          </div>

          {/* Info */}
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white">
              Informações
            </h3>
            <ul className="space-y-2.5">
              <li>
                <Link
                  href="/sobre"
                  className="text-sm text-[var(--muted-foreground)] hover:text-white transition-colors"
                >
                  Sobre Nós
                </Link>
              </li>
              <li>
                <Link
                  href="/faq"
                  className="text-sm text-[var(--muted-foreground)] hover:text-white transition-colors"
                >
                  Perguntas Frequentes
                </Link>
              </li>
              <li>
                <Link
                  href="/politicas#envio"
                  className="text-sm text-[var(--muted-foreground)] hover:text-white transition-colors"
                >
                  Política de Envio
                </Link>
              </li>
              <li>
                <Link
                  href="/politicas#privacidade"
                  className="text-sm text-[var(--muted-foreground)] hover:text-white transition-colors"
                >
                  Política de Privacidade
                </Link>
              </li>
              <li>
                <Link
                  href="/politicas#termos"
                  className="text-sm text-[var(--muted-foreground)] hover:text-white transition-colors"
                >
                  Termos de Uso
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white">
              Contato
            </h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-sm text-[var(--muted-foreground)]">
                <Mail className="h-4 w-4 shrink-0" />
                contato@usekin.com.br
              </li>
              <li className="flex items-center gap-2 text-sm text-[var(--muted-foreground)]">
                <Phone className="h-4 w-4 shrink-0" />
                (62) 9 8131-6462
              </li>
              <li className="flex items-start gap-2 text-sm text-[var(--muted-foreground)]">
                <MapPin className="h-4 w-4 shrink-0 mt-0.5" />
                Brasil
              </li>
            </ul>

            {/* Newsletter */}
            <div className="mt-6">
              <h4 className="mb-2 text-sm font-medium text-white">
                Newsletter
              </h4>
              <form className="flex gap-2">
                <input
                  type="email"
                  placeholder="Seu e-mail"
                  className="flex-1 rounded-lg border border-[var(--border)] bg-[var(--secondary)] px-3 py-2 text-sm text-white placeholder:text-[var(--muted-foreground)] focus:border-[var(--primary)] focus:outline-none"
                />
                <button
                  type="submit"
                  className="rounded-lg bg-[var(--primary)] px-4 py-2 text-sm font-medium text-white hover:bg-[var(--primary)]/80 transition-colors"
                >
                  OK
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 border-t border-[var(--border)] pt-8">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <p className="text-xs text-[var(--muted-foreground)]">
              © {new Date().getFullYear()} UseKIN. Todos os direitos reservados.
            </p>
            <div className="flex items-center gap-4 text-xs text-[var(--muted-foreground)]">
              <span>Frete Grátis acima de R$250</span>
              <span>•</span>
              <span>Parcele em até 12x</span>
              <span>•</span>
              <span>Pagamento Seguro</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
