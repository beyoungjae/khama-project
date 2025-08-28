import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Service Role Key를 사용하여 RLS 우회
const supabaseAdmin = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
   auth: {
      autoRefreshToken: false,
      persistSession: false,
   },
})

// GET: 합격 결과 조회 (수험번호로 검색)
export async function GET(request: NextRequest) {
   try {
      const { searchParams } = new URL(request.url)
      const examNumber = searchParams.get('examNumber')

      if (!examNumber) {
         return NextResponse.json({ error: '수험번호가 필요합니다.' }, { status: 400 })
      }

      // exam_applications 테이블에서 수험번호로 검색
      const { data: application, error } = await supabaseAdmin
         .from('exam_applications')
         .select(
            `
            *,
            certifications (
              name,
              registration_number
            ),
            exam_schedules (
              exam_date,
              exam_location
            )
          `
         )
         .eq('exam_number', examNumber)
         .single()

      if (error) {
         console.error('합격 결과 조회 오류:', error)
         return NextResponse.json({ error: '해당 수험번호의 신청 정보를 찾을 수 없습니다.' }, { status: 404 })
      }

      if (!application) {
         return NextResponse.json({ error: '해당 수험번호의 신청 정보를 찾을 수 없습니다.' }, { status: 404 })
      }

      // 시험 결과가 아직 나오지 않은 경우
      if (application.pass_status === null) {
         return NextResponse.json({ error: '시험 결과가 아직 발표되지 않았습니다.' }, { status: 404 })
      }

      return NextResponse.json({ application })
   } catch (error) {
      console.error('API 오류:', error)
      return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
   }
}

// POST: 관리자 합격/불합격 처리
export async function POST(request: NextRequest) {
   try {
      const body = await request.json()
      const { applicationId, passStatus, writtenScore, practicalScore, totalScore } = body

      if (!applicationId || passStatus === undefined) {
         return NextResponse.json({ error: '신청 ID와 합격 상태가 필요합니다.' }, { status: 400 })
      }

      // 관리자 권한 확인
      const authHeader = request.headers.get('authorization')
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
         return NextResponse.json({ error: '인증이 필요합니다.' }, { status: 401 })
      }

      // exam_applications 테이블 업데이트
      const { data: updatedApplication, error } = await supabaseAdmin
         .from('exam_applications')
         .update({
            pass_status: passStatus,
            written_score: writtenScore,
            practical_score: practicalScore,
            total_score: totalScore,
            updated_at: new Date().toISOString(),
         })
         .eq('id', applicationId)
         .select(
            `
            *,
            certifications (
              name,
              registration_number
            ),
            exam_schedules (
              exam_date,
              exam_location
            )
          `
         )
         .single()

      if (error) {
         console.error('합격 상태 업데이트 오류:', error)
         return NextResponse.json({ error: error.message }, { status: 500 })
      }

      return NextResponse.json({ application: updatedApplication, message: '합격 상태가 성공적으로 업데이트되었습니다.' })
   } catch (error) {
      console.error('API 오류:', error)
      return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
   }
}
