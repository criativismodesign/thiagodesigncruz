"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

// Dados dos benefícios
const benefits = [
  {
    icon: '/icons/Icones-Site-Use-KIN-reenbolso.svg',
    title: 'REEMBOLSO E DEVOLUÇÃO',
    text: 'Receba antes os lançamentos e compre com ofertas especiais',
  },
  {
    icon: '/icons/Icones-Site-Use-KIN-entrega-nacional.svg',
    title: 'ENTREGA NACIONAL',
    text: 'Receba antes os lançamentos e compre com ofertas especiais',
  },
  {
    icon: '/icons/Icones-Site-Use-KIN-pagamento-seguro.svg',
    title: 'PAGAMENTO SEGURO',
    text: 'Receba antes os lançamentos e compre com ofertas especiais',
  },
  {
    icon: '/icons/Icones-Site-Use-KIN-lista-vip.svg',
    title: 'LISTA VIP',
    text: 'Receba antes os lançamentos e compre com ofertas especiais',
  },
];

export default function Footer() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      setError('Digite seu e-mail');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('E-mail inválido');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email.toLowerCase().trim(),
          source: 'footer',
        }),
      });

      const data = await response.json();

      if (response.ok) {
        window.location.href = '/obrigado-cadastro';
      } else {
        setError(data.error || 'Erro ao cadastrar');
      }
    } catch (error) {
      setError('Erro ao cadastrar. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <footer style={{ width: '100%', backgroundColor: '#292929', fontFamily: 'Inter, sans-serif' }}>
      
      {/* PARTE 1 - BOX DE BENEFÍCIOS */}
      <div style={{ marginTop: '100px' }}>
        <div 
          style={{ 
            width: '1843px', 
            height: '238px', 
            backgroundColor: '#EFEFEF', 
            margin: '0 auto',
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-around',
            alignItems: 'center',
            padding: '0 40px'
          }}
          className="md:w-full md:flex-col md:h-auto md:px-8 md:py-8"
        >
          {benefits.map((benefit, index) => (
            <div key={index} style={{ textAlign: 'center' }} className="md:mb-6">
              <Image
                src={benefit.icon}
                alt={benefit.title}
                width={48}
                height={48}
                style={{ marginBottom: '12px' }}
              />
              <h3 
                style={{ 
                  fontSize: '21px', 
                  fontWeight: 700, 
                  color: '#292929', 
                  textTransform: 'uppercase',
                  marginBottom: '8px'
                }}
              >
                {benefit.title}
              </h3>
              <p 
                style={{ 
                  fontSize: '18px', 
                  fontWeight: 400, 
                  color: '#AAAAAA',
                  maxWidth: '200px'
                }}
              >
                {benefit.text}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* PARTE 2 - ÁREA PRINCIPAL DO FOOTER */}
      <div style={{ height: '815px', paddingTop: '210px', padding: '210px 40px 0 40px' }} className="md:pt-16 md:px-6">
        <div 
          style={{ 
            display: 'flex', 
            flexDirection: 'row', 
            justifyContent: 'space-between',
            maxWidth: '1843px',
            margin: '0 auto'
          }}
          className="md:flex-col md:gap-12"
        >
          
          {/* COLUNA 1 - LOGO + DESCRIÇÃO + REDES SOCIAIS */}
          <div>
            <Image
              src="/icons/Icones-Site-Use-KIN-logo-branca.svg"
              alt="Use KIN"
              width={200}
              height={48}
              style={{ height: '48px', width: 'auto' }}
            />
            <p 
              style={{ 
                fontSize: '18px', 
                fontWeight: 400, 
                color: '#AAAAAA',
                marginTop: '24px',
                maxWidth: '280px'
              }}
            >
              Camisetas e mouse pads com designs exclusivos.
              Crie sua própria arte ou escolha entre nossos designs únicos
            </p>
            <div style={{ display: 'flex', gap: '16px', marginTop: '24px' }}>
              <Link href="#" className="hover:opacity-80 transition-opacity">
                <Image
                  src="/icons/Icones-Site-Use-KIN-instagram.svg"
                  alt="Instagram"
                  width={32}
                  height={32}
                />
              </Link>
              <Link href="#" className="hover:opacity-80 transition-opacity">
                <Image
                  src="/icons/Icones-Site-Use-KIN-tiktok.svg"
                  alt="TikTok"
                  width={32}
                  height={32}
                />
              </Link>
              <Link href="#" className="hover:opacity-80 transition-opacity">
                <Image
                  src="/icons/Icones-Site-Use-KIN-whatsapp-rodapé-dourado.svg"
                  alt="WhatsApp"
                  width={32}
                  height={32}
                />
              </Link>
            </div>
          </div>

          {/* COLUNA 2 - NAVEGAÇÃO */}
          <div>
            <h3 
              style={{ 
                fontSize: '18px', 
                fontWeight: 700, 
                color: '#FFFFFF', 
                textTransform: 'uppercase',
                marginBottom: '16px'
              }}
            >
              NAVEGAÇÃO
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <Link href="/produtos" style={{ color: '#AAAAAA', textDecoration: 'none' }} className="hover:text-[#DAA520] transition-colors">
                Todos os Produtos
              </Link>
              <Link href="/produtos?categoria=camisetas" style={{ color: '#AAAAAA', textDecoration: 'none' }} className="hover:text-[#DAA520] transition-colors">
                Camisetas
              </Link>
              <Link href="/produtos?categoria=mousepads" style={{ color: '#AAAAAA', textDecoration: 'none' }} className="hover:text-[#DAA520] transition-colors">
                Mouse Pads
              </Link>
              <Link href="/criar-design" style={{ color: '#AAAAAA', textDecoration: 'none' }} className="hover:text-[#DAA520] transition-colors">
                Crie Sua Arte
              </Link>
            </div>
          </div>

          {/* COLUNA 3 - INFORMAÇÕES */}
          <div>
            <h3 
              style={{ 
                fontSize: '18px', 
                fontWeight: 700, 
                color: '#FFFFFF', 
                textTransform: 'uppercase',
                marginBottom: '16px'
              }}
            >
              INFORMAÇÕES
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <Link href="/sobre" style={{ color: '#AAAAAA', textDecoration: 'none' }} className="hover:text-[#DAA520] transition-colors">
                Sobre Nós
              </Link>
              <Link href="/faq" style={{ color: '#AAAAAA', textDecoration: 'none' }} className="hover:text-[#DAA520] transition-colors">
                Perguntas Frequentes
              </Link>
              <Link href="/politicas/envio" style={{ color: '#AAAAAA', textDecoration: 'none' }} className="hover:text-[#DAA520] transition-colors">
                Política de Envio
              </Link>
              <Link href="/politicas/privacidade" style={{ color: '#AAAAAA', textDecoration: 'none' }} className="hover:text-[#DAA520] transition-colors">
                Política de Privacidade
              </Link>
              <Link href="/politicas/termos" style={{ color: '#AAAAAA', textDecoration: 'none' }} className="hover:text-[#DAA520] transition-colors">
                Termos de Uso
              </Link>
            </div>
          </div>

          {/* COLUNA 4 - CONTATO + NEWSLETTER */}
          <div>
            {/* CONTATO */}
            <h3 
              style={{ 
                fontSize: '18px', 
                fontWeight: 700, 
                color: '#FFFFFF', 
                textTransform: 'uppercase',
                marginBottom: '16px'
              }}
            >
              CONTATO
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Image
                  src="/icons/Icones-Site-Use-KIN-e-mail-rodape.svg"
                  alt="Email"
                  width={20}
                  height={20}
                  style={{ color: '#AAAAAA' }}
                />
                <span style={{ fontSize: '18px', fontWeight: 400, color: '#AAAAAA' }}>
                  contato@usekin.com.br
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Image
                  src="/icons/Icones-Site-Use-KIN-phone-rodape.svg"
                  alt="Phone"
                  width={20}
                  height={20}
                  style={{ color: '#AAAAAA' }}
                />
                <span style={{ fontSize: '18px', fontWeight: 400, color: '#AAAAAA' }}>
                  (XX) XXXXX-XXXX
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Image
                  src="/icons/Icones-Site-Use-KIN-map-rodape.svg"
                  alt="Map"
                  width={20}
                  height={20}
                  style={{ color: '#AAAAAA' }}
                />
                <span style={{ fontSize: '18px', fontWeight: 400, color: '#AAAAAA' }}>
                  Brasil
                </span>
              </div>
            </div>

            {/* NEWSLETTER */}
            <div style={{ marginTop: '32px' }}>
              <h3 
                style={{ 
                  fontSize: '18px', 
                  fontWeight: 700, 
                  color: '#FFFFFF', 
                  textTransform: 'uppercase',
                  marginBottom: '16px'
                }}
              >
                NEWSLETTER
              </h3>
              <p style={{ fontSize: '18px', fontWeight: 400, color: '#AAAAAA', marginBottom: '16px' }}>
                Receba antes os lançamentos...
              </p>
              <form onSubmit={handleNewsletterSubmit} style={{ display: 'flex', gap: '8px' }}>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="SEU E-MAIL"
                  style={{
                    fontSize: '18px',
                    fontWeight: 300,
                    color: '#FFFFFF',
                    backgroundColor: 'transparent',
                    border: 'none',
                    borderBottom: '1px solid #AAAAAA',
                    padding: '8px 0',
                    outline: 'none',
                    flex: 1,
                                      }}
                />
                <button
                  type="submit"
                  disabled={isLoading}
                  style={{
                    fontSize: '15px',
                    fontWeight: 700,
                    color: '#FFFFFF',
                    backgroundColor: '#DAA520',
                    border: 'none',
                    borderRadius: '999px',
                    padding: '8px 20px',
                    cursor: isLoading ? 'not-allowed' : 'pointer',
                    opacity: isLoading ? 0.7 : 1
                  }}
                >
                  {isLoading ? '...' : 'OK'}
                </button>
              </form>
              {error && (
                <p style={{ color: '#F0484A', fontSize: '14px', marginTop: '8px' }}>
                  {error}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* PARTE 3 - FAIXA DE PAGAMENTOS */}
      <div style={{ width: '100%', height: '105px', backgroundColor: '#EFEFEF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Image
          src="/icons/Icones-Site-Use-KIN-logos-meios-pagamento-rodape.svg"
          alt="Meios de pagamento"
          width={800}
          height={60}
          className="md:w-full md:px-8"
        />
      </div>

      {/* PARTE 4 - FAIXA DE COPYRIGHT */}
      <div style={{ 
        width: '100%', 
        height: '52px', 
        backgroundColor: '#DAA520', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        padding: '0 40px'
      }} className="md:flex-col md:h-auto md:py-4 md:gap-3 md:text-center">
        <span style={{ fontSize: '18px', fontWeight: 400, color: '#FFFFFF' }}>
          © 2026 Thiago Design Cruz. Todos os direitos reservados.
        </span>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }} className="md:flex-wrap md:justify-center">
          <Link href="/politicas/reembolso" style={{ color: '#FFFFFF', textDecoration: 'none' }} className="hover:opacity-80 transition-opacity">
            Política de Reembolso e Devoluções
          </Link>
          <span style={{ color: '#FFFFFF' }}>·</span>
          <Link href="/politicas/troca" style={{ color: '#FFFFFF', textDecoration: 'none' }} className="hover:opacity-80 transition-opacity">
            Política de Troca
          </Link>
          <span style={{ color: '#FFFFFF' }}>·</span>
          <Link href="/politicas/privacidade" style={{ color: '#FFFFFF', textDecoration: 'none' }} className="hover:opacity-80 transition-opacity">
            Política de Privacidade
          </Link>
          <span style={{ color: '#FFFFFF' }}>·</span>
          <Link href="/politicas/entrega" style={{ color: '#FFFFFF', textDecoration: 'none' }} className="hover:opacity-80 transition-opacity">
            Entrega e Prazo
          </Link>
        </div>
      </div>
    </footer>
  );
}
