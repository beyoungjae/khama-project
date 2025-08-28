import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Service Role Key를 사용하여 RLS 우회
const supabaseAdmin = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
   auth: {
      autoRefreshToken: false,
      persistSession: false,
   },
})

// GET: 교육 과정 목록 조회
export async function GET(request: NextRequest) {
   try {
      const { searchParams } = new URL(request.url)
      const page = parseInt(searchParams.get('page') || '1')
      const limit = parseInt(searchParams.get('limit') || '10')
      const category = searchParams.get('category')
      const status = searchParams.get('status') || 'active'
      const search = searchParams.get('search')

      const offset = (page - 1) * limit

      let query = supabaseAdmin.from('education_courses').select('*', { count: 'exact' }).eq('status', status)

      // 카테고리 필터
      if (category && category !== 'all') {
         query = query.eq('category', category)
      }

      // 검색 필터 (name/description)
      if (search) {
         query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%`)
      }

      // 정렬 및 페이지네이션 (courses 테이블에는 start_date가 없으므로 created_at 또는 name으로 정렬)
      const { data: courses, count, error } = await query.order('created_at', { ascending: false }).range(offset, offset + limit - 1)

      if (error) {
         console.error('교육 과정 조회 오류:', error)
         return NextResponse.json({ error: error.message }, { status: 500 })
      }

      // 페이지네이션 정보
      const totalPages = Math.ceil((count || 0) / limit)

      return NextResponse.json({
         courses: courses || [],
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

// POST: 교육 과정 신청
export async function POST(request: NextRequest) {
   try {
      const body = await request.json()
      const { userId, courseId, applicationData } = body as { userId: string; courseId: string; applicationData?: any }

      if (!userId || !courseId) {
         return NextResponse.json({ error: 'User ID and Course ID are required' }, { status: 400 })
      }

      const scheduleId = applicationData?.schedule_id
      if (!scheduleId) {
         return NextResponse.json({ error: '교육 일정이 필요합니다.' }, { status: 400 })
      }

      // 스케줄 확인 (코스 매칭 포함)
      const { data: schedule, error: scheduleError } = await supabaseAdmin
         .from('education_schedules')
         .select('*')
         .eq('id', scheduleId)
         .eq('course_id', courseId)
         .single()

      if (scheduleError || !schedule) {
         return NextResponse.json({ error: '교육 일정을 찾을 수 없습니다.' }, { status: 404 })
      }

      // 등록 가능 상태/정원 확인 (저장된 status가 갱신되지 않았을 수 있으므로 날짜 기준으로도 판정)
      const now = new Date()
      const rs = new Date(schedule.registration_start_date)
      const re = new Date(schedule.registration_end_date)
      const isOpenByDate = now >= rs && now <= re
      const isCancelled = schedule.status === 'cancelled'
      if ((!isOpenByDate && schedule.status !== 'registration_open') || isCancelled) {
         return NextResponse.json({ error: '현재 신청 가능한 상태가 아닙니다.' }, { status: 400 })
      }
      if ((schedule.current_participants || 0) >= schedule.max_participants) {
         return NextResponse.json({ error: '신청 정원이 마감되었습니다.' }, { status: 400 })
      }

      // 중복 신청 확인 (동일 사용자-스케줄)
      const { data: existing } = await supabaseAdmin
         .from('user_education_enrollments')
         .select('id')
         .eq('user_id', userId)
         .eq('education_schedule_id', scheduleId)
         .maybeSingle()

      if (existing) {
         return NextResponse.json({ error: '이미 신청한 교육 일정입니다.' }, { status: 400 })
      }

      // 사용자 기본 정보
      const { data: profile } = await supabaseAdmin.from('profiles').select('name, phone').eq('id', userId).single()

      // 간단한 신청번호 생성 (유니크 충돌 시 재시도)
      const genNumber = () => `ENR-${new Date().toISOString().slice(0,10).replace(/-/g,'')}-${Math.floor(Math.random()*9000+1000)}`
      let enrollmentNumber = genNumber()
      let tries = 0
      let inserted: any = null
      let lastError: any = null
      while (tries < 3 && !inserted) {
         const { data: enrollment, error } = await supabaseAdmin
            .from('user_education_enrollments')
            .insert({
               user_id: userId,
               education_schedule_id: scheduleId,
               enrollment_number: enrollmentNumber,
               enrollment_status: 'pending',
               payment_status: 'pending',
            })
            .select()
            .single()
         if (!error) {
            inserted = enrollment
            break
         }
         lastError = error
         enrollmentNumber = genNumber()
         tries += 1
      }

      if (!inserted) {
         console.error('교육 신청 생성 오류:', lastError)
         return NextResponse.json({ error: '신청 생성 중 오류가 발생했습니다.' }, { status: 500 })
      }

      // 스케줄 현재 인원 증가
      await supabaseAdmin
         .from('education_schedules')
         .update({ current_participants: (schedule.current_participants || 0) + 1 })
         .eq('id', scheduleId)

      return NextResponse.json({ enrollment: inserted })
   } catch (error) {
      console.error('API 오류:', error)
      return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
   }
}
