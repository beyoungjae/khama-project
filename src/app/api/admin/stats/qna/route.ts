import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { verifyAdminTokenFromRequest } from '@/utils/admin-auth'

export async function GET(request: NextRequest) {
   try {
      // 관리자 권한 확인 (헤더 또는 쿠키)
      const { valid } = verifyAdminTokenFromRequest(request)
      if (!valid) {
         return NextResponse.json({ error: '유효하지 않은 토큰입니다.' }, { status: 401 })
      }

      // 답변 대기 중인 Q&A 수
      const { count: pendingQna } = await supabaseAdmin.from('posts').select('*', { count: 'exact', head: true }).eq('type', 'qna').eq('is_answered', false)

      return NextResponse.json({
         pending: pendingQna || 0,
      })
   } catch (error) {
      console.error('Q&A 통계 조회 오류:', error)
      return NextResponse.json({ error: '서버 오류가 발생했습니다.' }, { status: 500 })
   }
}
