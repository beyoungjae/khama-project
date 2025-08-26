import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { verifyAdminToken } from '../../login/route'

export async function GET(request: NextRequest) {
   try {
      // 관리자 권한 확인
      const authHeader = request.headers.get('authorization')
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
         return NextResponse.json({ error: '인증이 필요합니다.' }, { status: 401 })
      }

      const token = authHeader.split(' ')[1]
      const { valid } = verifyAdminToken(token)
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
