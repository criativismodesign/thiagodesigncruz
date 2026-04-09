import { createClient } from '@supabase/supabase-js'

export async function POST(request: Request) {
  try {
    console.log('Upload iniciado')
    console.log('SUPABASE_URL:', process.env.NEXT_PUBLIC_SUPABASE_URL ? 'OK' : 'MISSING')
    console.log('SERVICE_KEY:', process.env.SUPABASE_SERVICE_ROLE_KEY ? 'OK' : 'MISSING')
    
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseUrl || !supabaseServiceKey) {
      console.error('Variáveis de ambiente ausentes')
      return Response.json({ 
        success: false, 
        error: 'Variáveis de ambiente do Supabase não configuradas' 
      }, { status: 500 })
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    const formData = await request.formData()
    const file = formData.get('file') as File
    const pasta = formData.get('pasta') as string
    
    console.log('File:', file?.name, 'Pasta:', pasta)

    if (!file) {
      console.error('Nenhum arquivo enviado')
      return Response.json({ success: false, error: 'Nenhum arquivo enviado' })
    }

    console.log('Tamanho do arquivo:', file.size, 'bytes')
    console.log('Tipo do arquivo:', file.type)

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const nomeArquivo = `${pasta}/${Date.now()}-${file.name}` 
    
    console.log('Nome do arquivo gerado:', nomeArquivo)

    const { error } = await supabase.storage
      .from('imagens')
      .upload(nomeArquivo, buffer, {
        contentType: file.type,
        upsert: false
      })

    if (error) {
      console.error('Erro no upload Supabase:', error)
      return Response.json({ success: false, error: error.message })
    }

    console.log('Upload realizado com sucesso')

    const { data: urlData } = supabase.storage
      .from('imagens')
      .getPublicUrl(nomeArquivo)

    console.log('URL pública gerada:', urlData.publicUrl)

    return Response.json({ success: true, url: urlData.publicUrl })
  } catch (error) {
    console.error('Erro no upload:', error)
    console.error('Stack trace:', error instanceof Error ? error.stack : 'No stack trace')
    return Response.json({ success: false, error: String(error) }, { status: 500 })
  }
}
