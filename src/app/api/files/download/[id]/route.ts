import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseAdmin = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
   auth: { autoRefreshToken: false, persistSession: false },
})

// GET: 특정 ID의 자료실 파일 다운로드 (Signed URL 생성)
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
   try {
      const { id } = await params
      if (!id) return NextResponse.json({ error: 'File ID is required' }, { status: 400 })

      const { data: resource, error: fetchError } = await supabaseAdmin
        .from('resources')
        .select('id, title, file_name, file_path, view_count')
        .eq('id', id)
        .single()

      if (fetchError || !resource) {
         return NextResponse.json({ error: '파일 정보를 찾을 수 없습니다.' }, { status: 404 })
      }

      if (!resource.file_path) {
         return NextResponse.json({ error: '파일 경로가 없습니다.' }, { status: 404 })
      }

      const bucket = 'resources'
      const filePath = resource.file_path

      const { data: signed, error: urlError } = await supabaseAdmin.storage
        .from(bucket)
        .createSignedUrl(filePath, 3600, { download: true })

      if (urlError) {
         console.error('Signed URL 생성 오류:', urlError)
         return NextResponse.json({ error: '파일 URL 생성에 실패했습니다.' }, { status: 400 })
      }

      // 조회수 증가 (best-effort)
      await supabaseAdmin
        .from('resources')
        .update({ view_count: (resource.view_count || 0) + 1 })
        .eq('id', id)

      return NextResponse.json({ url: signed.signedUrl, file_name: resource.file_name, expires_in: 3600 })
   } catch (error) {
      console.error('API 오류:', error)
      return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
   }
}
