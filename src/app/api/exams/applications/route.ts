import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseAdmin = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
   auth: {
      autoRefreshToken: false,
      persistSession: false,
   },
})

// 사용자의 시험 신청 목록 조회
export async function GET(request: NextRequest) {
   try {
      // URL에서 userId 가져오기
      const { searchParams } = new URL(request.url)
      const userId = searchParams.get('userId')

      if (!userId) {
         return NextResponse.json({ error: '사용자 ID가 필요합니다.' }, { status: 400 })
      }

      // 사용자의 시험 신청 목록 조회
      const { data: applications, error } = await supabaseAdmin
         .from('exam_applications')
         .select(
            `
        *,
        exam_schedules (
          id,
          exam_date,
          registration_start_date,
          registration_end_date,
          result_announcement_date,
          exam_location,
          exam_address,
          status,
          exam_instructions,
          certifications (
            id,
            name,
            registration_number
          )
        )
      `
         )
         .eq('user_id', userId)
         .order('created_at', { ascending: false })

      if (error) {
         console.error('시험 신청 조회 오류:', error)
         return NextResponse.json({ error: '시험 신청 정보를 조회할 수 없습니다.' }, { status: 500 })
      }

      return NextResponse.json({
         applications,
         count: applications.length,
      })
   } catch (error: unknown) {
      console.error('시험 신청 조회 API 오류:', error)
      return NextResponse.json({ error: '서버 오류가 발생했습니다.' }, { status: 500 })
   }
}

// 시험 신청
export async function POST(request: NextRequest) {
   try {
      // 인증 없이도 신청 가능하도록 변경
      const applicationData = await request.json()

      // 필수 필드 검증
      const requiredFields = ['exam_schedule_id', 'certification_id', 'applicant_name', 'applicant_phone', 'applicant_email', 'applicant_birth_date']
      for (const field of requiredFields) {
         if (!applicationData[field]) {
            return NextResponse.json({ error: `${field}은(는) 필수입니다.` }, { status: 400 })
         }
      }

      const {
         exam_schedule_id,
         certification_id,
         applicant_name,
         applicant_phone,
         applicant_email,
         applicant_birth_date,
         applicant_address,
         education_completed,
         education_certificate_url,
         user_id, // 인증된 사용자의 경우 user_id가 전달됨
      } = applicationData

      // 시험 일정 정보 조회
      const { data: schedule, error: scheduleError } = await supabaseAdmin.from('exam_schedules').select('exam_date, certifications(application_fee, certificate_fee)').eq('id', exam_schedule_id).single()

      if (scheduleError || !schedule) {
         return NextResponse.json({ error: '유효하지 않은 시험 일정입니다.' }, { status: 400 })
      }

      // 자격증 정보 조회
      const { data: certification, error: certificationError } = await supabaseAdmin.from('certifications').select('application_fee, certificate_fee').eq('id', certification_id).single()

      if (certificationError || !certification) {
         return NextResponse.json({ error: '유효하지 않은 자격증입니다.' }, { status: 400 })
      }

      // 총 금액 계산
      const totalAmount = (certification?.application_fee || 0) + (certification?.certificate_fee || 0)

      // 시험 신청 생성 (상태를 payment_pending으로 설정)
      const { data: application, error: applicationError } = await supabaseAdmin
         .from('exam_applications')
         .insert([
            {
               user_id: user_id || null, // 인증되지 않은 사용자의 경우 null
               exam_schedule_id,
               certification_id,
               applicant_name,
               applicant_phone,
               applicant_email,
               applicant_birth_date,
               applicant_address,
               education_completed: education_completed || false,
               education_certificate_url,
               application_status: 'payment_pending', // 계좌이체 방식으로 변경
               payment_amount: totalAmount,
               payment_status: 'pending', // 입금 대기 상태
            },
         ])
         .select(
            `
        *,
        exam_schedules (
          id,
          exam_date,
          exam_location
        ),
        certifications (
          id,
          name,
          registration_number
        )
      `
         )
         .single()

      if (applicationError) {
         console.error('시험 신청 생성 오류:', applicationError)
         return NextResponse.json({ error: '시험 신청에 실패했습니다.' }, { status: 400 })
      }

      return NextResponse.json({ application })
   } catch (error: unknown) {
      console.error('시험 신청 API 오류:', error)
      return NextResponse.json({ error: '서버 오류가 발생했습니다.' }, { status: 500 })
   }
}
