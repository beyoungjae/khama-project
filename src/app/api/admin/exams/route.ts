import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { verifyAdminToken } from '@/utils/admin-auth'

// 관리자용 시험 일정 목록 조회
export async function GET(request: NextRequest) {
   try {
      const { searchParams } = new URL(request.url)
      const certificationId = searchParams.get('certification_id')
      const status = searchParams.get('status') || 'all'
      const search = searchParams.get('search')
      const page = parseInt(searchParams.get('page') || '1')
      const limit = parseInt(searchParams.get('limit') || '20')
      const offset = (page - 1) * limit

      let query = supabaseAdmin.from('exam_schedules').select(
         `
        *,
        certifications (
          id,
          name,
          registration_number,
          application_fee,
          certificate_fee
        )
      `,
         { count: 'exact' }
      )

      // 자격증 필터
      if (certificationId) {
         query = query.eq('certification_id', certificationId)
      }

      // 상태 필터
      if (status !== 'all') {
         query = query.eq('status', status)
      }

      // 검색 (자격증명, 시험장소)
      if (search) {
         query = query.or(`exam_location.ilike.%${search}%,exam_address.ilike.%${search}%`)
      }

      const { data: schedules, error, count } = await query.order('exam_date', { ascending: false }).range(offset, offset + limit - 1)

      if (error) {
         console.error('시험 일정 조회 오류:', error)
         return NextResponse.json({ error: error.message }, { status: 400 })
      }

      // 각 일정별 신청자 수 조회
      const schedulesWithStats = await Promise.all(
         (schedules || []).map(async (schedule) => {
            const { count: applicationsCount } = await supabaseAdmin.from('exam_applications').select('id', { count: 'exact' }).eq('exam_schedule_id', schedule.id).neq('application_status', 'cancelled')

            return {
               ...schedule,
               current_applicants: applicationsCount || 0,
            }
         })
      )

      return NextResponse.json({
         schedules: schedulesWithStats,
         pagination: {
            page,
            limit,
            total: count || 0,
            totalPages: Math.ceil((count || 0) / limit),
         },
      })
   } catch (error: unknown) {
      console.error('시험 일정 관리 API 오류:', error)
      return NextResponse.json({ error: '서버 오류가 발생했습니다.' }, { status: 500 })
   }
}

// 관리자용 시험 일정 생성
export async function POST(request: NextRequest) {
   try {
      const { certification_id, exam_date, registration_start_date, registration_end_date, result_announcement_date, exam_location, exam_address, max_applicants, exam_instructions, required_items, status } = await request.json()

      // 필수 필드 검증
      if (!certification_id || !exam_date || !registration_start_date || !registration_end_date || !exam_location) {
         return NextResponse.json({ error: '자격증, 시험일, 접수 시작일, 접수 마감일, 시험장소는 필수입니다.' }, { status: 400 })
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

      // 시험 일정 생성
      const { data, error } = await supabaseAdmin
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
               max_applicants: max_applicants || 100,
               exam_instructions,
               required_items,
               status: status || 'scheduled',
               current_applicants: 0,
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
         return NextResponse.json({ error: error.message }, { status: 400 })
      }

      return NextResponse.json({
         message: '시험 일정이 성공적으로 생성되었습니다.',
         schedule: data,
      })
   } catch (error: unknown) {
      console.error('시험 일정 생성 API 오류:', error)
      return NextResponse.json({ error: '서버 오류가 발생했습니다.' }, { status: 500 })
   }
}
