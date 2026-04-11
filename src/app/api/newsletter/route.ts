import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Only create Supabase client if environment variables are available
const supabase = process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY
  ? createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    )
  : null;

export async function POST(request: NextRequest) {
  try {
    // Check if Supabase is configured
    if (!supabase) {
      return NextResponse.json(
        { error: "Serviço de newsletter não configurado" },
        { status: 503 }
      );
    }

    const { nome, whatsapp, email, source = "home" } = await request.json();

    // Validações
    if (!nome || nome.trim().length < 3) {
      return NextResponse.json(
        { error: "Nome deve ter pelo menos 3 caracteres" },
        { status: 400 }
      );
    }

    if (!whatsapp || !/^\d{10,}$/.test(whatsapp.replace(/\D/g, ""))) {
      return NextResponse.json(
        { error: "WhatsApp deve ter pelo menos 10 dígitos" },
        { status: 400 }
      );
    }

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { error: "Email inválido" },
        { status: 400 }
      );
    }

    // Verificar se email já existe
    const { data: existingSubscriber } = await supabase
      .from("Newsletter")
      .select("email")
      .eq("email", email)
      .single();

    if (existingSubscriber) {
      return NextResponse.json(
        { error: "Email já cadastrado" },
        { status: 409 }
      );
    }

    // Inserir novo subscriber
    const { data, error } = await supabase
      .from("Newsletter")
      .insert({
        nome: nome.trim(),
        whatsapp: whatsapp.replace(/\D/g, ""),
        email: email.toLowerCase().trim(),
        source,
        active: true,
      })
      .select()

    if (error) {
      console.error("Erro ao inserir no Supabase:", error);
      return NextResponse.json(
        { error: "Erro ao cadastrar. Tente novamente." },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { 
        success: true, 
        message: "Cadastro realizado com sucesso!",
        data 
      },
      { status: 201 }
    );

  } catch (error) {
  console.error('Erro newsletter:', error)
  return Response.json({ success: false, error: String(error) }, { status: 500 })
}
}
