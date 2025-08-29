import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Service Role Key를 사용하여 RLS 우회
const supabaseAdmin = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
   auth: {
      autoRefreshToken: false,
      persistSession: false,
   },
})

// GET: 교육 과정 상세 정보 조회
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
   try {
      const { id } = await params

      if (!id) {
         return NextResponse.json({ error: 'Course ID is required' }, { status: 400 })
      }

      // 교육 과정 상세 정보 조회 (교육 일정 포함)
      let { data: course, error } = await supabaseAdmin
         .from('education_courses')
         .select(
            `
            *,
            education_schedules (
              id,
              start_date,
              end_date,
              location,
              max_participants,
              current_participants,
              registration_start_date,
              registration_end_date,
              status
            )
          `
         )
         .eq('id', id)
         .single()

      if (error) {
         console.error('교육 과정 상세 조회 오류:', error)
         return NextResponse.json({ error: error.message }, { status: 500 })
      }

      if (!course) {
         return NextResponse.json({ error: '교육 과정을 찾을 수 없습니다.' }, { status: 404 })
      }

      // 정렬: 스케줄 시작일 오름차순
      if (course && Array.isArray(course.education_schedules)) {
        course.education_schedules.sort((a: any, b: any) => new Date(a.start_date).getTime() - new Date(b.start_date).getTime())
      }

      // 파생 상태 계산: 버튼/뱃지 용이하게 open/upcoming/closed 형태로 제공
      const now = new Date()
      const next = course?.education_schedules?.[0]
      let derived = 'closed'
      if (next) {
        const rs = new Date(next.registration_start_date)
        const re = new Date(next.registration_end_date)
        if (now < rs) derived = 'upcoming'
        else if (now >= rs && now <= re) derived = 'open'
        else derived = 'closed'
      } else {
        derived = 'upcoming'
      }

      // 주의: DB의 status(active/inactive/draft)는 그대로 두고,
      // 파생 상태는 computed_status로 별도 제공하여 관리자 수정 시 제약 위반을 방지
      return NextResponse.json({ course: { ...course, computed_status: derived } })
   } catch (error) {
      console.error('API 오류:', error)
      return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
   }
}
