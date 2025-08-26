import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Service Role Key를 사용하여 RLS 우회
const supabaseAdmin = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
   auth: {
      autoRefreshToken: false,
      persistSession: false,
   },
})

export async function GET(request: NextRequest) {
   try {
      // URL 쿼리 파라미터 추출
      const { searchParams } = new URL(request.url)
      const certificationId = searchParams.get('certification_id')
      const status = searchParams.get('status')
      const upcoming = searchParams.get('upcoming') === 'true'

      // 시험 일정 조회 (자격증 정보 포함)
      let query = supabaseAdmin.from('exam_schedules').select(`
        *,
        certifications (
          id,
          name,
          registration_number,
          description,
          application_fee,
          certificate_fee
        )
      `)

      // 필터링 조건 적용
      if (certificationId) {
         query = query.eq('certification_id', certificationId)
      }

      if (status) {
         query = query.eq('status', status)
      }

      // 예정된 시험만 조회
      if (upcoming) {
         const today = new Date().toISOString().split('T')[0]
         query = query.gte('exam_date', today)
      }

      const { data: schedules, error } = await query.order('exam_date', { ascending: true })

      if (error) {
         console.error('시험 일정 조회 오류:', error)
         return NextResponse.json({ error: '시험 일정 정보를 조회할 수 없습니다.' }, { status: 500 })
      }

      return NextResponse.json({
         schedules,
         count: schedules.length,
      })
   } catch (error: unknown) {
      console.error('시험 일정 API 오류:', error)
      return NextResponse.json({ error: '서버 오류가 발생했습니다.' }, { status: 500 })
   }
}

export async function POST(request: NextRequest) {
   try {
      // 관리자 권한 확인
      const authHeader = request.headers.get('authorization')
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
         return NextResponse.json({ error: '인증이 필요합니다.' }, { status: 401 })
      }

      const token = authHeader.split(' ')[1]
      const { data: { user }, error: userError } = await supabaseAdmin.auth.getUser(token)

      if (userError || !user) {
         return NextResponse.json({ error: '유효하지 않은 토큰입니다.' }, { status: 401 })
      }

      // 사용자 프로필에서 관리자 권한 확인
      const { data: profile, error: profileError } = await supabaseAdmin
         .from('profiles')
         .select('role, status')
         .eq('id', user.id)
         .single()

      if (profileError || !profile) {
         return NextResponse.json({ error: '사용자 정보를 찾을 수 없습니다.' }, { status: 401 })
      }

      const adminRoles = ['admin', 'super_admin']
      if (!adminRoles.includes(profile.role) || profile.status !== 'active') {
         return NextResponse.json({ error: '관리자 권한이 필요합니다.' }, { status: 403 })
      }

      const scheduleData = await request.json()

      const { certification_id, exam_date, registration_start_date, registration_end_date, result_announcement_date, exam_location, exam_address, max_applicants = 100, exam_instructions, required_items } = scheduleData

      // 필수 필드 검증
      if (!certification_id || !exam_date || !registration_start_date || !registration_end_date || !exam_location) {
         return NextResponse.json({ error: '필수 정보를 모두 입력해주세요.' }, { status: 400 })
      }

      // 날짜 순서 검증
      const regStart = new Date(registration_start_date)
      const regEnd = new Date(registration_end_date)
      const examDate = new Date(exam_date)

      if (regStart >= regEnd || regEnd >= examDate) {
         return NextResponse.json({ error: '날짜 순서가 올바르지 않습니다.' }, { status: 400 })
      }

      // 시험 일정 생성
      const { data: schedule, error } = await supabaseAdmin
         .from('exam_schedules')
         .insert([
            {
               certification_id,
               exam_date,
               registration_start_date,
               registration_end_date,
               result_announcement_date,
               exam_location,
               exam_address,
               max_applicants,
               exam_instructions,
               required_items,
               status: 'scheduled',
            },
         ])
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
         console.error('시험 일정 생성 오류:', error)
         return NextResponse.json({ error: '시험 일정 생성에 실패했습니다.' }, { status: 400 })
      }

      return NextResponse.json({
         schedule,
         message: '시험 일정이 생성되었습니다.',
      })
   } catch (error: unknown) {
      console.error('시험 일정 생성 API 오류:', error)
      return NextResponse.json({ error: '서버 오류가 발생했습니다.' }, { status: 500 })
   }
}
