import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { verifyAdminTokenFromRequest } from '@/utils/admin-auth'

// GET: 수강 신청 목록 (관리자)
export async function GET(request: NextRequest) {
  try {
    const { valid } = await verifyAdminTokenFromRequest(request)
    if (!valid) return NextResponse.json({ error: '유효하지 않은 토큰입니다.' }, { status: 401 })

    const { searchParams } = new URL(request.url)
    const page = Math.max(1, parseInt(searchParams.get('page') || '1') || 1)
    const limit = Math.max(1, Math.min(100, parseInt(searchParams.get('limit') || '20') || 20))
    const offset = (page - 1) * limit
    const scheduleId = searchParams.get('scheduleId') || searchParams.get('education_schedule_id')

    let query = supabaseAdmin
      .from('user_education_enrollments')
      .select(
        `
          id,
          user_id,
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
              name,
              category
            )
          )
        `,
        { count: 'exact' }
      )

    if (scheduleId) {
      query = query.eq('education_schedule_id', scheduleId)
    }

    const { data, count, error } = await query
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (error) {
      console.error('수강 신청 목록 조회 오류:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // 사용자 프로필 별도 조회 후 매핑 (user_id -> profiles.id FK 경유)
    const userIds = Array.from(new Set((data || []).map((r: any) => r.user_id))).filter(Boolean)
    let profileMap: Record<string, { name: string | null; phone: string | null }> = {}
    if (userIds.length > 0) {
      const { data: profilesData, error: profilesError } = await supabaseAdmin
        .from('profiles')
        .select('id, name, phone')
        .in('id', userIds)
      if (!profilesError && profilesData) {
        profileMap = profilesData.reduce((acc: any, p: any) => {
          acc[p.id] = { name: p.name || null, phone: p.phone || null }
          return acc
        }, {})
      }
    }

    const enrollments = (data || []).map((row: any) => ({
      id: row.id,
      student_name: profileMap[row.user_id]?.name || '',
      student_email: '',
      student_phone: profileMap[row.user_id]?.phone || null,
      enrollment_status: row.enrollment_status,
      payment_status: row.payment_status,
      enrolled_at: row.created_at,
      education_schedules: row.education_schedules,
    }))

    return NextResponse.json({
      enrollments,
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit),
      },
    })
  } catch (error) {
    console.error('수강 신청 목록 API 오류:', error)
    return NextResponse.json({ error: '서버 오류가 발생했습니다.' }, { status: 500 })
  }
}
