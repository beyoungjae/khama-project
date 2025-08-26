import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
   try {
      const { id } = await params

      if (!id) {
         return NextResponse.json({ error: '신청 ID가 필요합니다.' }, { status: 400 })
      }

      // 관리자 권한 확인 - JWT 토큰 검증
      const authHeader = request.headers.get('authorization')
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
         return NextResponse.json({ error: '인증이 필요합니다.' }, { status: 401 })
      }

      // 명시적으로 조인 조건을 지정하여 profiles 테이블과 연결
      // exam_applications 테이블 사용
      const { data: application, error } = await supabaseAdmin
         .from('exam_applications')
         .select(
            `
            *,
            profiles!inner(
              name,
              email,
              phone,
              birth_date,
              gender,
              address,
              detail_address
            ),
            exam_schedules (
              exam_date,
              exam_location,
              certifications (
                name
              )
            )
          `
         )
         .eq('id', id)
         .single()

      if (error) {
         console.error('시험 신청 상세 조회 오류:', error)
         return NextResponse.json({ error: '신청 정보를 찾을 수 없습니다.' }, { status: 404 })
      }

      return NextResponse.json({ application })
   } catch (error) {
      console.error('시험 신청 상세 조회 API 오류:', error)
      return NextResponse.json({ error: '서버 오류가 발생했습니다.' }, { status: 500 })
   }
}
