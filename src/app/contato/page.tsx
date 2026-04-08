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
    <main>
      <div style={{ textAlign: 'center', marginBottom: '48px', padding: '100px 120px 0 120px' }}>
        <h1 style={{
          fontSize: '48px',
          fontWeight: 600,
          color: '#292929',
          textTransform: 'uppercase',
          marginBottom: '16px',
          fontFamily: 'Inter, sans-serif'
        }}>
          FALE CONOSCO
        </h1>
        <p style={{
          fontSize: '18px',
          color: '#AAAAAA',
          maxWidth: '600px',
          margin: '0 auto',
          fontFamily: 'Inter, sans-serif',
          fontWeight: 400
        }}>
          Tem alguma dúvida, sugestão ou precisa de ajuda? Estamos aqui para
          você!
        </p>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(5, 1fr)',
        gap: '48px',
        padding: '0 120px'
      }}>
        {/* Contact Info */}
        <div style={{ gridColumn: 'span 2', display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div style={{
            borderRadius: '16px',
            border: '1px solid #E5E5E5',
            backgroundColor: '#FFFFFF',
            padding: '24px'
          }}>
            <h2 style={{
              fontSize: '18px',
              fontWeight: 600,
              color: '#292929',
              marginBottom: '24px',
              fontFamily: 'Inter, sans-serif'
            }}>
              Informações de Contato
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
                <div style={{
                  borderRadius: '8px',
                  backgroundColor: '#DAA52020',
                  padding: '10px'
                }}>
                  <Mail style={{ height: '20px', width: '20px', color: '#DAA520' }} />
                </div>
                <div>
                  <p style={{
                    fontSize: '14px',
                    fontWeight: 500,
                    color: '#292929',
                    fontFamily: 'Inter, sans-serif'
                  }}>E-mail</p>
                  <p style={{
                    fontSize: '14px',
                    color: '#AAAAAA',
                    fontFamily: 'Inter, sans-serif',
                    fontWeight: 400
                  }}>
                    contato@thiagodesigncruz.com.br
                  </p>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
                <div style={{
                  borderRadius: '8px',
                  backgroundColor: '#DAA52020',
                  padding: '10px'
                }}>
                  <Phone style={{ height: '20px', width: '20px', color: '#DAA520' }} />
                </div>
                <div>
                  <p style={{
                    fontSize: '14px',
                    fontWeight: 500,
                    color: '#292929',
                    fontFamily: 'Inter, sans-serif'
                  }}>Telefone</p>
                  <p style={{
                    fontSize: '14px',
                    color: '#AAAAAA',
                    fontFamily: 'Inter, sans-serif',
                    fontWeight: 400
                  }}>
                    (11) 99999-9999
                  </p>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
                <div style={{
                  borderRadius: '8px',
                  backgroundColor: '#DAA52020',
                  padding: '10px'
                }}>
                  <MessageCircle style={{ height: '20px', width: '20px', color: '#DAA520' }} />
                </div>
                <div>
                  <p style={{
                    fontSize: '14px',
                    fontWeight: 500,
                    color: '#292929',
                    fontFamily: 'Inter, sans-serif'
                  }}>WhatsApp</p>
                  <p style={{
                    fontSize: '14px',
                    color: '#AAAAAA',
                    fontFamily: 'Inter, sans-serif',
                    fontWeight: 400
                  }}>
                    (11) 99999-9999
                  </p>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
                <div style={{
                  borderRadius: '8px',
                  backgroundColor: '#DAA52020',
                  padding: '10px'
                }}>
                  <MapPin style={{ height: '20px', width: '20px', color: '#DAA520' }} />
                </div>
                <div>
                  <p style={{
                    fontSize: '14px',
                    fontWeight: 500,
                    color: '#292929',
                    fontFamily: 'Inter, sans-serif'
                  }}>Localização</p>
                  <p style={{
                    fontSize: '14px',
                    color: '#AAAAAA',
                    fontFamily: 'Inter, sans-serif',
                    fontWeight: 400
                  }}>
                    São Paulo, SP — Brasil
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div style={{
            borderRadius: '16px',
            border: '1px solid #E5E5E5',
            backgroundColor: '#FFFFFF',
            padding: '24px'
          }}>
            <h3 style={{
              fontSize: '14px',
              fontWeight: 600,
              color: '#292929',
              marginBottom: '12px',
              fontFamily: 'Inter, sans-serif'
            }}>
              Horário de Atendimento
            </h3>
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
              fontSize: '14px',
              color: '#AAAAAA',
              fontFamily: 'Inter, sans-serif',
              fontWeight: 400
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Seg — Sex</span>
                <span style={{ color: '#292929', fontWeight: 500 }}>09:00 — 18:00</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Sábado</span>
                <span style={{ color: '#292929', fontWeight: 500 }}>09:00 — 13:00</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Domingo</span>
                <span style={{ color: '#AAAAAA' }}>Fechado</span>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div style={{ gridColumn: 'span 3' }}>
          <form
            onSubmit={handleSubmit}
            style={{
              borderRadius: '16px',
              border: '1px solid #E5E5E5',
              backgroundColor: '#FFFFFF',
              padding: '32px',
              display: 'flex',
              flexDirection: 'column',
              gap: '20px'
            }}
          >
            <h2 style={{
              fontSize: '18px',
              fontWeight: 600,
              color: '#292929',
              fontFamily: 'Inter, sans-serif'
            }}>
              Envie uma Mensagem
            </h2>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '20px'
            }}>
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: 500,
                  color: '#292929',
                  marginBottom: '6px',
                  fontFamily: 'Inter, sans-serif'
                }}>
                  Nome *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  style={{
                    width: '100%',
                    borderRadius: '8px',
                    border: '1px solid #E5E5E5',
                    backgroundColor: '#FFFFFF',
                    padding: '10px 16px',
                    fontSize: '14px',
                    color: '#292929',
                    fontFamily: 'Inter, sans-serif',
                    outline: 'none'
                  }}
                  placeholder="Seu nome"
                />
              </div>
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: 500,
                  color: '#292929',
                  marginBottom: '6px',
                  fontFamily: 'Inter, sans-serif'
                }}>
                  E-mail *
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  style={{
                    width: '100%',
                    borderRadius: '8px',
                    border: '1px solid #E5E5E5',
                    backgroundColor: '#FFFFFF',
                    padding: '10px 16px',
                    fontSize: '14px',
                    color: '#292929',
                    fontFamily: 'Inter, sans-serif',
                    outline: 'none'
                  }}
                  placeholder="seu@email.com"
                />
              </div>
            </div>

            <div>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: 500,
                color: '#292929',
                marginBottom: '6px',
                fontFamily: 'Inter, sans-serif'
              }}>
                Assunto
              </label>
              <input
                type="text"
                value={formData.subject}
                onChange={(e) =>
                  setFormData({ ...formData, subject: e.target.value })
                }
                style={{
                  width: '100%',
                  borderRadius: '8px',
                  border: '1px solid #E5E5E5',
                  backgroundColor: '#FFFFFF',
                  padding: '10px 16px',
                  fontSize: '14px',
                  color: '#292929',
                  fontFamily: 'Inter, sans-serif',
                  outline: 'none'
                }}
                placeholder="Sobre o que deseja falar?"
              />
            </div>

            <div>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: 500,
                color: '#292929',
                marginBottom: '6px',
                fontFamily: 'Inter, sans-serif'
              }}>
                Mensagem *
              </label>
              <textarea
                rows={5}
                value={formData.message}
                onChange={(e) =>
                  setFormData({ ...formData, message: e.target.value })
                }
                style={{
                  width: '100%',
                  borderRadius: '8px',
                  border: '1px solid #E5E5E5',
                  backgroundColor: '#FFFFFF',
                  padding: '10px 16px',
                  fontSize: '14px',
                  color: '#292929',
                  fontFamily: 'Inter, sans-serif',
                  outline: 'none',
                  resize: 'none'
                }}
                placeholder="Escreva sua mensagem aqui..."
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                borderRadius: '999px',
                backgroundColor: '#DAA520',
                color: '#FFFFFF',
                padding: '12px 24px',
                fontFamily: 'Inter, sans-serif',
                fontWeight: 600,
                fontSize: '16px',
                border: 'none',
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.5 : 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                transition: 'background-color 0.3s ease'
              }}
              onMouseEnter={(e) => !loading && (e.currentTarget.style.backgroundColor = '#46A520')}
              onMouseLeave={(e) => !loading && (e.currentTarget.style.backgroundColor = '#DAA520')}
            >
              {loading ? (
                "Enviando..."
              ) : (
                <>
                  <Send style={{ height: '16px', width: '16px' }} /> Enviar Mensagem
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
