import Link from "next/link";

export default function ObrigadoCadastroPage() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div 
        className="text-center"
        style={{ 
          padding: "100px 120px",
          maxWidth: "100%"
        }}
      >
        {/* Título */}
        <h1 
          className="font-semibold uppercase"
          style={{ 
            fontSize: "48px",
            color: "#292929",
            fontFamily: "Inter, sans-serif",
            fontWeight: 600
          }}
        >
          OBRIGADO PELO CADASTRO!
        </h1>

        {/* Subtítulo */}
        <p 
          className="font-normal uppercase"
          style={{ 
            fontSize: "24px",
            color: "#292929",
            fontFamily: "Inter, sans-serif",
            fontWeight: 400,
            marginTop: "16px"
          }}
        >
          VOCÊ AGORA FAZ PARTE DA LISTA VIP USE KIN.
        </p>

        {/* Texto */}
        <p 
          className="font-normal uppercase"
          style={{ 
            fontSize: "18px",
            color: "#292929",
            fontFamily: "Inter, sans-serif",
            fontWeight: 400,
            marginTop: "16px"
          }}
        >
          EM BREVE VOCÊ RECEBERÁ NOVIDADES EXCLUSIVAS ANTES DE TODO MUNDO.
        </p>

        {/* Linha decorativa */}
        <div 
          className="mx-auto"
          style={{ 
            width: "80px",
            height: "2px",
            backgroundColor: "#DAA520",
            margin: "32px auto"
          }}
        />

        {/* Botão Grupo WhatsApp */}
        <Link
          href="#"
          className="inline-block font-bold text-white rounded-full transition-all hover:brightness-110"
          style={{
            fontSize: "15px",
            fontFamily: "Inter, sans-serif",
            fontWeight: 700,
            backgroundColor: "#46A520",
            padding: "14px 48px",
            borderRadius: "999px",
            marginTop: "32px",
            textDecoration: "none"
          }}
        >
          ENTRAR NO GRUPO VIP
        </Link>

        {/* Botão Voltar */}
        <Link
          href="/"
          className="inline-block ml-4 font-bold text-gray-700 rounded-full transition-all hover:bg-gray-100"
          style={{
            fontSize: "15px",
            fontFamily: "Inter, sans-serif",
            fontWeight: 700,
            padding: "14px 48px",
            borderRadius: "999px",
            marginTop: "32px",
            textDecoration: "none",
            border: "2px solid #292929"
          }}
        >
          VOLTAR PARA HOME
        </Link>
      </div>
    </div>
  );
}
