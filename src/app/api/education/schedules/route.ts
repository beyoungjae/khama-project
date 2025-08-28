import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Service Role Key를 사용하여 RLS 우회
const supabaseAdmin = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
   auth: {
      autoRefreshToken: false,
      persistSession: false,
   },
})

// GET: 교육 일정 목록 조회
export async function GET(request: NextRequest) {
   try {
      const { searchParams } = new URL(request.url)
      const courseId = searchParams.get('courseId')
      const status = searchParams.get('status') || 'all'
      const page = parseInt(searchParams.get('page') || '1')
      const limit = parseInt(searchParams.get('limit') || '10')

      const offset = (page - 1) * limit

      let query = supabaseAdmin.from('education_schedules').select(
         `
         *,
         education_courses (
           name,
           description,
           course_fee
         )
       `,
         { count: 'exact' }
      )

      // 상태 필터
      if (status !== 'all') {
         query = query.eq('status', status)
      }

      // 특정 교육 과정 필터
      if (courseId) {
         query = query.eq('course_id', courseId)
      }

      // 정렬 및 페이지네이션
      const { data: schedules, count, error } = await query.order('start_date', { ascending: true }).range(offset, offset + limit - 1)

      if (error) {
         console.error('교육 일정 조회 오류:', error)
         return NextResponse.json({ error: error.message }, { status: 500 })
      }

      // 페이지네이션 정보
      const totalPages = Math.ceil((count || 0) / limit)

      return NextResponse.json({
         schedules: schedules || [],
         pagination: {
            page,
            limit,
            total: count || 0,
            totalPages,
            hasNext: page < totalPages,
            hasPrev: page > 1,
         },
      })
   } catch (error) {
      console.error('API 오류:', error)
      return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
   }
}

// POST: 교육 일정 생성 (관리자용)
export async function POST(request: NextRequest) {
   try {
      const scheduleData = await request.json()

      // 필수 필드 검증
      if (!scheduleData.course_id || !scheduleData.start_date || !scheduleData.end_date || !scheduleData.location) {
         return NextResponse.json({ error: '필수 정보가 누락되었습니다.' }, { status: 400 })
      }

      // 교육 일정 생성
      const { data: schedule, error } = await supabaseAdmin.from('education_schedules').insert(scheduleData).select().single()

      if (error) {
         console.error('교육 일정 생성 오류:', error)
         return NextResponse.json({ error: error.message }, { status: 500 })
      }

      return NextResponse.json({ schedule, message: '교육 일정이 성공적으로 생성되었습니다.' })
   } catch (error) {
      console.error('API 오류:', error)
      return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
   }
}
