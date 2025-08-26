import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
   try {
      const { id: scheduleId } = await params

      // 관리자 권한 확인 - JWT 토큰 검증
      const authHeader = request.headers.get('authorization')
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
         return NextResponse.json({ error: '인증이 필요합니다.' }, { status: 401 })
      }

      const { data: schedule, error } = await supabaseAdmin
         .from('exam_schedules')
         .select(
            `
        *,
        certifications (
          id,
          name,
          registration_number,
          application_fee,
          certificate_fee
        )
      `
         )
         .eq('id', scheduleId)
         .single()

      if (error || !schedule) {
         return NextResponse.json({ error: '시험 일정을 찾을 수 없습니다.' }, { status: 404 })
      }

      // 신청자 목록 조회
      const { data: applications, count: applicationsCount } = await supabaseAdmin
         .from('exam_applications')
         .select(
            `
        id,
        applicant_name,
        applicant_email,
        applicant_phone,
        application_status,
        payment_status,
        created_at,
        exam_number,
        pass_status,
        payment_amount,
        payment_method,
        paid_at
      `,
            { count: 'exact' }
         )
         .eq('exam_schedule_id', scheduleId)

      return NextResponse.json({
         schedule,
         applications: applications || [],
         applicationsCount: applicationsCount || 0,
      })
   } catch (error) {
      console.error('시험 일정 상세 조회 API 오류:', error)
      return NextResponse.json({ error: '서버 오류가 발생했습니다.' }, { status: 500 })
   }
}

// 관리자용 시험 일정 수정
export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
   try {
      const { id: scheduleId } = await params
      const { certification_id, exam_date, registration_start_date, registration_end_date, result_announcement_date, exam_location, exam_address, max_applicants, exam_instructions, required_items, status } = await request.json()

      // 필수 필드 검증
      if (!certification_id || !exam_date || !registration_start_date || !registration_end_date || !exam_location) {
         return NextResponse.json({ error: '자격증, 시험일, 접수 시작일, 접수 마감일, 시험장소는 필수입니다.' }, { status: 400 })
      }

      // 기존 일정 확인
      const { data: existingSchedule } = await supabaseAdmin.from('exam_schedules').select('id, current_applicants').eq('id', scheduleId).single()

      if (!existingSchedule) {
         return NextResponse.json({ error: '시험 일정을 찾을 수 없습니다.' }, { status: 404 })
      }

      // 날짜 순서 검증
      const regStart = new Date(registration_start_date)
      const regEnd = new Date(registration_end_date)
      const examDate = new Date(exam_date)
      const resultDate = result_announcement_date ? new Date(result_announcement_date) : null

      if (regStart >= regEnd) {
         return NextResponse.json({ error: '접수 시작일은 접수 마감일보다 빨라야 합니다.' }, { status: 400 })
      }

      if (regEnd >= examDate) {
         return NextResponse.json({ error: '접수 마감일은 시험일보다 빨라야 합니다.' }, { status: 400 })
      }

      if (resultDate && resultDate <= examDate) {
         return NextResponse.json({ error: '결과 발표일은 시험일보다 늦어야 합니다.' }, { status: 400 })
      }

      // 자격증 존재 여부 확인
      const { data: certification } = await supabaseAdmin.from('certifications').select('id, name').eq('id', certification_id).single()

      if (!certification) {
         return NextResponse.json({ error: '존재하지 않는 자격증입니다.' }, { status: 404 })
      }

      // 시험 일정 수정
      const { data, error } = await supabaseAdmin
         .from('exam_schedules')
         .update({
            certification_id,
            exam_date,
            registration_start_date,
            registration_end_date,
            result_announcement_date,
            exam_location,
            exam_address,
            max_applicants: max_applicants || 100,
            exam_instructions,
            required_items,
            status,
            updated_at: new Date().toISOString(),
         })
         .eq('id', scheduleId)
         .select(
            `
        *,
        certifications (
          id,
          name,
          registration_number
        )
      `
         )
         .single()

      if (error) {
         console.error('시험 일정 수정 오류:', error)
         return NextResponse.json({ error: error.message }, { status: 400 })
      }

      return NextResponse.json({
         message: '시험 일정이 성공적으로 수정되었습니다.',
         schedule: data,
      })
   } catch (error: unknown) {
      console.error('시험 일정 수정 API 오류:', error)
      return NextResponse.json({ error: '서버 오류가 발생했습니다.' }, { status: 500 })
   }
}

// 관리자용 시험 일정 삭제
export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
   try {
      const { id: scheduleId } = await params

      // 신청자가 있는지 확인
      const { count: applicationsCount } = await supabaseAdmin.from('exam_applications').select('id', { count: 'exact' }).eq('exam_schedule_id', scheduleId).neq('application_status', 'cancelled')

      if (applicationsCount && applicationsCount > 0) {
         return NextResponse.json({ error: `신청자가 ${applicationsCount}명 있는 시험 일정은 삭제할 수 없습니다. 먼저 모든 신청을 취소해주세요.` }, { status: 400 })
      }

      // 관련된 취소된 신청들 먼저 삭제
      const { error: applicationsError } = await supabaseAdmin.from('exam_applications').delete().eq('exam_schedule_id', scheduleId)

      if (applicationsError) {
         console.error('신청 내역 삭제 오류:', applicationsError)
      }

      // 시험 일정 삭제
      const { error } = await supabaseAdmin.from('exam_schedules').delete().eq('id', scheduleId)

      if (error) {
         console.error('시험 일정 삭제 오류:', error)
         return NextResponse.json({ error: error.message }, { status: 400 })
      }

      return NextResponse.json({
         message: '시험 일정이 성공적으로 삭제되었습니다.',
      })
   } catch (error: unknown) {
      console.error('시험 일정 삭제 API 오류:', error)
      return NextResponse.json({ error: '서버 오류가 발생했습니다.' }, { status: 500 })
   }
}
