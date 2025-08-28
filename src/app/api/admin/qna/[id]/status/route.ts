import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { verifyAdminTokenFromRequest } from '@/utils/admin-auth'

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
   try {
      // 관리자 권한 확인
      const { valid } = await verifyAdminTokenFromRequest(request)
      if (!valid) {
         return NextResponse.json({ error: '유효하지 않은 토큰입니다.' }, { status: 401 })
      }

      const { id: questionId } = await params
      const { status } = await request.json()

      if (!status || !['pending', 'answered', 'closed'].includes(status)) {
         return NextResponse.json({ error: '올바른 상태를 선택해주세요.' }, { status: 400 })
      }

      // 상태 업데이트
      const updateData: { status: string; updated_at: string; is_answered?: boolean } = {
         status,
         updated_at: new Date().toISOString(),
      }

      // 상태에 따른 추가 필드 업데이트
      if (status === 'pending') {
         updateData.is_answered = false
      } else if (status === 'answered' || status === 'closed') {
         updateData.is_answered = true
      }

      const { data: updatedQuestion, error } = await supabaseAdmin.from('qna_questions').update(updateData).eq('id', questionId).select().single()

      if (error) {
         console.error('상태 변경 오류:', error)
         return NextResponse.json({ error: '상태를 변경할 수 없습니다.' }, { status: 500 })
      }

      return NextResponse.json({
         message: '상태가 변경되었습니다.',
         post: updatedQuestion,
      })
   } catch (error) {
      console.error('상태 변경 API 오류:', error)
      return NextResponse.json({ error: '서버 오류가 발생했습니다.' }, { status: 500 })
   }
}
