import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { verifyAdminTokenFromRequest } from '@/utils/admin-auth'

// POST: 합격/불합격 처리
export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    // 관리자 권한 확인 (헤더 또는 쿠키)
    const { valid } = await verifyAdminTokenFromRequest(request)
    if (!valid) {
      return NextResponse.json({ error: '유효하지 않은 토큰입니다.' }, { status: 401 })
    }

    const { id: applicationId } = await params
    const { pass_status } = await request.json()

    if (!applicationId || typeof pass_status !== 'boolean') {
      return NextResponse.json({ error: '신청 ID와 합격 여부가 필요합니다.' }, { status: 400 })
    }

    const { data: updated, error } = await supabaseAdmin
      .from('exam_applications')
      .update({
        pass_status,
        updated_at: new Date().toISOString(),
      })
      .eq('id', applicationId)
      .select()
      .single()

    if (error) {
      console.error('합격/불합격 처리 오류:', error)
      return NextResponse.json({ error: '합격/불합격 처리에 실패했습니다.' }, { status: 500 })
    }

    return NextResponse.json({ message: '처리 완료', application: updated })
  } catch (error) {
    console.error('합격/불합격 API 오류:', error)
    return NextResponse.json({ error: '서버 오류가 발생했습니다.' }, { status: 500 })
  }
}
