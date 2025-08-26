import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { verifyAdminToken } from '../../login/route'

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

      // Q&A 상세 조회
      const { data: question, error } = await supabaseAdmin.from('qna_questions').select('*').eq('id', questionId).single()

      if (error) {
         console.error('Q&A 조회 오류:', error)
         return NextResponse.json({ error: 'Q&A를 찾을 수 없습니다.' }, { status: 404 })
      }

      return NextResponse.json({ post: question })
   } catch (error) {
      console.error('Q&A 상세 API 오류:', error)
      return NextResponse.json({ error: '서버 오류가 발생했습니다.' }, { status: 500 })
   }
}

// Q&A 삭제
export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
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

      // 관련 답변도 함께 삭제
      await supabaseAdmin.from('qna_answers').delete().eq('question_id', questionId)

      // Q&A 삭제
      const { error } = await supabaseAdmin.from('qna_questions').delete().eq('id', questionId)

      if (error) {
         console.error('Q&A 삭제 오류:', error)
         return NextResponse.json({ error: 'Q&A를 삭제할 수 없습니다.' }, { status: 500 })
      }

      return NextResponse.json({ message: 'Q&A가 성공적으로 삭제되었습니다.' })
   } catch (error) {
      console.error('Q&A 삭제 API 오류:', error)
      return NextResponse.json({ error: '서버 오류가 발생했습니다.' }, { status: 500 })
   }
}
