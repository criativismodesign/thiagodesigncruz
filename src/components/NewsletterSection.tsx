"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface NewsletterSectionProps {
  source?: string;
}

export default function NewsletterSection({ source = "home" }: NewsletterSectionProps) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    nome: "",
    whatsapp: "",
    email: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError(""); // Limpa erro ao digitar
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/api/newsletter", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          source,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Sucesso - redirecionar para página de agradecimento
        router.push("/obrigado-cadastro");
      } else {
        // Erro
        setError(data.error || "Erro ao cadastrar. Tente novamente.");
      }
    } catch (err) {
      setError("Erro de conexão. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="relative w-full">
      {/* Imagem de fundo */}
      <div style={{
        position: 'relative',
        width: '100%',
        aspectRatio: '1920/721',
        overflow: 'hidden',
      }}>
        <Image
          src="/imagens/hero/LIGHT-BANNER-SITE-USE-KIN-LISTA-VIP-1920x721px.jpg"
          alt="Newsletter"
          fill
          style={{ objectFit: 'contain', objectPosition: 'center' }}
          priority
        />
      </div>

      {/* Conteúdo */}
      <div 
        className="relative z-10 flex items-center"
        style={{ 
          height: "100%",
          paddingTop: "79.5px",
          paddingBottom: "79.5px",
          paddingLeft: "120px",
          paddingRight: "120px"
        }}
      >
        <div className="max-w-[40%]">
          {/* Tag LISTA VIP */}
          <div 
            className="font-light uppercase"
            style={{ 
              fontSize: "26px",
              color: "#F0484A",
              fontFamily: "Inter, sans-serif",
              fontWeight: 300,
              marginBottom: "16px"
            }}
          >
            LISTA VIP
          </div>

          {/* Título */}
          <h2 
            className="font-semibold uppercase"
            style={{ 
              fontSize: "40px",
              color: "#292929",
              fontFamily: "Inter, sans-serif",
              fontWeight: 600,
              lineHeight: "1.1",
              marginBottom: "20px"
            }}
          >
            SEJA O PRIMEIRO A SABER DOS NOVOS LANÇAMENTOS
          </h2>

          {/* Texto descritivo */}
          <p 
            className="font-normal uppercase"
            style={{ 
              fontSize: "18px",
              color: "#292929",
              fontFamily: "Inter, sans-serif",
              fontWeight: 400,
              marginBottom: "36px"
            }}
          >
            DESIGNS LIMITADOS CHEGAM SEM AVISO. ENTRE NA{" "}
            <span style={{ fontWeight: 700 }}>LISTA VIP</span>{" "}
            E GARANTA O SEU ANTES DE TODO MUNDO.
          </p>

          {/* Formulário */}
          <form onSubmit={handleSubmit} className="w-full">
            {/* Campo Nome */}
            <div style={{ marginBottom: "16px" }}>
              <input
                type="text"
                name="nome"
                value={formData.nome}
                onChange={handleChange}
                placeholder="* NOME..."
                required
                disabled={isLoading}
                className="w-full"
                style={{
                  fontSize: "18px",
                  color: "#AAAAAA",
                  fontFamily: "Inter, sans-serif",
                  fontWeight: 300,
                  backgroundColor: "rgba(255, 255, 255, 0.9)",
                  border: "1px solid #AAAAAA",
                  borderRadius: "8px",
                  padding: "14px 20px",
                  textTransform: "uppercase"
                }}
              />
            </div>

            {/* Campo WhatsApp */}
            <div style={{ marginBottom: "16px" }}>
              <input
                type="tel"
                name="whatsapp"
                value={formData.whatsapp}
                onChange={handleChange}
                placeholder="* WHATSAPP (COM DDD)..."
                required
                disabled={isLoading}
                className="w-full"
                style={{
                  fontSize: "18px",
                  color: "#AAAAAA",
                  fontFamily: "Inter, sans-serif",
                  fontWeight: 300,
                  backgroundColor: "rgba(255, 255, 255, 0.9)",
                  border: "1px solid #AAAAAA",
                  borderRadius: "8px",
                  padding: "14px 20px",
                  textTransform: "uppercase"
                }}
              />
            </div>

            {/* Campo Email */}
            <div style={{ marginBottom: "16px" }}>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="* SEU MELHOR E-MAIL..."
                required
                disabled={isLoading}
                className="w-full"
                style={{
                  fontSize: "18px",
                  color: "#AAAAAA",
                  fontFamily: "Inter, sans-serif",
                  fontWeight: 300,
                  backgroundColor: "rgba(255, 255, 255, 0.9)",
                  border: "1px solid #AAAAAA",
                  borderRadius: "8px",
                  padding: "14px 20px",
                  textTransform: "uppercase"
                }}
              />
            </div>

            {/* Mensagem de erro */}
            {error && (
              <div 
                className="w-full text-center"
                style={{ 
                  color: "#F0484A",
                  fontSize: "14px",
                  fontFamily: "Inter, sans-serif",
                  fontWeight: 400,
                  marginBottom: "8px"
                }}
              >
                {error}
              </div>
            )}

            {/* Botão */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full font-bold uppercase rounded-full transition-all"
              style={{
                fontSize: "15px",
                color: "#FFFFFF",
                fontFamily: "Inter, sans-serif",
                fontWeight: 700,
                backgroundColor: isLoading ? "#999999" : "#DAA520",
                padding: "14px",
                borderRadius: "999px",
                marginTop: "8px",
                cursor: isLoading ? "not-allowed" : "pointer",
                transition: "background-color 0.3s ease"
              }}
              onMouseEnter={(e) => {
                if (!isLoading) {
                  e.currentTarget.style.backgroundColor = "#46A520";
                }
              }}
              onMouseLeave={(e) => {
                if (!isLoading) {
                  e.currentTarget.style.backgroundColor = "#DAA520";
                }
              }}
            >
              {isLoading ? "CADASTRANDO..." : "ENTRAR NA LISTA VIP"}
            </button>
          </form>
        </div>
      </div>

      {/* Responsividade */}
      <style jsx>{`
        @media (max-width: 768px) {
          .content-container {
            max-width: 100% !important;
            padding-left: 24px !important;
            padding-right: 24px !important;
          }
          .title {
            font-size: 36px !important;
          }
          .tag {
            font-size: 24px !important;
          }
        }
      `}</style>

      <style jsx global>{`
        .content-container {
          max-width: 50%;
        }
        .title {
          font-size: 60px;
        }
        .tag {
          font-size: 36px;
        }
      `}</style>
    </section>
  );
}
