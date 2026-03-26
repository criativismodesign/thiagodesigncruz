"use client";

import { useState } from "react";
import { Mail, Phone, MapPin, Send, MessageCircle } from "lucide-react";
import { toast } from "sonner";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      toast.error("Preencha todos os campos obrigatórios.");
      return;
    }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1500));
    toast.success("Mensagem enviada com sucesso! Responderemos em breve.");
    setFormData({ name: "", email: "", subject: "", message: "" });
    setLoading(false);
  };

  return (
    <main className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-white sm:text-5xl mb-4">
          Fale Conosco
        </h1>
        <p className="text-lg text-[var(--muted-foreground)] max-w-xl mx-auto">
          Tem alguma dúvida, sugestão ou precisa de ajuda? Estamos aqui para
          você!
        </p>
      </div>

      <div className="grid grid-cols-1 gap-12 lg:grid-cols-5">
        {/* Contact Info */}
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6">
            <h2 className="text-lg font-semibold text-white mb-6">
              Informações de Contato
            </h2>
            <div className="space-y-5">
              <div className="flex items-start gap-4">
                <div className="rounded-lg bg-[var(--primary)]/10 p-2.5">
                  <Mail className="h-5 w-5 text-[var(--primary)]" />
                </div>
                <div>
                  <p className="text-sm font-medium text-white">E-mail</p>
                  <p className="text-sm text-[var(--muted-foreground)]">
                    contato@thiagodesigncruz.com.br
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="rounded-lg bg-[var(--primary)]/10 p-2.5">
                  <Phone className="h-5 w-5 text-[var(--primary)]" />
                </div>
                <div>
                  <p className="text-sm font-medium text-white">Telefone</p>
                  <p className="text-sm text-[var(--muted-foreground)]">
                    (11) 99999-9999
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="rounded-lg bg-[var(--primary)]/10 p-2.5">
                  <MessageCircle className="h-5 w-5 text-[var(--primary)]" />
                </div>
                <div>
                  <p className="text-sm font-medium text-white">WhatsApp</p>
                  <p className="text-sm text-[var(--muted-foreground)]">
                    (11) 99999-9999
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="rounded-lg bg-[var(--primary)]/10 p-2.5">
                  <MapPin className="h-5 w-5 text-[var(--primary)]" />
                </div>
                <div>
                  <p className="text-sm font-medium text-white">Localização</p>
                  <p className="text-sm text-[var(--muted-foreground)]">
                    São Paulo, SP — Brasil
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6">
            <h3 className="text-sm font-semibold text-white mb-3">
              Horário de Atendimento
            </h3>
            <div className="space-y-2 text-sm text-[var(--muted-foreground)]">
              <div className="flex justify-between">
                <span>Seg — Sex</span>
                <span className="text-white">09:00 — 18:00</span>
              </div>
              <div className="flex justify-between">
                <span>Sábado</span>
                <span className="text-white">09:00 — 13:00</span>
              </div>
              <div className="flex justify-between">
                <span>Domingo</span>
                <span className="text-[var(--muted-foreground)]">Fechado</span>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="lg:col-span-3">
          <form
            onSubmit={handleSubmit}
            className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 sm:p-8 space-y-5"
          >
            <h2 className="text-lg font-semibold text-white">
              Envie uma Mensagem
            </h2>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-white mb-1.5">
                  Nome *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full rounded-lg border border-[var(--border)] bg-[var(--secondary)] px-4 py-2.5 text-sm text-white placeholder:text-[var(--muted-foreground)] focus:border-[var(--primary)] focus:outline-none"
                  placeholder="Seu nome"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-white mb-1.5">
                  E-mail *
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="w-full rounded-lg border border-[var(--border)] bg-[var(--secondary)] px-4 py-2.5 text-sm text-white placeholder:text-[var(--muted-foreground)] focus:border-[var(--primary)] focus:outline-none"
                  placeholder="seu@email.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-1.5">
                Assunto
              </label>
              <input
                type="text"
                value={formData.subject}
                onChange={(e) =>
                  setFormData({ ...formData, subject: e.target.value })
                }
                className="w-full rounded-lg border border-[var(--border)] bg-[var(--secondary)] px-4 py-2.5 text-sm text-white placeholder:text-[var(--muted-foreground)] focus:border-[var(--primary)] focus:outline-none"
                placeholder="Sobre o que deseja falar?"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-1.5">
                Mensagem *
              </label>
              <textarea
                rows={5}
                value={formData.message}
                onChange={(e) =>
                  setFormData({ ...formData, message: e.target.value })
                }
                className="w-full rounded-lg border border-[var(--border)] bg-[var(--secondary)] px-4 py-2.5 text-sm text-white placeholder:text-[var(--muted-foreground)] focus:border-[var(--primary)] focus:outline-none resize-none"
                placeholder="Escreva sua mensagem aqui..."
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-[var(--primary)] px-6 py-3 font-semibold text-white hover:bg-[var(--primary)]/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                "Enviando..."
              ) : (
                <>
                  <Send className="h-4 w-4" /> Enviar Mensagem
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
