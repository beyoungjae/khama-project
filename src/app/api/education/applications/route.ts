import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Service Role Key를 사용하여 RLS 우회
const supabaseAdmin = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
   auth: {
      autoRefreshToken: false,
      persistSession: false,
   },
})

// GET: 사용자의 교육 신청 내역 조회
export async function GET(request: NextRequest) {
   try {
      const { searchParams } = new URL(request.url)
      const userId = searchParams.get('userId')
      const page = parseInt(searchParams.get('page') || '1')
      const limit = parseInt(searchParams.get('limit') || '10')
      const status = searchParams.get('status')

      if (!userId) {
         return NextResponse.json({ error: 'User ID is required' }, { status: 400 })
      }

      const offset = (page - 1) * limit

      let query = supabaseAdmin
         .from('user_education_enrollments')
         .select(
            `
            id,
            enrollment_number,
            enrollment_status,
            payment_status,
            created_at,
            education_schedules:education_schedule_id (
               id,
               start_date,
               end_date,
               location,
               education_courses:course_id (
                  id,
                  name,
                  description,
                  category,
                  course_fee
               )
            )
         `,
            { count: 'exact' }
         )
         .eq('user_id', userId)

      // 상태 필터
      if (status && status !== 'all') {
         query = query.eq('application_status', status)
      }

      // 정렬 및 페이지네이션
      const { data: applications, count, error } = await query.order('created_at', { ascending: false }).range(offset, offset + limit - 1)

      if (error) {
         console.error('교육 신청 내역 조회 오류:', error)
         return NextResponse.json({ error: error.message }, { status: 500 })
      }

      // 페이지네이션 정보
      const totalPages = Math.ceil((count || 0) / limit)

      return NextResponse.json({
         applications: applications || [],
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

// PUT: 교육 신청 수정 (취소 등)
export async function PUT(request: NextRequest) {
   try {
      const body = await request.json()
      const { applicationId, userId, updateData } = body

      if (!applicationId || !userId) {
         return NextResponse.json({ error: 'Application ID and User ID are required' }, { status: 400 })
      }

      // 권한 확인
      const { data: application, error: fetchError } = await supabaseAdmin
         .from('user_education_enrollments')
         .select('*, education_schedules:education_schedule_id(current_participants)')
         .eq('id', applicationId)
         .eq('user_id', userId)
         .single()

      if (fetchError || !application) {
         return NextResponse.json({ error: 'Unauthorized or application not found' }, { status: 403 })
      }

      // 취소 처리인 경우 신청 인원 감소
      if (updateData.enrollment_status === 'cancelled' && application.enrollment_status !== 'cancelled') {
         await supabaseAdmin
            .from('education_schedules')
            .update({
               current_participants: Math.max(0, (application.education_schedules?.current_participants || 1) - 1),
            })
            .eq('id', application.education_schedule_id)
      }

      // 신청 정보 업데이트
      const { data: updatedApplication, error } = await supabaseAdmin
         .from('user_education_enrollments')
         .update({
            ...updateData,
            updated_at: new Date().toISOString(),
         })
         .eq('id', applicationId)
         .select()
         .single()

      if (error) {
         console.error('교육 신청 수정 오류:', error)
         return NextResponse.json({ error: error.message }, { status: 500 })
      }

      return NextResponse.json({ application: updatedApplication })
   } catch (error) {
      console.error('API 오류:', error)
      return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
   }
}
