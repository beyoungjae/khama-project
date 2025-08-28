import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { verifyAdminTokenFromRequest } from '@/utils/admin-auth'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { autoRefreshToken: false, persistSession: false } }
)

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { valid } = await verifyAdminTokenFromRequest(request)
    if (!valid) return NextResponse.json({ error: '유효하지 않은 토큰입니다.' }, { status: 401 })

    const { id } = await params

    // 리소스 조회 (파일 경로 확인)
    const { data: resource } = await supabaseAdmin
      .from('resources')
      .select('file_path, file_name')
      .eq('id', id)
      .single()

    if (resource?.file_path) {
      await supabaseAdmin.storage.from('resources').remove([resource.file_path])
    }

    const { error } = await supabaseAdmin.from('resources').delete().eq('id', id)
    if (error) {
      console.error('자료 삭제 오류:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ message: '삭제 완료' })
  } catch (error) {
    console.error('관리자 자료 삭제 API 오류:', error)
    return NextResponse.json({ error: '서버 오류가 발생했습니다.' }, { status: 500 })
  }
}
