import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { verifyAdminToken } from '@/utils/admin-auth'

// 답변 수정
export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string; answerId: string }> }) {
   try {
      const { answerId } = await params
      const { content } = await request.json()

      if (!content) {
         return NextResponse.json({ error: '답변 내용을 입력해주세요.' }, { status: 400 })
      }

      const { data, error } = await supabaseAdmin
         .from('comments')
         .update({
            content,
            updated_at: new Date().toISOString(),
         })
         .eq('id', answerId)
         .eq('is_admin_author', true)
         .select()
         .single()

      if (error) {
         console.error('답변 수정 오류:', error)
         return NextResponse.json({ error: error.message }, { status: 400 })
      }

      if (!data) {
         return NextResponse.json({ error: '답변을 찾을 수 없습니다.' }, { status: 404 })
      }

      return NextResponse.json({
         message: '답변이 성공적으로 수정되었습니다.',
         answer: data,
      })
   } catch (error: unknown) {
      console.error('답변 수정 API 오류:', error)
      return NextResponse.json({ error: '서버 오류가 발생했습니다.' }, { status: 500 })
   }
}

// 답변 삭제
export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string; answerId: string }> }) {
   try {
      const { id: qnaId, answerId } = await params

      // 답변 삭제
      const { error: deleteError } = await supabaseAdmin.from('comments').delete().eq('id', answerId).eq('is_admin_author', true)

      if (deleteError) {
         console.error('답변 삭제 오류:', deleteError)
         return NextResponse.json({ error: deleteError.message }, { status: 400 })
      }

      // 남은 관리자 답변이 있는지 확인
      const { data: remainingAnswers } = await supabaseAdmin.from('comments').select('id').eq('post_id', qnaId).eq('is_admin_author', true)

      // 관리자 답변이 없으면 Q&A를 미답변 상태로 변경
      if (!remainingAnswers || remainingAnswers.length === 0) {
         await supabaseAdmin
            .from('posts')
            .update({
               is_answered: false,
               answered_at: null,
               updated_at: new Date().toISOString(),
            })
            .eq('id', qnaId)
      }

      return NextResponse.json({
         message: '답변이 성공적으로 삭제되었습니다.',
      })
   } catch (error: unknown) {
      console.error('답변 삭제 API 오류:', error)
      return NextResponse.json({ error: '서버 오류가 발생했습니다.' }, { status: 500 })
   }
}
