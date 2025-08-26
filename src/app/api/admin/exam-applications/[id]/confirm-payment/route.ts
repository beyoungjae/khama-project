import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { verifyAdminToken } from '../../../login/route'

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
   try {
      // 관리자 권한 확인 - JWT 토큰 검증
      const authHeader = request.headers.get('authorization')
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
         return NextResponse.json({ error: '인증이 필요합니다.' }, { status: 401 })
      }

      const token = authHeader.split(' ')[1]

      // JWT 토큰 검증
      const { valid } = verifyAdminToken(token)
      if (!valid) {
         return NextResponse.json({ error: '유효하지 않은 토큰입니다.' }, { status: 401 })
      }

      const { id: applicationId } = await params

      if (!applicationId) {
         return NextResponse.json({ error: '신청 ID가 필요합니다.' }, { status: 400 })
      }

      // 시험 신청 상태를 'confirmed'로 업데이트
      const { data: updatedApplication, error } = await supabaseAdmin
         .from('exam_applications')
         .update({
            application_status: 'confirmed',
            payment_status: 'paid',
            paid_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
         })
         .eq('id', applicationId)
         .select()
         .single()

      if (error) {
         console.error('입금 확인 처리 오류:', error)
         return NextResponse.json({ error: '입금 확인 처리에 실패했습니다.' }, { status: 500 })
      }

      return NextResponse.json({
         message: '입금이 확인되었습니다.',
         application: updatedApplication,
      })
   } catch (error) {
      console.error('입금 확인 API 오류:', error)
      return NextResponse.json({ error: '서버 오류가 발생했습니다.' }, { status: 500 })
   }
}
