"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import { QrCode, Copy, CheckCircle, Clock } from "lucide-react";
import { toast } from "sonner";

function PagamentoPixContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [copied, setCopied] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<"pending" | "paid" | "expired">("pending");

  const orderId = searchParams.get("order");
  const qrCode = searchParams.get("qr");
  const qrCodeBase64 = searchParams.get("qrBase64");

  useEffect(() => {
    if (!orderId || !qrCode) {
      router.push("/carrinho");
      return;
    }

    // Check payment status periodically
    const checkPaymentStatus = async () => {
      try {
        const res = await fetch(`/api/payments/status?order=${orderId}`);
        const data = await res.json();
        
        if (data.status === "paid") {
          setPaymentStatus("paid");
          setTimeout(() => {
            router.push(`/pedido-confirmado?order=${orderId}`);
          }, 2000);
        } else if (data.status === "expired") {
          setPaymentStatus("expired");
        }
      } catch (error) {
        console.error("Error checking payment status:", error);
      }
    };

    const interval = setInterval(checkPaymentStatus, 5000);
    checkPaymentStatus(); // Check immediately

    return () => clearInterval(interval);
  }, [orderId, qrCode, router]);

  const handleCopyPixCode = async () => {
    if (qrCode) {
      try {
        await navigator.clipboard.writeText(decodeURIComponent(qrCode));
        setCopied(true);
        toast.success("Código Pix copiado!");
        setTimeout(() => setCopied(false), 2000);
      } catch (error) {
        toast.error("Erro ao copiar código");
      }
    }
  };

  if (paymentStatus === "paid") {
    return (
      <div className="min-h-screen bg-[var(--background)] flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-[var(--card)] rounded-2xl border border-[var(--border)] p-8 text-center">
          <CheckCircle className="h-16 w-16 text-[var(--success)] mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-white mb-2">Pagamento Aprovado!</h1>
          <p className="text-[var(--muted-foreground)] mb-4">
            Seu pagamento foi confirmado com sucesso.
          </p>
          <p className="text-sm text-[var(--muted-foreground)]">
            Redirecionando para confirmação do pedido...
          </p>
        </div>
      </div>
    );
  }

  if (paymentStatus === "expired") {
    return (
      <div className="min-h-screen bg-[var(--background)] flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-[var(--card)] rounded-2xl border border-[var(--border)] p-8 text-center">
          <Clock className="h-16 w-16 text-[var(--destructive)] mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-white mb-2">QR Code Expirado</h1>
          <p className="text-[var(--muted-foreground)] mb-6">
            O QR Code expirou. Por favor, gere um novo pagamento.
          </p>
          <button
            onClick={() => router.push("/carrinho")}
            className="w-full bg-[var(--primary)] text-white py-3 rounded-xl font-semibold hover:bg-[var(--primary)]/90 transition-colors"
          >
            Voltar ao Carrinho
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--background)] flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-[var(--card)] rounded-2xl border border-[var(--border)] p-8">
        <div className="text-center mb-6">
          <QrCode className="h-12 w-12 text-[var(--primary)] mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-white mb-2">Pague com Pix</h1>
          <p className="text-[var(--muted-foreground)]">
            Escaneie o QR Code ou copie o código para pagar
          </p>
        </div>

        {/* QR Code Image */}
        {qrCodeBase64 && (
          <div className="bg-white p-4 rounded-xl mb-6">
            <img
              src={`data:image/png;base64,${decodeURIComponent(qrCodeBase64)}`}
              alt="QR Code Pix"
              className="w-full h-auto"
            />
          </div>
        )}

        {/* Pix Code */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-[var(--muted-foreground)] mb-2">
            Código Pix
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={decodeURIComponent(qrCode || "")}
              readOnly
              className="flex-1 bg-[var(--secondary)] border border-[var(--border)] rounded-lg px-3 py-2 text-sm text-white font-mono"
            />
            <button
              onClick={handleCopyPixCode}
              className="bg-[var(--primary)] text-white px-4 py-2 rounded-lg hover:bg-[var(--primary)]/90 transition-colors flex items-center gap-2"
            >
              {copied ? (
                <CheckCircle className="h-4 w-4" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
              {copied ? "Copiado!" : "Copiar"}
            </button>
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-[var(--secondary)] rounded-lg p-4 mb-6">
          <h3 className="font-semibold text-white mb-2">Como pagar:</h3>
          <ol className="text-sm text-[var(--muted-foreground)] space-y-1">
            <li>1. Abra o app do seu banco</li>
            <li>2. Escolha a opção Pix</li>
            <li>3. Escaneie o QR Code ou cole o código</li>
            <li>4. Confirme o pagamento</li>
          </ol>
        </div>

        {/* Order Info */}
        <div className="text-center text-sm text-[var(--muted-foreground)]">
          <p>Pedido: #{orderId}</p>
          <p>Aguardando pagamento...</p>
        </div>

        {/* Cancel Button */}
        <button
          onClick={() => router.push("/carrinho")}
          className="w-full mt-6 bg-[var(--secondary)] text-[var(--muted-foreground)] py-2 rounded-lg hover:bg-[var(--secondary)]/80 transition-colors"
        >
          Cancelar e voltar
        </button>
      </div>
    </div>
  );
}

export default function PagamentoPixPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[var(--background)] flex items-center justify-center">
        <div className="text-white">Carregando...</div>
      </div>
    }>
      <PagamentoPixContent />
    </Suspense>
  );
}
