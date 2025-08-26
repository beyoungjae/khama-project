import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'

// QnA 상세 조회
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
   try {
      const { id } = await params

      // URL 처리에서 조회수 증가 여부 확인
      const { searchParams } = new URL(request.url)
      const incrementView = searchParams.get('increment') === 'true'

      // QnA 질문 조회
      const { data: question, error: questionError } = await supabaseAdmin
         .from('qna_questions')
         .select('*')
         .eq('id', id)
         .single()

      if (questionError || !question) {
         return NextResponse.json({ error: '질문을 찾을 수 없습니다.' }, { status: 404 })
      }

      let updatedQuestion = question

      // 조회수 증가 (명시적으로 요청한 경우만)
      if (incrementView) {
         const { data: updated } = await supabaseAdmin
            .from('qna_questions')
            .update({ 
               view_count: (question.view_count || 0) + 1,
               updated_at: new Date().toISOString()
            })
            .eq('id', id)
            .select()
            .single()

         updatedQuestion = updated || { ...question, view_count: (question.view_count || 0) + 1 }
      }

      // 답변 조회
      const { data: answers, error: answersError } = await supabaseAdmin
         .from('qna_answers')
         .select('*')
         .eq('question_id', id)
         .order('created_at', { ascending: true })

      if (answersError) {
         console.error('답변 조회 오류:', answersError)
      }

      // 카테고리를 한글로 변환
      const categoryMap: Record<string, string> = {
         exam: '시험문의',
         education: '교육문의',
         certificate: '자격증문의',
         general: '기타문의'
      }

      return NextResponse.json({
         question: {
            ...updatedQuestion,
            category: categoryMap[updatedQuestion.category] || updatedQuestion.category,
         },
         answers: answers || []
      })
   } catch (error: unknown) {
      console.error('QnA 상세 API 오류:', error)
      return NextResponse.json({ error: '서버 오류가 발생했습니다.' }, { status: 500 })
   }
}
