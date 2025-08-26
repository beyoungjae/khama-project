import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { verifyAdminToken } from '../../../login/route'

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
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

      const { id: questionId } = await params

      // 해당 질문의 답변들 조회
      const { data: answers, error } = await supabaseAdmin
         .from('qna_answers')
         .select('*')
         .eq('question_id', questionId)
         .order('created_at', { ascending: true })

      if (error) {
         console.error('답변 조회 오류:', error)
         return NextResponse.json({ error: '답변을 불러올 수 없습니다.' }, { status: 500 })
      }

      return NextResponse.json({
         answers: answers || [],
      })
   } catch (error) {
      console.error('답변 조회 API 오류:', error)
      return NextResponse.json({ error: '서버 오류가 발생했습니다.' }, { status: 500 })
   }
}