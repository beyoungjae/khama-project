import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { verifyAdminTokenFromRequest } from '@/utils/admin-auth'

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
   try {
      // 관리자 권한 확인
      const { valid } = await verifyAdminTokenFromRequest(request)
      if (!valid) {
         return NextResponse.json({ error: '유효하지 않은 토큰입니다.' }, { status: 401 })
      }

      const { content } = await request.json()
      const { id: questionId } = await params

      if (!content) {
         return NextResponse.json({ error: '답변 내용을 입력해주세요.' }, { status: 400 })
      }

      // 먼저 질문이 존재하는지 확인
      const { data: question, error: questionError } = await supabaseAdmin.from('qna_questions').select('*').eq('id', questionId).single()

      if (questionError || !question) {
         return NextResponse.json({ error: 'Q&A를 찾을 수 없습니다.' }, { status: 404 })
      }

      // qna_answers 테이블에 답변 추가
      const { data: answer, error: answerError } = await supabaseAdmin
         .from('qna_answers')
         .insert([
            {
               question_id: questionId,
               content,
               author_name: '관리자',
            },
         ])
         .select()
         .single()

      if (answerError) {
         console.error('답변 생성 오류:', answerError)
         return NextResponse.json({ error: '답변을 작성할 수 없습니다.' }, { status: 500 })
      }

      // 질문 상태 업데이트
      const { data: updatedQuestion, error: updateError } = await supabaseAdmin
         .from('qna_questions')
         .update({
            is_answered: true,
            status: 'answered',
            updated_at: new Date().toISOString(),
         })
         .eq('id', questionId)
         .select()
         .single()

      if (updateError) {
         console.error('Q&A 상태 업데이트 오류:', updateError)
         return NextResponse.json({ error: '상태를 업데이트할 수 없습니다.' }, { status: 500 })
      }

      return NextResponse.json({
         message: '답변이 성공적으로 작성되었습니다.',
         question: updatedQuestion,
         answer: answer,
      })
   } catch (error) {
      console.error('Q&A 답변 API 오류:', error)
      return NextResponse.json({ error: '서버 오류가 발생했습니다.' }, { status: 500 })
   }
}
