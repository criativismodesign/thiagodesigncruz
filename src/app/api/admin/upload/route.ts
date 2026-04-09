import { createClient } from '@supabase/supabase-js'

export async function POST(request: Request) {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseUrl || !supabaseServiceKey) {
      return Response.json({ 
        success: false, 
        error: 'Variáveis de ambiente do Supabase não configuradas' 
      }, { status: 500 })
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    const formData = await request.formData()
    const file = formData.get('file') as File
    const pasta = formData.get('pasta') as string

    if (!file) {
      return Response.json({ success: false, error: 'Nenhum arquivo enviado' })
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const nomeArquivo = `${pasta}/${Date.now()}-${file.name}` 

    const { error } = await supabase.storage
      .from('imagens')
      .upload(nomeArquivo, buffer, {
        contentType: file.type,
        upsert: false
      })

    if (error) {
      return Response.json({ success: false, error: error.message })
    }

    const { data: urlData } = supabase.storage
      .from('imagens')
      .getPublicUrl(nomeArquivo)

    return Response.json({ success: true, url: urlData.publicUrl })
  } catch (error) {
    console.error('Erro no upload:', error)
    return Response.json({ success: false, error: 'Erro interno no servidor' })
  }
}
