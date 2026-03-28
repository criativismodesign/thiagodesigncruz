"use client";

import { Truck, RefreshCw, Shield, Award, Clock, CheckCircle } from "lucide-react";

interface ProductDetailsProps {
  type: "camiseta" | "mousepad";
}

export default function ProductDetails({ type }: ProductDetailsProps) {
  const sizeGuide = {
    camiseta: [
      { size: "P", chest: "96", length: "68", sleeve: "19", width: "", height: "", thickness: "" },
      { size: "M", chest: "104", length: "72", sleeve: "20", width: "", height: "", thickness: "" },
      { size: "G", chest: "112", length: "76", sleeve: "21", width: "", height: "", thickness: "" },
      { size: "GG", chest: "120", length: "80", sleeve: "22", width: "", height: "", thickness: "" },
    ],
    mousepad: [
      { size: "Único", chest: "", length: "", sleeve: "", width: "90", height: "40", thickness: "3" },
    ],
  };

  const careInstructions = {
    camiseta: [
      { icon: "🌡️", text: "Lavar a máquina em água fria (máx 30°C)" },
      { icon: "🔄", text: "Não centrifugar" },
      { icon: "☀️", text: "Secar à sombra" },
      { icon: "🔥", text: "Não passar ferro diretamente na estampa" },
      { icon: "🧴", text: "Não usar alvejantes" },
    ],
    mousepad: [
      { icon: "💧", text: "Limpar com pano úmido" },
      { icon: "🧼", text: "Usar sabão neutro se necessário" },
      { icon: "❌", text: "Não mergulhar na água" },
      { icon: "☀️", text: "Secar ao ar livre" },
    ],
  };

  const composition = {
    camiseta: {
      material: "100% Algodão Penteado",
      weight: "180 g/m²",
      features: ["Tecido premium macio", "Alta durabilidade", "Não encolhe", "Respirável"],
    },
    mousepad: {
      material: "Microfibra + Base Borracha",
      weight: "250 g/m²",
      features: ["Superfície precisa", "Base antiderrapante", "Bordas costuradas", "Resistente ao desgaste"],
    },
  };

  const currentSizeGuide = sizeGuide[type];
  const currentCareInstructions = careInstructions[type];
  const currentComposition = composition[type];

  return (
    <div className="space-y-8">
      {/* Trust Badges */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="flex items-center gap-3 rounded-xl bg-[var(--secondary)] p-4">
          <div className="rounded-full bg-[var(--primary)]/10 p-2">
            <Truck className="h-5 w-5 text-[var(--primary)]" />
          </div>
          <div>
            <p className="font-semibold text-white">Prazo de Entrega</p>
            <p className="text-sm text-[var(--muted-foreground)]">5-10 dias úteis</p>
          </div>
        </div>
        <div className="flex items-center gap-3 rounded-xl bg-[var(--secondary)] p-4">
          <div className="rounded-full bg-[var(--primary)]/10 p-2">
            <RefreshCw className="h-5 w-5 text-[var(--primary)]" />
          </div>
          <div>
            <p className="font-semibold text-white">1ª Troca Grátis</p>
            <p className="text-sm text-[var(--muted-foreground)]">Garantia de qualidade</p>
          </div>
        </div>
        <div className="flex items-center gap-3 rounded-xl bg-[var(--secondary)] p-4">
          <div className="rounded-full bg-[var(--primary)]/10 p-2">
            <Award className="h-5 w-5 text-[var(--primary)]" />
          </div>
          <div>
            <p className="font-semibold text-white">Arte Nacional</p>
            <p className="text-sm text-[var(--muted-foreground)]">Feito por artistas brasileiros</p>
          </div>
        </div>
      </div>

      {/* Size Guide */}
      {type === "camiseta" && (
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6">
          <h3 className="text-lg font-bold text-white mb-4">Tabela de Medidas</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[var(--border)]">
                  <th className="text-left py-3 px-4 text-[var(--muted-foreground)] font-medium">Tamanho</th>
                  <th className="text-left py-3 px-4 text-[var(--muted-foreground)] font-medium">Busto (cm)</th>
                  <th className="text-left py-3 px-4 text-[var(--muted-foreground)] font-medium">Comprimento (cm)</th>
                  <th className="text-left py-3 px-4 text-[var(--muted-foreground)] font-medium">Manga (cm)</th>
                </tr>
              </thead>
              <tbody>
                {currentSizeGuide.map((size, index) => (
                  <tr key={index} className="border-b border-[var(--border)] last:border-0">
                    <td className="py-3 px-4 font-medium text-white">{size.size}</td>
                    <td className="py-3 px-4 text-[var(--muted-foreground)]">{size.chest}</td>
                    <td className="py-3 px-4 text-[var(--muted-foreground)]">{size.length}</td>
                    <td className="py-3 px-4 text-[var(--muted-foreground)]">{size.sleeve}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-4 p-3 bg-[var(--secondary)] rounded-lg">
            <p className="text-xs text-[var(--muted-foreground)]">
              <strong>Como medir:</strong> Use uma fita métrica para medir sua camiseta favorita e compare com a tabela acima.
            </p>
          </div>
        </div>
      )}

      {/* Composition */}
      <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6">
        <h3 className="text-lg font-bold text-white mb-4">Composição do Produto</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between py-2 border-b border-[var(--border)]">
            <span className="text-[var(--muted-foreground)]">Material</span>
            <span className="text-white font-medium">{currentComposition.material}</span>
          </div>
          <div className="flex items-center justify-between py-2 border-b border-[var(--border)]">
            <span className="text-[var(--muted-foreground)]">Gramatura</span>
            <span className="text-white font-medium">{currentComposition.weight}</span>
          </div>
          <div className="pt-2">
            <p className="text-sm font-medium text-white mb-2">Características:</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {currentComposition.features.map((feature, index) => (
                <div key={index} className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-[var(--success)]" />
                  <span className="text-sm text-[var(--muted-foreground)]">{feature}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Care Instructions */}
      <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6">
        <h3 className="text-lg font-bold text-white mb-4">Cuidados com a Peça</h3>
        <div className="space-y-3">
          {currentCareInstructions.map((instruction, index) => (
            <div key={index} className="flex items-start gap-3">
              <span className="text-xl">{instruction.icon}</span>
              <p className="text-sm text-[var(--muted-foreground)]">{instruction.text}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Additional Info */}
      <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6">
        <h3 className="text-lg font-bold text-white mb-4">Informações Adicionais</h3>
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <Clock className="h-5 w-5 text-[var(--accent)] mt-0.5" />
            <div>
              <p className="font-medium text-white">Prazo de Produção</p>
              <p className="text-sm text-[var(--muted-foreground)]">
                {type === "camiseta" 
                  ? "Produzido em até 3 dias úteis após aprovação do pagamento."
                  : "Produzido em até 2 dias úteis após aprovação do pagamento."
                }
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Shield className="h-5 w-5 text-[var(--success)] mt-0.5" />
            <div>
              <p className="font-medium text-white">Garantia e Trocas</p>
              <p className="text-sm text-[var(--muted-foreground)]">
                1ª troca grátis em caso de defeito de fabricação. Garantia de 30 dias contra desbotamento da estampa.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Award className="h-5 w-5 text-[var(--primary)] mt-0.5" />
            <div>
              <p className="font-medium text-white">Qualidade Premium</p>
              <p className="text-sm text-[var(--muted-foreground)]">
                Todos os produtos passam por controle de qualidade rigoroso antes do envio.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
