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

      // 검색 필터
      if (search) {
         query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%`)
      }

      // 정렬 및 페이지네이션
      const { data: courses, count, error } = await query.order('start_date', { ascending: true }).range(offset, offset + limit - 1)

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
      const { userId, courseId, applicationData } = body

      if (!userId || !courseId) {
         return NextResponse.json({ error: 'User ID and Course ID are required' }, { status: 400 })
      }

      // 중복 신청 확인
      const { data: existingApplication } = await supabaseAdmin.from('education_applications').select('id').eq('user_id', userId).eq('course_id', courseId).single()

      if (existingApplication) {
         return NextResponse.json({ error: '이미 신청한 교육 과정입니다.' }, { status: 400 })
      }

      // 교육 과정 정보 조회
      const { data: course, error: courseError } = await supabaseAdmin.from('education_courses').select('*').eq('id', courseId).single()

      if (courseError || !course) {
         return NextResponse.json({ error: '교육 과정을 찾을 수 없습니다.' }, { status: 404 })
      }

      // 신청 정원 확인
      if (course.current_students >= course.max_students) {
         return NextResponse.json({ error: '신청 정원이 마감되었습니다.' }, { status: 400 })
      }

      // 사용자 정보 조회
      const { data: profile } = await supabaseAdmin.from('profiles').select('name, phone').eq('id', userId).single()

      // 교육 신청 생성
      const { data: application, error } = await supabaseAdmin
         .from('education_applications')
         .insert({
            user_id: userId,
            course_id: courseId,
            applicant_name: applicationData?.name || profile?.name || '익명',
            applicant_phone: applicationData?.phone || profile?.phone,
            application_status: 'submitted',
            ...applicationData,
         })
         .select()
         .single()

      if (error) {
         console.error('교육 신청 생성 오류:', error)
         return NextResponse.json({ error: error.message }, { status: 500 })
      }

      // 현재 신청 인원 증가
      await supabaseAdmin
         .from('education_courses')
         .update({
            current_students: course.current_students + 1,
         })
         .eq('id', courseId)

      console.log('교육 신청 성공:', application)
      return NextResponse.json({ application })
   } catch (error) {
      console.error('API 오류:', error)
      return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
   }
}
